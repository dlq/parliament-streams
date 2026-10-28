"""Read Capitol TV's explicitly paired default-channel broadcast schedule."""

from __future__ import annotations

import json
import re
from datetime import UTC, datetime, timedelta
from html.parser import HTMLParser

from .common import (
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    clean_html,
    format_utc_timestamp,
    local_time_label,
    normalized_events,
    parse_iso,
    require_object,
    require_records,
)

CHANNEL_ID = "us-ri-capitol-tv"
PAGE_URL = "https://capitoltvri.cablecast.tv/"
TIMEZONE = "America/New_York"
SOURCE: ScraperSource = {
    "id": "rhode-island-cablecast",
    "channel_ids": [CHANNEL_ID],
    "url": PAGE_URL,
    "method": "GET",
    "notes": (
        "Official Cablecast default schedule channel 1, paired with live stream 1. "
        "Only the root page's rolling window; the other seven live streams are not mapped."
    ),
}


class _StateHTML(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_script = False
        self.parts: list[str] = []
        self.states: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "script":
            self.in_script = True
            self.parts = []

    def handle_data(self, data: str) -> None:
        if self.in_script:
            self.parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self.in_script:
            script = "".join(self.parts)
            if "window.__remixContext" in script:
                self.states.append(script)
            self.in_script = False


def parse(payload: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    document = _StateHTML()
    document.feed(payload)
    if len(document.states) != 1 or document.in_script:
        raise ValueError("Capitol TV response lacks one complete schedule state")
    match = re.fullmatch(r"\s*window\.__remixContext\s*=\s*(.*?)\s*;?\s*", document.states[0], re.S)
    if match is None:
        raise ValueError("Changed Cablecast state assignment")
    # Decode data only; never evaluate the publisher's JavaScript.
    state = require_object(json.loads(match[1].removesuffix(";")), "Cablecast state")
    state = require_object(state.get("state"), "Cablecast loader state")
    loaders = require_object(state.get("loaderData"), "Cablecast loader data")
    root = require_object(loaders.get("root"), "Cablecast root")
    site = require_object(root.get("site"), "Cablecast site")
    if (
        site.get("host") != "capitoltvri.cablecast.tv"
        or site.get("siteId") != "1"
        or site.get("scheduleChannelId") != 1
        or site.get("liveStreamId") != "1"
        or site.get("ianaId") != TIMEZONE
        or site.get("liveStreamUrl") != PAGE_URL + "live/stream-1/live.m3u8"
    ):
        raise ValueError("Capitol TV default schedule/live-channel identity changed")
    schedule = require_object(root.get("schedule"), "Cablecast schedule")
    rows = require_records(schedule.get("scheduleItems"), "Cablecast schedule items")
    unique: dict[str, ScheduleEvent] = {}
    for row in rows:
        if row.get("deleted") is True:
            continue
        if "channelId" not in row or "siteId" not in row:
            raise ValueError("Cablecast run lacks channel/site identity")
        if row["channelId"] != 1 or row["siteId"] != "1":
            continue
        event_id, show_id = str(row.get("scheduleItemId", "")), str(row.get("showId", ""))
        start, end = (
            parse_iso(str(row.get("runDateTime", ""))),
            parse_iso(str(row.get("endDateTime", ""))),
        )
        title = clean_html(str(row.get("title") or ""))
        if (
            not re.fullmatch(r"[1-9]\d*", event_id)
            or not re.fullmatch(r"[1-9]\d*", show_id)
            or not title
            or start is None
            or end is None
            or start.utcoffset() is None
            or end.utcoffset() is None
            or end <= start
        ):
            raise ValueError("Incomplete Cablecast broadcast identity or explicit time range")
        event: ScheduleEvent = {
            "event_id": event_id,
            "start": start,
            "end": end,
            "title": title,
            "url": f"{PAGE_URL}show/{show_id}",
            "location": "Capitol TV — channel 1",
        }
        if event_id in unique and unique[event_id] != event:
            raise ValueError("Conflicting Cablecast schedule ID")
        unique[event_id] = event
    events = sorted(
        (e for e in unique.values() if e["end"] > now and e["start"] <= now + timedelta(days=14)),
        key=lambda e: e["start"],
    )
    if not events:
        return {}
    current = next((e for e in events if e["start"] <= now < e["end"]), None)
    upcoming = next((e for e in events if e["start"] > now), None)
    result: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": "Live now" if current else None,
        "next_event_title": upcoming["title"] if upcoming else None,
        "next_event_time": local_time_label(upcoming["start"], TIMEZONE) if upcoming else None,
        "confidence": "official_default_channel_broadcast_grid",
        "events": normalized_events(CHANNEL_ID, events, now, source_timezone=TIMEZONE),
    }
    if current:
        result["current_event_start"] = format_utc_timestamp(current["start"])
    if upcoming:
        result["next_event_start"] = format_utc_timestamp(upcoming["start"])
    return {CHANNEL_ID: result}
