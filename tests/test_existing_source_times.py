"""Regression coverage for observed EBS and Senate timing/channel contracts."""

import json
import unittest
from datetime import UTC, datetime
from urllib.parse import parse_qs, urlsplit

from parliament_streams.scrapers import ebs, italian_senate


class EbsProgrammeTimesTests(unittest.TestCase):
    @staticmethod
    def programme(**overrides):
        return {
            "id": "6acdd4384cda7d4921cecb4c",
            "startDatetime": "2026-10-23T10:18:06.560Z",
            "duration": 2552.04,
            "channelId": "60771dc55de36aa6eb4759c6",
            "titles": [{"language": "EN", "content": "<p>Midday briefing</p>"}],
            **overrides,
        }

    @classmethod
    def payload(cls, programmes, **day_overrides):
        return json.dumps(
            [
                {
                    "date": "20261023",
                    "channel": {"name": "EBS", "id": "60771dc55de36aa6eb4759c6"},
                    "programs": programmes,
                    **day_overrides,
                }
            ]
        )

    def test_fractional_source_duration_preserves_end_second_and_identity(self):
        schedule = ebs.parse(
            self.payload([self.programme()]),
            datetime(2026, 10, 23, 11, 0, 38, 580000, tzinfo=UTC),
        )[ebs.CHANNEL_ID]
        self.assertEqual(schedule["current_event_title"], "Midday briefing")
        event = schedule["events"][0]
        self.assertEqual(event["start"], "2026-10-23T10:18:06Z")
        self.assertEqual(event["end"], "2026-10-23T11:00:38Z")
        self.assertEqual(event["id"], "6acdd4384cda7d4921cecb4c")
        self.assertEqual(event["identifier_kind"], "official")
        self.assertEqual(event["start_basis"], "source")
        self.assertEqual(event["end_basis"], "source")
        self.assertEqual(event["source_timezone"], "Europe/Brussels")

    def test_unusable_duration_does_not_infer_end_from_next_day_or_listing(self):
        for duration in [None, 0, -1, "unknown", "NaN", "Infinity", True, {}, 1e100]:
            with self.subTest(duration=duration):
                payload = json.loads(self.payload([self.programme(duration=duration)]))
                payload[0]["programs"].append(
                    self.programme(id="later", startDatetime="2026-10-23T15:00:00Z", duration=0)
                )
                payload.append(
                    {
                        **payload[0],
                        "date": "20261024",
                        "programs": [
                            self.programme(
                                id="tomorrow", startDatetime="2026-10-24T09:00:00Z", duration=0
                            )
                        ],
                    }
                )
                schedule = ebs.parse(json.dumps(payload), datetime(2026, 10, 23, 9, tzinfo=UTC))[
                    ebs.CHANNEL_ID
                ]
                self.assertTrue(all("end" not in event for event in schedule["events"]))
                self.assertIsNone(schedule["current_event_title"])

    def test_rejects_other_channel_and_naive_source_time(self):
        now = datetime(2026, 10, 23, 9, tzinfo=UTC)
        self.assertEqual(
            ebs.parse(
                self.payload([self.programme()], channel={"name": "EBS+", "id": "other"}), now
            ),
            {},
        )
        schedule = ebs.parse(
            self.payload(
                [
                    self.programme(id="wrong-room", channelId="other"),
                    self.programme(id="naive", startDatetime="2026-10-23T10:00:00"),
                    self.programme(),
                ]
            ),
            now,
        )[ebs.CHANNEL_ID]
        self.assertEqual([event["id"] for event in schedule["events"]], [self.programme()["id"]])

    def test_requests_use_brussels_day_across_midnight_and_dst(self):
        for instant, first_day, last_day in [
            (datetime(2026, 3, 29, 22, 30, tzinfo=UTC), "20260330", "20260331"),
            (datetime(2026, 10, 25, 23, 30, tzinfo=UTC), "20261026", "20261027"),
        ]:
            with self.subTest(instant=instant):
                query = parse_qs(urlsplit(ebs.request_specs(instant)[0]["url"]).query)
                self.assertEqual(query["dateFrom"], [first_day])
                self.assertEqual(query["dateTo"], [last_day])
                self.assertEqual(query["channelName"], ["EBS"])


