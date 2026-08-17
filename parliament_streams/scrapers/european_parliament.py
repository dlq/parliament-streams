"""Parser for European Parliament Multimedia Centre webstreaming data."""

from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

from .common import (
    FetchRequest,
    ParsedSchedule,
    ScraperSource,
    checked_label,
    clean_html,
    local_time_label,
    parse_iso,
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
    parsed: list[tuple[datetime, datetime | None, str, str]] = []
    for event in events:
        start = parse_iso(str(event.get("EventDateStart", "")))
        end = parse_iso(str(event.get("EventDateEnd", "")))
        title = _event_title(event)
        if start and title:
            parsed.append((start, end, title, str(event.get("statusName", "")).upper()))
    parsed.sort(key=lambda event: event[0])

    current = next(
        (event for event in parsed if event[0] <= now and (event[1] is None or now <= event[1])),
        None,
    )
    upcoming = next((event for event in parsed if event[0] > now), None)
    if not current and not upcoming:
        return {
            CHANNEL_ID: {
                "current_event_title": "No European Parliament event is live now",
                "current_event_time": checked_label(now, "Europe/Brussels"),
                "next_event_title": None,
                "next_event_time": None,
                "confidence": "official_schedule",
            }
        }

    return {
        CHANNEL_ID: {
            "current_event_title": current[2]
            if current
            else "No European Parliament event is live now",
            "current_event_time": "Live now" if current else checked_label(now, "Europe/Brussels"),
            "next_event_title": upcoming[2] if upcoming else None,
            "next_event_time": local_time_label(upcoming[0], "Europe/Brussels")
            if upcoming
            else None,
            "confidence": "official_schedule",
        }
    }
