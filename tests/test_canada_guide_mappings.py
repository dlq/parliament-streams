"""Source-specific timing and feed boundaries for the Canadian programme parsers."""

import json
import unittest
from datetime import UTC, datetime

from parliament_streams.scrapers import ontario_calendar, quebec_webdiffusion


class QuebecWebcastBoundaryTests(unittest.TestCase):
    def test_live_metadata_retains_official_activity_without_inventing_time_range(self):
        live = json.dumps(
            {
                "d": [
                    {
                        "DiffusionDisponible": True,
                        "UrlSignal": "https://cdn.test/diffusion/canal01/playlist.m3u8",
                        "Titre": "Commission &amp; finances",
                        "Heure": "Depuis 10 h",
                        "UrlPage": "/fr/video-audio/index.html?activite=12345",
                        "IdActivite": "12345",
                    }
                ]
            }
        )
        record = quebec_webdiffusion.parse(live)["quebec-canal01"]
        self.assertEqual(record["current_event_title"], "Commission & finances")
        self.assertEqual(record["current_event_time"], "Depuis 10 h")
        self.assertEqual(record["current_event_id"], "12345")
        self.assertEqual(record["current_event_language"], "fr")
        self.assertEqual(
            record["current_event_url"],
            "https://www.assnat.qc.ca/fr/video-audio/index.html?activite=12345",
        )
        self.assertNotIn("current_event_start", record)
        self.assertNotIn("events", record)

    def test_unassigned_upcoming_and_canal17_are_never_copied_to_event_feeds(self):
        live = json.dumps(
            {
                "d": [
                    {
                        "UrlSignal": "https://cdn.test/diffusion/canal17/playlist.m3u8",
                        "Titre": "TV linéaire",
                    },
                    {"UrlSignal": "https://cdn.test/player?canal01=1", "Titre": "No feed path"},
                    {"UrlSignal": None, "Titre": "Unknown"},
                ]
            }
        )
        upcoming = json.dumps(
            {"d": [{"Date": "26 octobre 2026", "Heure": "10 h", "Titre": "Une activité"}]}
        )
        self.assertEqual(quebec_webdiffusion.parse(live, upcoming), {})


class OntarioCalendarTimezoneTests(unittest.TestCase):
    def test_publisher_card_clock_uses_toronto(self):
        for day, expected in [
            ("January 15, 2026", "2026-01-15T15:00:00Z"),
            ("October 26, 2026", "2026-10-26T14:00:00Z"),
        ]:
            with self.subTest(day=day):
                html = (
                    f'<h2 id="calendar-view-heading">{day}</h2>'
                    '<div class="calendar-event-filter-item" data-event-type="house-sitting">'
                    '<div class="parliamentary-calendar-event" title="House in session: 10 a.m.">'
                    "</div></div>"
                )
                event = ontario_calendar.parse(html, now=datetime(2026, 1, 1, tzinfo=UTC))[
                    "ontario-house-en"
                ]["events"][0]
                self.assertEqual(event["start"], expected)
                self.assertNotIn("end", event)

    def test_missing_and_ambiguous_clocks_are_held(self):
        for label in ("House in session", "House in session: 1:30 a.m."):
            with self.subTest(label=label):
                html = (
                    '<h2 id="calendar-view-heading">November 1, 2026</h2>'
                    '<div class="calendar-event-filter-item" data-event-type="house-sitting">'
                    f'<div class="parliamentary-calendar-event" title="{label}"></div></div>'
                )
                self.assertEqual(
                    ontario_calendar.parse(html, now=datetime(2026, 11, 1, tzinfo=UTC)), {}
                )


if __name__ == "__main__":
    unittest.main()
