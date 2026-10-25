"""Reconcile service-review coverage without turning inherited evidence into validation."""

from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path
from typing import Any

from parliament_streams.catalogue import load_json_object
from parliament_streams.inventory.projection import (
    DIRECTORY_REPORT,
    SERVICE_REGISTER_REPORT,
    build_payload,
    safe_http_url,
)
from parliament_streams.inventory.reviews import load_reviews

ROOT = Path(__file__).resolve().parents[1]
HISTORICAL = SERVICE_REGISTER_REPORT
DIRECTORY = DIRECTORY_REPORT
DIMENSIONS = {
    "metadata": ["preferred_name", "current_activity", "institutional_route", "exact_identifiers"],
    "official_media": ["provider_designation", "chambers_and_rooms", "languages", "playback"],
    "epg": ["official_agenda", "broadcast_mapping", "machine_readable_format", "freshness"],
    "rights": [
        "linking",
        "embedding",
        "direct_playback",
        "rebroadcast",
        "copying_recording",
        "audiovisual_reuse",
        "programme_data",
    ],
}


def source_observations(row: dict[str, Any], report: dict[str, Any]) -> list[dict[str, Any]]:
    """Resolve inline sources or explicit references without accepting missing evidence."""
    inline = row.get("sources", [])
    references = row.get("source_refs", [])
    if not isinstance(inline, list) or not isinstance(references, list):
        raise ValueError(f"{row['id']}: invalid source observations or references")
    result = list(inline)
    registry = report.get("sources", {})
    for key in references:
        if not isinstance(registry, dict) or key not in registry:
            raise ValueError(f"{row['id']}: unknown source reference {key}")
        result.append(registry[key])
    if not result or any(
        not isinstance(source, dict) or safe_http_url(source.get("url")) is None
        for source in result
    ):
        raise ValueError(f"{row['id']}: missing or invalid source observations")
    return result


