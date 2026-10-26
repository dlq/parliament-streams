"""Read explicit chamber starts from the Riksdag's documented calendar XML."""

from __future__ import annotations

import re
from datetime import UTC, datetime, timedelta
from xml.etree import ElementTree
from zoneinfo import ZoneInfo

from .common import (
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    clean_html,
    localize_source_time,
)

CHANNEL_ID = "sweden-riksdag-webb-tv"
TIMEZONE = "Europe/Stockholm"
API_URL = "https://data.riksdagen.se/kalender/?org=kamm&utformat=xml"
PAGE_URL = "https://www.riksdagen.se/sv/aktuellt/kalendersida/"
HORIZON_DAYS = 30
SOURCE: ScraperSource = {
    "id": "sweden-riksdag-calendar",
    "channel_ids": [CHANNEL_ID],
    "url": API_URL,
    "method": "GET",
    "headers": {"Accept": "application/xml, text/xml"},
    "notes": (
        "Documented chamber calendar with official UIDs. Clocks are Sweden local time, "
        "corroborated against the official webcast's UTC timestamp. Conditional/unknown "
        "starts and placeholder one-hour ends do not establish broadcast programme ranges."
    ),
}


def parse(payload: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    if now.utcoffset() is None:
        raise ValueError("Riksdag collection time requires a timezone offset")
    if "<!DOCTYPE" in payload.upper() or "<!ENTITY" in payload.upper():
        raise ValueError("Riksdag calendar must not declare XML entities")
    try:
        root = ElementTree.fromstring(payload)
    except ElementTree.ParseError:
        raise ValueError("Riksdag calendar is not complete XML") from None
    if (
        root.tag != "kalenderlista"
        or root.get("antal") != str(len(root))
        or any(row.tag != "kalender" for row in root)
    ):
        raise ValueError("Riksdag calendar lacks its event-list/count contract")
    events: dict[str, ScheduleEvent] = {}
    for row in root:
        for key in ("UID", "DTSTART", "SUMMARY", "LOCATION", "CATEGORIES", "XRDDTSTARTSTATUS"):
            if len(row.findall(key)) != 1:
                raise ValueError("Riksdag event lacks a unique identity, start or status field")
        if "kamm" not in (row.findtext("CATEGORIES") or "").split(","):
            raise ValueError("Riksdag chamber calendar contains another institutional organ")
        if row.findtext("LOCATION") != "Kammaren":
            continue
        # Nonempty statuses include 'Ingen starttid' and 'Efter debattens slut'.
        # Their accompanying numeric values are ordering aids, not start clocks.
        if (row.findtext("XRDDTSTARTSTATUS") or "").strip():
            continue
        value = row.findtext("DTSTART") or ""
        if re.fullmatch(r"\d{8}T\d{6}", value) is None:
            raise ValueError("Riksdag calendar requires an explicit local date and clock")
        wall = datetime.strptime(value, "%Y%m%dT%H%M%S")
        if (
            not now.astimezone(ZoneInfo(TIMEZONE)).date()
            <= wall.date()
            <= (now.astimezone(ZoneInfo(TIMEZONE)).date() + timedelta(days=HORIZON_DAYS))
        ):
            continue
        start = localize_source_time(wall, TIMEZONE)
        if start is None:
            raise ValueError("Riksdag calendar has an ambiguous or nonexistent source clock")
        if start < now:
            continue
        event_id = row.findtext("UID") or ""
        title = clean_html(row.findtext("SUMMARY") or "")
        if not re.fullmatch(r"RD[A-Za-z0-9]+", event_id) or not title:
            raise ValueError("Riksdag event lacks its official UID or title")
        if "inställt" in title.casefold():
            continue
        event: ScheduleEvent = {
            "event_id": event_id,
            "start": start,
            "title": title,
            "url": PAGE_URL,
            "location": "Kammaren",
            "language": "sv",
        }
        if event_id in events and events[event_id] != event:
            raise ValueError("Riksdag calendar repeats a conflicting event UID")
        events[event_id] = event
    return build_upcoming_schedule(
        CHANNEL_ID,
        list(events.values()),
        now,
        source_timezone=TIMEZONE,
        confidence="official_chamber_calendar_explicit_starts_only",
    )
