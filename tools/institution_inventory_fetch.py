"""Bounded, review-only public HTTP fetching for the legislature inventory monitor."""

from __future__ import annotations

import ipaddress
import re
import socket
import ssl
import threading
import time
from datetime import UTC, datetime
from http.client import HTTPException
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, HTTPSHandler, Request, build_opener

import certifi

from parliament_streams.healthcheck import request_url
from tools.institution_inventory_sources import safe_public_url

USER_AGENT = "ParliamentStreamsInventoryReview/1.0 (+https://github.com/dlq/parliament-streams)"
PAUSE_STATUSES = frozenset({401, 403, 429, 503})
REDIRECT_STATUSES = frozenset({301, 302, 303, 307, 308})
MAX_REDIRECTS = 10


def _public_endpoint(url: str) -> tuple[str, str]:
    """Validate syntax and all current DNS answers before any request is sent.

    The check applies separately to each redirect. A failed lookup or a mixed
    public/private answer is an access gap, never a reason to try other routes.
    """
    normalized = safe_public_url(url)
    if normalized is None:
        raise ValueError("Evidence target is not a public HTTP(S) URL")
    parts = urlsplit(normalized)
    host = parts.hostname
    assert host is not None
    port = 443 if parts.scheme == "https" else 80
    answers = socket.getaddrinfo(host, port, type=socket.SOCK_STREAM)
    if not answers:
        raise ValueError("Evidence target has no DNS address answers")
    for answer in answers:
        try:
            address = ipaddress.ip_address(answer[4][0])
        except ValueError as error:
            raise ValueError("Evidence target returned a malformed DNS address") from error
        if not address.is_global:
            raise ValueError("Evidence target resolves to a non-public address")
    return request_url(normalized), host


class PublicRedirects(HTTPRedirectHandler):
    """Validate redirects, then leave following to the per-host bounded fetch loop.

    Automatic urllib following would retain the original host's lock while taking
    another host's lock. Returning None lets each hop finish before another starts.
    """

    def redirect_request(
        self, req: Any, fp: Any, code: int, msg: str, headers: Any, newurl: str
    ) -> Any:
        _public_endpoint(newurl)
        return None


