"""Resolver and parser for Portugal Parliament's official open-data agenda."""

from __future__ import annotations

import json
import re
from datetime import UTC, datetime
from html import unescape
from typing import Any, cast
from urllib.parse import urljoin, urlsplit

from .common import (
    Fetcher as Fetcher,
)
from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    clean_html,
    localize_source_time,
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
    raw_events = json.loads(payload)
    if not isinstance(raw_events, list) or any(not isinstance(row, dict) for row in raw_events):
        raise ValueError("Portugal agenda must be a list of event objects")
    events: list[ScheduleEvent] = []
    for item in cast(list[dict[str, Any]], raw_events):
        section = str(item.get("Section", ""))
        if section not in {"Plenário", "Comissão Permanente", "Comissões Parlamentares"}:
            continue
        date_text = item.get("EventStartDate")
        time_text = item.get("EventStartTime")
        title = item.get("Title")
        if (
            item.get("AllDayEvent") is True
            or not isinstance(date_text, str)
            or not isinstance(time_text, str)
            or not isinstance(title, str)
            or not date_text.strip()
            or not time_text.strip()
            or not title.strip()
        ):
            continue
        title = clean_html(title)
        if not title:
            continue
        try:
            start = localize_source_time(
                datetime.strptime(f"{date_text.strip()} {time_text.strip()}", "%d/%m/%Y %H:%M:%S"),
                "Europe/Lisbon",
            )
        except ValueError:
            continue
        if start is None:
            continue
        event: ScheduleEvent = {"start": start, "title": title}
        official_id = item.get("Id")
        if (
            isinstance(official_id, (str, int))
            and not isinstance(official_id, bool)
            and (identifier := str(official_id).strip())
        ):
            event["event_id"] = identifier
        if isinstance(location := item.get("Local"), str) and clean_html(location):
            event["location"] = clean_html(location)
        if isinstance(link := item.get("Link"), str):
            try:
                url = urlsplit(link.strip())
                if url.scheme in {"http", "https"} and url.netloc:
                    event["url"] = link.strip()
            except ValueError:
                pass
        # The current agenda repeats 23:59 as the end for every sampled meeting.
        # These institutional calendar bounds do not establish broadcast ends.
        events.append(event)

    return build_upcoming_schedule(
        "portugal-artv",
        events,
        now,
        source_timezone="Europe/Lisbon",
        confidence="official_open_data_agenda",
    )
