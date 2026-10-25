"""Read dated Debat Direct broadcasts, mapped to individually identified rooms."""

from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from typing import Any
from urllib.parse import quote
from zoneinfo import ZoneInfo

from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    format_utc_timestamp,
    local_time_label,
    normalized_events,
    parse_iso,
)

API_URL = "https://api.debatdirect.tweedekamer.nl/api/agenda"
TIMEZONE = "Europe/Amsterdam"
CHANNEL_BY_LOCATION = {
    "plenaire-zaal": "netherlands-tweede-kamer",
    "aletta-jacobszaal": "netherlands-tweede-kamer-aletta-jacobszaal",
}
SOURCE: ScraperSource = {
    "id": "dutch-debat-direct",
    "channel_ids": list(CHANNEL_BY_LOCATION.values()),
    "url": API_URL,
    "method": "GET",
    "notes": "Official dated broadcast agenda; only exact catalogued room IDs are mapped.",
}


def request_specs(now: datetime) -> list[FetchRequest]:
    first = now.astimezone(ZoneInfo(TIMEZONE)).date()
    return [
        {"url": f"{API_URL}/{first + timedelta(days=offset)}", "method": "GET", "headers": {}}
        for offset in range(7)
    ]


def _source_time(value: object) -> datetime | None:
    parsed = parse_iso(value) if isinstance(value, str) else None
    return parsed if parsed is not None and parsed.utcoffset() is not None else None


def _event(row: dict[str, Any], date: str) -> ScheduleEvent | None:
    title = str(row.get("name") or "").strip()
    identity = str(row.get("id") or "").strip()
    start = _source_time(row.get("startsAt"))
    if not title or not identity or start is None:
        return None
    if start.astimezone(ZoneInfo(TIMEZONE)).date().isoformat() != date:
        raise ValueError("Debat Direct programme date differs from its dated agenda")
    event: ScheduleEvent = {
        "title": title,
        "event_id": identity,
        "start": start,
        "location": str(row.get("locationName") or row["locationId"]),
    }
    end = _source_time(row.get("endsAt"))
    if end is not None and end > start:
        event["end"] = end
    if row.get("cancelled") is True or row.get("status") == "cancelled":
        event["status"] = "cancelled"
    categories = row.get("categoryIds")
    slug = row.get("slug")
    if isinstance(categories, list) and categories and isinstance(slug, str) and slug:
        parts = (date, str(categories[0]), str(row["locationId"]), slug)
        event["url"] = "https://debatdirect.tweedekamer.nl/" + "/".join(
            quote(part, safe="") for part in parts
        )
    return event


def parse(*payloads: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    grouped: dict[str, list[ScheduleEvent]] = {}
    first = now.astimezone(ZoneInfo(TIMEZONE)).date()
    for offset, payload in enumerate(payloads):
        data = json.loads(payload)
        date = (first + timedelta(days=offset)).isoformat()
        if (
            not isinstance(data, dict)
            or data.get("date") != date
            or not isinstance(data.get("debates"), list)
        ):
            raise ValueError("Expected the requested dated Debat Direct broadcast agenda")
        for row in data["debates"]:
            if not isinstance(row, dict):
                raise ValueError("Invalid Debat Direct programme record")
            location = row.get("locationId")
            if not isinstance(location, str) or location not in CHANNEL_BY_LOCATION:
                continue
            event = _event(row, date)
            if event is not None:
                grouped.setdefault(CHANNEL_BY_LOCATION[location], []).append(event)

    parsed: ParsedSchedule = {}
    for channel_id, events in grouped.items():
        ordered = sorted(events, key=lambda event: event["start"])
        current = next(
            (
                event
                for event in ordered
                if event.get("end")
                and event["start"] <= now < event["end"]
                and event.get("status") != "cancelled"
            ),
            None,
        )
        upcoming = next(
            (
                event
                for event in ordered
                if event["start"] > now and event.get("status") != "cancelled"
            ),
            None,
        )
        schedule: ScheduleMetadata = {
            "current_event_title": current["title"] if current else None,
            "current_event_time": "Live now" if current else None,
            "next_event_title": upcoming["title"] if upcoming else None,
            "next_event_time": local_time_label(upcoming["start"], TIMEZONE) if upcoming else None,
            "confidence": "official_room_broadcast_agenda",
            "events": normalized_events(channel_id, ordered, now, source_timezone=TIMEZONE),
        }
        if current:
            schedule["current_event_start"] = format_utc_timestamp(current["start"])
        if upcoming:
            schedule["next_event_start"] = format_utc_timestamp(upcoming["start"])
        parsed[channel_id] = schedule
    return parsed