class ItalianSenateProgrammeTimesTests(unittest.TestCase):
    @staticmethod
    def event(**overrides):
        return {
            "nid": "126145",
            "title": "<p>Sicurezza e prevenzione</p>",
            "field_date": "12:00",
            "field_channel_id": "13440",
            "field_vevent_channel": "WebTV1",
            "field_vevent_location": "Aula 1a Commissione",
            "view_node": "https://webtv.senato.it/webtv/commissioni/sicurezza-e-prevenzione",
            **overrides,
        }

    def test_mixed_rooms_require_affirmative_channel_identity_and_deduplicate(self):
        accepted = self.event()
        events = [accepted, accepted]
        for fields in [
            {"field_channel_id": "13459", "field_vevent_channel": "WebTV2"},
            {"field_channel_id": "13459"},
            {"field_vevent_channel": "WebTV2"},
            {"field_channel_id": ""},
            {"field_vevent_channel": ""},
        ]:
            events.append(self.event(nid="wrong-room", **fields))
        events.append({"title": "Unmapped event", "field_date": "11:00"})
        schedule = italian_senate.parse(
            json.dumps(events), now=datetime(2026, 10, 20, 8, tzinfo=UTC)
        )["italy-senate"]
        self.assertEqual(len(schedule["events"]), 1)
        event = schedule["events"][0]
        self.assertEqual(event["id"], "126145")
        self.assertEqual(event["identifier_kind"], "official")
        self.assertEqual(event["title"], "Sicurezza e prevenzione")
        self.assertEqual(event["location"], "Aula 1a Commissione")
        self.assertEqual(event["url"], accepted["view_node"])
        self.assertEqual(event["start"], "2026-10-20T10:00:00Z")
        self.assertEqual(event["source_timezone"], "Europe/Rome")

    def test_starts_only_never_fabricate_ends_even_for_same_room_or_next_day(self):
        schedule = italian_senate.parse(
            json.dumps([self.event(), self.event(nid="126149", field_date="12:30")]),
            json.dumps([self.event(nid="tomorrow", field_date="09:00")]),
            now=datetime(2026, 10, 20, 8, tzinfo=UTC),
        )["italy-senate"]
        self.assertEqual(len(schedule["events"]), 3)
        self.assertTrue(all("end" not in event for event in schedule["events"]))
        self.assertEqual(schedule["events"][2]["start"], "2026-10-21T07:00:00Z")

    def test_invalid_clocks_do_not_abort_other_events(self):
        for clock in ["24:00", "12:60", "12", "unknown", "12:00 invalid"]:
            with self.subTest(clock=clock):
                schedule = italian_senate.parse(
                    json.dumps([self.event(nid="invalid", field_date=clock), self.event()]),
                    now=datetime(2026, 10, 20, 8, tzinfo=UTC),
                )["italy-senate"]
                self.assertEqual([event["id"] for event in schedule["events"]], ["126145"])

    def test_rome_day_and_programme_offset_follow_dst_without_runner_timezone(self):
        for instant, date_text, start in [
            (
                datetime(2026, 3, 28, 23, 30, tzinfo=UTC),
                "2026-03-29",
                "2026-03-29T10:00:00Z",
            ),
            (
                datetime(2026, 10, 24, 22, 30, tzinfo=UTC),
                "2026-10-25",
                "2026-10-25T11:00:00Z",
            ),
        ]:
            with self.subTest(instant=instant):
                query = parse_qs(urlsplit(italian_senate.request_specs(instant)[0]["url"]).query)
                self.assertEqual(query["field_date_value[min]"], [f"{date_text}T00:00:00"])
                schedule = italian_senate.parse(json.dumps([self.event()]), now=instant)[
                    "italy-senate"
                ]
                event = schedule["events"][0]
                self.assertEqual(event["start"], start)

    def test_ambiguous_or_nonexistent_rome_clock_is_not_guessed(self):
        for instant in [
            datetime(2026, 3, 29, 0, tzinfo=UTC),
            datetime(2026, 10, 25, 0, tzinfo=UTC),
        ]:
            with self.subTest(instant=instant):
                schedule = italian_senate.parse(
                    json.dumps([self.event(nid="uncertain", field_date="02:30"), self.event()]),
                    now=instant,
                )["italy-senate"]
                self.assertEqual([event["id"] for event in schedule["events"]], ["126145"])


if __name__ == "__main__":
    unittest.main()
