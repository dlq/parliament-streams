import copy
import json
import unittest
from datetime import UTC, datetime
from pathlib import Path
from typing import cast
from xml.etree import ElementTree as ET

from parliament_streams.catalogue import load_catalogue
from parliament_streams.iptv import render_xmltv
from parliament_streams.schedule_collection import ScheduleSnapshot
from parliament_streams.schedule_quality import assess_schedules
from parliament_streams.scrapers import brazil_tv_camara, cpac, ebs, european_parliament

ROOT = Path(__file__).resolve().parents[1]


class ScheduleQualityTests(unittest.TestCase):
    def setUp(self):
        self.catalogue = load_catalogue(ROOT / "data/channels.json")
        self.event = {
            "id": "one",
            "title": "Debate",
            "status": "scheduled",
            "start": "2026-10-14T12:00:00Z",
            "end": "2026-10-14T13:00:00Z",
        }

    def snapshot(self, source, channel, events):
        return cast(
            ScheduleSnapshot,
            {
                "generated_at": "2026-10-14T11:00:00Z",
                "channels": {channel: {"scraper": source, "events": events}},
            },
        )

    def test_european_parallel_events_remain_on_website_but_not_xmltv(self):
        payload = json.dumps(
            {
                "pageProps": {
                    "mediaItems": [
                        {
                            "title": "Committee A",
                            "room": "Room A",
                            "EventDateStart": self.event["start"],
                            "EventDateEnd": self.event["end"],
                        },
                        {
                            "title": "Committee B",
                            "room": "Room B",
                            "EventDateStart": self.event["start"],
                            "EventDateEnd": self.event["end"],
                        },
                    ]
                }
            }
        )
        parsed = european_parliament.parse(payload, datetime(2026, 10, 14, 11, tzinfo=UTC))
        channel = "european-parliament-multimedia-centre"
        self.assertEqual(len(parsed[channel]["events"]), 2)
        snapshot = self.snapshot("europarl-webstreaming", channel, parsed[channel]["events"])
        original = copy.deepcopy(snapshot)
        report = assess_schedules(self.catalogue, snapshot).report
        self.assertEqual(report["channels"][channel]["scope"], "event_directory")
        self.assertEqual(report["channels"][channel]["overlap_pairs"], 1)
        xml, exported, skipped = render_xmltv(self.catalogue, snapshot)
        self.assertEqual((exported, skipped), (0, 2))
        self.assertNotIn(channel, {c.attrib["id"] for c in ET.fromstring(xml).findall("channel")})
        self.assertEqual(snapshot, original)

    def test_unknown_and_incorrect_channel_mappings_fail_closed(self):
        for source, channel in [
            ("new-source", "brazil-tv-camara"),
            ("cpac", "brazil-tv-camara"),
            ("cpac", "not-catalogued"),
        ]:
            assessment = assess_schedules(
                self.catalogue, self.snapshot(source, channel, [self.event])
            )
            self.assertEqual(assessment.report["counts"]["exportable"], 0)
            self.assertEqual(assessment.report["counts"]["excluded_unverified_channel_mapping"], 1)

    def test_overlap_cluster_quarantines_every_conflict_but_keeps_adjacent_events(self):
        events = [
            self.event,
            {
                **self.event,
                "id": "two",
                "start": "2026-10-14T12:30:00Z",
                "end": "2026-10-14T14:00:00Z",
            },
            {
                **self.event,
                "id": "three",
                "start": "2026-10-14T13:30:00Z",
                "end": "2026-10-14T15:00:00Z",
            },
            {
                **self.event,
                "id": "four",
                "start": "2026-10-14T15:00:00Z",
                "end": "2026-10-14T16:00:00Z",
            },
        ]
        for order in [events, list(reversed(events))]:
            result = assess_schedules(self.catalogue, self.snapshot("cpac", "cpac-ca", order))
            row = result.report["channels"]["cpac-ca"]
            self.assertEqual(row["overlap_pairs"], 2)
            self.assertEqual(row["exclusions"]["overlapping_programme"], 3)
            self.assertEqual([e["id"] for e in result.approved["cpac-ca"]], ["four"])

    def test_time_defects_duplicates_cancellation_and_empty_titles(self):
        events = [
            self.event,
            {**self.event, "id": "same-content"},
            {**self.event, "id": "bad", "end": "2026-10-14T11:00:00Z"},
            {**self.event, "id": "naive", "start": "2026-10-14T12:00:00"},
            {**self.event, "id": "bad-format", "start": "not-a-date"},
            {**self.event, "id": "missing", "end": ""},
            {**self.event, "id": "cancelled", "status": "cancelled"},
            {
                **self.event,
                "id": "empty",
                "title": " ",
                "start": "2026-10-14T17:00:00Z",
                "end": "2026-10-14T18:00:00Z",
            },
        ]
        result = assess_schedules(self.catalogue, self.snapshot("cpac", "cpac-ca", events))
        self.assertEqual(result.report["counts"]["exportable"], 1)
        counts = result.report["channels"]["cpac-ca"]["exclusions"]
        self.assertEqual(counts["invalid_timestamp"], 2)
        self.assertEqual(counts["nonpositive_duration"], 1)
        self.assertEqual(counts["missing_time_range"], 1)
        duplicate_ids = [
            self.event,
            {**self.event, "start": "2026-10-14T19:00:00Z", "end": "2026-10-14T20:00:00Z"},
        ]
        result = assess_schedules(self.catalogue, self.snapshot("cpac", "cpac-ca", duplicate_ids))
        self.assertEqual(result.report["counts"]["excluded_duplicate_id"], 2)

    def test_ebs_unknown_duration_is_not_zero_length_or_live(self):
        for duration in [None, 0, -2, "unknown"]:
            payload = json.dumps(
                [
                    {
                        "programs": [
                            {
                                "startDatetime": "2026-10-14T12:00:00Z",
                                "duration": duration,
                                "titles": [{"language": "EN", "content": "Briefing"}],
                            }
                        ]
                    }
                ]
            )
            schedule = ebs.parse(payload, datetime(2026, 10, 14, 11, tzinfo=UTC))[
                "eu-audiovisual-ebs"
            ]
            self.assertNotIn("end", schedule["events"][0])
            self.assertEqual(schedule["events"][0]["status"], "scheduled")
            report = assess_schedules(
                self.catalogue, self.snapshot("ebs-grid", "eu-audiovisual-ebs", schedule["events"])
            ).report
            self.assertEqual(report["counts"]["excluded_missing_time_range"], 1)

    def test_inferred_times_are_preserved_and_disclosed(self):
        html = (
            '<div class="tab-pane active">'
            "<tr><td><span>09:00</span></td><td><span>Debate</span></td></tr>"
            "<tr><td><span>10:00</span></td><td><span>Next</span></td></tr></div>"
        )
        schedule = brazil_tv_camara.parse(html, datetime(2026, 10, 14, 11, tzinfo=UTC))[
            "brazil-tv-camara"
        ]
        event = schedule["events"][0]
        self.assertEqual(event["start_basis"], "collection_date")
        self.assertEqual(event["end_basis"], "next_listing_start")
        snapshot = self.snapshot("brazil-tv-camara", "brazil-tv-camara", [event])
        xml, count, _ = render_xmltv(self.catalogue, snapshot)
        self.assertEqual(count, 1)
        description = ET.fromstring(xml).findtext("programme/desc")
        self.assertIn("assumed", description)
        self.assertIn("inferred", description)
        cpac_html = (
            '<div data-airdate="2026-10-14T12:00:00Z">'
            '<button class="schedule-item-btn">Debate</button></div>'
            '<div data-airdate="2026-10-14T13:00:00Z">'
            '<button class="schedule-item-btn">Next</button></div>'
        )
        event = cpac.parse(cpac_html, datetime(2026, 10, 14, 11, tzinfo=UTC))["cpac-ca"]["events"][
            0
        ]
        self.assertEqual(event["start_basis"], "source")
        self.assertEqual(event["end_basis"], "next_listing_start")
