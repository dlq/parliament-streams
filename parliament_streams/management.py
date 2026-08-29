"""Typed catalogue-management operations used by the CLI."""

from __future__ import annotations

import csv
import hashlib
import json
import os
import tempfile
from copy import deepcopy
from dataclasses import dataclass
from datetime import UTC, date, datetime
from pathlib import Path
from typing import Any, Literal, TextIO, cast

from .catalogue import (
    DEFAULT_CATALOGUE_PATH,
    DEFAULT_FALLBACKS_PATH,
    load_catalogue,
    load_fallbacks,
    load_json_object,
)
from .models import (
    CandidateRecord,
    Catalogue,
    ChannelRecord,
    HealthChange,
    HealthDiff,
    IdentityAudit,
    IdentityAuditItem,
    IdentitySource,
    JurisdictionLevel,
    PlaybackPolicy,
    SeedGroup,
    SeedResult,
    SourceKind,
    SourceType,
    StabilityRisk,
    ValidationHistoryEntry,
    ValidationSeed,
)
from .site_data import (
    DEFAULT_SITE_DATA_PATH,
    load_optional_schedules,
    load_supranational,
    render_site_data_payload,
)
from .validation import (
    CatalogueValidationError,
    ValidationIssue,
    require_valid_candidate,
    require_valid_catalogue,
    validate_candidate,
    validate_channel,
)


def utc_timestamp() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")


def _atomic_write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    mode = path.stat().st_mode & 0o777 if path.exists() else 0o644
    descriptor, temporary_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    temporary_path = Path(temporary_name)
    try:
        os.fchmod(descriptor, mode)
        with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
            handle.write(content)
            handle.flush()
            os.fsync(handle.fileno())
        temporary_path.replace(path)
    except BaseException:
        temporary_path.unlink(missing_ok=True)
        raise


def write_json(path: Path, value: object) -> None:
    _atomic_write_text(path, f"{json.dumps(value, ensure_ascii=False, indent=2)}\n")


def _validation_report_method(
    path: Path,
) -> Literal["static_http", "browser_player", "manifest_seed", "review_followup"]:
    name = path.name
    if "deep-browser" in name:
        return "browser_player"
    if "review-followup" in name:
        return "review_followup"
    if "seed" in name or "democracy-hls" in name:
        return "manifest_seed"
    return "static_http"


def refresh_validation_history(
    catalogue: Catalogue,
    reports_dir: Path,
    *,
    root: Path = DEFAULT_CATALOGUE_PATH.parents[1],
    limit: int = 3,
) -> Catalogue:
    """Attach compact validation-report references to catalogue entries."""
    prepared = deepcopy(catalogue)
    history_by_id: dict[str, list[ValidationHistoryEntry]] = {
        channel["id"]: [] for channel in prepared["channels"]
    }
    known_ids = set(history_by_id)

    for path in sorted(reports_dir.glob("*.json")):
        report = load_json_object(path)
        method = _validation_report_method(path)
        report_path = path.resolve().relative_to(root.resolve()).as_posix()
        for result in report.get("results", []):
            if not isinstance(result, dict):
                continue
            channel_id = result.get("id")
            checked_at = result.get("checked_at") or report.get("checked_at")
            status = result.get("status")
            if (
                channel_id not in known_ids
                or not isinstance(checked_at, str)
                or status not in {"ok", "warning", "error", "skipped"}
            ):
                continue
            history_entry: ValidationHistoryEntry = {
                "checked_at": checked_at,
                "report_path": report_path,
                "method": method,
                "status": cast(Literal["ok", "warning", "error", "skipped"], status),
                "note": str(result.get("note") or report.get("scope") or "Validation recorded."),
            }
            history_by_id[channel_id].append(history_entry)

    for channel in prepared["channels"]:
        channel_history = sorted(
            history_by_id[channel["id"]],
            key=lambda item: (item["checked_at"], item["report_path"]),
            reverse=True,
        )[:limit]
        if channel_history:
            channel["validation_history"] = channel_history
        else:
            channel.pop("validation_history", None)
    require_valid_catalogue(prepared)
    return prepared


