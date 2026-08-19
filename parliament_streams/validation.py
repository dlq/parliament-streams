"""JSON Schema and catalogue-specific validation."""

from __future__ import annotations

import json
from copy import deepcopy
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any, cast

from jsonschema import Draft202012Validator, FormatChecker

from .models import CandidateRecord, Catalogue, ChannelRecord, FallbackCatalogue
from .scrapers import SCRAPERS

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SCHEMA_PATH = ROOT / "schema" / "channels.schema.json"
DEFAULT_FALLBACKS_SCHEMA_PATH = ROOT / "schema" / "fallbacks.schema.json"


@dataclass(frozen=True)
class ValidationIssue:
    """One actionable validation problem."""

    path: str
    code: str
    message: str

    def render(self) -> str:
        return f"{self.path}: {self.message} [{self.code}]"


class CatalogueValidationError(ValueError):
    """Raised when a catalogue or candidate cannot be safely persisted."""

    def __init__(self, issues: list[ValidationIssue]) -> None:
        self.issues = issues
        super().__init__("\n".join(issue.render() for issue in issues))


def load_schema(path: Path = DEFAULT_SCHEMA_PATH) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return cast(dict[str, Any], value)


def load_fallbacks_schema(path: Path = DEFAULT_FALLBACKS_SCHEMA_PATH) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return cast(dict[str, Any], value)


def _json_path(parts: list[object]) -> str:
    path = "$"
    for part in parts:
        path += f"[{part}]" if isinstance(part, int) else f".{part}"
    return path


def _schema_issues(document: object, schema: dict[str, Any]) -> list[ValidationIssue]:
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    errors = sorted(
        validator.iter_errors(document), key=lambda error: _json_path(list(error.absolute_path))
    )
    return [
        ValidationIssue(_json_path(list(error.absolute_path)), "schema", error.message)
        for error in errors
    ]


def _channel_schema(schema: dict[str, Any]) -> dict[str, Any]:
    return {
        "$schema": schema["$schema"],
        "$defs": schema["$defs"],
        "$ref": "#/$defs/channel",
    }


