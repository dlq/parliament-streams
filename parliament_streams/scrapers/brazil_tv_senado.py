"""Parse the separate, dated linear TV Senado grid used by its official TV page."""

from __future__ import annotations

import json
import re
from datetime import UTC, date, datetime, timedelta
from itertools import pairwise
from urllib.parse import urlencode
from zoneinfo import ZoneInfo

from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    clean_html,
    format_utc_timestamp,
    local_time_label,
    localize_source_time,
    normalized_events,
)

CHANNEL_ID = "brazil-tv-senado-official"
PROGRAMME_URL = "https://www12.senado.leg.br/tv/programacao"
API_URL = "https://www12.senado.leg.br/tv/programacaoAjax"
SOURCE_TIMEZONE = "America/Sao_Paulo"
MAX_DAYS = 3
SOURCE: ScraperSource = {
    "id": "brazil-tv-senado-grid",
    "channel_ids": [CHANNEL_ID],
    "url": PROGRAMME_URL,
    "method": "GET",
    "headers": {},
    "notes": (
        "Official complete daily linear TV Senado grid, requested by source date. "
        "Separate from parallel institutional webcasts. A slot ends at the next "
        "published start in the same daily grid; each terminal slot remains open."
    ),
}


def _source_day(now: datetime) -> date:
    if now.tzinfo is None or now.utcoffset() is None:
        raise ValueError("TV Senado collection time requires a timezone offset")
    return now.astimezone(ZoneInfo(SOURCE_TIMEZONE)).date()


def _day_url(source_day: date) -> str:
    return f"{API_URL}?{urlencode({'date': source_day.strftime('%d-%m-%Y')})}"


def request_specs(now: datetime) -> list[FetchRequest]:
    today = _source_day(now)
    return [
        {"url": _day_url(today + timedelta(days=offset)), "method": "GET", "headers": {}}
        for offset in range(MAX_DAYS)
    ]


def source_url_for_channel(channel_id: str, urls: list[str]) -> str:
    return PROGRAMME_URL


def _day_events(payload: str, source_day: date) -> list[ScheduleEvent]:
    rows = json.loads(payload)
    if not isinstance(rows, list):
        raise ValueError("TV Senado grid response must be the documented JSON row list")
    events: list[ScheduleEvent] = []
    for row in rows:
        if not isinstance(row, dict) or any(
            not isinstance(row.get(key), str)
            for key in ("horario", "programa", "episodio", "sinopse")
        ):
            raise ValueError("TV Senado grid row does not match its documented renderer fields")
        clock = row["horario"].strip()
        if not re.fullmatch(r"(?:[01][0-9]|2[0-3]):[0-5][0-9]", clock):
            raise ValueError("TV Senado grid contains an unresolved programme clock")
        hour, minute = (int(part) for part in clock.split(":"))
        start = localize_source_time(
            datetime.combine(source_day, datetime.min.time()).replace(hour=hour, minute=minute),
            SOURCE_TIMEZONE,
        )
        if start is None:
            raise ValueError("TV Senado grid contains an ambiguous or nonexistent source clock")
        title = clean_html(row["programa"])
        episode = clean_html(row["episodio"])
        if not title:
            raise ValueError("TV Senado grid contains an untitled programme")
        if episode not in {"", "_", "-"} and episode.casefold() != title.casefold():
            title = f"{title} - {episode}"
        if events and start <= events[-1]["start"]:
            raise ValueError("TV Senado daily grid is not a strictly ordered linear sequence")
        events.append({"start": start, "title": title, "url": PROGRAMME_URL, "language": "pt-BR"})
    # These are adjoining slots in one explicitly labelled complete TV grid.
    # Never bridge a missing date, infer between rooms, or close the final slot.
    for event, following in pairwise(events):
        event["end"] = following["start"]
        event["end_basis"] = "next_listing_start"
    return events


def parse(*payloads: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    today = _source_day(now)
    if not 1 <= len(payloads) <= MAX_DAYS:
        raise ValueError("TV Senado requires one to three explicitly requested daily grid payloads")
    events = [
        event
        for offset, payload in enumerate(payloads)
        for event in _day_events(payload, today + timedelta(days=offset))
    ]
    if not events:
        return {}
    current = next(
        (event for event in events if event["start"] <= now < event.get("end", event["start"])),
        None,
    )
    upcoming = next(
        (event for event in events if event is not current and event["start"] >= now), None
    )
    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": local_time_label(current["start"], SOURCE_TIMEZONE)
        if current
        else None,
        "next_event_title": upcoming["title"] if upcoming else None,
        "next_event_time": local_time_label(upcoming["start"], SOURCE_TIMEZONE)
        if upcoming
        else None,
        "confidence": "official_dated_linear_tv_grid",
        "events": normalized_events(CHANNEL_ID, events, now, source_timezone=SOURCE_TIMEZONE),
    }
    if current:
        schedule["current_event_start"] = format_utc_timestamp(current["start"])
        schedule["current_event_url"] = current["url"]
        schedule["current_event_language"] = "pt-BR"
    if upcoming:
        schedule["next_event_start"] = format_utc_timestamp(upcoming["start"])
        schedule["next_event_url"] = upcoming["url"]
        schedule["next_event_language"] = "pt-BR"
    return {CHANNEL_ID: schedule}
