"""Strict timed subset of the publisher's session-calendar iCalendar export."""

from __future__ import annotations

import re
from datetime import UTC, datetime, timedelta
from urllib.parse import urlsplit

from .common import (
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    clean_html,
    localize_source_time,
)

CHANNEL_ID = "us-ny-senate-live"
URL = "https://www.nysenate.gov/session/calendar-download"
PAGE_URL = "https://www.nysenate.gov/events"
TIMEZONE = "America/New_York"
SOURCE: ScraperSource = {
    "id": "new-york-senate-calendar",
    "channel_ids": [CHANNEL_ID],
    "url": URL,
    "method": "GET",
    "notes": (
        "Session ICS; publisher-owned views.view.session_calendar.yml confirms UID, "
        "summary, date range, location and node URL fields. Current body held by HTTP 403. "
        "Only explicit UTC or named-zone times; all-day dates are not midnight programmes."
    ),
}


def _text(value: str) -> str:
    return clean_html(re.sub(r"\\([nN,;\\])", lambda m: " " if m[1] in "nN" else m[1], value))


def _records(payload: str) -> list[dict[str, tuple[str, str]]]:
    lines = re.sub(r"\r?\n[ \t]", "", payload).strip().splitlines()
    if not lines or lines[0] != "BEGIN:VCALENDAR" or lines[-1] != "END:VCALENDAR":
        raise ValueError("Incomplete New York iCalendar document")
    stack: list[str] = []
    current: dict[str, tuple[str, str]] | None = None
    records: list[dict[str, tuple[str, str]]] = []
    version = False
    for line in lines:
        key, separator, value = line.partition(":")
        if not separator:
            raise ValueError("Invalid iCalendar property")
        name = key.split(";", 1)[0].upper()
        if name == "BEGIN":
            if value == "VCALENDAR" and stack or value == "VEVENT" and stack != ["VCALENDAR"]:
                raise ValueError("Invalid iCalendar component nesting")
            stack.append(value)
            if value == "VEVENT":
                current = {}
        elif name == "END":
            if not stack or stack.pop() != value:
                raise ValueError("Unbalanced iCalendar component")
            if value == "VEVENT":
                assert current is not None
                records.append(current)
                current = None
        elif stack == ["VCALENDAR"] and name == "VERSION":
            version = value == "2.0"
        elif stack == ["VCALENDAR", "VEVENT"] and current is not None:
            if name in {
                "UID",
                "SUMMARY",
                "DTSTART",
                "URL",
                "LOCATION",
                "STATUS",
                "RRULE",
                "RDATE",
                "RECURRENCE-ID",
            }:
                if name in current:
                    raise ValueError(f"Duplicate iCalendar {name}")
                current[name] = (key, value)
    if stack or not version:
        raise ValueError("Invalid iCalendar version or incomplete components")
    return records


def parse(payload: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    events: dict[str, ScheduleEvent] = {}
    date_only = False
    timed = False
    for row in _records(payload):
        if any(field in row for field in ("RRULE", "RDATE", "RECURRENCE-ID")):
            raise ValueError(
                "Recurring New York calendar records require a reviewed expansion contract"
            )
        if row.get("STATUS", ("", ""))[1].upper() == "CANCELLED":
            continue
        identity = row.get("UID", ("", ""))[1].strip()
        title = _text(row.get("SUMMARY", ("", ""))[1])
        key, value = row.get("DTSTART", ("", ""))
        if not identity or not title or not value:
            raise ValueError("New York session lacks UID, title or start")
        params = key.upper().split(";")[1:]
        if "VALUE=DATE" in params or re.fullmatch(r"\d{8}", value):
            datetime.strptime(value, "%Y%m%d")
            date_only = True
            continue
        start: datetime | None
        if re.fullmatch(r"\d{8}T\d{6}Z", value) and params in ([], ["VALUE=DATE-TIME"]):
            start = datetime.strptime(value, "%Y%m%dT%H%M%SZ").replace(tzinfo=UTC)
        elif params in (["TZID=AMERICA/NEW_YORK"], ["TZID=US/EASTERN"]):
            start = localize_source_time(datetime.strptime(value, "%Y%m%dT%H%M%S"), TIMEZONE)
            if start is None:
                raise ValueError("Ambiguous or nonexistent New York calendar clock")
        else:
            raise ValueError("New York calendar requires an explicit supported timezone")
        timed = True
        if not now <= start <= now + timedelta(days=60):
            continue
        event: ScheduleEvent = {
            "event_id": identity,
            "title": title,
            "start": start,
            "url": PAGE_URL,
        }
        url = row.get("URL", ("", ""))[1]
        if url:
            parsed = urlsplit(url)
            if parsed.scheme != "https" or parsed.netloc != "www.nysenate.gov":
                raise ValueError("New York event URL leaves its official publisher")
            event["url"] = url
        if location := _text(row.get("LOCATION", ("", ""))[1]):
            event["location"] = location
        if identity in events and events[identity] != event:
            raise ValueError("Conflicting New York event UID")
        events[identity] = event
    if date_only and not timed:
        raise ValueError("New York sessions have dates only; programme times remain unresolved")
    return build_upcoming_schedule(
        CHANNEL_ID,
        list(events.values()),
        now,
        source_timezone=TIMEZONE,
        confidence="official_session_ical_start_only",
    )
