"""Public Harmony event JSON, with publisher-specific identity and source timezones."""

from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta

from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    clean_html,
    format_utc_timestamp,
    localize_source_time,
    normalized_events,
    parse_iso,
    require_object,
    require_records,
)

TARGETS = {
    "canada-house-of-commons-parlvu": ("https://parlvu.parl.gc.ca/Harmony/", "America/Toronto"),
    "canada-senate-senvu": ("https://senparlvu.parl.gc.ca/Harmony/", "America/Toronto"),
    "bermuda-parliament-audio-archive": (
        "https://sg001-harmony.sliq.net/00290/Harmony/",
        "Atlantic/Bermuda",
    ),
}
QUERY = "en/api/Data/GetUpcomingEvents?lastModified=19700101000000000"
SOURCE: ScraperSource = {
    "id": "harmony-json",
    "channel_ids": list(TARGETS),
    "urls": [base + QUERY for base, zone in TARGETS.values()],
    "method": "GET",
    "notes": (
        "Public four-group event JSON; 17-digit UTC polling watermark. "
        "Source-local event clocks, stable IDs and explicit live status. "
        "Meeting/session windows and parallel rooms are not linear TV guides."
    ),
}


def request_specs(now: datetime) -> list[FetchRequest]:
    return [
        {"url": base + QUERY, "method": "GET", "headers": {"Accept": "application/json"}}
        for base, zone in TARGETS.values()
    ]


def source_url_for_channel(channel_id: str, urls: list[str]) -> str:
    return TARGETS[channel_id][0] + QUERY


def _one(payload: str, channel: str, now: datetime) -> ParsedSchedule:
    base, zone = TARGETS[channel]
    data = require_object(json.loads(payload), "Harmony response")
    modified = parse_iso(str(data.get("LastModifiedTime", "")))
    groups = data.get("ContentEntityDatas")
    if (
        modified is None
        or modified.utcoffset() is None
        or not isinstance(groups, list)
        or len(groups) != 4
    ):
        raise ValueError("Harmony response lacks its watermark and four event groups")
    unique: dict[str, ScheduleEvent] = {}
    for group in groups:
        for row in require_records(group, "Harmony event group"):
            status = row.get("EntityStatus")
            if type(status) is not int:
                raise ValueError("Harmony event lacks a numeric status")
            if status not in (0, 1) or row.get("PublishStatus") != 2:
                continue
            identity = row.get("Id")
            value = row.get("ScheduledStart")
            start = parse_iso(value) if isinstance(value, str) and "T" in value else None
            title = clean_html(str(row.get("Title") or ""))
            if (
                isinstance(identity, bool)
                or not str(identity or "").isdigit()
                or start is None
                or not title
            ):
                raise ValueError("Harmony event lacks ID, title or dated start")
            if start.tzinfo is None:
                start = localize_source_time(start, zone)
            if start is None:
                raise ValueError("Ambiguous or nonexistent Harmony source clock")
            if not now - timedelta(days=1) <= start <= now + timedelta(days=30):
                continue
            if status == 0 and start < now:
                continue
            event: ScheduleEvent = {
                "event_id": str(identity),
                "start": start,
                "title": title,
                "url": base + "en",
            }
            if status == 1:
                if start > now:
                    raise ValueError("Harmony live status contradicts a future start")
                event["status"] = "live"
            end = parse_iso(str(row.get("ScheduledEnd") or ""))
            if end is not None:
                if end.tzinfo is None:
                    end = localize_source_time(end, zone)
                if end is not None and end > start:
                    event["end"] = end
            if isinstance(location := row.get("Location"), str) and location.strip():
                event["location"] = clean_html(location)
            key = str(identity)
            if key in unique and unique[key] != event:
                raise ValueError("Conflicting Harmony event ID")
            unique[key] = event
    if not unique:
        return {}
    events = sorted(unique.values(), key=lambda e: e["start"])
    current = next((e for e in events if e.get("status") == "live"), None)
    upcoming = next((e for e in events if e["start"] >= now and e is not current), None)
    result: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": "Live now" if current else None,
        "next_event_title": upcoming["title"] if upcoming else None,
        "next_event_time": format_utc_timestamp(upcoming["start"]) if upcoming else None,
        "confidence": "official_harmony_event_json",
        "events": normalized_events(channel, events, now, source_timezone=zone),
    }
    if upcoming:
        result["next_event_start"] = format_utc_timestamp(upcoming["start"])
    return {channel: result}


def parse(*payloads: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    if len(payloads) != len(TARGETS):
        raise ValueError("Harmony requires one response for each configured publisher")
    result: ParsedSchedule = {}
    for payload, channel in zip(payloads, TARGETS, strict=True):
        result.update(_one(payload, channel, now))
    return result
