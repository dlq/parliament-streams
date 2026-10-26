"""Collect House sittings from the public API used by Parliament's calendar."""

from __future__ import annotations

import json
import re
from datetime import UTC, date, datetime, time, timedelta
from urllib.parse import urlencode
from uuid import UUID
from zoneinfo import ZoneInfo

from .common import (
    Fetcher,
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    checked_label,
    clean_html,
    first_match,
    format_utc_timestamp,
    local_time_label,
    localize_source_time,
    normalized_events,
)

CHANNEL_ID = "new-zealand-parliament"
TIMEZONE = "Pacific/Auckland"
API_URL = "https://prod-win-client-home.azurewebsites.net/api/opendata/calendar/housesitting"
CALENDAR_URL = "https://www.parliament.nz/calendar?lang=en"
HORIZON_DAYS = 14

SOURCE: ScraperSource = {
    "id": "new-zealand-parliament",
    "channel_ids": [CHANNEL_ID],
    "url": API_URL,
    "method": "GET",
    "headers": {},
    "notes": (
        "House-only dated calendar API used by the official public client. "
        "Explicit source intervals are institutional sitting plans, not an uninterrupted "
        "linear broadcast guide; breaks and the on-air feed remain unverified."
    ),
}

BOT_PROTECTION_PATTERN = re.compile(
    r"(?:captcha page|verifying your browser before proceeding)", re.IGNORECASE
)

MONTH_PATTERN = re.compile(
    r'<span[^>]*class="[^"]*calendar-date[^"]*"[^>]*>\s*([A-Za-z]+\s+\d{4})\s*</span>'
)
DAY_PATTERN = re.compile(
    r'<button[^>]*class="([^"]*\bhouse-sitting-day\b[^"]*)"[^>]*>'
    r'[\s\S]*?<span[^>]*class="[^"]*date-number[^"]*"[^>]*>\s*(\d{1,2})\s*</span>'
    r"[\s\S]*?</button>"
)


def _sitting_dates(html: str) -> list[datetime]:
    month_match = MONTH_PATTERN.search(html)
    if not month_match:
        return []
    month = datetime.strptime(month_match.group(1), "%B %Y")
    dates: list[datetime] = []
    for classes, day_text in DAY_PATTERN.findall(html):
        if "day-not-in-month" in classes:
            continue
        dates.append(
            datetime(
                month.year,
                month.month,
                int(day_text),
                tzinfo=ZoneInfo("Pacific/Auckland"),
            )
        )
    return dates


def request_specs(now: datetime) -> list[FetchRequest]:
    today = now.astimezone(ZoneInfo(TIMEZONE)).date()
    query = urlencode(
        {
            "startDate": (today - timedelta(days=1)).isoformat(),
            "endDate": (today + timedelta(days=HORIZON_DAYS)).isoformat(),
        }
    )
    return [
        {"url": f"{API_URL}?{query}", "method": "GET", "headers": {"Accept": "application/json"}}
    ]


def _api_events(payload: str, now: datetime) -> list[ScheduleEvent]:
    try:
        document = json.loads(payload)
    except json.JSONDecodeError:
        # Keep recognizable protection/loading failures precise, but a successful
        # HTTP response with other HTML must not become a healthy empty API result.
        _parse_html(payload, now)
        raise ValueError("official calendar API returned non-JSON content") from None
    if not isinstance(document, list):
        raise ValueError("official House calendar API requires an event array")
    today = now.astimezone(ZoneInfo(TIMEZONE)).date()
    events: list[ScheduleEvent] = []
    identities: dict[str, dict[str, object]] = {}
    for row in document:
        if not isinstance(row, dict) or row.get("meetingType") != 2:
            raise ValueError("official House calendar contains a non-House event")
        if not all(
            isinstance(row.get(key), str) and row[key].strip()
            for key in ("id", "date", "title", "start")
        ):
            raise ValueError("official House sitting requires an identity, title, date and start")
        try:
            UUID(row["id"])
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}(?:T00:00:00)?", row["date"]):
                raise ValueError
            day = date.fromisoformat(row["date"][:10])
            if not today - timedelta(days=1) <= day <= today + timedelta(days=HORIZON_DAYS):
                raise ValueError
        except ValueError:
            raise ValueError(
                "official House sitting has an invalid identity or source date"
            ) from None
        if row["id"] in identities:
            if row != identities[row["id"]]:
                raise ValueError("official House calendar repeats a conflicting event identity")
            continue
        identities[row["id"]] = row

        clocks: dict[str, datetime] = {}
        for field in ("start", "end"):
            clock = row.get(field)
            if field == "end" and (clock is None or clock == ""):
                continue
            if not isinstance(clock, str) or not re.fullmatch(r"\d{2}:\d{2}:\d{2}", clock):
                raise ValueError("official House sitting has an invalid clock")
            try:
                local = datetime.combine(day, time.fromisoformat(clock))
            except ValueError:
                raise ValueError("official House sitting has an invalid clock") from None
            instant = localize_source_time(local, TIMEZONE)
            if instant is None:
                raise ValueError(
                    "official House sitting has an ambiguous or nonexistent local time"
                )
            clocks[field] = instant
        if "end" in clocks and clocks["end"] <= clocks["start"]:
            raise ValueError("official House sitting end must follow its start on the source date")
        title = clean_html(row["title"])
        if not title:
            raise ValueError("official House sitting requires a readable title")
        event: ScheduleEvent = {
            "event_id": row["id"],
            "title": title,
            "start": clocks["start"],
            "url": CALENDAR_URL,
            "location": "House of Representatives",
        }
        if "end" in clocks:
            event["end"] = clocks["end"]
        if event["start"] >= now or event.get("end", event["start"]) > now:
            events.append(event)
    return sorted(events, key=lambda event: event["start"])


