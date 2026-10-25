"""Source-specific timing and feed boundaries for the Canadian programme parsers."""

import json
import unittest
from datetime import UTC, datetime

from parliament_streams.scrapers import (
    canada_harmony,
    ontario_calendar,
    quebec_canal_assemblee,
    quebec_webdiffusion,
)


def harmony_card(time_text, date_text="Mon, Oct 26, 2026", event_id="12345", room="Room 1"):
    # Same field order as the official Harmony card, without third-party assets.
    return f"""
    <div class="divEvent"><a href="/Harmony/en/PowerBrowser/PowerBrowserV2/20261025/-1/{event_id}"
        title="Committee meeting {event_id}"><table><tr><td colspan="2" class="tdEventTitle">
        <span>Committee meeting {event_id} ({room})</span></td></tr><tr><td>
        <div class="eventDesc">Public hearing</div><div class="eventTime">{time_text}</div>
        <div class="eventDate">{date_text}</div></td></tr></table></a></div>
    """


def linear_day(heading, *programmes):
    return f"<h3>{heading}</h3>" + "".join(
        f"<p><strong>{clock}<br /></strong>{title}<br />{kind}</p>"
        for clock, title, kind in programmes
    )


class HarmonyGuideTimingTests(unittest.TestCase):
    def events(self, time_text, date_text="Mon, Oct 26, 2026"):
        parsed = canada_harmony.parse(
            harmony_card(time_text, date_text), now=datetime(2026, 1, 1, tzinfo=UTC)
        )
        return parsed.get("canada-house-of-commons-parlvu", {}).get("events", [])

    def test_recover_source_end_and_keep_parallel_rooms_separate(self):
        html = harmony_card("11:05 AM-1:00 PM", event_id="1", room="Room 1")
        html += harmony_card("11:00 AM–1:00 PM", event_id="2", room="Room 2")
        schedule = canada_harmony.parse(html, now=datetime(2026, 10, 25, tzinfo=UTC))[
            "canada-house-of-commons-parlvu"
        ]
        events = schedule["events"]
        self.assertEqual(len(events), 2)
        self.assertEqual({row["location"] for row in events}, {"Room 1", "Room 2"})
        self.assertEqual({row["end"] for row in events}, {"2026-10-26T17:00:00Z"})
        self.assertEqual({row["end_basis"] for row in events}, {"source"})
        self.assertEqual({row["source_timezone"] for row in events}, {"America/Toronto"})
        self.assertEqual(events[0]["start"], "2026-10-26T15:00:00Z")
        self.assertEqual(events[1]["start"], "2026-10-26T15:05:00Z")

    def test_winter_offset_is_not_a_fixed_summer_offset(self):
        event = self.events("11:00 AM-1:00 PM", "Thu, Jan 15, 2026")[0]
        self.assertEqual(event["start"], "2026-01-15T16:00:00Z")
        self.assertEqual(event["end"], "2026-01-15T18:00:00Z")

    def test_midnight_rollover_uses_the_new_dates_dst_offset(self):
        event = self.events("11:30 PM-2:30 AM", "Sat, Oct 31, 2026")[0]
        self.assertEqual(event["start"], "2026-11-01T03:30:00Z")
        self.assertEqual(event["end"], "2026-11-01T07:30:00Z")

    def test_ambiguous_and_nonexistent_starts_are_held(self):
        for date_text, clock in [
            ("Sun, Nov 01, 2026", "1:30 AM-3:30 AM"),
            ("Sun, Mar 08, 2026", "2:30 AM-3:30 AM"),
        ]:
            with self.subTest(date=date_text):
                self.assertEqual(self.events(clock, date_text), [])

    def test_rollover_to_ambiguous_or_nonexistent_end_keeps_end_unknown(self):
        for date_text, clock in [
            ("Sat, Oct 31, 2026", "11:30 PM-1:30 AM"),
            ("Sat, Mar 07, 2026", "11:30 PM-2:30 AM"),
        ]:
            with self.subTest(date=date_text):
                event = self.events(clock, date_text)[0]
                self.assertNotIn("end", event)
                self.assertNotIn("end_basis", event)

    def test_end_is_resolved_on_its_actual_rollover_date(self):
        event = self.events("11:30 PM-1:30 AM", "Sun, Nov 01, 2026")[0]
        self.assertEqual(event["end"], "2026-11-02T06:30:00Z")

    def test_no_fixed_duration_for_absent_or_ambiguous_range(self):
        for clock in ["11:00 AM", "11:00 AM-", "11:00 AM-10:00 AM", "11:00 AM-11:00 AM"]:
            with self.subTest(clock=clock):
                event = self.events(clock)[0]
                self.assertNotIn("end", event)


