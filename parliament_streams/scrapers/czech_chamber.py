"""Extract only Chamber sittings from the Czech Parliament's dated weekly plan."""

from __future__ import annotations

import re
import unicodedata
from datetime import UTC, date, datetime, timedelta
from urllib.parse import urljoin, urlsplit
from zoneinfo import ZoneInfo

from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    clean_html,
    localize_source_time,
)

CHANNEL_ID = "czech-chamber-of-deputies"
PAGE_URL = "https://www.psp.cz/sqw/hp.sqw?k=203"
TIMEZONE = "Europe/Prague"
SOURCE: ScraperSource = {
    "id": "czech-chamber-plenary",
    "channel_ids": [CHANNEL_ID],
    "url": PAGE_URL,
    "method": "GET",
    "notes": (
        "Only dated schuze Poslanecke snemovny blocks with official sitting links map to Stream1. "
        "Committee/social events are excluded; source supplies starts, with no invented ends."
    ),
}
MONTHS = {
    name: index
    for index, name in enumerate(
        (
            "ledna",
            "unora",
            "brezna",
            "dubna",
            "kvetna",
            "cervna",
            "cervence",
            "srpna",
            "zari",
            "rijna",
            "listopadu",
            "prosince",
        ),
        start=1,
    )
}
WEEKDAYS = {
    name: index
    for index, name in enumerate(
        ("pondeli", "utery", "streda", "ctvrtek", "patek", "sobota", "nedele")
    )
}
BLOCKS = re.compile(
    r"<h2\b[^>]*>(?P<day>.*?)</h2>|<table\b[^>]*>(?P<sitting>.*?)</table>", re.I | re.S
)


def _fold(value: str) -> str:
    return "".join(
        character
        for character in unicodedata.normalize("NFD", value.casefold())
        if not unicodedata.combining(character)
    )


def request_specs(now: datetime) -> list[FetchRequest]:
    today = now.astimezone(ZoneInfo(TIMEZONE)).date()
    requests: list[FetchRequest] = []
    for offset in (0, 7):
        year, week, _weekday = (today + timedelta(days=offset)).isocalendar()
        requests.append(
            {
                "url": f"https://www.psp.cz/sqw/hp.sqw?k=202&r={year}&c={week}",
                "method": "GET",
                "headers": {"Accept": "text/html"},
            }
        )
    return requests


def _events(payload: str, week_start: date) -> list[ScheduleEvent]:
    content = re.search(
        r'<div\b[^>]*id=["\']main-content["\'][^>]*>(.*?)<!--/ Main content -->',
        payload,
        re.I | re.S,
    )
    if content is None:
        raise ValueError("Czech weekly plan main content is missing")
    html = content[1]
    title = re.search(r"<h1\b[^>]*>(.*?)</h1>", html, re.I | re.S)
    if title is None or not _fold(clean_html(title[1])).startswith(
        "plan akci poslanecke snemovny v tydnu od "
    ):
        raise ValueError("Czech dated weekly plan heading is missing")
    day: date | None = None
    dated_days: set[date] = set()
    events: list[ScheduleEvent] = []
    for match in BLOCKS.finditer(html):
        if match["day"] is not None:
            heading = re.fullmatch(
                r"(\w+) (\d{1,2})\.\s*(\w+)\s+(\d{4})", _fold(clean_html(match["day"]))
            )
            if heading is None or heading[1] not in WEEKDAYS or heading[3] not in MONTHS:
                day = None
                continue
            try:
                day = date(int(heading[4]), MONTHS[heading[3]], int(heading[2]))
            except ValueError:
                raise ValueError("Czech weekly plan has an invalid source day") from None
            if day.weekday() != WEEKDAYS[heading[1]]:
                raise ValueError("Czech weekly plan weekday conflicts with its explicit date")
            if not week_start <= day <= week_start + timedelta(days=6):
                raise ValueError("Czech weekly plan returned a different week from the request")
            dated_days.add(day)
            continue
        table = match["sitting"] or ""
        text = clean_html(re.sub(r"</(?:p|td|div|b)\s*>", " ", table, flags=re.I))
        heading = re.search(r"<b\b[^>]*>(.*?)</b>", table, re.I | re.S)
        if heading is None or not re.match(
            r"\d+\.\s*schuze poslanecke snemovny\b", _fold(clean_html(heading[1]))
        ):
            continue
        links = re.findall(r'href=["\']([^"\']+)["\']', table, re.I)
        sitting_url = next(
            (
                urljoin(PAGE_URL, href)
                for href in links
                if (
                    (parsed := urlsplit(urljoin(PAGE_URL, href))).scheme == "https"
                    and parsed.hostname == "www.psp.cz"
                    and parsed.username is None
                    and re.fullmatch(r"/schuze/\d+/\d+", parsed.path)
                )
            ),
            None,
        )
        if sitting_url is None:
            continue
        if day is None:
            raise ValueError("Czech Chamber sitting has no explicit source day")
        if re.search(r"\bzrusen\w*\b", _fold(text)):
            continue
        clock = re.search(r"\bod (\d{1,2})[.:](\d{2})\s+hod", _fold(text))
        if clock is None:
            raise ValueError("Czech Chamber sitting has no unambiguous source start")
        try:
            naive = datetime(day.year, day.month, day.day, int(clock[1]), int(clock[2]))
        except ValueError:
            raise ValueError("Czech Chamber sitting has an invalid source clock") from None
        start = localize_source_time(naive, TIMEZONE)
        if start is None:
            raise ValueError("Czech Chamber local sitting time is ambiguous or nonexistent")
        events.append(
            {
                "start": start,
                "title": clean_html(heading[1]),
                "url": sitting_url,
                "location": "Chamber of Deputies",
                "language": "cs",
            }
        )
    if not dated_days:
        raise ValueError("Czech weekly plan has no explicit dated weekday headings")
    return events


def parse(*payloads: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    today = now.astimezone(ZoneInfo(TIMEZONE)).date()
    monday = today - timedelta(days=today.weekday())
    events = [
        event
        for index, payload in enumerate(payloads)
        for event in _events(payload, monday + timedelta(days=7 * index))
    ]
    return build_upcoming_schedule(
        CHANNEL_ID,
        events,
        now,
        source_timezone=TIMEZONE,
        confidence="official_plenary_schedule",
    )
