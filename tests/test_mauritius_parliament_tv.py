"""Source-contract and time handling for the Mauritius Parliament TV guide."""

import unittest
from datetime import UTC, datetime

from parliament_streams.scrapers import mauritius_parliament_tv as guide

EVENT_ID = "16a861c2-003a-4421-87ff-82ccac261162"
NOW = datetime(2026, 10, 26, 5, tzinfo=UTC)


def event_card(
    date_text: str = "Tuesday 27 October 2026 11:00AM",
    title: str = "Mauritius National Assembly Chamber",
    href: str = f"/Event/Index/{EVENT_ID}",
) -> str:
    return (
        '<div class="tabs__item list__item">'
        f'<a href="{href}"><img src="/chamber.jpg" alt=""></a>'
        '<div class="list__item__desc">'
        f'<span class="list__item__date">{date_text}</span>'
        f"<div><h2>{title}</h2><h3>{title}</h3>"
        f'<a class="button" href="{href}">View Details</a></div></div></div>'
    )


def document(*cards: str) -> str:
    return (
        '<div class="tabs__content list"><div class="tabs__pane">' + "".join(cards) + "</div></div>"
    )


class MauritiusGuideTests(unittest.TestCase):
    def test_explicit_source_date_and_uuid_without_invented_end_or_live_status(self) -> None:
        parsed = guide.parse(document(event_card()), now=NOW)[guide.CHANNEL_ID]
        event = parsed["events"][0]
        self.assertEqual(event["id"], EVENT_ID)
        self.assertEqual(event["identifier_kind"], "official")
        self.assertEqual(event["start"], "2026-10-27T07:00:00Z")
        self.assertEqual(event["source_timezone"], "Indian/Mauritius")
        self.assertNotIn("end", event)
        self.assertNotIn("language", event)
        self.assertIsNone(parsed["current_event_title"])
        self.assertEqual(parsed["next_event_start"], event["start"])
        self.assertEqual(
            parsed["next_event_url"], f"https://parliamenttv.govmu.org/Event/Index/{EVENT_ID}"
        )
        after_start = guide.parse(document(event_card()), now=datetime(2026, 10, 27, 8, tzinfo=UTC))
        self.assertIsNone(after_start[guide.CHANNEL_ID]["current_event_title"])
        self.assertIsNone(after_start[guide.CHANNEL_ID]["next_event_title"])

    def test_midnight_and_noon_are_source_clocks_not_assumed_overnight_bounds(self) -> None:
        for clock, expected in (
            ("12:00AM", "2026-10-26T20:00:00Z"),
            ("12:00PM", "2026-10-27T08:00:00Z"),
        ):
            with self.subTest(clock=clock):
                event = guide.parse(
                    document(event_card(f"Tuesday 27 October 2026 {clock}")), now=NOW
                )[guide.CHANNEL_ID]["events"][0]
                self.assertEqual(event["start"], expected)
                self.assertNotIn("end", event)

    def test_repeated_cards_reconcile_by_official_uuid(self) -> None:
        parsed = guide.parse(document(event_card(), event_card()), now=NOW)
        self.assertEqual(len(parsed[guide.CHANNEL_ID]["events"]), 1)
        with self.assertRaisesRegex(ValueError, "conflicting metadata"):
            guide.parse(
                document(event_card(), event_card("Tuesday 27 October 2026 2:00PM")), now=NOW
            )

    def test_recognized_empty_guide_is_not_a_collection_error(self) -> None:
        empty = (
            '<div class="tabs__item list__item"><h3 class="noEvents">No events found.</h3></div>'
        )
        self.assertEqual(guide.parse(document(empty), now=NOW), {})

    def test_missing_or_partial_directory_is_not_a_false_empty_result(self) -> None:
        empty = (
            '<div class="tabs__item list__item"><h3 class="noEvents">No events found.</h3></div>'
        )
        for html in (
            "<html>Loading...</html>",
            document(),
            document(
                event_card().replace(
                    '<span class="list__item__date">Tuesday 27 October 2026 11:00AM</span>', ""
                )
            ),
            document(event_card()).rsplit("</div>", 3)[0],
            document(empty).replace("</div></div>", '</div><div class="tabs__pane"></div></div>'),
        ):
            with self.subTest(html=html), self.assertRaises(ValueError):
                guide.parse(html, now=NOW)

    def test_invalid_date_weekday_clock_and_foreign_origin_fail_closed(self) -> None:
        for bad_date in (
            "Monday 27 October 2026 11:00AM",
            "Tuesday 27 October 2026 00:00AM",
            "Tuesday 27 October 2026 11:60AM",
            "Tuesday 31 February 2026 11:00AM",
            "Tuesday 27 October 2026 11:00AM - 04:30AM",
        ):
            with self.subTest(date=bad_date), self.assertRaises(ValueError):
                guide.parse(document(event_card(bad_date)), now=NOW)
        with self.assertRaisesRegex(ValueError, "unexpected origin"):
            guide.parse(
                document(event_card(href=f"https://example.org/Event/Index/{EVENT_ID}")), now=NOW
            )
        with self.assertRaisesRegex(ValueError, "UUID"):
            guide.parse(document(event_card(href="/Event/Index/not-an-event-id")), now=NOW)

    def test_markup_and_subtitle_are_text_and_collection_clock_must_be_aware(self) -> None:
        card = event_card(title="Questions &amp; Answers").replace(
            "<h3>Questions &amp; Answers</h3>", "<h3>Budget <em>review</em></h3>"
        )
        event = guide.parse(document(card), now=NOW)[guide.CHANNEL_ID]["events"][0]
        self.assertEqual(event["title"], "Questions & Answers: Budget review")
        with self.assertRaisesRegex(ValueError, "timezone"):
            guide.parse(document(card), now=datetime(2026, 10, 26))


if __name__ == "__main__":
    unittest.main()