def _channel_issues(
    channel: ChannelRecord, path: str, *, require_identity: bool
) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    channel_id = channel.get("id", "<missing>")
    source_type = channel.get("source_type")
    source_kind = channel.get("source_kind")
    playback_url = channel.get("playback_url")
    technical_status = channel.get("technical_status")
    stability_risk = channel.get("stability_risk")

    if source_type in {"direct_hls", "direct_dash"} and not playback_url:
        issues.append(
            ValidationIssue(
                f"{path}.playback_url", "direct-playback", "Direct sources need a playback URL"
            )
        )
    if source_type in {"official_page", "youtube"} and playback_url is not None:
        issues.append(
            ValidationIssue(
                f"{path}.playback_url",
                "platform-playback",
                "Page and YouTube sources must not store a playback URL",
            )
        )
    if source_type == "direct_hls" and source_kind not in {
        "first_party_hls",
        "official_vendor_hls",
        "third_party_relay_hls",
    }:
        issues.append(
            ValidationIssue(
                f"{path}.source_kind",
                "source-kind",
                "Direct HLS sources need an HLS source kind",
            )
        )
    if source_type == "direct_dash" and source_kind != "direct_dash_research":
        issues.append(
            ValidationIssue(
                f"{path}.source_kind",
                "source-kind",
                "Direct DASH sources must use direct_dash_research",
            )
        )
    if source_type == "youtube" and source_kind != "official_youtube_embed":
        issues.append(
            ValidationIssue(
                f"{path}.source_kind",
                "source-kind",
                "YouTube sources must use official_youtube_embed",
            )
        )
    if source_type == "official_page" and source_kind != "official_page":
        issues.append(
            ValidationIssue(
                f"{path}.source_kind",
                "source-kind",
                "Official-page sources must use official_page",
            )
        )
    if technical_status == "needs_review" and stability_risk == "low":
        issues.append(
            ValidationIssue(
                f"{path}.stability_risk",
                "stability-risk",
                "Sources needing review cannot be low stability risk",
            )
        )
    if source_type == "youtube" and "embed" not in channel:
        issues.append(ValidationIssue(path, "youtube-embed", "YouTube sources need embed metadata"))
    if source_type != "youtube" and "embed" in channel:
        issues.append(
            ValidationIssue(
                path, "unexpected-embed", "Only YouTube sources may contain embed metadata"
            )
        )

    raw_external_ids = channel.get("external_ids")
    external_ids = raw_external_ids if isinstance(raw_external_ids, dict) else {}
    qid = external_ids.get("wikidata_qid")
    raw_identity_sources = channel.get("identity_sources")
    identity_sources = raw_identity_sources if isinstance(raw_identity_sources, list) else []
    sources = {
        source.get("source"): source for source in identity_sources if isinstance(source, dict)
    }
    if require_identity and not qid:
        issues.append(
            ValidationIssue(
                f"{path}.external_ids.wikidata_qid",
                "wikidata-required",
                "Published entries need a Wikidata QID",
            )
        )
    if qid:
        wikidata = sources.get("wikidata")
        expected = f"https://www.wikidata.org/wiki/{qid}"
        if not wikidata or wikidata.get("url") != expected:
            issues.append(
                ValidationIssue(
                    f"{path}.identity_sources",
                    "wikidata-source",
                    f"{channel_id} must cite {expected}",
                )
            )

    ipu_country = external_ids.get("ipu_country_code")
    ipu_parliament = external_ids.get("ipu_parliament_code")
    ipu_chamber = external_ids.get("ipu_chamber_code")
    has_any_ipu = any((ipu_country, ipu_parliament, ipu_chamber))
    if channel.get("jurisdiction_level") != "national" and has_any_ipu:
        issues.append(
            ValidationIssue(
                f"{path}.external_ids",
                "ipu-scope",
                "IPU Parline identifiers apply only to national entries",
            )
        )
    if has_any_ipu:
        if not ipu_country or not ipu_parliament or ipu_country != ipu_parliament:
            issues.append(
                ValidationIssue(
                    f"{path}.external_ids",
                    "ipu-coherence",
                    "IPU country and parliament codes must both exist and match",
                )
            )
        ipu_source = sources.get("ipu_parline")
        if not ipu_source or f"/parliament/{ipu_country}/" not in str(ipu_source.get("url", "")):
            issues.append(
                ValidationIssue(
                    f"{path}.identity_sources",
                    "ipu-source",
                    "IPU identifiers need a matching Parline identity source",
                )
            )
    elif "ipu_parline" in sources:
        issues.append(
            ValidationIssue(
                f"{path}.identity_sources",
                "unexpected-ipu-source",
                "Parline identity source is present without IPU identifiers",
            )
        )

    permission = channel.get("permission", {})
    if isinstance(permission, dict) and not permission.get("evidence"):
        issues.append(
            ValidationIssue(
                f"{path}.permission.evidence",
                "rights-evidence",
                "At least one rights or source-condition URL is required",
            )
        )

    raw_epg_sources = channel.get("epg_sources")
    epg_sources = raw_epg_sources if isinstance(raw_epg_sources, list) else []
    for index, epg_source in enumerate(epg_sources):
        if not isinstance(epg_source, dict):
            continue
        scraper = epg_source.get("scraper")
        status = epg_source.get("scraper_status")
        epg_path = f"{path}.epg_sources[{index}]"
        if status == "implemented" and scraper not in SCRAPERS:
            issues.append(
                ValidationIssue(
                    f"{epg_path}.scraper",
                    "unknown-scraper",
                    f"Implemented scraper {scraper!r} is not registered",
                )
            )
        if status == "planned" and scraper != "planned":
            issues.append(
                ValidationIssue(
                    f"{epg_path}.scraper",
                    "planned-scraper",
                    "Planned sources must use scraper id 'planned'",
                )
            )
    return issues


