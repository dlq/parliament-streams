"""Read the Oireachtas TV channel's explicit, dated linear broadcast guide."""

from __future__ import annotations

import re
from datetime import UTC, date, datetime
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
    normalized_events,
)

CHANNEL_ID = "ireland-oireachtas-tv"
PAGE_URL = "https://www.oireachtas.ie/en/oireachtas-tv/oireachtas-tv-channel/"
TIMEZONE = "Europe/Dublin"
SOURCE: ScraperSource = {
    "id": "ireland-oireachtas-tv-guide",
    "channel_ids": [CHANNEL_ID],
    "url": PAGE_URL,
    "method": "GET",
    "notes": (
        "The Oireachtas TV channel page pairs its oirtv player with a dated linear guide. "
        "Use explicit Unix start/end instants, not committee agendas or next-start inference."
    ),
}


def _instant(value: str | None) -> datetime:
    if value is None or re.fullmatch(r"[1-9][0-9]{8,11}", value) is None:
        raise ValueError("Oireachtas TV guide requires explicit Unix timestamps")
    try:
        return datetime.fromtimestamp(int(value), UTC)
    except (OverflowError, OSError, ValueError) as error:
        raise ValueError("Oireachtas TV guide timestamp is out of range") from error


class _GuideHTML(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.guide_depth: int | None = None
        self.day_depth: int | None = None
        self.event_depth: int | None = None
        self.day: date | None = None
        self.days: set[date] = set()
        self.has_guide = False
        self.start: datetime | None = None
        self.end: datetime | None = None
        self.title_depth = 0
        self.title_parts: list[str] = []
        self.events: list[ScheduleEvent] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        classes = (values.get("class") or "").split()
        if tag == "div":
            self.depth += 1
            if values.get("id") == "guide":
                self.has_guide = True
                self.guide_depth = self.depth
            if self.guide_depth is None:
                return
            if "schedule-day" in classes and "js-day" in classes:
                day = _instant(values.get("data-day")).astimezone(ZoneInfo(TIMEZONE))
                if (day.hour, day.minute, day.second) != (0, 0, 0):
                    raise ValueError("Oireachtas TV day header is not source-local midnight")
                self.day_depth, self.day = self.depth, day.date()
                self.days.add(day.date())
            if "event" in classes:
                if self.day is None or self.event_depth is not None:
                    raise ValueError("Oireachtas TV event lacks a unique dated guide group")
                self.event_depth = self.depth
                self.start, self.end = None, None
                self.title_parts = []
            if self.event_depth is not None and "event-time" in classes:
                if self.start is not None:
                    raise ValueError("Oireachtas TV event repeats its timing fields")
                self.start = _instant(values.get("data-start-time"))
                self.end = _instant(values.get("data-end-time"))
        if tag == "strong" and self.event_depth is not None:
            self.title_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag == "strong" and self.title_depth:
            self.title_depth -= 1
        if tag != "div":
            return
        if self.event_depth == self.depth:
            title = clean_html(" ".join(self.title_parts))
            if self.start is None or self.end is None or not title:
                raise ValueError("Oireachtas TV programme lacks a title or complete time range")
            if self.end < self.start:
                raise ValueError("Oireachtas TV programme has a backwards time range")
            if self.start.astimezone(ZoneInfo(TIMEZONE)).date() != self.day:
                raise ValueError("Oireachtas TV programme disagrees with its dated guide group")
            if (
                self.events
                and self.events[-1]["start"].astimezone(ZoneInfo(TIMEZONE)).date() == self.day
                and "end" not in self.events[-1]
            ):
                raise ValueError("Oireachtas TV open-ended slot is not terminal in its guide day")
            event: ScheduleEvent = {"start": self.start, "title": title, "url": PAGE_URL}
            # The source repeats start=end for each terminal daily slot. That is
            # an unknown end, not an actual zero-length programme or a licence
            # to bridge the following day's first listing.
            if self.end > self.start:
                event["end"] = self.end
            self.events.append(event)
            self.event_depth = None
            self.title_depth = 0
        if self.day_depth == self.depth:
            self.day_depth, self.day = None, None
        if self.guide_depth == self.depth:
            self.guide_depth = None
        self.depth -= 1

    def handle_data(self, data: str) -> None:
        if self.event_depth is not None and self.title_depth:
            self.title_parts.append(data)


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    if now.utcoffset() is None:
        raise ValueError("Oireachtas TV collection time requires a timezone offset")
    document = _GuideHTML()
    document.feed(html)
    if (
        not document.has_guide
        or not document.days
        or document.guide_depth is not None
        or document.day_depth is not None
        or document.event_depth is not None
    ):
        raise ValueError("Oireachtas TV response lacks its complete dated TV guide")
    # The dated guide is explicitly paired with the linear oirtv player, not
    # the separate Dail, Seanad or committee-room streams.
    if re.search(r"InitializeLivePage\(\s*[\"\']oirtv[\"\']\s*\)", html) is None:
        raise ValueError("Oireachtas TV guide is not paired with its linear channel player")
    if max(document.days) < now.astimezone(ZoneInfo(TIMEZONE)).date():
        raise ValueError("Oireachtas TV guide contains only outdated guide dates")
    unique: dict[tuple[datetime, str], ScheduleEvent] = {}
    for event in document.events:
        identity = event["start"], event["title"]
        if identity in unique and unique[identity] != event:
            raise ValueError("Oireachtas TV guide repeats a programme with conflicting times")
        unique[identity] = event
    events = sorted(
        (event for event in unique.values() if event.get("end", event["start"]) > now),
        key=lambda event: event["start"],
    )
    if not events:
        return {}
    current = next(
        (event for event in events if event.get("end") and event["start"] <= now < event["end"]),
        None,
    )
    upcoming = next((event for event in events if event["start"] > now), None)
    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": local_time_label(current["start"], TIMEZONE) if current else None,
        "next_event_title": upcoming["title"] if upcoming else None,
        "next_event_time": local_time_label(upcoming["start"], TIMEZONE) if upcoming else None,
        "confidence": "official_dated_linear_tv_guide",
        "events": normalized_events(CHANNEL_ID, events, now, source_timezone=TIMEZONE),
    }
    if current:
        schedule["current_event_start"] = format_utc_timestamp(current["start"])
        schedule["current_event_url"] = PAGE_URL
    if upcoming:
        schedule["next_event_start"] = format_utc_timestamp(upcoming["start"])
        schedule["next_event_url"] = PAGE_URL
    return {CHANNEL_ID: schedule}
