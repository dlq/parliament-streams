"""Fetch, parse, and normalize current schedule data for static publication."""

from __future__ import annotations

import json
import ssl
import time
from collections.abc import Callable
from datetime import UTC, datetime, timedelta
from hashlib import sha256
from http.client import HTTPException
from pathlib import Path
from types import ModuleType
from typing import Literal, NotRequired, TypedDict, cast
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

import certifi

from .scrapers import SCRAPERS
from .scrapers.common import (
    FetchRequest,
    NormalizedScheduleEvent,
    ParsedSchedule,
    ScheduleMetadata,
    ScraperSource,
)

USER_AGENT = (
    "parliament-streams-schedule-collector/0.1 (+https://github.com/dlq/parliament-streams)"
)
DEFAULT_TIMEOUT_SECONDS = 15
DEFAULT_RETRIES = 1
MAX_RESPONSE_BYTES = 5 * 1024 * 1024
SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())


class CollectedSchedule(ScheduleMetadata):
    scraper: str
    source_url: str
    fetched_at: str
    last_success_at: str
    stale: NotRequired[bool]


class SourceResult(TypedDict):
    status: Literal["ok", "empty", "error"]
    fetched_at: str
    urls: list[str]
    channel_count: int
    channels_expected: int
    event_count: int
    events_with_official_id: int
    events_with_url: int
    events_with_end: int
    outcome_detail: str
    used_last_good: bool
    consecutive_failures: int
    last_success_at: NotRequired[str]
    coverage_start: NotRequired[str]
    coverage_end: NotRequired[str]
    error: NotRequired[str]


class SourceMetrics(TypedDict):
    event_count: int
    events_with_official_id: int
    events_with_url: int
    events_with_end: int
    coverage_start: NotRequired[str]
    coverage_end: NotRequired[str]


class ScheduleSnapshot(TypedDict):
    schema_version: Literal[3]
    generated_at: str
    refresh_interval_hours: Literal[6]
    counts: dict[str, int]
    channels: dict[str, CollectedSchedule]
    sources: dict[str, SourceResult]


Fetcher = Callable[[FetchRequest, int, int], str]
Parser = Callable[..., ParsedSchedule]
RequestFactory = Callable[[datetime], list[FetchRequest]]
SourceCollector = Callable[[Fetcher, datetime, int, int], tuple[ParsedSchedule, list[str]]]
SourceUrlResolver = Callable[[str, list[str]], str]


def _parsed_timestamp(value: object) -> datetime | None:
    if not isinstance(value, str):
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(UTC)
    except ValueError:
        return None


def _legacy_event_id(channel_id: str, title: str, start: str, position: str) -> str:
    identity = "\x1f".join((channel_id, title.casefold(), start, position))
    return f"generated-{sha256(identity.encode()).hexdigest()[:20]}"


def _status(value: object, *, current: bool) -> str:
    recorded = str(value or "").casefold()
    if "cancel" in recorded:
        return "cancelled"
    if current or any(marker in recorded for marker in ("live", "in progress", "en cours")):
        return "live"
    if "complete" in recorded or "ended" in recorded:
        return "completed"
    return "scheduled"


def _normalized_channel_events(
    channel_id: str, schedule: ScheduleMetadata
) -> list[NormalizedScheduleEvent]:
    existing = schedule.get("events")
    if existing:
        deduplicated = {event["id"]: event for event in existing}
        return sorted(deduplicated.values(), key=lambda event: event.get("start", ""))

    raw = cast(dict[str, object], schedule)
    events: list[NormalizedScheduleEvent] = []
    for position in ("current", "next"):
        title_value = raw.get(f"{position}_event_title")
        if not isinstance(title_value, str) or not title_value:
            continue
        title = title_value
        start = str(raw.get(f"{position}_event_start") or "")
        official_id = str(raw.get(f"{position}_event_id") or "")
        event: NormalizedScheduleEvent = {
            "id": official_id or _legacy_event_id(channel_id, title, start, position),
            "identifier_kind": "official" if official_id else "generated",
            "title": title,
            "status": _status(
                raw.get(f"{position}_event_status"),
                current=position == "current",
            ),
        }
        if start:
            event["start"] = start
        url = raw.get(f"{position}_event_url")
        location = raw.get(f"{position}_event_location")
        language = raw.get(f"{position}_event_language")
        if isinstance(url, str) and url:
            event["url"] = url
        if isinstance(location, str) and location:
            event["location"] = location
        if isinstance(language, str) and language:
            event["language"] = language
        events.append(event)
    return events


