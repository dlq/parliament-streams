"""Project explicit reviewed institutional routes without inferring service clearance.

Only named URL fields are consumed. Prose, scraped HTML, temporary media URLs and
credential-bearing routes are never promoted into maintained discovery inputs.
"""

from __future__ import annotations

import json
import re
from collections.abc import Iterator
from datetime import date
from pathlib import Path, PurePosixPath
from typing import Any
from urllib.parse import urlsplit

from parliament_streams.inventory.sources import safe_public_url
from parliament_streams.research_evidence import REDACTED, sanitize_url, sanitize_value

ROOT = Path(__file__).resolve().parents[2]
REVIEW_REGISTRY = "data/discovery/service-review-inputs.json"
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


def _valid_review_date(value: Any) -> bool:
    if not isinstance(value, str):
        return False
    try:
        return date.fromisoformat(value).isoformat() == value
    except ValueError:
        return False


def load_reviews(root: Path = ROOT) -> list[tuple[str, dict[str, Any]]]:
    """Load explicitly maintained reviews; unrelated evidence never changes the plan.

    Missing or malformed inputs fail the preflight rather than silently removing
    reviewed routes from discovery, baselines or the public inventory snapshot.
    """
    registry_path = root / REVIEW_REGISTRY
    registry = json.loads(registry_path.read_text(encoding="utf-8"))
    if (
        not isinstance(registry, dict)
        or type(registry.get("registry_version")) is not int
        or registry["registry_version"] != 1
        or not isinstance(registry.get("reports"), list)
        or any(not isinstance(path, str) for path in registry["reports"])
    ):
        raise ValueError(f"{registry_path}: expected a version-1 service-review input registry")
    reports = registry["reports"]
    if reports != sorted(set(reports)):
        raise ValueError(f"{registry_path}: report paths must be unique and sorted")
    result = []
    for report in reports:
        relative = PurePosixPath(report)
        if (
            relative.is_absolute()
            or ".." in relative.parts
            or relative.parts[:2] != ("reports", "discovery")
            or relative.suffix != ".json"
            or relative.as_posix() != report
            or any(char in report for char in "\\?#")
            or any(ord(char) < 32 or ord(char) == 127 for char in report)
        ):
            raise ValueError(f"{registry_path}: expected repository-relative discovery JSON paths")
        path = root / report
        if not path.resolve().is_relative_to(root.resolve()) or not path.is_file():
            raise ValueError(
                f"{registry_path}: registered review is missing or outside the repository"
            )
        document = json.loads(path.read_text(encoding="utf-8"))
        if (
            not isinstance(document, dict)
            or not _valid_review_date(document.get("reviewed_on"))
            or not isinstance(document.get("records"), list)
            or any(
                not isinstance(row, dict)
                or not isinstance(row.get("id"), str)
                or not row["id"]
                or ("reviewed_on" in row and not _valid_review_date(row["reviewed_on"]))
                for row in document["records"]
            )
        ):
            raise ValueError(f"{path}: expected individual service-review records with ISO dates")
        result.append((report, document))
    return result


def _review_rows(
    inventory: dict[str, Any], reviews: list[tuple[str, dict[str, Any]]]
) -> Iterator[tuple[str, dict[str, Any], dict[str, Any], dict[str, Any]]]:
    """Validate exact identities before projecting any routes, report paths or notes."""
    eligible = {
        row["id"]: row
        for row in inventory["records"]
        if row["authority_status"] == "eligible_legislature"
    }
    for path, report in reviews:
        seen: set[str] = set()
        for row in report["records"]:
            key = row["id"]
            if key not in eligible or key in seen:
                raise ValueError(f"{path}: duplicate, unknown or noneligible identity {key}")
            seen.add(key)
            yield path, report, row, eligible[key]


def reviewed_routes(
    inventory: dict[str, Any], reviews: list[tuple[str, dict[str, Any]]]
) -> list[dict[str, Any]]:
    """Retain exact reviewed IDs and route purposes, including explicit unresolved access.

    An institutional route may be blocked today; monitoring it is not a claim of
    successful access. Named media routes remain research leads until publication.
    """
    result: dict[tuple[str, str, str], dict[str, Any]] = {}
    for path, _report, row, institution in _review_rows(inventory, reviews):
        key = row["id"]
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
                            "country": institution["country"],
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
    result: dict[str, list[str]] = {}
    for path, _report, row, _institution in _review_rows(inventory, reviews):
        result.setdefault(row["id"], []).append(path)
    return {key: sorted(set(paths)) for key, paths in result.items()}


def review_notes_by_id(
    inventory: dict[str, Any], reviews: list[tuple[str, dict[str, Any]]]
) -> dict[str, list[dict[str, Any]]]:
    """Keep dated unresolved findings attached to their report, never a completion claim."""
    result: dict[str, list[dict[str, Any]]] = {}
    for path, report, row, _institution in _review_rows(inventory, reviews):
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
