"""Parser for New Zealand Parliament's public calendar page."""

from __future__ import annotations

from datetime import UTC, datetime

from .common import ParsedSchedule, ScraperSource, checked_label, clean_html, first_match

SOURCE: ScraperSource = {
    "id": "new-zealand-parliament",
    "channel_ids": ["new-zealand-parliament"],
    "url": "https://www3.parliament.nz/en/calendar/",
    "method": "GET",
    "headers": {"User-Agent": "Mozilla/5.0"},
    "notes": "Extracts the House next meets text from the official calendar page.",
}


def parse(html: str, now: datetime | None = None) -> ParsedSchedule:
    if "captcha page" in html.lower() or "perfdrive.com" in html.lower():
        raise ValueError("official calendar returned a bot-protection page")
    now = now or datetime.now(UTC)
    body = clean_html(html)
    status = first_match(
        html,
        r'<span[^>]*class="[^"]*house-session__text[^"]*"[^>]*>([\s\S]*?)</span>',
    )
    next_text = first_match(body, r"The\s+House next meets\s+(?:on\s+)?([^\.]+\.?)")
    next_text = next_text or first_match(body, r"House next meets\s+(?:on\s+)?([^\.]+\.?)")
    if not status and not next_text:
        return {}
    status = clean_html(status or "House not currently listed live")
    return {
        "new-zealand-parliament": {
            "current_event_title": status,
            "current_event_time": checked_label(now, "Pacific/Auckland"),
            "next_event_title": "House next meets" if next_text else None,
            "next_event_time": next_text,
            "confidence": "official_calendar",
        }
    }
