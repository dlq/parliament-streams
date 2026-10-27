"""Bounded, credential-free diagnostics for the official Taiwan programme API."""

from __future__ import annotations

import hashlib
import json
import platform
import re
import ssl
import time
from datetime import UTC, datetime
from html import unescape
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

ROOT = "https://www.parliamentarytv.org.tw/"
AGENT = "parliament-streams-schedule-collector/0.1 (+https://github.com/dlq/parliament-streams)"
AJAX = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Referer": ROOT,
    "X-Requested-With": "XMLHttpRequest",
}
LIMIT = 65536


def probe(name: str, url: str, headers: dict[str, str]) -> dict[str, object]:
    result: dict[str, object] = {"name": name, "url": url}
    request = Request(
        url, headers={"User-Agent": AGENT, "Accept": "text/html, application/json", **headers}
    )
    try:
        try:
            response = urlopen(request, timeout=15)
        except HTTPError as error:
            response = error
        with response:
            body = response.read(LIMIT + 1)
            result.update(
                {
                    "status": response.status,
                    "response_bytes_sampled": len(body),
                    "truncated": len(body) > LIMIT,
                    "sample_sha256": hashlib.sha256(body).hexdigest(),
                    "headers": {
                        k: response.headers[k]
                        for k in [
                            "Server",
                            "Content-Type",
                            "Content-Length",
                            "Via",
                            "X-Cache",
                            "CF-Mitigated",
                        ]
                        if k in response.headers
                    },
                }
            )
            text = body.decode("utf-8", errors="replace")
            try:
                data = json.loads(text)
                result["json_type"] = type(data).__name__
                if isinstance(data, list):
                    result["rows"] = len(data)
                    result["row_keys"] = (
                        sorted(data[0]) if data and isinstance(data[0], dict) else []
                    )
            except ValueError:
                title = re.search(r"<title[^>]*>(.*?)</title>", text, re.I | re.S)
                result["title"] = (
                    unescape(re.sub("<[^>]+>", "", title[1])).strip()[:150] if title else None
                )
                result["response_markers"] = [
                    marker
                    for marker in [
                        "Access Denied",
                        "Forbidden",
                        "Cloudflare",
                        "Request Rejected",
                        "Azure",
                        "Microsoft",
                        "Incapsula",
                        "Akamai",
                        "Geolocation",
                        "country",
                        "blocked",
                    ]
                    if marker.lower() in text.lower()
                ]
                if response.status >= 400:
                    visible = re.sub(r"<(script|style)\b.*?</\1>", " ", text, flags=re.I | re.S)
                    visible = unescape(re.sub(r"<[^>]*>", " ", visible))
                    visible = re.sub(
                        r"https?://\S+|\b(?:\d{1,3}\.){3}\d{1,3}\b", "[redacted]", visible
                    )
                    visible = re.sub(r"\b[A-Za-z0-9_+/=-]{40,}\b", "[redacted]", visible)
                    result["denial_text"] = " ".join(visible.split())[:500]
    except (URLError, TimeoutError, ssl.SSLError) as error:
        result["error_type"] = type(error).__name__
    return result


def main() -> None:
    day = datetime.now(ZoneInfo("Asia/Taipei")).strftime("%Y/%m/%d")
    api = ROOT + "api/get_program.php?" + urlencode({"ch": "ly1", "date": day})
    cases = [
        ("homepage", ROOT, {}),
        ("published-script", ROOT + "js/ww_index.js?T=20250204", {}),
        ("collector", api, {}),
        ("published-ajax-headers", api, AJAX),
        ("unescaped-date", ROOT + "api/get_program.php?ch=ly1&date=" + day, AJAX),
        (
            "canonical-host-without-www",
            api.replace("www.parliamentarytv.org.tw", "parliamentarytv.org.tw"),
            AJAX,
        ),
        ("linked-broadcaster-guide", "https://www.cts.com.tw/schedule/?ch=lyA", {}),
    ]
    report: dict[str, object] = {
        "checked_at": datetime.now(UTC).isoformat(),
        "platform": platform.system(),
        "python": platform.python_version(),
        "ssl": ssl.OPENSSL_VERSION,
        "note": (
            "No credentials, cookies, raw denial bodies or challenge tokens retained; "
            "no TLS settings relaxed."
        ),
        "results": [],
    }
    results = []
    for name, url, headers in cases:
        row = probe(name, url, headers)
        results.append(row)
        print(json.dumps(row, ensure_ascii=False), flush=True)
        time.sleep(0.5)
    report["results"] = results
    Path("taiwan-api-diagnostic.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    )


if __name__ == "__main__":
    main()
