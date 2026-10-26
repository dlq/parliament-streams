"""Read the Knesset Channel's dated linear broadcast guide."""

from __future__ import annotations

import re
from collections import defaultdict
from datetime import UTC, date, datetime, timedelta
from html.parser import HTMLParser
from typing import TypedDict
from urllib.parse import quote
from zoneinfo import ZoneInfo

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

CHANNEL_ID = "israel-knesset-channel"
TIMEZONE = "Asia/Jerusalem"
PAGE_URL = "https://www.knesset.tv/" + quote("עכשיו-מנגן-בערוץ") + "/"
SOURCE: ScraperSource = {
    "id": "knesset-tv-guide",
    "channel_ids": [CHANNEL_ID],
    "url": PAGE_URL,
    "method": "GET",
    "notes": "Channel 99 linear guide with official IDs, broadcast dates and clock ranges.",
}
CLOCK = re.compile(r"(\d{1,2}):(\d{2})")


class Programme(TypedDict):
    id: str
    title: str
    broadcast_date: str
    time_range: str


class _GuideHTML(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.dates: set[date] = set()
        self.programmes: dict[str, Programme] = {}
        self.has_table = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        classes = (values.get("class") or "").split()
        if tag == "table" and "broadcasts-table" in classes:
            self.has_table = True
        if "day-div" in classes and (day := values.get("data-date")):
            self.dates.add(date.fromisoformat(day))
        if tag != "img" or "data-rowrid" not in values:
            return
        keys = ("data-rowrid", "data-programdate", "data-programtime", "data-programname")
        if any(not values.get(key) for key in keys):
            raise ValueError("Knesset guide programme fields are missing")
        row: Programme = {
            "id": str(values["data-rowrid"]).strip(),
            "title": clean_html(str(values["data-programname"])),
            "broadcast_date": str(values["data-programdate"]).strip(),
            "time_range": str(values["data-programtime"]).strip(),
        }
        previous = self.programmes.get(row["id"])
        if previous is not None and previous != row:
            raise ValueError("Knesset guide repeats one programme ID with conflicting metadata")
        self.programmes[row["id"]] = row


def _clock(day: date, text: str) -> datetime | None:
    match = CLOCK.fullmatch(text.strip())
    if match is None:
        return None
    hour, minute = map(int, match.groups())
    if hour == 24 and minute == 0:
        day, hour = day + timedelta(days=1), 0
    try:
        return datetime(day.year, day.month, day.day, hour, minute)
    except ValueError:
        return None


def _day_events(day: date, rows: list[Programme]) -> list[ScheduleEvent]:
    """Advance a broadcast day only through an explicitly connected midnight range."""
    calendar_day = day
    previous_start: datetime | None = None
    previous_end: datetime | None = None
    events: list[ScheduleEvent] = []
    for row in rows:
        parts = row["time_range"].split("-")
        if len(parts) != 2 or (wall_start := _clock(calendar_day, parts[0])) is None:
            raise ValueError("Knesset guide programme has no recognizable start clock")
        if previous_start is not None and wall_start < previous_start:
            advanced = wall_start + timedelta(days=1)
            # E.g. Monday 23:00–00:00 followed by 00:00–01:00 is Tuesday.
            # A bare clock rollback without that explicit boundary stays a hold.
            if previous_end != advanced or advanced.date() != calendar_day + timedelta(days=1):
                raise ValueError("Knesset broadcast-day rollover lacks an explicit time boundary")
            calendar_day = advanced.date()
            wall_start = advanced
        wall_end = _clock(calendar_day, parts[1])
        if wall_end is not None and wall_end < wall_start:
            wall_end += timedelta(days=1)
        start = localize_source_time(wall_start, TIMEZONE)
        end = localize_source_time(wall_end, TIMEZONE) if wall_end is not None else None
        previous_start, previous_end = wall_start, wall_end
        if start is None or not row["title"]:
            continue
        event: ScheduleEvent = {
            "start": start,
            "title": row["title"],
            "event_id": row["id"],
            "url": PAGE_URL + "#broadcasts-div-" + quote(row["id"], safe=""),
        }
        if end is not None and end > start:
            event["end"] = end
        events.append(event)
    return events


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    today = now.astimezone(ZoneInfo(TIMEZONE)).date()
    document = _GuideHTML()
    document.feed(html)
    if not document.has_table or today not in document.dates:
        raise ValueError("Knesset guide is missing its current dated broadcast table")
    grouped: dict[date, list[Programme]] = defaultdict(list)
    for row in document.programmes.values():
        day = datetime.strptime(row["broadcast_date"], "%d/%m/%Y %H:%M:%S").date()
        if day not in document.dates:
            raise ValueError("Knesset programme date is absent from its guide calendar")
        if today - timedelta(days=1) <= day <= today + timedelta(days=6):
            grouped[day].append(row)
    events = sorted(
        (event for day, rows in grouped.items() for event in _day_events(day, rows)),
        key=lambda event: event["start"],
    )
    events = [
        event
        for event in events
        if event.get("end", event["start"]).astimezone(ZoneInfo(TIMEZONE)).date() >= today
    ]
    if not events:
        return {}
    current = next(
        (event for event in events if event.get("end") and event["start"] <= now < event["end"]),
        None,
    )
    upcoming = next((event for event in events if event["start"] > now), None)
    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": "Live now" if current else None,
        "next_event_title": upcoming["title"] if upcoming else None,
        "next_event_time": local_time_label(upcoming["start"], TIMEZONE) if upcoming else None,
        "confidence": "official_linear_channel_programme",
        "events": normalized_events(CHANNEL_ID, events, now, source_timezone=TIMEZONE),
    }
    if current:
        schedule["current_event_start"] = format_utc_timestamp(current["start"])
    if upcoming:
        schedule["next_event_start"] = format_utc_timestamp(upcoming["start"])
    return {CHANNEL_ID: schedule}
