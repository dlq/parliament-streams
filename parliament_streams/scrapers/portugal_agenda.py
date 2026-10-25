"""Resolver and parser for Portugal Parliament's official open-data agenda."""

from __future__ import annotations

import json
import re
from datetime import UTC, datetime
from html import unescape
from typing import Any, cast
from urllib.parse import urljoin
from zoneinfo import ZoneInfo

from .common import (
    Fetcher as Fetcher,
)
from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
)

INDEX_URL = "https://www.parlamento.pt/Cidadania/Paginas/DABoletimInformativo.aspx"
SOURCE: ScraperSource = {
    "id": "portugal-open-data-agenda",
    "channel_ids": ["portugal-artv"],
    "url": INDEX_URL,
    "method": "GET",
    "notes": "Resolves the current legislature folder and its official JSON agenda download.",
}


def _link(html: str, pattern: str, base_url: str) -> str:
    match = re.search(pattern, html, flags=re.IGNORECASE)
    if not match:
        raise ValueError("official agenda download link was not found")
    return urljoin(base_url, unescape(match.group(1)))


def collect(
    fetcher: Fetcher, now: datetime, timeout: int, retries: int
) -> tuple[ParsedSchedule, list[str]]:
    index_request: FetchRequest = {"url": INDEX_URL, "method": "GET", "headers": {}}
    index_html = fetcher(index_request, timeout, retries)
    legislature_url = _link(
        index_html,
        r'<a[^>]+title="Pasta XVII Legislatura"[^>]+href="([^"]+)"',
        INDEX_URL,
    )
    legislature_html = fetcher(
        {"url": legislature_url, "method": "GET", "headers": {}}, timeout, retries
    )
    json_url = _link(
        legislature_html,
        r'<a[^>]+href="([^"]*AgendaParlamentar_json\.txt[^"]*)"',
        legislature_url,
    )
    payload = fetcher({"url": json_url, "method": "GET", "headers": {}}, timeout, retries)
    return parse(payload, now=now), [INDEX_URL, legislature_url, json_url]


def parse(payload: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    timezone = ZoneInfo("Europe/Lisbon")
    events: list[ScheduleEvent] = []
    for item in cast(list[dict[str, Any]], json.loads(payload)):
        section = str(item.get("Section", ""))
        if section not in {"Plenário", "Comissão Permanente", "Comissões Parlamentares"}:
            continue
        date_text = str(item.get("EventStartDate", ""))
        time_text = str(item.get("EventStartTime") or "00:00:00")
        title = str(item.get("Title", "")).strip()
        if not date_text or not title:
            continue
        try:
            start = datetime.strptime(f"{date_text} {time_text}", "%d/%m/%Y %H:%M:%S").replace(
                tzinfo=timezone
            )
        except ValueError:
            continue
        events.append({"start": start, "title": title})

    return build_upcoming_schedule(
        "portugal-artv",
        events,
        now,
        source_timezone="Europe/Lisbon",
        confidence="official_open_data_agenda",
    )
