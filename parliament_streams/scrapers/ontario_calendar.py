"""Parser for the Ontario Legislative Assembly calendar page."""

from __future__ import annotations

import re
from datetime import UTC, datetime

from .common import (
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

CHANNEL_IDS = [
    "ontario-house-en",
    "ontario-house-en-cc",
    "ontario-rm151-en",
    "ontario-committee-1-en",
    "ontario-committee-2-en",
    "ontario-media-en",
]

SOURCE: ScraperSource = {
    "id": "ontario-calendar",
    "channel_ids": CHANNEL_IDS,
    "url": "https://www.ola.org/en/legislative-business/calendar/",
    "method": "GET",
    "headers": {},
    "notes": "Extracts dated event headings from the official OLA calendar.",
}


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    events: list[ScheduleEvent] = []
    pattern = re.compile(
        r'<time[^>]*datetime="([^"]+)"[^>]*>[\s\S]*?</time>[\s\S]*?'
        r"<h[1-6][^>]*>([\s\S]*?)</h[1-6]>",
        re.IGNORECASE,
    )
    for date_text, title_html in pattern.findall(html):
        start = parse_iso(date_text)
        title = clean_html(title_html)
        if start and title:
            events.append({"start": start, "title": title})
    events.sort(key=lambda item: item["start"])

    relevant_events = [
        event
        for event in events
        if re.search(r"\b(house|sitting|question period)\b", event["title"], re.IGNORECASE)
    ]
    house_events = [event for event in relevant_events if event["start"] >= now]
    if not house_events:
        return {}
    next_event = house_events[0]
    schedule: ScheduleMetadata = {
        "current_event_title": None,
        "current_event_time": None,
        "next_event_title": next_event["title"],
        "next_event_time": local_time_label(next_event["start"]),
        "next_event_start": utc_event_start(next_event["start"]),
        "confidence": "official_legislature_calendar_house_event",
    }
    schedule["events"] = normalized_events(
        "ontario-house-en", relevant_events, now, source_timezone="America/Toronto"
    )
    return {"ontario-house-en": schedule}