def validate_channel(
    channel: ChannelRecord,
    schema: dict[str, Any] | None = None,
    *,
    require_identity: bool = True,
) -> list[ValidationIssue]:
    active_schema = schema or load_schema()
    channel_schema = _channel_schema(active_schema)
    if not require_identity:
        channel_schema = deepcopy(channel_schema)
        channel_schema["$defs"]["channel"]["properties"]["identity_sources"]["minItems"] = 0
    issues = _schema_issues(channel, channel_schema)
    issues.extend(_channel_issues(channel, "$", require_identity=require_identity))
    return issues


def validate_catalogue(
    catalogue: Catalogue | dict[str, Any], schema: dict[str, Any] | None = None
) -> list[ValidationIssue]:
    active_schema = schema or load_schema()
    issues = _schema_issues(catalogue, active_schema)
    channels = catalogue.get("channels") if isinstance(catalogue, dict) else None
    if not isinstance(channels, list):
        return issues

    seen_ids: dict[str, int] = {}
    seen_playback_urls: dict[str, str] = {}
    for index, raw_channel in enumerate(channels):
        if not isinstance(raw_channel, dict):
            continue
        channel = cast(ChannelRecord, raw_channel)
        path = f"$.channels[{index}]"
        issues.extend(_channel_issues(channel, path, require_identity=True))
        channel_id = channel.get("id")
        if isinstance(channel_id, str):
            if channel_id in seen_ids:
                issues.append(
                    ValidationIssue(
                        f"{path}.id",
                        "duplicate-id",
                        f"Duplicate id; first used at index {seen_ids[channel_id]}",
                    )
                )
            else:
                seen_ids[channel_id] = index
        playback_url = channel.get("playback_url")
        if isinstance(playback_url, str):
            prior = seen_playback_urls.get(playback_url)
            if prior:
                issues.append(
                    ValidationIssue(
                        f"{path}.playback_url",
                        "duplicate-playback",
                        f"Playback URL is already used by {prior}",
                    )
                )
            elif isinstance(channel_id, str):
                seen_playback_urls[playback_url] = channel_id
    return sorted(issues, key=lambda issue: (issue.path, issue.code, issue.message))


def validate_candidate(
    candidate: CandidateRecord | dict[str, Any], schema: dict[str, Any] | None = None
) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    required = {
        "candidate_version",
        "status",
        "created_on",
        "updated_on",
        "decision_notes",
        "channel",
    }
    if set(candidate) != required:
        missing = sorted(required - set(candidate))
        extra = sorted(set(candidate) - required)
        if missing:
            issues.append(
                ValidationIssue("$", "candidate-fields", f"Missing fields: {', '.join(missing)}")
            )
        if extra:
            issues.append(
                ValidationIssue("$", "candidate-fields", f"Unexpected fields: {', '.join(extra)}")
            )
    if candidate.get("candidate_version") != 1:
        issues.append(
            ValidationIssue(
                "$.candidate_version", "candidate-version", "Only candidate version 1 is supported"
            )
        )
    if candidate.get("status") not in {"researching", "ready", "rejected", "promoted"}:
        issues.append(
            ValidationIssue(
                "$.status",
                "candidate-status",
                "Status must be researching, ready, rejected, or promoted",
            )
        )
    parsed_dates: dict[str, date] = {}
    for field in ("created_on", "updated_on"):
        value = candidate.get(field)
        if not isinstance(value, str):
            issues.append(
                ValidationIssue(
                    f"$.{field}", "candidate-date", f"{field} must be an ISO 8601 calendar date"
                )
            )
            continue
        try:
            parsed_dates[field] = date.fromisoformat(value)
        except ValueError:
            issues.append(
                ValidationIssue(
                    f"$.{field}", "candidate-date", f"{field} must be an ISO 8601 calendar date"
                )
            )
    if (
        "created_on" in parsed_dates
        and "updated_on" in parsed_dates
        and parsed_dates["updated_on"] < parsed_dates["created_on"]
    ):
        issues.append(
            ValidationIssue(
                "$.updated_on",
                "candidate-date-order",
                "updated_on cannot be earlier than created_on",
            )
        )
    notes = candidate.get("decision_notes")
    if (
        not isinstance(notes, list)
        or not notes
        or any(not isinstance(note, str) or not note.strip() for note in notes)
    ):
        issues.append(
            ValidationIssue(
                "$.decision_notes", "candidate-notes", "Decision notes must be non-empty strings"
            )
        )
    channel = candidate.get("channel")
    if isinstance(channel, dict):
        require_identity = candidate.get("status") in {"ready", "promoted"}
        for issue in validate_channel(
            cast(ChannelRecord, channel), schema, require_identity=require_identity
        ):
            issues.append(ValidationIssue(f"$.channel{issue.path[1:]}", issue.code, issue.message))
    else:
        issues.append(
            ValidationIssue("$.channel", "candidate-channel", "Candidate needs a channel object")
        )
    return sorted(issues, key=lambda issue: (issue.path, issue.code, issue.message))


