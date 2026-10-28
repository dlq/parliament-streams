"""Source contracts for the Irish linear channel and Bundestag's channel-1 preview."""

from __future__ import annotations

import unittest
from datetime import UTC, datetime
from unittest.mock import patch
from zoneinfo import ZoneInfo

from parliament_streams.schedule_collection import collect_schedules
from parliament_streams.scrapers import SCRAPERS, germany_bundestag, ireland_oireachtas

NOW = datetime(2026, 10, 26, 5, 37, tzinfo=UTC)


def epoch(value):
    return int(datetime.fromisoformat(value).timestamp())


def irish_event(start, end, title="Synthetic programme"):
    return (
        '<div class="event"><div class="event-time" '
        f'data-start-time="{epoch(start)}" data-end-time="{epoch(end)}">clock</div>'
        '<div class="event-details"><p class="event-header">'
        f"<strong><p>{title}</p></strong></p></div></div>"
    )


def irish_day(day, events):
    midnight = datetime.fromisoformat(day).replace(tzinfo=ZoneInfo("Europe/Dublin"))
    return (
        '<div class="schedule-day js-day" '
        f'data-day="{int(midnight.timestamp())}"><div class="events">{events}</div></div>'
    )


def irish_guide(days, player="oirtv"):
    return f'<script>App.InitializeLivePage("{player}");</script><div id="guide">{days}</div>'


def german_row(clock="14 bis 18 Uhr", end="2026-11-04T17:00:00+00:00", channel="1"):
    return (
        f'<tr data-channelnumber="{channel}" data-enddate="{epoch(end)}">'
        f'<td class="bt-time"><p>{clock}</p></td>'
        '<td class="bt-video-info"><h4>104. Sitzung &amp; Beratung</h4></td></tr>'
    )


def german_table(rows, day="04.11.2026"):
    return (
        '<table class="bt-ptv-programm-table">'
        f"<caption>Beratungsablauf Mittwoch, {day}</caption><tbody>{rows}</tbody></table>"
    )


def german_guide(tables, channel="1"):
    return (
        f'<div data-playertype="live" data-channelnumber="{channel}"></div>'
        f'<div class="bt-ptv-programm-wrap">{tables}</div>'
    )


