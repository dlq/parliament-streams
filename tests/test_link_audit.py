import unittest
from typing import cast
from unittest.mock import patch

from parliament_streams.link_audit import audit_catalogue_links, catalogue_links
from parliament_streams.models import Catalogue


def sample_catalogue() -> Catalogue:
    channel = {
        "id": "sample",
        "official_url": "https://example.test/official",
        "permission": {
            "evidence": [
                "https://example.test/official",
                "https://example.test/terms",
            ]
        },
        "identity_sources": [{"source": "wikidata", "url": "https://example.test/identity"}],
        "embed": {
            "url": "https://example.test/embed",
            "live_url": "https://example.test/live",
        },
    }
    return cast(Catalogue, {"channels": [channel]})


class LinkAuditTests(unittest.TestCase):
    def test_catalogue_links_deduplicates_urls_and_preserves_roles(self):
        links = catalogue_links(sample_catalogue())
        self.assertEqual(len(links), 5)
        self.assertEqual(
            links["https://example.test/official"]["roles"],
            {"official_page", "permission_evidence"},
        )
        self.assertEqual(links["https://example.test/identity"]["roles"], {"identity_wikidata"})

    def test_audit_classifies_every_http_outcome(self):
        statuses = {
            "official": 200,
            "terms": 403,
            "identity": 404,
            "embed": 500,
            "live": None,
        }

        def fetch(url: str, _timeout: int, _retries: int):
            key = url.rsplit("/", maxsplit=1)[-1]
            status = statuses[key]
            return status, {"content-type": "text/html"}, b"", url, 1

        with patch("parliament_streams.link_audit.fetch_url", side_effect=fetch):
            report = audit_catalogue_links(sample_catalogue(), timeout=1, retries=0, workers=2)

        self.assertEqual(
            report["counts"],
            {
                "reachable": 1,
                "access_blocked": 1,
                "not_found": 1,
                "error": 2,
                "links": 5,
            },
        )
        self.assertEqual(
            [result["url"] for result in report["links"]],
            sorted(f"https://example.test/{name}" for name in statuses),
        )
        reachable = next(result for result in report["links"] if result["status"] == "reachable")
        self.assertEqual(reachable["response_bytes"], 0)
        self.assertEqual(
            reachable["body_sha256"],
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        )
        self.assertTrue(
            all(
                result["body_sha256"] is None
                for result in report["links"]
                if result["status"] != "reachable"
            )
        )


if __name__ == "__main__":
    unittest.main()
