"""Parser for the Italian Senate WebTV palimpsest API."""

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
    local_time_label,
    normalized_events,
    utc_event_start,
)

API_URL = "https://webtv.senato.it/api/palimpsest"
SOURCE: ScraperSource = {
    "id": "italian-senate-palimpsest",
    "channel_ids": ["italy-senate"],
    "url": API_URL,
    "method": "GET",
    "notes": "Queries the official WebTV palimpsest API for today and the next two days.",
}


def request_specs(now: datetime) -> list[FetchRequest]:
    local_date = now.astimezone(ZoneInfo("Europe/Rome")).date()
    requests: list[FetchRequest] = []
    for offset in range(3):
        start = local_date + timedelta(days=offset)
        end = start + timedelta(days=1)
        query = urlencode(
            {
                "field_date_value[min]": f"{start.isoformat()}T00:00:00",
                "field_date_value[max]": f"{end.isoformat()}T00:00:00",
            }
        )
        requests.append({"url": f"{API_URL}?{query}", "method": "GET", "headers": {}})
    return requests


def parse(*payloads: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    timezone = ZoneInfo("Europe/Rome")
    local_date = now.astimezone(timezone).date()
    events: list[ScheduleEvent] = []

    for offset, payload in enumerate(payloads):
        raw_events = cast(list[dict[str, Any]], json.loads(payload))
        event_date = local_date + timedelta(days=offset)
        for raw_event in raw_events:
            title = str(raw_event.get("title", "")).strip()
            time_text = str(raw_event.get("field_date", "")).strip()
            if not title or not time_text:
                continue
            try:
                hour, minute = (int(part) for part in time_text.replace(".", ":").split(":")[:2])
            except ValueError:
                continue
            events.append(
                {
                    "start": datetime(
                        event_date.year,
                        event_date.month,
                        event_date.day,
                        hour,
                        minute,
                        tzinfo=timezone,
                    ),
                    "title": title,
                }
            )

    events.sort(key=lambda event: event["start"])
    if not events:
        return {}

    upcoming = [event for event in events if event["start"] >= now]
    if not upcoming:
        return {}
    next_event = upcoming[0]
    schedule: ScheduleMetadata = {
        "current_event_title": None,
        "current_event_time": None,
        "next_event_title": next_event["title"],
        "next_event_time": local_time_label(next_event["start"], "Europe/Rome"),
        "next_event_start": utc_event_start(next_event["start"]),
        "confidence": "official_schedule_api",
    }
    schedule["events"] = normalized_events(
        "italy-senate", events, now, source_timezone="Europe/Rome"
    )
    return {"italy-senate": schedule}
