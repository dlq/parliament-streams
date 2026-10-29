"""Malformed generated products must fail before publication."""

from __future__ import annotations

import contextlib
import copy
import io
import json
import shutil
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from typing import cast
from unittest.mock import patch
from xml.etree import ElementTree as ET

from jsonschema import FormatChecker

from parliament_streams import cli
from parliament_streams.catalogue import load_catalogue, load_fallbacks, load_json_object
from parliament_streams.data_contracts import require_json_schema, schema_validator
from parliament_streams.data_products import validate_data_products
from parliament_streams.iptv import write_iptv_exports
from parliament_streams.management import write_json
from parliament_streams.schedule_collection import ScheduleSnapshot, write_snapshot
from parliament_streams.site_data import load_supranational
from tools.validate_data_products import main as validate_products_main

ROOT = Path(__file__).resolve().parents[1]


class DataProductTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.directory = Path(self.temporary.name)
        self.catalogue = load_catalogue()
        self.channel = next(
            c for c in self.catalogue["channels"] if c["id"] == "estonia-riigikogu-live-1"
        )
        self.channel["availability"] = "always_on"  # Controlled playlist fixture.
        self.catalogue["channels"] = [self.channel]
        write_json(self.directory / "channels.json", self.catalogue)
        fallbacks = load_fallbacks()
        fallbacks["fallbacks"] = []
        write_json(self.directory / "fallbacks.json", fallbacks)
        shutil.copyfile(ROOT / "data/supranational.json", self.directory / "supranational.json")
        shutil.copyfile(ROOT / "data/institutions.json", self.directory / "institutions.json")
        counts = {
            field: 0
            for field in load_json_object(ROOT / "schema/schedules.schema.json")["properties"][
                "counts"
            ]["required"]
        }
        counts.update(
            ok=1,
            channels=1,
            upcoming=1,
            events=1,
            events_with_official_id=1,
            events_with_url=1,
            events_with_end=1,
            fresh_channels=1,
        )
        timestamp = "2026-10-25T12:00:00Z"
        event = {
            "id": "fixture",
            "identifier_kind": "official",
            "title": "Budget & scrutiny",
            "start_basis": "source",
            "status": "scheduled",
            "start": "2026-10-25T14:00:00Z",
            "end": "2026-10-25T15:00:00Z",
            "url": "https://example.org/event",
        }
        self.snapshot = cast(
            ScheduleSnapshot,
            {
                "schema_version": 3,
                "generated_at": timestamp,
                "refresh_interval_hours": 6,
                "counts": counts,
                "channels": {
                    self.channel["id"]: {
                        "current_event_title": None,
                        "current_event_time": None,
                        "next_event_title": event["title"],
                        "next_event_time": event["start"],
                        "confidence": "high",
                        "scraper": "estonia-riigikogu-plenary",
                        "source_url": "https://example.org/schedule",
                        "fetched_at": timestamp,
                        "last_success_at": timestamp,
                        "events": [event],
                    }
                },
                "sources": {
                    "estonia-riigikogu-plenary": {
                        "status": "ok",
                        "fetched_at": timestamp,
                        "urls": ["https://example.org/schedule"],
                        "channel_count": 1,
                        "channels_expected": 1,
                        "event_count": 1,
                        "events_with_official_id": 1,
                        "events_with_url": 1,
                        "events_with_end": 1,
                        "outcome_detail": "events",
                        "used_last_good": False,
                        "consecutive_failures": 0,
                    }
                },
            },
        )
        write_snapshot(self.directory / "schedules.json", self.snapshot)
        write_iptv_exports(
            self.catalogue, self.snapshot, self.directory, "https://example.org/epg.xml"
        )
        self.originals = {p.name: p.read_bytes() for p in self.directory.iterdir()}

    def restore(self):
        for name, contents in self.originals.items():
            (self.directory / name).write_bytes(contents)

    def xml(self, edit):
        path = self.directory / "epg.xml"
        root = ET.parse(path).getroot()
        edit(root)
        ET.ElementTree(root).write(path, encoding="utf-8", xml_declaration=True)

    def quality(self, edit):
        path = self.directory / "epg-quality.json"
        report = load_json_object(path)
        edit(report)
        write_json(path, report)

    def playlist(self, edit, name="stable-hls"):
        path = self.directory / f"{name}.m3u"
        text = edit(path.read_text())
        path.write_text(text)
        path.with_suffix(".m3u8").write_text(text)

    def test_complete_product_set_has_matching_ids_and_programmes(self):
        with contextlib.redirect_stdout(io.StringIO()) as output:
            self.assertEqual(validate_products_main(["--data-dir", str(self.directory)]), 0)
        result = json.loads(output.getvalue())
        self.assertEqual(result["programmes"], 1)
        self.assertEqual(result["stable_channels"], 1)
        self.assertEqual(result["validated_channels"], 1)
        self.assertEqual(result["xmltv_channels"], 1)

    def test_fractional_seconds_preserve_valid_ranges_and_exclude_collapsed_ranges(self):
        for end, programmes in (
            ("2026-10-25T15:00:00.875Z", 1),
            ("2026-10-25T14:00:00.875Z", 0),
        ):
            with self.subTest(end=end):
                snapshot = copy.deepcopy(self.snapshot)
                channel = snapshot["channels"][self.channel["id"]]
                event = channel["events"][0]
                event["start"] = "2026-10-25T14:00:00.125Z"
                event["end"] = end
                channel["next_event_time"] = event["start"]
                original = copy.deepcopy(snapshot)
                write_snapshot(self.directory / "schedules.json", snapshot)
                summary = write_iptv_exports(
                    self.catalogue, snapshot, self.directory, "https://example.org/epg.xml"
                )
                self.assertEqual(summary["programmes"], programmes)
                self.assertEqual(validate_data_products(self.directory)["programmes"], programmes)
                self.assertEqual(snapshot, original)
                quality = load_json_object(self.directory / "epg-quality.json")
                self.assertEqual(
                    quality["counts"].get("excluded_nonpositive_duration", 0), 1 - programmes
                )
                if programmes:
                    programme = ET.parse(self.directory / "epg.xml").find("programme")
                    self.assertEqual(programme.get("start"), "20261025140000 +0000")
                    self.assertEqual(programme.get("stop"), "20261025150000 +0000")

    def test_schedule_audit_cli_rejects_malformed_quality_before_replacing_output(self):
        output = self.directory / "audit.json"
        arguments = [
            "--catalogue",
            str(self.directory / "channels.json"),
            "schedules-audit",
            "--schedules",
            str(self.directory / "schedules.json"),
            "--output",
            str(output),
        ]
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(cli.main(arguments), 0)
        original = output.read_bytes()
        malformed = load_json_object(output)
        malformed["generated_at"] = "not-a-timestamp"
        with (
            patch(
                "parliament_streams.cli.assess_schedules",
                return_value=SimpleNamespace(report=malformed),
            ),
            contextlib.redirect_stderr(io.StringIO()),
        ):
            self.assertEqual(cli.main(arguments), 2)
        self.assertEqual(output.read_bytes(), original)

    def test_xmltv_rejects_corruption_unknown_channels_times_and_overlaps(self):
        defects = {
            "invalid_xml": lambda: (self.directory / "epg.xml").write_text("<tv>"),
            "doctype": lambda: (self.directory / "epg.xml").write_text("<!DOCTYPE tv><tv/>"),
            "utf16_doctype": lambda: (self.directory / "epg.xml").write_bytes(
                '<!DOCTYPE tv [<!ENTITY x "unused">]><tv/>'.encode("utf-16")
            ),
            "utf16_no_bom": lambda: (self.directory / "epg.xml").write_bytes(
                "<!DOCTYPE tv><tv/>".encode("utf-16-le")
            ),
            "wrong_declared_encoding": lambda: (self.directory / "epg.xml").write_bytes(
                b'\xef\xbb\xbf<?xml version="1.0" encoding="utf-16"?><tv/>'
            ),
            "wrong_root": lambda: self.xml(lambda r: setattr(r, "tag", "other")),
            "unknown_element": lambda: self.xml(lambda r: ET.SubElement(r, "unexpected")),
            "duplicate_channel": lambda: self.xml(
                lambda r: r.append(copy.deepcopy(r.find("channel")))
            ),
            "missing_channel": lambda: self.xml(lambda r: r.remove(r.find("channel"))),
            "empty_display_name": lambda: self.xml(
                lambda r: setattr(r.find("channel/display-name"), "text", "")
            ),
            "unknown_programme_channel": lambda: self.xml(
                lambda r: r.find("programme").set("channel", "unknown")
            ),
            "empty_title": lambda: self.xml(
                lambda r: setattr(r.find("programme/title"), "text", "")
            ),
            "unrelated_title": lambda: self.xml(
                lambda r: setattr(r.find("programme/title"), "text", "Different proceedings")
            ),
            "unrelated_time": lambda: self.xml(
                lambda r: r.find("programme").set("start", "20261025143000 +0000")
            ),
            "missing_offset": lambda: self.xml(
                lambda r: r.find("programme").set("start", "20261025140000")
            ),
            "nonpositive_duration": lambda: self.xml(
                lambda r: r.find("programme").set("stop", r.find("programme").get("start"))
            ),
            "overlap": lambda: self.xml(lambda r: r.append(copy.deepcopy(r.find("programme")))),
        }
        for defect, edit in defects.items():
            with self.subTest(defect=defect):
                self.restore()
                edit()
                with self.assertRaises(ValueError):
                    validate_data_products(self.directory)

    def test_playlists_reject_corruption_alias_drift_and_cross_product_mismatches(self):
        defects = {
            "header": lambda: self.playlist(lambda s: s.replace("#EXTM3U", "#EXTINF")),
            "missing_newline": lambda: self.playlist(lambda s: s.rstrip()),
            "orphan_metadata": lambda: self.playlist(
                lambda s: "\n".join(s.splitlines()[:-1]) + "\n"
            ),
            "duplicate_source": lambda: self.playlist(
                lambda s: s + "\n".join(s.splitlines()[1:]) + "\n"
            ),
            "bad_guide_url": lambda: self.playlist(
                lambda s: s.replace("https://example.org/epg.xml", "not-a-url")
            ),
            "bad_stream_url": lambda: self.playlist(
                lambda s: s.replace(self.channel["playback_url"], "http:///missing-host")
            ),
            "changed_stream": lambda: self.playlist(
                lambda s: s.replace(self.channel["playback_url"], "https://example.org/other.m3u8")
            ),
            "missing_stable_source": lambda: self.playlist(lambda s: s.splitlines()[0] + "\n"),
            "missing_broader_source": lambda: self.playlist(
                lambda s: s.splitlines()[0] + "\n", "validated-hls"
            ),
            "different_guide": lambda: self.playlist(
                lambda s: s.replace("/epg.xml", "/other.xml"), "validated-hls"
            ),
            "alias_drift": lambda: (self.directory / "stable-hls.m3u8").write_text("stale\n"),
        }
        for defect, edit in defects.items():
            with self.subTest(defect=defect):
                self.restore()
                edit()
                with self.assertRaises(ValueError):
                    validate_data_products(self.directory)

    def test_quality_counts_mapping_and_source_snapshots_must_agree(self):
        defects = {
            "timestamp": lambda r: r.update(generated_at="2026-10-24T12:00:00Z"),
            "missing_channel": lambda r: r.update(channels={}),
            "programme_count": lambda r: r["channels"][self.channel["id"]].update(exportable=0),
            "unmapped": lambda r: r["channels"][self.channel["id"]].update(
                linear_guide_eligible=False
            ),
            "source_event_count": lambda r: r["channels"][self.channel["id"]].update(events=2),
            "total_exportable": lambda r: r["counts"].update(exportable=2),
            "total_events": lambda r: r["counts"].update(events=2),
            "total_excluded": lambda r: r["counts"].update(excluded=2),
            "channels_with_events": lambda r: r["counts"].update(channels_with_events=0),
        }
        for defect, edit in defects.items():
            with self.subTest(defect=defect):
                self.restore()
                self.quality(edit)
                with self.assertRaises(ValueError):
                    validate_data_products(self.directory)
        self.restore()
        self.snapshot["counts"]["events"] = 0
        write_snapshot(self.directory / "schedules.json", self.snapshot)
        with self.assertRaisesRegex(ValueError, "Schedule counters"):
            validate_data_products(self.directory)
        with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit) as error:
            validate_products_main(["--data-dir", str(self.directory)])
        self.assertEqual(error.exception.code, 2)

    def test_schema_formats_are_enforced_with_international_urls(self):
        validator = schema_validator({"type": "string", "format": "iri"})
        self.assertTrue(validator.is_valid("https://assembly.example/国会?session=1"))
        self.assertFalse(validator.is_valid("https://example.org/a b"))
        with self.assertRaises(ValueError):
            require_json_schema({"schema_version": 3}, "schedules.schema.json", label="fixture")
        with (
            patch.object(FormatChecker, "checkers", {}),
            self.assertRaisesRegex(ValueError, "format validators unavailable"),
        ):
            schema_validator({"properties": {"url": {"format": "iri"}}})

    def test_scraper_identities_and_reviewed_mapping_are_independent_of_quality_claims(self):
        self.quality(lambda r: r["channels"][self.channel["id"]].update(source="different-source"))
        with self.assertRaisesRegex(ValueError, "feed mapping"):
            validate_data_products(self.directory)
        self.restore()
        snapshot = copy.deepcopy(self.snapshot)
        snapshot["channels"][self.channel["id"]]["scraper"] = "missing-source"
        write_snapshot(self.directory / "schedules.json", snapshot)
        with self.assertRaisesRegex(ValueError, "unrecorded source"):
            validate_data_products(self.directory)
        snapshot["channels"][self.channel["id"]]["scraper"] = "uk-parliament"
        snapshot["sources"]["uk-parliament"] = snapshot["sources"].pop("estonia-riigikogu-plenary")
        write_snapshot(self.directory / "schedules.json", snapshot)
        self.quality(lambda r: r["channels"][self.channel["id"]].update(source="uk-parliament"))
        with self.assertRaisesRegex(ValueError, "feed mapping"):
            validate_data_products(self.directory)

    def test_public_inventory_schema_is_enforced(self):
        write_json(self.directory / "institutions.json", {"records": []})
        with self.assertRaisesRegex(ValueError, "public legislature inventory"):
            validate_data_products(self.directory)

    def test_supranational_schema_and_unique_ids_are_enforced(self):
        path = self.directory / "supranational.json"
        data = load_json_object(path)
        data["organizations"].append(copy.deepcopy(data["organizations"][0]))
        write_json(path, data)
        with self.assertRaisesRegex(ValueError, "IDs must be unique"):
            load_supranational(path)
