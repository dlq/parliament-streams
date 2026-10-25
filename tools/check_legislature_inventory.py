"""Monitor institution evidence and propose inventory changes for human review.

The maintained inventory is never edited by this command. HTTP observations are
not legislative-authority decisions, and missing/partial sources are not removals.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import sys
import time
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, date, datetime
from pathlib import Path
from typing import Any
from urllib.parse import urldefrag, urlsplit

if __package__ in {None, ""}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from parliament_streams.inventory.projection import exact_chamber_catalogue_ids  # noqa: E402
from parliament_streams.inventory.reviews import load_reviews, reviewed_routes  # noqa: E402
from parliament_streams.inventory.sources import (  # noqa: E402
    derive_directory_sources,
    extract_directory_links,
    ipu_api_url,
    parse_ipu_pages,
    safe_public_url,
    source_fingerprint,
)
from parliament_streams.research_evidence import sanitize_value  # noqa: E402
from tools.institution_inventory_fetch import HostGate, fetch_source  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
INVENTORY = ROOT / "data/discovery/institutions.json"
DIRECTORY = ROOT / "reports/discovery/2026-10-24-national-chamber-inventory.json"
SERVICES = ROOT / "reports/discovery/2026-10-24-current-validation-register.json"
DECISIONS = ROOT / "data/discovery/inventory-review-decisions.json"
USER_AGENT = "ParliamentStreamsInventoryReview/1.0 (+https://github.com/dlq/parliament-streams)"
IPU_ID = "ipu-national-chambers"
REVIEW_ORDER = {
    kind: index
    for index, kind in enumerate(
        (
            "proposed_addition",
            "proposed_removal",
            "proposed_rename",
            "directory_link_added",
            "directory_link_removed",
            "directory_label_changed",
            "directory_metadata_changed",
            "activity_review",
            "url_changed",
            "evidence_changed",
            "stale_review",
            "source_gap",
        )
    )
}
PERSISTENT_KINDS = {
    "evidence_changed",
    "directory_link_added",
    "directory_link_removed",
    "url_changed",
    "proposed_addition",
    "proposed_removal",
    "proposed_rename",
    "directory_metadata_changed",
    "activity_review",
    "directory_label_changed",
}
LEGISLATURE_WORDS = re.compile(
    r"parli[ae]ment|legislat|assembly|assembl[eé]|senat|senad|congress|congres|"
    r"landtag|landrat|kantonsrat|lagting|sejm|sabor|skup[šs]tin|rada|provincial council|"
    r"provinciale staten|cortes|diet\b|knesset|議[会會]|立法院|국회|의회|"
    r"संसद|विधान|مجلس|כנסת|council of states",
    re.IGNORECASE,
)


def load_object(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path}: expected a JSON object")
    return data


def digest(value: Any) -> str:
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, ensure_ascii=False).encode()
    ).hexdigest()


def fetch_url(value: str) -> str | None:
    """Strip document fragments, preserving significant paths and query parameters."""
    return safe_public_url(urldefrag(value)[0])


def plan_sources(
    inventory: dict[str, Any],
    services: dict[str, Any],
    today: str,
    reviews: list[tuple[str, dict[str, Any]]] | None = None,
    catalogue: dict[str, Any] | None = None,
    directory: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    """Share one fetch across every institution/country citing the same evidence."""
    sources: dict[str, dict[str, Any]] = {}
    records = {row["id"]: row for row in inventory["records"]}

    def add(url: str, country: str, record_id: str | None = None, directory: bool = False) -> None:
        # The reviewed dated API export is replaced with one current complete request.
        if urlsplit(url).hostname == "data.ipu.org" and "/data-explorer" in urlsplit(url).path:
            return
        normalized = fetch_url(url)
        key = "source-" + digest(normalized or url)[:20]
        source = sources.setdefault(
            key,
            {
                "id": key,
                "url": normalized or url,
                "kind": "evidence",
                "countries": [],
                "record_ids": [],
                "directory": False,
                "safe": normalized is not None,
            },
        )
        source["countries"] = sorted(set(source["countries"]) | {country})
        if record_id:
            source["record_ids"] = sorted(set(source["record_ids"]) | {record_id})
        source["directory"] = source["directory"] or directory

    for source in derive_directory_sources(inventory):
        add(source.url, source.country, directory=True)
    for row in records.values():
        for url in row.get("primary_urls", []) + row.get("source_published_institution_urls", []):
            add(url, row["country"], row["id"])
    for body in services.get("eligible_bodies", []):
        record = records.get(body["body_id"])
        url = body.get("official_reference_url")
        if record and record["country"] == body["country"] and url:
            add(url, record["country"], record["id"])
    for route in reviewed_routes(inventory, reviews or []):
        add(route["url"], route["country"], route["record_id"])
    if catalogue is not None:
        channels = {row["id"]: row for row in catalogue["channels"]}
        historical = {row["body_id"]: row for row in services.get("eligible_bodies", [])}
        national = (
            exact_chamber_catalogue_ids(directory, list(channels.values())) if directory else {}
        )
        for key, record in records.items():
            if record["authority_status"] != "eligible_legislature":
                continue
            ids = set(
                record.get("catalogue_crosswalk", {}).get(
                    "catalogue_ids",
                    historical.get(key, {}).get(
                        "catalogue_ids", record.get("existing_catalogue_ids", [])
                    ),
                )
            )
            ids |= national.get(key, set())
            for channel_id in ids & channels.keys():
                add(channels[channel_id]["official_url"], record["country"], key)
    return [
        {
            "id": IPU_ID,
            "url": ipu_api_url(today),
            "kind": "ipu",
            "countries": inventory["scope"]["countries"],
            "record_ids": [],
            "directory": True,
            "safe": True,
        },
        *sorted(sources.values(), key=lambda row: (row["url"], row["id"])),
    ]


def observation(
    source: dict[str, Any],
    fetched: dict[str, Any],
    previous: dict[str, Any] | None,
    scope_codes: set[str],
) -> dict[str, Any]:
    if fetched.get("not_modified") and previous:
        return {**previous, "last_checked_at": fetched["checked_at"]}
    body: bytes = fetched["body"]
    content_type = fetched.get("content_type", "")
    text = body.decode("utf-8", errors="replace")
    clean_text: str = sanitize_value(text)
    row = {
        "source_id": source["id"],
        "url": source["url"],
        "observed_at": fetched["checked_at"],
        "last_checked_at": fetched["checked_at"],
        "final_url": fetched["final_url"],
        "content_type": content_type,
        "etag": fetched.get("etag"),
        "last_modified": fetched.get("last_modified"),
        "fingerprint": source_fingerprint(
            clean_text if any(kind in content_type for kind in ("html", "json", "text/")) else body,
            content_type,
        ),
        "links": [],
        "chambers": [],
    }
    if source["kind"] == "ipu":
        chambers = parse_ipu_pages([json.loads(text)], scope_codes)
        if not chambers:
            raise ValueError("IPU returned no in-scope chambers; completeness is not established")
        row["chambers"] = [
            {
                "external_id": chamber.external_id,
                "country_code": chamber.country_code,
                "name": chamber.name,
                "website_urls": list(chamber.website_urls),
                "suspended": chamber.suspended,
                "website_urls_known": chamber.website_urls_known,
                "parliament_name": chamber.parliament_name,
                "structure": chamber.structure,
            }
            for chamber in chambers
        ]
    elif "html" in content_type:
        visible = html.unescape(
            re.sub(
                r"<[^>]+>",
                " ",
                re.sub(r"<(script|style)\b[^>]*>.*?</\1\s*>", "", text, flags=re.I | re.S),
            )
        )
        challenge_title = re.search(
            r"<title[^>]*>\s*(?:access denied|just a moment|security check|"
            r"attention required|page not found|404\b)",
            text,
            re.I,
        )
        if challenge_title or re.search(
            r"verify you are human|checking your browser", visible, re.IGNORECASE
        ):
            raise ValueError("Access/challenge page; institutional content not confirmed")
        row["links"] = extract_directory_links(clean_text, fetched["final_url"])
        if not visible.strip() and not row["links"]:
            raise ValueError("Empty JavaScript shell; institutional content not confirmed")
    elif "pdf" in content_type and not body.lstrip().startswith(b"%PDF-"):
        raise ValueError("PDF response lacks a PDF header; incomplete evidence")
    elif not ("pdf" in content_type or "json" in content_type or "text/" in content_type):
        raise ValueError("Unsupported evidence content type; baseline retained")
    return dict(sanitize_value(row))


def finding(kind: str, title: str, source_id: str, **details: Any) -> dict[str, Any]:
    details = sanitize_value(details)
    identity = {
        "kind": kind,
        "source_id": source_id,
        **{
            key: value
            for key, value in details.items()
            if key not in {"evidence_url", "caveat", "countries", "record_ids", "error"}
        },
    }
    return {
        "id": digest(identity)[:24],
        "kind": kind,
        "title": title,
        "source_id": source_id,
        **details,
    }


def expected_ipu_records(
    directory: dict[str, Any], inventory: dict[str, Any]
) -> dict[str, dict[str, Any]]:
    """Resolve exact reviewed provider identifiers without guessing from names."""
    references = {row["id"]: row for row in directory["national_chambers"]}
    expected: dict[str, dict[str, Any]] = {}
    for record in inventory["records"]:
        if record["authority_status"] == "historical_institution_superseded":
            continue
        reference = references.get(record["id"], {})
        identifiers = record.get("external_ids", {})
        code = identifiers.get("ipu_chamber_code") or reference.get("ipu_chamber_code")
        if not code:
            continue
        country = identifiers.get("ipu_country_code") or reference.get("ipu_country_code")
        if not isinstance(code, str) or not isinstance(country, str) or code in expected:
            raise ValueError("Ambiguous maintained IPU identifier crosswalk")
        expected[code] = {"record": record, "reference": reference, "country": country}
    return expected


def compare_ipu(
    current: dict[str, Any], directory: dict[str, Any], inventory: dict[str, Any]
) -> list[dict[str, Any]]:
    """Compare exact provider identities with current reviewed names and metadata."""
    expected = expected_ipu_records(directory, inventory)
    observed = {row["external_id"]: row for row in current["chambers"]}
    if len(expected) >= 10 and len(expected.keys() & observed.keys()) < len(expected) * 0.7:
        raise ValueError("IPU identity coverage collapsed; mass removal inference suppressed")
    findings: list[dict[str, Any]] = []
    for code, row in observed.items():
        if code not in expected:
            findings.append(
                finding(
                    "proposed_addition",
                    "National chamber not matched in reviewed IPU crosswalk",
                    IPU_ID,
                    external_id=code,
                    country_code=row["country_code"],
                    name=row["name"],
                    evidence_url=current["url"],
                    caveat=(
                        "Directory identity lead; verify scope, aliases and legislative authority "
                        "before adding."
                    ),
                )
            )
            continue
        match = expected[code]
        old = match["record"]
        reference = match["reference"]
        if row["country_code"] != match["country"]:
            raise ValueError("IPU chamber changed country identifier; comparison requires review")
        if row["name"] not in {old["name"], *old.get("aliases", [])}:
            findings.append(
                finding(
                    "proposed_rename",
                    "National chamber directory name differs",
                    IPU_ID,
                    record_ids=[old["id"]],
                    external_id=code,
                    before=old["name"],
                    after=row["name"],
                    caveat="Directory name differs; preferred local naming requires review.",
                )
            )
        published_urls = old.get(
            "source_published_institution_urls",
            reference.get("source_published_parliamentary_urls", []),
        )
        old_urls = sorted({url for raw in published_urls if (url := fetch_url(raw))})
        if row.get("website_urls_known", True) and sorted(row["website_urls"]) != old_urls:
            findings.append(
                finding(
                    "directory_metadata_changed",
                    "National chamber website links differ",
                    IPU_ID,
                    record_ids=[old["id"]],
                    external_id=code,
                    field="website_urls",
                    before=old_urls,
                    after=row["website_urls"],
                )
            )
        before_suspended = old.get("ipu_suspended")
        if before_suspended is None and reference:
            before_suspended = any(
                reference.get(key) == "Yes"
                for key in ("suspended_chamber_from_source", "suspended_parliament_from_source")
            )
        if before_suspended is not None and row["suspended"] != before_suspended:
            findings.append(
                finding(
                    "activity_review",
                    "IPU suspension/activity flag differs",
                    IPU_ID,
                    record_ids=[old["id"]],
                    external_id=code,
                    before=before_suspended,
                    after=row["suspended"],
                    caveat="Suspension alone does not establish dissolution or lost authority.",
                )
            )
        for field, reference_key, label in (
            ("structure", "structure_from_source", "parliamentary structure"),
            ("parliament_name", "parliament_name_from_source", "parliament name"),
        ):
            old_value = old.get("ipu_" + field, reference.get(reference_key))
            if old_value is not None and row.get(field) and row[field] != old_value:
                findings.append(
                    finding(
                        "directory_metadata_changed",
                        f"IPU {label} differs",
                        IPU_ID,
                        record_ids=[old["id"]],
                        external_id=code,
                        field=field,
                        before=old_value,
                        after=row[field],
                    )
                )
    for code, match in expected.items():
        if code not in observed:
            old = match["record"]
            findings.append(
                finding(
                    "proposed_removal",
                    "Reviewed national chamber missing from complete IPU directory",
                    IPU_ID,
                    record_ids=[old["id"]],
                    external_id=code,
                    name=old["name"],
                    evidence_url=current["url"],
                    caveat=(
                        "Possible retirement/merger/directory change only; require primary "
                        "confirmation and retain historical identity."
                    ),
                )
            )
    return findings


def compare_evidence(
    source: dict[str, Any],
    current: dict[str, Any],
    previous: dict[str, Any],
    known_urls: set[str],
) -> list[dict[str, Any]]:
    common = {
        "evidence_url": source["url"],
        "record_ids": source["record_ids"],
        "countries": source["countries"],
    }
    findings: list[dict[str, Any]] = []
    if current["fingerprint"] != previous["fingerprint"]:
        findings.append(
            finding(
                "evidence_changed",
                "Maintained evidence page changed",
                source["id"],
                before=previous["fingerprint"],
                after=current["fingerprint"],
                **common,
                caveat=(
                    "Content drift is a review signal; it does not establish an institutional or"
                    " legal change."
                ),
            )
        )
    if current["final_url"] != previous["final_url"]:
        findings.append(
            finding(
                "url_changed",
                "Evidence page redirect destination changed",
                source["id"],
                before=previous["final_url"],
                after=current["final_url"],
                **common,
            )
        )
    if source["directory"]:
        before = {row["url"]: row["name"] for row in previous.get("links", [])}
        after = {row["url"]: row["name"] for row in current.get("links", [])}
        # A large link-set collapse usually means a partial render or redesigned page.
        if len(before) >= 10 and len(after) < len(before) / 2:
            return [
                finding(
                    "source_gap",
                    "Directory link coverage collapsed; removal inference suppressed",
                    source["id"],
                    **common,
                )
            ]
        for url in sorted(after.keys() - before.keys()):
            if url not in known_urls and LEGISLATURE_WORDS.search(after[url]):
                findings.append(
                    finding(
                        "directory_link_added",
                        "Possible institution addition in a maintained country source",
                        source["id"],
                        name=after[url],
                        url=url,
                        **common,
                        caveat=(
                            "New directory link only; may describe a known, excluded, municipal or "
                            "out-of-scope body."
                        ),
                    )
                )
        for url in sorted(before.keys() - after.keys()):
            if url in known_urls and LEGISLATURE_WORDS.search(before[url]):
                findings.append(
                    finding(
                        "directory_link_removed",
                        "Known institution link missing from a maintained country source",
                        source["id"],
                        name=before[url],
                        url=url,
                        **common,
                        caveat=(
                            "Link withdrawal is not dissolution. Confirm primary legal evidence "
                            "before retirement."
                        ),
                    )
                )
        for url in sorted(before.keys() & after.keys()):
            if before[url] != after[url] and (
                LEGISLATURE_WORDS.search(before[url]) or LEGISLATURE_WORDS.search(after[url])
            ):
                findings.append(
                    finding(
                        "directory_label_changed",
                        "Institution link label differs in a country source",
                        source["id"],
                        url=url,
                        before=before[url],
                        after=after[url],
                        **common,
                        caveat="Possible naming or translation change; verify identity.",
                    )
                )
    return findings


def review_dates(inventory: dict[str, Any], today: date, stale_days: int) -> list[dict[str, Any]]:
    groups: dict[tuple[str, str], list[str]] = {}
    for row in inventory["records"]:
        date_text = row.get(
            "institution_reviewed_on",
            row.get("latest_legal_hold_review", {}).get("reviewed_on", inventory["reviewed_on"]),
        )
        try:
            reviewed = date.fromisoformat(date_text)
            age = (today - reviewed).days
            status = (
                "future_review_date" if age < 0 else "stale_review" if age >= stale_days else ""
            )
        except (ValueError, TypeError):
            status = "invalid_review_date"
        if status:
            groups.setdefault((status, str(date_text)), []).append(row["id"])
    return [
        finding(
            kind,
            "Recorded institutional review needs attention",
            "inventory-review-dates",
            reviewed_on=reviewed,
            record_ids=sorted(ids),
            caveat=(
                "A reachable evidence page never renews the recorded legal/institutional "
                "review date."
            ),
        )
        for (kind, reviewed), ids in sorted(groups.items())
    ]


def decision_ids(decisions: dict[str, Any]) -> set[str]:
    if decisions.get("schema_version") != 1 or not isinstance(decisions.get("decisions"), list):
        raise ValueError("Inventory review decisions require schema_version 1 and decisions list")
    result: set[str] = set()
    for row in decisions["decisions"]:
        identifier = row.get("finding_id", "")
        if not re.fullmatch(r"[a-f0-9]{24}", identifier) or identifier in result:
            raise ValueError("Invalid or duplicate inventory review finding ID")
        if row.get("decision") not in {"accepted", "dismissed"} or not row.get("note", "").strip():
            raise ValueError("Review decisions need accepted/dismissed and a rationale")
        date.fromisoformat(row["reviewed_on"])
        result.add(identifier)
    return result


def validate_baseline(baseline: dict[str, Any]) -> None:
    """Reject broken artifacts before using their validators or change comparisons."""
    if (
        baseline.get("schema_version") != 1
        or not isinstance(baseline.get("sources"), dict)
        or not isinstance(baseline.get("inventory_records"), dict)
        or not isinstance(baseline.get("pending_findings", []), list)
    ):
        raise ValueError("Unsupported or malformed prior inventory snapshot")
    for source_id, row in baseline["sources"].items():
        if (
            not isinstance(source_id, str)
            or not isinstance(row, dict)
            or row.get("source_id") != source_id
            or not re.fullmatch(r"[a-f0-9]{64}", row.get("fingerprint", ""))
            or not fetch_url(row.get("url", ""))
            or not fetch_url(row.get("final_url", ""))
            or not isinstance(row.get("links"), list)
            or not isinstance(row.get("chambers"), list)
        ):
            raise ValueError("Malformed source observation in prior inventory snapshot")
        datetime.fromisoformat(row["observed_at"])
        for item in row["links"]:
            if (
                not isinstance(item, dict)
                or not isinstance(item.get("name"), str)
                or not fetch_url(item.get("url", ""))
            ):
                raise ValueError("Malformed directory link in prior inventory snapshot")
    seen: set[str] = set()
    for row in baseline.get("pending_findings", []):
        if (
            not isinstance(row, dict)
            or not isinstance(row.get("id"), str)
            or not re.fullmatch(r"[a-f0-9]{24}", row["id"])
            or row["id"] in seen
            or row.get("kind") not in PERSISTENT_KINDS
            or not isinstance(row.get("source_id"), str)
            or not isinstance(row.get("title"), str)
        ):
            raise ValueError("Malformed pending finding in prior inventory snapshot")
        seen.add(row["id"])


def proposal_resolved(
    proposal: dict[str, Any],
    inventory: dict[str, Any],
    directory: dict[str, Any],
    known_urls: set[str],
) -> bool:
    """Recognize explicit canonical resolutions without requiring an available source."""
    kind = proposal["kind"]
    if kind == "directory_link_added":
        return proposal.get("url") in known_urls
    if kind == "proposed_addition":
        return proposal.get("external_id") in expected_ipu_records(directory, inventory)
    ids = set(proposal.get("record_ids", []))
    rows = [row for row in inventory["records"] if row["id"] in ids]
    if kind == "proposed_removal":
        return bool(rows) and all(
            row["authority_status"] == "historical_institution_superseded" for row in rows
        )
    if kind == "proposed_rename":
        return bool(rows) and all(
            proposal.get("after") in {row["name"], *row.get("aliases", [])} for row in rows
        )
    if kind == "activity_review":
        return bool(rows) and all(row.get("ipu_suspended") == proposal.get("after") for row in rows)
    if kind == "directory_metadata_changed":
        field = proposal.get("field")
        if field == "website_urls":
            return bool(rows) and all(
                sorted(
                    {
                        url
                        for raw in row.get("source_published_institution_urls", [])
                        if (url := fetch_url(raw))
                    }
                )
                == proposal.get("after")
                for row in rows
            )
        return bool(rows) and all(
            row.get("ipu_" + str(field)) == proposal.get("after") for row in rows
        )
    return False


def build_report(
    inventory: dict[str, Any],
    directory: dict[str, Any],
    sources: list[dict[str, Any]],
    fetched: dict[str, dict[str, Any]],
    baseline: dict[str, Any] | None,
    decisions: dict[str, Any],
    today: date,
    stale_days: int = 365,
    limited: bool = False,
) -> tuple[dict[str, Any], dict[str, Any]]:
    """Reconcile observations while retaining valid baselines and unreviewed proposals."""
    if baseline is not None:
        validate_baseline(baseline)
    acknowledged = decision_ids(decisions)
    previous_sources = baseline.get("sources", {}) if baseline else {}
    next_sources = dict(previous_sources)
    source_map = {row["id"]: row for row in sources}
    if len(source_map) != len(sources):
        raise ValueError("Duplicate monitored source ID")
    codes = {
        row["ipu_country_code"]
        for row in directory["national_chambers"]
        if row.get("ipu_country_code")
    }
    if "Taiwan" in inventory["scope"]["countries"]:
        codes.add("TW")
    known_urls = {
        url
        for row in inventory["records"]
        for raw in row.get("primary_urls", []) + row.get("source_published_institution_urls", [])
        if (url := fetch_url(raw))
    }
    known_urls |= {row["url"] for row in sources if row["record_ids"]}
    findings: list[dict[str, Any]] = review_dates(inventory, today, stale_days)
    successful = 0
    checks: list[dict[str, Any]] = []
    for source in sources:
        response = fetched[source["id"]]
        previous = previous_sources.get(source["id"])
        check = {
            "source_id": source["id"],
            "url": source["url"],
            "countries": source["countries"],
            "record_ids": source["record_ids"],
            "http_status": response.get("http_status"),
        }
        try:
            if not response.get("ok"):
                raise ValueError(response.get("error", "Source unavailable"))
            current = observation(source, response, previous, codes)
            if source["kind"] == "ipu":
                findings.extend(compare_ipu(current, directory, inventory))
            elif previous:
                changes = compare_evidence(source, current, previous, known_urls)
                if any(row["kind"] == "source_gap" for row in changes):
                    # Keep the previous complete directory observation for a later recovery.
                    raise ValueError(
                        "Directory coverage became partial; previous complete baseline retained"
                    )
                findings.extend(changes)
            next_sources[source["id"]] = current
            successful += 1
            check.update(
                status="unchanged_cached" if response.get("not_modified") else "observed",
                observed_at=current["observed_at"],
            )
        except (ValueError, KeyError, TypeError) as error:
            check.update(
                status="unresolved",
                error=str(error),
                retained_observed_at=previous.get("observed_at") if previous else None,
            )
            findings.append(
                finding(
                    "source_gap",
                    "Evidence source could not be compared",
                    source["id"],
                    evidence_url=source["url"],
                    record_ids=source["record_ids"],
                    countries=source["countries"],
                    error=str(error),
                    caveat="No removal or authority conclusion; last valid observation retained.",
                )
            )
        checks.append(check)
    # Observation dates may advance. Human review is a separate, explicit operation.
    prior_pending = {row["id"]: row for row in (baseline or {}).get("pending_findings", [])}
    for item in findings:
        checked_at = fetched.get(item["source_id"], {}).get(
            "checked_at", datetime.now(UTC).isoformat()
        )
        item["first_seen_at"] = prior_pending.get(item["id"], {}).get("first_seen_at", checked_at)
        item["last_seen_at"] = checked_at
    pending = {
        row["id"]: row
        for row in (baseline or {}).get("pending_findings", [])
        if row.get("kind") in PERSISTENT_KINDS
    }
    pending.update({row["id"]: row for row in findings if row["kind"] in PERSISTENT_KINDS})
    pending = {
        identifier: row
        for identifier, row in pending.items()
        if not proposal_resolved(row, inventory, directory, known_urls)
    }
    active = {
        row["id"]: row
        for row in findings
        if row["id"] not in acknowledged
        and not proposal_resolved(row, inventory, directory, known_urls)
    }
    active.update(
        {identifier: row for identifier, row in pending.items() if identifier not in acknowledged}
    )
    current_ids = {row["id"] for row in findings}
    active = {
        identifier: {**row, "pending_from_prior_observation": identifier not in current_ids}
        for identifier, row in active.items()
    }
    if limited:
        row = finding(
            "coverage_gap", "Limited smoke run; remaining sources were not checked", "run-coverage"
        )
        active[row["id"]] = row
    counts = Counter(row["kind"] for row in active.values())
    current_records = {
        row["id"]: {
            key: row.get(key) for key in ("name", "country", "authority_status", "relationships")
        }
        for row in inventory["records"]
    }
    reviewed_updates: list[dict[str, Any]] = []
    if baseline:
        old_records = baseline["inventory_records"]
        for record_id in sorted(current_records.keys() | old_records.keys()):
            if current_records.get(record_id) != old_records.get(record_id):
                reviewed_updates.append(
                    {
                        "record_id": record_id,
                        "before": old_records.get(record_id),
                        "after": current_records.get(record_id),
                        "scope": (
                            "Maintained inventory changed since baseline; already committed, "
                            "not an automatic proposal."
                        ),
                    }
                )
    report = {
        "schema_version": 1,
        "checked_at": datetime.now(UTC).isoformat(),
        "inventory_reviewed_on": inventory["reviewed_on"],
        "baseline_available": baseline is not None,
        "limited_run": limited,
        "inventory_entries": len(inventory["records"]),
        "country_groups": len(inventory["scope"]["countries"]),
        "counts": {
            "sources": len(sources),
            "observed": successful,
            "unresolved_sources": len(sources) - successful,
            "review": len(active),
            **dict(counts),
        },
        "findings": sorted(
            active.values(), key=lambda row: (REVIEW_ORDER.get(row["kind"], 99), row["id"])
        ),
        "reviewed_inventory_updates": reviewed_updates,
        "checks": checks,
        "limits": [
            (
                "Proposals require human review; no inventory, authority decision or public "
                "page is changed."
            ),
            "Missing, blocked or partial sources are access gaps, never proof of dissolution.",
            (
                "IPU comparisons cover its reviewed national-chamber crosswalk; Taiwan and "
                "other constitutional bodies are not inferred absent."
            ),
            (
                "Generic regional link changes are leads, not an exhaustive automated "
                "institutional census."
            ),
            (
                "A first observation establishes a page baseline; it does not reconstruct "
                "older page changes."
            ),
            (
                "HTTP observations do not update institutional legal-review dates or "
                "validate broadcasts, EPG or reuse rights."
            ),
        ],
    }
    snapshot = {
        "schema_version": 1,
        "checked_at": report["checked_at"],
        "inventory_sha256": digest(inventory),
        "inventory_records": current_records,
        "sources": next_sources,
        "pending_findings": [
            row for identifier, row in sorted(pending.items()) if identifier not in acknowledged
        ],
    }
    return dict(sanitize_value(report)), dict(sanitize_value(snapshot))


def markdown_text(value: Any, limit: int = 300) -> str:
    """Keep source content as inert report text, including GitHub mentions/HTML."""
    text = json.dumps(value, ensure_ascii=False) if not isinstance(value, str) else value
    text = re.sub(r"\s+", " ", text).replace("@", "＠")
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"([\\`*_{}\[\]()#!|])", r"\\\1", text)
    return text[:limit] + ("…" if len(text) > limit else "")


def render_markdown(report: dict[str, Any], maximum_findings: int | None = None) -> str:
    counts = report["counts"]
    lines = [
        "## Monthly legislature inventory review",
        "",
        f"Inventory: {report['inventory_entries']} entries across "
        f"{report['country_groups']} country groups.",
        f"Sources observed: {counts['observed']}/{counts['sources']}; "
        f"unresolved sources: {counts['unresolved_sources']}; "
        f"findings for review: {counts['review']}.",
        "",
        f"Proposed national additions: {counts.get('proposed_addition', 0)}; "
        f"possible national retirements: {counts.get('proposed_removal', 0)}; "
        f"directory link additions/withdrawals: {counts.get('directory_link_added', 0)}/"
        f"{counts.get('directory_link_removed', 0)}.",
        "",
        (
            "No inventory changes were made. Every addition, retirement, rename or "
            "authority change requires review."
        ),
        "",
    ]
    if not report["baseline_available"]:
        lines.extend(
            [
                (
                    "**First observation:** generic evidence-page baselines are being "
                    "established. National directory identities are compared with the reviewed "
                    "crosswalk; earlier regional page changes cannot be reconstructed."
                ),
                "",
            ]
        )
    if report["limited_run"]:
        lines.extend(
            ["**Limited smoke run:** this report does not cover all maintained sources.", ""]
        )
    selected = (
        report["findings"] if maximum_findings is None else report["findings"][:maximum_findings]
    )
    for item in selected:
        lines.extend(
            [
                f"### {markdown_text(item['kind'])}: {markdown_text(item['title'])}",
                "",
                f"Finding ID: `{item['id']}`",
                "",
            ]
        )
        for key in (
            "first_seen_at",
            "last_seen_at",
            "pending_from_prior_observation",
            "name",
            "external_id",
            "countries",
            "record_ids",
            "evidence_url",
            "url",
            "before",
            "after",
            "error",
            "caveat",
        ):
            if item.get(key):
                lines.append(f"- {key.replace('_', ' ')}: {markdown_text(item[key], 700)}")
        lines.append("")
    if len(selected) < len(report["findings"]):
        lines.extend(
            ["Further findings are in the downloadable report.json and report.md artifacts.", ""]
        )
    lines.extend(
        [
            "### Scope and interpretation",
            "",
            *[f"- {note}" for note in report["limits"]],
            "",
            (
                "Review a finding by recording its exact ID, decision, review date and "
                "rationale in data/discovery/inventory-review-decisions.json. Apply accepted"
                " institutional changes separately to the maintained inventory and evidence "
                "crosswalk."
            ),
            "",
        ]
    )
    return "\n".join(lines)


def collect_sources(
    sources: list[dict[str, Any]],
    previous: dict[str, Any],
    timeout: float,
    workers: int,
    max_bytes: int,
    budget_seconds: float,
) -> dict[str, dict[str, Any]]:
    """Leave enough workflow time to save a partial report when sources are slow."""
    gate = HostGate()
    deadline = time.monotonic() + budget_seconds

    def collect(source: dict[str, Any]) -> dict[str, Any]:
        if time.monotonic() >= deadline:
            return {
                "source_id": source["id"],
                "ok": False,
                "checked_at": datetime.now(UTC).isoformat(),
                "error": "Run time budget reached; source was not checked",
            }
        return fetch_source(source, previous.get(source["id"]), gate, timeout, max_bytes)

    with ThreadPoolExecutor(max_workers=workers) as pool:
        responses = []
        for index, response in enumerate(pool.map(collect, sources), 1):
            responses.append(response)
            if len(sources) >= 100 and (index % 100 == 0 or index == len(sources)):
                print(f"Processed {index}/{len(sources)} evidence URLs", flush=True)
    return {row["source_id"]: row for row in responses}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--inventory", type=Path, default=INVENTORY)
    parser.add_argument("--directory", type=Path, default=DIRECTORY)
    parser.add_argument("--service-register", type=Path, default=SERVICES)
    parser.add_argument("--decisions", type=Path, default=DECISIONS)
    parser.add_argument("--baseline", type=Path)
    parser.add_argument(
        "--validate-inputs",
        action="store_true",
        help="validate source planning and review decisions without network requests",
    )
    parser.add_argument(
        "--validate-baseline",
        type=Path,
        help="validate a prior artifact and exit without network requests",
    )
    parser.add_argument(
        "--output-dir", type=Path, default=ROOT / "reports/automated/legislature-inventory"
    )
    parser.add_argument("--timeout", type=float, default=15)
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--max-bytes", type=int, default=2_097_152)
    parser.add_argument("--stale-days", type=int, default=365)
    parser.add_argument("--budget-seconds", type=float, default=2400)
    parser.add_argument(
        "--limit", type=int, default=0, help="limit sources for a labelled smoke run"
    )
    args = parser.parse_args()
    if (
        args.timeout <= 0
        or not 1 <= args.workers <= 12
        or args.max_bytes <= 0
        or args.stale_days <= 0
        or args.limit < 0
        or args.budget_seconds <= 0
    ):
        parser.error("timeout/size/stale-days must be positive, workers 1–12, limit nonnegative")
    try:
        if args.validate_baseline:
            validate_baseline(load_object(args.validate_baseline))
            return 0
        inventory = load_object(args.inventory)
        directory = load_object(args.directory)
        services = load_object(args.service_register)
        decisions = load_object(args.decisions)
        decision_ids(decisions)
        baseline = load_object(args.baseline) if args.baseline and args.baseline.exists() else None
        if baseline is not None:
            validate_baseline(baseline)
        today = datetime.now(UTC).date()
        sources = plan_sources(
            inventory,
            services,
            today.isoformat(),
            load_reviews(),
            load_object(ROOT / "data/channels.json"),
            directory,
        )
        if args.validate_inputs:
            print(f"Inventory monitor inputs valid: {len(sources)} deduplicated sources")
            return 0
        limited = bool(args.limit and args.limit < len(sources))
        if args.limit:
            sources = sources[: args.limit]
        previous = (baseline or {}).get("sources", {})
        responses = collect_sources(
            sources, previous, args.timeout, args.workers, args.max_bytes, args.budget_seconds
        )
        report, snapshot = build_report(
            inventory,
            directory,
            sources,
            responses,
            baseline,
            decisions,
            today,
            args.stale_days,
            limited,
        )
        args.output_dir.mkdir(parents=True, exist_ok=True)
        for name, value in (("report.json", report), ("snapshot.json", snapshot)):
            (args.output_dir / name).write_text(
                json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
        (args.output_dir / "report.md").write_text(render_markdown(report), encoding="utf-8")
        issue = render_markdown(report, maximum_findings=30)
        (args.output_dir / "issue.md").write_text(issue[:58000], encoding="utf-8")
        print(json.dumps(report["counts"], indent=2))
        return 0 if report["counts"]["observed"] else 1
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.error(str(error))
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
