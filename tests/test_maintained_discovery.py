"""Discovery plans preserve exact bodies, safe routes and explicit unchecked work."""

from __future__ import annotations

import copy
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from parliament_streams.inventory.reviews import (
    ROOT,
    load_reviews,
    maintained_page_url,
    review_notes_by_id,
    reviewed_routes,
)
from tools.build_discovery_targets import build_targets
from tools.summarize_discovery_audit import network_coverage
from tools.validate_democracy_tier_static import check_country, run


def inputs():
    inventory = {
        "scope": {"countries": ["Canada"]},
        "records": [
            {
                "id": "parent",
                "country": "Canada",
                "authority_status": "eligible_legislature",
                "primary_urls": ["https://parl.ca/"],
                "existing_catalogue_ids": ["service"],
            },
            {
                "id": "child",
                "country": "Canada",
                "authority_status": "eligible_legislature",
                "primary_urls": [],
            },
            {
                "id": "hold",
                "country": "Canada",
                "authority_status": "specific_authority_evidence_hold",
                "primary_urls": ["https://held.ca/"],
            },
        ],
    }
    catalogue = {
        "channels": [
            {
                "id": "service",
                "country_or_region": "Canada",
                "official_url": "https://parl.ca/watch",
            }
        ]
    }
    watchlists = [{"tier": "tier1", "countries": [{"country": "Canada", "results": []}]}]
    review = {
        "reviewed_on": "2026-10-24",
        "records": [
            {
                "id": "child",
                "metadata": {"institutional_url": "https://assembly.ca/"},
                "official_media": {"official_media_urls": ["https://assembly.ca/watch"]},
                "unresolved": ["Programme mapping remains unresolved."],
                "sources": [{"url": "https://unreviewed.ca/media.mp4"}],
            }
        ],
    }
    return (
        inventory,
        catalogue,
        {"eligible_bodies": []},
        watchlists,
        [("reports/discovery/review.json", review)],
    )


