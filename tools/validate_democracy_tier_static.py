"""Refresh static HLS/DASH validation from a previous democracy-tier report."""

from __future__ import annotations

import argparse
import concurrent.futures
import html as html_lib
import json
import re
import ssl
import time
from collections.abc import Iterable
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

USER_AGENT = "parliament-streams-tier-refresh/0.1 (+https://github.com/dlq/parliament-streams)"
TIMEOUT_SECONDS = 8
MAX_RESPONSE_BYTES = 300_000

MANIFEST_RE = re.compile(
    r"""(?P<url>https?:\\?/\\?/[^"'<>\s]+?\.(?:m3u8|mpd)(?:\?[^"'<>\s]*)?|/(?:[^"'<>\s]+?\.(?:m3u8|mpd)(?:\?[^"'<>\s]*)?))""",
    re.IGNORECASE,
)


def utc_timestamp() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")


def fetch(url: str, timeout: int) -> dict[str, Any]:
    request = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
    started = time.time()
    try:
        with urlopen(request, timeout=timeout) as response:
            body = response.read(MAX_RESPONSE_BYTES)
            return {
                "http_status": response.status,
                "content_type": response.headers.get("content-type"),
                "final_url": response.geturl(),
                "body": body,
                "elapsed_seconds": round(time.time() - started, 3),
            }
    except HTTPError as error:
        body = error.read(80_000)
        return {
            "http_status": error.code,
            "content_type": error.headers.get("content-type") if error.headers else None,
            "final_url": error.geturl(),
            "error": f"HTTP {error.code}",
            "body": body,
            "elapsed_seconds": round(time.time() - started, 3),
        }
    except (TimeoutError, URLError, ssl.SSLError) as error:
        return {
            "http_status": None,
            "content_type": None,
            "final_url": None,
            "error": f"{type(error).__name__}: {error}",
            "elapsed_seconds": round(time.time() - started, 3),
        }


def manifest_kind(url: str) -> str:
    return "dash" if urlparse(url).path.lower().endswith(".mpd") else "hls"


def looks_like_hls(body: bytes) -> bool:
    return body.lstrip().startswith(b"#EXTM3U")


def looks_like_dash(body: bytes) -> bool:
    sample = body[:4096].lower()
    return b"<mpd" in sample


def validate_candidate(kind: str, url: str, timeout: int) -> dict[str, Any]:
    fetched = fetch(url, timeout)
    body = fetched.pop("body", b"")
    result = {**fetched, "kind": kind, "url": url}

    if fetched.get("error"):
        result.update(status="error", note=fetched["error"])
        return result

    if kind in {"hls", "discovered_manifest"} and manifest_kind(url) == "hls":
        if looks_like_hls(body):
            result.update(status="ok", note="HLS manifest detected")
        else:
            result.update(status="warning", note="Reachable but not HLS manifest")
        return result

    if kind in {"dash", "discovered_manifest"} and manifest_kind(url) == "dash":
        if looks_like_dash(body):
            result.update(status="ok", note="DASH MPD detected")
        else:
            result.update(status="warning", note="Reachable but not DASH MPD")
        return result

    page_html = body.decode("utf-8", errors="ignore")
    found = []
    for match in MANIFEST_RE.finditer(page_html):
        raw = match.group("url").replace("\\/", "/")
        raw = html_lib.unescape(raw).strip("\"'")
        found.append(urljoin(fetched.get("final_url") or url, raw))
    result.update(status="page_ok", note="Official/discovery page reachable")
    if found:
        result["discovered_manifests"] = sorted(dict.fromkeys(found))[:10]
    return result


def iter_seed_candidates(country: dict[str, Any]) -> Iterable[dict[str, str]]:
    seen: set[tuple[str, str]] = set()
    for result in country.get("results", []):
        kind = result.get("kind")
        url = result.get("url")
        if kind not in {"hls", "dash", "official_page", "discovered_manifest"} or not url:
            continue
        if kind == "discovered_manifest":
            kind = manifest_kind(url)
        key = (kind, url)
        if key not in seen:
            seen.add(key)
            yield {"kind": kind, "url": url}


def check_country(country: dict[str, Any], timeout: int) -> dict[str, Any]:
    results = []
    seen: set[tuple[str, str]] = set()

    for candidate in iter_seed_candidates(country):
        key = (candidate["kind"], candidate["url"])
        if key in seen:
            continue
        seen.add(key)
        result = validate_candidate(candidate["kind"], candidate["url"], timeout)
        results.append(result)
        for discovered_url in result.get("discovered_manifests", []):
            discovered_kind = manifest_kind(discovered_url)
            discovered_key = (discovered_kind, discovered_url)
            if discovered_key in seen:
                continue
            seen.add(discovered_key)
            discovered = validate_candidate(discovered_kind, discovered_url, timeout)
            discovered["kind"] = "discovered_manifest"
            results.append(discovered)

    open_hls = sum(
        1
        for result in results
        if result.get("status") == "ok" and manifest_kind(result.get("url", "")) == "hls"
    )
    open_dash = sum(
        1
        for result in results
        if result.get("status") == "ok" and manifest_kind(result.get("url", "")) == "dash"
    )

    return {
        "country": country["country"],
        "open_hls_count": open_hls,
        "open_dash_count": open_dash,
        "has_open_hls": open_hls > 0,
        "results": results,
    }


def run(input_path: Path, output_path: Path, timeout: int, workers: int) -> dict[str, Any]:
    source = json.loads(input_path.read_text(encoding="utf-8"))
    started = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as pool:
        futures = [pool.submit(check_country, country, timeout) for country in source["countries"]]
        countries = [future.result() for future in futures]
    report = {
        "checked_at": utc_timestamp(),
        "scope": source.get("scope", "Democracy-tier static HLS/DASH refresh"),
        "method": (
            "Refresh from prior report seeds: validate known direct HLS/DASH candidates, "
            "fetch official/discovery pages, extract static .m3u8/.mpd references, and "
            "validate discovered manifests. JavaScript player network traffic is out of scope."
        ),
        "seed_report": str(input_path),
        "elapsed_seconds": round(time.time() - started, 2),
        "countries": countries,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--timeout", type=int, default=TIMEOUT_SECONDS)
    parser.add_argument("--workers", type=int, default=8)
    args = parser.parse_args()

    report = run(args.input, args.output, args.timeout, args.workers)
    for country in report["countries"]:
        summary = (
            f"{country['country']} HLS {country['open_hls_count']} "
            f"DASH {country['open_dash_count']}"
        )
        print(summary)
        for result in country["results"]:
            if result.get("status") == "ok":
                print("  OK", result.get("kind"), result.get("url"))
            elif result.get("kind") in {"hls", "dash"} and result.get("status") in {
                "error",
                "warning",
            }:
                print(
                    " ",
                    result.get("status", "").upper(),
                    result.get("http_status"),
                    result.get("url"),
                    "-",
                    result.get("note"),
                )
    print("REPORT", args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
