"""Parse only explicitly channel-1 programme rows in Bundestag's TV preview."""

from __future__ import annotations

import re
from datetime import UTC, date, datetime, timedelta
from html.parser import HTMLParser
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

CHANNEL_ID = "germany-bundestag-1"
PAGE_URL = "https://www.bundestag.de/mediathek"
TIMEZONE = "Europe/Berlin"
SOURCE: ScraperSource = {
    "id": "germany-bundestag-tv1",
    "channel_ids": [CHANNEL_ID],
    "url": PAGE_URL,
    "method": "GET",
    "notes": (
        "Official TV preview rows identify channel 1 alongside its channel-1 live player. "
        "Use the dated source clock range and verify its end against the explicit Unix end."
    ),
}
RANGE = re.compile(r"(\d{1,2}(?:[.:]\d{2})?)\s+bis\s+(\d{1,2}(?:[.:]\d{2})?)\s+Uhr")


def _clock(day: date, value: str) -> datetime:
    parts = re.split(r"[.:]", value)
    hour, minute = int(parts[0]), int(parts[1]) if len(parts) == 2 else 0
    if hour == 24 and minute == 0:
        return datetime.combine(day + timedelta(days=1), datetime.min.time())
    try:
        return datetime(day.year, day.month, day.day, hour, minute)
    except ValueError as error:
        raise ValueError("Bundestag TV programme has an invalid clock") from error


def _source_day(caption: str) -> date:
    match = re.search(r"\b(\d{2})\.(\d{2})\.(\d{4})\b", caption)
    if match is None:
        raise ValueError("Bundestag TV table lacks an explicit source date")
    try:
        return date(int(match[3]), int(match[2]), int(match[1]))
    except ValueError as error:
        raise ValueError("Bundestag TV table has an invalid source date") from error


class _ProgrammeHTML(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.has_player = False
        self.has_wrapper = False
        self.depth = 0
        self.wrapper_depths: list[int] = []
        self.complete_tables = 0
        self.in_table = False
        self.in_row = False
        self.capture: str | None = None
        self.parts: dict[str, list[str]] = {}
        self.caption = ""
        self.end_epoch = ""
        self.events: list[ScheduleEvent] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        classes = (values.get("class") or "").split()
        if tag == "div":
            self.depth += 1
        if values.get("data-playertype") == "live" and values.get("data-channelnumber") == "1":
            self.has_player = True
        if "bt-ptv-programm-wrap" in classes:
            self.has_wrapper = True
            self.wrapper_depths.append(self.depth)
        if tag == "table" and self.in_table:
            raise ValueError("Bundestag TV preview contains a nested programme table")
        if tag == "table" and "bt-ptv-programm-table" in classes:
            self.in_table = True
            self.caption = ""
        if not self.in_table:
            return
        if tag == "caption":
            self.capture = "caption"
            self.parts["caption"] = []
        if tag == "tr" and values.get("data-channelnumber") == "1":
            self.in_row = True
            self.end_epoch = values.get("data-enddate") or ""
            self.parts["title"], self.parts["time"] = [], []
        if self.in_row and ((tag == "td" and "bt-time" in classes) or tag == "h4"):
            self.capture = "time" if tag == "td" else "title"

    def handle_data(self, data: str) -> None:
        if self.capture is not None:
            self.parts[self.capture].append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "div":
            if self.wrapper_depths and self.wrapper_depths[-1] == self.depth:
                self.wrapper_depths.pop()
            self.depth -= 1
        if tag == "caption" and self.capture == "caption":
            self.caption = clean_html(" ".join(self.parts["caption"]))
            self.capture = None
        if (tag == "td" and self.capture == "time") or (tag == "h4" and self.capture == "title"):
            self.capture = None
        if tag == "tr" and self.in_row:
            self._append_event()
            self.in_row = False
        if tag == "table" and self.in_table:
            _source_day(self.caption)
            self.complete_tables += 1
            self.in_table = False

    def _append_event(self) -> None:
        clock_match = RANGE.fullmatch(clean_html(" ".join(self.parts["time"])))
        title = clean_html(" ".join(self.parts["title"]))
        if not clock_match or not title:
            raise ValueError("Bundestag TV row lacks an explicit date, title or clock range")
        day = _source_day(self.caption)
        wall_start, wall_end = (_clock(day, value) for value in clock_match.groups())
        if wall_end < wall_start:
            wall_end += timedelta(days=1)
        start = localize_source_time(wall_start, TIMEZONE)
        if start is None:
            raise ValueError("Bundestag TV start is an ambiguous or nonexistent source clock")
        if re.fullmatch(r"[1-9][0-9]{8,11}", self.end_epoch) is None:
            raise ValueError("Bundestag TV row lacks its explicit Unix end timestamp")
        try:
            end = datetime.fromtimestamp(int(self.end_epoch), UTC)
        except (OverflowError, OSError, ValueError) as error:
            raise ValueError("Bundestag TV end timestamp is out of range") from error
        if end.astimezone(ZoneInfo(TIMEZONE)).replace(tzinfo=None) != wall_end or end <= start:
            raise ValueError("Bundestag TV end timestamp disagrees with its displayed range")
        self.events.append({"start": start, "end": end, "title": title, "url": PAGE_URL})


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    if now.utcoffset() is None:
        raise ValueError("Bundestag TV collection time requires a timezone offset")
    document = _ProgrammeHTML()
    document.feed(html)
    if (
        not document.has_player
        or not document.has_wrapper
        or not document.complete_tables
        or document.wrapper_depths
        or document.in_table
        or document.in_row
    ):
        raise ValueError("Bundestag response lacks its channel-1 player and complete TV preview")
    unique: dict[tuple[datetime, str], ScheduleEvent] = {}
    for event in document.events:
        identity = event["start"], event["title"]
        if identity in unique and unique[identity] != event:
            raise ValueError("Bundestag TV preview repeats a programme with conflicting times")
        unique[identity] = event
    events = sorted(
        (event for event in unique.values() if event["end"] > now),
        key=lambda event: event["start"],
    )
    if not events:
        return {}
    current = next((event for event in events if event["start"] <= now < event["end"]), None)
    upcoming = next((event for event in events if event["start"] > now), None)
    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": local_time_label(current["start"], TIMEZONE) if current else None,
        "next_event_title": upcoming["title"] if upcoming else None,
        "next_event_time": local_time_label(upcoming["start"], TIMEZONE) if upcoming else None,
        "confidence": "official_channel_specific_tv_preview",
        "events": normalized_events(CHANNEL_ID, events, now, source_timezone=TIMEZONE),
    }
    if current:
        schedule["current_event_start"] = format_utc_timestamp(current["start"])
        schedule["current_event_url"] = PAGE_URL
    if upcoming:
        schedule["next_event_start"] = format_utc_timestamp(upcoming["start"])
        schedule["next_event_url"] = PAGE_URL
    return {CHANNEL_ID: schedule}
