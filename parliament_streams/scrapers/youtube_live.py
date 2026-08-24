"""Conservative resolver for official YouTube live pages."""

from __future__ import annotations

import re
from collections.abc import Callable
from datetime import UTC, datetime
from html import unescape
from urllib.parse import parse_qs, urlparse

from .common import (
    FetchRequest,
    ParsedSchedule,
    ScheduleMetadata,
    ScraperSource,
    checked_label,
    clean_html,
)

TARGETS = {
    "uk-parliament-youtube": "https://www.youtube.com/channel/UCMasyWuE1P2AaEKw_FkGq9g/live",
    "australia-parliament-youtube": "https://www.youtube.com/@AUSParliamentLive/live",
    "costa-rica-assembly-youtube": "https://www.youtube.com/@AsambleaCRC/live",
}

SOURCE: ScraperSource = {
    "id": "youtube-live",
    "channel_ids": list(TARGETS),
    "urls": list(TARGETS.values()),
    "method": "GET",
    "headers": {
        "Accept-Language": "en-US,en;q=0.9",
    },
    "notes": (
        "Checks official YouTube /live pages for explicit current watch metadata. "
        "It does not extract YouTube manifests and intentionally returns empty "
        "when a channel page does not expose a clear watch video."
    ),
}

Fetcher = Callable[[FetchRequest, int, int], str]

VIDEO_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
CANONICAL_RE = re.compile(
    r"<link[^>]+rel=[\"']canonical[\"'][^>]+href=[\"']([^\"']+)[\"']",
    re.IGNORECASE,
)
OG_URL_RE = re.compile(
    r"<meta[^>]+property=[\"']og:url[\"'][^>]+content=[\"']([^\"']+)[\"']",
    re.IGNORECASE,
)
URL_CANONICAL_RE = re.compile(
    r'"urlCanonical"\s*:\s*"(https?:\\?/\\?/www\.youtube\.com/watch\?v=[^"]+)"'
)
OG_TITLE_RE = re.compile(
    r"<meta[^>]+property=[\"']og:title[\"'][^>]+content=[\"']([^\"']+)[\"']",
    re.IGNORECASE | re.DOTALL,
)
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)
LIVE_MARKERS = ("BADGE_STYLE_TYPE_LIVE_NOW", '"isLiveNow":true', "LIVE_NOW")
UPCOMING_MARKERS = ("upcomingEventData", "UPCOMING")


def _normalize_url(value: str) -> str:
    return unescape(value).replace("\\u0026", "&").replace("\\/", "/")


def _video_id_from_url(value: str) -> str | None:
    url = _normalize_url(value)
    parsed = urlparse(url)
    video_id = parse_qs(parsed.query).get("v", [""])[0]
    if parsed.path == "/watch" and VIDEO_ID_RE.match(video_id):
        return video_id
    return None


def _watch_video_id(html: str) -> str | None:
    for pattern in (CANONICAL_RE, OG_URL_RE, URL_CANONICAL_RE):
        match = pattern.search(html)
        if not match:
            continue
        video_id = _video_id_from_url(match.group(1))
        if video_id:
            return video_id
    return None


def _status(html: str) -> str:
    if any(marker in html for marker in LIVE_MARKERS):
        return "Live now"
    if any(marker in html for marker in UPCOMING_MARKERS):
        return "Upcoming"
    return "Provider current video"


def _title(html: str) -> str:
    for pattern in (OG_TITLE_RE, TITLE_RE):
        match = pattern.search(html)
        if not match:
            continue
        title = clean_html(match.group(1)).removesuffix(" - YouTube").strip()
        if title:
            return title
    return "Official YouTube live page"


def parse(
    html: str,
    now: datetime | None = None,
    *,
    channel_id: str = "uk-parliament-youtube",
) -> ParsedSchedule:
    now = now or datetime.now(UTC)
    video_id = _watch_video_id(html)
    if not video_id:
        return {}

    status = _status(html)
    if status == "Provider current video":
        return {}
    is_live = status == "Live now"
    schedule: ScheduleMetadata = {
        "current_event_title": _title(html) if is_live else None,
        "current_event_time": status if is_live else None,
        "next_event_title": None if is_live else _title(html),
        "next_event_time": None if is_live else checked_label(now),
        "confidence": "official_youtube_live_page_static_metadata",
    }
    prefix = "current" if is_live else "next"
    schedule[f"{prefix}_event_url"] = f"https://www.youtube.com/watch?v={video_id}"  # type: ignore[literal-required]
    schedule[f"{prefix}_event_id"] = video_id  # type: ignore[literal-required]
    schedule[f"{prefix}_event_status"] = status  # type: ignore[literal-required]
    return {channel_id: schedule}


def collect(
    fetcher: Fetcher,
    now: datetime,
    timeout: int,
    retries: int,
) -> tuple[ParsedSchedule, list[str]]:
    parsed: ParsedSchedule = {}
    urls: list[str] = []
    for channel_id, url in TARGETS.items():
        urls.append(url)
        html = fetcher(
            {
                "url": url,
                "method": "GET",
                "headers": dict(SOURCE.get("headers", {})),
            },
            timeout,
            retries,
        )
        parsed.update(parse(html, now=now, channel_id=channel_id))
    return parsed, urls


def source_url_for_channel(channel_id: str, urls: list[str]) -> str:
    return TARGETS.get(channel_id) or urls[0]
