"""Validate the reconciled institution identities, scope decisions and source crosswalks."""

from __future__ import annotations

import argparse
from collections import Counter
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

from parliament_streams.catalogue import load_json_object
from parliament_streams.inventory.projection import AUTHORITY_STATUSES


def unique_by(rows: list[dict[str, Any]], key: str, label: str) -> dict[str, dict[str, Any]]:
    result = {row[key]: row for row in rows}
    if len(result) != len(rows):
        raise ValueError(f"{label}: duplicate {key}")
    return result


def referenced_ids(value: Any) -> set[str]:
    """Find named records in differently shaped dated source reports."""
    if isinstance(value, list):
        return set().union(*(referenced_ids(item) for item in value))
    if isinstance(value, dict):
        result = {
            item
            for key, item in value.items()
            if key in {"id", "inventory_id", "institution_id", "candidate_id"}
            and isinstance(item, str)
        }
        return result | set().union(*(referenced_ids(item) for item in value.values()))
    return set()


def validate_inventory(data: dict[str, Any], root: Path) -> None:
    countries = data["scope"]["countries"]
    targets = {
        row["country"]
        for tier in ("tier1", "tier2")
        for row in load_json_object(root / f"data/discovery/{tier}.json")["countries"]
    }
    if len(countries) != len(set(countries)) or set(countries) != targets:
        raise ValueError("Country scope differs from the maintained Tier1/Tier2 baseline")

    records = unique_by(data["records"], "id", "Institution records")
    historical = load_json_object(root / "reports/discovery/2026-10-22-subnational-research.json")
    national = load_json_object(
        root / "reports/discovery/2026-10-24-national-chamber-inventory.json"
    )
    retained_ids = {row["id"] for row in historical["jurisdictions"]} | {
        row["id"] for row in national["national_chambers"]
    }
    if not retained_ids <= records.keys():
        raise ValueError("Historical regional or main national identities lost from crosswalk")
    source_ids: dict[str, set[str]] = {}
    for institution_id, row in records.items():
        if row["country"] not in targets or row["authority_status"] not in AUTHORITY_STATUSES:
            raise ValueError(f"{institution_id}: invalid country or authority status")
        if not row.get("name") or not row.get("decision_basis") or not row.get("inventory_grain"):
            raise ValueError(f"{institution_id}: missing identity or scope reasoning")
        if not row.get("primary_urls") or not row.get("provenance"):
            raise ValueError(f"{institution_id}: missing primary evidence or provenance")
        for url in row["primary_urls"]:
            parts = urlsplit(url)
            if parts.scheme not in {"http", "https"} or not parts.netloc:
                raise ValueError(f"{institution_id}: invalid evidence URL")
        if row["automatic_catalogue_promotion"]:
            raise ValueError(
                f"{institution_id}: inventory must not automatically promote a service"
            )
        for relation in row["relationships"]:
            target = records.get(relation["institution_id"])
            if target is None or target["id"] == institution_id:
                raise ValueError(f"{institution_id}: broken or self-referential institution link")
            if target["country"] != row["country"]:
                raise ValueError(
                    f"{institution_id}: cross-country relationship needs explicit review"
                )
        for source in row["provenance"]:
            if not (root / source["report"]).is_file():
                raise ValueError(f"{institution_id}: missing source report {source['report']}")
            path = source["report"]
            if path not in source_ids:
                source_ids[path] = referenced_ids(load_json_object(root / path))
            if source["record_id"] not in source_ids[path]:
                raise ValueError(f"{institution_id}: provenance record does not exist in {path}")

    historical_service_ids = {
        row["id"]
        for row in historical["jurisdictions"]
        if row["catalogue_eligibility"]["status"] == "eligible_legislature"
    }
    service_pointer_ids = {
        key for key, row in records.items() if row.get("service_validation_register")
    }
    if service_pointer_ids != historical_service_ids:
        raise ValueError("Historical service cohort must not be copied to new institutions")

    country_rows = unique_by(data["country_reconciliations"], "country", "Country crosswalk")
    if set(country_rows) != targets:
        raise ValueError("Country crosswalk does not cover the fixed baseline")
    for country, row in country_rows.items():
        expected = {key for key, value in records.items() if value["country"] == country}
        if set(row["record_ids"]) != expected or len(row["record_ids"]) != len(expected):
            raise ValueError(f"{country}: country record crosswalk is incomplete or duplicated")
        counts = Counter(records[key]["authority_status"] for key in expected)
        if dict(counts) != row["status_counts"]:
            raise ValueError(f"{country}: stale authority counts")
        holds = {
            key
            for key in expected
            if records[key]["authority_status"] == "specific_authority_evidence_hold"
        }
        if set(row["known_scope_hold_ids"]) != holds:
            raise ValueError(f"{country}: authority holds missing from country crosswalk")

    overlay = load_json_object(root / "reports/discovery/2026-10-24-inventory-reconciliation.json")
    original_ids = {row["id"] for row in overlay["named_scope_review_candidates"]}
    decisions = unique_by(
        data["original_scope_decision_crosswalk"], "candidate_id", "Scope decisions"
    )
    if set(decisions) != original_ids:
        raise ValueError("Original named scope questions are missing or duplicated")
    for candidate_id, decision in decisions.items():
        target = records.get(decision["institution_id"])
        if target is None or target["authority_status"] != decision["authority_status"]:
            raise ValueError(f"{candidate_id}: scope decision does not match institution")
        if not decision["original_scope_question_resolved"]:
            raise ValueError(f"{candidate_id}: original scope question remains unresolved")
        corrected_id = decision.get("corrected_eligible_organ_id")
        if corrected_id and records[corrected_id]["authority_status"] != "eligible_legislature":
            raise ValueError(f"{candidate_id}: corrected legislative organ is not retained")

    aliases = unique_by(data["identity_alias_crosswalk"], "alias_id", "Identity aliases")
    overlay_children = {
        row["id"]: row for row in overlay["named_regional_chamber_and_organ_children"]
    }
    for alias_id, alias in aliases.items():
        if alias_id in records or alias["canonical_id"] not in records:
            raise ValueError(f"{alias_id}: alias duplicates or loses its canonical identity")
        if alias_id not in overlay_children or (
            alias["canonical_id"] != overlay_children[alias_id]["existing_inventory_anchor_id"]
        ):
            raise ValueError(f"{alias_id}: alias points to a different institution")
    children = {row["id"] for row in overlay["named_regional_chamber_and_organ_children"]}
    if not children <= records.keys() | aliases.keys():
        raise ValueError("Named chamber/organ identities missing from operational crosswalk")

    overrides = unique_by(
        data["authority_classification_overrides"], "institution_id", "Authority overrides"
    )
    for historical_row in historical["jurisdictions"]:
        key = historical_row["id"]
        expected_status = historical_row["catalogue_eligibility"]["status"]
        if key in overrides:
            override = overrides[key]
            if override["previous_authority_status"] != expected_status:
                raise ValueError(f"{key}: authority override loses the historical decision")
            expected_status = override["authority_status"]
        if records[key]["authority_status"] != expected_status:
            raise ValueError(f"{key}: unexplained change to historical authority decision")

    review = data.get("legal_hold_review")
    if review:
        source_review = load_json_object(root / review["report"])
        reviewed = unique_by(source_review["records"], "id", "Legal hold review")
        starting = set(review["starting_hold_ids"])
        if set(reviewed) != starting or set(review["reviewed_institution_ids"]) != starting:
            raise ValueError("Legal hold review does not account for every starting institution")
        remaining = {
            key
            for key, row in records.items()
            if row["authority_status"] == "specific_authority_evidence_hold"
        }
        if set(review["remaining_hold_ids"]) != remaining:
            raise ValueError("Legal hold review loses a remaining authority hold")
        for key, case in reviewed.items():
            current = records[key]
            if current["authority_status"] != case["authority_status"]:
                raise ValueError(f"{key}: legal hold review status differs from the register")
            if (
                current["remaining_authority_instruments"]
                != case["remaining_authority_instruments"]
            ):
                raise ValueError(f"{key}: legal hold review loses the exact missing instruments")
            if bool(current["remaining_authority_instruments"]) != (key in remaining):
                raise ValueError(f"{key}: unresolved authority needs specific missing instruments")
        outcomes = Counter(row["authority_status"] for row in reviewed.values())
        expected_review_summary = {
            "starting_holds": len(starting),
            "individually_reviewed": len(reviewed),
            "current_default_scope_exclusions": outcomes["outside_default_scope"],
            "new_authority_clearances": outcomes["eligible_legislature"],
            "remaining_specific_authority_holds": outcomes["specific_authority_evidence_hold"],
            "all_legal_holds_resolved": not remaining,
        }
        for key, value in expected_review_summary.items():
            if review["summary"][key] != value or source_review["summary"][key] != value:
                raise ValueError(f"Legal hold review has an unsupported summary claim: {key}")

    summary = data["summary"]
    expected_summary = {
        "baseline_country_groups": len(targets),
        "original_scope_questions": len(original_ids),
        "original_scope_questions_resolved": len(decisions),
        "same_institution_unicameral_aliases": len(aliases),
        "main_national_chambers": len(national["national_chambers"]),
        "historical_regional_entries": len(historical["jurisdictions"]),
        "historical_authority_classifications_changed": len(overrides),
        "additional_regional_class_findings": len(data["additional_regional_class_findings"]),
        "territorial_no_separate_legislature_dispositions": len(data["territorial_dispositions"]),
        "inventory_records_by_authority_status": dict(
            Counter(row["authority_status"] for row in records.values())
        ),
        "inventory_records_by_grain": dict(
            Counter(row["inventory_grain"] for row in records.values())
        ),
        "original_scope_decisions": dict(
            Counter(row["authority_status"] for row in decisions.values())
        ),
    }
    for key, expected_value in expected_summary.items():
        if summary[key] != expected_value:
            raise ValueError(f"Stale summary field: {key}")
    if not summary["record_count_is_not_a_jurisdiction_legislature_or_service_count"]:
        raise ValueError("Mixed-grain inventory cannot be reported as a count of parliaments")
    if (
        summary["complete_exhaustive_institutional_census_certified"]
        or summary["all_institutions_metadata_stream_epg_and_rights_validated"]
    ):
        raise ValueError(
            "This bounded reconciliation does not certify census or service completeness"
        )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "path", nargs="?", type=Path, default=Path("data/discovery/institutions.json")
    )
    args = parser.parse_args()
    try:
        data = load_json_object(args.path)
        validate_inventory(data, Path(__file__).resolve().parents[1])
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.error(str(error))
    print(
        f"Institution inventory valid: {len(data['records'])} mixed-grain records, "
        f"{len(data['country_reconciliations'])} country groups; "
        f"{len(data['original_scope_decision_crosswalk'])} original scope decisions"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