def _source_metrics(channels: dict[str, CollectedSchedule]) -> SourceMetrics:
    events = [event for schedule in channels.values() for event in schedule.get("events", [])]
    starts = sorted(event["start"] for event in events if event.get("start"))
    metrics: SourceMetrics = {
        "event_count": len(events),
        "events_with_official_id": sum(event["identifier_kind"] == "official" for event in events),
        "events_with_url": sum(bool(event.get("url")) for event in events),
        "events_with_end": sum(bool(event.get("end")) for event in events),
    }
    if starts:
        metrics["coverage_start"] = starts[0]
        metrics["coverage_end"] = starts[-1]
    return metrics


def _derive_legacy_fields(
    schedule: ScheduleMetadata, events: list[NormalizedScheduleEvent], now: datetime
) -> None:
    """Project canonical events into the version 2 Now/Next compatibility fields."""

    current = next((event for event in events if event["status"] == "live"), None)
    schedule_dict = cast(dict[str, object], schedule)
    upcoming = [
        event
        for event in events
        if event["status"] == "scheduled"
        and (
            _parsed_timestamp(event.get("start")) is None
            or cast(datetime, _parsed_timestamp(event.get("start"))) >= now
        )
    ]
    next_event = min(upcoming, key=lambda event: event.get("start", ""), default=None)
    for position, event in (("current", current), ("next", next_event)):
        schedule_dict[f"{position}_event_title"] = event["title"] if event else None
        schedule_dict[f"{position}_event_time"] = (
            "Live now" if position == "current" and event else event.get("start") if event else None
        )
        event_dict = cast(dict[str, object], event) if event else {}
        for field in ("start", "url", "location", "language"):
            key = f"{position}_event_{field}"
            value = event_dict.get(field)
            if value:
                schedule_dict[key] = value
            else:
                schedule_dict.pop(key, None)
        id_key = f"{position}_event_id"
        status_key = f"{position}_event_status"
        if event:
            schedule_dict[id_key] = event["id"]
            schedule_dict[status_key] = event["status"]
        else:
            schedule_dict.pop(id_key, None)
            schedule_dict.pop(status_key, None)


def _stale_channel(
    schedule: CollectedSchedule, now: datetime, ttl: timedelta
) -> CollectedSchedule | None:
    fetched_at = _parsed_timestamp(schedule.get("fetched_at"))
    if not fetched_at or now - fetched_at > ttl:
        return None
    future_events = []
    for event in schedule.get("events", []):
        start = _parsed_timestamp(event.get("start"))
        end = _parsed_timestamp(event.get("end"))
        if (start and start >= now) or (end and end >= now):
            future_events.append(event)
    if not future_events:
        return None
    retained = cast(CollectedSchedule, dict(schedule))
    retained["events"] = future_events
    retained["stale"] = True
    retained["current_event_title"] = None
    retained["current_event_time"] = None
    retained_dict = cast(dict[str, object], retained)
    for field in (
        "current_event_start",
        "current_event_url",
        "current_event_id",
        "current_event_status",
        "current_event_location",
        "current_event_language",
    ):
        retained_dict.pop(field, None)
    next_event = min(future_events, key=lambda event: event.get("start", ""))
    retained["next_event_title"] = next_event["title"]
    retained["next_event_time"] = next_event.get("start")
    if next_event.get("start"):
        retained["next_event_start"] = next_event["start"]
    if next_event.get("url"):
        retained["next_event_url"] = next_event["url"]
    retained["next_event_id"] = next_event["id"]
    retained["next_event_status"] = next_event["status"]
    return retained


