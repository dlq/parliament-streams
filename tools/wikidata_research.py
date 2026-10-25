"""Cached, polite Wikidata research requests shared across local research batches.

One network attempt per call. Callers handle Cooldown without blocking their UI;
service errors persist an increasing cooldown across process restarts.
"""

from __future__ import annotations

import argparse
import contextlib
import fcntl
import hashlib
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import UTC
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Any, NoReturn

API = "https://www.wikidata.org/w/api.php"
DEFAULT_CACHE = Path(__file__).resolve().parents[1] / ".cache" / "wikidata"
QUERY_ERRORS = {"params-illegal", "badvalue", "missingparam", "unknown_action", "invalidentityid"}


class QueryError(RuntimeError):
    """A rejected query must be corrected, rather than retried as a service outage."""


class Cooldown(RuntimeError):
    """The shared service cooldown has not elapsed."""

    def __init__(self, seconds: float, reason: str):
        self.seconds = max(0.0, seconds)
        super().__init__(f"Wikidata cooldown: {self.seconds:.0f}s remaining ({reason})")


def request_url(params: dict[str, Any]) -> str:
    values = {**params, "format": "json", "maxlag": 5}
    return API + "?" + urllib.parse.urlencode(sorted(values.items()))


def retry_after_seconds(value: str | None, now: float) -> float:
    if not value:
        return 0.0
    try:
        return max(0.0, float(value))
    except ValueError:
        try:
            date = parsedate_to_datetime(value)
            if date.tzinfo is None:
                date = date.replace(tzinfo=UTC)
            return max(0.0, date.timestamp() - now)
        except (ValueError, TypeError, OverflowError):
            return 0.0


def _read(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text()) if path.exists() else {}


def _write(path: Path, data: dict[str, Any]) -> None:
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    temporary.replace(path)


class WikidataClient:
    def __init__(self, cache_dir: Path = DEFAULT_CACHE):
        self.cache_dir = cache_dir
        cache_dir.mkdir(parents=True, exist_ok=True)
        self.state_path = cache_dir / "service-state.json"
        self.last_cache_hit = False
        self.last_response_fetched_at: float | None = None

    def _cache_path(self, url: str) -> Path:
        return self.cache_dir / (hashlib.sha256(url.encode()).hexdigest() + ".json")

    def _hold(
        self,
        state: dict[str, Any],
        reason: str,
        retry_after: str | None = None,
        access_block: bool = False,
    ) -> NoReturn:
        now = time.time()
        failures = int(state.get("consecutive_failures", 0)) + 1
        delay = max(
            min(60 * 2 ** min(failures - 1, 10), 3600),
            retry_after_seconds(retry_after, now),
            86400 if access_block else 0,
        )
        _write(
            self.state_path,
            {"consecutive_failures": failures, "next_allowed_at": now + delay, "reason": reason},
        )
        raise Cooldown(delay, reason)

    def get(self, params: dict[str, Any]) -> dict[str, Any]:
        url = request_url(params)
        cache_path = self._cache_path(url)
        # A file lock serializes independent batches and protects both cache and cooldown.
        with (self.cache_dir / "service.lock").open("a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            cached = _read(cache_path)
            now = time.time()
            if cached and cached.get("expires_at", 0) > now:
                self.last_cache_hit = True
                self.last_response_fetched_at = cached.get(
                    "fetched_at", cached.get("source_evidence_at")
                )
                return dict(cached["data"])
            self.last_cache_hit = False
            self.last_response_fetched_at = None
            state = _read(self.state_path)
            if state.get("next_allowed_at", 0) > now:
                raise Cooldown(state["next_allowed_at"] - now, state.get("reason", "spacing"))
            request = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "ParliamentStreamsResearch/1.0 (https://github.com/dlq/parliament-streams)"
                },
            )
            try:
                with urllib.request.urlopen(request, timeout=25) as response:
                    data = json.load(response)
                    retry_after = response.headers.get("Retry-After")
            except urllib.error.HTTPError as error:
                if 400 <= error.code < 500 and error.code not in {401, 403, 408, 429}:
                    _write(self.state_path, {**state, "next_allowed_at": time.time() + 3})
                    raise QueryError(f"HTTP {error.code}: query rejected") from error
                self._hold(
                    state,
                    f"HTTP {error.code}",
                    error.headers.get("Retry-After"),
                    access_block=error.code in {401, 403},
                )
            except (OSError, ValueError) as error:
                self._hold(state, f"network or response error: {type(error).__name__}")
            if "error" in data:
                code = data["error"].get("code", "error")
                if code in QUERY_ERRORS:
                    _write(self.state_path, {**state, "next_allowed_at": time.time() + 3})
                    raise QueryError(f"API {code}: {data['error'].get('info', '')}")
                self._hold(state, f"API {code}", retry_after)
            self.last_response_fetched_at = time.time()
            ttl = 86400 if params.get("action") == "wbsearchentities" else 7 * 86400
            _write(
                cache_path,
                {
                    "url": url,
                    "fetched_at": time.time(),
                    "expires_at": time.time() + ttl,
                    "data": data,
                },
            )
            _write(
                self.state_path,
                {
                    "consecutive_failures": 0,
                    "next_allowed_at": time.time() + 3,
                    "reason": "request spacing",
                },
            )
            return dict(data)

    def import_search(
        self, url: str, matches: list[dict[str, Any]], checked_at: float, evidence_report: str
    ) -> bool:
        """Seed a retained successful search, including empty results, without refetching.

        Older evidence retained only these result fields; mark that narrower scope.
        Failed requests must never be imported through this method.
        """
        parsed = urllib.parse.urlparse(url)
        if (
            parsed.scheme != "https"
            or parsed.netloc != "www.wikidata.org"
            or parsed.path != "/w/api.php"
        ):
            raise ValueError("Not a Wikidata API URL")
        params = dict(urllib.parse.parse_qsl(parsed.query))
        if params.get("action") != "wbsearchentities":
            raise ValueError("Only retained search results may be imported")
        canonical = request_url(params)
        with (self.cache_dir / "service.lock").open("a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            path = self._cache_path(canonical)
            if path.exists():
                return False
            _write(
                path,
                {
                    "url": canonical,
                    "source_evidence_at": checked_at,
                    "expires_at": checked_at + 86400,
                    "data": {
                        "search": matches,
                        "_retained_fields_only": True,
                        "_evidence_report": evidence_report,
                    },
                },
            )
        return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("params", help='JSON object, e.g. {"action":"wbsearchentities",...}')
    parser.add_argument("--cache-dir", type=Path, default=DEFAULT_CACHE)
    args = parser.parse_args()
    client = WikidataClient(args.cache_dir)
    with contextlib.suppress(KeyboardInterrupt):
        try:
            print(json.dumps(client.get(json.loads(args.params)), ensure_ascii=False, indent=2))
            return 0
        except Cooldown as error:
            print(str(error), file=sys.stderr)
            return 75
        except QueryError as error:
            print(str(error), file=sys.stderr)
            return 2
    return 130


if __name__ == "__main__":
    raise SystemExit(main())
