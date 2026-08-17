"""Parser for the Italian Senate WebTV palimpsest API."""

from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from typing import Any, cast
from urllib.parse import urlencode
from zoneinfo import ZoneInfo

from .common import FetchRequest, ParsedSchedule, ScheduleEvent, ScraperSource, local_time_label

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
    current = upcoming[0] if upcoming else events[-1]
    current_index = events.index(current)
    next_event = events[current_index + 1] if current_index + 1 < len(events) else None
    return {
        "italy-senate": {
            "current_event_title": current["title"],
            "current_event_time": local_time_label(current["start"]),
            "next_event_title": next_event["title"] if next_event else None,
            "next_event_time": local_time_label(next_event["start"]) if next_event else None,
            "confidence": "official_schedule_api",
        }
    }
