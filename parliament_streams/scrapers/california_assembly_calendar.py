"""Use machine-readable calendar-export parameters; never repair or infer ICS ends."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from html.parser import HTMLParser
from urllib.parse import parse_qs, urljoin, urlsplit

from .common import (
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    clean_html,
    localize_source_time,
)

CHANNEL_ID = "us-ca-assembly-live"
PAGE_URL = "https://www.assembly.ca.gov/events"
TIMEZONE = "America/Los_Angeles"
SOURCE: ScraperSource = {
    "id": "california-assembly-calendar",
    "channel_ids": [CHANNEL_ID],
    "url": PAGE_URL,
    "method": "GET",
    "notes": (
        "Reads explicit name/start/location parameters in official calendar-export links. "
        "The publisher's ICS has invalid VALUE=DATE date-times and empty UIDs; "
        "do not reinterpret that ICS, infer ends or equate meetings with linear broadcasts."
    ),
}


class _CalendarLinks(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.has_events = False
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if any("events-page" in part for part in (values.get("class") or "").split()):
            self.has_events = True
        if tag == "a" and (href := values.get("href")):
            url = urlsplit(urljoin(PAGE_URL, href))
            if (
                url.scheme == "https"
                and url.netloc == "www.assembly.ca.gov"
                and url.path == "/api/ics/generate"
            ):
                self.links.append(url.geturl())


def parse(payload: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    document = _CalendarLinks()
    document.feed(payload)
    if not document.has_events or "</html>" not in payload.casefold():
        raise ValueError("California response lacks its event-calendar surface")
    events: list[ScheduleEvent] = []
    for url in document.links:
        query = parse_qs(urlsplit(url).query, keep_blank_values=True)
        if any(
            len(query.get(key, [])) != 1 or not query[key][0].strip() for key in ("name", "start")
        ):
            raise ValueError("California calendar export lacks unique name/start fields")
        wall = datetime.strptime(query["start"][0], "%Y%m%dT%H%M%S")
        start = localize_source_time(wall, TIMEZONE)
        if start is None:
            raise ValueError("Ambiguous or nonexistent California calendar clock")
        if now <= start <= now + timedelta(days=30):
            event: ScheduleEvent = {
                "start": start,
                "title": clean_html(query["name"][0]),
                "url": PAGE_URL,
            }
            if not event["title"]:
                raise ValueError("Empty California event title")
            if len(query.get("location", [])) == 1 and query["location"][0].strip():
                event["location"] = clean_html(query["location"][0])
            events.append(event)
    return build_upcoming_schedule(
        CHANNEL_ID,
        events,
        now,
        source_timezone=TIMEZONE,
        confidence="official_calendar_export_parameters_start_only",
    )
