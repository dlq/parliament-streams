"""Upcoming featured broadcasts from the Chamber's multi-room WebTV portal."""

from __future__ import annotations

import re
from datetime import UTC, datetime, timedelta
from html.parser import HTMLParser

from .common import (
    ParsedSchedule,
    ScheduleEvent,
    ScraperSource,
    build_upcoming_schedule,
    localize_source_time,
)

CHANNEL_ID = "italy-camera-webtv"
SOURCE_TIMEZONE = "Europe/Rome"
SOURCE: ScraperSource = {
    "id": "italy-camera-webtv-events",
    "channel_ids": [CHANNEL_ID],
    "url": "https://webtv.camera.it/",
    "method": "GET",
    "notes": (
        "Featured upcoming broadcasts, with official event IDs and source-local starts. "
        "Multiple rooms, not an exhaustive calendar or a continuous linear TV guide. "
        "Archived video end times do not establish future broadcast ends."
    ),
}


class _Highlights(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.depth = 0
        self.seen = 0
        self.complete = False
        self.lists = 0
        self.open_lists = 0
        self.card: dict[str, str] | None = None
        self.cards: list[dict[str, str]] = []
        self.field = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        if tag == "div" and values.get("id") == "in_evidenza_items_container":
            self.seen += 1
            if self.seen != 1:
                raise ValueError("Duplicate Camera WebTV listing container")
            self.depth = 1
            return
        if not self.depth:
            return
        if tag == "ul":
            self.lists += 1
            self.open_lists += 1
        if tag == "div":
            self.depth += 1
            classes = values.get("class", "").split()
            if "titolo" in classes:
                self.field = "title"
            elif "canale" in classes:
                self.field = "location"
        if tag == "li":
            if self.card is not None or "data-id_evento" not in values:
                raise ValueError("Unrecognized Camera WebTV listing")
            self.card = {**values, "title": "", "location": ""}

    def handle_data(self, data: str) -> None:
        if self.card is not None and self.field:
            self.card[self.field] += data

    def handle_endtag(self, tag: str) -> None:
        if not self.depth:
            return
        if tag == "ul":
            self.open_lists -= 1
        if tag == "div":
            self.field = ""
            self.depth -= 1
            if not self.depth:
                self.complete = True
        if tag == "li":
            if self.card is None:
                raise ValueError("Unmatched Camera WebTV listing")
            self.cards.append(self.card)
            self.card = None


def parse(payload: str, *, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    document = _Highlights()
    document.feed(payload)
    document.close()
    if (
        document.seen != 1
        or not document.complete
        or document.card is not None
        or not document.lists
        or document.open_lists != 0
    ):
        raise ValueError("Camera WebTV listing container missing or truncated")
    events: dict[str, ScheduleEvent] = {}
    for card in document.cards:
        kind = card.get("data-tipo_evento")
        if kind in {"vod", "live"}:
            continue
        if kind != "futuro":
            raise ValueError("Unrecognized Camera WebTV event state")
        # A passed start cannot prove that a broadcast is still on air.
        event_id = card["data-id_evento"]
        title = " ".join(card["title"].split())
        location = " ".join(card["location"].split())
        clock = card.get("data-dataora", "")
        if (
            not re.fullmatch(r"[1-9]\d*", event_id)
            or not re.fullmatch(r"[1-9]\d*", card.get("data-ch_evento", ""))
            or not title
            or not location
            or not re.fullmatch(r"\d{4}-\d\d-\d\d \d\d:\d\d:\d\d", clock)
        ):
            raise ValueError("Incomplete Camera WebTV event identity or time")
        start = localize_source_time(datetime.strptime(clock, "%Y-%m-%d %H:%M:%S"), SOURCE_TIMEZONE)
        if start is None:
            raise ValueError("Ambiguous or nonexistent Camera WebTV source time")
        event: ScheduleEvent = {
            "title": title,
            "start": start,
            "event_id": event_id,
            "url": f"https://webtv.camera.it/evento/{event_id}",
            "location": location,
        }
        if event_id in events and events[event_id] != event:
            raise ValueError("Conflicting Camera WebTV event identity")
        events[event_id] = event
    return build_upcoming_schedule(
        CHANNEL_ID,
        [event for event in events.values() if now <= event["start"] <= now + timedelta(days=30)],
        now,
        source_timezone=SOURCE_TIMEZONE,
        confidence="official_webtv_event_directory",
    )
