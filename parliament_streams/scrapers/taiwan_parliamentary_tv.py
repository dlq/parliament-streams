"""Dated two-channel programme listings from Taiwan's official TV portal."""

from __future__ import annotations

import json
import re
from datetime import UTC, datetime, timedelta
from urllib.parse import urlencode
from zoneinfo import ZoneInfo

from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    localize_source_time,
)

CHANNEL_ID = "taiwan-parliamentary-tv"
SOURCE_TIMEZONE = "Asia/Taipei"
API_URL = "https://www.parliamentarytv.org.tw/api/get_program.php"
FEEDS = {"ly1": "國會頻道１", "ly2": "國會頻道２"}
WINDOW_DAYS = 3
SOURCE: ScraperSource = {
    "id": "taiwan-parliamentary-tv-programmes",
    "channel_ids": [CHANNEL_ID],
    "url": API_URL,
    "method": "GET",
    "notes": (
        "The official portal's dated programme API for both published TV channels. "
        "Request dates and clocks use Asia/Taipei. Feed labels remain separate; "
        "the aggregate catalogue record is not a single linear XMLTV channel. "
        "The API supplies starts only; programme ends are not inferred."
    ),
}


def request_specs(now: datetime) -> list[FetchRequest]:
    today = now.astimezone(ZoneInfo(SOURCE_TIMEZONE)).date()
    return [
        {
            "url": API_URL
            + "?"
            + urlencode({"ch": feed, "date": (today + timedelta(days=day)).strftime("%Y/%m/%d")}),
            "method": "GET",
            "headers": {},
        }
        for day in range(WINDOW_DAYS)
        for feed in FEEDS
    ]


def parse(*payloads: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    today = now.astimezone(ZoneInfo(SOURCE_TIMEZONE)).date()
    if len(payloads) != WINDOW_DAYS * len(FEEDS):
        raise ValueError("Incomplete Taiwan programme response window")
    events: dict[tuple[str, datetime], ScheduleEvent] = {}
    for index, payload in enumerate(payloads):
        day = today + timedelta(days=index // len(FEEDS))
        feed = list(FEEDS)[index % len(FEEDS)]
        rows = json.loads(payload)
        if not isinstance(rows, list):
            raise ValueError("Taiwan programme API must return a JSON array")
        previous = ""
        for row in rows:
            if not isinstance(row, dict):
                raise ValueError("Unrecognized Taiwan programme row")
            clock, title, subtitle = row.get("ptime"), row.get("pname"), row.get("subname")
            if (
                not isinstance(clock, str)
                or not re.fullmatch(r"\d\d:\d\d", clock)
                or not isinstance(title, str)
                or not title.strip()
                or (not isinstance(subtitle, str) and subtitle is not False)
                or row.get("now") not in {"Y", "N"}
            ):
                raise ValueError("Incomplete Taiwan programme title or time")
            if previous and clock < previous:
                raise ValueError("Unordered Taiwan programme dates; no midnight rollover inferred")
            previous = clock
            source_clock = datetime.combine(day, datetime.strptime(clock, "%H:%M").time())
            start = localize_source_time(source_clock, SOURCE_TIMEZONE)
            if start is None:
                raise ValueError("Unresolved Taiwan programme source time")
            parts = [title, subtitle] if isinstance(subtitle, str) else [title]
            event: ScheduleEvent = {
                "title": " · ".join(" ".join(part.split()) for part in parts if part.strip()),
                "start": start,
                "location": FEEDS[feed],
                "url": "https://www.parliamentarytv.org.tw/",
            }
            key = (feed, start)
            if key in events and events[key] != event:
                raise ValueError("Conflicting Taiwan programme slot")
            events[key] = event
    return build_upcoming_schedule(
        CHANNEL_ID,
        [event for event in events.values() if event["start"] >= now],
        now,
        source_timezone=SOURCE_TIMEZONE,
        confidence="official_dated_programme_api",
    )
