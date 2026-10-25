"""Compare maintained discovery observations with the canonical catalogue."""

from __future__ import annotations

from collections.abc import Iterable
from datetime import UTC, datetime
from typing import Any, Literal, NotRequired, TypedDict, cast
from urllib.parse import urlsplit

from .models import Catalogue
from .page_discovery import PageLead, PageLeadKind, classify_page_links, safe_lead_url

ManifestKind = Literal["hls", "dash"]
ManifestObservation = tuple[str, str, ManifestKind, str, str]
DecisionDisposition = Literal[
    "event_specific",
    "insecure_legacy",
    "out_of_scope",
    "third_party",
    "not_legislative_content",
    "not_a_viewing_or_programme_source",
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
    kind: ManifestKind | PageLeadKind
    url: str
    evidence: str
    status: Literal["catalogued", "review", "reviewed"]
    disposition: DecisionDisposition | None
    source_page: NotRequired[str]
    label: NotRequired[str]
    observation: NotRequired[str]
    validation: NotRequired[str]
    institution_ids: NotRequired[list[str]]


class DiscoveryFindingsReport(TypedDict):
    checked_at: str
    counts: dict[str, int]
    findings: list[DiscoveryFinding]


def parse_discovery_decisions(document: dict[str, Any]) -> list[DiscoveryDecision]:
    """Validate maintained decisions for manifest observations or page leads."""
    if document.get("decision_version") != 1:
        raise ValueError("Discovery decisions must use decision_version 1")
    raw_decisions = document.get("decisions")
    if not isinstance(raw_decisions, list):
        raise ValueError("Discovery decisions must contain a decisions list")

    allowed = {
        "event_specific",
        "insecure_legacy",
        "out_of_scope",
        "third_party",
        "not_legislative_content",
        "not_a_viewing_or_programme_source",
    }
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
    try:
        path = urlsplit(url).path.lower()
    except ValueError:
        return False
    return not (
        "redacted" in lower
        or "\\u" in lower
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
        # EUDDN redirects stable router URLs to rotating edge hosts while retaining
        # the stream identity from the SMIL path onward.
        if "smil:" in candidate.path and "smil:" in known.path:
            candidate_stream = candidate.path.split("smil:", 1)[1]
            known_stream = known.path.split("smil:", 1)[1]
            candidate_parent = candidate_stream.rsplit("/", 1)[0]
            known_parent = known_stream.rsplit("/", 1)[0]
            if candidate_stream == known_stream or candidate_parent == known_parent:
                return True
        if candidate.netloc.lower() != known.netloc.lower():
            continue
        if candidate.path == known.path:
            return True
        known_directory = known.path.rsplit("/", 1)[0] + "/"
        if known_directory != "/" and candidate.path.startswith(known_directory):
            return True
    return False


def _static_manifests(report: dict[str, Any], evidence: str) -> Iterable[ManifestObservation]:
    tier = str(report.get("tier") or report.get("target_tier") or "unknown")
    for country in report.get("countries", []):
        country_name = country.get("country")
        if not isinstance(country_name, str):
            continue
        for result in country.get("results", []):
            url = result.get("url")
            if result.get("status") != "ok" or not isinstance(url, str):
                continue
            kind = result.get("kind")
            if kind not in {"hls", "dash"}:
                try:
                    kind = "dash" if urlsplit(url).path.lower().endswith(".mpd") else "hls"
                except ValueError:
                    continue
            yield country_name, tier, cast(ManifestKind, kind), url, evidence


def _browser_manifests(report: dict[str, Any], evidence: str) -> Iterable[ManifestObservation]:
    for country in report.get("countries", []):
        country_name = country.get("country")
        tier_report = str(country.get("tier_report", ""))
        tier = (
            "tier1"
            if "tier1" in tier_report
            else "tier2"
            if "tier2" in tier_report
            else "catalogue"
            if "catalogue" in tier_report
            else "unknown"
        )
        if not isinstance(country_name, str):
            continue
        for manifest in country.get("validated_manifests", []):
            url = manifest.get("url")
            kind = manifest.get("kind")
            if isinstance(url, str) and kind in {"hls", "dash"}:
                yield country_name, tier, cast(ManifestKind, kind), url, evidence


def _catalogue_page_urls(catalogue: Catalogue, *, viewing_only: bool = False) -> set[str]:
    urls: set[str] = set()
    for channel in catalogue["channels"]:
        values = [channel.get("official_url")]
        if not viewing_only:
            values.extend(row.get("url") for row in channel.get("epg_sources", []))
        for value in values:
            if isinstance(value, str) and (safe := safe_lead_url(value)):
                urls.add(safe)
        embed = channel.get("embed")
        if embed:
            for key in ("url", "live_url"):
                if isinstance(embed_value := embed.get(key), str) and (
                    safe := safe_lead_url(embed_value)
                ):
                    urls.add(safe)
    return urls


def _page_identity(url: str) -> str:
    parts = urlsplit(url)
    if parts.hostname in {"youtube.com", "www.youtube.com", "m.youtube.com"}:
        segments = parts.path.strip("/").split("/")
        if segments[0].startswith("@"):
            return "youtube:" + segments[0].casefold()
        if len(segments) >= 2 and segments[0] in {"channel", "user", "c"}:
            return "youtube:" + "/".join(segments[:2])
    return url.rstrip("/")


def _page_observations(
    static_reports: list[tuple[str, dict[str, Any]]],
    browser_reports: list[tuple[str, dict[str, Any]]],
) -> Iterable[tuple[str, str, str, PageLead]]:
    for evidence, report in static_reports:
        tier = str(report.get("tier") or "unknown")
        for country in report.get("countries", []):
            if not isinstance(country.get("country"), str):
                continue
            for result in country.get("results", []):
                if result.get("status") != "page_ok":
                    continue
                for lead in result.get("page_leads", []):
                    if isinstance(lead, dict):
                        yield country["country"], tier, evidence, cast(PageLead, lead)
    for evidence, report in browser_reports:
        for page in report.get("pages", []):
            if not isinstance(page.get("country"), str) or not isinstance(
                page.get("page_url"), str
            ):
                continue
            if page.get("load_note") or not 200 <= (page.get("page_status") or 0) < 400:
                continue
            tier_report = str(page.get("tier_report", ""))
            tier = (
                "tier1"
                if "tier1" in tier_report
                else "tier2"
                if "tier2" in tier_report
                else "catalogue"
            )
            leads, _ = classify_page_links(
                page["page_url"], page.get("page_links", []), base_url=page.get("final_url")
            )
            for lead in leads:
                yield page["country"], tier, evidence, lead


def build_discovery_findings(
    catalogue: Catalogue,
    static_reports: list[tuple[str, dict[str, Any]]],
    browser_reports: list[tuple[str, dict[str, Any]]],
    *,
    decisions: list[DiscoveryDecision] | None = None,
    page_decisions: list[DiscoveryDecision] | None = None,
    checked_at: str | None = None,
) -> DiscoveryFindingsReport:
    """Keep validated manifests separate from unverified viewing/programme leads."""
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
                "validation": (
                    "Manifest format checked; playback, provenance and rights still require review."
                ),
            }
        )

    manifest_count = len(findings)
    known_pages = {_page_identity(url) for url in _catalogue_page_urls(catalogue)}
    known_viewing_pages = {
        _page_identity(url) for url in _catalogue_page_urls(catalogue, viewing_only=True)
    }
    seen_pages: set[tuple[str, str, str, str]] = set()
    allowed_page_kinds = {
        "viewing_page",
        "video_archive",
        "youtube_channel",
        "recording",
        "programme_source",
    }
    for country, tier, evidence, lead in _page_observations(static_reports, browser_reports):
        page_url = safe_lead_url(lead.get("url", ""))
        source_page = safe_lead_url(lead.get("source_page", ""))
        if page_url is None or source_page is None or lead.get("kind") not in allowed_page_kinds:
            continue
        identity = _page_identity(page_url)
        key = (country, identity, lead["kind"], source_page)
        if key in seen_pages:
            continue
        seen_pages.add(key)
        decision = _decision_for_url(page_url, page_decisions or [])
        source_identity = _page_identity(source_page)
        source_parts, target_parts = urlsplit(source_page), urlsplit(page_url)
        covered_recording = (
            lead["kind"] == "recording"
            and source_identity in known_viewing_pages
            and source_parts.netloc == target_parts.netloc
            and source_parts.path.strip("/")
            and not source_parts.query
            and target_parts.path.startswith(source_parts.path.rstrip("/") + "/")
        )
        findings.append(
            {
                "country": country,
                "tier": tier,
                "kind": lead["kind"],
                "url": page_url,
                "evidence": evidence,
                "source_page": source_page,
                "label": lead.get("label", "")[:240],
                "observation": lead.get(
                    "observation", "Link observed on a maintained source page."
                ),
                "validation": (
                    "Unverified page lead; target content, official designation, "
                    "programme mapping and rights require human review."
                ),
                "status": "catalogued"
                if identity in known_pages or covered_recording
                else "reviewed"
                if decision
                else "review",
                "disposition": decision["disposition"] if decision else None,
            }
        )
    findings.sort(key=lambda item: (item["status"], item["tier"], item["country"], item["url"]))
    counts = {
        "validated": manifest_count,
        "page_leads": len(findings) - manifest_count,
        "total": len(findings),
        "catalogued": sum(item["status"] == "catalogued" for item in findings),
        "reviewed": sum(item["status"] == "reviewed" for item in findings),
        "review": sum(item["status"] == "review" for item in findings),
    }
    timestamp = datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")
    return {"checked_at": checked_at or timestamp, "counts": counts, "findings": findings}
