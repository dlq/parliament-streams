"""Parser for Canadian ParlVU/SenVu Harmony upcoming-event pages."""

from __future__ import annotations

import re
from collections.abc import Callable
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
    utc_event_start,
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
    r'<div class="divEvent"[\s\S]*?<a(?P<attrs>[^>]*)>[\s\S]*?'
    r'<td colspan="2" class="tdEventTitle">([\s\S]*?)</td>[\s\S]*?'
    r'<div class="eventDesc">([\s\S]*?)</div>[\s\S]*?'
    r'<div class="eventTime">([\s\S]*?)</div>[\s\S]*?'
    r'<div class="eventDate">([\s\S]*?)</div>',
    re.IGNORECASE,
)
STATUS_RE = re.compile(r'<div class="eventStatus[^"]*"[^>]*>([\s\S]*?)</div>', re.IGNORECASE)
LOCATION_RE = re.compile(r"\(([^()]*)\)")
EVENT_ID_RE = re.compile(r"/PowerBrowserV2/[^/]+/[^/]+/([^/?#]+)")
ATTRIBUTE_RE = re.compile(r'([a-zA-Z_:][-a-zA-Z0-9_:.]*)="([^"]*)"')
HTML_LANGUAGE_RE = re.compile(r"<html[^>]+lang=\"([a-zA-Z-]+)\"", re.IGNORECASE)
SCRIPT_LANGUAGE_RE = re.compile(r"\bvar\s+language\s*=\s*\"([a-zA-Z-]+)\"", re.IGNORECASE)
URL_LANGUAGE_RE = re.compile(r"/Harmony/([a-z]{2})(?:/|$)", re.IGNORECASE)


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


def _attribute(attrs: str, name: str) -> str:
    for key, value in ATTRIBUTE_RE.findall(attrs):
        if key.casefold() == name.casefold():
            return str(value)
    return ""


def _location(title_cell_html: str) -> str | None:
    matches = LOCATION_RE.findall(clean_html(title_cell_html))
    if not matches:
        return None
    location = matches[-1].strip()
    return location or None


def _event_id(url: str) -> str | None:
    match = EVENT_ID_RE.search(url)
    return match.group(1) if match else None


def _language(html: str, url: str) -> str | None:
    for pattern, text in (
        (SCRIPT_LANGUAGE_RE, html),
        (HTML_LANGUAGE_RE, html),
        (URL_LANGUAGE_RE, url),
    ):
        match = pattern.search(text)
        if match:
            language = match.group(1).lower()
            return language or None
    return None


def _status(title_cell_html: str) -> str | None:
    match = STATUS_RE.search(title_cell_html)
    if not match:
        return None
    status = clean_html(match.group(1))
    return status or None


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
    base_url = URL_BY_CHANNEL.get(channel_id, HOUSE_URL)
    page_language = _language(html, base_url)
    for (
        attrs,
        title_cell_html,
        description_html,
        time_html,
        date_html,
    ) in EVENT_RE.findall(html):
        start = _parse_start(clean_html(date_html), clean_html(time_html))
        href = _attribute(attrs, "href")
        title_text = _attribute(attrs, "title")
        title = _title(title_text, title_cell_html, description_html)
        event_url = urljoin(base_url, href)
        if start and title:
            event: ScheduleEvent = {"start": start, "title": title, "url": event_url}
            event_id = _event_id(event_url)
            event_status = _status(title_cell_html)
            location = _location(title_cell_html)
            if event_id:
                event["event_id"] = event_id
            if event_status:
                event["status"] = event_status
            if location:
                event["location"] = location
            if page_language:
                event["language"] = page_language
            events.append(event)

    events.sort(key=lambda event: event["start"])
    current = next(
        (
            event
            for event in events
            if re.search(r"\b(in progress|live now)\b", event.get("status", ""), re.IGNORECASE)
        ),
        None,
    )
    upcoming = [event for event in events if event is not current and event["start"] >= now]
    next_event = upcoming[0] if upcoming else None
    if not current and not next_event:
        return {}

    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": local_time_label(current["start"]) if current else None,
        "next_event_title": next_event["title"] if next_event else None,
        "next_event_time": local_time_label(next_event["start"]) if next_event else None,
        "confidence": "official_harmony_upcoming_events_page",
    }
    if current and current.get("url"):
        schedule["current_event_url"] = current["url"]
    if current and current.get("event_id"):
        schedule["current_event_id"] = current["event_id"]
    if current and current.get("status"):
        schedule["current_event_status"] = current["status"]
    if current and current.get("location"):
        schedule["current_event_location"] = current["location"]
    if current and current.get("language"):
        schedule["current_event_language"] = current["language"]
    if current:
        schedule["current_event_start"] = utc_event_start(current["start"])
    if next_event:
        if next_event.get("url"):
            schedule["next_event_url"] = next_event["url"]
        if next_event.get("event_id"):
            schedule["next_event_id"] = next_event["event_id"]
        if next_event.get("status"):
            schedule["next_event_status"] = next_event["status"]
        if next_event.get("location"):
            schedule["next_event_location"] = next_event["location"]
        if next_event.get("language"):
            schedule["next_event_language"] = next_event["language"]
        schedule["next_event_start"] = utc_event_start(next_event["start"])
    schedule["events"] = normalized_events(
        channel_id, events, now, source_timezone="America/Toronto"
    )
    return {channel_id: schedule}