class OireachtasTVGuideTests(unittest.TestCase):
    def parse(self, html, now=NOW):
        return ireland_oireachtas.parse(html, now=now)

    def test_only_linear_player_guide_supplies_complete_ranges_and_unknown_language(self):
        html = irish_guide(
            irish_day(
                "2026-10-26",
                irish_event(
                    "2026-10-26T04:20:00+00:00",
                    "2026-10-26T06:30:00+00:00",
                    "A &amp; B <span>(ISL)</span>",
                )
                + irish_event("2026-10-26T06:30:00+00:00", "2026-10-26T07:00:00+00:00"),
            )
        )
        row = self.parse(html)[ireland_oireachtas.CHANNEL_ID]
        self.assertEqual(row["current_event_title"], "A & B (ISL)")
        self.assertEqual(row["next_event_start"], "2026-10-26T06:30:00Z")
        first = row["events"][0]
        self.assertEqual(first["source_timezone"], "Europe/Dublin")
        self.assertEqual(first["end_basis"], "source")
        self.assertEqual(first["identifier_kind"], "generated")
        self.assertNotIn("language", first)
        for other_player in ["dail", "seanad", "committee1"]:
            with self.subTest(player=other_player), self.assertRaisesRegex(ValueError, "linear"):
                self.parse(html.replace('"oirtv"', f'"{other_player}"'))

    def test_terminal_equal_instants_remain_unknown_and_never_bridge_midnight(self):
        html = irish_guide(
            irish_day(
                "2026-10-26",
                irish_event("2026-10-26T23:00:00+00:00", "2026-10-26T23:00:00+00:00"),
            )
            + irish_day(
                "2026-10-27",
                irish_event("2026-10-27T01:00:00+00:00", "2026-10-27T02:00:00+00:00"),
            )
        )
        events = self.parse(html)[ireland_oireachtas.CHANNEL_ID]["events"]
        self.assertNotIn("end", events[0])
        self.assertEqual(events[1]["end"], "2026-10-27T02:00:00Z")
        during_unknown = self.parse(html, now=datetime(2026, 10, 26, 23, 30, tzinfo=UTC))
        self.assertIsNone(during_unknown[ireland_oireachtas.CHANNEL_ID]["current_event_title"])

    def test_unknown_interior_end_preserves_other_complete_programmes(self):
        html = irish_guide(
            irish_day(
                "2026-10-26",
                irish_event("2026-10-26T09:00:00+00:00", "2026-10-26T09:00:00+00:00")
                + irish_event("2026-10-26T10:00:00+00:00", "2026-10-26T11:00:00+00:00"),
            )
        )
        events = self.parse(html)[ireland_oireachtas.CHANNEL_ID]["events"]
        self.assertNotIn("end", events[0])
        self.assertEqual(events[1]["end"], "2026-10-26T11:00:00Z")

    def test_backwards_range_fails(self):
        html = irish_guide(
            irish_day(
                "2026-10-26", irish_event("2026-10-26T09:00:00+00:00", "2026-10-26T08:00:00+00:00")
            )
        )
        with self.assertRaises(ValueError):
            self.parse(html)

    def test_explicit_unix_instants_resolve_both_dst_fold_occurrences(self):
        html = irish_guide(
            irish_day(
                "2026-10-25",
                irish_event("2026-10-25T01:00:00+01:00", "2026-10-25T01:00:00+00:00")
                + irish_event("2026-10-25T01:00:00+00:00", "2026-10-25T02:00:00+00:00"),
            )
        )
        events = self.parse(html, datetime(2026, 10, 24, 20, tzinfo=UTC))[
            ireland_oireachtas.CHANNEL_ID
        ]["events"]
        self.assertEqual(events[0]["start"], "2026-10-25T00:00:00Z")
        self.assertEqual(events[0]["end"], events[1]["start"])
        self.assertEqual(events[1]["end"], "2026-10-25T02:00:00Z")

    def test_dated_empty_guide_is_distinct_from_changed_shell_or_outdated_calendar(self):
        self.assertEqual(self.parse(irish_guide(irish_day("2026-10-26", ""))), {})
        for html in [
            "<html>Loading programme</html>",
            irish_guide(""),
            irish_guide(irish_day("2026-10-19", "")),
        ]:
            with self.subTest(html=html), self.assertRaises(ValueError):
                self.parse(html)

    def test_wrong_group_date_missing_fields_and_truncated_rows_fail_the_contract(self):
        event = irish_event("2026-10-27T09:00:00+00:00", "2026-10-27T10:00:00+00:00")
        wrong_date = irish_guide(irish_day("2026-10-26", event))
        valid = irish_guide(irish_day("2026-10-27", event))
        for html in [
            wrong_date,
            valid.replace("data-end-time", "unknown-end"),
            valid[:-25],
            valid[:-6],
        ]:
            with self.subTest(html=html), self.assertRaises(ValueError):
                self.parse(html)

    def test_future_terminal_identifiers_do_not_depend_on_collection_clock(self):
        html = irish_guide(
            irish_day(
                "2026-10-26",
                irish_event("2026-10-26T23:00:00+00:00", "2026-10-26T23:00:00+00:00"),
            )
        )
        first = self.parse(html)[ireland_oireachtas.CHANNEL_ID]["events"][0]
        second = self.parse(html, datetime(2026, 10, 26, 10, tzinfo=UTC))[
            ireland_oireachtas.CHANNEL_ID
        ]["events"][0]
        self.assertEqual(first["id"], second["id"])
        with self.assertRaisesRegex(ValueError, "timezone offset"):
            self.parse(html, datetime(2026, 10, 26))


