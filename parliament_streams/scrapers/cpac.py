"""Parser for CPAC's public schedule page."""

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

SOURCE: ScraperSource = {
    "id": "cpac",
    "channel_ids": ["cpac-ca"],
    "url": "https://www.cpac.ca/schedule/",
    "method": "GET",
    "notes": "Parses data-airdate schedule items from CPAC's public schedule page.",
}


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    entries: list[ScheduleEvent] = []
    pattern = re.compile(
        r'data-airdate="([^"]+)"[\s\S]*?'
        r'<button[^>]*class="[^"]*schedule-item-btn[^"]*"[^>]*>([\s\S]*?)</button>',
        re.IGNORECASE,
    )
    for date_text, title_html in pattern.findall(html):
        start = parse_iso(date_text)
        title = clean_html(title_html)
        if start and title:
            entries.append({"start": start, "title": title})

    entries.sort(key=lambda item: item["start"])
    if not entries:
        return {}
    for entry, following in zip(entries, entries[1:], strict=False):
        entry["end"] = following["start"]

    current = next((entry for entry in reversed(entries) if entry["start"] <= now), None)
    next_entry = next((entry for entry in entries if entry["start"] > now), None)
    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": local_time_label(current["start"]) if current else None,
        "next_event_title": next_entry["title"] if next_entry else None,
        "next_event_time": local_time_label(next_entry["start"]) if next_entry else None,
        "confidence": "official_schedule",
    }
    if current:
        schedule["current_event_start"] = utc_event_start(current["start"])
    if next_entry:
        schedule["next_event_start"] = utc_event_start(next_entry["start"])
    schedule["events"] = normalized_events(
        "cpac-ca", entries, now, source_timezone="America/Toronto"
    )
    return {"cpac-ca": schedule}
