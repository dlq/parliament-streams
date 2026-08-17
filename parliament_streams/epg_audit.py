"""Live endpoint audit for the schedule sources recorded in the catalogue."""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime
from typing import Literal, TypedDict, cast

from .models import Catalogue
from .schedule_collection import fetch_text, request_specs, utc_timestamp
from .scrapers import SCRAPERS
from .scrapers.common import FetchRequest


class EpgAuditResult(TypedDict):
    url: str
    method: str
    status: Literal["reachable", "access_blocked", "not_found", "error"]
    checked_at: str
    channel_ids: list[str]
    scraper_status: list[str]
    detail: str


class EpgAuditReport(TypedDict):
    generated_at: str
    counts: dict[str, int]
    sources: list[EpgAuditResult]


def _request_for_source(scraper: str, url: str, method: str, now: datetime) -> FetchRequest:
    module = SCRAPERS.get(scraper)
    if module:
        requests = request_specs(module, now)
        source_url = str(module.SOURCE.get("url", ""))
        if url == source_url and requests:
            return requests[0]
        for request in requests:
            if request["url"] == url:
                return request
    return {"url": url, "method": method, "headers": {}}


def _classify_error(error: RuntimeError) -> tuple[str, str]:
    detail = str(error)
    if "HTTP 401" in detail or "HTTP 403" in detail or "HTTP 429" in detail:
        return "access_blocked", detail
    if "HTTP 404" in detail or "HTTP 410" in detail:
        return "not_found", detail
    return "error", detail


def audit_epg_sources(
    catalogue: Catalogue,
    *,
    now: datetime | None = None,
    timeout: int = 15,
    retries: int = 0,
    workers: int = 1,
) -> EpgAuditReport:
    checked_at = now or datetime.now(UTC)
    grouped: dict[tuple[str, str, str], dict[str, set[str]]] = {}
    for channel in catalogue["channels"]:
        for source in channel["epg_sources"]:
            key = (source["scraper"], source["method"], source["url"])
            item = grouped.setdefault(key, {"channel_ids": set(), "scraper_status": set()})
            item["channel_ids"].add(channel["id"])
            item["scraper_status"].add(source["scraper_status"])

    def check(
        item: tuple[tuple[str, str, str], dict[str, set[str]]],
    ) -> EpgAuditResult:
        (scraper, method, url), metadata = item
        request = _request_for_source(scraper, url, method, checked_at)
        try:
            payload = fetch_text(request, timeout, retries)
            status: Literal["reachable", "access_blocked", "not_found", "error"] = "reachable"
            detail = f"Retrieved {len(payload.encode('utf-8'))} bytes"
        except RuntimeError as error:
            raw_status, detail = _classify_error(error)
            status = cast(Literal["reachable", "access_blocked", "not_found", "error"], raw_status)
        return {
            "url": url,
            "method": method,
            "status": status,
            "checked_at": utc_timestamp(checked_at),
            "channel_ids": sorted(metadata["channel_ids"]),
            "scraper_status": sorted(metadata["scraper_status"]),
            "detail": detail,
        }

    items = sorted(grouped.items(), key=lambda item: item[0][2])
    with ThreadPoolExecutor(max_workers=max(1, workers)) as executor:
        results = list(executor.map(check, items))

    counts = {status: 0 for status in ("reachable", "access_blocked", "not_found", "error")}
    for result in results:
        counts[result["status"]] += 1
    counts["sources"] = len(results)
    return {"generated_at": utc_timestamp(checked_at), "counts": counts, "sources": results}
