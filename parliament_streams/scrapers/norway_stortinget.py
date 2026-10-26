"""Read Stortinget's official plenary and hearing calendars without template ends."""

from __future__ import annotations

import re
from datetime import UTC, datetime, timedelta
from urllib.parse import urlsplit
from uuid import UUID

from .common import (
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    clean_html,
)

CHANNEL_ID = "norway-stortinget"
TIMEZONE = "Europe/Oslo"
MEETINGS_URL = "https://www.stortinget.no/api/kalender/geticalmeetings?languageCode=no"
HEARINGS_URL = "https://www.stortinget.no/api/kalender/geticalhearings?languageCode=no"
CALENDAR_URL = "https://www.stortinget.no/no/Hva-skjer-pa-Stortinget/Moteprogram/?w=0&yw=all"
HEARINGS_PAGE = "https://www.stortinget.no/no/Hva-skjer-pa-Stortinget/Horing/"
HORIZON_DAYS = 30
SOURCE: ScraperSource = {
    "id": "norway-stortinget-calendar",
    "channel_ids": [CHANNEL_ID],
    "urls": [MEETINGS_URL, HEARINGS_URL],
    "method": "GET",
    "headers": {"Accept": "text/calendar"},
    "notes": (
        "Official subscription feeds with explicit UTC starts and UUIDs. Include plenaries "
        "and named public hearing rooms, excluding written submissions. Calendar end fields "
        "use 15-minute placeholders and do not establish programme ends or linear-feed mapping."
    ),
}
ROOMS = {"Høringssal 1", "Høringssal 2", "Høringssal N-202"}


def _events(payload: str, name: str, now: datetime) -> list[ScheduleEvent]:
    # Read only this publisher's observed UTC calendar contract, not arbitrary
    # iCalendar timezone rules or floating/all-day timestamps.
    text = re.sub(r"\n[ \t]", "", payload.replace("\r\n", "\n")).strip()
    if (
        not text.startswith("BEGIN:VCALENDAR\n")
        or not text.endswith("\nEND:VCALENDAR")
        or re.search(r"(?m)^PRODID:\s*-//STORTINGET//ICAL//NO$", text) is None
        or f"\nX-WR-CALNAME:{name}\n" not in text
    ):
        raise ValueError("Stortinget response lacks its recognized calendar identity")
    blocks = re.findall(r"(?m)^BEGIN:VEVENT\n(.*?)^END:VEVENT$", text, re.S)
    if text.count("BEGIN:VEVENT") != len(blocks) or text.count("END:VEVENT") != len(blocks):
        raise ValueError("Stortinget calendar contains an incomplete event")
    events: list[ScheduleEvent] = []
    identities: dict[str, ScheduleEvent] = {}
    for block in blocks:
        fields: dict[str, str] = {}
        for key in ("DTSTART", "UID", "SUMMARY", "LOCATION", "URL", "STATUS"):
            values = re.findall(rf"(?m)^{key}:([^\n]*)$", block)
            if len(values) > 1:
                raise ValueError("Stortinget event repeats an identity or timing field")
            fields[key] = values[0].strip() if values else ""
        if re.fullmatch(r"\d{8}T\d{6}Z", fields["DTSTART"]) is None:
            raise ValueError("Stortinget calendar requires explicit UTC event starts")
        start = datetime.strptime(fields["DTSTART"], "%Y%m%dT%H%M%SZ").replace(tzinfo=UTC)
        if not now <= start < now + timedelta(days=HORIZON_DAYS):
            continue
        if fields["STATUS"] == "CANCELLED":
            continue
        if name == "Høringer" and fields["LOCATION"] not in ROOMS:
            continue
        try:
            UUID(fields["UID"])
        except ValueError:
            raise ValueError("Stortinget upcoming event lacks its official UUID") from None
        title = clean_html(fields["SUMMARY"])
        if not title or (name == "Storting" and title != "Storting"):
            raise ValueError("Stortinget calendar has an unrecognized meeting identity")
        event: ScheduleEvent = {
            "start": start,
            "title": title,
            "event_id": fields["UID"],
            "location": fields["LOCATION"] or "Stortingssalen",
            "language": "no",
            "url": CALENDAR_URL if name == "Storting" else HEARINGS_PAGE,
        }
        if fields["URL"]:
            url = urlsplit(fields["URL"])
            if (
                url.scheme != "https"
                or url.netloc != "www.stortinget.no"
                or not url.path.startswith("/no/Hva-skjer-pa-Stortinget/")
            ):
                raise ValueError("Stortinget calendar has an unexpected event link")
            event["url"] = fields["URL"]
        # DTEND is intentionally unused: both feeds publish 15-minute markers
        # even where the description explicitly says the meeting lasts longer.
        if fields["UID"] in identities and identities[fields["UID"]] != event:
            raise ValueError("Stortinget calendar repeats a conflicting event UUID")
        identities[fields["UID"]] = event
    events.extend(identities.values())
    return events


def parse(meetings: str, hearings: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    if now.utcoffset() is None:
        raise ValueError("Stortinget collection time requires a timezone offset")
    events = _events(meetings, "Storting", now) + _events(hearings, "Høringer", now)
    if len({event["event_id"] for event in events}) != len(events):
        raise ValueError("Stortinget calendars repeat an event UUID across feeds")
    return build_upcoming_schedule(
        CHANNEL_ID,
        events,
        now,
        source_timezone=TIMEZONE,
        confidence="official_plenary_and_public_room_calendars_start_only",
    )