def build_baseline(
    inventory: dict[str, Any],
    catalogue: dict[str, Any],
    directory: dict[str, Any],
    historical: dict[str, Any],
    reviews: list[tuple[str, dict[str, Any]]],
    reviewed_on: str,
) -> dict[str, Any]:
    """Join exact identities, retaining source reports and separate partial-review states."""
    baseline_date = date.fromisoformat(reviewed_on)
    projection = build_payload(inventory, catalogue, directory, historical)
    eligible = {
        row["id"]: row for row in projection["records"] if row["status"] == "eligible_legislature"
    }
    previous = {row["body_id"]: row for row in historical["eligible_bodies"]}
    if (
        len(previous) != len(historical["eligible_bodies"])
        or not previous.keys() <= eligible.keys()
    ):
        raise ValueError("Historical service cohort has duplicate or noneligible identities")
    followups: dict[str, list[dict[str, str]]] = defaultdict(list)
    for path, report in reviews:
        seen: set[str] = set()
        report_date = report["reviewed_on"]
        if date.fromisoformat(report_date) > baseline_date:
            raise ValueError(f"{path}: review postdates the baseline")
        for row in report["records"]:
            key = row["id"]
            if key not in eligible or key in seen:
                raise ValueError(f"{path}: duplicate, unknown or noneligible identity {key}")
            seen.add(key)
            row_date = row.get("reviewed_on", report_date)
            if date.fromisoformat(row_date) > baseline_date:
                raise ValueError(f"{path}: {key} review postdates the baseline")
            source_observations(row, report)
            reference = {"report": path, "record_id": key, "reviewed_on": row_date}
            if reference not in followups[key]:
                followups[key].append(reference)
    records = []
    for key, row in sorted(eligible.items()):
        old = previous.get(key)
        reports = sorted(
            followups.get(key, []), key=lambda item: (item["reviewed_on"], item["report"])
        )
        records.append(
            {
                "id": key,
                "country": row["country"],
                "name": row["name"],
                "level": row["level"],
                "inventory_grain": row["kind"],
                "catalogue_ids": row["catalogue_ids"],
                "historical_service_review": (
                    {"report": HISTORICAL, "body_id": key, "bucket": old["current_review_bucket"]}
                    if old
                    else None
                ),
                "source_followups": reports,
                "review_stage": (
                    "partial_source_followup"
                    if reports
                    else "historical_service_checks_only"
                    if old
                    else "reconciled_identity_queued"
                ),
                "all_dimensions_validated": False,
            }
        )
    linked = [row for row in records if row["catalogue_ids"]]
    channels = catalogue["channels"]
    return {
        "reviewed_on": reviewed_on,
        "purpose": "Eligible-identity service baseline; source-wide validation remains open.",
        "inputs": {
            "inventory": "data/discovery/institutions.json",
            "catalogue": "data/channels.json",
            "national_directory": DIRECTORY,
            "historical_service_register": HISTORICAL,
            "source_reviews": sorted(path for path, _ in reviews),
        },
        "counting_rules": [
            "Count exact eligible institution IDs, including chambers and umbrella institutions.",
            "Catalogue coverage is an exact identity crosswalk, not a distinct service count.",
            "Do not inherit a parent's media, schedule, rights or completed checks into a chamber.",
            "An old check or new source follow-up is partial evidence, not full validation.",
            "All dimensions remain open; this baseline never automatically certifies completion.",
        ],
        "review_dimensions": DIMENSIONS,
        "summary": {
            "default_displayed_records": sum(
                row["status"] in projection["scope"]["default_statuses"]
                for row in projection["records"]
            ),
            "eligible_records": len(records),
            "legal_holds_excluded_from_service_queue": sum(
                row["status"] == "specific_authority_evidence_hold" for row in projection["records"]
            ),
            "eligible_records_with_exact_catalogue_matches": len(linked),
            "eligible_records_without_exact_catalogue_matches": len(records) - len(linked),
            "distinct_catalogue_ids_linked": len(
                {key for row in linked for key in row["catalogue_ids"]}
            ),
            "historical_service_cohort": len(previous),
            "outside_historical_service_cohort": len(records) - len(previous),
            "records_with_new_source_followups": len(followups),
            "records_outside_historical_cohort_without_new_followup": sum(
                not row["historical_service_review"] and not row["source_followups"]
                for row in records
            ),
            "review_stages": dict(sorted(Counter(row["review_stage"] for row in records).items())),
            "all_dimensions_validated": 0,
            "catalogue_sources": len(channels),
            "catalogue_sources_with_implemented_schedule_parser": sum(
                any(source["scraper_status"] == "implemented" for source in channel["epg_sources"])
                for channel in channels
            ),
            "catalogue_aggregate_permission_statuses": dict(
                sorted(Counter(channel["permission"]["status"] for channel in channels).items())
            ),
            "aggregate_permission_status_is_not_per_use_clearance": True,
        },
        "country_counts": dict(sorted(Counter(row["country"] for row in records).items())),
        "records": records,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--reviewed-on")
    parser.add_argument(
        "--output",
        type=Path,
        default=ROOT / "reports/discovery/2026-10-25-institution-service-baseline.json",
    )
    parser.add_argument("--review", action="append", type=Path, default=None)
    parser.add_argument("--check", action="store_true", help="fail if the saved baseline is stale")
    args = parser.parse_args()
    reviews = (
        [
            (path.resolve().relative_to(ROOT).as_posix(), load_json_object(path))
            for path in args.review
        ]
        if args.review is not None
        else load_reviews()
    )
    reviewed_on = args.reviewed_on
    if reviewed_on is None:
        if not args.output.exists():
            parser.error("--reviewed-on is required for a new baseline")
        reviewed_on = load_json_object(args.output)["reviewed_on"]
    result = build_baseline(
        load_json_object(ROOT / "data/discovery/institutions.json"),
        load_json_object(ROOT / "data/channels.json"),
        load_json_object(ROOT / DIRECTORY),
        load_json_object(ROOT / HISTORICAL),
        reviews,
        reviewed_on,
    )
    if args.check:
        if not args.output.exists() or load_json_object(args.output) != result:
            parser.error("service baseline is stale; regenerate it with all maintained reviews")
        print("Current service baseline matches catalogue, inventory and all review reports")
        return 0
    args.output.write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(result["summary"], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
