"""Do not count a successful loading-shell response as an empty official calendar."""

import unittest
from datetime import UTC, datetime
from unittest.mock import patch

from parliament_streams.schedule_collection import collect_schedules
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
        self.month = '<span class="calendar-date">October 2026</span>'

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

    def test_rendered_sitting_calendar_remains_valid_with_framework_and_spinner_present(self):
        html = (
            self.month + '<button class="calendar-day house-sitting-day">'
            '<span class="date-number">26</span></button>'
            '<button class="calendar-day house-sitting-day">'
            '<span class="date-number">27</span></button>' + LOADING_SHELL
        )
        schedule = nz.parse(html, now=self.now)[nz.SOURCE["id"]]
        self.assertEqual(schedule["current_event_title"], "House sitting day")
        self.assertEqual(schedule["next_event_title"], "House next meets")
        self.assertEqual(schedule["next_event_time"], "Tuesday, 27 October 2026")

    def test_rendered_house_status_and_next_meeting_remain_compatible(self):
        for status in (
            "The House next meets on Tuesday, 27 October 2026",
            "The House is not sitting today",
        ):
            with self.subTest(status=status):
                html = f'<span class="house-session__text">{status}</span>' + LOADING_SHELL
                schedule = nz.parse(html, now=self.now)[nz.SOURCE["id"]]
                if "next meets" in status:
                    self.assertIsNone(schedule["current_event_title"])
                    self.assertEqual(schedule["next_event_time"], "Tuesday, 27 October 2026")
                else:
                    self.assertEqual(schedule["current_event_title"], status)

    def test_recognized_explicit_empty_month_is_still_a_healthy_empty_collection(self):
        html = (
            self.month
            + '<button class="calendar-day"><span class="date-number">26</span></button>'
            + "<p>No House sitting days in this month.</p>"
            + LOADING_SHELL
        )
        self.assertEqual(nz.parse(html, now=self.now), {})
        with patch("parliament_streams.schedule_collection.SCRAPERS", {nz.SOURCE["id"]: nz}):
            snapshot = collect_schedules(now=self.now, fetcher=lambda *_args: html)
        self.assertEqual(snapshot["sources"][nz.SOURCE["id"]]["status"], "empty")
        self.assertEqual(snapshot["counts"]["empty"], 1)
        self.assertEqual(snapshot["counts"]["error"], 0)

    def test_legacy_next_meeting_text_and_bot_protection_behavior_are_preserved(self):
        schedule = nz.parse("<p>The House next meets on Tuesday at 2pm.</p>", now=self.now)[
            nz.SOURCE["id"]
        ]
        self.assertEqual(schedule["next_event_time"], "Tuesday at 2pm.")
        with self.assertRaisesRegex(ValueError, "bot-protection"):
            nz.parse(
                "<p>Verifying your browser before proceeding</p>" + LOADING_SHELL, now=self.now
            )


if __name__ == "__main__":
    unittest.main()
