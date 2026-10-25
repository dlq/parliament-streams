"""Parse the dated linear schedule for Quebec's separate Canal de l'Assemblée."""

from __future__ import annotations

import re
import unicodedata
from datetime import UTC, datetime, timedelta
from zoneinfo import ZoneInfo

from .common import (
    ParsedSchedule,
    ScheduleEvent,
    ScheduleMetadata,
    ScraperSource,
    clean_html,
    format_utc_timestamp,
    local_time_label,
    localize_source_time,
    normalized_events,
)

CHANNEL_ID = "quebec-canal-assemblee"
PROGRAMME_URL = "https://www.assnat.qc.ca/fr/video-audio/canal-assemblee/semaine-cours.html"
SOURCE: ScraperSource = {
    "id": "quebec-canal-assemblee",
    "channel_ids": [CHANNEL_ID],
    "url": PROGRAMME_URL,
    "method": "GET",
    "headers": {},
    "notes": (
        "Official weekly programme for the separate linear Canal de l'Assemblée (canal17); "
        "never copied to the canal01–14 event webcasts. Retains explicitly printed time ranges."
    ),
}

DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
MONTHS = {
    month: number
    for number, month in enumerate(
        [
            "janvier",
            "fevrier",
            "mars",
            "avril",
            "mai",
            "juin",
            "juillet",
            "aout",
            "septembre",
            "octobre",
            "novembre",
            "decembre",
        ],
        1,
    )
}
DAY_SECTION_RE = re.compile(r"<h3\b[^>]*>(.*?)</h3>(.*?)(?=<h3\b|$)", re.I | re.S)
PARAGRAPH_RE = re.compile(r"<p\b[^>]*>(.*?)</p>", re.I | re.S)
CLOCK_RE = re.compile(r"(\d{1,2})\s*h(?:\s*(\d{1,2}))?", re.I)


def _day(heading: str) -> datetime | None:
    text = unicodedata.normalize("NFKD", clean_html(heading)).encode("ascii", "ignore").decode()
    match = re.fullmatch(r"(\w+)\s+(\d{1,2})\s+(\w+)\s+(\d{4})", text.casefold())
    if not match or match[1] not in DAYS or match[3] not in MONTHS:
        return None
    try:
        day = datetime(int(match[4]), MONTHS[match[3]], int(match[2]))
    except ValueError:
        return None
    return day if day.weekday() == DAYS.index(match[1]) else None


def _clock(value: str, day: datetime, *, end: bool = False) -> datetime | None:
    match = CLOCK_RE.fullmatch(value.strip())
    if not match:
        return None
    hour, minute = int(match[1]), int(match[2] or 0)
    if end and hour == 24 and minute == 0:
        return day + timedelta(days=1)
    try:
        return day.replace(hour=hour, minute=minute)
    except ValueError:
        return None


def _programme(paragraph: str, day: datetime) -> ScheduleEvent | None:
    time = re.match(r"\s*<strong\b[^>]*>(.*?)</strong>", paragraph, re.I | re.S)
    if not time:
        return None
    parts = re.split(r"\s+à\s+", clean_html(time[1]), maxsplit=1)
    local_start = _clock(parts[0], day)
    if local_start is None:
        return None
    start = localize_source_time(local_start, "America/Toronto")
    if start is None:
        return None
    lines = [
        clean_html(line) for line in re.split(r"<br\s*/?>", paragraph[time.end() :], flags=re.I)
    ]
    lines = [line for line in lines if line]
    if not lines:
        return None
    title = lines[0]
    if len(lines) > 1 and lines[1].casefold().startswith(
        ("en direct", "en reprise", "en rediffusion")
    ):
        title = f"{title} - {lines[1]}"
    event: ScheduleEvent = {
        "start": start,
        "title": title,
        "language": "fr",
        "url": f"{PROGRAMME_URL}#{DAYS[day.weekday()]}",
    }
    if len(parts) == 2:
        local_end = _clock(parts[1], day, end=True)
        if (
            local_end is not None
            and local_end < local_start
            and local_start.hour >= 12
            and local_end.hour < 12
        ):
            local_end += timedelta(days=1)
        if local_end is not None and local_end > local_start:
            end = localize_source_time(local_end, "America/Toronto")
            if end is not None:
                event["end"] = end
    return event


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    # The next main-column sibling ends the published programme. Navigation,
    # calendar widgets and footer content must not become programme rows.
    content = re.split(r'<div\b[^>]*class=["\'][^"\']*\bimbDroite\b', html, maxsplit=1)[0]
    sections = [
        (day, section)
        for heading, section in DAY_SECTION_RE.findall(content)
        if (day := _day(heading)) is not None
    ]
    if not sections:
        raise ValueError("Quebec linear programme has no recognized dated day headings")
    weeks = {day.date() - timedelta(days=day.weekday()) for day, _ in sections}
    if len(weeks) != 1:
        raise ValueError("Quebec linear programme day headings do not identify one source week")
    week_end = next(iter(weeks)) + timedelta(days=6)
    if week_end < now.astimezone(ZoneInfo("America/Toronto")).date():
        raise ValueError(f"Quebec linear programme is stale: source week ended {week_end}")
    events: list[ScheduleEvent] = []
    for day, section in sections:
        for paragraph in PARAGRAPH_RE.findall(section):
            event = _programme(paragraph, day)
            if event is not None:
                events.append(event)
            elif clean_html(paragraph):
                raise ValueError(
                    "Quebec linear programme contains an unrecognized or unresolved row"
                )
        if clean_html(PARAGRAPH_RE.sub("", section)):
            raise ValueError("Quebec linear programme contains unrecognized day-section markup")
    events.sort(key=lambda event: event["start"])
    current = next(
        (event for event in events if event["start"] <= now < event.get("end", event["start"])),
        None,
    )
    upcoming = next(
        (event for event in events if event is not current and event["start"] >= now), None
    )
    if not events:
        return {}
    schedule: ScheduleMetadata = {
        "current_event_title": current["title"] if current else None,
        "current_event_time": local_time_label(current["start"]) if current else None,
        "next_event_title": upcoming["title"] if upcoming else None,
        "next_event_time": local_time_label(upcoming["start"]) if upcoming else None,
        "confidence": "official_linear_channel_weekly_programme",
        "events": normalized_events(CHANNEL_ID, events, now, source_timezone="America/Toronto"),
    }
    if current:
        schedule["current_event_start"] = format_utc_timestamp(current["start"])
        schedule["current_event_url"] = current["url"]
        schedule["current_event_language"] = "fr"
    if upcoming:
        schedule["next_event_start"] = format_utc_timestamp(upcoming["start"])
        schedule["next_event_url"] = upcoming["url"]
        schedule["next_event_language"] = "fr"
    return {CHANNEL_ID: schedule}
