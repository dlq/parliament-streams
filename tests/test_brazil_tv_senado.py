"""TV Senado daily-grid contract, linear boundaries and source-time evidence."""

import json
import unittest
from datetime import UTC, datetime
from unittest.mock import patch
from urllib.parse import parse_qs, urlsplit

from parliament_streams.schedule_collection import collect_schedules
from parliament_streams.scrapers import SCRAPERS, brazil_tv_senado


def rows(*items):
    return json.dumps(
        [
            {
                "horario": clock,
                "programa": programme,
                "episodio": episode,
                "sinopse": "Programme synopsis",
            }
            for clock, programme, episode in items
        ]
    )


class BrazilTVSenadoTests(unittest.TestCase):
    def schedule(self, *payloads, now=None):
        return brazil_tv_senado.parse(*payloads, now=now or datetime(2026, 10, 25, 12, tzinfo=UTC))[
            "brazil-tv-senado-official"
        ]

    def test_explicit_requested_days_use_brasilia_not_utc_or_runner_calendar(self):
        requests = brazil_tv_senado.request_specs(datetime(2026, 1, 1, 1, tzinfo=UTC))
        dates = [parse_qs(urlsplit(item["url"]).query)["date"][0] for item in requests]
        self.assertEqual(dates, ["31-12-2025", "01-01-2026", "02-01-2026"])
        self.assertTrue(all(item["method"] == "GET" for item in requests))
        event = self.schedule(
            rows(("23:00", "Night programme", "")), now=datetime(2026, 1, 1, 1, tzinfo=UTC)
        )["events"][0]
        self.assertEqual(event["start"], "2026-01-01T02:00:00Z")
        self.assertEqual(event["start_basis"], "source")
        self.assertEqual(event["source_timezone"], "America/Sao_Paulo")
        self.assertEqual(event["url"], brazil_tv_senado.PROGRAMME_URL)

    def test_sequential_end_is_limited_to_the_same_complete_daily_grid(self):
        first = rows(("00:00", "Programme A", "Episode"), ("00:55", "Programme B", "_"))
        second = rows(("00:00", "Programme C", ""), ("01:00", "Programme D", "Programme D"))
        schedule = self.schedule(first, second)
        self.assertEqual(brazil_tv_senado.SOURCE["channel_ids"], ["brazil-tv-senado-official"])
        events = schedule["events"]
        self.assertEqual(len(events), 4)
        self.assertEqual(events[0]["title"], "Programme A - Episode")
        self.assertEqual(events[1]["title"], "Programme B")
        self.assertEqual(events[-1]["title"], "Programme D")
        self.assertEqual(events[0]["end"], "2026-10-25T03:55:00Z")
        self.assertEqual(events[0]["end_basis"], "next_listing_start")
        self.assertNotIn("end", events[1])
        self.assertNotIn("end", events[-1])
        self.assertEqual(events[0]["identifier_kind"], "generated")
        self.assertEqual(events[0]["language"], "pt-BR")

    def test_missing_day_cannot_fill_a_preceding_terminal_programme(self):
        schedule = self.schedule(
            rows(("22:00", "Late slot", "")), "[]", rows(("01:00", "Later date", ""))
        )
        events = schedule["events"]
        self.assertEqual(len(events), 2)
        self.assertNotIn("end", events[0])
        self.assertNotIn("end", events[1])
        self.assertEqual(events[1]["start"], "2026-10-27T04:00:00Z")

    def test_empty_list_is_distinct_from_changed_html_or_changed_json_shape(self):
        self.assertEqual(brazil_tv_senado.parse("[]"), {})
        for payload in [
            "<html>Temporarily unavailable</html>",
            "{}",
            '{"rows":[]}',
            '{"date":"24-10-2026","rows":[]}',
            "[{}]",
            "[null]",
        ]:
            with self.subTest(payload=payload), self.assertRaises(ValueError):
                brazil_tv_senado.parse(payload)

    def test_invalid_middle_slot_cannot_extend_previous_programme_across_unknown_time(self):
        payload = rows(
            ("09:00", "First", ""), ("after current", "Unknown start", ""), ("12:00", "Later", "")
        )
        with self.assertRaisesRegex(ValueError, "unresolved programme clock"):
            self.schedule(payload)

    def test_parallel_duplicate_or_backwards_times_are_not_sorted_into_a_linear_grid(self):
        for clocks in [["09:00", "09:00"], ["12:00", "10:00"]]:
            with (
                self.subTest(clocks=clocks),
                self.assertRaisesRegex(ValueError, "strictly ordered"),
            ):
                self.schedule(rows(*[(clock, "Programme", "") for clock in clocks]))

    def test_current_next_and_stable_identifiers_follow_one_broadcast_sequence(self):
        payload = rows(
            ("09:00", "First", "A &amp; B"), ("10:30", "Second", ""), ("12:00", "Third", "")
        )
        before = self.schedule(payload, now=datetime(2026, 10, 25, 11, tzinfo=UTC))
        during = self.schedule(payload, now=datetime(2026, 10, 25, 12, 30, tzinfo=UTC))
        self.assertEqual(before["next_event_start"], "2026-10-25T12:00:00Z")
        self.assertEqual(during["current_event_title"], "First - A & B")
        self.assertEqual(during["next_event_start"], "2026-10-25T13:30:00Z")
        self.assertEqual(
            [row["id"] for row in before["events"]], [row["id"] for row in during["events"]]
        )

    def test_naive_collection_time_and_historical_dst_gap_are_not_assigned_arbitrarily(self):
        with self.assertRaisesRegex(ValueError, "timezone offset"):
            brazil_tv_senado.request_specs(datetime(2026, 10, 25))
        with self.assertRaisesRegex(ValueError, "nonexistent source clock"):
            self.schedule(
                rows(("00:30", "Unknown historical clock", "")),
                now=datetime(2018, 11, 4, 12, tzinfo=UTC),
            )

    def test_unbounded_or_unanchored_payload_counts_are_rejected(self):
        for payloads in [[], ["[]"] * 4]:
            with (
                self.subTest(payloads=payloads),
                self.assertRaisesRegex(ValueError, "one to three"),
            ):
                brazil_tv_senado.parse(*payloads)

    def test_collector_retains_exact_requested_urls_and_source_end_provenance(self):
        requested = []
        payload = rows(("09:00", "Morning", ""), ("10:00", "Next", ""))

        def fetcher(spec, _timeout, _retries):
            requested.append(spec["url"])
            return "[]" if "27-10-2026" in spec["url"] else payload

        with patch.dict(SCRAPERS, {"brazil-tv-senado-grid": brazil_tv_senado}, clear=True):
            snapshot = collect_schedules(
                now=datetime(2026, 10, 25, 12, tzinfo=UTC), fetcher=fetcher, retries=0
            )
        source = snapshot["sources"]["brazil-tv-senado-grid"]
        schedule = snapshot["channels"]["brazil-tv-senado-official"]
        self.assertEqual(len(requested), 3)
        self.assertEqual(source["urls"], requested)
        self.assertEqual(source["status"], "ok")
        self.assertEqual(source["event_count"], 4)
        self.assertEqual(source["events_with_end"], 2)
        self.assertEqual(schedule["source_url"], brazil_tv_senado.PROGRAMME_URL)
        self.assertEqual(
            {event["end_basis"] for event in schedule["events"] if "end" in event},
            {"next_listing_start"},
        )


if __name__ == "__main__":
    unittest.main()
