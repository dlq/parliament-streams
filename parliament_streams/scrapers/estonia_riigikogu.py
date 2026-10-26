"""Collect dated Session Hall starts from Riigikogu's official plenary API."""

from __future__ import annotations

import json
import re
from datetime import UTC, date, datetime, timedelta
from urllib.parse import urlencode
from uuid import UUID
from zoneinfo import ZoneInfo

from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    localize_source_time,
)

CHANNEL_ID = "estonia-riigikogu-live-1"
API_URL = "https://api.riigikogu.ee/api/agenda/plenary"
TIMEZONE = "Europe/Tallinn"
SOURCE: ScraperSource = {
    "id": "estonia-riigikogu-plenary",
    "channel_ids": [CHANNEL_ID],
    "url": API_URL,
    "method": "GET",
    "notes": (
        "Dated plenary and question-time starts for the officially designated Session Hall feed. "
        "Does not map other rooms/Live2, infer ends or infer a live state from a past start."
    ),
}


def request_specs(now: datetime) -> list[FetchRequest]:
    today = now.astimezone(ZoneInfo(TIMEZONE)).date()
    query = urlencode(
        {
            "startDate": today.isoformat(),
            "endDate": (today + timedelta(days=7)).isoformat(),
            "lang": "ET",
            "querySteno": "false",
        }
    )
    return [
        {"url": f"{API_URL}?{query}", "method": "GET", "headers": {"Accept": "application/json"}}
    ]


def parse(payload: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    document = json.loads(payload)
    if not isinstance(document, dict) or not isinstance(document.get("sittings"), list):
        raise ValueError("Riigikogu plenary response must contain a sittings array")
    try:
        first = date.fromisoformat(document["weekStartDate"])
        last = date.fromisoformat(document["weekEndDate"])
    except (KeyError, TypeError, ValueError):
        raise ValueError("Riigikogu plenary response requires explicit source dates") from None
    if not timedelta(0) <= last - first <= timedelta(days=7):
        raise ValueError("Riigikogu plenary response has an invalid date range")
    if not first <= now.astimezone(ZoneInfo(TIMEZONE)).date() <= last:
        raise ValueError("Riigikogu plenary response does not cover the requested local date")
    events: list[ScheduleEvent] = []
    identities: set[str] = set()
    for row in document["sittings"]:
        if not isinstance(row, dict) or row.get("volumeType") not in {
            "plenarySittingVolume",
            "infoSittingVolume",
        }:
            raise ValueError("Riigikogu plenary response contains an unrecognized sitting type")
        if not all(
            isinstance(row.get(key), str) and row[key].strip()
            for key in ("uuid", "title", "sittingDateTime")
        ):
            raise ValueError("Riigikogu sitting requires an identity, title and dated start")
        if not re.match(r"\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}", row["sittingDateTime"]):
            raise ValueError("Riigikogu sitting start requires an explicit date and clock")
        identity = str(row["uuid"])
        try:
            UUID(identity)
            start = datetime.fromisoformat(row["sittingDateTime"].replace("Z", "+00:00"))
        except ValueError:
            raise ValueError("Riigikogu sitting has an invalid identity or start") from None
        if identity in identities:
            raise ValueError("Riigikogu plenary response repeats a sitting identity")
        identities.add(identity)
        if start.tzinfo is None:
            localized = localize_source_time(start, TIMEZONE)
            if localized is None:
                raise ValueError("Riigikogu local sitting time is ambiguous or nonexistent")
            start = localized
        if not first <= start.astimezone(ZoneInfo(TIMEZONE)).date() <= last:
            raise ValueError("Riigikogu sitting falls outside its displayed source date range")
        events.append(
            {
                "start": start,
                "title": row["title"].strip(),
                "event_id": identity,
                "location": "Session Hall",
                "language": "et",
            }
        )
    return build_upcoming_schedule(
        CHANNEL_ID,
        events,
        now,
        source_timezone=TIMEZONE,
        confidence="official_plenary_schedule_api",
    )
