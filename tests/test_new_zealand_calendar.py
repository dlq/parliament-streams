"""House-calendar API times, empty states and non-JSON loading-shell errors."""

import json
import unittest
from datetime import UTC, datetime
from pathlib import Path
from unittest.mock import patch
from urllib.parse import parse_qs, urlparse

from parliament_streams.schedule_collection import collect_schedules
from parliament_streams.schedule_quality import assess_schedules
from parliament_streams.scrapers import new_zealand_parliament as nz

# Minimal observed structure; serialized framework parameters are deliberately omitted.
LOADING_SHELL = """
    <main id="main"><div class="spinner-container">Loading</div></main>
    <!--Blazor-WebAssembly--><script src="_framework/blazor.web.js"></script>
"""


class NewZealandCalendarShapeTests(unittest.TestCase):
    def setUp(self):
        # The source-local date is already Monday, 26 October in Auckland.
        self.now = datetime(2026, 10, 25, 21, tzinfo=UTC)

    def test_observed_loading_shell_reports_collection_error_instead_of_empty(self):
        with patch("parliament_streams.schedule_collection.SCRAPERS", {nz.SOURCE["id"]: nz}):
            snapshot = collect_schedules(now=self.now, fetcher=lambda *_args: LOADING_SHELL)
        self.assertEqual(snapshot["sources"][nz.SOURCE["id"]]["status"], "error")
        self.assertIn(
            "unrendered Blazor loading shell", snapshot["sources"][nz.SOURCE["id"]]["error"]
        )
        self.assertEqual(snapshot["counts"]["error"], 1)
        self.assertEqual(snapshot["counts"]["empty"], 0)
        self.assertEqual(snapshot["channels"], {})

    def test_calendar_heading_alone_does_not_make_a_loading_shell_valid(self):
        with self.assertRaisesRegex(ValueError, "unrendered Blazor loading shell"):
            nz.parse("<h1>Parliament Calendar</h1>" + LOADING_SHELL, now=self.now)


