"""Parser for the official UN Web TV live schedule."""

from __future__ import annotations

import re
from datetime import UTC, datetime
from urllib.parse import urljoin
from zoneinfo import ZoneInfo

from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    clean_html,
    local_time_label,
    normalized_events,
    parse_iso,
    utc_event_start,
)

CHANNEL_ID = "un-web-tv"
BASE_URL = "https://webtv.un.org"
SCHEDULE_URL = f"{BASE_URL}/en/schedule"
SOURCE: ScraperSource = {
    "id": "un-webtv-schedule",
    "channel_ids": [CHANNEL_ID],
    "url": SCHEDULE_URL,
    "method": "GET",
    "headers": {"User-Agent": "Mozilla/5.0"},
    "notes": "Parses the official Live Now and Coming Up schedule sections.",
}

CARD_RE = re.compile(
    r'<div class="d-none mediaun-timezone" data-nid="(?P<id>[^"]+)">'
    r"(?P<start>[^<]+)</div>[\s\S]*?"
    r'<h4[^>]*>[\s\S]*?<a[^>]*href="(?P<url>[^"]+)"[^>]*>[\s\S]*?'
    r'media-asset__title[\s\S]*?<div class="field__item">(?P<title>[\s\S]*?)</div>',
    re.IGNORECASE,
)


def request_specs(now: datetime) -> list[FetchRequest]:
    date = now.astimezone(ZoneInfo("America/New_York")).date().isoformat()
    return [
        {
            "url": f"{SCHEDULE_URL}/{date}",
            "method": "GET",
            "headers": dict(SOURCE.get("headers", {})),
        }
    ]


def _section(html: str, heading: str, end_marker: str | None = None) -> str:
    match = re.search(rf">\s*{re.escape(heading)}\s*</h6>", html, re.IGNORECASE)
    if not match:
        return ""
    end = html.find(end_marker, match.end()) if end_marker else -1
    return html[match.end() : end if end >= 0 else None]


def _events(html: str) -> list[ScheduleEvent]:
    events: list[ScheduleEvent] = []
    for match in CARD_RE.finditer(html):
        start = parse_iso(match.group("start").strip())
        title = clean_html(match.group("title"))
        if start and title:
            events.append(
                {
                    "start": start,
                    "title": title,
                    "url": urljoin(BASE_URL, match.group("url")),
                    "event_id": match.group("id"),
                    "language": "en",
                }
            )
    return sorted(events, key=lambda event: event["start"])


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    coming_marker = "view-display--attachment-coming-up"
    live = _events(_section(html, "Live Now", coming_marker))
    for event in live:
        event["status"] = "Live now"
    upcoming = [event for event in _events(_section(html, "Coming Up")) if event["start"] >= now]
    current = live[0] if live else None
    next_event = upcoming[0] if upcoming else None
    if not current and not next_event:
        return {}

    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": "Live now" if current else None,
        "next_event_title": next_event["title"] if next_event else None,
        "next_event_time": local_time_label(next_event["start"], "America/New_York")
        if next_event
        else None,
        "confidence": "official_live_schedule",
    }
    if current:
        schedule["current_event_start"] = utc_event_start(current["start"])
        schedule["current_event_url"] = current["url"]
        schedule["current_event_id"] = current["event_id"]
        schedule["current_event_status"] = "Live now"
        schedule["current_event_language"] = current["language"]
    if next_event:
        schedule["next_event_start"] = utc_event_start(next_event["start"])
        schedule["next_event_url"] = next_event["url"]
        schedule["next_event_id"] = next_event["event_id"]
        schedule["next_event_status"] = "Upcoming"
        schedule["next_event_language"] = next_event["language"]
    schedule["events"] = normalized_events(
        CHANNEL_ID, live + upcoming, now, source_timezone="America/New_York"
    )
    return {CHANNEL_ID: schedule}