def validation_history_is_current(
    catalogue: Catalogue,
    reports_dir: Path,
    *,
    root: Path = DEFAULT_CATALOGUE_PATH.parents[1],
    limit: int = 3,
) -> bool:
    """Return whether catalogue validation-history fields match retained reports."""
    refreshed = refresh_validation_history(catalogue, reports_dir, root=root, limit=limit)
    for current, expected in zip(catalogue["channels"], refreshed["channels"], strict=True):
        if current.get("validation_history") != expected.get("validation_history"):
            return False
    return True


@dataclass(frozen=True)
class CatalogueStore:
    """Load, validate, and atomically persist a catalogue and site snapshot."""

    catalogue_path: Path = DEFAULT_CATALOGUE_PATH
    fallbacks_path: Path = DEFAULT_FALLBACKS_PATH
    site_data_path: Path | None = DEFAULT_SITE_DATA_PATH

    def load(self) -> Catalogue:
        catalogue = load_catalogue(self.catalogue_path)
        require_valid_catalogue(catalogue)
        return catalogue

    def commit(self, catalogue: Catalogue, *, generated_on: date | None = None) -> Catalogue:
        prepared = deepcopy(catalogue)
        prepared["generated_on"] = (generated_on or date.today()).isoformat()
        require_valid_catalogue(prepared)
        site_data = (
            render_site_data_payload(
                prepared,
                load_fallbacks(self.fallbacks_path),
                load_supranational(),
                load_optional_schedules(),
            )
            if self.site_data_path
            else None
        )
        write_json(self.catalogue_path, prepared)
        if self.site_data_path and site_data is not None:
            _atomic_write_text(self.site_data_path, site_data)
        return prepared

    def add(
        self, channel: ChannelRecord, *, replace: bool = False, persist: bool = True
    ) -> Catalogue:
        catalogue = self.load()
        channels = catalogue["channels"]
        existing = next(
            (index for index, item in enumerate(channels) if item["id"] == channel.get("id")), None
        )
        if existing is not None and not replace:
            raise ValueError(f"Catalogue id already exists: {channel.get('id')}")
        if existing is None:
            channels.append(deepcopy(channel))
        else:
            channels[existing] = deepcopy(channel)
        if persist:
            return self.commit(catalogue)
        catalogue["generated_on"] = date.today().isoformat()
        require_valid_catalogue(catalogue)
        return catalogue

    def update(self, channel_id: str, channel: ChannelRecord, *, persist: bool = True) -> Catalogue:
        if channel.get("id") != channel_id:
            raise ValueError(f"Record id {channel.get('id')!r} does not match {channel_id!r}")
        catalogue = self.load()
        for index, existing in enumerate(catalogue["channels"]):
            if existing["id"] == channel_id:
                catalogue["channels"][index] = deepcopy(channel)
                if persist:
                    return self.commit(catalogue)
                catalogue["generated_on"] = date.today().isoformat()
                require_valid_catalogue(catalogue)
                return catalogue
        raise KeyError(f"Unknown catalogue id: {channel_id}")

    def remove(self, channel_id: str, *, persist: bool = True) -> Catalogue:
        catalogue = self.load()
        retained = [channel for channel in catalogue["channels"] if channel["id"] != channel_id]
        if len(retained) == len(catalogue["channels"]):
            raise KeyError(f"Unknown catalogue id: {channel_id}")
        catalogue["channels"] = retained
        if persist:
            return self.commit(catalogue)
        catalogue["generated_on"] = date.today().isoformat()
        require_valid_catalogue(catalogue)
        return catalogue


