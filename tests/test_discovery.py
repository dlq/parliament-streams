from __future__ import annotations

import unittest
from typing import cast

from parliament_streams.discovery import build_discovery_findings
from parliament_streams.models import Catalogue


class DiscoveryFindingsTests(unittest.TestCase):
    def test_reports_catalogued_and_review_manifests_without_duplicates(self) -> None:
        catalogue = cast(
            Catalogue,
            {
                "channels": [
                    {
                        "playback_url": "https://example.test/known.m3u8",
                        "embed": None,
                    }
                ]
            },
        )
        static = {
            "tier": "tier1",
            "countries": [
                {
                    "country": "Example",
                    "results": [
                        {
                            "status": "ok",
                            "url": "https://example.test/known.m3u8",
                        },
                        {
                            "status": "ok",
                            "url": "https://example.test/new.mpd",
                        },
                        {
                            "status": "warning",
                            "url": "https://example.test/not-valid.m3u8",
                        },
                    ],
                }
            ],
        }
        browser = {
            "countries": [
                {
                    "country": "Example",
                    "tier_report": "data/discovery/tier1.json",
                    "validated_manifests": [
                        {"kind": "dash", "url": "https://example.test/new.mpd"},
                        {"kind": "hls", "url": "https://example.test/browser.m3u8"},
                    ],
                }
            ]
        }

        report = build_discovery_findings(
            catalogue,
            [("static.json", static)],
            [("browser.json", browser)],
            checked_at="2026-08-17T00:00:00Z",
        )

        self.assertEqual(report["counts"], {"validated": 3, "catalogued": 1, "review": 2})
        self.assertEqual(
            {item["url"] for item in report["findings"] if item["status"] == "review"},
            {
                "https://example.test/new.mpd",
                "https://example.test/browser.m3u8",
            },
        )

    def test_ignores_malformed_report_items(self) -> None:
        catalogue = cast(Catalogue, {"channels": []})
        report = build_discovery_findings(
            catalogue,
            [("static.json", {"countries": [{"country": 1, "results": []}]})],
            [("browser.json", {"countries": [{"country": "Example"}]})],
            checked_at="2026-08-17T00:00:00Z",
        )
        self.assertEqual(report["counts"]["validated"], 0)


if __name__ == "__main__":
    unittest.main()
