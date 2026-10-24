"""Build the compact classic-script institution snapshot for hosted and file previews."""

from __future__ import annotations

import argparse
import json
import re
from collections.abc import Sequence
from pathlib import Path, PurePosixPath
from typing import Any
from urllib.parse import quote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INVENTORY_PATH = ROOT / "data/discovery/institutions.json"
DEFAULT_CATALOGUE_PATH = ROOT / "data/channels.json"
DEFAULT_DIRECTORY_PATH = ROOT / "reports/discovery/2026-10-24-national-chamber-inventory.json"
DEFAULT_SERVICE_REGISTER_PATH = (
    ROOT / "reports/discovery/2026-10-24-current-validation-register.json"
)
DEFAULT_TARGET_PATH = ROOT / "site/institutions-data.js"
ASSIGNMENT = "window.PARLIAMENT_STREAMS_INSTITUTIONS = "
REPORT_BASE_URL = "https://github.com/dlq/parliament-streams/blob/main/"
AUTHORITY_STATUSES = {
    "eligible_legislature",
    "outside_default_scope",
    "specific_authority_evidence_hold",
    "historical_institution_superseded",
}
# Taiwan has an own-institution directory entry rather than an IPU country record.
COUNTRY_CODE_OVERRIDES = {"Taiwan": "TW"}


def load_object(path: Path) -> dict[str, Any]:
    """Read a source object, keeping malformed input out of the published snapshot."""
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"{path}: expected a JSON object")
    return value


def safe_http_url(value: Any) -> str | None:
    """Keep public HTTP(S) evidence URLs without credentials or control characters."""
    if not isinstance(value, str):
        return None
    url = value.strip()
    if not url or "\\" in url or any(ord(char) < 32 or ord(char) == 127 for char in url):
        return None
    try:
        parts = urlsplit(url)
        if (
            parts.scheme.lower() not in {"http", "https"}
            or not parts.hostname
            or any(char.isspace() for char in parts.hostname)
            or parts.username is not None
            or parts.password is not None
        ):
            return None
        # Accessing port also rejects malformed port specifications.
        _ = parts.port
    except ValueError:
        return None
    return url


def http_urls(values: Any) -> list[str]:
    """Deduplicate and order safe evidence links."""
    if not isinstance(values, list):
        return []
    return sorted({url for value in values if (url := safe_http_url(value)) is not None})


def report_urls(provenance: Any) -> list[str]:
    """Turn repository report paths into public GitHub links, without accepting traversal."""
    result: set[str] = set()
    if not isinstance(provenance, list):
        return []
    for source in provenance:
        if not isinstance(source, dict):
            continue
        path = source.get("report")
        if not isinstance(path, str) or "\\" in path or any(ord(c) < 32 for c in path):
            continue
        parsed = PurePosixPath(path)
        if (
            parsed.is_absolute()
            or ".." in parsed.parts
            or not path.startswith("reports/")
            or parsed.suffix not in {".json", ".md"}
            or "?" in path
            or "#" in path
        ):
            continue
        result.add(REPORT_BASE_URL + quote(path, safe="/._-"))
    return sorted(result)


def countries_for_scope(countries: list[str], directory: dict[str, Any]) -> list[dict[str, str]]:
    """Derive country codes from the chamber directory's canonical country crosswalk."""
    if len(countries) != len(set(countries)):
        raise ValueError("Duplicate country in institution scope")
    codes: dict[str, str] = {}
    for chamber in directory["national_chambers"]:
        country = chamber["country"]
        code = chamber.get("ipu_country_code")
        if country not in countries or code is None:
            continue
        if not isinstance(code, str) or not re.fullmatch(r"[A-Z]{2}", code):
            raise ValueError(f"{country}: invalid directory country code")
        if country in codes and codes[country] != code:
            raise ValueError(f"{country}: conflicting directory country codes")
        codes[country] = code
    for country, code in COUNTRY_CODE_OVERRIDES.items():
        if country in countries:
            if country in codes and codes[country] != code:
                raise ValueError(f"{country}: country code conflicts with the documented override")
            codes[country] = code
    missing = set(countries) - codes.keys()
    if missing:
        raise ValueError(f"Missing country codes: {', '.join(sorted(missing))}")
    return [{"name": name, "code": codes[name]} for name in sorted(countries)]


def exact_chamber_catalogue_ids(
    directory: dict[str, Any], channels: list[dict[str, Any]]
) -> dict[str, set[str]]:
    """Join only the same recorded national chamber identifier, never a country/name match."""
    result: dict[str, set[str]] = {}
    for chamber in directory["national_chambers"]:
        code = chamber.get("ipu_chamber_code")
        country_code = chamber.get("ipu_country_code")
        if not code or not country_code:
            continue
        expected_path = f"/parliament/{country_code}/{code}/"
        for channel in channels:
            identifiers = channel.get("external_ids", {})
            if (
                channel.get("jurisdiction_level") != "national"
                or channel.get("country_or_region") != chamber["country"]
                or identifiers.get("ipu_chamber_code") != code
                or identifiers.get("ipu_country_code") != country_code
            ):
                continue
            for source in channel.get("identity_sources", []):
                url = safe_http_url(source.get("url"))
                if source.get("source") != "ipu_parline" or source.get("confidence") != "high":
                    continue
                if url:
                    parts = urlsplit(url)
                    if parts.hostname == "data.ipu.org" and parts.path == expected_path:
                        result.setdefault(chamber["id"], set()).add(channel["id"])
    return result