def scaffold_candidate(
    *,
    channel_id: str,
    name: str,
    jurisdiction_level: JurisdictionLevel,
    country_or_region: str,
    legislature: str,
    language: str,
    official_url: str,
    source_type: SourceType = "official_page",
    playback_url: str | None = None,
    youtube_playlist_id: str | None = None,
    wikidata_qid: str | None = None,
    today: date | None = None,
) -> CandidateRecord:
    current_date = (today or date.today()).isoformat()
    if source_type in {"direct_hls", "direct_dash"} and not playback_url:
        raise ValueError("Direct source candidates require --playback-url")
    if source_type in {"official_page", "youtube"} and playback_url:
        raise ValueError("Official-page and YouTube candidates cannot use --playback-url")
    if source_type == "youtube" and not youtube_playlist_id:
        raise ValueError("YouTube candidates require --youtube-playlist-id")
    if source_type != "youtube" and youtube_playlist_id:
        raise ValueError("--youtube-playlist-id is only valid for YouTube candidates")

    identity_sources: list[IdentitySource] = []
    if wikidata_qid:
        identity_sources.append(
            {
                "source": "wikidata",
                "url": f"https://www.wikidata.org/wiki/{wikidata_qid}",
                "checked_on": current_date,
                "confidence": "medium",
                "notes": "Candidate identity match; verify before promotion.",
            }
        )
    channel: ChannelRecord = {
        "id": channel_id,
        "name": name,
        "jurisdiction_level": jurisdiction_level,
        "country_or_region": country_or_region,
        "legislature": legislature,
        "external_ids": {
            "wikidata_qid": wikidata_qid,
            "ipu_country_code": None,
            "ipu_parliament_code": None,
            "ipu_chamber_code": None,
        },
        "identity_sources": identity_sources,
        "language": language,
        "source_type": source_type,
        "source_kind": source_kind_for_candidate(source_type),
        "playback_url": playback_url,
        "playback_policy": playback_policy_for_candidate(source_type),
        "official_url": official_url,
        "provenance_note": "Source provenance review pending.",
        "technical_status": "link_only" if source_type == "official_page" else "needs_review",
        "stability_risk": stability_risk_for_candidate(source_type),
        "availability": "event_based",
        "accessibility": {
            "captions": "unknown",
            "caption_languages": [],
            "sign_language": "unknown",
            "audio_description": "unknown",
            "notes": None,
        },
        "epg_sources": [],
        "permission": {
            "status": "personal_use_pending_review",
            "summary": "Rights and third-party playback terms have not yet been reviewed.",
            "evidence": [official_url],
            "recommendation": "Keep link-out only until source conditions are reviewed.",
        },
    }
    if youtube_playlist_id:
        channel["embed"] = {
            "provider": "youtube",
            "kind": "uploads_playlist",
            "content_id": youtube_playlist_id,
            "url": (
                "https://www.youtube-nocookie.com/embed?listType=playlist&list="
                f"{youtube_playlist_id}"
            ),
            "live_url": official_url,
            "notes": (
                "Permanent official uploads playlist; verify the channel identity and current "
                "live-event behavior before promotion."
            ),
        }
    return {
        "candidate_version": 1,
        "status": "researching",
        "created_on": current_date,
        "updated_on": current_date,
        "decision_notes": ["Candidate scaffold created; evidence review pending."],
        "channel": channel,
    }


def load_candidate(path: Path) -> CandidateRecord:
    return cast(CandidateRecord, load_json_object(path))


def validate_candidate_directory(directory: Path) -> dict[Path, list[ValidationIssue]]:
    """Validate every tracked candidate without stopping at the first bad file."""
    if not directory.is_dir():
        raise ValueError(f"Candidate directory does not exist: {directory}")
    results: dict[Path, list[ValidationIssue]] = {}
    for path in sorted(directory.rglob("*.json")):
        try:
            results[path] = validate_candidate(load_candidate(path))
        except (OSError, ValueError) as error:
            results[path] = [ValidationIssue("$", "candidate-json", str(error))]
    return results


