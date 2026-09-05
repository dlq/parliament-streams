"""Parser for New Zealand Parliament's public calendar page."""

from __future__ import annotations

import re
from datetime import UTC, datetime
from zoneinfo import ZoneInfo

from .common import ParsedSchedule, ScraperSource, checked_label, clean_html, first_match

SOURCE: ScraperSource = {
    "id": "new-zealand-parliament",
    "channel_ids": ["new-zealand-parliament"],
    "url": "https://prod-win-client-home.azurewebsites.net/calendar?lang=en",
    "method": "GET",
    "headers": {},
    "notes": "Extracts current and next House sitting days from the official calendar.",
}

BOT_PROTECTION_PATTERN = re.compile(
    r"(?:captcha page|verifying your browser before proceeding)", re.IGNORECASE
)

MONTH_PATTERN = re.compile(
    r'<span[^>]*class="[^"]*calendar-date[^"]*"[^>]*>\s*([A-Za-z]+\s+\d{4})\s*</span>'
)
DAY_PATTERN = re.compile(
    r'<button[^>]*class="([^"]*\bhouse-sitting-day\b[^"]*)"[^>]*>'
    r'[\s\S]*?<span[^>]*class="[^"]*date-number[^"]*"[^>]*>\s*(\d{1,2})\s*</span>'
    r"[\s\S]*?</button>"
)


def _sitting_dates(html: str) -> list[datetime]:
    month_match = MONTH_PATTERN.search(html)
    if not month_match:
        return []
    month = datetime.strptime(month_match.group(1), "%B %Y")
    dates: list[datetime] = []
    for classes, day_text in DAY_PATTERN.findall(html):
        if "day-not-in-month" in classes:
            continue
        dates.append(
            datetime(
                month.year,
                month.month,
                int(day_text),
                tzinfo=ZoneInfo("Pacific/Auckland"),
            )
        )
    return dates


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    has_calendar_content = "house-session__text" in html or "Parliament Calendar" in html
    if BOT_PROTECTION_PATTERN.search(html) or (
        "perfdrive.com" in html.casefold() and not has_calendar_content
    ):
        raise ValueError("official calendar returned a bot-protection page")
    now = now or datetime.now(UTC)
    local_now = now.astimezone(ZoneInfo("Pacific/Auckland"))
    sitting_dates = _sitting_dates(html)
    current_sitting = next(
        (date for date in sitting_dates if date.date() == local_now.date()), None
    )
    next_sitting = next((date for date in sitting_dates if date.date() > local_now.date()), None)
    body = clean_html(html)
    status = first_match(
        html,
        r'<span[^>]*class="[^"]*house-session__text[^"]*"[^>]*>([\s\S]*?)</span>',
    )
    status_text = clean_html(status) if status else None
    next_text = (
        first_match(status_text, r"The\s+House next meets\s+(?:on\s+)?(.+)")
        if status_text
        else None
    )
    next_text = next_text or first_match(body, r"The\s+House next meets\s+(?:on\s+)?([^\.]+\.?)")
    next_text = next_text or first_match(body, r"House next meets\s+(?:on\s+)?([^\.]+\.?)")
    if next_sitting:
        next_text = f"{next_sitting:%A}, {next_sitting.day} {next_sitting:%B %Y}"
    if not status and not next_text and not current_sitting:
        return {}
    current_title = status_text
    if current_title and re.match(r"The\s+House next meets\b", current_title, re.IGNORECASE):
        current_title = None
    if current_sitting:
        current_title = "House sitting day"
    return {
        "new-zealand-parliament": {
            "current_event_title": current_title,
            "current_event_time": checked_label(now, "Pacific/Auckland") if current_title else None,
            "next_event_title": "House next meets" if next_text else None,
            "next_event_time": next_text,
            "confidence": "official_calendar",
        }
    }
