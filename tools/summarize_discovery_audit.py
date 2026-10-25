"""Summarize validated discovery results that are absent from the catalogue."""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Any

from parliament_streams.catalogue import load_catalogue, load_json_object
from parliament_streams.discovery import build_discovery_findings, parse_discovery_decisions
from parliament_streams.management import write_json
from parliament_streams.page_discovery import classify_page_links


def network_coverage(
    coverage: dict[str, Any], static: list[dict[str, Any]], browser: list[dict[str, Any]]
) -> dict[str, Any]:
    """Join network observations to exact identities without certifying their media."""
    static_checks = {
        row["url"]: row["status"]
        for report in static
        for country in report.get("countries", [])
        for row in country.get("results", [])
    }
    browser_checks = {row["page_url"]: row for report in browser for row in report.get("pages", [])}
    coverage["network_checks"] = {
        "static_unattempted": sum(status == "unattempted" for status in static_checks.values()),
        "static_access_gaps": sum(
            status in {"warning", "error"} for status in static_checks.values()
        ),
        "browser_unattempted": sum(
            row.get("status") == "unattempted" for row in browser_checks.values()
        ),
        "browser_access_gaps": sum(
            row.get("status") != "unattempted"
            and (bool(row.get("load_note")) or (row.get("page_status") or 0) >= 400)
            for row in browser_checks.values()
        ),
        "browser_pages_omitted_by_cap": sum(
            item.get("coverage", {}).get("pages_omitted_by_cap", 0) for item in browser
        ),
        "browser_manifests_omitted_by_cap": sum(
            page.get("manifests_omitted_by_cap", 0)
            for item in browser
            for page in item.get("pages", [])
        ),
        "static_page_leads_omitted_by_cap": sum(
            row.get("page_leads_omitted_by_cap", 0)
            for report in static
            for country in report.get("countries", [])
            for row in country.get("results", [])
        ),
        "browser_page_links_omitted_by_cap": sum(
            page.get("page_links_omitted_by_cap", 0)
            for report in browser
            for page in report.get("pages", [])
        ),
        "browser_page_leads_omitted_by_cap": sum(
            classify_page_links(
                page["page_url"], page.get("page_links", []), base_url=page.get("final_url")
            )[1]
            for report in browser
            for page in report.get("pages", [])
            if isinstance(page.get("page_url"), str)
        ),
    }
    by_identity: dict[str, set[str]] = {}
    for source in coverage["sources"]:
        for key in source["record_ids"]:
            by_identity.setdefault(key, set()).add(source["url"])
    coverage["identity_checks"] = [
        {
            "record_id": key,
            "planned_urls": len(urls),
            "static_attempted_urls": sum(
                url in static_checks and static_checks[url] != "unattempted" for url in urls
            ),
            "static_successful_urls": sum(
                static_checks.get(url) in {"ok", "page_ok"} for url in urls
            ),
            "browser_attempted_urls": sum(
                url in browser_checks and browser_checks[url].get("status") != "unattempted"
                for url in urls
            ),
            "limits": "Access checks only; media, guide and rights validation remain separate.",
        }
        for key, urls in sorted(by_identity.items())
    ]
    coverage["identity_checks"].extend(
        {
            "record_id": key,
            "planned_urls": 0,
            "static_attempted_urls": 0,
            "static_successful_urls": 0,
            "browser_attempted_urls": 0,
            "limits": "No maintained ordinary page route; document evidence remains in inventory.",
        }
        for key in coverage["identity_source_gaps"]
    )
    return coverage


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--static", type=Path, action="append", default=[])
    parser.add_argument("--browser", type=Path, action="append", default=[])
    parser.add_argument(
        "--decisions",
        type=Path,
        default=Path("data/discovery/reviewed-manifests.json"),
    )
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--coverage", type=Path)
    parser.add_argument(
        "--page-decisions", type=Path, default=Path("data/discovery/reviewed-page-leads.json")
    )
    args = parser.parse_args()

    decisions = parse_discovery_decisions(load_json_object(args.decisions))
    report = build_discovery_findings(
        load_catalogue(),
        [(str(path), load_json_object(path)) for path in args.static],
        [(str(path), load_json_object(path)) for path in args.browser],
        decisions=decisions,
        page_decisions=parse_discovery_decisions(load_json_object(args.page_decisions)),
    )
    output = dict(report)
    if args.coverage:
        coverage = load_json_object(args.coverage)
        static = [load_json_object(path) for path in args.static]
        browser = [load_json_object(path) for path in args.browser]
        coverage = network_coverage(coverage, static, browser)
        output["coverage"] = coverage
        identities: dict[str, set[str]] = {}
        for source in coverage["sources"]:
            identities.setdefault(source["url"], set()).update(source["record_ids"])
        for finding in report["findings"]:
            finding["institution_ids"] = sorted(
                identities.get(finding.get("source_page", finding["url"]), set())
            )
    write_json(args.output, output)
    print(
        f"Format-checked {report['counts']['validated']} manifest(s); "
        f"{report['counts']['page_leads']} unverified page lead(s); "
        f"{report['counts']['reviewed']} previously reviewed; "
        f"{report['counts']['review']} need review"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
