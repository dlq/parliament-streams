"""Read dated broadcast listings from the Congress's Canal Parlamento week view."""

from __future__ import annotations

import re
import unicodedata
from datetime import UTC, date, datetime, timedelta
from html.parser import HTMLParser
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit
from zoneinfo import ZoneInfo

from .common import (
    Fetcher,
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    format_utc_timestamp,
    local_time_label,
    localize_source_time,
    normalized_events,
)

CHANNEL_ID = "spain-canal-parlamento"
PAGE_URL = "https://www.congreso.es/programacion"
TIMEZONE = ZoneInfo("Europe/Madrid")
SOURCE: ScraperSource = {
    "id": "spain-canal-parlamento-weekly",
    "channel_ids": [CHANNEL_ID],
    "url": PAGE_URL,
    "method": "GET",
    "headers": {"User-Agent": "Mozilla/5.0", "Accept": "text/html"},
    "notes": (
        "Follows the official weekly broadcast link, using its displayed date range. "
        "Unknown 'Fin Anterior' starts and last daily ends remain unresolved. "
        "The public site currently requires an ordinary browser compatibility User-Agent."
    ),
}
MONTHS = {
    name: month
    for month, names in enumerate(
        (
            ("enero", "xaneiro"),
            ("febrero", "febreiro"),
            ("marzo",),
            ("abril",),
            ("mayo", "maio"),
            ("junio", "xuno"),
            ("julio", "xullo"),
            ("agosto",),
            ("septiembre", "setembro"),
            ("octubre", "outubro"),
            ("noviembre", "novembro"),
            ("diciembre", "decembro"),
        ),
        start=1,
    )
    for name in names
}
WEEKDAYS = {
    name: index
    for index, names in enumerate(
        (
            ("lunes", "luns"),
            ("martes",),
            ("miercoles", "mercores"),
            ("jueves", "xoves"),
            ("viernes", "venres"),
            ("sabado",),
            ("domingo",),
        )
    )
    for name in names
}
WEEK_RE = re.compile(
    r"semana (?:del|do) (\d{1,2}) de (\w+) de (\d{4}) "
    r"(?:al|ao) (\d{1,2}) de (\w+) de (\d{4})"
)
TIME_RE = re.compile(r"(\d{1,2}):(\d{2})\s*h\.?", re.IGNORECASE)


def _text(value: str) -> str:
    return " ".join(value.split())


def _fold(value: str) -> str:
    return "".join(
        character
        for character in unicodedata.normalize("NFD", _text(value).casefold())
        if not unicodedata.combining(character)
    )


