"""Official calendar starts must not turn template ends into broadcast guides."""

from __future__ import annotations

import copy
import unittest
from datetime import UTC, datetime
from types import ModuleType
from unittest.mock import patch

from parliament_streams.catalogue import load_catalogue
from parliament_streams.schedule_collection import collect_schedules
from parliament_streams.schedule_quality import assess_schedules
from parliament_streams.scrapers import norway_stortinget, sweden_riksdag

NOW = datetime(2026, 10, 26, 12, tzinfo=UTC)
UID = "4ce66f05-f416-446e-93c7-d67cd7380cee"
HEARING_UID = "5b1759f6-d2ee-4f4c-bf0e-32d3724bfcaa"


def calendar(name: str, rows: str = "") -> str:
    return (
        "BEGIN:VCALENDAR\nPRODID: -//STORTINGET//ICAL//NO\nVERSION:2.0\n"
        f"X-WR-CALNAME:{name}\n{rows}END:VCALENDAR\n"
    )


def norwegian_event(
    uid: str = UID,
    start: str = "20261103T090000Z",
    title: str = "Storting",
    location: str = "",
    extra: str = "",
) -> str:
    return (
        f"BEGIN:VEVENT\nUID:{uid}\nDTSTART:{start}\nDTEND:20261103T091500Z\n"
        f"SUMMARY:{title}\nLOCATION:{location}\n{extra}END:VEVENT\n"
    )


def swedish_event(
    uid: str = "RDHEC120261103va", start: str = "20261103T130000", status: str = ""
) -> str:
    return (
        f"<kalender><UID>{uid}</UID><DTSTART>{start}</DTSTART>"
        "<DTEND>20261103T140000</DTEND><SUMMARY>Election</SUMMARY>"
        "<LOCATION>Kammaren</LOCATION><CATEGORIES>kammaren,val,kamm</CATEGORIES>"
        f"<XRDDTSTARTSTATUS>{status}</XRDDTSTARTSTATUS></kalender>"
    )


def xml(rows: str = "", count: int = 0) -> str:
    return f'<kalenderlista antal="{count}">{rows}</kalenderlista>'


