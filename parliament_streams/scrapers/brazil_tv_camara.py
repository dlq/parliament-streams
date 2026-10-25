"""Parser for Brazil TV Camara's weekly schedule page."""

from __future__ import annotations

import re
from datetime import UTC, datetime
from zoneinfo import ZoneInfo

from .common import (
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    clean_html,
    format_utc_timestamp,
    local_time_label,
    normalized_events,
)

SOURCE: ScraperSource = {
    "id": "brazil-tv-camara",
    "channel_ids": ["brazil-tv-camara"],
    "url": "https://www.camara.leg.br/tv/programacao-semanal",
    "method": "GET",
    "headers": {"User-Agent": "Mozilla/5.0"},
    "notes": "Extracts time/title rows from the active tab of TV Camara's weekly schedule.",
}

DAY_IDS = {
    "segunda_feira": 0,
    "terca_feira": 1,
    "quarta_feira": 2,
    "quinta_feira": 3,
    "sexta_feira": 4,
    "sabado": 5,
    "domingo": 6,
}
TAB_PANE_RE = re.compile(
    r"<div\b([^>]*\bclass\s*=\s*[\"\'][^\"\']*\btab-pane\b[^\"\']*[\"\'][^>]*)>",
    re.IGNORECASE,
)


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    source_tz = ZoneInfo("America/Sao_Paulo")
    source_now = now.astimezone(source_tz)
    active = _active_tab_html(html, weekday=source_now.weekday())
    if active is None:
        if TAB_PANE_RE.search(html):
            return {}
        active = html
    events: list[ScheduleEvent] = []
    pattern = re.compile(
        r"<tr[^>]*>\s*<td[^>]*>\s*<span[^>]*>(\d{1,2}:\d{2})</span>\s*</td>\s*"
        r"<td[^>]*>\s*<span[^>]*>([\s\S]*?)</span>\s*</td>\s*</tr>",
        re.IGNORECASE,
    )
    for time_text, title_html in pattern.findall(active):
        hour, minute = [int(part) for part in time_text.split(":")]
        try:
            start = source_now.replace(hour=hour, minute=minute, second=0, microsecond=0)
        except ValueError:
            continue
        title = clean_html(title_html)
        if title:
            if events and start < events[-1]["start"]:
                return {}
            events.append({"start": start, "title": title, "start_basis": "collection_date"})
    events.sort(key=lambda item: item["start"])
    if not events:
        return {}
    for event, following in zip(events, events[1:], strict=False):
        if following["start"] > event["start"]:
            event["end"] = following["start"]
            event["end_basis"] = "next_listing_start"

    current = next((event for event in reversed(events) if event["start"] <= now), None)
    next_event = next((event for event in events if event["start"] > now), None)
    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": local_time_label(current["start"], "America/Sao_Paulo")
        if current
        else None,
        "next_event_title": next_event["title"] if next_event else None,
        "next_event_time": local_time_label(next_event["start"], "America/Sao_Paulo")
        if next_event
        else None,
        "confidence": "official_weekly_schedule",
    }
    if current:
        schedule["current_event_start"] = format_utc_timestamp(current["start"])
    if next_event:
        schedule["next_event_start"] = format_utc_timestamp(next_event["start"])
    schedule["events"] = normalized_events(
        "brazil-tv-camara", events, now, source_timezone="America/Sao_Paulo"
    )
    return {"brazil-tv-camara": schedule}


def _active_tab_html(html: str, *, weekday: int) -> str | None:
    """Select one active source day without assigning other weekday rows to today."""
    panes = list(TAB_PANE_RE.finditer(html))
    active: list[tuple[int, re.Match[str]]] = []
    for index, pane in enumerate(panes):
        classes = re.search(r"\bclass\s*=\s*[\"']([^\"']*)", pane.group(1), re.IGNORECASE)
        if classes and "active" in classes.group(1).split():
            active.append((index, pane))
    if len(active) != 1:
        return None
    index, pane = active[0]
    day_id = re.search(r"\bid\s*=\s*[\"']([^\"']+)", pane.group(1), re.IGNORECASE)
    if day_id:
        if DAY_IDS.get(day_id.group(1)) != weekday:
            return None
    elif len(panes) > 1:
        return None
    end = panes[index + 1].start() if index + 1 < len(panes) else len(html)
    return html[pane.end() : end]
