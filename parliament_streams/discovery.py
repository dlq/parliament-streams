"""Compare democracy-tier discovery results with the canonical catalogue."""

from __future__ import annotations

from collections.abc import Iterable
from datetime import UTC, datetime
from typing import Any, Literal, TypedDict, cast

from .models import Catalogue

ManifestKind = Literal["hls", "dash"]
ManifestCandidate = tuple[str, str, ManifestKind, str, str]


class DiscoveryFinding(TypedDict):
    country: str
    tier: str
    kind: ManifestKind
    url: str
    evidence: str
    status: Literal["catalogued", "review"]


class DiscoveryFindingsReport(TypedDict):
    checked_at: str
    counts: dict[str, int]
    findings: list[DiscoveryFinding]


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
    checked_at: str | None = None,
) -> DiscoveryFindingsReport:
    """Return deduplicated validated manifests and whether each needs review."""
    known_urls = _catalogue_playback_urls(catalogue)
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
        if url in seen:
            continue
        seen.add(url)
        findings.append(
            {
                "country": country,
                "tier": tier,
                "kind": kind,
                "url": url,
                "evidence": evidence,
                "status": "catalogued" if url in known_urls else "review",
            }
        )

    findings.sort(key=lambda item: (item["status"], item["tier"], item["country"], item["url"]))
    counts = {
        "validated": len(findings),
        "catalogued": sum(item["status"] == "catalogued" for item in findings),
        "review": sum(item["status"] == "review" for item in findings),
    }
    timestamp = datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")
    return {"checked_at": checked_at or timestamp, "counts": counts, "findings": findings}
