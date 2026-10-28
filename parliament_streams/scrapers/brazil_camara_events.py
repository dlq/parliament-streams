"""Bounded official Câmara event JSON; institutional metadata, not TV replay dates."""

from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from urllib.parse import urlencode, urlsplit
from zoneinfo import ZoneInfo

from .common import (
    Fetcher,
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    clean_html,
    localize_source_time,
    parse_iso,
    require_object,
    require_records,
)

CHANNEL_ID = "brazil-tv-camara"
API_URL = "https://dadosabertos.camara.leg.br/api/v2/eventos"
TIMEZONE = "America/Sao_Paulo"
HORIZON_DAYS = 14
MAX_PAGES = 3
SOURCE: ScraperSource = {
    "id": "brazil-camara-events-api",
    "channel_ids": [CHANNEL_ID],
    "url": API_URL,
    "method": "GET",
    "notes": "Official institutional events; no TV replay mapping or inferred programme ends.",
}


def first_url(now: datetime) -> str:
    today = now.astimezone(ZoneInfo(TIMEZONE)).date()
    return (
        API_URL
        + "?"
        + urlencode(
            {
                "dataInicio": today.isoformat(),
                "dataFim": (today + timedelta(days=HORIZON_DAYS)).isoformat(),
                "itens": 100,
                "pagina": 1,
                "ordem": "ASC",
                "ordenarPor": "dataHoraInicio",
            }
        )
    )


def request_specs(now: datetime) -> list[FetchRequest]:
    return [{"url": first_url(now), "method": "GET", "headers": {"Accept": "application/json"}}]


def _page(payload: str) -> tuple[list[dict[str, object]], str | None]:
    data = require_object(json.loads(payload), "Câmara events response")
    rows = require_records(data.get("dados"), "Câmara events")
    links = require_records(data.get("links"), "Câmara pagination")
    next_links = [row.get("href") for row in links if row.get("rel") == "next"]
    if len(next_links) > 1:
        raise ValueError("Conflicting Câmara pagination")
    following = next_links[0] if next_links else None
    if following is not None and (
        not isinstance(following, str) or urlsplit(following)._replace(query="").geturl() != API_URL
    ):
        raise ValueError("Câmara pagination leaves its official event endpoint")
    return rows, following


def collect(
    fetcher: Fetcher, now: datetime, timeout: int, retries: int
) -> tuple[ParsedSchedule, list[str]]:
    url = first_url(now)
    urls: list[str] = []
    payloads: list[str] = []
    while url:
        if url in urls or len(urls) >= MAX_PAGES:
            raise ValueError("Câmara event collection capped or repeating; window is incomplete")
        urls.append(url)
        payload = fetcher(
            {"url": url, "method": "GET", "headers": {"Accept": "application/json"}},
            timeout,
            retries,
        )
        payloads.append(payload)
        _, following = _page(payload)
        url = following or ""
    return parse(*payloads, now=now), urls


def parse(*payloads: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    events: dict[str, ScheduleEvent] = {}
    for payload in payloads:
        rows, _ = _page(payload)
        for row in rows:
            status = str(row.get("situacao") or "").casefold()
            if "cancel" in status or "adiad" in status or "encerrad" in status:
                continue
            identity = row.get("id")
            title = clean_html(str(row.get("descricao") or row.get("descricaoTipo") or ""))
            value = row.get("dataHoraInicio")
            start = parse_iso(value) if isinstance(value, str) and "T" in value else None
            if (
                isinstance(identity, bool)
                or not str(identity or "").isdigit()
                or not title
                or start is None
            ):
                raise ValueError("Câmara event lacks its official ID, title or explicit start")
            if start.tzinfo is None:
                start = localize_source_time(start, TIMEZONE)
            if start is None:
                raise ValueError("Ambiguous Câmara source clock")
            if not now <= start <= now + timedelta(days=HORIZON_DAYS):
                continue
            event: ScheduleEvent = {
                "event_id": str(identity),
                "title": title,
                "start": start,
                "url": f"https://www.camara.leg.br/evento-legislativo/{identity}",
                "language": "pt-BR",
            }
            room = row.get("localCamara")
            location = room.get("nome") if isinstance(room, dict) else row.get("localExterno")
            if isinstance(location, str) and location.strip():
                event["location"] = clean_html(location)
            # Calendar end fields are not evidence of broadcast continuity.
            if str(identity) in events and events[str(identity)] != event:
                raise ValueError("Conflicting Câmara event ID")
            events[str(identity)] = event
    return build_upcoming_schedule(
        CHANNEL_ID,
        list(events.values()),
        now,
        source_timezone=TIMEZONE,
        confidence="official_institutional_event_api",
    )
