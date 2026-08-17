"""Live endpoint health checks for catalogue entries."""

from __future__ import annotations

import argparse
import json
import ssl
import sys
import time
from collections.abc import Mapping
from datetime import UTC, datetime
from http.client import HTTPException, HTTPResponse
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin
from urllib.request import Request, urlopen

from .catalogue import load_catalogue

USER_AGENT = "parliament-streams-healthcheck/0.1 (+https://github.com/dlq/parliament-streams)"
DEFAULT_TIMEOUT_SECONDS = 12
DEFAULT_RETRIES = 1
MAX_RESPONSE_BYTES = 256 * 1024


def _response_headers(response: HTTPResponse | HTTPError) -> dict[str, str]:
    return {key.lower(): value for key, value in response.headers.items()}


def _fetch_once(url: str, timeout: int) -> tuple[int | None, dict[str, str], bytes, str | None]:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(request, timeout=timeout) as response:
            return (
                response.status,
                _response_headers(response),
                response.read(MAX_RESPONSE_BYTES),
                response.geturl(),
            )
    except HTTPError as error:
        return error.code, _response_headers(error), error.read(16 * 1024), error.geturl()
    except (TimeoutError, URLError, ssl.SSLError, HTTPException) as error:
        return None, {}, str(error).encode("utf-8", errors="replace"), None


def _fetch(
    url: str, timeout: int, retries: int
) -> tuple[int | None, dict[str, str], bytes, str | None, int]:
    attempts = max(1, retries + 1)
    last_status: int | None = None
    last_headers: dict[str, str] = {}
    last_body = b""
    last_final_url: str | None = None

    for attempt in range(1, attempts + 1):
        last_status, last_headers, last_body, last_final_url = _fetch_once(url, timeout)
        if last_status is not None and last_status < 500:
            return last_status, last_headers, last_body, last_final_url, attempt
        if attempt < attempts:
            time.sleep(0.5 * attempt)

    return last_status, last_headers, last_body, last_final_url, attempts


def _looks_like_hls(body: bytes) -> bool:
    return body.lstrip().startswith(b"#EXTM3U")


def _hls_variant_count(body: bytes) -> int:
    return body.count(b"#EXT-X-STREAM-INF")


def _hls_media_playlist_count(body: bytes) -> int:
    return body.count(b"#EXTINF")


def _looks_like_dash(body: bytes) -> bool:
    sample = body[:4096].lower()
    return b"<mpd" in sample and b"</mpd" in body.lower()


def _utc_timestamp() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")


def _check_hls(body: bytes, final_url: str | None, timeout: int, retries: int) -> dict[str, Any]:
    if not _looks_like_hls(body):
        return {"status": "warning", "note": "Response did not start with #EXTM3U."}

    variant_count = _hls_variant_count(body)
    media_count = _hls_media_playlist_count(body)
    result: dict[str, Any] = {
        "status": "ok",
        "note": "HLS manifest detected.",
        "hls_variant_count": variant_count,
        "hls_media_playlist_count": media_count,
    }

    if variant_count and final_url:
        variant_url = None
        lines = body.decode("utf-8", errors="replace").splitlines()
        for index, line in enumerate(lines):
            if line.startswith("#EXT-X-STREAM-INF") and index + 1 < len(lines):
                variant_url = urljoin(final_url, lines[index + 1].strip())
                break
        if variant_url:
            status_code, headers, variant_body, resolved_url, attempts = _fetch(
                variant_url, timeout, retries
            )
            result["sample_variant"] = {
                "url": variant_url,
                "http_status": status_code,
                "content_type": headers.get("content-type"),
                "final_url": resolved_url,
                "attempts": attempts,
                "looks_like_hls": _looks_like_hls(variant_body),
            }
            if status_code is None or status_code >= 400 or not _looks_like_hls(variant_body):
                result["status"] = "warning"
                result["note"] = "HLS master detected, but sample variant check failed."

    return result


def check_channel(channel: Mapping[str, Any], timeout: int, retries: int) -> dict[str, Any]:
    url = channel.get("playback_url") or channel.get("official_url")
    result: dict[str, Any] = {
        "id": channel["id"],
        "source_type": channel["source_type"],
        "url": url,
        "checked_at": _utc_timestamp(),
    }

    if not url:
        result.update({"status": "skipped", "note": "No URL available for this entry."})
        return result

    status_code, headers, body, final_url, attempts = _fetch(url, timeout, retries)
    result.update(
        {
            "http_status": status_code,
            "content_type": headers.get("content-type"),
            "final_url": final_url,
            "attempts": attempts,
        }
    )

    if status_code is None:
        result.update({"status": "error", "note": body.decode("utf-8", errors="replace")[:500]})
    elif status_code >= 400:
        result.update({"status": "error", "note": f"HTTP {status_code}"})
    elif channel["source_type"] == "direct_hls":
        result.update(_check_hls(body, final_url, timeout, retries))
    elif channel["source_type"] == "direct_dash":
        result.update(
            {
                "status": "ok" if _looks_like_dash(body) else "warning",
                "note": "DASH MPD detected."
                if _looks_like_dash(body)
                else "Response did not look like a DASH MPD.",
            }
        )
    else:
        result.update({"status": "ok", "note": "Official page/link reachable."})

    return result


def run_healthcheck(
    catalogue_path: Path,
    timeout: int,
    retries: int,
    channel_ids: set[str] | None = None,
) -> dict[str, Any]:
    catalogue = load_catalogue(catalogue_path)
    channels = catalogue["channels"]
    if channel_ids:
        known_ids = {channel["id"] for channel in channels}
        unknown_ids = sorted(channel_ids - known_ids)
        if unknown_ids:
            raise ValueError(f"Unknown catalogue ids: {', '.join(unknown_ids)}")
        channels = [channel for channel in channels if channel["id"] in channel_ids]

    results = [check_channel(channel, timeout, retries) for channel in channels]
    counts: dict[str, int] = {}
    for result in results:
        counts[result["status"]] = counts.get(result["status"], 0) + 1
    return {
        "checked_at": _utc_timestamp(),
        "catalogue": str(catalogue_path),
        "timeout_seconds": timeout,
        "retries": retries,
        "total": len(results),
        "counts": counts,
        "results": results,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="python3 -m parliament_streams.healthcheck",
        description="Check live technical health for catalogue playback and official URLs.",
    )
    parser.add_argument(
        "--catalogue",
        type=Path,
        default=Path("data/channels.json"),
        help="Path to channels.json.",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=DEFAULT_TIMEOUT_SECONDS,
        help="Per-request timeout in seconds.",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=DEFAULT_RETRIES,
        help="Retries for transient network/server failures.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Optional JSON report output path.",
    )
    parser.add_argument(
        "--id",
        dest="channel_ids",
        action="append",
        help="Check one catalogue id; repeat this option to check multiple entries.",
    )
    args = parser.parse_args(argv)

    try:
        report = run_healthcheck(
            args.catalogue,
            args.timeout,
            args.retries,
            set(args.channel_ids) if args.channel_ids else None,
        )
    except ValueError as error:
        parser.error(str(error))
    encoded = json.dumps(report, indent=2, sort_keys=True)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(f"{encoded}\n", encoding="utf-8")
    else:
        sys.stdout.write(f"{encoded}\n")
    return 0 if not report["counts"].get("error") else 1


if __name__ == "__main__":
    raise SystemExit(main())
