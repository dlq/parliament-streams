"""Portuguese agenda clocks are explicit source facts, not midnight defaults."""

from __future__ import annotations

import json
import unittest
from datetime import UTC, datetime

from parliament_streams.scrapers import portugal_agenda


class PortugalAgendaTimesTests(unittest.TestCase):
    def setUp(self):
        self.event = {
            "Id": 48339,
            "Section": "Plenário",
            "Title": "Reunião Plenária",
            "EventStartDate": "27/10/2026",
            "EventStartTime": "15:00:00",
            "EventEndDate": "27/10/2026",
            "EventEndTime": "23:59:00",
            "AllDayEvent": False,
            "Local": "Plenário",
            "Link": "https://www.parlamento.pt/agenda",
        }
        self.now = datetime(2026, 10, 26, tzinfo=UTC)

    def parse(self, event):
        return portugal_agenda.parse(json.dumps([event]), now=self.now)

    def test_preserves_official_identity_location_and_link_without_calendar_end(self):
        schedule = self.parse(self.event)["portugal-artv"]
        event = schedule["events"][0]
        self.assertEqual(event["id"], "48339")
        self.assertEqual(event["identifier_kind"], "official")
        self.assertEqual(event["start"], "2026-10-27T15:00:00Z")
        self.assertEqual(event["source_timezone"], "Europe/Lisbon")
        self.assertEqual(event["location"], "Plenário")
        self.assertEqual(event["url"], self.event["Link"])
        self.assertNotIn("end", event)

    def test_missing_clock_is_not_a_midnight_programme(self):
        for value in (None, "", " ", 0):
            with self.subTest(value=value):
                self.assertEqual(self.parse({**self.event, "EventStartTime": value}), {})
        event = {key: value for key, value in self.event.items() if key != "EventStartTime"}
        self.assertEqual(self.parse(event), {})

    def test_explicit_midnight_is_valid_but_all_day_is_not_a_timed_broadcast(self):
        midnight = {**self.event, "EventStartTime": "00:00:00"}
        event = self.parse(midnight)["portugal-artv"]["events"][0]
        self.assertEqual(event["start"], "2026-10-27T00:00:00Z")
        self.assertEqual(self.parse({**midnight, "AllDayEvent": True}), {})

    def test_rejects_dst_gap_and_fold_without_choosing_an_offset(self):
        self.now = datetime(2026, 1, 1, tzinfo=UTC)
        for day in ("29/03/2026", "25/10/2026"):
            with self.subTest(day=day):
                self.assertEqual(
                    self.parse({**self.event, "EventStartDate": day, "EventStartTime": "01:30:00"}),
                    {},
                )

    def test_summer_clock_and_rescheduling_keep_the_source_identifier(self):
        self.now = datetime(2026, 8, 17, tzinfo=UTC)
        event = self.parse(
            {**self.event, "EventStartDate": "18/08/2026", "EventStartTime": "10:00:00"}
        )["portugal-artv"]["events"][0]
        self.assertEqual(event["start"], "2026-08-18T09:00:00Z")
        self.assertEqual(event["id"], "48339")

    def test_invalid_links_dates_and_titles_do_not_become_published_programmes(self):
        for link in ("javascript:alert(1)", "https://[", "/relative-only"):
            with self.subTest(link=link):
                event = self.parse({**self.event, "Link": link})["portugal-artv"]["events"][0]
                self.assertNotIn("url", event)
        self.assertEqual(self.parse({**self.event, "EventStartDate": "32/10/2026"}), {})
        for title in (None, "&nbsp;", "<br>", "<span></span>"):
            with self.subTest(title=title):
                self.assertEqual(self.parse({**self.event, "Title": title}), {})

    def test_unrecognized_json_is_a_source_error_instead_of_an_empty_agenda(self):
        for payload in ({"error": "unavailable"}, [None], "loading"):
            with (
                self.subTest(payload=payload),
                self.assertRaisesRegex(ValueError, "list of event objects"),
            ):
                portugal_agenda.parse(json.dumps(payload), now=self.now)


if __name__ == "__main__":
    unittest.main()