class BundestagTVGuideTests(unittest.TestCase):
    def parse(self, html, now=NOW):
        return germany_bundestag.parse(html, now=now)

    def test_channel_1_date_clock_and_epoch_end_agree_and_duplicate_views_collapse(self):
        table = german_table(german_row())
        row = self.parse(german_guide(table + table))[germany_bundestag.CHANNEL_ID]
        self.assertEqual(len(row["events"]), 1)
        event = row["events"][0]
        self.assertEqual(event["title"], "104. Sitzung & Beratung")
        self.assertEqual(event["start"], "2026-11-04T13:00:00Z")
        self.assertEqual(event["end"], "2026-11-04T17:00:00Z")
        self.assertEqual(event["end_basis"], "source")
        self.assertEqual(event["source_timezone"], "Europe/Berlin")
        self.assertIsNone(row["current_event_title"])

    def test_other_channels_and_unscoped_events_are_not_mapped_to_channel_1(self):
        self.assertEqual(self.parse(german_guide(german_table(german_row(channel="2")))), {})
        with self.assertRaisesRegex(ValueError, "channel-1"):
            self.parse(german_guide(german_table(german_row()), channel="2"))
        with self.assertRaisesRegex(ValueError, "complete TV preview"):
            self.parse(german_guide("<table>Generic agenda</table>"))

    def test_summer_offset_and_current_programme_use_source_timezone(self):
        html = german_guide(
            german_table(german_row("14 bis 18 Uhr", "2026-07-01T16:00:00+00:00"), "01.07.2026")
        )
        row = self.parse(html, datetime(2026, 7, 1, 13, tzinfo=UTC))[germany_bundestag.CHANNEL_ID]
        self.assertEqual(row["events"][0]["start"], "2026-07-01T12:00:00Z")
        self.assertEqual(row["current_event_start"], "2026-07-01T12:00:00Z")
        self.assertIsNone(row["next_event_title"])

    def test_explicit_overnight_end_handles_dst_fold_without_guessing_its_offset(self):
        html = german_guide(
            german_table(german_row("23 bis 2.30 Uhr", "2026-10-25T01:30:00+00:00"), "24.10.2026")
        )
        event = self.parse(html, datetime(2026, 10, 24, 20, tzinfo=UTC))[
            germany_bundestag.CHANNEL_ID
        ]["events"][0]
        self.assertEqual(event["start"], "2026-10-24T21:00:00Z")
        self.assertEqual(event["end"], "2026-10-25T01:30:00Z")

    def test_ambiguous_or_nonexistent_start_wall_clock_is_not_assigned_an_offset(self):
        for day, end in [
            ("25.10.2026", "2026-10-25T03:00:00+00:00"),
            ("29.03.2026", "2026-03-29T02:00:00+00:00"),
        ]:
            html = german_guide(german_table(german_row("2.30 bis 4 Uhr", end), day))
            with self.subTest(day=day), self.assertRaisesRegex(ValueError, "source clock"):
                self.parse(html)

    def test_changed_markup_unresolved_times_and_inconsistent_source_end_are_errors(self):
        for html in [
            "<html>Loading</html>",
            german_guide(german_table(german_row("im Anschluss", "2026-11-04T17:00:00+00:00"))),
            german_guide(german_table(german_row(end="2026-11-04T18:00:00+00:00"))),
            german_guide(german_table(german_row(), "99.11.2026")),
        ]:
            with self.subTest(html=html), self.assertRaises(ValueError):
                self.parse(html)
        with self.assertRaisesRegex(ValueError, "complete TV preview"):
            self.parse(german_guide(""))
        self.assertEqual(self.parse(german_guide(german_table(""))), {})
        self.assertEqual(
            self.parse(german_guide(german_table(german_row())), datetime(2026, 11, 7, tzinfo=UTC)),
            {},
        )

    def test_conflicting_duplicate_cannot_replace_a_published_range(self):
        first = german_table(german_row())
        second = german_table(german_row("14 bis 19 Uhr", "2026-11-04T18:00:00+00:00"))
        with self.assertRaisesRegex(ValueError, "conflicting"):
            self.parse(german_guide(first + second))
        with self.assertRaisesRegex(ValueError, "timezone offset"):
            self.parse(german_guide(first), datetime(2026, 10, 26))

    def test_truncated_or_undated_preview_is_not_a_checked_empty_source(self):
        complete = german_guide(german_table(german_row()))
        for html in [
            complete[:-6],
            complete.replace("</table>", ""),
            german_guide('<table class="bt-ptv-programm-table"><tbody></tbody></table>'),
        ]:
            with self.subTest(html=html), self.assertRaises(ValueError):
                self.parse(html)

    def test_collector_keeps_exact_source_provenance_and_complete_ranges(self):
        html = german_guide(german_table(german_row()))
        with patch.dict(SCRAPERS, {germany_bundestag.SOURCE["id"]: germany_bundestag}, clear=True):
            snapshot = collect_schedules(now=NOW, fetcher=lambda *_args: html, retries=0)
        source = snapshot["sources"][germany_bundestag.SOURCE["id"]]
        self.assertEqual(source["status"], "ok")
        self.assertEqual(source["urls"], [germany_bundestag.PAGE_URL])
        self.assertEqual(source["events_with_end"], 1)


if __name__ == "__main__":
    unittest.main()