class _WeekHTML(HTMLParser):
    """Retain heading/table order without depending on presentation classes."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.blocks: list[tuple[str, list[str]]] = []
        self.links: list[str] = []
        self.heading: list[str] | None = None
        self.heading_tag: str | None = None
        self.cells: list[str] | None = None
        self.cell: list[str] | None = None
        self.has_week_container = False
        self.container_text: list[str] = []
        self.container_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "div":
            if self.container_depth:
                self.container_depth += 1
            elif "table-responsive" in (dict(attrs).get("class") or "").split():
                self.has_week_container, self.container_depth = True, 1
        if tag == "a" and (href := dict(attrs).get("href")):
            self.links.append(href)
        if tag in {"h2", "h3", "h4"}:
            self.heading, self.heading_tag = [], tag
        elif tag == "tr":
            self.cells = []
        elif tag in {"td", "th"} and self.cells is not None:
            self.cell = []
        elif tag == "br":
            self.handle_data(" ")

    def handle_data(self, data: str) -> None:
        if self.container_depth:
            self.container_text.append(data)
        if self.heading is not None:
            self.heading.append(data)
        if self.cell is not None:
            self.cell.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "div" and self.container_depth:
            self.container_depth -= 1
        if tag == self.heading_tag and self.heading is not None:
            self.blocks.append(("heading", [_text("".join(self.heading))]))
            self.heading, self.heading_tag = None, None
        elif tag in {"td", "th"} and self.cell is not None and self.cells is not None:
            self.cells.append(_text("".join(self.cell)))
            self.cell = None
        elif tag == "tr" and self.cells is not None:
            self.blocks.append(("row", self.cells))
            self.cells = None


def _week_start(text: str) -> date | None:
    match = WEEK_RE.fullmatch(_fold(text))
    if match is None:
        return None
    try:
        start = date(int(match[3]), MONTHS[match[2]], int(match[1]))
        stop = date(int(match[6]), MONTHS[match[5]], int(match[4]))
    except (KeyError, ValueError):
        raise ValueError("Canal Parlamento has an invalid displayed week") from None
    if start.weekday() != 0 or stop - start != timedelta(days=6):
        raise ValueError("Canal Parlamento must display a Monday-to-Sunday date range")
    return start


def _local_start(day: date, hour: int, minute: int) -> datetime | None:
    if hour == 24 and minute == 0:
        day, hour = day + timedelta(days=1), 0
    try:
        naive = datetime(day.year, day.month, day.day, hour, minute)
    except ValueError:
        return None
    # Explicit 24:00 is a source boundary; an ambiguous autumn hour or missing
    # spring hour is unresolved rather than assigned an arbitrary fold/offset.
    return localize_source_time(naive, "Europe/Madrid")


def _events(payload: str) -> list[ScheduleEvent]:
    document = _WeekHTML()
    document.feed(payload)
    if not document.has_week_container:
        raise ValueError("Canal Parlamento weekly programme container is missing")
    if not any(
        "programacion" in _fold(values[0]) and "canal parlamento" in _fold(values[0])
        for kind, values in document.blocks
        if kind == "heading"
    ):
        raise ValueError("Canal Parlamento broadcast schedule heading is missing")
    week: date | None = None
    day: date | None = None
    previous: ScheduleEvent | None = None
    latest_start: datetime | None = None
    unresolved_rollover = False
    events: list[ScheduleEvent] = []
    for kind, values in document.blocks:
        if kind == "heading":
            if (start := _week_start(values[0])) is not None:
                week, day, previous = start, None, None
            elif week is not None and (weekday := WEEKDAYS.get(_fold(values[0]))) is not None:
                day, previous = week + timedelta(days=weekday), None
                latest_start, unresolved_rollover = None, False
        elif week is not None and day is not None and kind == "row" and values:
            clock = TIME_RE.fullmatch(values[0])
            if clock is None:
                # 'Fin Anterior' is an unknown start, not the following timed
                # programme's start or a reliable end for the preceding one.
                previous = None
                continue
            instant = _local_start(day, int(clock[1]), int(clock[2]))
            title = _text(" ".join(values[1:]))
            if instant is None or not title:
                previous = None
                continue
            if unresolved_rollover or (latest_start is not None and instant < latest_start):
                # A broadcast-day rollover is not proven by a bare decreasing
                # clock. Require explicit 24:00 or a fresh dated weekday instead.
                previous, unresolved_rollover = None, True
                continue
            event: ScheduleEvent = {"start": instant, "title": title, "url": PAGE_URL}
            if previous is not None and previous["start"] < instant:
                previous["end"], previous["end_basis"] = instant, "next_listing_start"
            events.append(event)
            previous = event
            latest_start = instant
    if week is None:
        raise ValueError("Canal Parlamento weekly view has no explicit dated week")
    # A recognized dated week with no rows is a genuine empty response. Timed
    # rows without weekday context indicate markup drift and must not look empty.
    if not events and (
        TIME_RE.search(" ".join(document.container_text))
        or any(
            kind == "row" and values and _fold(values[0]) in {"fin anterior", "final anterior"}
            for kind, values in document.blocks
        )
    ):
        raise ValueError("Canal Parlamento programme rows have no usable time/date context")
    return events


def parse(*payloads: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    events = sorted(
        (event for payload in payloads for event in _events(payload)),
        key=lambda event: event["start"],
    )
    current = next(
        (event for event in events if event.get("end") and event["start"] <= now < event["end"]),
        None,
    )
    upcoming = next((event for event in events if event["start"] > now), None)
    if current is None and upcoming is None:
        return {}
    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": "Live now" if current else None,
        "next_event_title": upcoming["title"] if upcoming else None,
        "next_event_time": local_time_label(upcoming["start"], "Europe/Madrid")
        if upcoming
        else None,
        "confidence": "official_broadcast_schedule",
        "events": normalized_events(CHANNEL_ID, events, now, source_timezone="Europe/Madrid"),
    }
    if current:
        schedule["current_event_start"] = format_utc_timestamp(current["start"])
    if upcoming:
        schedule["next_event_start"] = format_utc_timestamp(upcoming["start"])
    return {CHANNEL_ID: schedule}


def collect(
    fetcher: Fetcher, now: datetime, timeout: int, retries: int
) -> tuple[ParsedSchedule, list[str]]:
    headers = dict(SOURCE.get("headers", {}))
    homepage = fetcher({"url": PAGE_URL, "method": "GET", "headers": headers}, timeout, retries)
    document = _WeekHTML()
    document.feed(homepage)
    weekly_url: str | None = None
    for href in document.links:
        parsed = urlsplit(urljoin(PAGE_URL, href))
        query = parse_qsl(parsed.query)
        if (
            parsed.scheme == "https"
            and parsed.hostname == "www.congreso.es"
            and parsed.port in {None, 443}
            and parsed.username is None
            and parsed.path in {"/programacion", "/es/programacion", "/gl/programacion"}
            and any(
                key.endswith("_mvcPath") and value == "/view_semanal.jsp" for key, value in query
            )
            and any(key.endswith("_fechaSeleccionada") for key, _value in query)
        ):
            selected = now.astimezone(TIMEZONE).date().isoformat()
            query = [
                (key, selected if key.endswith("_fechaSeleccionada") else value)
                for key, value in query
            ]
            weekly_url = urlunsplit(
                (parsed.scheme, parsed.netloc, parsed.path, urlencode(query), "")
            )
            break
    if weekly_url is None:
        raise ValueError("Canal Parlamento official weekly broadcast link is missing")
    weekly = fetcher({"url": weekly_url, "method": "GET", "headers": headers}, timeout, retries)
    document = _WeekHTML()
    document.feed(weekly)
    local_day = now.astimezone(TIMEZONE).date()
    displayed_weeks = [
        start
        for kind, values in document.blocks
        if kind == "heading" and (start := _week_start(values[0])) is not None
    ]
    if len(displayed_weeks) != 1 or not displayed_weeks[0] <= local_day <= displayed_weeks[
        0
    ] + timedelta(days=6):
        raise ValueError("Canal Parlamento returned a different week from the requested date")
    return parse(weekly, now=now), [PAGE_URL, weekly_url]
