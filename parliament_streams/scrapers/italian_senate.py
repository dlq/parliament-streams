"""Parser for the Italian Senate WebTV palimpsest API."""

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
    clean_html,
    localize_source_time,
    require_records,
)

API_URL = "https://webtv.senato.it/api/palimpsest"
WEBTV_CHANNEL = "WebTV1"
WEBTV_CHANNEL_ID = "13440"
SOURCE: ScraperSource = {
    "id": "italian-senate-palimpsest",
    "channel_ids": ["italy-senate"],
    "url": API_URL,
    "method": "GET",
    "notes": (
        "Queries the official WebTV palimpsest API for today and the next two days; "
        "retains only WebTV1 / 13440, the catalogue's Senate stream."
    ),
}


def request_specs(now: datetime) -> list[FetchRequest]:
    local_date = now.astimezone(ZoneInfo("Europe/Rome")).date()
    requests: list[FetchRequest] = []
    for offset in range(3):
        start = local_date + timedelta(days=offset)
        end = start + timedelta(days=1)
        query = urlencode(
            {
                "field_date_value[min]": f"{start.isoformat()}T00:00:00",
                "field_date_value[max]": f"{end.isoformat()}T00:00:00",
            }
        )
        requests.append({"url": f"{API_URL}?{query}", "method": "GET", "headers": {}})
    return requests


def parse(*payloads: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    timezone = ZoneInfo("Europe/Rome")
    local_date = now.astimezone(timezone).date()
    events: list[ScheduleEvent] = []

    for offset, payload in enumerate(payloads):
        raw_events = require_records(json.loads(payload), "Italian Senate palimpsest")
        event_date = local_date + timedelta(days=offset)
        for raw_event in raw_events:
            if (
                str(raw_event.get("field_channel_id", "")).strip() != WEBTV_CHANNEL_ID
                or clean_html(str(raw_event.get("field_vevent_channel", ""))) != WEBTV_CHANNEL
            ):
                continue
            title = clean_html(str(raw_event.get("title", "")))
            time_text = str(raw_event.get("field_date", "")).strip()
            if not title or not time_text:
                continue
            clock = re.fullmatch(r"(\d{1,2})[:.](\d{2})", time_text)
            if not clock:
                continue
            try:
                hour, minute = map(int, clock.groups())
                start = localize_source_time(
                    datetime(event_date.year, event_date.month, event_date.day, hour, minute),
                    "Europe/Rome",
                )
            except ValueError:
                continue
            if start is None:
                continue
            event: ScheduleEvent = {"start": start, "title": title}
            if raw_event.get("nid"):
                event["event_id"] = str(raw_event["nid"])
            if raw_event.get("view_node"):
                event["url"] = str(raw_event["view_node"])
            if raw_event.get("field_vevent_location"):
                event["location"] = clean_html(str(raw_event["field_vevent_location"]))
            events.append(event)

    return build_upcoming_schedule(
        "italy-senate",
        events,
        now,
        source_timezone="Europe/Rome",
        confidence="official_schedule_api",
    )
