from __future__ import annotations

import unittest
from typing import cast

from parliament_streams.discovery import build_discovery_findings, parse_discovery_decisions
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
                            "status": "ok",
                            "url": "https://example.test/vod/archive/playlist.m3u8",
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

        self.assertEqual(
            report["counts"],
            {"validated": 3, "catalogued": 1, "reviewed": 0, "review": 2},
        )
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

    def test_catalogue_master_covers_child_playlists(self) -> None:
        catalogue = cast(
            Catalogue,
            {
                "channels": [
                    {
                        "playback_url": "https://media.example/live/channel/master.m3u8",
                        "embed": None,
                    }
                ]
            },
        )
        report = build_discovery_findings(
            catalogue,
            [
                (
                    "static.json",
                    {
                        "tier": "tier1",
                        "countries": [
                            {
                                "country": "Example",
                                "results": [
                                    {
                                        "status": "ok",
                                        "url": "https://media.example/live/channel/720p/chunklist.m3u8",
                                    }
                                ],
                            }
                        ],
                    },
                )
            ],
            [],
            checked_at="2026-08-17T00:00:00Z",
        )
        self.assertEqual(report["findings"][0]["status"], "catalogued")

    def test_retains_reviewed_manifest_decisions_without_reopening_them(self) -> None:
        catalogue = cast(Catalogue, {"channels": []})
        url = "https://government.example/live/playlist.m3u8"
        report = build_discovery_findings(
            catalogue,
            [
                (
                    "static.json",
                    {
                        "tier": "tier2",
                        "countries": [
                            {
                                "country": "Example",
                                "results": [{"status": "ok", "url": url}],
                            }
                        ],
                    },
                )
            ],
            [],
            decisions=[
                {
                    "country": "Example",
                    "url": url,
                    "disposition": "out_of_scope",
                    "reviewed_on": "2026-08-17",
                    "reason": "Executive broadcaster, not a parliamentary service.",
                    "evidence": ["https://government.example/about"],
                }
            ],
            checked_at="2026-08-17T00:00:00Z",
        )

        self.assertEqual(report["counts"]["review"], 0)
        self.assertEqual(report["counts"]["reviewed"], 1)
        self.assertEqual(report["findings"][0]["status"], "reviewed")
        self.assertEqual(report["findings"][0]["disposition"], "out_of_scope")

    def test_rejects_malformed_discovery_decisions(self) -> None:
        with self.assertRaisesRegex(ValueError, "decision_version"):
            parse_discovery_decisions({"decision_version": 2, "decisions": []})
        with self.assertRaisesRegex(ValueError, "unknown disposition"):
            parse_discovery_decisions(
                {
                    "decision_version": 1,
                    "decisions": [
                        {
                            "country": "Example",
                            "url": "https://example.test/live.m3u8",
                            "disposition": "maybe",
                            "reviewed_on": "2026-08-17",
                            "reason": "Reviewed.",
                            "evidence": ["https://example.test/"],
                        }
                    ],
                }
            )
        with self.assertRaisesRegex(ValueError, "exactly one URL or URL prefix"):
            parse_discovery_decisions(
                {
                    "decision_version": 1,
                    "decisions": [
                        {
                            "country": "Example",
                            "disposition": "third_party",
                            "reviewed_on": "2026-08-17",
                            "reason": "Reviewed.",
                            "evidence": ["https://example.test/"],
                        }
                    ],
                }
            )

    def test_review_decision_can_match_a_rotating_url_prefix(self) -> None:
        catalogue = cast(Catalogue, {"channels": []})
        report = build_discovery_findings(
            catalogue,
            [
                (
                    "static.json",
                    {
                        "tier": "tier2",
                        "countries": [
                            {
                                "country": "Example",
                                "results": [
                                    {
                                        "status": "ok",
                                        "url": "https://events.example/2026-08-17/manifest.mpd",
                                    }
                                ],
                            }
                        ],
                    },
                )
            ],
            [],
            decisions=[
                {
                    "country": "Example",
                    "url_prefix": "https://events.example/",
                    "disposition": "event_specific",
                    "reviewed_on": "2026-08-17",
                    "reason": "Rotating event manifests are not stable channels.",
                    "evidence": ["https://example.test/watch"],
                }
            ],
            checked_at="2026-08-17T00:00:00Z",
        )
        self.assertEqual(report["counts"]["reviewed"], 1)


if __name__ == "__main__":
    unittest.main()