def _parse_api(payload: str, now: datetime) -> ParsedSchedule:
    events = _api_events(payload, now)
    if not events:
        return {}
    current = next(
        (event for event in events if event["start"] <= now < event.get("end", event["start"])),
        None,
    )
    upcoming = next(
        (event for event in events if event is not current and event["start"] >= now), None
    )
    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": local_time_label(current["start"], TIMEZONE) if current else None,
        "next_event_title": upcoming["title"] if upcoming else None,
        "next_event_time": local_time_label(upcoming["start"], TIMEZONE) if upcoming else None,
        "confidence": "official_house_sitting_calendar_api",
        "events": normalized_events(CHANNEL_ID, events, now, source_timezone=TIMEZONE),
    }
    if current:
        schedule["current_event_start"] = format_utc_timestamp(current["start"])
    if upcoming:
        schedule["next_event_start"] = format_utc_timestamp(upcoming["start"])
    return {CHANNEL_ID: schedule}


def collect(
    fetcher: Fetcher, now: datetime, timeout: int, retries: int
) -> tuple[ParsedSchedule, list[str]]:
    request = request_specs(now)[0]
    return _parse_api(fetcher(request, timeout, retries), now), [request["url"]]


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    """Parse current JSON; preserve saved legacy HTML/status input compatibility."""
    now = now or datetime.now(UTC)
    if html.lstrip().startswith(("[", "{", '"', "null")):
        return _parse_api(html, now)
    return _parse_html(html, now)


def _parse_html(html: str, now: datetime) -> ParsedSchedule:
    has_calendar_content = "house-session__text" in html or "Parliament Calendar" in html
    if BOT_PROTECTION_PATTERN.search(html) or (
        "perfdrive.com" in html.casefold() and not has_calendar_content
    ):
        raise ValueError("official calendar returned a bot-protection page")
    local_now = now.astimezone(ZoneInfo("Pacific/Auckland"))
    sitting_dates = _sitting_dates(html)
    current_sitting = next(
        (date for date in sitting_dates if date.date() == local_now.date()), None
    )
    next_sitting = next((date for date in sitting_dates if date.date() > local_now.date()), None)
    body = clean_html(html)
    status = first_match(
        html,
        r'<span[^>]*class="[^"]*house-session__text[^"]*"[^>]*>([\s\S]*?)</span>',
    )
    status_text = clean_html(status) if status else None
    next_text = (
        first_match(status_text, r"The\s+House next meets\s+(?:on\s+)?(.+)")
        if status_text
        else None
    )
    next_text = next_text or first_match(body, r"The\s+House next meets\s+(?:on\s+)?([^\.]+\.?)")
    next_text = next_text or first_match(body, r"House next meets\s+(?:on\s+)?([^\.]+\.?)")
    lowered_html = html.casefold()
    is_blazor_shell = (
        "_framework/blazor.web.js" in lowered_html or "blazor-webassembly" in lowered_html
    ) and "spinner-container" in lowered_html
    if is_blazor_shell and MONTH_PATTERN.search(html) is None and not status_text and not next_text:
        raise ValueError("official calendar returned an unrendered Blazor loading shell")
    if next_sitting:
        next_text = f"{next_sitting:%A}, {next_sitting.day} {next_sitting:%B %Y}"
    if not status and not next_text and not current_sitting:
        return {}
    current_title = status_text
    if current_title and re.match(r"The\s+House next meets\b", current_title, re.IGNORECASE):
        current_title = None
    if current_sitting:
        current_title = "House sitting day"
    return {
        "new-zealand-parliament": {
            "current_event_title": current_title,
            "current_event_time": checked_label(now, "Pacific/Auckland") if current_title else None,
            "next_event_title": "House next meets" if next_text else None,
            "next_event_time": next_text,
            "confidence": "official_calendar",
        }
    }
