"""Official future events must keep their identities, zones and mapping limits."""

import json
import unittest
from datetime import UTC, datetime
from unittest.mock import patch

from parliament_streams.catalogue import load_catalogue
from parliament_streams.schedule_collection import collect_schedules
from parliament_streams.schedule_quality import assess_schedules
from parliament_streams.scrapers import SCRAPERS, italy_camera, taiwan_parliamentary_tv

NOW = datetime(2026, 10, 26, 21, 30, tzinfo=UTC)


def italian_card(
    event_id="32692", start="2026-10-27 11:00:00", kind="futuro", title="Chamber debate"
):
    return f'''<li data-id_evento="{event_id}" data-ch_evento="11"
      data-tipo_evento="{kind}" data-dataora="{start}" data-datora_fine="2026-10-27 17:00:00">
      <div class="canale"><a>Assemblea</a></div>
      <div class="titolo"><a>{title}</a></div></li>'''


def italian_page(cards):
    return f'<div id="in_evidenza_items_container"><ul>{cards}</ul></div>'


class ItalyCameraTests(unittest.TestCase):
    def parse(self, cards, now=NOW):
        return italy_camera.parse(italian_page(cards), now=now)

    def test_explicit_start_identity_room_and_unknown_end(self):
        schedule = self.parse(italian_card())[italy_camera.CHANNEL_ID]
        event = schedule["events"][0]
        self.assertEqual(event["start"], "2026-10-27T10:00:00Z")
        self.assertEqual(event["source_timezone"], "Europe/Rome")
        self.assertEqual(event["id"], "32692")
        self.assertEqual(event["identifier_kind"], "official")
        self.assertEqual(event["url"], "https://webtv.camera.it/evento/32692")
        self.assertEqual(event["location"], "Assemblea")
        self.assertNotIn("end", event)
        self.assertIsNone(schedule["current_event_title"])

    def test_archive_live_past_and_outside_window_do_not_become_upcoming(self):
        for card in [
            italian_card(kind="vod"),
            italian_card(kind="live"),
            italian_card(start="2026-10-25 11:00:00"),
            italian_card(start="2026-12-27 11:00:00"),
        ]:
            with self.subTest(card=card):
                self.assertEqual(self.parse(card), {})

    def test_rooms_remain_distinct_and_exact_duplicates_collapse(self):
        one = italian_card()
        two = (
            italian_card(event_id="32693", title="Committee hearing")
            .replace('data-ch_evento="11"', 'data-ch_evento="28"')
            .replace("Assemblea", "VIII Ambiente")
        )
        events = self.parse(one + one + two)[italy_camera.CHANNEL_ID]["events"]
        self.assertEqual(len(events), 2)
        self.assertEqual({e["location"] for e in events}, {"Assemblea", "VIII Ambiente"})

    def test_conflicting_identity_fails(self):
        with self.assertRaisesRegex(ValueError, "Conflicting"):
            self.parse(italian_card() + italian_card(title="Changed debate"))

    def test_missing_or_invalid_metadata_fails(self):
        for card in [
            italian_card(event_id="../unsafe"),
            italian_card(start="2026-02-30 11:00:00"),
            italian_card(start="11:00"),
            italian_card(kind="unknown"),
            italian_card(title=""),
            italian_card().replace("Assemblea", ""),
            italian_card().replace('data-ch_evento="11"', 'data-ch_evento=""'),
        ]:
            with self.subTest(card=card), self.assertRaises(ValueError):
                self.parse(card)

    def test_healthy_empty_is_distinct_from_changed_or_truncated_page(self):
        self.assertEqual(self.parse(""), {})
        valid = italian_page(italian_card())
        for html in [
            "<html>Loading…</html>",
            '<div id="in_evidenza_items_container">Loading…</div>',
            valid.replace("</ul>", ""),
            valid[:-6],
            valid + valid,
            valid.replace("</li>", ""),
        ]:
            with self.subTest(html=html), self.assertRaises(ValueError):
                italy_camera.parse(html, now=NOW)

    def test_dst_gaps_and_folds_are_not_guessed(self):
        for date in ["2026-03-29 02:30:00", "2026-10-25 02:30:00"]:
            with self.subTest(date=date), self.assertRaisesRegex(ValueError, "source time"):
                self.parse(italian_card(start=date))

    def test_summer_clock_uses_source_zone(self):
        now = datetime(2026, 7, 1, tzinfo=UTC)
        event = self.parse(italian_card(start="2026-07-02 11:00:00"), now=now)[
            italy_camera.CHANNEL_ID
        ]["events"][0]
        self.assertEqual(event["start"], "2026-07-02T09:00:00Z")


def taiwan_rows(clock="09:00", title="Committee broadcast", subtitle="Replay", marker="N"):
    return json.dumps(
        [{"ptime": clock, "pname": title, "subname": subtitle, "now": marker}], ensure_ascii=False
    )


def taiwan_window(body=None):
    return [body or taiwan_rows()] + ["[]"] * 5


