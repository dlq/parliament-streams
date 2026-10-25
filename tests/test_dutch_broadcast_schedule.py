import copy
import json
import unittest
from datetime import UTC, datetime

from parliament_streams.scrapers import dutch_debat_direct as dutch
from parliament_streams.scrapers.common import format_utc_timestamp, localize_source_time


class DutchBroadcastScheduleTests(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 10, 25, 20, tzinfo=UTC)
        self.row = {
            "id": "db13189c-740e-4b32-8fec-feb539881629",
            "name": "Vragenuur",
            "slug": "vragenuur-14-01",
            "startsAt": "2026-10-27T14:01:00+0100",
            "endsAt": "2026-10-27T15:00:00+0100",
            "locationName": "Plenaire zaal",
            "locationId": "plenaire-zaal",
            "categoryIds": ["vragenuur"],
        }

    def parse_rows(self, rows, now=None, date="2026-10-27"):
        now = now or datetime(2026, 10, 27, 10, tzinfo=UTC)
        return dutch.parse(json.dumps({"date": date, "debates": rows}), now=now)

    def test_exact_room_mapping_keeps_parallel_broadcasts_separate(self):
        aletta = {**self.row, "id": "committee", "locationId": "aletta-jacobszaal"}
        other = {**self.row, "id": "other", "locationId": "troelstrazaal"}
        actualiteiten = {**self.row, "id": "news", "locationId": "actualiteitenkanaal"}
        rows = [self.row, aletta, other, actualiteiten]
        original = copy.deepcopy(rows)
        parsed = self.parse_rows(rows)
        self.assertEqual(set(parsed), set(dutch.CHANNEL_BY_LOCATION.values()))
        plenary = parsed["netherlands-tweede-kamer"]["events"]
        self.assertEqual([event["id"] for event in plenary], [self.row["id"]])
        self.assertEqual(plenary[0]["start"], "2026-10-27T13:01:00Z")
        self.assertEqual(plenary[0]["end"], "2026-10-27T14:00:00Z")
        self.assertEqual(plenary[0]["end_basis"], "source")
        self.assertIn("/2026-10-27/vragenuur/plenaire-zaal/", plenary[0]["url"])
        self.assertEqual(rows, original)

    def test_current_and_cancelled_programmes_use_real_intervals(self):
        now = datetime(2026, 10, 27, 13, 30, tzinfo=UTC)
        parsed = self.parse_rows([self.row], now=now)["netherlands-tweede-kamer"]
        self.assertEqual(parsed["current_event_title"], "Vragenuur")
        self.assertEqual(parsed["events"][0]["status"], "live")
        cancelled = self.parse_rows([{**self.row, "status": "cancelled"}], now=now)
        self.assertIsNone(cancelled["netherlands-tweede-kamer"]["current_event_title"])
        self.assertEqual(cancelled["netherlands-tweede-kamer"]["events"][0]["status"], "cancelled")

    def test_explicit_offsets_resolve_repeated_autumn_clock(self):
        rows = [
            {
                **self.row,
                "id": "summer",
                "startsAt": "2026-10-25T02:15:00+0200",
                "endsAt": "2026-10-25T02:45:00+0200",
            },
            {
                **self.row,
                "id": "winter",
                "startsAt": "2026-10-25T02:15:00+0100",
                "endsAt": "2026-10-25T02:45:00+0100",
            },
        ]
        result = self.parse_rows(rows, now=self.now, date="2026-10-25")
        events = result["netherlands-tweede-kamer"]["events"]
        self.assertEqual(
            [e["start"] for e in events], ["2026-10-25T00:15:00Z", "2026-10-25T01:15:00Z"]
        )

    def test_missing_times_stay_unknown_and_wrong_shapes_fail(self):
        for end in (None, "2026-10-27T15:00:00", "2026-10-27T13:00:00+0100"):
            with self.subTest(end=end):
                event = self.parse_rows([{**self.row, "endsAt": end}])["netherlands-tweede-kamer"][
                    "events"
                ][0]
                self.assertNotIn("end", event)
        self.assertEqual(self.parse_rows([{**self.row, "startsAt": "2026-10-27T14:01:00"}]), {})
        for payload in (
            {"date": "2026-10-26", "debates": []},
            {"date": "2026-10-27"},
            {"date": "2026-10-27", "debates": [None]},
        ):
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                dutch.parse(json.dumps(payload), now=datetime(2026, 10, 27, tzinfo=UTC))
        with self.assertRaises(ValueError):
            self.parse_rows([{**self.row, "startsAt": "2026-10-28T14:00:00+0100"}])

    def test_requests_use_origin_calendar_date_and_empty_days_are_valid(self):
        now = datetime(2026, 7, 1, 22, 30, tzinfo=UTC)
        requests = dutch.request_specs(now)
        self.assertEqual(len(requests), 7)
        self.assertTrue(requests[0]["url"].endswith("/2026-07-02"))
        self.assertTrue(requests[-1]["url"].endswith("/2026-07-08"))
        self.assertEqual(
            dutch.parse(json.dumps({"date": "2026-07-02", "debates": []}), now=now), {}
        )


class SourceTimezoneTests(unittest.TestCase):
    def test_ambiguous_and_nonexistent_wall_times_remain_unresolved(self):
        for value in (datetime(2026, 10, 25, 2, 30), datetime(2026, 3, 29, 2, 30)):
            self.assertIsNone(localize_source_time(value, "Europe/Amsterdam"))
        winter = localize_source_time(datetime(2026, 10, 25, 3, 30), "Europe/Amsterdam")
        summer = localize_source_time(datetime(2026, 7, 25, 3, 30), "Europe/Amsterdam")
        self.assertEqual(format_utc_timestamp(winter), "2026-10-25T02:30:00Z")
        self.assertEqual(format_utc_timestamp(summer), "2026-07-25T01:30:00Z")
        with self.assertRaises(ValueError):
            format_utc_timestamp(datetime(2026, 7, 1, 12))
        with self.assertRaises(ValueError):
            localize_source_time(datetime(2026, 7, 1, tzinfo=UTC), "Europe/Amsterdam")