class NewZealandHouseApiTests(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 10, 26, 0, tzinfo=UTC)
        # Sanitized schema from an observed official House row; dates vary by test.
        self.row = {
            "id": "8bbb5b65-e0ce-44aa-4e94-08de3dc4750a",
            "date": "2026-10-27T00:00:00",
            "title": "Parliament is meeting",
            "description": "02:00 PM - 10:00 PM (Normal)",
            "start": "14:00:00",
            "end": "22:00:00",
            "meetingType": 2,
        }

    def parse(self, rows=None, now=None):
        return nz.parse(json.dumps([self.row] if rows is None else rows), now=now or self.now)

    def collect(self, payload):
        with patch("parliament_streams.schedule_collection.SCRAPERS", {nz.SOURCE["id"]: nz}):
            return collect_schedules(now=self.now, fetcher=lambda *_args: payload)

    def test_requests_use_auckland_date_and_a_bounded_house_only_api_window(self):
        request = nz.request_specs(datetime(2026, 10, 25, 21, tzinfo=UTC))[0]
        self.assertEqual(urlparse(request["url"]).path, "/api/opendata/calendar/housesitting")
        self.assertEqual(
            parse_qs(urlparse(request["url"]).query),
            {"startDate": ["2026-10-25"], "endDate": ["2026-11-09"]},
        )
        self.assertEqual(request["headers"], {"Accept": "application/json"})

    def test_explicit_source_times_and_uuid_are_normalized_without_broadcast_claims(self):
        schedule = self.parse()[nz.CHANNEL_ID]
        event = schedule["events"][0]
        self.assertEqual(event["id"], self.row["id"])
        self.assertEqual(event["identifier_kind"], "official")
        self.assertEqual(event["start"], "2026-10-27T01:00:00Z")
        self.assertEqual(event["end"], "2026-10-27T09:00:00Z")
        self.assertEqual(event["source_timezone"], "Pacific/Auckland")
        self.assertEqual(event["end_basis"], "source")
        self.assertEqual(event["url"], nz.CALENDAR_URL)
        self.assertEqual(event["location"], "House of Representatives")
        self.assertNotIn("language", event)
        self.assertIsNone(schedule["current_event_title"])
        self.assertEqual(schedule["next_event_title"], "Parliament is meeting")

    def test_winter_source_clock_uses_standard_time(self):
        self.row["date"] = "2026-06-09T00:00:00"
        event = self.parse(now=datetime(2026, 6, 8, tzinfo=UTC))[nz.CHANNEL_ID]["events"][0]
        self.assertEqual(event["start"], "2026-06-09T02:00:00Z")

    def test_empty_array_is_a_healthy_empty_collection_with_dated_request_provenance(self):
        snapshot = self.collect("[]")
        source = snapshot["sources"][nz.SOURCE["id"]]
        self.assertEqual(source["status"], "empty")
        self.assertEqual(snapshot["counts"]["empty"], 1)
        self.assertEqual(snapshot["counts"]["error"], 0)
        self.assertIn("startDate=2026-10-25", source["urls"][0])
        self.assertEqual(snapshot["channels"], {})

    def test_non_json_api_shell_and_generic_html_are_errors_not_empty(self):
        for payload, message in (
            (LOADING_SHELL, "unrendered Blazor loading shell"),
            ("<h1>Temporarily unavailable</h1>", "non-JSON content"),
            ("{}", "requires an event array"),
            ("null", "requires an event array"),
            ('"[]"', "requires an event array"),
        ):
            with self.subTest(payload=payload):
                snapshot = self.collect(payload)
                self.assertEqual(snapshot["sources"][nz.SOURCE["id"]]["status"], "error")
                self.assertIn(message, snapshot["sources"][nz.SOURCE["id"]]["error"])

    def test_committees_cannot_become_house_sittings(self):
        self.row["meetingType"] = 1
        self.row["title"] = "Privileges Committee"
        with self.assertRaisesRegex(ValueError, "non-House event"):
            self.parse()

    def test_missing_ends_stay_unknown(self):
        self.row["end"] = None
        event = self.parse()[nz.CHANNEL_ID]["events"][0]
        self.assertNotIn("end", event)
        self.assertNotIn("end_basis", event)

    def test_current_only_interval_remains_available_without_a_later_sitting(self):
        schedule = self.parse(now=datetime(2026, 10, 27, 2, tzinfo=UTC))[nz.CHANNEL_ID]
        self.assertEqual(schedule["current_event_title"], self.row["title"])
        self.assertIsNone(schedule["next_event_title"])
        self.assertEqual(len(schedule["events"]), 1)

    def test_exact_start_with_unknown_end_is_upcoming_not_assumed_live(self):
        self.row["end"] = None
        schedule = self.parse(now=datetime(2026, 10, 27, 1, tzinfo=UTC))[nz.CHANNEL_ID]
        self.assertIsNone(schedule["current_event_title"])
        self.assertEqual(schedule["next_event_title"], self.row["title"])
        self.assertEqual(schedule["events"][0]["status"], "scheduled")

    def test_ended_intervals_do_not_become_current_at_the_exact_end(self):
        self.assertEqual(self.parse(now=datetime(2026, 10, 27, 9, tzinfo=UTC)), {})

    def test_duplicate_rows_are_deduplicated_but_conflicting_identity_is_rejected(self):
        self.assertEqual(len(self.parse([self.row, dict(self.row)])[nz.CHANNEL_ID]["events"]), 1)
        with self.assertRaisesRegex(ValueError, "conflicting event identity"):
            self.parse([self.row, {**self.row, "title": "Different sitting"}])

    def test_missing_or_malformed_required_fields_are_not_midnight_placeholders(self):
        for change in (
            {"id": "invalid"},
            {"date": "2026-10-27T12:00:00"},
            {"date": "2026-02-30T00:00:00"},
            {"date": "2025-10-27T00:00:00"},
            {"title": " "},
            {"title": "<b></b>"},
            {"start": None},
            {"start": "25:00:00"},
            {"start": "2pm"},
            {"end": "13:00:00"},
        ):
            with self.subTest(change=change), self.assertRaises(ValueError):
                self.parse([{**self.row, **change}])

    def test_ambiguous_or_missing_auckland_dst_clocks_are_rejected(self):
        for day, now in (
            ("2026-04-05", datetime(2026, 4, 4, 12, tzinfo=UTC)),
            ("2026-09-27", datetime(2026, 9, 26, 12, tzinfo=UTC)),
        ):
            with (
                self.subTest(day=day),
                self.assertRaisesRegex(ValueError, "ambiguous or nonexistent"),
            ):
                self.parse([{**self.row, "date": day + "T00:00:00", "start": "02:30:00"}], now=now)

    def test_complete_institutional_intervals_do_not_automatically_enter_xmltv(self):
        snapshot = self.collect(json.dumps([self.row]))
        catalogue = json.loads((Path(__file__).parents[1] / "data/channels.json").read_text())
        assessment = assess_schedules(catalogue, snapshot)
        row = assessment.report["channels"][nz.CHANNEL_ID]
        self.assertEqual(row["scope"], "institutional_agenda")
        self.assertEqual(row["events"], 1)
        self.assertEqual(row["exportable"], 0)
        self.assertEqual(row["exclusions"], {"unverified_channel_mapping": 1})


if __name__ == "__main__":
    unittest.main()
