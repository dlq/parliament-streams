"""Typed data contracts used by catalogue-management code."""

from __future__ import annotations

from typing import Literal, NotRequired, TypedDict

Confidence = Literal["low", "medium", "high"]
JurisdictionLevel = Literal["national", "subnational", "supranational"]
SourceType = Literal["direct_hls", "direct_dash", "official_page", "youtube"]
SourceKind = Literal[
    "first_party_hls",
    "official_vendor_hls",
    "third_party_relay_hls",
    "direct_dash_research",
    "official_youtube_embed",
    "official_page",
]
TechnicalStatus = Literal["validated", "needs_review", "link_only"]
StabilityRisk = Literal["low", "medium", "high", "unknown"]
CandidateStatus = Literal["researching", "ready", "rejected", "promoted"]
Availability = Literal["always_on", "sitting_only", "event_based"]
AccessibilityStatus = Literal["available", "source_dependent", "unavailable", "unknown"]
PermissionStatus = Literal[
    "personal_use_pending_review",
    "noncommercial_pending_review",
    "explicit_reuse_with_conditions",
    "embed_only",
    "no_third_party_reuse",
]
FallbackType = Literal[
    "official_event_platform",
    "official_live_page",
    "official_youtube_live",
    "official_youtube_uploads",
    "official_archive",
    "official_broadcaster",
]
FallbackIntegrationMode = Literal["link_out", "provider_embed", "planned_event_resolver"]
FallbackPlaybackClaim = Literal[
    "no_direct_stream_claim",
    "provider_managed_embed",
    "unsupported_native_playback",
    "event_specific_research",
]
FallbackScheduleRole = Literal["schedule_source", "now_next_possible", "none"]


class ExternalIds(TypedDict):
    wikidata_qid: str | None
    ipu_country_code: str | None
    ipu_parliament_code: str | None
    ipu_chamber_code: str | None


class IdentitySource(TypedDict):
    source: Literal["wikidata", "ipu_parline"]
    url: str
    checked_on: str
    confidence: Confidence
    notes: str


class Embed(TypedDict):
    provider: Literal["youtube"]
    kind: Literal["uploads_playlist"]
    content_id: str
    url: str
    live_url: str
    notes: str


class Accessibility(TypedDict):
    captions: AccessibilityStatus
    caption_languages: list[str]
    sign_language: AccessibilityStatus
    audio_description: AccessibilityStatus
    notes: str | None


class EpgSource(TypedDict):
    scraper: str
    scraper_status: Literal["implemented", "planned"]
    url: str
    method: Literal["GET", "POST"]
    kind: str


class ValidationHistoryEntry(TypedDict):
    checked_at: str
    report_path: str
    method: Literal["static_http", "browser_player", "manifest_seed", "review_followup"]
    status: Literal["ok", "warning", "error", "skipped"]
    note: str


class Permission(TypedDict):
    status: PermissionStatus
    summary: str
    evidence: list[str]
    recommendation: str


class ChannelRecord(TypedDict):
    id: str
    name: str
    jurisdiction_level: JurisdictionLevel
    country_or_region: str
    legislature: str
    external_ids: ExternalIds
    identity_sources: list[IdentitySource]
    language: str
    source_type: SourceType
    source_kind: SourceKind
    playback_url: str | None
    embed: NotRequired[Embed]
    official_url: str
    provenance_note: str
    validation_history: NotRequired[list[ValidationHistoryEntry]]
    technical_status: TechnicalStatus
    stability_risk: StabilityRisk
    availability: Availability
    accessibility: Accessibility
    epg_sources: list[EpgSource]
    permission: Permission


class Catalogue(TypedDict):
    schema_version: int
    generated_from: str
    generated_on: str
    description: str
    channels: list[ChannelRecord]


class FallbackSource(TypedDict):
    id: str
    related_channel_ids: list[str]
    label: str
    jurisdiction_level: JurisdictionLevel
    country_or_region: str
    legislature: str
    fallback_type: FallbackType
    official_url: str
    integration_mode: FallbackIntegrationMode
    playback_claim: FallbackPlaybackClaim
    schedule_role: FallbackScheduleRole
    stability_risk: StabilityRisk
    rights_status: PermissionStatus
    evidence_urls: list[str]
    notes: str


class FallbackCatalogue(TypedDict):
    schema_version: int
    generated_on: str
    description: str
    fallbacks: list[FallbackSource]


class CandidateRecord(TypedDict):
    candidate_version: Literal[1]
    status: CandidateStatus
    created_on: str
    updated_on: str
    decision_notes: list[str]
    channel: ChannelRecord


class SeedResult(TypedDict):
    kind: str
    url: str
    channel_id: str


class SeedGroup(TypedDict):
    country: str
    results: list[SeedResult]


class ValidationSeed(TypedDict):
    checked_at: str
    scope: str
    method: str
    countries: list[SeedGroup]


class IdentityAuditItem(TypedDict):
    id: str
    status: Literal["ok", "error"]
    issues: list[str]


class IdentityAudit(TypedDict):
    checked_at: str
    total: int
    counts: dict[str, int]
    results: list[IdentityAuditItem]


class HealthChange(TypedDict):
    id: str
    before: str | None
    after: str | None
    source_type: str | None
    source_kind: str | None
    availability: str | None
    stability_risk: str | None


class HealthDiff(TypedDict):
    before_checked_at: str | None
    after_checked_at: str | None
    added: list[HealthChange]
    removed: list[HealthChange]
    changed: list[HealthChange]
    regressions: list[HealthChange]
    recoveries: list[HealthChange]
