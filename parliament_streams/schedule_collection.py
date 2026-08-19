"""Fetch, parse, and normalize current schedule data for static publication."""

from __future__ import annotations

import json
import ssl
import time
from collections.abc import Callable
from datetime import UTC, datetime
from http.client import HTTPException
from pathlib import Path
from types import ModuleType
from typing import Literal, NotRequired, TypedDict, cast
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

import certifi

from .scrapers import SCRAPERS
from .scrapers.common import FetchRequest, ParsedSchedule, ScheduleMetadata, ScraperSource

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


class SourceResult(TypedDict):
    status: Literal["ok", "empty", "error"]
    fetched_at: str
    urls: list[str]
    channel_count: int
    error: NotRequired[str]


class ScheduleSnapshot(TypedDict):
    schema_version: Literal[1]
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
) -> ScheduleSnapshot:
    collected_at = now or datetime.now(UTC)
    timestamp = utc_timestamp(collected_at)
    channels: dict[str, CollectedSchedule] = {}
    sources: dict[str, SourceResult] = {}

    for scraper_id, module in SCRAPERS.items():
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
                channels[channel_id] = {
                    **schedule,
                    "scraper": scraper_id,
                    "source_url": source_url,
                    "fetched_at": timestamp,
                }
            sources[scraper_id] = {
                "status": "ok" if parsed else "empty",
                "fetched_at": timestamp,
                "urls": urls,
                "channel_count": len(parsed),
            }
        except (json.JSONDecodeError, KeyError, TypeError, ValueError, RuntimeError) as error:
            sources[scraper_id] = {
                "status": "error",
                "fetched_at": timestamp,
                "urls": urls,
                "channel_count": 0,
                "error": str(error)[:500],
            }

    source_counts = {status: 0 for status in ("ok", "empty", "error")}
    for source in sources.values():
        source_counts[source["status"]] += 1
    return {
        "schema_version": 1,
        "generated_at": timestamp,
        "refresh_interval_hours": 6,
        "counts": {**source_counts, "channels": len(channels)},
        "channels": channels,
        "sources": sources,
    }


def write_snapshot(path: Path, snapshot: ScheduleSnapshot) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(snapshot, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
