import json
import tempfile
import unittest
from datetime import UTC, datetime
from email.message import Message
from pathlib import Path
from types import ModuleType
from unittest.mock import patch

from jsonschema import Draft202012Validator, FormatChecker

from parliament_streams import schedule_collection
from parliament_streams.epg_audit import audit_epg_sources

ROOT = Path(__file__).resolve().parents[1]


class ScheduleCollectionTests(unittest.TestCase):
    def test_epg_audit_deduplicates_and_classifies_sources(self):
        catalogue = {
            "schema_version": 1,
            "generated_from": "test",
            "generated_on": "2026-08-17",
            "description": "test",
            "channels": [
                {
                    "id": "one",
                    "epg_sources": [
                        {
                            "scraper": "planned",
                            "scraper_status": "planned",
                            "url": "https://example.test/schedule",
                            "method": "GET",
                            "kind": "calendar",
                        }
                    ],
                },
                {
                    "id": "two",
                    "epg_sources": [
                        {
                            "scraper": "planned",
                            "scraper_status": "planned",
                            "url": "https://example.test/schedule",
                            "method": "GET",
                            "kind": "calendar",
                        },
                        {
                            "scraper": "planned",
                            "scraper_status": "planned",
                            "url": "https://example.test/blocked",
                            "method": "GET",
                            "kind": "calendar",
                        },
                    ],
                },
            ],
        }

        def fetcher(spec, _timeout, _retries):
            if spec["url"].endswith("blocked"):
                raise RuntimeError("HTTP 403")
            return "schedule"

        with patch("parliament_streams.epg_audit.fetch_text", side_effect=fetcher):
            report = audit_epg_sources(
                catalogue,  # type: ignore[arg-type]
                now=datetime(2026, 8, 17, 12, tzinfo=UTC),
            )

        self.assertEqual(report["counts"]["sources"], 2)
        self.assertEqual(report["counts"]["reachable"], 1)
        self.assertEqual(report["counts"]["access_blocked"], 1)
        self.assertEqual(report["sources"][1]["channel_ids"], ["one", "two"])

    def test_collects_successful_sources_and_records_failures(self):
        good = ModuleType("good")
        good.SOURCE = {
            "id": "good",
            "channel_ids": ["channel"],
            "url": "https://example.test/schedule",
            "method": "GET",
        }
        good.parse = lambda _payload, now=None: {
            "channel": {
                "current_event_title": "Question period",
                "current_event_time": "Live now",
                "next_event_title": None,
                "next_event_time": None,
                "confidence": "fixture",
            }
        }
        broken = ModuleType("broken")
        broken.SOURCE = {
            "id": "broken",
            "channel_ids": ["missing"],
            "url": "https://example.test/broken",
            "method": "GET",
        }
        broken.parse = lambda _payload, now=None: {}

        def fetcher(spec, _timeout, _retries):
            if spec["url"].endswith("broken"):
                raise RuntimeError("temporary failure")
            return "fixture"

        with patch.object(schedule_collection, "SCRAPERS", {"good": good, "broken": broken}):
            snapshot = schedule_collection.collect_schedules(
                now=datetime(2026, 8, 17, 12, tzinfo=UTC), fetcher=fetcher
            )

        self.assertEqual(snapshot["counts"], {"ok": 1, "empty": 0, "error": 1, "channels": 1})
        self.assertEqual(snapshot["channels"]["channel"]["scraper"], "good")
        self.assertEqual(snapshot["sources"]["broken"]["status"], "error")

        schema = json.loads((ROOT / "schema/schedules.schema.json").read_text(encoding="utf-8"))
        Draft202012Validator(schema, format_checker=FormatChecker()).validate(snapshot)

    def test_collector_supports_discovery_based_sources(self):
        discovered = ModuleType("discovered")
        discovered.SOURCE = {
            "id": "discovered",
            "channel_ids": ["channel"],
            "url": "https://example.test/index",
            "method": "GET",
        }
        discovered.collect = lambda _fetcher, _now, _timeout, _retries: (
            {
                "channel": {
                    "current_event_title": "Sitting",
                    "current_event_time": "10:00 AM ET",
                    "next_event_title": None,
                    "next_event_time": None,
                    "confidence": "fixture",
                }
            },
            ["https://example.test/index", "https://example.test/data.json"],
        )
        with patch.object(schedule_collection, "SCRAPERS", {"discovered": discovered}):
            snapshot = schedule_collection.collect_schedules(
                now=datetime(2026, 8, 17, 12, tzinfo=UTC)
            )
        self.assertEqual(snapshot["counts"]["ok"], 1)
        self.assertEqual(
            snapshot["sources"]["discovered"]["urls"][-1],
            "https://example.test/data.json",
        )

    def test_fetch_text_encodes_json_post(self):
        headers = Message()
        headers["Content-Type"] = "application/json; charset=utf-8"

        class Response:
            def __init__(self):
                self.headers = headers

            def read(self, _limit):
                return b'{"d": []}'

            def __enter__(self):
                return self

            def __exit__(self, *_args):
                return False

        with patch.object(schedule_collection, "urlopen", return_value=Response()) as opener:
            result = schedule_collection.fetch_text(
                {
                    "url": "https://example.test/api",
                    "method": "POST",
                    "headers": {},
                    "body": {"codeLangue": "fr"},
                },
                timeout=2,
                retries=0,
            )
        self.assertEqual(result, '{"d": []}')
        request = opener.call_args.args[0]
        self.assertEqual(request.method, "POST")
        self.assertEqual(request.data, b'{"codeLangue": "fr"}')

    def test_write_snapshot_creates_json_file(self):
        with patch.object(schedule_collection, "SCRAPERS", {}):
            snapshot = schedule_collection.collect_schedules(
                now=datetime(2026, 8, 17, 12, tzinfo=UTC)
            )
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "nested" / "schedules.json"
            schedule_collection.write_snapshot(output, snapshot)
            self.assertEqual(json.loads(output.read_text())["schema_version"], 1)


if __name__ == "__main__":
    unittest.main()