class TaiwanProgrammeTests(unittest.TestCase):
    def parse(self, body):
        return taiwan_parliamentary_tv.parse(*taiwan_window(body), now=NOW)

    def test_dated_request_uses_source_day_and_exact_feed_ids(self):
        specs = taiwan_parliamentary_tv.request_specs(NOW)
        self.assertEqual(len(specs), 6)
        self.assertIn("ch=ly1&date=2026%2F10%2F27", specs[0]["url"])
        self.assertIn("ch=ly2&date=2026%2F10%2F29", specs[-1]["url"])

    def test_explicit_clock_and_separate_feed_labels(self):
        args = [taiwan_rows(), taiwan_rows()] + ["[]"] * 4
        schedule = taiwan_parliamentary_tv.parse(*args, now=NOW)[taiwan_parliamentary_tv.CHANNEL_ID]
        events = schedule["events"]
        self.assertEqual(len(events), 2)
        self.assertEqual({e["location"] for e in events}, {"國會頻道１", "國會頻道２"})
        self.assertEqual(len({e["id"] for e in events}), 2)
        for event in events:
            self.assertEqual(event["start"], "2026-10-27T01:00:00Z")
            self.assertEqual(event["source_timezone"], "Asia/Taipei")
            self.assertEqual(event["identifier_kind"], "generated")
            self.assertNotIn("end", event)
        self.assertIsNone(schedule["current_event_title"])

    def test_replay_dates_in_titles_do_not_replace_broadcast_date(self):
        event = self.parse(taiwan_rows(subtitle="10/21 recorded meeting"))[
            taiwan_parliamentary_tv.CHANNEL_ID
        ]["events"][0]
        self.assertEqual(event["start"], "2026-10-27T01:00:00Z")
        self.assertIn("10/21", event["title"])

    def test_healthy_empty_is_distinct_from_error_shape(self):
        self.assertEqual(taiwan_parliamentary_tv.parse(*(["[]"] * 6), now=NOW), {})
        for body in ["{}", "null", "<html>Loading</html>", "[1]", "[{}]"]:
            with self.subTest(body=body), self.assertRaises(ValueError):
                self.parse(body)
        with self.assertRaises(ValueError):
            taiwan_parliamentary_tv.parse("[]", now=NOW)

    def test_invalid_clock_title_and_unknown_status_fail(self):
        for body in [
            taiwan_rows(clock="25:00"),
            taiwan_rows(clock="9:00"),
            taiwan_rows(title=""),
            taiwan_rows(subtitle=None),
            taiwan_rows(marker="unknown"),
        ]:
            with self.subTest(body=body), self.assertRaises(ValueError):
                self.parse(body)

    def test_exact_duplicates_collapse_but_conflicting_slots_fail(self):
        one = json.loads(taiwan_rows())[0]
        schedule = self.parse(json.dumps([one, one]))[taiwan_parliamentary_tv.CHANNEL_ID]
        self.assertEqual(len(schedule["events"]), 1)
        with self.assertRaisesRegex(ValueError, "Conflicting"):
            self.parse(json.dumps([one, {**one, "pname": "Different"}]))

    def test_no_rollover_or_next_start_end_inference(self):
        rows = [json.loads(taiwan_rows(clock=clock))[0] for clock in ["22:00", "01:00"]]
        with self.assertRaisesRegex(ValueError, "rollover"):
            self.parse(json.dumps(rows))
        rows.reverse()
        events = self.parse(json.dumps(rows))[taiwan_parliamentary_tv.CHANNEL_ID]["events"]
        self.assertTrue(all("end" not in e for e in events))

    def test_past_start_and_now_flag_do_not_prove_current_playback(self):
        self.assertEqual(self.parse(taiwan_rows(clock="01:00", marker="Y")), {})
        event = self.parse(taiwan_rows(subtitle=False))[taiwan_parliamentary_tv.CHANNEL_ID][
            "events"
        ][0]
        self.assertEqual(event["title"], "Committee broadcast")


class EventDirectoryIntegrationTests(unittest.TestCase):
    def test_collectors_publish_events_without_linear_xmltv_admission(self):
        modules = [italy_camera, taiwan_parliamentary_tv]
        bodies = {italy_camera.SOURCE["url"]: italian_page(italian_card())}
        bodies.update(
            {
                spec["url"]: body
                for spec, body in zip(
                    taiwan_parliamentary_tv.request_specs(NOW), taiwan_window(), strict=True
                )
            }
        )
        with patch(
            "parliament_streams.schedule_collection.SCRAPERS", {m.SOURCE["id"]: m for m in modules}
        ):
            snapshot = collect_schedules(
                now=NOW, fetcher=lambda spec, timeout, retries: bodies[spec["url"]]
            )
        self.assertEqual(snapshot["counts"]["ok"], 2)
        self.assertEqual(snapshot["counts"]["events_with_official_id"], 1)
        self.assertEqual(snapshot["counts"]["events_with_end"], 0)
        assessment = assess_schedules(load_catalogue(), snapshot)
        for module in modules:
            self.assertIs(SCRAPERS[module.SOURCE["id"]], module)
            row = assessment.report["channels"][module.CHANNEL_ID]
            self.assertEqual(row["scope"], "event_directory")
            self.assertFalse(row["linear_guide_eligible"])
            self.assertEqual(row["exportable"], 0)

    def test_source_shape_failure_does_not_become_healthy_empty(self):
        module = taiwan_parliamentary_tv
        with patch(
            "parliament_streams.schedule_collection.SCRAPERS", {module.SOURCE["id"]: module}
        ):
            result = collect_schedules(now=NOW, fetcher=lambda spec, timeout, retries: "Loading")
        self.assertEqual(result["sources"][module.SOURCE["id"]]["status"], "error")


if __name__ == "__main__":
    unittest.main()
