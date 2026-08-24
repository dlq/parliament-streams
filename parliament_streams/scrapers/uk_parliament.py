"""Parser for the UK Parliament What's on calendar API."""

from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from typing import Any, cast
from urllib.parse import urlencode
from zoneinfo import ZoneInfo

from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    clean_html,
    local_time_label,
    normalized_events,
    utc_event_start,
)

API_URL = "https://whatson-api.parliament.uk/calendar/events/list.json"
CHANNEL_ID = "uk-parliament-youtube"
SOURCE: ScraperSource = {
    "id": "uk-parliament",
    "channel_ids": [CHANNEL_ID],
    "url": API_URL,
    "method": "GET",
    "notes": "Parses the official UK Parliament What's on JSON calendar for public events.",
}

PUBLIC_EVENT_TYPES = {"Main Chamber", "Westminster Hall", "Grand Committee"}


def request_specs(now: datetime) -> list[FetchRequest]:
    local_now = now.astimezone(ZoneInfo("Europe/London"))
    start = local_now.date()
    end = start + timedelta(days=31)
    query = urlencode({"startDate": start.isoformat(), "endDate": end.isoformat()})
    return [
        {
            "url": f"{API_URL}?{query}",
            "method": "GET",
            "headers": {},
        }
    ]


def _start_time(item: dict[str, Any]) -> datetime | None:
    date_text = str(item.get("StartDate", "")).split("T", 1)[0]
    time_text = str(item.get("StartTime") or "").strip()
    if not time_text:
        return None
    try:
        return datetime.strptime(f"{date_text} {time_text}", "%Y-%m-%d %H:%M").replace(
            tzinfo=ZoneInfo("Europe/London")
        )
    except ValueError:
        return None


def _public_event(item: dict[str, Any]) -> bool:
    if item.get("CancelledDate"):
        return False
    category = str(item.get("Category") or "")
    event_type = str(item.get("Type") or "")
    return category != "Private Meeting" and (
        event_type in PUBLIC_EVENT_TYPES or category == "Oral evidence"
    )


def _title(item: dict[str, Any]) -> str:
    house = str(item.get("House") or "").strip()
    event_type = str(item.get("Type") or "").strip()
    description = clean_html(str(item.get("Description") or ""))
    committee = item.get("Committee")
    if not description and isinstance(committee, dict):
        description = clean_html(str(committee.get("Description") or ""))
    if not description:
        description = clean_html(str(item.get("Category") or event_type or "Parliamentary event"))
    prefix = " - ".join(part for part in (house, event_type) if part)
    return f"{prefix}: {description}" if prefix else description


def parse(payload: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    events: list[ScheduleEvent] = []
    for item in cast(list[dict[str, Any]], json.loads(payload)):
        if not _public_event(item):
            continue
        start = _start_time(item)
        title = _title(item)
        if start and title:
            events.append({"start": start, "title": title})

    events.sort(key=lambda event: event["start"])
    upcoming = [event for event in events if event["start"] >= now]
    if not upcoming:
        return {}
    next_event = upcoming[0]
    schedule: ScheduleMetadata = {
        "current_event_title": None,
        "current_event_time": None,
        "next_event_title": next_event["title"],
        "next_event_time": local_time_label(next_event["start"], "Europe/London"),
        "next_event_start": utc_event_start(next_event["start"]),
        "confidence": "official_whatson_calendar_api",
    }
    schedule["events"] = normalized_events(CHANNEL_ID, events, now, source_timezone="Europe/London")
    return {CHANNEL_ID: schedule}
