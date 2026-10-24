import io
import json
import tempfile
import unittest
import urllib.error
from pathlib import Path
from unittest.mock import patch

from tools.wikidata_research import Cooldown, WikidataClient, request_url, retry_after_seconds


class Response(io.BytesIO):
    def __init__(self, data, headers=None):
        super().__init__(json.dumps(data).encode())
        self.headers = headers or {}


class WikidataResearchTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name)
        self.params = {"action": "wbsearchentities", "search": "Test legislature", "language": "en"}

    def test_cache_reuses_empty_search_and_parameter_order(self):
        with (
            patch("tools.wikidata_research.time.time", return_value=1000),
            patch(
                "tools.wikidata_research.urllib.request.urlopen",
                return_value=Response({"search": []}),
            ) as fetch,
        ):
            client = WikidataClient(self.path)
            self.assertEqual(client.get(self.params), {"search": []})
            # Even the cooldown must permit a cache hit, across client instances.
            second = WikidataClient(self.path)
            self.assertEqual(second.get(dict(reversed(list(self.params.items())))), {"search": []})
            self.assertTrue(second.last_cache_hit)
            self.assertEqual(second.last_response_fetched_at, 1000)
            fetch.assert_called_once()

    def test_persisted_increasing_backoff_and_retry_after(self):
        clock = [1000.0]
        with (
            patch("tools.wikidata_research.time.time", side_effect=lambda: clock[0]),
            patch(
                "tools.wikidata_research.urllib.request.urlopen",
                side_effect=lambda *a, **k: Response({"error": {"code": "maxlag"}}),
            ) as fetch,
        ):
            for expected in [60, 120, 240, 480, 960, 1920, 3600, 3600]:
                with self.assertRaises(Cooldown) as held:
                    WikidataClient(self.path).get(self.params)
                self.assertEqual(held.exception.seconds, expected)
                with self.assertRaises(Cooldown):
                    WikidataClient(self.path).get(self.params)
                clock[0] += expected
            self.assertEqual(fetch.call_count, 8)  # Cooldown calls never touch the network.
        self.assertFalse(any(p.name != "service-state.json" for p in self.path.glob("*.json")))
        error = urllib.error.HTTPError(
            request_url(self.params), 429, "rate limited", {"Retry-After": "9000"}, None
        )
        with (
            patch("tools.wikidata_research.time.time", return_value=clock[0]),
            patch("tools.wikidata_research.urllib.request.urlopen", side_effect=error),
            self.assertRaises(Cooldown) as held,
        ):
            WikidataClient(self.path).get(self.params)
        self.assertEqual(held.exception.seconds, 9000)  # Greater of exponential delay and header.
        self.assertEqual(retry_after_seconds("Thu, 01 Jan 1970 00:20:00 GMT", 1000), 200)

    def test_cache_expiry_and_success_reset_the_failure_streak(self):
        client = WikidataClient(self.path)
        client.import_search(request_url(self.params), [], 100, "retained-report.json")
        (self.path / "service-state.json").write_text(json.dumps({"consecutive_failures": 4}))
        with (
            patch("tools.wikidata_research.time.time", return_value=90000),
            patch(
                "tools.wikidata_research.urllib.request.urlopen",
                return_value=Response({"search": [{"id": "Q1"}]}),
            ) as fetch,
        ):
            self.assertEqual(client.get(self.params)["search"], [{"id": "Q1"}])
            fetch.assert_called_once()
        self.assertEqual(
            json.loads((self.path / "service-state.json").read_text())["consecutive_failures"], 0
        )

    def test_import_retains_provenance_and_does_not_refresh_old_results(self):
        client = WikidataClient(self.path)
        self.assertTrue(client.import_search(request_url(self.params), [], 1000, "retained.json"))
        self.assertFalse(
            client.import_search(request_url(self.params), [{"id": "Q2"}], 2000, "new.json")
        )
        with (
            patch("tools.wikidata_research.time.time", return_value=1100),
            patch("tools.wikidata_research.urllib.request.urlopen") as fetch,
        ):
            data = client.get(self.params)
        self.assertEqual(data["search"], [])
        self.assertTrue(data["_retained_fields_only"])
        self.assertEqual(data["_evidence_report"], "retained.json")
        fetch.assert_not_called()
        with self.assertRaises(ValueError):
            client.import_search(
                "https://example.org/w/api.php?action=wbsearchentities", [], 0, "bad"
            )

    def test_access_block_is_a_day_hold_and_spacing_is_shared(self):
        error = urllib.error.HTTPError(request_url(self.params), 403, "forbidden", {}, None)
        with (
            patch("tools.wikidata_research.time.time", return_value=1000),
            patch("tools.wikidata_research.urllib.request.urlopen", side_effect=error),
            self.assertRaises(Cooldown) as held,
        ):
            WikidataClient(self.path).get(self.params)
        self.assertEqual(held.exception.seconds, 86400)

    def test_invalid_query_is_not_cached_or_counted_as_service_failure(self):
        from tools.wikidata_research import QueryError

        with (
            patch("tools.wikidata_research.time.time", return_value=1000),
            patch(
                "tools.wikidata_research.urllib.request.urlopen",
                return_value=Response(
                    {"error": {"code": "params-illegal", "info": "Wrong batch format"}}
                ),
            ),
            self.assertRaisesRegex(QueryError, "Wrong batch format"),
        ):
            WikidataClient(self.path).get(self.params)
        state = json.loads((self.path / "service-state.json").read_text())
        self.assertEqual(state.get("consecutive_failures", 0), 0)
        self.assertEqual(state["next_allowed_at"], 1003)
        self.assertEqual(len(list(self.path.glob("*.json"))), 1)
