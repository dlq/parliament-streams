"""Reachability audit for non-media links recorded in the catalogue."""

from __future__ import annotations

import hashlib
from concurrent.futures import ThreadPoolExecutor
from typing import Literal, TypedDict

from .healthcheck import fetch_url
from .models import Catalogue
from .schedule_collection import utc_timestamp

LinkStatus = Literal["reachable", "access_blocked", "not_found", "error"]


class LinkAuditResult(TypedDict):
    url: str
    status: LinkStatus
    http_status: int | None
    content_type: str | None
    response_bytes: int
    body_sha256: str | None
    final_url: str | None
    attempts: int
    channel_ids: list[str]
    roles: list[str]


class LinkAuditReport(TypedDict):
    generated_at: str
    counts: dict[str, int]
    links: list[LinkAuditResult]


def _record(grouped: dict[str, dict[str, set[str]]], url: str, channel_id: str, role: str) -> None:
    item = grouped.setdefault(url, {"channel_ids": set(), "roles": set()})
    item["channel_ids"].add(channel_id)
    item["roles"].add(role)


def catalogue_links(catalogue: Catalogue) -> dict[str, dict[str, set[str]]]:
    """Return unique non-playback, non-EPG links with their catalogue roles."""
    grouped: dict[str, dict[str, set[str]]] = {}
    for channel in catalogue["channels"]:
        channel_id = channel["id"]
        _record(grouped, channel["official_url"], channel_id, "official_page")
        for url in channel["permission"]["evidence"]:
            _record(grouped, url, channel_id, "permission_evidence")
        for source in channel["identity_sources"]:
            _record(grouped, source["url"], channel_id, f"identity_{source['source']}")
        embed = channel.get("embed")
        if embed:
            _record(grouped, embed["url"], channel_id, "embed")
            _record(grouped, embed["live_url"], channel_id, "embed_live_page")
    return grouped


def _status(http_status: int | None) -> LinkStatus:
    if http_status is not None and http_status < 400:
        return "reachable"
    if http_status in {401, 403, 429}:
        return "access_blocked"
    if http_status in {404, 410}:
        return "not_found"
    return "error"


def audit_catalogue_links(
    catalogue: Catalogue, *, timeout: int = 12, retries: int = 0, workers: int = 8
) -> LinkAuditReport:
    """Check every unique official, rights, identity, and embed link."""
    grouped = catalogue_links(catalogue)

    def check(item: tuple[str, dict[str, set[str]]]) -> LinkAuditResult:
        url, metadata = item
        http_status, headers, body, final_url, attempts = fetch_url(url, timeout, retries)
        status = _status(http_status)
        return {
            "url": url,
            "status": status,
            "http_status": http_status,
            "content_type": headers.get("content-type"),
            "response_bytes": len(body),
            "body_sha256": hashlib.sha256(body).hexdigest() if status == "reachable" else None,
            "final_url": final_url,
            "attempts": attempts,
            "channel_ids": sorted(metadata["channel_ids"]),
            "roles": sorted(metadata["roles"]),
        }

    with ThreadPoolExecutor(max_workers=max(1, workers)) as executor:
        results = list(executor.map(check, sorted(grouped.items())))

    counts = {status: 0 for status in ("reachable", "access_blocked", "not_found", "error")}
    for result in results:
        counts[result["status"]] += 1
    counts["links"] = len(results)
    return {
        "generated_at": utc_timestamp(),
        "counts": counts,
        "links": results,
    }