def utc_timestamp(now: datetime | None = None) -> str:
    value = now or datetime.now(UTC)
    return value.astimezone(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")


def _default_requests(module: ModuleType) -> list[FetchRequest]:
    source = cast(ScraperSource, module.SOURCE)
    urls = source.get("urls") or [source["url"]]
    requests: list[FetchRequest] = []
    for url in urls:
        request: FetchRequest = {
            "url": url,
            "method": source.get("method", "GET"),
            "headers": dict(source.get("headers", {})),
        }
        if source.get("body"):
            request["body"] = dict(source["body"])
        requests.append(request)
    return requests


def request_specs(module: ModuleType, now: datetime) -> list[FetchRequest]:
    factory = cast(RequestFactory | None, getattr(module, "request_specs", None))
    return factory(now) if factory else _default_requests(module)


def fetch_text(spec: FetchRequest, timeout: int, retries: int) -> str:
    headers = {"User-Agent": USER_AGENT, "Accept": "text/html, application/json"}
    headers.update(spec.get("headers", {}))
    data = None
    if "body" in spec:
        data = json.dumps(spec["body"]).encode("utf-8")
        headers.setdefault("Content-Type", "application/json; charset=UTF-8")
        headers.setdefault("X-Requested-With", "XMLHttpRequest")

    attempts = max(1, retries + 1)
    last_error = "request failed"
    for attempt in range(1, attempts + 1):
        request = Request(spec["url"], data=data, headers=headers, method=spec["method"])
        try:
            with urlopen(request, timeout=timeout, context=SSL_CONTEXT) as response:
                body = cast(bytes, response.read(MAX_RESPONSE_BYTES + 1))
                if len(body) > MAX_RESPONSE_BYTES:
                    raise ValueError(f"response exceeded {MAX_RESPONSE_BYTES} bytes")
                charset = cast(str | None, response.headers.get_content_charset()) or "utf-8"
                return body.decode(charset, errors="replace")
        except HTTPError as error:
            last_error = f"HTTP {error.code}"
            if error.code < 500:
                break
        except (TimeoutError, URLError, ssl.SSLError, HTTPException, ValueError) as error:
            last_error = str(error)
        if attempt < attempts:
            time.sleep(0.5 * attempt)
    raise RuntimeError(last_error)


def collect_schedules(
    *,
    now: datetime | None = None,
    timeout: int = DEFAULT_TIMEOUT_SECONDS,
    retries: int = DEFAULT_RETRIES,
    fetcher: Fetcher = fetch_text,
    previous: ScheduleSnapshot | None = None,
    stale_ttl_hours: int = 24,
) -> ScheduleSnapshot:
    collected_at = now or datetime.now(UTC)
    timestamp = utc_timestamp(collected_at)
    channels: dict[str, CollectedSchedule] = {}
    sources: dict[str, SourceResult] = {}

    for scraper_id, module in SCRAPERS.items():
        source = cast(ScraperSource, module.SOURCE)
        configured_urls = source.get("urls") or [source["url"]]
        urls = list(configured_urls)
        source_channels: dict[str, CollectedSchedule] = {}
        try:
            source_collector = cast(SourceCollector | None, getattr(module, "collect", None))
            if source_collector:
                parsed, urls = source_collector(fetcher, collected_at, timeout, retries)
            else:
                specs = request_specs(module, collected_at)
                urls = [spec["url"] for spec in specs]
                payloads = [fetcher(spec, timeout, retries) for spec in specs]
                parser = cast(Parser, module.parse)
                parsed = parser(*payloads, now=collected_at)
            for channel_id, schedule in parsed.items():
                source_url_resolver = cast(
                    SourceUrlResolver | None, getattr(module, "source_url_for_channel", None)
                )
                source_url = (
                    source_url_resolver(channel_id, urls) if source_url_resolver else urls[0]
                )
                schedule["events"] = _normalized_channel_events(channel_id, schedule)
                _derive_legacy_fields(schedule, schedule["events"], collected_at)
                collected_schedule = cast(
                    CollectedSchedule,
                    {
                        **schedule,
                        "scraper": scraper_id,
                        "source_url": source_url,
                        "fetched_at": timestamp,
                        "last_success_at": timestamp,
                    },
                )
                channels[channel_id] = collected_schedule
                source_channels[channel_id] = collected_schedule
            metrics = _source_metrics(source_channels)
            sources[scraper_id] = cast(
                SourceResult,
                {
                    "status": "ok" if parsed else "empty",
                    "fetched_at": timestamp,
                    "urls": urls,
                    "channel_count": len(parsed),
                    "channels_expected": len(source.get("channel_ids", [])),
                    "outcome_detail": "events" if parsed else "no_events_in_window",
                    "used_last_good": False,
                    "consecutive_failures": 0,
                    **metrics,
                },
            )
            if parsed:
                sources[scraper_id]["last_success_at"] = timestamp
        except (json.JSONDecodeError, KeyError, TypeError, ValueError, RuntimeError) as error:
            previous_source = previous.get("sources", {}).get(scraper_id) if previous else None
            consecutive_failures = (
                int(previous_source.get("consecutive_failures", 0)) + 1 if previous_source else 1
            )
            used_last_good = False
            if previous:
                for channel_id, old_schedule in previous.get("channels", {}).items():
                    if old_schedule.get("scraper") != scraper_id:
                        continue
                    retained = _stale_channel(
                        old_schedule, collected_at, timedelta(hours=stale_ttl_hours)
                    )
                    if retained:
                        channels[channel_id] = retained
                        source_channels[channel_id] = retained
                        used_last_good = True
            metrics = _source_metrics(source_channels)
            sources[scraper_id] = cast(
                SourceResult,
                {
                    "status": "error",
                    "fetched_at": timestamp,
                    "urls": urls,
                    "channel_count": len(source_channels),
                    "channels_expected": len(source.get("channel_ids", [])),
                    "outcome_detail": "fetch_or_parse_error",
                    "used_last_good": used_last_good,
                    "consecutive_failures": consecutive_failures,
                    **metrics,
                    "error": str(error)[:500],
                },
            )
            if previous_source and previous_source.get("last_success_at"):
                sources[scraper_id]["last_success_at"] = previous_source["last_success_at"]

    source_counts = {status: 0 for status in ("ok", "empty", "error")}
    for source_result in sources.values():
        source_counts[source_result["status"]] += 1
    current_count = sum(bool(schedule.get("current_event_title")) for schedule in channels.values())
    upcoming_count = sum(bool(schedule.get("next_event_title")) for schedule in channels.values())
    complete_count = sum(
        bool(schedule.get("current_event_title") and schedule.get("next_event_title"))
        for schedule in channels.values()
    )
    all_events = [event for schedule in channels.values() for event in schedule.get("events", [])]
    return {
        "schema_version": 3,
        "generated_at": timestamp,
        "refresh_interval_hours": 6,
        "counts": {
            **source_counts,
            "channels": len(channels),
            "current": current_count,
            "upcoming": upcoming_count,
            "complete": complete_count,
            "events": len(all_events),
            "events_with_official_id": sum(
                event["identifier_kind"] == "official" for event in all_events
            ),
            "events_with_url": sum(bool(event.get("url")) for event in all_events),
            "events_with_end": sum(bool(event.get("end")) for event in all_events),
            "fresh_channels": sum(
                not schedule.get("stale", False) for schedule in channels.values()
            ),
            "stale_channels": sum(schedule.get("stale", False) for schedule in channels.values()),
        },
        "channels": channels,
        "sources": sources,
    }


def write_snapshot(path: Path, snapshot: ScheduleSnapshot) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(snapshot, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