def promote_candidate(candidate: CandidateRecord, store: CatalogueStore) -> Catalogue:
    require_valid_candidate(candidate)
    if candidate["status"] != "ready":
        raise ValueError("Only candidates with status 'ready' can be promoted")
    return store.add(candidate["channel"])


def generate_validation_seed(
    catalogue: Catalogue,
    *,
    channel_ids: set[str] | None = None,
    jurisdiction_level: str | None = None,
    checked_at: str | None = None,
) -> ValidationSeed:
    known_ids = {channel["id"] for channel in catalogue["channels"]}
    if channel_ids:
        unknown = sorted(channel_ids - known_ids)
        if unknown:
            raise ValueError(f"Unknown catalogue ids: {', '.join(unknown)}")

    grouped: dict[str, list[SeedResult]] = {}
    seen: set[tuple[str, str, str]] = set()
    for channel in catalogue["channels"]:
        if channel_ids and channel["id"] not in channel_ids:
            continue
        if jurisdiction_level and channel["jurisdiction_level"] != jurisdiction_level:
            continue
        candidates: list[tuple[str, str]] = [("official_page", channel["official_url"])]
        if channel["playback_url"]:
            kind = "dash" if channel["source_type"] == "direct_dash" else "hls"
            candidates.insert(0, (kind, channel["playback_url"]))
        group = grouped.setdefault(channel["country_or_region"], [])
        for kind, url in candidates:
            key = (channel["id"], kind, url)
            if key not in seen:
                seen.add(key)
                group.append({"kind": kind, "url": url, "channel_id": channel["id"]})

    countries: list[SeedGroup] = [
        {"country": country, "results": grouped[country]} for country in sorted(grouped)
    ]
    return {
        "checked_at": checked_at or utc_timestamp(),
        "scope": "Catalogue-generated static and browser validation seed",
        "method": (
            "Generated from canonical playback and official URLs; no network requests performed."
        ),
        "countries": countries,
    }


IDENTITY_CODES = {
    "wikidata-required",
    "wikidata-source",
    "ipu-scope",
    "ipu-coherence",
    "ipu-source",
    "unexpected-ipu-source",
}


def audit_identities(catalogue: Catalogue, *, checked_at: str | None = None) -> IdentityAudit:
    results: list[IdentityAuditItem] = []
    counts = {"ok": 0, "error": 0}
    for channel in catalogue["channels"]:
        messages = [
            issue.render() for issue in validate_channel(channel) if issue.code in IDENTITY_CODES
        ]
        status: Literal["ok", "error"] = "error" if messages else "ok"
        counts[status] += 1
        results.append({"id": channel["id"], "status": status, "issues": messages})
    return {
        "checked_at": checked_at or utc_timestamp(),
        "total": len(results),
        "counts": counts,
        "results": results,
    }


STATUS_RANK: dict[str, int] = {"ok": 0, "skipped": 1, "warning": 1, "error": 2}


def _health_results(report: dict[str, Any], label: str) -> dict[str, dict[str, Any]]:
    raw_results = report.get("results")
    if not isinstance(raw_results, list):
        raise ValueError(f"{label} health report needs a results array")
    results: dict[str, dict[str, Any]] = {}
    for index, item in enumerate(raw_results):
        if not isinstance(item, dict):
            raise ValueError(f"{label} health result {index} must be an object")
        channel_id = item.get("id")
        status = item.get("status")
        if not isinstance(channel_id, str) or not channel_id:
            raise ValueError(f"{label} health result {index} needs a non-empty id")
        if not isinstance(status, str) or not status:
            raise ValueError(f"{label} health result {channel_id} needs a non-empty status")
        if status not in STATUS_RANK:
            raise ValueError(f"{label} health result {channel_id} has unknown status: {status}")
        if channel_id in results:
            raise ValueError(f"{label} health report repeats id: {channel_id}")
        results[channel_id] = item
    return results