class MaintainedDiscoveryTests(unittest.TestCase):
    def test_safe_route_projection_excludes_documents_media_secrets_and_local_hosts(self):
        for value in [
            "https://example.org/watch.m3u8",
            "https://example.org/archive.mp4",
            "https://example.org/law.pdf",
            "https://example.org/api/events",
            "https://example.org/?token=temporary",
            "https://example.org/?key=REDACTED",
            "https://127.0.0.1/a",
            "https://user:pass@example.org/",
            "javascript:alert(1)",
        ]:
            with self.subTest(value=value):
                self.assertIsNone(maintained_page_url(value))
        self.assertEqual(
            maintained_page_url("https://example.org/watch?id=123#top"),
            "https://example.org/watch?id=123",
        )

    def test_explicit_review_routes_and_findings_do_not_spread_to_a_parent(self):
        inventory, _, _, _, reviews = inputs()
        routes = reviewed_routes(inventory, reviews)
        self.assertEqual({row["record_id"] for row in routes}, {"child"})
        self.assertEqual(
            {row["url"] for row in routes}, {"https://assembly.ca/", "https://assembly.ca/watch"}
        )
        self.assertNotIn("https://unreviewed.ca/media.mp4", json.dumps(routes))
        notes = review_notes_by_id(inventory, reviews)
        self.assertEqual(notes["child"][0]["unresolved"], ["Programme mapping remains unresolved."])
        self.assertNotIn("parent", notes)

    def test_duplicate_or_held_review_identity_fails_the_offline_plan(self):
        inventory, _, _, _, reviews = inputs()
        for key in ("hold", "unknown"):
            bad = copy.deepcopy(reviews)
            bad[0][1]["records"][0]["id"] = key
            with self.assertRaisesRegex(ValueError, "noneligible"):
                reviewed_routes(inventory, bad)
        bad = copy.deepcopy(reviews)
        bad[0][1]["records"] *= 2
        with self.assertRaisesRegex(ValueError, "duplicate"):
            reviewed_routes(inventory, bad)

    def test_plan_keeps_all_eligible_identities_and_the_current_catalogue(self):
        source = inputs()
        targets, coverage = build_targets(*source, "2026-10")
        self.assertEqual(coverage["counts"]["eligible_identities"], 2)
        self.assertEqual(coverage["counts"]["identities_with_page_routes"], 2)
        self.assertEqual(coverage["counts"]["catalogue_records_with_page_routes"], 1)
        self.assertEqual(coverage["identity_source_gaps"], [])
        urls = [
            row["url"] for country in targets["tier1"]["countries"] for row in country["results"]
        ]
        self.assertEqual(len(urls), len(set(urls)))
        self.assertNotIn("https://held.ca/", urls)
        inventory, catalogue, historical, watchlists, _ = source
        _, gaps = build_targets(inventory, catalogue, historical, watchlists, [], "2026-10")
        self.assertEqual(gaps["identity_source_gaps"], ["child"])

    def test_unknown_catalogue_jurisdiction_is_checked_in_supplemental_bucket(self):
        source = inputs()
        source[1]["channels"].append(
            {
                "id": "supranational",
                "country_or_region": "International body",
                "official_url": "https://international.org/watch",
            }
        )
        targets, coverage = build_targets(*source, "2026-10")
        self.assertIn("catalogue", targets)
        self.assertEqual(coverage["counts"]["catalogue_records_with_page_routes"], 2)

    def test_monthly_rotation_changes_order_without_dropping_targets(self):
        first, _ = build_targets(*inputs(), "2026-10")
        second, _ = build_targets(*inputs(), "2026-11")

        def urls(value):
            return [
                row["url"] for country in value["tier1"]["countries"] for row in country["results"]
            ]

        self.assertEqual(set(urls(first)), set(urls(second)))
        self.assertNotEqual(urls(first), urls(second))

    def test_budget_exhaustion_is_explicit_and_performs_no_request(self):
        country = {
            "country": "Canada",
            "results": [{"kind": "official_page", "url": "https://parl.ca/"}],
        }
        with patch("tools.validate_democracy_tier_static.validate_candidate") as fetch:
            result = check_country(country, 12, deadline=0)
        fetch.assert_not_called()
        self.assertEqual(result["results"][0]["status"], "unattempted")
        self.assertFalse(result["has_open_hls"])

    def test_static_report_sanitizes_discovered_query_credentials(self):
        with tempfile.TemporaryDirectory() as directory:
            source, output = Path(directory) / "input.json", Path(directory) / "output.json"
            source.write_text(
                json.dumps(
                    {
                        "tier": "tier1",
                        "countries": [
                            {
                                "country": "Canada",
                                "results": [
                                    {"kind": "hls", "url": "https://cdn.example.org/live.m3u8"}
                                ],
                            }
                        ],
                    }
                )
            )
            with patch(
                "tools.validate_democracy_tier_static.validate_candidate",
                return_value={
                    "kind": "hls",
                    "url": "https://cdn.example.org/live.m3u8?token=private-value",
                    "status": "ok",
                },
            ):
                run(source, output, 2, 1, 5)
            self.assertNotIn("private-value", output.read_text())
            self.assertIn("REDACTED", output.read_text())

    def test_actual_network_coverage_does_not_count_budget_skips_as_checked(self):
        _, coverage = build_targets(*inputs(), "2026-10")
        static = [
            {
                "countries": [
                    {
                        "results": [
                            {"url": "https://parl.ca/", "status": "page_ok"},
                            {"url": "https://assembly.ca/", "status": "unattempted"},
                            {"url": "https://assembly.ca/watch", "status": "error"},
                        ]
                    }
                ]
            }
        ]
        observed = network_coverage(coverage, static, [])
        rows = {row["record_id"]: row for row in observed["identity_checks"]}
        self.assertEqual(rows["parent"]["static_successful_urls"], 1)
        self.assertEqual(rows["child"]["static_attempted_urls"], 1)
        self.assertEqual(rows["child"]["static_successful_urls"], 0)
        self.assertEqual(observed["network_checks"]["static_unattempted"], 1)
        self.assertEqual(observed["network_checks"]["static_access_gaps"], 1)

    def test_current_plan_covers_every_published_source_and_named_eligible_identity(self):
        def load(path):
            return json.loads((ROOT / path).read_text())

        inventory = load("data/discovery/institutions.json")
        _, coverage = build_targets(
            inventory,
            load("data/channels.json"),
            load("reports/discovery/2026-10-24-current-validation-register.json"),
            [load(f"data/discovery/{tier}.json") for tier in ("tier1", "tier2")],
            load_reviews(),
            "2026-10",
        )
        eligible = {
            row["id"]
            for row in inventory["records"]
            if row["authority_status"] == "eligible_legislature"
        }
        routed = {key for row in coverage["sources"] for key in row["record_ids"]}
        self.assertEqual(routed | set(coverage["identity_source_gaps"]), eligible)
        self.assertEqual(coverage["catalogue_source_gaps"], [])
        self.assertEqual(
            coverage["counts"]["catalogue_records_with_page_routes"],
            coverage["counts"]["catalogue_records"],
        )
