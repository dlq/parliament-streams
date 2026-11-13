"""Parser for European Parliament Multimedia Centre webstreaming data."""

from __future__ import annotations

import json
import re
from datetime import UTC, datetime
from typing import Any

from .common import (
    Fetcher,
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    clean_html,
    format_utc_timestamp,
    local_time_label,
    normalized_events,
    parse_iso,
    require_object,
    require_records,
)

CHANNEL_ID = "european-parliament-multimedia-centre"
BASE_URL = "https://multimedia.europarl.europa.eu"
HOME_URL = f"{BASE_URL}/en"
NEXT_DATA = re.compile(
    r"""<script\b[^>]*\sid=["']__NEXT_DATA__["'][^>]*>(.*?)</script\s*>""",
    re.DOTALL,
)

SOURCE: ScraperSource = {
    "id": "europarl-webstreaming",
    "channel_ids": [CHANNEL_ID],
    "url": HOME_URL,
    "method": "GET",
    "headers": {"User-Agent": "Mozilla/5.0"},
    "notes": "Reads the official Multimedia Centre webstreaming JSON.",
}


def collect(
    fetcher: Fetcher, now: datetime, timeout: int, retries: int
) -> tuple[ParsedSchedule, list[str]]:
    request: FetchRequest = {
        "url": HOME_URL,
        "method": "GET",
        "headers": dict(SOURCE.get("headers", {})),
    }
    match = NEXT_DATA.search(fetcher(request, timeout, retries))
    if not match:
        raise ValueError("European Parliament homepage lacks Next.js metadata")
    metadata = require_object(json.loads(match[1]), "European Parliament homepage metadata")
    build_id = metadata.get("buildId")
    if not isinstance(build_id, str) or not re.fullmatch(r"[A-Za-z0-9_-]+", build_id):
        raise ValueError("European Parliament homepage has an invalid build ID")
    date = now.date().isoformat()
    url = f"{BASE_URL}/_next/data/{build_id}/en/webstreaming.json?view=month&d={date}"
    payload = fetcher({**request, "url": url}, timeout, retries)
    return parse(payload, now=now), [url, HOME_URL]


def _event_title(event: dict[str, Any]) -> str:
    title = clean_html(str(event.get("title", "")))
    room = clean_html(str(event.get("room", "")))
    return f"{title} - {room}" if title and room else title


def parse(payload: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    data = require_object(json.loads(payload), "European Parliament response")
    page = require_object(data.get("pageProps"), "European Parliament pageProps")
    events = require_records(page.get("mediaItems"), "European Parliament mediaItems")
    parsed: list[ScheduleEvent] = []
    for event in events:
        start = parse_iso(str(event.get("EventDateStart", "")))
        end = parse_iso(str(event.get("EventDateEnd", "")))
        title = _event_title(event)
        if start and start.utcoffset() is not None and title:
            parsed_event: ScheduleEvent = {"start": start, "title": title}
            room = clean_html(str(event.get("room", "")))
            if room:
                parsed_event["location"] = room
            if end and end.utcoffset() is not None and end > start:
                parsed_event["end"] = end
            status = str(event.get("statusName", "")).strip()
            if status:
                parsed_event["status"] = status
            parsed.append(parsed_event)
    parsed.sort(key=lambda event: event["start"])

    current = next(
        (event for event in parsed if event.get("end") and event["start"] <= now < event["end"]),
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
        schedule["current_event_start"] = format_utc_timestamp(current["start"])
    if upcoming:
        schedule["next_event_start"] = format_utc_timestamp(upcoming["start"])
    schedule["events"] = normalized_events(
        CHANNEL_ID, parsed, now, source_timezone="Europe/Brussels"
    )
    return {CHANNEL_ID: schedule}
