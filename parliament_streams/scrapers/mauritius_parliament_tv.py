"""Read dated events from Mauritius Parliament TV's official guide.

This service publishes individual chamber broadcasts, not a continuous linear
programme grid. The guide supplies starts only; event-page end clocks are not
used because the sampled future event has contradictory same-day bounds.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import UTC, datetime
from html.parser import HTMLParser
from urllib.parse import urlsplit
from uuid import UUID

from .common import (
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    clean_html,
    format_utc_timestamp,
    local_time_label,
    localize_source_time,
    normalized_events,
)

CHANNEL_ID = "mauritius-national-assembly-parliament-tv"
GUIDE_URL = "https://parliamenttv.govmu.org/Guide"
SOURCE_TIMEZONE = "Indian/Mauritius"
SOURCE: ScraperSource = {
    "id": "mauritius-parliament-tv-guide",
    "channel_ids": [CHANNEL_ID],
    "url": GUIDE_URL,
    "method": "GET",
    "notes": (
        "Official dated Parliament TV event guide, with stable event IDs and Mauritius starts. "
        "An event directory, not a linear TV grid. Programme ends remain unknown."
    ),
}
MONTHS = {
    name: number
    for number, name in enumerate(
        (
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ),
        1,
    )
}
WEEKDAYS = ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
VOID_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}
DATE_TEXT = re.compile(
    r"([A-Za-z]+)\s+(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)"
)
EVENT_PATH = re.compile(r"/event/index/([^/]+)/?", re.IGNORECASE)


@dataclass
class _GuideItem:
    event_id: str = ""
    date_text: str = ""
    title: str = ""
    subtitle: str = ""
    empty_text: str = ""


class _GuideHTML(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[str] = []
        self.items: list[_GuideItem] = []
        self.panes = 0
        self.pane_depth = 0
        self.pane_items = 0
        self.unrecognized_pane = False
        self.has_event_list = False
        self.item: _GuideItem | None = None
        self.item_depth = 0
        self.field = ""
        self.field_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        classes = (values.get("class") or "").split()
        if tag not in VOID_TAGS:
            self.stack.append(tag)
        depth = len(self.stack)
        if tag == "div" and {"tabs__content", "list"}.issubset(classes):
            self.has_event_list = True
        if tag == "div" and "tabs__pane" in classes:
            if self.pane_depth:
                raise ValueError("Mauritius guide contains nested day panels")
            self.panes += 1
            self.pane_depth, self.pane_items = depth, 0
        if tag == "div" and {"tabs__item", "list__item"}.issubset(classes):
            if self.item is not None or not self.pane_depth:
                raise ValueError("Mauritius guide event card is outside a recognized day panel")
            self.item, self.item_depth = _GuideItem(), depth
            self.pane_items += 1
        if self.item is None:
            return
        if tag == "a" and (href := values.get("href")):
            parsed = urlsplit(href)
            if match := EVENT_PATH.fullmatch(parsed.path):
                if parsed.scheme not in {"", "https"} or parsed.netloc not in {
                    "",
                    "parliamenttv.govmu.org",
                }:
                    raise ValueError("Mauritius guide event URL has an unexpected origin")
                try:
                    event_id = str(UUID(match.group(1)))
                except ValueError as error:
                    raise ValueError("Mauritius guide event ID is not a UUID") from error
                if self.item.event_id and self.item.event_id != event_id:
                    raise ValueError("Mauritius guide card contains conflicting event links")
                self.item.event_id = event_id
        field = ""
        if tag == "span" and "list__item__date" in classes:
            field = "date_text"
        elif tag == "h2":
            field = "title"
        elif tag == "h3":
            field = "empty_text" if "noEvents" in classes else "subtitle"
        if field:
            self.field, self.field_depth = field, depth

    def handle_data(self, data: str) -> None:
        if self.item is not None and self.field:
            setattr(self.item, self.field, getattr(self.item, self.field) + data)

    def handle_endtag(self, tag: str) -> None:
        if tag in VOID_TAGS or tag not in self.stack:
            return
        depth = len(self.stack) - self.stack[::-1].index(tag)
        if self.field and depth <= self.field_depth:
            self.field = ""
        if self.item is not None and depth <= self.item_depth:
            self.items.append(self.item)
            self.item = None
        if self.pane_depth and depth <= self.pane_depth:
            self.unrecognized_pane |= self.pane_items == 0
            self.pane_depth = 0
        del self.stack[depth - 1 :]


def _start(value: str) -> datetime:
    match = DATE_TEXT.fullmatch(clean_html(value))
    if match is None:
        raise ValueError("Mauritius guide event has no explicit English date and start clock")
    weekday, day, month, year, hour, minute, meridian = match.groups()
    clock_hour, clock_minute = int(hour), int(minute)
    if month not in MONTHS or not 1 <= clock_hour <= 12 or clock_minute > 59:
        raise ValueError("Mauritius guide event has an invalid date or clock")
    clock_hour = clock_hour % 12 + (12 if meridian == "PM" else 0)
    wall = datetime(int(year), MONTHS[month], int(day), clock_hour, clock_minute)
    if WEEKDAYS[wall.weekday()] != weekday:
        raise ValueError("Mauritius guide weekday conflicts with its published calendar date")
    start = localize_source_time(wall, SOURCE_TIMEZONE)
    if start is None:
        raise ValueError("Mauritius guide start is ambiguous in the source timezone")
    return start


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    if now.tzinfo is None or now.utcoffset() is None:
        raise ValueError("Mauritius guide collection time requires an explicit timezone")
    document = _GuideHTML()
    document.feed(html)
    document.close()
    if (
        not document.has_event_list
        or not document.panes
        or document.item is not None
        or document.pane_depth
        or document.unrecognized_pane
    ):
        raise ValueError("Mauritius guide is missing its rendered event directory")
    if not document.items:
        raise ValueError("Mauritius guide has neither dated events nor explicit empty cards")
    by_id: dict[str, ScheduleEvent] = {}
    for item in document.items:
        if item.empty_text:
            if clean_html(item.empty_text) != "No events found." or any(
                (item.event_id, item.date_text, item.title, item.subtitle)
            ):
                raise ValueError("Mauritius guide empty card does not match the published contract")
            continue
        title, subtitle = clean_html(item.title), clean_html(item.subtitle)
        if not title or not item.event_id or not item.date_text:
            raise ValueError("Mauritius guide event is missing its title, dated start or identity")
        if subtitle and subtitle.casefold() != title.casefold():
            title = f"{title}: {subtitle}"
        event: ScheduleEvent = {
            "title": title,
            "event_id": item.event_id,
            "start": _start(item.date_text),
            "url": f"https://parliamenttv.govmu.org/Event/Index/{item.event_id}",
        }
        if (previous := by_id.get(item.event_id)) and previous != event:
            raise ValueError("Mauritius guide repeats one event ID with conflicting metadata")
        by_id[item.event_id] = event
    events = sorted(by_id.values(), key=lambda event: event["start"])
    if not events:
        return {}
    upcoming = next((event for event in events if event["start"] >= now), None)
    schedule: ScheduleMetadata = {
        "current_event_title": None,
        "current_event_time": None,
        "next_event_title": upcoming["title"] if upcoming else None,
        "next_event_time": local_time_label(upcoming["start"], SOURCE_TIMEZONE)
        if upcoming
        else None,
        "confidence": "official_dated_event_guide_start_only",
        "events": normalized_events(CHANNEL_ID, events, now, source_timezone=SOURCE_TIMEZONE),
    }
    if upcoming:
        schedule["next_event_start"] = format_utc_timestamp(upcoming["start"])
        schedule["next_event_url"] = upcoming["url"]
        schedule["next_event_id"] = upcoming["event_id"]
    return {CHANNEL_ID: schedule}