def validate_fallbacks(
    fallbacks: FallbackCatalogue | dict[str, Any],
    catalogue: Catalogue | dict[str, Any],
    schema: dict[str, Any] | None = None,
) -> list[ValidationIssue]:
    active_schema = schema or load_fallbacks_schema()
    issues = _schema_issues(fallbacks, active_schema)
    known_channel_ids = {
        channel.get("id")
        for channel in catalogue.get("channels", [])
        if isinstance(channel, dict) and isinstance(channel.get("id"), str)
    }
    seen_ids: dict[str, int] = {}
    raw_fallbacks = fallbacks.get("fallbacks")
    if not isinstance(raw_fallbacks, list):
        return sorted(issues, key=lambda issue: (issue.path, issue.code, issue.message))
    for index, item in enumerate(raw_fallbacks):
        if not isinstance(item, dict):
            continue
        path = f"$.fallbacks[{index}]"
        fallback_id = item.get("id")
        if isinstance(fallback_id, str):
            if fallback_id in seen_ids:
                issues.append(
                    ValidationIssue(
                        f"{path}.id",
                        "duplicate-id",
                        f"Duplicate id; first used at index {seen_ids[fallback_id]}",
                    )
                )
            else:
                seen_ids[fallback_id] = index
        for related_index, channel_id in enumerate(item.get("related_channel_ids", [])):
            if channel_id not in known_channel_ids:
                issues.append(
                    ValidationIssue(
                        f"{path}.related_channel_ids[{related_index}]",
                        "unknown-channel",
                        f"Unknown related channel id: {channel_id}",
                    )
                )
        if (
            item.get("integration_mode") == "provider_embed"
            and item.get("playback_claim") != "provider_managed_embed"
        ):
            issues.append(
                ValidationIssue(
                    f"{path}.playback_claim",
                    "fallback-playback-claim",
                    "Provider embeds must use provider_managed_embed playback claim",
                )
            )
        if (
            item.get("integration_mode") == "link_out"
            and item.get("playback_claim") == "provider_managed_embed"
        ):
            issues.append(
                ValidationIssue(
                    f"{path}.playback_claim",
                    "fallback-playback-claim",
                    "Link-out fallbacks cannot claim provider-managed embed playback",
                )
            )
    return sorted(issues, key=lambda issue: (issue.path, issue.code, issue.message))


def require_valid_catalogue(catalogue: Catalogue | dict[str, Any]) -> None:
    issues = validate_catalogue(catalogue)
    if issues:
        raise CatalogueValidationError(issues)


def require_valid_candidate(candidate: CandidateRecord | dict[str, Any]) -> None:
    issues = validate_candidate(candidate)
    if issues:
        raise CatalogueValidationError(issues)


def require_valid_fallbacks(
    fallbacks: FallbackCatalogue | dict[str, Any], catalogue: Catalogue | dict[str, Any]
) -> None:
    issues = validate_fallbacks(fallbacks, catalogue)
    if issues:
        raise CatalogueValidationError(issues)
