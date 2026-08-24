"""Parser for the Europe by Satellite schedule API."""

from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from typing import Any
from urllib.parse import urlencode

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

CHANNEL_ID = "eu-audiovisual-ebs"
API_URL = "https://8hwk2cyeyb.execute-api.eu-west-1.amazonaws.com/parrotfish-prod/ebs/grid"

SOURCE: ScraperSource = {
    "id": "ebs-grid",
    "channel_ids": [CHANNEL_ID],
    "url": API_URL,
    "method": "GET",
    "notes": "Reads the official Europe by Satellite grid API for today and tomorrow.",
}


def request_specs(now: datetime) -> list[FetchRequest]:
    tomorrow = now.date() + timedelta(days=1)
    query = urlencode(
        {
            "channelName": "EBS",
            "dateFrom": now.strftime("%Y%m%d"),
            "dateTo": tomorrow.strftime("%Y%m%d"),
            "withCompleteThesaurusData": "true",
        }
    )
    return [{"url": f"{API_URL}?{query}", "method": "GET", "headers": {}}]


def _title(program: dict[str, Any]) -> str:
    titles = program.get("titles", [])
    preferred = next((item for item in titles if item.get("language") == "EN"), None)
    selected = preferred or (titles[0] if titles else {})
    return clean_html(str(selected.get("content", "")))


def parse(payload: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    days = json.loads(payload)
    events: list[ScheduleEvent] = []
    for day in days:
        for program in day.get("programs", []):
            start = parse_iso(str(program.get("startDatetime", "")))
            title = _title(program)
            if not start or not title:
                continue
            duration = max(0, int(program.get("duration", 0)))
            end = start + timedelta(seconds=duration)
            events.append({"start": start, "end": end, "title": title})
    events.sort(key=lambda event: event["start"])

    current = next((event for event in events if event["start"] <= now <= event["end"]), None)
    upcoming = next((event for event in events if event["start"] > now), None)
    if not current and not upcoming:
        return {}
    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": "Live now" if current else None,
        "next_event_title": upcoming["title"] if upcoming else None,
        "next_event_time": local_time_label(upcoming["start"], "Europe/Brussels")
        if upcoming
        else None,
        "confidence": "official_schedule",
    }
    if current:
        schedule["current_event_start"] = utc_event_start(current["start"])
    if upcoming:
        schedule["next_event_start"] = utc_event_start(upcoming["start"])
    schedule["events"] = normalized_events(
        CHANNEL_ID, events, now, source_timezone="Europe/Brussels"
    )
    return {CHANNEL_ID: schedule}
