"""Only dated, feed-specific plenary starts qualify; ends remain unknown."""

from __future__ import annotations

import json
import unittest
from datetime import UTC, datetime
from urllib.parse import parse_qs, urlsplit

from parliament_streams.scrapers import estonia_riigikogu as estonia

NOW = datetime(2026, 10, 25, 18, tzinfo=UTC)
UUID1 = "6da3102b-c5b2-4829-9859-dfea4b60ea0a"
UUID2 = "17648310-a99b-4443-afcc-d36c0a2b9271"


def estonian_plan(*rows):
    return {
        "weekStartDate": "2026-10-25",
        "weekEndDate": "2026-11-01",
        "sittings": list(rows),
    }


def sitting(start="2026-10-26T15:00:00", identity=UUID1, kind="plenarySittingVolume"):
    return {
        "uuid": identity,
        "title": "Synthetic sitting",
        "sittingDateTime": start,
        "volumeType": kind,
    }


class EstoniaPlenaryTests(unittest.TestCase):
    def parse(self, document, now=NOW):
        return estonia.parse(json.dumps(document), now=now)

    def test_official_identity_local_date_and_no_fabricated_end(self):
        rows = [sitting(), sitting("2026-10-28T12:00:00", UUID2, "infoSittingVolume")]
        result = self.parse(estonian_plan(*rows))
        self.assertEqual(set(result), {"estonia-riigikogu-live-1"})
        schedule = result[estonia.CHANNEL_ID]
        self.assertEqual(schedule["next_event_start"], "2026-10-26T13:00:00Z")
        self.assertIsNone(schedule["current_event_title"])
        events = schedule["events"]
        self.assertEqual(events[0]["id"], UUID1)
        self.assertEqual(events[0]["identifier_kind"], "official")
        self.assertTrue(all(e["source_timezone"] == "Europe/Tallinn" for e in events))
        self.assertTrue(all("end" not in e for e in events))

    def test_future_same_day_start_does_not_close_question_time(self):
        rows = [
            sitting("2026-10-28T12:00:00", UUID1, "infoSittingVolume"),
            sitting("2026-10-28T14:00:00", UUID2),
        ]
        events = self.parse(estonian_plan(*rows))[estonia.CHANNEL_ID]["events"]
        self.assertTrue(all("end" not in event for event in events))

    def test_explicit_offset_fractional_seconds_and_midnight_are_preserved_in_utc(self):
        rows = [sitting("2026-10-26T00:15:00.999999"), sitting("2026-10-27T10:00:00+02:00", UUID2)]
        events = self.parse(estonian_plan(*rows))[estonia.CHANNEL_ID]["events"]
        self.assertEqual(events[0]["start"], "2026-10-25T22:15:00Z")
        self.assertEqual(events[1]["start"], "2026-10-27T08:00:00Z")

    def test_date_only_cannot_invent_midnight_but_an_explicit_midnight_is_valid(self):
        with self.assertRaisesRegex(ValueError, "explicit date and clock"):
            self.parse(estonian_plan(sitting("2026-10-26")))
        events = self.parse(estonian_plan(sitting("2026-10-26T00:00:00")))[estonia.CHANNEL_ID][
            "events"
        ]
        self.assertEqual(events[0]["start"], "2026-10-25T22:00:00Z")

    def test_ambiguous_and_nonexistent_local_times_are_held(self):
        for first, last, start, now in (
            ("2026-10-25", "2026-11-01", "2026-10-25T03:30:00", NOW),
            ("2026-03-29", "2026-04-05", "2026-03-29T03:30:00", datetime(2026, 3, 29, tzinfo=UTC)),
        ):
            document = estonian_plan(sitting(start))
            document.update(weekStartDate=first, weekEndDate=last)
            with (
                self.subTest(start=start),
                self.assertRaisesRegex(ValueError, "ambiguous or nonexistent"),
            ):
                self.parse(document, now)

    def test_genuine_empty_differs_from_bad_types_dates_or_other_rooms(self):
        self.assertEqual(self.parse(estonian_plan()), {})
        defects = [
            [],
            {"weekStartDate": "2026-10-25", "weekEndDate": "2026-11-01"},
            {**estonian_plan(), "sittings": {}},
            {**estonian_plan(), "weekStartDate": "yesterday"},
            {**estonian_plan(), "weekEndDate": "2026-10-20"},
            {**estonian_plan(), "weekStartDate": "2026-10-01", "weekEndDate": "2026-10-07"},
            estonian_plan(sitting(kind="committeeSittingVolume")),
            estonian_plan({**sitting(), "title": ""}),
            estonian_plan(sitting(identity="unknown")),
            estonian_plan(sitting(), sitting()),
            estonian_plan(sitting("2026-11-02T10:00:00")),
        ]
        for document in defects:
            with self.subTest(document=document), self.assertRaises(ValueError):
                self.parse(document)

    def test_past_starts_do_not_invent_a_current_live_programme(self):
        document = estonian_plan(sitting("2026-10-25T10:00:00"))
        self.assertEqual(self.parse(document), {})

    def test_request_window_uses_tallinn_calendar_day(self):
        specs = estonia.request_specs(datetime(2026, 10, 25, 22, 30, tzinfo=UTC))
        self.assertEqual(len(specs), 1)
        query = parse_qs(urlsplit(specs[0]["url"]).query)
        self.assertEqual(query["startDate"], ["2026-10-26"])
        self.assertEqual(query["endDate"], ["2026-11-02"])
        self.assertEqual(query["querySteno"], ["false"])


if __name__ == "__main__":
    unittest.main()
