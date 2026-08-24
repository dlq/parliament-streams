"""Small parsing helpers shared by scraper modules."""

from __future__ import annotations

import re
from datetime import UTC, datetime
from hashlib import sha256
from html import unescape
from typing import NotRequired, TypedDict
from zoneinfo import ZoneInfo

TAG_RE = re.compile(r"<[^>]+>")
SPACE_RE = re.compile(r"\s+")


class ScraperSource(TypedDict, total=False):
    """Machine-readable description of an official schedule source."""

    id: str
    channel_ids: list[str]
    url: str
    urls: list[str]
    method: str
    headers: NotRequired[dict[str, str]]
    body: NotRequired[dict[str, str]]
    notes: str


class FetchRequest(TypedDict):
    """One HTTP request needed to collect a scraper's current input."""

    url: str
    method: str
    headers: dict[str, str]
    body: NotRequired[dict[str, str]]


class ScheduleEvent(TypedDict):
    """Normalized event used while selecting current and next programmes."""

    start: datetime
    title: str
    end: NotRequired[datetime]
    url: NotRequired[str]
    event_id: NotRequired[str]
    status: NotRequired[str]
    location: NotRequired[str]
    language: NotRequired[str]


class NormalizedScheduleEvent(TypedDict):
    """Source-independent event record published in the schedule snapshot."""

    id: str
    identifier_kind: str
    title: str
    status: str
    start: NotRequired[str]
    end: NotRequired[str]
    url: NotRequired[str]
    location: NotRequired[str]
    language: NotRequired[str]
    source_timezone: NotRequired[str]


class ScheduleMetadata(TypedDict):
    """Normalized schedule metadata returned by every scraper."""

    current_event_title: str | None
    current_event_time: str | None
    next_event_title: str | None
    next_event_time: str | None
    current_event_start: NotRequired[str]
    current_event_url: NotRequired[str]
    current_event_id: NotRequired[str]
    current_event_status: NotRequired[str]
    current_event_location: NotRequired[str]
    current_event_language: NotRequired[str]
    next_event_url: NotRequired[str]
    next_event_start: NotRequired[str]
    next_event_id: NotRequired[str]
    next_event_status: NotRequired[str]
    next_event_location: NotRequired[str]
    next_event_language: NotRequired[str]
    events: NotRequired[list[NormalizedScheduleEvent]]
    confidence: str


ParsedSchedule = dict[str, ScheduleMetadata]


def clean_html(text: str) -> str:
    """Return readable text from small schedule snippets."""
    text = re.sub(r"<br\s*/?>", " ", text, flags=re.IGNORECASE)
    text = TAG_RE.sub("", text)
    return SPACE_RE.sub(" ", unescape(text)).strip()


def first_match(text: str, pattern: str) -> str | None:
    match = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL)
    if not match:
        return None
    return match.group(1)


def parse_iso(value: str) -> datetime | None:
    try:
        normalized = value.replace("Z", "+00:00")
        return datetime.fromisoformat(normalized)
    except ValueError:
        return None


def utc_event_start(value: datetime) -> str:
    """Return an RFC 3339 UTC timestamp suitable for client-side localization."""
    return value.astimezone(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")


def _event_status(event: ScheduleEvent, now: datetime) -> str:
    recorded = event.get("status", "").casefold()
    if "cancel" in recorded:
        return "cancelled"
    if any(marker in recorded for marker in ("live", "in progress", "en cours")):
        return "live"
    end = event.get("end")
    if end and event["start"] <= now <= end:
        return "live"
    if end and end < now:
        return "completed"
    return "scheduled"


def normalized_events(
    channel_id: str,
    events: list[ScheduleEvent],
    now: datetime,
    *,
    source_timezone: str | None = None,
) -> list[NormalizedScheduleEvent]:
    """Normalize and deduplicate source events for static publication."""

    normalized: dict[str, NormalizedScheduleEvent] = {}
    for event in events:
        title = event["title"].strip()
        if not title:
            continue
        official_id = event.get("event_id", "").strip()
        if official_id:
            event_id = official_id
            identifier_kind = "official"
        else:
            identity = "\x1f".join(
                (
                    channel_id,
                    title.casefold(),
                    utc_event_start(event["start"]),
                    event.get("location", "").casefold(),
                )
            )
            event_id = f"generated-{sha256(identity.encode()).hexdigest()[:20]}"
            identifier_kind = "generated"
        record: NormalizedScheduleEvent = {
            "id": event_id,
            "identifier_kind": identifier_kind,
            "title": title,
            "status": _event_status(event, now),
            "start": utc_event_start(event["start"]),
        }
        if event.get("url"):
            record["url"] = event["url"]
        if event.get("location"):
            record["location"] = event["location"]
        if event.get("language"):
            record["language"] = event["language"]
        if event.get("end"):
            record["end"] = utc_event_start(event["end"])
        if source_timezone:
            record["source_timezone"] = source_timezone
        normalized[event_id] = record
    return sorted(normalized.values(), key=lambda event: event.get("start", ""))


def local_time_label(value: datetime, tz_name: str = "America/Toronto") -> str:
    local = value.astimezone(ZoneInfo(tz_name))
    suffix = "ET" if tz_name in {"America/Toronto", "America/New_York"} else local.tzname()
    return f"{local.strftime('%-I:%M %p')} {suffix}"


def checked_label(now: datetime | None = None, tz_name: str = "America/Toronto") -> str:
    now = now or datetime.now(UTC)
    return f"Checked {local_time_label(now, tz_name)}"