def compare_health_reports(before: dict[str, Any], after: dict[str, Any]) -> HealthDiff:
    before_results = _health_results(before, "Before")
    after_results = _health_results(after, "After")
    before_ids = set(before_results)
    after_ids = set(after_results)

    def change(channel_id: str) -> HealthChange:
        before_item = before_results.get(channel_id, {})
        after_item = after_results.get(channel_id, {})
        metadata = after_item or before_item
        return {
            "id": channel_id,
            "before": before_item.get("status"),
            "after": after_item.get("status"),
            "source_type": metadata.get("source_type"),
            "source_kind": metadata.get("source_kind"),
            "availability": metadata.get("availability"),
            "stability_risk": metadata.get("stability_risk"),
        }

    changed = [
        change(channel_id)
        for channel_id in sorted(before_ids & after_ids)
        if before_results[channel_id]["status"] != after_results[channel_id]["status"]
    ]
    return {
        "before_checked_at": before.get("checked_at"),
        "after_checked_at": after.get("checked_at"),
        "added": [change(channel_id) for channel_id in sorted(after_ids - before_ids)],
        "removed": [change(channel_id) for channel_id in sorted(before_ids - after_ids)],
        "changed": changed,
        "regressions": [
            item
            for item in changed
            if STATUS_RANK.get(item["after"] or "", 1) > STATUS_RANK.get(item["before"] or "", 1)
        ],
        "recoveries": [
            item
            for item in changed
            if STATUS_RANK.get(item["after"] or "", 1) < STATUS_RANK.get(item["before"] or "", 1)
        ],
    }


CSV_FIELDS = [
    "id",
    "name",
    "jurisdiction_level",
    "country_or_region",
    "legislature",
    "language",
    "source_type",
    "source_kind",
    "playback_url",
    "playback_policy",
    "official_url",
    "technical_status",
    "stability_risk",
    "availability",
    "permission_status",
    "wikidata_qid",
    "ipu_parliament_code",
    "epg_urls",
]


def source_kind_for_candidate(source_type: SourceType) -> SourceKind:
    if source_type == "direct_hls":
        return "official_vendor_hls"
    if source_type == "direct_dash":
        return "direct_dash_research"
    if source_type == "youtube":
        return "official_youtube_embed"
    return "official_page"


def stability_risk_for_candidate(source_type: SourceType) -> StabilityRisk:
    if source_type == "official_page":
        return "unknown"
    if source_type == "youtube":
        return "medium"
    return "high"


def playback_policy_for_candidate(source_type: SourceType) -> PlaybackPolicy:
    if source_type == "youtube":
        return "provider_embed"
    if source_type == "official_page":
        return "link_out"
    if source_type == "direct_dash":
        return "research_only"
    return "research_only"


def export_csv(catalogue: Catalogue, output: TextIO) -> None:
    writer = csv.DictWriter(output, fieldnames=CSV_FIELDS)
    writer.writeheader()
    for channel in catalogue["channels"]:
        writer.writerow(
            {
                **{field: channel.get(field) for field in CSV_FIELDS},
                "permission_status": channel["permission"]["status"],
                "wikidata_qid": channel["external_ids"]["wikidata_qid"],
                "ipu_parliament_code": channel["external_ids"]["ipu_parliament_code"],
                "epg_urls": " | ".join(source["url"] for source in channel["epg_sources"]),
            }
        )


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(64 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


__all__ = [
    "CatalogueStore",
    "CatalogueValidationError",
    "ValidationIssue",
    "audit_identities",
    "compare_health_reports",
    "export_csv",
    "file_sha256",
    "generate_validation_seed",
    "load_candidate",
    "promote_candidate",
    "scaffold_candidate",
    "validate_candidate_directory",
    "write_json",
]
