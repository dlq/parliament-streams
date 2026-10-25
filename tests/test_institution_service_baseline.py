"""Protect exact-identity coverage and the boundary between evidence and validation."""

from __future__ import annotations

import copy
import unittest
from pathlib import Path
from typing import Any

from parliament_streams.inventory.projection import load_object
from tools.build_institution_service_baseline import (
    DIRECTORY,
    HISTORICAL,
    build_baseline,
)

ROOT = Path(__file__).resolve().parents[1]
REVIEWED_ON = "2026-10-24"


def institution(key: str, **changes: Any) -> dict[str, Any]:
    row: dict[str, Any] = {
        "id": key,
        "country": "Canada",
        "name": key,
        "level": "regional_or_associated_territory",
        "inventory_grain": "chamber",
        "authority_status": "eligible_legislature",
        "decision_basis": "Legislative authority confirmed; services remain separate.",
    }
    row.update(changes)
    return row


def inputs() -> tuple[dict[str, Any], dict[str, Any], dict[str, Any], dict[str, Any]]:
    inventory = {
        "reviewed_on": REVIEWED_ON,
        "scope": {
            "countries": ["Canada"],
            "country_baseline": "Fixed research baseline",
            "territorial_boundary": "First-level and autonomous special-status legislatures",
        },
        "records": [
            institution(
                "canada--parent",
                inventory_grain="bicameral_umbrella",
                existing_catalogue_ids=["parent-feed"],
            ),
            institution(
                "canada--child",
                relationships=[{"type": "chamber_of", "institution_id": "canada--parent"}],
            ),
            institution("canada--queued"),
            institution("canada--hold", authority_status="specific_authority_evidence_hold"),
            institution("canada--excluded", authority_status="outside_default_scope"),
            institution("canada--superseded", authority_status="historical_institution_superseded"),
        ],
    }
    catalogue = {
        "channels": [
            {
                "id": "parent-feed",
                "permission": {"status": "permitted"},
                "epg_sources": [{"scraper_status": "implemented"}],
            },
            {
                "id": "unmatched-feed",
                "permission": {"status": "unknown"},
                "epg_sources": [],
            },
        ]
    }
    directory = {
        "national_chambers": [
            {"id": "canada--child", "country": "Canada", "ipu_country_code": "CA"}
        ]
    }
    historical = {
        "eligible_bodies": [
            {
                "body_id": "canada--parent",
                "catalogue_ids": ["parent-feed"],
                "current_review_bucket": "catalogued_source_checked",
                "all_dimensions_validated": True,
            }
        ]
    }
    return inventory, catalogue, directory, historical


def report(*keys: str, reviewed_on: str = REVIEWED_ON) -> dict[str, Any]:
    return {
        "reviewed_on": reviewed_on,
        "records": [
            {
                "id": key,
                "reviewed_on": reviewed_on,
                "review_status": "partial_source_followup",
                "sources": [{"url": "https://example.test/official", "status": "page_read"}],
            }
            for key in keys
        ],
    }


class InstitutionServiceBaselineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.inventory, self.catalogue, self.directory, self.historical = inputs()

    def build(self, *reports: tuple[str, dict[str, Any]]) -> dict[str, Any]:
        return build_baseline(
            self.inventory,
            self.catalogue,
            self.directory,
            self.historical,
            list(reports),
            REVIEWED_ON,
        )

    def test_service_queue_includes_every_eligible_identity_and_excludes_other_statuses(
        self,
    ) -> None:
        result = self.build()
        self.assertEqual(
            {row["id"] for row in result["records"]},
            {"canada--parent", "canada--child", "canada--queued"},
        )
        self.assertEqual(result["summary"]["eligible_records"], 3)
        self.assertEqual(result["summary"]["default_displayed_records"], 4)
        self.assertEqual(result["summary"]["legal_holds_excluded_from_service_queue"], 1)
        self.assertEqual(result["country_counts"], {"Canada": 3})

    def test_parent_catalogue_and_service_evidence_do_not_propagate_to_chamber(self) -> None:
        result = self.build(("reports/discovery/parent.json", report("canada--parent")))
        rows = {row["id"]: row for row in result["records"]}
        self.assertEqual(rows["canada--parent"]["catalogue_ids"], ["parent-feed"])
        self.assertTrue(rows["canada--parent"]["source_followups"])
        self.assertTrue(rows["canada--parent"]["historical_service_review"])
        child = rows["canada--child"]
        self.assertEqual(child["catalogue_ids"], [])
        self.assertEqual(child["source_followups"], [])
        self.assertIsNone(child["historical_service_review"])
        self.assertEqual(child["review_stage"], "reconciled_identity_queued")
        self.assertFalse(child["all_dimensions_validated"])

    def test_partial_evidence_and_aggregate_permission_never_certify_all_dimensions(self) -> None:
        partial = report("canada--child")
        partial["records"][0].update(
            all_dimensions_validated=True,
            metadata_stream_epg_rights_validation_complete=True,
            permission={"status": "permitted"},
        )
        result = self.build(("reports/discovery/partial.json", partial))
        rows = {row["id"]: row for row in result["records"]}
        self.assertEqual(rows["canada--parent"]["review_stage"], "historical_service_checks_only")
        self.assertEqual(rows["canada--child"]["review_stage"], "partial_source_followup")
        self.assertEqual(rows["canada--queued"]["review_stage"], "reconciled_identity_queued")
        self.assertTrue(all(row["all_dimensions_validated"] is False for row in rows.values()))
        self.assertEqual(result["summary"]["all_dimensions_validated"], 0)
        self.assertTrue(result["summary"]["aggregate_permission_status_is_not_per_use_clearance"])
        self.assertEqual(
            result["summary"]["catalogue_aggregate_permission_statuses"],
            {"permitted": 1, "unknown": 1},
        )
        self.assertEqual(
            set(result["review_dimensions"]["rights"]),
            {
                "linking",
                "embedding",
                "direct_playback",
                "rebroadcast",
                "copying_recording",
                "audiovisual_reuse",
                "programme_data",
            },
        )

    def test_multiple_reports_for_one_identity_preserve_refs_but_count_one_body(self) -> None:
        older = ("reports/discovery/older.json", report("canada--child", reviewed_on="2026-10-23"))
        newer = ("reports/discovery/newer.json", report("canada--child"))
        result = self.build(newer, older)
        child = next(row for row in result["records"] if row["id"] == "canada--child")
        self.assertEqual(len(child["source_followups"]), 2)
        self.assertEqual(
            [item["report"] for item in child["source_followups"]],
            [older[0], newer[0]],
        )
        self.assertEqual(result["summary"]["records_with_new_source_followups"], 1)
        self.assertEqual(result["summary"]["review_stages"]["partial_source_followup"], 1)
        self.assertEqual(result, self.build(older, newer))

    def test_repeated_report_argument_does_not_duplicate_a_record_reference(self) -> None:
        followup = ("reports/discovery/review.json", report("canada--child"))
        result = self.build(followup, followup)
        child = next(row for row in result["records"] if row["id"] == "canada--child")
        self.assertEqual(len(child["source_followups"]), 1)
        self.assertEqual(result["summary"]["records_with_new_source_followups"], 1)

    def test_duplicate_unknown_and_noneligible_review_identities_are_rejected(self) -> None:
        for keys in [
            ("canada--child", "canada--child"),
            ("not-an-inventory-id",),
            ("canada--hold",),
            ("canada--excluded",),
            ("canada--superseded",),
        ]:
            with (
                self.subTest(keys=keys),
                self.assertRaisesRegex(ValueError, "duplicate, unknown or noneligible"),
            ):
                self.build(("reports/discovery/review.json", report(*keys)))

    def test_empty_source_observations_cannot_be_counted_as_a_followup(self) -> None:
        for value in [None, [], {}]:
            followup = report("canada--child")
            followup["records"][0]["sources"] = value
            with self.subTest(value=value), self.assertRaisesRegex(ValueError, "source"):
                self.build(("reports/discovery/review.json", followup))

    def test_report_level_sources_can_be_referenced_without_losing_identity_scope(self) -> None:
        followup = report("canada--child")
        followup["sources"] = {
            "official": {"url": "https://example.test/legislature", "access": "page_read"}
        }
        del followup["records"][0]["sources"]
        followup["records"][0]["source_refs"] = ["official"]
        result = self.build(("reports/discovery/referenced.json", followup))
        rows = {row["id"]: row for row in result["records"]}
        self.assertEqual(rows["canada--child"]["review_stage"], "partial_source_followup")
        self.assertEqual(rows["canada--parent"]["source_followups"], [])
        self.assertEqual(result["summary"]["records_with_new_source_followups"], 1)

    def test_dangling_source_reference_cannot_count_as_observed_evidence(self) -> None:
        followup = report("canada--child")
        followup["sources"] = {}
        del followup["records"][0]["sources"]
        followup["records"][0]["source_refs"] = ["nonexistent-source"]
        with self.assertRaises(ValueError):
            self.build(("reports/discovery/dangling.json", followup))

    def test_invalid_inline_and_referenced_source_urls_are_rejected(self) -> None:
        for url in ["javascript:alert(1)", "https://user:password@example.test/", "not-a-url"]:
            for referenced in [False, True]:
                followup = report("canada--child")
                source = {"url": url, "access": "page_read"}
                if referenced:
                    followup["sources"] = {"official": source}
                    del followup["records"][0]["sources"]
                    followup["records"][0]["source_refs"] = ["official"]
                else:
                    followup["records"][0]["sources"] = [source]
                with self.subTest(url=url, referenced=referenced), self.assertRaises(ValueError):
                    self.build(("reports/discovery/invalid-url.json", followup))

    def test_report_dated_after_the_baseline_is_rejected(self) -> None:
        with self.assertRaisesRegex(ValueError, "postdates|future"):
            self.build(
                ("reports/discovery/future.json", report("canada--child", reviewed_on="2026-10-25"))
            )

    def test_record_dated_after_the_baseline_cannot_hide_under_an_older_report_date(self) -> None:
        followup = report("canada--child")
        followup["records"][0]["reviewed_on"] = "2026-10-25"
        with self.assertRaisesRegex(ValueError, "postdates|future"):
            self.build(("reports/discovery/future-row.json", followup))

    def test_invalid_calendar_dates_are_rejected_before_date_comparison(self) -> None:
        for bad_date in ["2026-02-30", "2026-10-2", "2026-10-01oops"]:
            followup = report("canada--child", reviewed_on=bad_date)
            with self.subTest(date=bad_date), self.assertRaises(ValueError):
                self.build(("reports/discovery/invalid-date.json", followup))

    def test_historical_register_rejects_duplicate_unknown_and_noneligible_identities(self) -> None:
        original = copy.deepcopy(self.historical["eligible_bodies"][0])
        for key in ["canada--parent", "unknown", "canada--hold", "canada--excluded"]:
            bad = {**original, "body_id": key}
            self.historical["eligible_bodies"] = [original, bad]
            with (
                self.subTest(key=key),
                self.assertRaisesRegex(ValueError, "duplicate|unknown|noneligible"),
            ):
                self.build()


class CurrentInstitutionServiceBaselineTests(unittest.TestCase):
    def test_current_inventory_is_covered_by_exact_eligible_identity(self) -> None:
        inventory = load_object(ROOT / "data/discovery/institutions.json")
        result = build_baseline(
            inventory,
            load_object(ROOT / "data/channels.json"),
            load_object(ROOT / DIRECTORY),
            load_object(ROOT / HISTORICAL),
            [],
            REVIEWED_ON,
        )
        expected = {
            row["id"]
            for row in inventory["records"]
            if row["authority_status"] == "eligible_legislature"
        }
        actual = {row["id"] for row in result["records"]}
        self.assertEqual(actual, expected)
        self.assertEqual(len(result["records"]), len(expected))
        self.assertEqual(result["summary"]["eligible_records"], len(expected))
        self.assertEqual(result["summary"]["all_dimensions_validated"], 0)
        self.assertTrue(all(not row["all_dimensions_validated"] for row in result["records"]))


if __name__ == "__main__":
    unittest.main()