def build_payload(
    inventory: dict[str, Any],
    catalogue: dict[str, Any],
    directory: dict[str, Any],
    service_register: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Project all identities and scope decisions without implying service validation."""
    country_names: list[str] = inventory["scope"]["countries"]
    countries = countries_for_scope(country_names, directory)
    source_records: list[dict[str, Any]] = inventory["records"]
    records_by_id = {row["id"]: row for row in source_records}
    if len(records_by_id) != len(source_records):
        raise ValueError("Duplicate institution ID")
    channels: list[dict[str, Any]] = catalogue["channels"]
    channel_ids = {channel["id"] for channel in channels}
    if len(channel_ids) != len(channels):
        raise ValueError("Duplicate catalogue source ID")
    chamber_links = exact_chamber_catalogue_ids(directory, channels)
    service_links: dict[str, set[str]] = {}
    if service_register is not None:
        for body in service_register.get("eligible_bodies", []):
            body_id = body["body_id"]
            if body_id not in records_by_id:
                raise ValueError(f"{body_id}: service crosswalk has an unknown institution ID")
            if body_id in service_links:
                raise ValueError(f"{body_id}: duplicate service crosswalk institution ID")
            service_links[body_id] = set(body.get("catalogue_ids", [])) & channel_ids
    records: list[dict[str, Any]] = []
    for row in source_records:
        institution_id = row["id"]
        status = row["authority_status"]
        if status not in AUTHORITY_STATUSES or row["country"] not in country_names:
            raise ValueError(f"{institution_id}: unknown status or country")
        relationships: list[dict[str, str]] = []
        for relation in row.get("relationships", []):
            target_id = relation["institution_id"]
            if target_id not in records_by_id or target_id == institution_id:
                raise ValueError(f"{institution_id}: broken institution relationship")
            relationships.append({"type": relation["type"], "institution_id": target_id})
        # A parent's source, a service-register pointer, or country-level coverage is not a link.
        # The newer exact body_id crosswalk supersedes the older retained field, including [].
        explicit = service_links.get(
            institution_id, set(row.get("existing_catalogue_ids", [])) & channel_ids
        )
        exact = chamber_links.get(institution_id, set())
        evidence_reports = list(row.get("provenance", []))
        if institution_id in service_links and explicit:
            evidence_reports.append(
                {"report": DEFAULT_SERVICE_REGISTER_PATH.relative_to(ROOT).as_posix()}
            )
        if exact:
            evidence_reports.append({"report": DEFAULT_DIRECTORY_PATH.relative_to(ROOT).as_posix()})
        records.append(
            {
                "id": institution_id,
                "country": row["country"],
                "name": row["name"],
                "aliases": row.get("aliases", []),
                "jurisdiction_label": row.get("jurisdiction_label") or row["country"],
                "level": row["level"],
                "kind": row["inventory_grain"],
                "status": status,
                "relationships": sorted(
                    relationships, key=lambda item: (item["type"], item["institution_id"])
                ),
                "catalogue_ids": sorted(explicit | exact),
                "decision_basis": row["decision_basis"],
                "remaining_authority_instruments": row.get("remaining_authority_instruments", []),
                "primary_urls": http_urls(
                    row.get("primary_urls", []) + row.get("source_published_institution_urls", [])
                ),
                "report_urls": report_urls(evidence_reports),
            }
        )
    records.sort(key=lambda row: (row["country"], row["name"].casefold(), row["id"]))
    return {
        "reviewed_on": inventory["reviewed_on"],
        "countries": countries,
        "records": records,
        "scope": {
            "country_baseline": inventory["scope"]["country_baseline"],
            "territorial_boundary": inventory["scope"]["territorial_boundary"],
            "default_statuses": ["eligible_legislature", "specific_authority_evidence_hold"],
            "record_count_is_not_a_jurisdiction_legislature_or_service_count": True,
            "complete_exhaustive_institutional_census_certified": False,
            "catalogue_links_do_not_certify_current_playback_or_rights": True,
        },
    }


def render_site_data(
    inventory_path: Path = DEFAULT_INVENTORY_PATH,
    catalogue_path: Path = DEFAULT_CATALOGUE_PATH,
    directory_path: Path = DEFAULT_DIRECTORY_PATH,
    service_register_path: Path = DEFAULT_SERVICE_REGISTER_PATH,
) -> str:
    """Render a deterministic external classic script with no fetch requirement."""
    payload = build_payload(
        load_object(inventory_path),
        load_object(catalogue_path),
        load_object(directory_path),
        load_object(service_register_path),
    )
    text = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    text = text.replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    return "// Generated by tools/build_institution_site_data.py; do not edit.\n" + (
        f"{ASSIGNMENT}{text};\n"
    )


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true", help="fail if the snapshot is stale")
    mode.add_argument("--write", action="store_true", help="write the snapshot (default)")
    parser.add_argument("--inventory", type=Path, default=DEFAULT_INVENTORY_PATH)
    parser.add_argument("--catalogue", type=Path, default=DEFAULT_CATALOGUE_PATH)
    parser.add_argument("--directory", type=Path, default=DEFAULT_DIRECTORY_PATH)
    parser.add_argument("--service-register", type=Path, default=DEFAULT_SERVICE_REGISTER_PATH)
    parser.add_argument("--output", type=Path, default=DEFAULT_TARGET_PATH)
    args = parser.parse_args(argv)
    try:
        expected = render_site_data(
            args.inventory, args.catalogue, args.directory, args.service_register
        )
        if args.check:
            if not args.output.exists() or args.output.read_text(encoding="utf-8") != expected:
                parser.error(
                    "institution snapshot is stale; run "
                    "`python tools/build_institution_site_data.py`"
                )
        else:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(expected, encoding="utf-8")
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.error(str(error))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
