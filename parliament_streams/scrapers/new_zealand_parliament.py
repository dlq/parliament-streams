"""Parser for New Zealand Parliament's public calendar page."""

from __future__ import annotations

import re
from datetime import UTC, datetime

from .common import ParsedSchedule, ScraperSource, checked_label, clean_html, first_match

SOURCE: ScraperSource = {
    "id": "new-zealand-parliament",
    "channel_ids": ["new-zealand-parliament"],
    "url": "https://www3.parliament.nz/en/calendar/week",
    "method": "GET",
    "headers": {},
    "notes": "Extracts the House next meets text from the official weekly calendar.",
}

BOT_PROTECTION_PATTERN = re.compile(
    r"(?:captcha page|verifying your browser before proceeding)", re.IGNORECASE
)


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    has_calendar_content = "house-session__text" in html or "Parliament Calendar" in html
    if BOT_PROTECTION_PATTERN.search(html) or (
        "perfdrive.com" in html.casefold() and not has_calendar_content
    ):
        raise ValueError("official calendar returned a bot-protection page")
    now = now or datetime.now(UTC)
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
    if not status and not next_text:
        return {}
    current_title = status_text
    if current_title and re.match(r"The\s+House next meets\b", current_title, re.IGNORECASE):
        current_title = None
    return {
        "new-zealand-parliament": {
            "current_event_title": current_title,
            "current_event_time": checked_label(now, "Pacific/Auckland") if current_title else None,
            "next_event_title": "House next meets" if next_text else None,
            "next_event_time": next_text,
            "confidence": "official_calendar",
        }
    }
