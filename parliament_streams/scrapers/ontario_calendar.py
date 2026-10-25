"""Parser for the Ontario Legislative Assembly calendar page."""

from __future__ import annotations

import re
from datetime import UTC, datetime

from .common import (
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    clean_html,
    localize_source_time,
    parse_iso,
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
        if not re.search(r"[T ]\d{2}:\d{2}", date_text):
            # A sitting day is not evidence of a broadcast starting at midnight.
            continue
        start = parse_iso(date_text)
        if start is not None and start.tzinfo is None:
            start = localize_source_time(start, "America/Toronto")
        title = clean_html(title_html)
        if start and title:
            events.append({"start": start, "title": title})
    events.sort(key=lambda item: item["start"])

    relevant_events = [
        event
        for event in events
        if re.search(r"\b(house|sitting|question period)\b", event["title"], re.IGNORECASE)
    ]
    return build_upcoming_schedule(
        "ontario-house-en",
        relevant_events,
        now,
        source_timezone="America/Toronto",
        confidence="official_legislature_calendar_house_event",
    )