class HostGate:
    """Serialize each host's requests and pause it after access or rate-limit blocks."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.host_locks: dict[str, threading.Lock] = {}
        self.last_request: dict[str, float] = {}
        self.blocked: dict[str, str] = {}

    def host_lock(self, host: str) -> threading.Lock:
        with self.lock:
            return self.host_locks.setdefault(host, threading.Lock())


def _usable_prior(
    source: dict[str, Any], previous: dict[str, Any] | None, initial_url: str
) -> bool:
    if not previous or source.get("kind") == "ipu":
        return False
    fingerprint = previous.get("fingerprint")
    source_url = previous.get("url")
    final_url = previous.get("final_url")
    return (
        previous.get("source_id") == source["id"]
        and isinstance(source_url, str)
        and safe_public_url(source_url) == initial_url
        and isinstance(final_url, str)
        and safe_public_url(final_url) is not None
        and isinstance(fingerprint, str)
        and re.fullmatch(r"[a-f0-9]{64}", fingerprint) is not None
    )


def _conditional_headers(previous: dict[str, Any] | None) -> dict[str, str]:
    headers: dict[str, str] = {}
    if previous is None:
        return headers
    for field, name in (("etag", "If-None-Match"), ("last_modified", "If-Modified-Since")):
        value = previous.get(field)
        if (
            isinstance(value, str)
            and 0 < len(value) <= 1024
            and not re.search(r"[\x00-\x1f\x7f]", value)
        ):
            headers[name] = value
    return headers


def _response_gap(result: dict[str, Any], status: int, message: str) -> dict[str, Any]:
    return {**result, "ok": False, "http_status": status, "error": message}


def fetch_source(
    source: dict[str, Any],
    previous: dict[str, Any] | None,
    gate: HostGate,
    timeout: float,
    max_bytes: int,
) -> dict[str, Any]:
    """Read one public source with no retries, authentication or challenge bypass.

    Each failed or partial response is an access gap. Only a validated conditional
    304 can reuse previously parsed evidence; stale data never becomes a fresh read.
    """
    result: dict[str, Any] = {
        "source_id": source["id"],
        "checked_at": datetime.now(UTC).isoformat(),
    }
    if not source.get("safe") or max_bytes < 1 or timeout <= 0:
        return {**result, "ok": False, "error": "Invalid URL or bounded request parameters"}
    initial_url = safe_public_url(source["url"])
    if initial_url is None:
        return {**result, "ok": False, "error": "Invalid or non-public evidence URL"}
    prior_valid = _usable_prior(source, previous, initial_url)
    url = initial_url
    visited: set[str] = set()
    try:
        opener = build_opener(
            PublicRedirects(),
            HTTPSHandler(context=ssl.create_default_context(cafile=certifi.where())),
        )
        for _ in range(MAX_REDIRECTS + 1):
            normalized, host = _public_endpoint(url)
            if normalized in visited:
                raise ValueError("Evidence redirect loop; incomplete evidence")
            visited.add(normalized)
            redirect_url: str | None = None
            with gate.host_lock(host):
                if host in gate.blocked:
                    return {
                        **result,
                        "ok": False,
                        "error": gate.blocked[host],
                        "skipped_host_block": True,
                    }
                elapsed = time.monotonic() - gate.last_request.get(host, -float("inf"))
                if elapsed < 0.3:
                    time.sleep(0.3 - elapsed)
                headers = {
                    "User-Agent": USER_AGENT,
                    "Accept": "application/json,text/html,application/pdf;q=0.8,*/*;q=0.5",
                }
                conditionals: dict[str, str] = {}
                if (
                    prior_valid
                    and previous is not None
                    and safe_public_url(previous["final_url"]) == normalized
                ):
                    conditionals = _conditional_headers(previous)
                    headers.update(conditionals)
                gate.last_request[host] = time.monotonic()
                try:
                    with opener.open(
                        Request(normalized, headers=headers), timeout=timeout
                    ) as response:
                        status = response.status
                        if status != 200:
                            return _response_gap(
                                result, status, "Non-200 response; incomplete evidence"
                            )
                        final_url = safe_public_url(response.geturl())
                        if final_url != normalized:
                            raise ValueError(
                                "Unexpected automatic redirect; evidence not confirmed"
                            )
                        content_length = response.headers.get("Content-Length")
                        expected_bytes: int | None = None
                        if content_length is not None:
                            if not re.fullmatch(r"[0-9]+", content_length):
                                raise ValueError("Malformed Content-Length; incomplete evidence")
                            expected_bytes = int(content_length)
                            if expected_bytes > max_bytes:
                                return _response_gap(
                                    result,
                                    status,
                                    f"Response exceeds {max_bytes} byte limit; incomplete evidence",
                                )
                        body = response.read(max_bytes + 1)
                        if len(body) > max_bytes:
                            return _response_gap(
                                result,
                                status,
                                f"Response exceeds {max_bytes} byte limit; incomplete evidence",
                            )
                        if not body.strip() or (
                            expected_bytes is not None and len(body) != expected_bytes
                        ):
                            return _response_gap(
                                result, status, "Empty or truncated response; incomplete evidence"
                            )
                        return {
                            **result,
                            "ok": True,
                            "http_status": status,
                            "body": body,
                            "content_type": response.headers.get("Content-Type", "").lower(),
                            "final_url": final_url,
                            "etag": response.headers.get("ETag"),
                            "last_modified": response.headers.get("Last-Modified"),
                        }
                except HTTPError as error:
                    try:
                        if error.code == 304 and prior_valid and conditionals:
                            return {
                                **result,
                                "ok": True,
                                "not_modified": True,
                                "http_status": 304,
                            }
                        if error.code in PAUSE_STATUSES:
                            reason = f"Host requests paused after HTTP {error.code}"
                            if retry_after := error.headers.get("Retry-After"):
                                reason += f" (Retry-After: {retry_after[:80]})"
                            gate.blocked[host] = reason
                        if error.code in REDIRECT_STATUSES:
                            location = error.headers.get("Location")
                            if not location:
                                return _response_gap(
                                    result,
                                    error.code,
                                    "Redirect has no target; incomplete evidence",
                                )
                            redirect_url = urljoin(normalized, location)
                        else:
                            return _response_gap(
                                result,
                                error.code,
                                f"HTTP {error.code}; access gap, not institutional absence",
                            )
                    finally:
                        error.close()
            if redirect_url is not None:
                url = redirect_url
        raise ValueError("Evidence redirect limit exceeded; incomplete evidence")
    except (HTTPException, OSError, ValueError, URLError) as error:
        return {**result, "ok": False, "error": f"{type(error).__name__}: {error}"}
