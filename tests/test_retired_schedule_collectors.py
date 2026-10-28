"""Retired presentation collectors cannot leak back through last-good recovery or XMLTV."""

import copy
import unittest
from datetime import UTC, datetime
from pathlib import Path
from typing import cast

from parliament_streams.catalogue import load_catalogue
from parliament_streams.iptv import render_xmltv
from parliament_streams.schedule_collection import ScheduleSnapshot, collect_schedules
from parliament_streams.scrapers import SCRAPERS, uk_parliament

ROOT = Path(__file__).resolve().parents[1]
RETIRED_CHANNELS = {
    "brazil-tv-camara": "brazil-tv-camara",
    "canada-harmony": "canada-house-of-commons-parlvu",
    "czech-chamber-plenary": "czech-chamber-of-deputies",
    "france-commission-broadcasts": "france-national-assembly",
    "luxembourg-broadcast-agenda": "luxembourg-chamber-tv",
    "mauritius-parliament-tv-guide": "mauritius-national-assembly-parliament-tv",
    "quebec-canal-assemblee": "quebec-canal-assemblee",
    "spain-canal-parlamento-weekly": "spain-canal-parlamento",
    "youtube-live": "australia-parliament-youtube",
}


class RetiredCollectorTests(unittest.TestCase):
    def previous(self):
        return cast(
            ScheduleSnapshot,
            {
                "generated_at": "2026-10-28T10:00:00Z",
                "channels": {
                    channel: {
                        "scraper": source,
                        "last_success_at": "2026-10-28T10:00:00Z",
                        "events": [
                            {
                                "id": source,
                                "identifier_kind": "official",
                                "title": "Cached listing",
                                "start": "2026-10-29T10:00:00Z",
                                "end": "2026-10-29T11:00:00Z",
                                "start_basis": "source",
                                "status": "scheduled",
                            }
                        ],
                    }
                    for source, channel in RETIRED_CHANNELS.items()
                },
                "sources": {source: {"status": "ok"} for source in RETIRED_CHANNELS},
            },
        )

    def test_retired_sources_are_not_fetched_or_recovered_from_previous_snapshot(self):
        seen = []

        def fetch(spec, timeout, retries):
            seen.append(spec["url"])
            if spec["url"].startswith(uk_parliament.API_URL):
                return "[]"
            raise RuntimeError("Fixture source unavailable")

        snapshot = collect_schedules(
            now=datetime(2026, 10, 28, 12, tzinfo=UTC), previous=self.previous(), fetcher=fetch
        )
        self.assertEqual(set(snapshot["sources"]), set(SCRAPERS))
        self.assertTrue(set(RETIRED_CHANNELS).isdisjoint(snapshot["sources"]))
        self.assertTrue(set(RETIRED_CHANNELS.values()).isdisjoint(snapshot["channels"]))
        self.assertFalse(any("youtube.com" in url for url in seen))
        harmony_requests = [url for url in seen if "parlvu.parl.gc.ca" in url]
        self.assertTrue(harmony_requests)
        self.assertTrue(all("/api/Data/GetUpcomingEvents?" in url for url in harmony_requests))
        self.assertTrue(
            all(not result["used_last_good"] for result in snapshot["sources"].values())
        )

    def test_offline_export_rejects_complete_cached_ranges_from_retired_collectors(self):
        previous = self.previous()
        original = copy.deepcopy(previous)
        xml, programmes, skipped = render_xmltv(
            load_catalogue(ROOT / "data/channels.json"), previous
        )
        self.assertEqual(programmes, 0)
        self.assertEqual(skipped, len(RETIRED_CHANNELS))
        self.assertNotIn(b"<programme ", xml)
        self.assertEqual(previous, original)
