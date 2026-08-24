"""Parser for European Parliament Multimedia Centre webstreaming data."""

from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    clean_html,
    local_time_label,
    normalized_events,
    parse_iso,
    utc_event_start,
)

CHANNEL_ID = "european-parliament-multimedia-centre"
DATA_URL = (
    "https://multimedia.europarl.europa.eu/_next/data/"
    "mn1XdpefUAeUcPpwTz-7w/en/webstreaming.json?view=month"
)

SOURCE: ScraperSource = {
    "id": "europarl-webstreaming",
    "channel_ids": [CHANNEL_ID],
    "url": DATA_URL,
    "method": "GET",
    "headers": {"User-Agent": "Mozilla/5.0"},
    "notes": "Reads the official Multimedia Centre webstreaming JSON.",
}


def request_specs(now: datetime) -> list[FetchRequest]:
    date = now.date().isoformat()
    return [
        {
            "url": f"{DATA_URL}&d={date}",
            "method": "GET",
            "headers": dict(SOURCE.get("headers", {})),
        }
    ]


def _event_title(event: dict[str, Any]) -> str:
    title = clean_html(str(event.get("title", "")))
    room = clean_html(str(event.get("room", "")))
    return f"{title} - {room}" if title and room else title


def parse(payload: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    data = json.loads(payload)
    events = data.get("pageProps", {}).get("mediaItems", [])
    parsed: list[ScheduleEvent] = []
    for event in events:
        start = parse_iso(str(event.get("EventDateStart", "")))
        end = parse_iso(str(event.get("EventDateEnd", "")))
        title = _event_title(event)
        if start and title:
            parsed_event: ScheduleEvent = {"start": start, "title": title}
            if end:
                parsed_event["end"] = end
            status = str(event.get("statusName", "")).strip()
            if status:
                parsed_event["status"] = status
            parsed.append(parsed_event)
    parsed.sort(key=lambda event: event["start"])

    current = next(
        (
            event
            for event in parsed
            if event["start"] <= now and (event.get("end") is None or now <= event["end"])
        ),
        None,
    )
    upcoming = next((event for event in parsed if event["start"] > now), None)
    if not current and not upcoming:
        return {}

    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": "Live now" if current else None,
        "next_event_title": upcoming["title"] if upcoming else None,
        "next_event_time": local_time_label(upcoming["start"], "Europe/Brussels")
        if upcoming
        else None,
        "confidence": "official_schedule",
    }
    if current:
        schedule["current_event_start"] = utc_event_start(current["start"])
    if upcoming:
        schedule["next_event_start"] = utc_event_start(upcoming["start"])
    schedule["events"] = normalized_events(
        CHANNEL_ID, parsed, now, source_timezone="Europe/Brussels"
    )
    return {CHANNEL_ID: schedule}
