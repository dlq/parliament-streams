"""Senate hearing XML contract; current endpoint access must be checked separately."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from xml.etree import ElementTree

from .common import (
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    clean_html,
    localize_source_time,
)

CHANNEL_ID = "us-senate-committee-webcasts"
URL = "https://www.senate.gov/general/committee_schedules/hearings.xml"
PAGE_URL = "https://www.senate.gov/committees/hearings_meetings.htm"
TIMEZONE = "America/New_York"
SOURCE: ScraperSource = {
    "id": "us-senate-hearings-xml",
    "channel_ids": [CHANNEL_ID],
    "url": URL,
    "method": "GET",
    "notes": (
        "Committee hearing XML. Record contract corroborated by unitedstates/congress "
        "committee_meetings.py; live payload validation held by publisher HTTP 403. "
        "Institutional starts only, not a linear webcast guide."
    ),
}


def parse(payload: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    if any(marker in payload.upper() for marker in ("<!DOCTYPE", "<!ENTITY")):
        raise ValueError("Senate XML cannot contain document types or entity declarations")
    try:
        root = ElementTree.fromstring(payload)
    except ElementTree.ParseError as exc:
        raise ValueError("Invalid Senate hearing XML") from exc
    meetings = root.findall("meeting")
    if root.tag.casefold() in {"html", "error"} or not meetings:
        raise ValueError("Senate XML lacks its hearing records or explicit empty placeholder")
    events: list[ScheduleEvent] = []
    for row in meetings:
        if row.find("cmte_code") is None:
            raise ValueError("Senate hearing lacks its committee field")
        committee = (row.findtext("cmte_code") or "").strip()
        if not committee:
            # Published no-hearings sentinel has an empty committee code.
            if any((row.findtext(field) or "").strip() for field in ("date", "matter", "room")):
                raise ValueError("Incomplete Senate hearing cannot be treated as empty")
            continue
        title = clean_html(row.findtext("matter") or "")
        if not title:
            raise ValueError("Senate hearing lacks its subject")
        wall = datetime.strptime((row.findtext("date") or "").strip(), "%d-%b-%Y %I:%M %p")
        start = localize_source_time(wall, TIMEZONE)
        if start is None:
            raise ValueError("Ambiguous or nonexistent Senate hearing clock")
        if now <= start <= now + timedelta(days=30):
            event: ScheduleEvent = {
                "start": start,
                "title": f"{committee}: {title}",
                "url": PAGE_URL,
            }
            if room := clean_html(row.findtext("room") or ""):
                event["location"] = room
            events.append(event)
    return build_upcoming_schedule(
        CHANNEL_ID,
        events,
        now,
        source_timezone=TIMEZONE,
        confidence="official_hearing_xml_start_only",
    )