class NordicCalendarTests(unittest.TestCase):
    def test_norwegian_rooms_written_deadlines_and_placeholder_ends(self):
        meetings = calendar("Storting", norwegian_event())
        rows = norwegian_event(HEARING_UID, title="Committee hearing", location="Høringssal 1")
        rows += norwegian_event("deadline", title="Written response", location="skriftlig")
        result = norway_stortinget.parse(meetings, calendar("Høringer", rows), now=NOW)
        schedule = result[norway_stortinget.CHANNEL_ID]
        self.assertEqual(schedule["current_event_title"], None)
        self.assertEqual(len(schedule["events"]), 2)
        self.assertEqual({event["id"] for event in schedule["events"]}, {UID, HEARING_UID})
        for event in schedule["events"]:
            self.assertEqual(event["start"], "2026-11-03T09:00:00Z")
            self.assertEqual(event["source_timezone"], "Europe/Oslo")
            self.assertEqual(event["identifier_kind"], "official")
            self.assertEqual(event["status"], "scheduled")
            self.assertNotIn("end", event)

    def test_norwegian_empty_calendar_is_distinct_from_wrong_or_truncated_response(self):
        self.assertEqual(
            norway_stortinget.parse(calendar("Storting"), calendar("Høringer"), now=NOW), {}
        )
        for payload in (
            "<html>Access denied</html>",
            calendar("Other institution"),
            calendar("Storting", norwegian_event().replace("END:VEVENT", "")),
            calendar("Storting", norwegian_event()).replace("END:VCALENDAR", ""),
        ):
            with self.subTest(payload=payload[:70]), self.assertRaises(ValueError):
                norway_stortinget.parse(payload, calendar("Høringer"), now=NOW)

    def test_norwegian_identity_clock_and_link_failures(self):
        for row in (
            norwegian_event(uid="missing"),
            norwegian_event(start="20261103T090000"),
            norwegian_event(extra="UID:another\n"),
            norwegian_event(title="Another institution"),
            norwegian_event(extra="URL:https://example.org/event\n"),
            norwegian_event() + norwegian_event(start="20261103T100000Z"),
        ):
            with self.subTest(row=row[:90]), self.assertRaises(ValueError):
                norway_stortinget.parse(calendar("Storting", row), calendar("Høringer"), now=NOW)

    def test_norwegian_duplicate_folded_summary_and_safe_event_url(self):
        row = norwegian_event(
            extra="URL:https://www.stortinget.no/no/Hva-skjer-pa-Stortinget/Dagsorden/\n"
        )
        result = norway_stortinget.parse(
            calendar("Storting", row + row), calendar("Høringer"), now=NOW
        )
        self.assertEqual(len(result[norway_stortinget.CHANNEL_ID]["events"]), 1)
        hearing = norwegian_event(HEARING_UID, title="Committee\n hearing", location="Høringssal 2")
        result = norway_stortinget.parse(
            calendar("Storting"), calendar("Høringer", hearing), now=NOW
        )
        self.assertEqual(
            result[norway_stortinget.CHANNEL_ID]["events"][0]["title"], "Committeehearing"
        )

    def test_norwegian_old_distant_cancelled_and_cross_feed_collision(self):
        rows = norwegian_event(start="20261025T090000Z")
        rows += norwegian_event(start="20270103T090000Z")
        rows += norwegian_event(extra="STATUS:CANCELLED\n")
        self.assertEqual(
            norway_stortinget.parse(calendar("Storting", rows), calendar("Høringer"), now=NOW), {}
        )
        with self.assertRaisesRegex(ValueError, "across feeds"):
            norway_stortinget.parse(
                calendar("Storting", norwegian_event()),
                calendar("Høringer", norwegian_event(location="Høringssal 1")),
                now=NOW,
            )

    def test_swedish_source_clock_matches_announced_utc_webcast(self):
        schedule = sweden_riksdag.parse(xml(swedish_event(), 1), now=NOW)[sweden_riksdag.CHANNEL_ID]
        event = schedule["events"][0]
        self.assertEqual(event["start"], "2026-11-03T12:00:00Z")
        self.assertEqual(event["source_timezone"], "Europe/Stockholm")
        self.assertEqual(event["id"], "RDHEC120261103va")
        self.assertNotIn("end", event)
        self.assertEqual(schedule["current_event_title"], None)

    def test_swedish_unknown_and_relative_starts_are_not_numeric_placeholders(self):
        for status in ("Ingen starttid", "Efter debattens slut", "Ny okänd markör"):
            with self.subTest(status=status):
                self.assertEqual(
                    sweden_riksdag.parse(xml(swedish_event(status=status), 1), now=NOW), {}
                )

    def test_swedish_empty_and_broken_contracts(self):
        self.assertEqual(sweden_riksdag.parse(xml(), now=NOW), {})
        for payload in (
            "<html>Loading</html>",
            xml(swedish_event(), 2),
            xml(swedish_event(), 1)[:-5],
            "<!DOCTYPE kalenderlista>" + xml(),
            xml(swedish_event().replace("<SUMMARY>Election</SUMMARY>", ""), 1),
            xml(swedish_event().replace("kammaren,val,kamm", "committee"), 1),
            xml(swedish_event(uid="unrecognized"), 1),
            xml(swedish_event(start="20261103T130000Z"), 1),
            xml(swedish_event() + swedish_event(start="20261103T140000"), 2),
        ):
            with self.subTest(payload=payload[:80]), self.assertRaises(ValueError):
                sweden_riksdag.parse(payload, now=NOW)

    def test_swedish_dst_and_outside_window(self):
        summer = datetime(2026, 7, 1, tzinfo=UTC)
        result = sweden_riksdag.parse(xml(swedish_event(start="20260702T130000"), 1), now=summer)
        self.assertEqual(
            result[sweden_riksdag.CHANNEL_ID]["events"][0]["start"], "2026-07-02T11:00:00Z"
        )
        for clock, now in (
            ("20261025T023000", datetime(2026, 10, 24, tzinfo=UTC)),
            ("20260329T023000", datetime(2026, 3, 28, tzinfo=UTC)),
        ):
            with self.subTest(clock=clock), self.assertRaisesRegex(ValueError, "source clock"):
                sweden_riksdag.parse(xml(swedish_event(start=clock), 1), now=now)
        for clock in ("20261025T120000", "20300619T090000"):
            self.assertEqual(sweden_riksdag.parse(xml(swedish_event(start=clock), 1), now=NOW), {})

    def test_aware_collection_time_required(self):
        with self.assertRaises(ValueError):
            sweden_riksdag.parse(xml(), now=NOW.replace(tzinfo=None))
        with self.assertRaises(ValueError):
            norway_stortinget.parse(
                calendar("Storting"), calendar("Høringer"), now=NOW.replace(tzinfo=None)
            )

    def test_collection_and_quality_do_not_promote_calendars_to_linear_guides(self):
        modules: dict[str, ModuleType] = {
            norway_stortinget.SOURCE["id"]: norway_stortinget,
            sweden_riksdag.SOURCE["id"]: sweden_riksdag,
        }
        bodies = {
            norway_stortinget.MEETINGS_URL: calendar("Storting", norwegian_event()),
            norway_stortinget.HEARINGS_URL: calendar("Høringer"),
            sweden_riksdag.API_URL: xml(swedish_event(), 1),
        }
        with patch("parliament_streams.schedule_collection.SCRAPERS", modules):
            snapshot = collect_schedules(
                now=NOW, fetcher=lambda request, timeout, retries: bodies[request["url"]]
            )
        self.assertEqual(snapshot["counts"]["ok"], 2)
        self.assertEqual(snapshot["counts"]["events_with_official_id"], 2)
        self.assertEqual(snapshot["counts"]["events_with_end"], 0)
        catalogue = copy.deepcopy(load_catalogue())
        catalogue["channels"] = [
            c
            for c in catalogue["channels"]
            if c["id"] in {norway_stortinget.CHANNEL_ID, sweden_riksdag.CHANNEL_ID}
        ]
        for channel in catalogue["channels"]:
            parser = (
                norway_stortinget
                if channel["id"] == norway_stortinget.CHANNEL_ID
                else sweden_riksdag
            )
            channel["epg_sources"] = [
                {
                    "scraper": parser.SOURCE["id"],
                    "scraper_status": "implemented",
                    "url": "https://example.org/calendar",
                    "method": "GET",
                    "kind": "institutional_agenda",
                }
            ]
        assessment = assess_schedules(catalogue, snapshot)
        self.assertEqual(assessment.report["counts"]["exportable"], 0)
        for quality in assessment.report["channels"].values():
            self.assertEqual(quality["scope"], "institutional_agenda")
            self.assertEqual(quality["linear_guide_eligible"], False)


if __name__ == "__main__":
    unittest.main()
