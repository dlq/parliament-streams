"""Guide availability must describe the catalogue, not merely XMLTV definitions."""

from __future__ import annotations

import copy
import json
import shutil
import tempfile
import unittest
from datetime import UTC, datetime
from pathlib import Path
from typing import cast
from unittest.mock import patch
from xml.etree import ElementTree as ET

from parliament_streams.catalogue import load_catalogue, load_fallbacks, load_json_object
from parliament_streams.data_contracts import require_json_schema
from parliament_streams.data_products import validate_data_products
from parliament_streams.iptv import render_xmltv, write_iptv_exports
from parliament_streams.management import write_json
from parliament_streams.schedule_collection import (
    ScheduleSnapshot,
    collect_schedules,
    write_snapshot,
)
from parliament_streams.schedule_quality import assess_schedules, guide_coverage
from parliament_streams.scrapers import cpac

ROOT = Path(__file__).resolve().parents[1]


class EpgCoverageTests(unittest.TestCase):
    def setUp(self):
        self.catalogue = load_catalogue()
        channels = {channel["id"]: channel for channel in self.catalogue["channels"]}
        selected = [
            "cpac-ca",
            "brazil-tv-senado-official",
            "eu-audiovisual-ebs",
            "italy-senate",
            "netherlands-tweede-kamer",
            "european-parliament-multimedia-centre",
        ]
        missing_parser = copy.deepcopy(channels["eu-audiovisual-ebs"])
        missing_parser["id"] = "coverage-no-parser"
        missing_parser["epg_sources"] = [
            {
                "scraper": "planned",
                "scraper_status": "planned",
                "url": "https://example.org/planned-schedule",
                "method": "GET",
                "kind": "planned",
            }
        ]
        self.catalogue["channels"] = [channels[channel_id] for channel_id in selected] + [
            missing_parser
        ]
        self.event = {
            "id": "broadcast",
            "identifier_kind": "official",
            "title": "Budget scrutiny",
            "status": "scheduled",
            "start": "2026-10-25T14:00:00Z",
            "end": "2026-10-25T15:00:00Z",
        }
        incomplete = {key: value for key, value in self.event.items() if key != "end"}
        self.snapshot = cast(
            ScheduleSnapshot,
            {
                "generated_at": "2026-10-25T12:00:00Z",
                "channels": {
                    "cpac-ca": {"scraper": "cpac", "events": [self.event]},
                    "brazil-tv-senado-official": {
                        "scraper": "brazil-tv-senado-grid",
                        "events": [incomplete],
                    },
                    "european-parliament-multimedia-centre": {
                        "scraper": "europarl-webstreaming",
                        "events": [self.event, {**self.event, "id": "parallel-room"}],
                    },
                },
                "sources": {
                    "cpac": {"status": "ok"},
                    "brazil-tv-senado-grid": {"status": "ok"},
                    "europarl-webstreaming": {"status": "ok"},
                    "ebs-grid": {"status": "empty"},
                    "italian-senate-palimpsest": {"status": "error"},
                },
            },
        )

    def test_every_catalogue_entry_has_a_state_and_exact_coverage_counts(self):
        report = assess_schedules(self.catalogue, self.snapshot).report
        coverage = report["coverage"]
        self.assertEqual(
            {channel_id: row["state"] for channel_id, row in coverage["channels"].items()},
            {
                "coverage-no-parser": "parser_planned",
                "netherlands-tweede-kamer": "not_collected",
                "eu-audiovisual-ebs": "empty",
                "italy-senate": "collection_error",
                "european-parliament-multimedia-centre": "mapping_unverified",
                "brazil-tv-senado-official": "quality_hold",
                "cpac-ca": "guide_available",
            },
        )
        self.assertEqual(
            coverage["counts"],
            {
                "catalogue_sources": 7,
                "channels_with_parser": 6,
                "channels_with_reviewed_mapping": 5,
                "channels_with_events": 3,
                "channels_with_programmes": 1,
            },
        )
        self.assertEqual(report["counts"]["events"], 4)
        self.assertEqual(report["counts"]["exportable"], 1)
        self.assertEqual(coverage["channels"]["coverage-no-parser"]["parser_ids"], [])
        self.assertEqual(
            coverage["channels"]["european-parliament-multimedia-centre"]["reviewed_parser_ids"],
            [],
        )
        self.assertEqual(coverage["channels"]["cpac-ca"]["reviewed_parser_ids"], ["cpac"])
        self.assertEqual(set(report["channels"]), set(self.snapshot["channels"]))

    def test_xmltv_channel_definitions_do_not_claim_populated_programme_coverage(self):
        assessment = assess_schedules(self.catalogue, self.snapshot)
        xml, programmes, _ = render_xmltv(self.catalogue, self.snapshot, assessment)
        root = ET.fromstring(xml)
        definitions = {channel.attrib["id"] for channel in root.findall("channel")}
        self.assertEqual(
            definitions,
            {
                "cpac-ca",
                "brazil-tv-senado-official",
                "eu-audiovisual-ebs",
                "italy-senate",
                "netherlands-tweede-kamer",
            },
        )
        self.assertEqual(programmes, 1)
        self.assertEqual({p.attrib["channel"] for p in root.findall("programme")}, {"cpac-ca"})
        self.assertEqual(assessment.report["coverage"]["counts"]["channels_with_programmes"], 1)

    def test_empty_collection_and_retained_programmes_remain_distinguishable(self):
        for status in ("ok", "empty"):
            with self.subTest(status=status):
                self.snapshot["sources"]["ebs-grid"]["status"] = status
                coverage = assess_schedules(self.catalogue, self.snapshot).report["coverage"]
                self.assertEqual(coverage["channels"]["eu-audiovisual-ebs"]["state"], "empty")
        self.snapshot["sources"]["cpac"]["status"] = "error"
        self.snapshot["channels"]["cpac-ca"]["stale"] = True
        self.snapshot["sources"]["brazil-tv-senado-grid"]["status"] = "error"
        self.snapshot["channels"]["brazil-tv-senado-official"]["stale"] = True
        report = assess_schedules(self.catalogue, self.snapshot).report
        coverage = report["coverage"]["channels"]
        self.assertEqual(coverage["cpac-ca"]["state"], "guide_available")
        self.assertEqual(coverage["brazil-tv-senado-official"]["state"], "quality_hold")
        self.assertTrue(report["channels"]["cpac-ca"]["stale"])
        self.assertTrue(report["channels"]["brazil-tv-senado-official"]["stale"])

    def test_coverage_counts_uncollected_catalogue_entries_without_mutating_inputs(self):
        empty = cast(ScheduleSnapshot, {"channels": {}, "sources": {}})
        original = copy.deepcopy(self.catalogue)
        coverage = guide_coverage(self.catalogue, empty, {})
        self.assertEqual(
            coverage["counts"],
            {
                "catalogue_sources": 7,
                "channels_with_parser": 6,
                "channels_with_reviewed_mapping": 5,
                "channels_with_events": 0,
                "channels_with_programmes": 0,
            },
        )
        self.assertEqual(coverage["channels"]["cpac-ca"]["state"], "not_collected")
        self.assertEqual(self.catalogue, original)

    def test_quality_schema_validates_coverage_but_accepts_legacy_omission(self):
        report = assess_schedules(self.catalogue, self.snapshot).report
        require_json_schema(report, "epg-quality.schema.json", label="fixture")
        for corrupt in ("negative_count", "unknown_state", "missing_field"):
            with self.subTest(corrupt=corrupt):
                invalid = copy.deepcopy(report)
                if corrupt == "negative_count":
                    invalid["coverage"]["counts"]["channels_with_programmes"] = -1
                elif corrupt == "unknown_state":
                    invalid["coverage"]["channels"]["cpac-ca"]["state"] = "has_channel_definition"
                else:
                    del invalid["coverage"]["channels"]["cpac-ca"]["reviewed_parser_ids"]
                with self.assertRaisesRegex(ValueError, "Invalid fixture"):
                    require_json_schema(invalid, "epg-quality.schema.json", label="fixture")
        del report["coverage"]
        require_json_schema(report, "epg-quality.schema.json", label="legacy fixture")


