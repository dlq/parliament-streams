"""Parser for Canadian ParlVU/SenVu Harmony upcoming-event pages."""

from __future__ import annotations

import re
from collections.abc import Callable
from datetime import UTC, datetime
from zoneinfo import ZoneInfo

from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    clean_html,
    local_time_label,
)

HOUSE_URL = "https://parlvu.parl.gc.ca/Harmony/en"
SENATE_URL = "https://senparlvu.parl.gc.ca/Harmony/"
CHANNEL_BY_URL = {
    HOUSE_URL: "canada-house-of-commons-parlvu",
    SENATE_URL: "canada-senate-senvu",
}
URL_BY_CHANNEL = {channel_id: url for url, channel_id in CHANNEL_BY_URL.items()}
SOURCE: ScraperSource = {
    "id": "canada-harmony",
    "channel_ids": list(CHANNEL_BY_URL.values()),
    "urls": list(CHANNEL_BY_URL),
    "method": "GET",
    "notes": "Parses server-rendered upcoming event cards from ParlVU and SenVu Harmony pages.",
}

Fetcher = Callable[[FetchRequest, int, int], str]
EVENT_RE = re.compile(
    r'<div class="divEvent"[\s\S]*?<a[^>]+title="([^"]+)"[\s\S]*?'
    r'<td colspan="2" class="tdEventTitle">([\s\S]*?)</td>[\s\S]*?'
    r'<div class="eventDesc">([\s\S]*?)</div>[\s\S]*?'
    r'<div class="eventTime">([\s\S]*?)</div>[\s\S]*?'
    r'<div class="eventDate">([\s\S]*?)</div>',
    re.IGNORECASE,
)


def collect(
    fetcher: Fetcher, now: datetime, timeout: int, retries: int
) -> tuple[ParsedSchedule, list[str]]:
    parsed: ParsedSchedule = {}
    urls: list[str] = []
    for url, channel_id in CHANNEL_BY_URL.items():
        urls.append(url)
        html = fetcher({"url": url, "method": "GET", "headers": {}}, timeout, retries)
        parsed.update(parse(html, now=now, channel_id=channel_id))
    return parsed, urls


def source_url_for_channel(channel_id: str, urls: list[str]) -> str:
    return URL_BY_CHANNEL.get(channel_id, urls[0])


def _parse_start(date_text: str, time_text: str) -> datetime | None:
    first_time = time_text.split("-", 1)[0].strip()
    for pattern in ("%a, %b %d, %Y %I:%M %p", "%a, %B %d, %Y %I:%M %p"):
        try:
            return datetime.strptime(f"{date_text} {first_time}", pattern).replace(
                tzinfo=ZoneInfo("America/Toronto")
            )
        except ValueError:
            continue
    return None


def _title(title_text: str, title_cell_html: str, description_html: str) -> str:
    title = clean_html(title_text)
    description = clean_html(description_html)
    locationless = re.sub(r"\s*\([^)]*\)\s*$", "", clean_html(title_cell_html)).strip()
    if locationless and len(locationless) < len(title):
        title = locationless
    if description and description.casefold() != title.casefold():
        return f"{title} - {description}"
    return title


def parse(
    html: str,
    now: datetime | None = None,
    channel_id: str = "canada-house-of-commons-parlvu",
) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    events: list[ScheduleEvent] = []
    for title_text, title_cell_html, description_html, time_html, date_html in EVENT_RE.findall(
        html
    ):
        start = _parse_start(clean_html(date_html), clean_html(time_html))
        title = _title(title_text, title_cell_html, description_html)
        if start and title:
            events.append({"start": start, "title": title})

    events.sort(key=lambda event: event["start"])
    upcoming = [event for event in events if event["start"] >= now]
    if not upcoming:
        return {}

    current = upcoming[0]
    next_event = upcoming[1] if len(upcoming) > 1 else None
    return {
        channel_id: {
            "current_event_title": current["title"],
            "current_event_time": local_time_label(current["start"]),
            "next_event_title": next_event["title"] if next_event else None,
            "next_event_time": local_time_label(next_event["start"]) if next_event else None,
            "confidence": "official_harmony_upcoming_events_page",
        }
    }
