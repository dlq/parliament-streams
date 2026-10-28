"""Source failures stay isolated; uncertain clocks never become live broadcasts."""

import json
import unittest
from datetime import UTC, datetime
from unittest.mock import patch

from parliament_streams import schedule_collection
from parliament_streams.scrapers import SCRAPERS, european_parliament, uk_parliament

NOW = datetime(2026, 10, 28, 12, tzinfo=UTC)


class ScraperStabilityTests(unittest.TestCase):
    def test_malformed_responses_do_not_stop_other_sources(self):
        # Exercise every collector through the orchestration boundary, including
        # collectors making multiple requests. The healthy UK fixture must survive.
        good = json.dumps(
            [
                {
                    "StartDate": "2026-10-29",
                    "StartTime": "10:00",
                    "Type": "Main Chamber",
                    "Description": "Questions",
                    "House": "Commons",
                }
            ]
        )
        for scraper_id, module in SCRAPERS.items():
            if scraper_id == "uk-parliament":
                continue
            for payload in [
                "null",
                "[]",
                "{}",
                '["unexpected"]',
                "[{}]",
                '{"d":["unexpected"]}',
                "<html>Access denied</html>",
            ]:
                with self.subTest(scraper=scraper_id, payload=payload):

                    def fetch(spec, timeout, retries, response=payload):
                        return good if spec["url"].startswith(uk_parliament.API_URL) else response

                    with patch.dict(
                        schedule_collection.SCRAPERS,
                        {scraper_id: module, "uk-parliament": uk_parliament},
                        clear=True,
                    ):
                        result = schedule_collection.collect_schedules(now=NOW, fetcher=fetch)
                    self.assertEqual(result["sources"]["uk-parliament"]["status"], "ok")
                    self.assertIn(uk_parliament.CHANNEL_ID, result["channels"])
        for payload in ["null", "{}", '["unexpected"]']:
            with self.subTest(uk_payload=payload), self.assertRaises(ValueError):
                uk_parliament.parse(payload, NOW)

    def test_uk_source_zone_handles_seasons_and_rejects_ambiguous_clocks(self):
        for day, clock, expected in [
            ("2026-07-01", "10:00", "2026-07-01T09:00:00Z"),
            ("2026-12-01", "10:00", "2026-12-01T10:00:00Z"),
            ("2026-03-29", "01:30", None),
            ("2026-10-25", "01:30", None),
        ]:
            with self.subTest(day=day):
                payload = json.dumps(
                    [
                        {
                            "StartDate": day,
                            "StartTime": clock,
                            "Type": "Main Chamber",
                            "Description": "Questions",
                        }
                    ]
                )
                result = uk_parliament.parse(payload, datetime(2026, 1, 1, tzinfo=UTC))
                if expected is None:
                    self.assertEqual(result, {})
                else:
                    self.assertEqual(
                        result[uk_parliament.CHANNEL_ID]["events"][0]["start"], expected
                    )

    def test_start_only_and_naive_european_events_are_not_claimed_live(self):
        payload = json.dumps(
            {
                "pageProps": {
                    "mediaItems": [
                        {"title": "Earlier start only", "EventDateStart": "2026-10-28T09:00:00Z"},
                        {"title": "Naive timestamp", "EventDateStart": "2026-10-29T10:00:00"},
                        {"title": "Tomorrow", "EventDateStart": "2026-10-29T10:00:00Z"},
                    ]
                }
            }
        )
        schedule = european_parliament.parse(payload, NOW)[european_parliament.CHANNEL_ID]
        self.assertIsNone(schedule["current_event_title"])
        self.assertEqual(schedule["next_event_title"], "Tomorrow")
        self.assertEqual(len(schedule["events"]), 2)

    def test_nested_json_shape_changes_raise_source_errors(self):
        for scraper, payload in [
            ("ebs-grid", '[{"programs":[{"titles":["unexpected"]}]}]'),
            ("ebs-grid", '[{"channel":[]}]'),
            ("ebs-grid", '[{"programs":{}}]'),
            ("europarl-webstreaming", '{"pageProps":[]}'),
            ("europarl-webstreaming", '{"pageProps":{"mediaItems":["unexpected"]}}'),
            ("quebec-webdiffusion", '{"d":["unexpected"]}'),
        ]:
            with self.subTest(scraper=scraper), self.assertRaises(ValueError):
                module = SCRAPERS[scraper]
                if scraper == "quebec-webdiffusion":
                    module.parse(payload, payload, now=NOW)
                else:
                    module.parse(payload, now=NOW)