class EpgCoveragePublicationTests(unittest.TestCase):
    def test_exported_coverage_is_cross_checked_and_old_snapshots_remain_readable(self):
        catalogue = load_catalogue()
        catalogue["channels"] = [
            channel
            for channel in catalogue["channels"]
            if channel["id"] in {"cpac-ca", "eu-audiovisual-ebs"}
        ]
        payload = """
            <div data-airdate="2026-10-25T14:00:00Z">
              <button class="schedule-item-btn">Budget scrutiny</button>
            </div>
            <div data-airdate="2026-10-25T15:00:00Z">
              <button class="schedule-item-btn">Following programme</button>
            </div>
        """
        with patch("parliament_streams.schedule_collection.SCRAPERS", {"cpac": cpac}):
            snapshot = collect_schedules(
                now=datetime(2026, 10, 25, 12, tzinfo=UTC), fetcher=lambda *_args: payload
            )
        with tempfile.TemporaryDirectory() as temporary:
            directory = Path(temporary)
            write_json(directory / "channels.json", catalogue)
            fallbacks = load_fallbacks()
            fallbacks["fallbacks"] = []
            write_json(directory / "fallbacks.json", fallbacks)
            shutil.copyfile(ROOT / "data/supranational.json", directory / "supranational.json")
            shutil.copyfile(ROOT / "data/institutions.json", directory / "institutions.json")
            write_snapshot(directory / "schedules.json", snapshot)
            write_iptv_exports(catalogue, snapshot, directory, "https://example.org/epg.xml")
            result = validate_data_products(directory)
            self.assertEqual(result["xmltv_channels"], 2)
            self.assertEqual(result["programmes"], 1)
            quality_path = directory / "epg-quality.json"
            report = load_json_object(quality_path)
            self.assertEqual(report["coverage"]["counts"]["channels_with_programmes"], 1)
            for corruption in ("wrong_count", "false_availability", "omitted_catalogue_entry"):
                with self.subTest(corruption=corruption):
                    invalid = copy.deepcopy(report)
                    if corruption == "wrong_count":
                        invalid["coverage"]["counts"]["channels_with_programmes"] = 2
                    elif corruption == "false_availability":
                        invalid["coverage"]["channels"]["eu-audiovisual-ebs"]["state"] = (
                            "guide_available"
                        )
                    else:
                        del invalid["coverage"]["channels"]["eu-audiovisual-ebs"]
                    require_json_schema(invalid, "epg-quality.schema.json", label="schema-valid")
                    write_json(quality_path, invalid)
                    with self.assertRaisesRegex(ValueError, "EPG coverage differs"):
                        validate_data_products(directory)
            del report["coverage"]
            quality_path.write_text(json.dumps(report), encoding="utf-8")
            self.assertEqual(validate_data_products(directory)["programmes"], 1)


if __name__ == "__main__":
    unittest.main()
