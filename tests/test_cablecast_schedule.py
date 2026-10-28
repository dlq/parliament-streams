"""Contract for the retained Cablecast default-channel schedule."""

import json
import unittest
from datetime import UTC, datetime

from parliament_streams.scrapers import rhode_island_cablecast as ri

NOW = datetime(2026, 10, 28, 12, tzinfo=UTC)


def run(**changes):
    return {
        "scheduleItemId": 41,
        "showId": "22",
        "siteId": "1",
        "channelId": 1,
        "title": "Budget debate recorded last week",
        "runDateTime": "2026-10-28T12:00:00Z",
        "endDateTime": "2026-10-28T13:00:00Z",
        "deleted": False,
        "show": {"eventDate": "2020-01-01T00:00:00Z"},
        **changes,
    }


def cablecast(rows, **site_changes):
    site = {
        "host": "capitoltvri.cablecast.tv",
        "siteId": "1",
        "scheduleChannelId": 1,
        "liveStreamId": "1",
        "ianaId": "America/New_York",
        "liveStreamUrl": ri.PAGE_URL + "live/stream-1/live.m3u8",
        **site_changes,
    }
    data = {"state": {"loaderData": {"root": {"site": site, "schedule": {"scheduleItems": rows}}}}}
    return "<script>window.__remixContext = " + json.dumps(data) + ";</script>"


class CablecastTests(unittest.TestCase):
    def test_explicit_broadcast_range_not_recording_date_and_other_channels_excluded(self):
        parsed = ri.parse(
            cablecast(
                [run(), run(scheduleItemId=42, channelId=2), run(scheduleItemId=43, deleted=True)]
            ),
            NOW,
        )[ri.CHANNEL_ID]
        self.assertEqual(len(parsed["events"]), 1)
        event = parsed["events"][0]
        self.assertEqual(event["id"], "41")
        self.assertEqual(event["start"], "2026-10-28T12:00:00Z")
        self.assertEqual(event["end"], "2026-10-28T13:00:00Z")
        self.assertEqual(event["source_timezone"], "America/New_York")
        self.assertEqual(parsed["current_event_title"], event["title"])
        self.assertEqual(event["url"], ri.PAGE_URL + "show/22")

    def test_site_mapping_changes_and_incomplete_ranges_fail(self):
        for field, value in [
            ("scheduleChannelId", 2),
            ("liveStreamId", "2"),
            ("ianaId", "UTC"),
            ("host", "unrelated.example"),
        ]:
            with self.subTest(field=field), self.assertRaises(ValueError):
                ri.parse(cablecast([run()], **{field: value}), NOW)
        for changes in [
            {"runDateTime": "2026-10-28T12:00:00"},
            {"endDateTime": None},
            {"endDateTime": "2026-10-28T11:00:00Z"},
            {"scheduleItemId": "../bad"},
            {"title": ""},
        ]:
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                ri.parse(cablecast([run(**changes)]), NOW)

    def test_explicit_empty_truncation_and_conflicting_ids(self):
        self.assertEqual(ri.parse(cablecast([]), NOW), {})
        self.assertEqual(len(ri.parse(cablecast([run(), run()]), NOW)[ri.CHANNEL_ID]["events"]), 1)
        for body in [
            "<html>Loading</html>",
            cablecast([])[:-9],
            cablecast([]) * 2,
            cablecast([run(), run(title="Other debate")]),
        ]:
            with self.subTest(body=body[:60]), self.assertRaises(ValueError):
                ri.parse(body, NOW)

    def test_utc_ranges_cross_dst_fold_without_guessing(self):
        now = datetime(2026, 11, 1, 5, tzinfo=UTC)
        events = ri.parse(
            cablecast(
                [run(runDateTime="2026-11-01T05:30:00Z", endDateTime="2026-11-01T06:30:00Z")]
            ),
            now,
        )[ri.CHANNEL_ID]["events"]
        self.assertEqual(events[0]["start"], "2026-11-01T05:30:00Z")
        self.assertEqual(events[0]["end"], "2026-11-01T06:30:00Z")
