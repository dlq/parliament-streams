"""Project explicit reviewed institutional routes without inferring service clearance.

Only named URL fields are consumed. Prose, scraped HTML, temporary media URLs and
credential-bearing routes are never promoted into maintained discovery inputs.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

from tools.institution_inventory_sources import safe_public_url
from tools.sanitize_research_evidence import REDACTED, sanitize_url, sanitize_value

ROOT = Path(__file__).resolve().parents[1]
REVIEW_GLOB = "*-service-review-*.json"
INSTITUTION_FIELDS = {
    "institution_url",
    "institution_urls",
    "institutional_url",
    "institutional_route",
    "institutional_route_or_reference",
    "official_institutional_url",
}
MEDIA_FIELDS = {
    "official_url",
    "official_media_urls",
    "public_viewing_routes",
    "official_entry",
    "live_route",
    "provider_page",
    "shared_provider_url",
    "source_urls",
}
NON_PAGE_SUFFIXES = {
    ".m3u8",
    ".mpd",
    ".mp4",
    ".mp3",
    ".m4a",
    ".ts",
    ".m4s",
    ".webm",
    ".pdf",
    ".zip",
    ".doc",
    ".docx",
    ".ics",
    ".xml",
    ".json",
    ".svg",
    ".png",
}


def maintained_page_url(value: Any) -> str | None:
    """Accept an ordinary public page URL; never turn a redaction into a fetch URL."""
    if not isinstance(value, str):
        return None
    url = safe_public_url(value)
    if url is None or REDACTED.lower() in url.lower() or sanitize_url(url) != url:
        return None
    parts = urlsplit(url)
    if Path(parts.path).suffix.lower() in NON_PAGE_SUFFIXES:
        return None
    if any(segment in {"api", "wp-json", "feed"} for segment in parts.path.lower().split("/")):
        return None
    return url


def load_reviews(root: Path = ROOT) -> list[tuple[str, dict[str, Any]]]:
    """Discover dated individual reviews; malformed review inputs fail the preflight."""
    result = []
    for path in sorted((root / "reports/discovery").glob(REVIEW_GLOB)):
        document = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(document, dict) or not isinstance(document.get("records"), list):
            raise ValueError(f"{path}: expected individual service-review records")
        result.append((path.relative_to(root).as_posix(), document))
    return result


def reviewed_routes(
    inventory: dict[str, Any], reviews: list[tuple[str, dict[str, Any]]]
) -> list[dict[str, Any]]:
    """Retain exact reviewed IDs and route purposes, including explicit unresolved access.

    An institutional route may be blocked today; monitoring it is not a claim of
    successful access. Named media routes remain research leads until publication.
    """
    eligible = {
        row["id"]: row
        for row in inventory["records"]
        if row["authority_status"] == "eligible_legislature"
    }
    result: dict[tuple[str, str, str], dict[str, Any]] = {}
    for path, report in reviews:
        seen: set[str] = set()
        for row in report["records"]:
            key = row["id"]
            if key not in eligible or key in seen:
                raise ValueError(f"{path}: duplicate, unknown or noneligible identity {key}")
            seen.add(key)
            values = [
                ("institution", row, INSTITUTION_FIELDS),
                ("institution", row.get("metadata", {}), INSTITUTION_FIELDS),
                ("media", row.get("official_media", {}), MEDIA_FIELDS),
            ]
            for purpose, section, fields in values:
                if not isinstance(section, dict):
                    continue
                for field in sorted(fields):
                    value = section.get(field)
                    for item in value if isinstance(value, list) else [value]:
                        url = maintained_page_url(item)
                        if not url:
                            continue
                        identity = (key, purpose, url)
                        route = result.setdefault(
                            identity,
                            {
                                "record_id": key,
                                "country": eligible[key]["country"],
                                "purpose": purpose,
                                "url": url,
                                "reports": [],
                            },
                        )
                        if path not in route["reports"]:
                            route["reports"].append(path)
    return [result[key] for key in sorted(result)]


def review_reports_by_id(
    inventory: dict[str, Any], reviews: list[tuple[str, dict[str, Any]]]
) -> dict[str, list[str]]:
    # Validate all exact identities even when a review contains no reusable page route.
    reviewed_routes(inventory, reviews)
    result: dict[str, list[str]] = {}
    for path, report in reviews:
        for row in report["records"]:
            result.setdefault(row["id"], []).append(path)
    return {key: sorted(set(paths)) for key, paths in result.items()}


def review_notes_by_id(
    inventory: dict[str, Any], reviews: list[tuple[str, dict[str, Any]]]
) -> dict[str, list[dict[str, Any]]]:
    """Keep dated unresolved findings attached to their report, never a completion claim."""
    review_reports_by_id(inventory, reviews)
    result: dict[str, list[dict[str, Any]]] = {}
    for path, report in reviews:
        for row in report["records"]:
            notes = row.get("unresolved", row.get("unresolved_dimensions", []))
            if not isinstance(notes, list):
                notes = []
            result.setdefault(row["id"], []).append(
                {
                    "report": path,
                    "reviewed_on": row.get("reviewed_on", report["reviewed_on"]),
                    "scope": report.get("scope", "Individual source follow-up"),
                    "unresolved": [
                        sanitize_value(
                            note.replace("_", " ") if re.fullmatch(r"[a-z0-9_]+", note) else note
                        )
                        for note in notes
                        if isinstance(note, str)
                    ],
                }
            )
    return result