class QuebecLinearGuideTests(unittest.TestCase):
    def schedule(self, html, now=None):
        return quebec_canal_assemblee.parse(html, now=now or datetime(2026, 1, 1, tzinfo=UTC))[
            "quebec-canal-assemblee"
        ]

    def test_separate_linear_feed_retains_exact_printed_range_and_repeat(self):
        html = linear_day(
            "Dimanche 25 octobre 2026",
            ("18 h à 19 h 35", "Cérémonie &amp; serments", "En reprise"),
            ("20 h 30 à 21 h 30", "Séance", "En direct"),
        )
        schedule = self.schedule(html)
        self.assertEqual(quebec_canal_assemblee.SOURCE["channel_ids"], ["quebec-canal-assemblee"])
        events = schedule["events"]
        self.assertEqual(len(events), 2)
        self.assertEqual(events[0]["title"], "Cérémonie & serments - En reprise")
        self.assertEqual(events[0]["start"], "2026-10-25T22:00:00Z")
        self.assertEqual(events[0]["end"], "2026-10-25T23:35:00Z")
        self.assertEqual(events[1]["start"], "2026-10-26T00:30:00Z")
        self.assertEqual(events[0]["start_basis"], "source")
        self.assertEqual(events[0]["end_basis"], "source")
        self.assertEqual(events[0]["identifier_kind"], "generated")
        self.assertTrue(events[0]["url"].endswith("#dimanche"))
        self.assertEqual(events[0]["language"], "fr")
        self.assertNotIn("location", events[0])

    def test_current_and_next_use_broadcast_times_even_for_repeats(self):
        html = linear_day(
            "Dimanche 25 octobre 2026",
            ("18 h à 19 h 35", "Première reprise", "En reprise"),
            ("19 h 35 à 20 h 30", "Deuxième reprise", "En reprise"),
        )
        schedule = self.schedule(html, datetime(2026, 10, 25, 22, 30, tzinfo=UTC))
        self.assertEqual(schedule["current_event_title"], "Première reprise - En reprise")
        self.assertEqual(schedule["next_event_start"], "2026-10-25T23:35:00Z")
        self.assertEqual(schedule["events"][0]["status"], "live")
        self.assertEqual(schedule["current_event_language"], "fr")

    def test_missing_end_is_not_borrowed_from_the_next_slot(self):
        html = linear_day(
            "Dimanche 25 octobre 2026",
            ("18 h", "Heure de fin inconnue", "En direct"),
            ("20 h à 21 h", "Autre émission", "En reprise"),
        )
        events = self.schedule(html)["events"]
        self.assertNotIn("end", events[0])
        self.assertNotIn("end_basis", events[0])

    def test_named_toronto_zone_covers_spring_and_fall_transitions(self):
        for heading, expected_start, expected_end in [
            ("Dimanche 8 mars 2026", "2026-03-08T05:30:00Z", "2026-03-08T07:30:00Z"),
            ("Dimanche 1 novembre 2026", "2026-11-01T04:30:00Z", "2026-11-01T08:30:00Z"),
        ]:
            with self.subTest(heading=heading):
                event = self.schedule(
                    linear_day(heading, ("0 h 30 à 3 h 30", "Émission", "En reprise"))
                )["events"][0]
                self.assertEqual(event["start"], expected_start)
                self.assertEqual(event["end"], expected_end)

    def test_ambiguous_and_nonexistent_start_is_not_guessed(self):
        for heading, clock in [
            ("Dimanche 8 mars 2026", "2 h 30 à 3 h 30"),
            ("Dimanche 1 novembre 2026", "1 h 30 à 3 h 30"),
        ]:
            with (
                self.subTest(heading=heading),
                self.assertRaisesRegex(ValueError, "unresolved row"),
            ):
                quebec_canal_assemblee.parse(
                    linear_day(heading, (clock, "Heure incertaine", "En reprise")),
                    now=datetime(2026, 1, 1, tzinfo=UTC),
                )

    def test_ambiguous_or_nonexistent_end_does_not_gain_a_range(self):
        for heading, clock in [
            ("Dimanche 8 mars 2026", "0 h 30 à 2 h 30"),
            ("Dimanche 1 novembre 2026", "0 h 30 à 1 h 30"),
            ("Samedi 31 octobre 2026", "23 h 30 à 1 h 30"),
        ]:
            with self.subTest(heading=heading):
                event = self.schedule(linear_day(heading, (clock, "Fin incertaine", "En reprise")))[
                    "events"
                ][0]
                self.assertNotIn("end", event)

    def test_explicit_midnight_and_overnight_ranges_resolve_on_next_day(self):
        for clock, expected_end in [
            ("23 h 30 à 24 h", "2026-11-01T04:00:00Z"),
            ("23 h 30 à 2 h 30", "2026-11-01T07:30:00Z"),
        ]:
            with self.subTest(clock=clock):
                event = self.schedule(
                    linear_day("Samedi 31 octobre 2026", (clock, "Émission", "En reprise"))
                )["events"][0]
                self.assertEqual(event["end"], expected_end)

    def test_date_requires_source_year_and_matching_weekday(self):
        for heading in ["Dimanche 25 octobre", "Lundi 25 octobre 2026", "Dimanche 32 octobre 2026"]:
            with (
                self.subTest(heading=heading),
                self.assertRaisesRegex(ValueError, "dated day headings"),
            ):
                quebec_canal_assemblee.parse(
                    linear_day(heading, ("18 h à 19 h", "Sans date fiable", "En reprise")),
                    now=datetime(2026, 1, 1, tzinfo=UTC),
                )
        event = self.schedule(
            linear_day("Dimanche 1 février 2026", ("18 h à 19 h", "Hiver", "En reprise"))
        )["events"][0]
        self.assertEqual(event["start"], "2026-02-01T23:00:00Z")

    def test_expired_week_does_not_remain_a_current_schedule(self):
        html = linear_day("Dimanche 25 octobre 2026", ("18 h à 19 h", "Émission", "En reprise"))
        with self.assertRaisesRegex(ValueError, "stale.*2026-10-25"):
            quebec_canal_assemblee.parse(html, now=datetime(2026, 11, 2, tzinfo=UTC))

    def test_changed_markup_is_not_a_healthy_empty_schedule(self):
        for html in [
            "garbage",
            "<h3>Dimanche 25 octobre 2026</h3><div>18 h à 20 h: changed programme markup</div>",
            "<h3>Dimanche 25 octobre 2026</h3>"
            "<p>New programme layout without recognizable timing</p>",
        ]:
            with self.subTest(html=html), self.assertRaises(ValueError):
                quebec_canal_assemblee.parse(html, now=datetime(2026, 10, 25, tzinfo=UTC))

    def test_dated_current_week_without_programmes_is_genuinely_empty(self):
        html = '<h3>Dimanche 25 octobre 2026</h3><div class="hr"><hr /></div>'
        self.assertEqual(
            quebec_canal_assemblee.parse(html, now=datetime(2026, 10, 25, 18, tzinfo=UTC)), {}
        )

    def test_past_broadcasts_in_the_current_source_week_remain_available(self):
        html = linear_day("Lundi 19 octobre 2026", ("14 h à 15 h", "Déjà diffusé", "En reprise"))
        schedule = self.schedule(html, datetime(2026, 10, 21, 18, tzinfo=UTC))
        self.assertEqual(len(schedule["events"]), 1)
        self.assertEqual(schedule["events"][0]["status"], "completed")
        self.assertIsNone(schedule["current_event_title"])
        self.assertIsNone(schedule["next_event_title"])

    def test_sidebar_and_footer_do_not_become_programme_markup(self):
        html = linear_day("Dimanche 25 octobre 2026", ("18 h à 19 h", "Émission", "En reprise"))
        html += '<div class="colonneImbriquee imbDroite"><p>Unrelated sidebar content</p></div>'
        self.assertEqual(len(self.schedule(html)["events"]), 1)

    def test_incompatible_source_weeks_are_not_combined(self):
        html = "<h3>Dimanche 25 octobre 2026</h3><h3>Dimanche 1 novembre 2026</h3>"
        with self.assertRaisesRegex(ValueError, "one source week"):
            quebec_canal_assemblee.parse(html, now=datetime(2026, 10, 25, tzinfo=UTC))


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
    def test_naive_exact_clock_uses_toronto_not_runner_timezone(self):
        for raw, expected in [
            ("2026-01-15T10:00:00", "2026-01-15T15:00:00Z"),
            ("2026-10-26T10:00:00", "2026-10-26T14:00:00Z"),
            ("2026-10-26T10:00:00+00:00", "2026-10-26T10:00:00Z"),
        ]:
            with self.subTest(raw=raw):
                html = f'<time datetime="{raw}"></time><h2>House sitting</h2>'
                event = ontario_calendar.parse(html, now=datetime(2026, 1, 1, tzinfo=UTC))[
                    "ontario-house-en"
                ]["events"][0]
                self.assertEqual(event["start"], expected)
                self.assertNotIn("end", event)

    def test_date_only_and_ambiguous_or_nonexistent_clocks_are_held(self):
        for raw in ["2026-10-26", "2026-11-01T01:30:00", "2026-03-08T02:30:00"]:
            with self.subTest(raw=raw):
                html = f'<time datetime="{raw}"></time><h2>House sitting</h2>'
                self.assertEqual(
                    ontario_calendar.parse(html, now=datetime(2026, 1, 1, tzinfo=UTC)), {}
                )


if __name__ == "__main__":
    unittest.main()
