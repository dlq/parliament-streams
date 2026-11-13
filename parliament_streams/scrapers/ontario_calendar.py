"""Collect timed House sittings from Ontario's official daily calendar."""

from __future__ import annotations

import re
from datetime import UTC, datetime
from html.parser import HTMLParser

from .common import (
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    localize_source_time,
)

CHANNEL_IDS = ["ontario-house-en"]
TIMEZONE = "America/Toronto"

SOURCE: ScraperSource = {
    "id": "ontario-calendar",
    "channel_ids": CHANNEL_IDS,
    "url": "https://www.ola.org/en/legislative-business/calendar/",
    "method": "GET",
    "headers": {},
    "notes": "Reads timed House sitting cards from the official daily calendar.",
}

DAY_HEADING = re.compile(
    r"""<h2\b[^>]*\sid=["']calendar-view-heading["'][^>]*>\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})\s*<"""
)
CARD_TITLE = re.compile(r"(.+?):\s*(\d{1,2})(?::(\d{2}))?\s*([ap])\.m\.", re.IGNORECASE)


class _CalendarCards(HTMLParser):
    def __init__(self, html: str) -> None:
        super().__init__()
        self.event_types: list[str | None] = []
        self.seen_event = False
        self.house_titles: list[str] = []
        self.feed(html)
        self.close()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag != "div":
            return
        attributes = dict(attrs)
        classes = (attributes.get("class") or "").split()
        event_type = self.event_types[-1] if self.event_types else None
        if "calendar-event-filter-item" in classes:
            event_type = attributes.get("data-event-type")
            if not event_type:
                raise ValueError("Ontario calendar event lacks its type")
            self.seen_event = True
        self.event_types.append(event_type)
        if event_type == "house-sitting" and "parliamentary-calendar-event" in classes:
            self.house_titles.append(attributes.get("title") or "")

    def handle_endtag(self, tag: str) -> None:
        if tag == "div" and self.event_types:
            self.event_types.pop()


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    heading = DAY_HEADING.search(html)
    if not heading:
        raise ValueError("Ontario calendar lacks its daily date heading")
    day = datetime.strptime(heading[1].strip(), "%B %d, %Y")
    cards = _CalendarCards(html)
    if not cards.seen_event and "There are no events today" not in html:
        raise ValueError("Ontario calendar lacks recognizable events or an explicit empty state")

    events: list[ScheduleEvent] = []
    for label in cards.house_titles:
        match = CARD_TITLE.fullmatch(label.strip())
        if not match:
            continue  # The date alone does not establish a sitting start.
        title, hour_text, minute_text, period = match.groups()
        hour = int(hour_text)
        minute = int(minute_text or "0")
        if not 1 <= hour <= 12 or minute > 59:
            raise ValueError("Ontario House sitting has an invalid clock")
        wall = day.replace(hour=hour % 12 + (12 if period.lower() == "p" else 0), minute=minute)
        if start := localize_source_time(wall, TIMEZONE):
            events.append({"start": start, "title": title.strip()})
    return build_upcoming_schedule(
        CHANNEL_IDS[0],
        events,
        now,
        source_timezone=TIMEZONE,
        confidence="official_legislature_calendar_house_event",
    )
