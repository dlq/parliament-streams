"""Compare democracy-tier discovery results with the canonical catalogue."""

from __future__ import annotations

from collections.abc import Iterable
from datetime import UTC, datetime
from typing import Any, Literal, NotRequired, TypedDict, cast
from urllib.parse import urlsplit

from .models import Catalogue

ManifestKind = Literal["hls", "dash"]
ManifestCandidate = tuple[str, str, ManifestKind, str, str]
DecisionDisposition = Literal[
    "event_specific",
    "insecure_legacy",
    "out_of_scope",
    "third_party",
]


class DiscoveryDecision(TypedDict):
    country: str
    url: NotRequired[str]
    url_prefix: NotRequired[str]
    disposition: DecisionDisposition
    reviewed_on: str
    reason: str
    evidence: list[str]


class DiscoveryFinding(TypedDict):
    country: str
    tier: str
    kind: ManifestKind
    url: str
    evidence: str
    status: Literal["catalogued", "review", "reviewed"]
    disposition: DecisionDisposition | None


class DiscoveryFindingsReport(TypedDict):
    checked_at: str
    counts: dict[str, int]
    findings: list[DiscoveryFinding]


def parse_discovery_decisions(document: dict[str, Any]) -> list[DiscoveryDecision]:
    """Validate and return the maintained manifest-review decisions."""
    if document.get("decision_version") != 1:
        raise ValueError("Discovery decisions must use decision_version 1")
    raw_decisions = document.get("decisions")
    if not isinstance(raw_decisions, list):
        raise ValueError("Discovery decisions must contain a decisions list")

    allowed = {"event_specific", "insecure_legacy", "out_of_scope", "third_party"}
    decisions: list[DiscoveryDecision] = []
    seen: set[str] = set()
    for index, raw in enumerate(raw_decisions):
        if not isinstance(raw, dict):
            raise ValueError(f"Discovery decision {index} must be an object")
        required_strings = ("country", "disposition", "reviewed_on", "reason")
        if any(not isinstance(raw.get(field), str) or not raw[field] for field in required_strings):
            raise ValueError(f"Discovery decision {index} has missing string fields")
        if raw["disposition"] not in allowed:
            raise ValueError(f"Discovery decision {index} has an unknown disposition")
        match_values = [raw.get("url"), raw.get("url_prefix")]
        if sum(isinstance(value, str) and bool(value) for value in match_values) != 1:
            raise ValueError(f"Discovery decision {index} needs exactly one URL or URL prefix")
        evidence = raw.get("evidence")
        if (
            not isinstance(evidence, list)
            or not evidence
            or not all(isinstance(url, str) and url for url in evidence)
        ):
            raise ValueError(f"Discovery decision {index} needs evidence URLs")
        match = cast(str, raw.get("url") or raw.get("url_prefix"))
        if match in seen:
            raise ValueError(f"Discovery decisions repeat URL match: {match}")
        seen.add(match)
        decisions.append(cast(DiscoveryDecision, raw))
    return decisions


def _catalogue_playback_urls(catalogue: Catalogue) -> set[str]:
    urls: set[str] = set()
    for channel in catalogue["channels"]:
        playback_url = channel.get("playback_url")
        if playback_url:
            urls.add(playback_url)
        embed = channel.get("embed")
        if embed and embed.get("url"):
            urls.add(embed["url"])
    return urls


def _decision_for_url(url: str, decisions: list[DiscoveryDecision]) -> DiscoveryDecision | None:
    for decision in decisions:
        if decision.get("url") == url:
            return decision
        prefix = decision.get("url_prefix")
        if prefix and url.startswith(prefix):
            return decision
    return None


def _is_plausible_live_manifest(url: str) -> bool:
    lower = url.lower()
    path = urlsplit(url).path.lower()
    return not (
        "\\u" in lower
        or "&amp;" in lower
        or lower.endswith(('"', "'"))
        or "/vod" in path
        or "_vod" in path
        or "vod_" in path
    )


def _matches_catalogued_family(url: str, known_urls: set[str]) -> bool:
    candidate = urlsplit(url)
    for known_url in known_urls:
        known = urlsplit(known_url)
        if candidate.netloc.lower() != known.netloc.lower():
            continue
        if candidate.path == known.path:
            return True
        known_directory = known.path.rsplit("/", 1)[0] + "/"
        if known_directory != "/" and candidate.path.startswith(known_directory):
            return True
    return False


def _static_manifests(report: dict[str, Any], evidence: str) -> Iterable[ManifestCandidate]:
    tier = str(report.get("tier") or report.get("target_tier") or "unknown")
    for country in report.get("countries", []):
        country_name = country.get("country")
        if not isinstance(country_name, str):
            continue
        for result in country.get("results", []):
            url = result.get("url")
            if result.get("status") != "ok" or not isinstance(url, str):
                continue
            kind: ManifestKind = "dash" if ".mpd" in url.lower() else "hls"
            yield country_name, tier, kind, url, evidence


def _browser_manifests(report: dict[str, Any], evidence: str) -> Iterable[ManifestCandidate]:
    for country in report.get("countries", []):
        country_name = country.get("country")
        tier_report = str(country.get("tier_report", ""))
        tier = (
            "tier1" if "tier1" in tier_report else "tier2" if "tier2" in tier_report else "unknown"
        )
        if not isinstance(country_name, str):
            continue
        for manifest in country.get("validated_manifests", []):
            url = manifest.get("url")
            kind = manifest.get("kind")
            if isinstance(url, str) and kind in {"hls", "dash"}:
                yield country_name, tier, cast(ManifestKind, kind), url, evidence


def build_discovery_findings(
    catalogue: Catalogue,
    static_reports: list[tuple[str, dict[str, Any]]],
    browser_reports: list[tuple[str, dict[str, Any]]],
    *,
    decisions: list[DiscoveryDecision] | None = None,
    checked_at: str | None = None,
) -> DiscoveryFindingsReport:
    """Return deduplicated validated manifests and whether each needs review."""
    known_urls = _catalogue_playback_urls(catalogue)
    reviewed_decisions = decisions or []
    candidates = [
        item for evidence, report in static_reports for item in _static_manifests(report, evidence)
    ]
    candidates.extend(
        item
        for evidence, report in browser_reports
        for item in _browser_manifests(report, evidence)
    )

    findings: list[DiscoveryFinding] = []
    seen: set[str] = set()
    for country, tier, kind, url, evidence in candidates:
        if url in seen or not _is_plausible_live_manifest(url):
            continue
        seen.add(url)
        decision = _decision_for_url(url, reviewed_decisions)
        findings.append(
            {
                "country": country,
                "tier": tier,
                "kind": kind,
                "url": url,
                "evidence": evidence,
                "status": (
                    "catalogued"
                    if _matches_catalogued_family(url, known_urls)
                    else "reviewed"
                    if decision
                    else "review"
                ),
                "disposition": decision["disposition"] if decision else None,
            }
        )

    findings.sort(key=lambda item: (item["status"], item["tier"], item["country"], item["url"]))
    counts = {
        "validated": len(findings),
        "catalogued": sum(item["status"] == "catalogued" for item in findings),
        "reviewed": sum(item["status"] == "reviewed" for item in findings),
        "review": sum(item["status"] == "review" for item in findings),
    }
    timestamp = datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")
    return {"checked_at": checked_at or timestamp, "counts": counts, "findings": findings}
