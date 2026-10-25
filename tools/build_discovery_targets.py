"""Build monthly discovery inputs from the full maintained inventory and catalogue.

The output is a network-check plan, not a verified-media list or promotion queue.
Every eligible identity has explicit route coverage or a named source gap.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from collections import defaultdict
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

if __package__ in {None, ""}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from parliament_streams.inventory.reviews import (  # noqa: E402
    ROOT,
    load_reviews,
    maintained_page_url,
    reviewed_routes,
)
from parliament_streams.research_evidence import REDACTED, sanitize_url  # noqa: E402


def build_targets(
    inventory: dict[str, Any],
    catalogue: dict[str, Any],
    historical: dict[str, Any],
    watchlists: list[dict[str, Any]],
    reviews: list[tuple[str, dict[str, Any]]],
    rotation: str,
) -> tuple[dict[str, dict[str, Any]], dict[str, Any]]:
    eligible = {
        row["id"]: row
        for row in inventory["records"]
        if row["authority_status"] == "eligible_legislature"
    }
    country_tiers = {
        row["country"]: watchlist["tier"]
        for watchlist in watchlists
        for row in watchlist["countries"]
    }
    if country_tiers.keys() != set(inventory["scope"]["countries"]):
        raise ValueError("Discovery tiers do not match the maintained country scope")
    sources: dict[tuple[str, str], dict[str, Any]] = {}
    record_urls: dict[str, set[str]] = defaultdict(set)

    def add(
        country: str,
        value: Any,
        origin: str,
        record_id: str | None = None,
        kind: str = "official_page",
        channel_id: str | None = None,
    ) -> None:
        if kind == "official_page":
            url = maintained_page_url(value)
        else:
            url = (
                value
                if isinstance(value, str) and value.startswith(("https://", "http://"))
                else None
            )
            if url and (sanitize_url(url) != url or REDACTED.lower() in url.lower()):
                url = None
        if not url:
            return
        source = sources.setdefault(
            (kind, url),
            {
                "kind": kind,
                "url": url,
                "countries": [],
                "record_ids": [],
                "catalogue_ids": [],
                "origins": [],
            },
        )
        for field, item in (
            ("countries", country),
            ("record_ids", record_id),
            ("catalogue_ids", channel_id),
            ("origins", origin),
        ):
            if item and item not in source[field]:
                source[field].append(item)
        if record_id:
            record_urls[record_id].add(url)

    for row in eligible.values():
        for url in row.get("primary_urls", []) + row.get("source_published_institution_urls", []):
            add(row["country"], url, "inventory", row["id"])
    for row in historical.get("eligible_bodies", []):
        if row["body_id"] in eligible:
            body = eligible[row["body_id"]]
            add(
                body["country"],
                row.get("official_reference_url"),
                "historical_service_review",
                body["id"],
            )
    for route in reviewed_routes(inventory, reviews):
        add(route["country"], route["url"], "reviewed_" + route["purpose"], route["record_id"])
    catalogue_bodies: dict[str, list[str]] = defaultdict(list)
    for body in eligible.values():
        for channel_id in body.get("catalogue_crosswalk", {}).get(
            "catalogue_ids", body.get("existing_catalogue_ids", [])
        ):
            catalogue_bodies[channel_id].append(body["id"])
    for body in historical.get("eligible_bodies", []):
        if body["body_id"] in eligible:
            for channel_id in body.get("catalogue_ids", []):
                catalogue_bodies[channel_id].append(body["body_id"])
    for channel in catalogue["channels"]:
        bodies = sorted(set(catalogue_bodies[channel["id"]]))
        countries = sorted({eligible[key]["country"] for key in bodies}) or [
            channel["country_or_region"]
        ]
        for country in countries:
            add(country, channel["official_url"], "catalogue", channel_id=channel["id"])
        for key in bodies:
            add(
                eligible[key]["country"],
                channel["official_url"],
                "catalogue",
                key,
                channel_id=channel["id"],
            )
    for watchlist in watchlists:
        for country in watchlist["countries"]:
            for source in country["results"]:
                add(country["country"], source["url"], "maintained_watchlist", kind=source["kind"])
    # Rotate work order each month so a persistent budget limit does not starve
    # the same tail. Report every skipped URL; all identities remain in the plan.
    ordered = sorted(
        sources.values(),
        key=lambda row: hashlib.sha256((rotation + row["url"]).encode()).hexdigest(),
    )
    buckets: dict[str, dict[str, list[dict[str, str]]]] = defaultdict(dict)
    for row in ordered:
        # A shared URL is fetched once. Coverage retains every linked exact ID.
        country = sorted(row["countries"], key=lambda name: (name not in country_tiers, name))[0]
        tier = country_tiers.get(country, "catalogue")
        buckets[tier].setdefault(country, []).append({"kind": row["kind"], "url": row["url"]})
    targets = {
        tier: {
            "target_version": 1,
            "tier": tier,
            "source_report": "maintained inventory and reviewed service routes",
            "scope": "Eligible national/regional/special-status bodies and the published catalogue",
            "method": "Explicit maintained routes; no automatic media validation or promotion.",
            "countries": [
                {"country": country, "results": rows} for country, rows in countries.items()
            ],
        }
        for tier, countries in buckets.items()
    }
    covered_channels = {key for row in sources.values() for key in row["catalogue_ids"]}
    gaps = [key for key in eligible if not record_urls[key]]
    coverage = {
        "rotation": rotation,
        "counts": {
            "eligible_identities": len(eligible),
            "identities_with_page_routes": len(eligible) - len(gaps),
            "identities_without_page_routes": len(gaps),
            "unique_check_targets": len(sources),
            "catalogue_records": len(catalogue["channels"]),
            "catalogue_records_with_page_routes": len(covered_channels),
        },
        "identity_source_gaps": sorted(gaps),
        "catalogue_source_gaps": sorted(
            set(row["id"] for row in catalogue["channels"]) - covered_channels
        ),
        "source_reviews": sorted(path for path, _ in reviews),
        "sources": sorted(sources.values(), key=lambda row: (row["kind"], row["url"])),
        "limits": [
            "A planned route is not a successful fetch or decoded player.",
            "Missing or blocked routes are unresolved, not evidence that no broadcast exists.",
            "Network budgets leave explicit unattempted targets; no exhaustive search is implied.",
            "No catalogue records, rights decisions or guide parsers change automatically.",
        ],
    }
    return targets, coverage


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output-dir", type=Path, default=ROOT / "reports/automated/discovery-targets"
    )
    parser.add_argument("--rotation", default=datetime.now(UTC).strftime("%Y-%m"))
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()

    def load(path: str) -> dict[str, Any]:
        return dict(json.loads((ROOT / path).read_text(encoding="utf-8")))

    targets, coverage = build_targets(
        load("data/discovery/institutions.json"),
        load("data/channels.json"),
        load("reports/discovery/2026-10-24-current-validation-register.json"),
        [load(f"data/discovery/{tier}.json") for tier in ("tier1", "tier2")],
        load_reviews(),
        args.rotation,
    )
    if not args.validate_only:
        args.output_dir.mkdir(parents=True, exist_ok=True)
        for tier in ("tier1", "tier2", "catalogue"):
            document = targets.get(tier, {"tier": tier, "countries": []})
            (args.output_dir / f"{tier}-targets.json").write_text(
                json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
        (args.output_dir / "coverage.json").write_text(
            json.dumps(coverage, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    print(json.dumps(coverage["counts"]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
