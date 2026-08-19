"""Audit playback presentation against rights and technical catalogue state."""

from __future__ import annotations

from typing import Literal, TypedDict

from .models import Catalogue, ChannelRecord
from .schedule_collection import utc_timestamp

FindingSeverity = Literal["info", "review", "error"]


class PlaybackPolicyFinding(TypedDict):
    channel_id: str
    severity: FindingSeverity
    code: str
    playback_policy: str
    permission_status: str
    technical_status: str
    source_type: str
    source_kind: str
    message: str


class PlaybackPolicyAuditReport(TypedDict):
    generated_at: str
    counts: dict[str, int]
    findings: list[PlaybackPolicyFinding]


PENDING_RIGHTS = {"personal_use_pending_review", "noncommercial_pending_review"}


def _finding(
    channel: ChannelRecord,
    *,
    severity: FindingSeverity,
    code: str,
    message: str,
) -> PlaybackPolicyFinding:
    return {
        "channel_id": str(channel["id"]),
        "severity": severity,
        "code": code,
        "playback_policy": str(channel["playback_policy"]),
        "permission_status": str(channel["permission"]["status"]),
        "technical_status": str(channel["technical_status"]),
        "source_type": str(channel["source_type"]),
        "source_kind": str(channel["source_kind"]),
        "message": message,
    }


def audit_playback_policies(catalogue: Catalogue) -> PlaybackPolicyAuditReport:
    """Return review findings for policy/rights/technical posture combinations."""
    findings: list[PlaybackPolicyFinding] = []
    policy_counts = {
        policy: 0 for policy in ("native_playback", "provider_embed", "link_out", "research_only")
    }

    for channel in catalogue["channels"]:
        policy = channel["playback_policy"]
        permission_status = channel["permission"]["status"]
        playback_url = channel["playback_url"]
        technical_status = channel["technical_status"]
        policy_counts[policy] += 1

        if policy == "native_playback" and permission_status in PENDING_RIGHTS:
            findings.append(
                _finding(
                    channel,
                    severity="review",
                    code="native-playback-pending-rights",
                    message=(
                        "Native playback is enabled by project policy while rights remain "
                        "pending; keep visible attribution and review during the rights pass."
                    ),
                )
            )
        if policy == "link_out" and playback_url and technical_status == "validated":
            findings.append(
                _finding(
                    channel,
                    severity="info",
                    code="link-out-has-validated-playback-url",
                    message=(
                        "A validated playback URL is retained for evidence, but the public "
                        "catalogue presents the source as link-out."
                    ),
                )
            )
        if policy == "research_only" and playback_url:
            findings.append(
                _finding(
                    channel,
                    severity="info",
                    code="research-only-has-playback-url",
                    message=(
                        "A playback URL is retained for research, but the public catalogue "
                        "does not present it as playable."
                    ),
                )
            )

    severity_counts = {severity: 0 for severity in ("info", "review", "error")}
    for finding in findings:
        severity_counts[finding["severity"]] += 1

    return {
        "generated_at": utc_timestamp(),
        "counts": {
            **policy_counts,
            **severity_counts,
            "findings": len(findings),
            "channels": len(catalogue["channels"]),
        },
        "findings": sorted(
            findings, key=lambda item: (item["severity"], item["code"], item["channel_id"])
        ),
    }
