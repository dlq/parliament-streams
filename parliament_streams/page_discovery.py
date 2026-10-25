"""Observe viewing and programme links without certifying their content or rights."""

from __future__ import annotations

import ipaddress
import json
import re
import socket
import unicodedata
from collections.abc import Iterable, Mapping
from html.parser import HTMLParser
from pathlib import Path
from typing import Literal, TypedDict, cast
from urllib.parse import parse_qsl, unquote, urljoin, urlsplit, urlunsplit

PageLeadKind = Literal[
    "viewing_page", "video_archive", "youtube_channel", "recording", "programme_source"
]


class PageLead(TypedDict):
    url: str
    kind: PageLeadKind
    label: str
    source_page: str
    observation: str


RULES = cast(
    dict[str, list[str]],
    json.loads(Path(__file__).with_name("page_lead_rules.json").read_text(encoding="utf-8")),
)
MEDIA_SUFFIXES = {".mp4", ".webm", ".m4v", ".mov"}
IGNORED_SUFFIXES = {".png", ".jpg", ".jpeg", ".svg", ".gif", ".css", ".js", ".pdf"}
SENSITIVE_NAME = re.compile(
    r"(?:^|[_-])(?:key|token|auth|authorization|signature|sig|password|passwd|pwd|credential|credentials|secret)(?:$|[_-])",
    re.I,
)


def normalized_text(value: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFKD", value.casefold()) if not unicodedata.combining(c)
    )


def _has_term(text: str, group: str) -> bool:
    for raw in RULES[group]:
        term = normalized_text(raw)
        if term.isascii() and term.isalpha() and len(term) <= 5:
            if re.search(rf"(?<![a-z]){re.escape(term)}(?![a-z])", text):
                return True
        elif term in text:
            return True
    return False


def safe_lead_url(value: str, base_url: str = "") -> str | None:
    """Keep public HTTP links and discard credentials, fragments and unusable hints."""
    if (
        not isinstance(value, str)
        or not value
        or len(value) > 4096
        or value.startswith("#")
        or "redacted" in value.casefold()
    ):
        return None
    try:
        parts = urlsplit(urljoin(base_url, value))
        host = (parts.hostname or "").rstrip(".")
        if parts.scheme not in {"http", "https"} or not host or parts.username is not None:
            return None
        if host == "localhost" or host.endswith((".localhost", ".local", ".internal")):
            return None
        try:
            if not ipaddress.ip_address(host).is_global:
                return None
        except ValueError:
            try:
                if not ipaddress.ip_address(socket.inet_aton(host)).is_global:
                    return None
            except OSError:
                if "." not in host:
                    return None
        _ = parts.port  # Validate the port without excluding legitimate public players.
        for name, _ in parse_qsl(parts.query):
            decoded = unquote(unquote(name))
            compact = re.sub(r"[^a-z]", "", decoded.casefold())
            if SENSITIVE_NAME.search(decoded) or compact in {
                "apikey",
                "key",
                "token",
                "auth",
                "authorization",
                "signature",
                "sig",
                "accesstoken",
                "refreshtoken",
                "idtoken",
                "authtoken",
                "clientsecret",
                "sessiontoken",
            }:
                return None
        if re.search(r"[\x00-\x20\x7f<>\"`|]", value):
            return None
        return urlunsplit((parts.scheme, parts.netloc, parts.path, parts.query, ""))
    except ValueError:
        return None


def classify_page_links(
    source_page: str,
    links: Iterable[Mapping[str, str]],
    *,
    base_url: str | None = None,
    limit: int = 20,
) -> tuple[list[PageLead], int]:
    """Return bounded research leads. A linked page has not been independently fetched."""
    source = safe_lead_url(source_page)
    if source is None:
        return [], 0
    effective = safe_lead_url(base_url or source) or source
    source_host = (urlsplit(effective).hostname or "").removeprefix("www.").removeprefix("m.")
    if any(
        source_host == host or source_host.endswith("." + host) for host in RULES["provider_hosts"]
    ):
        # Provider recommendations are not institution-designated sources.
        links = [{"url": effective, "tag": "a", "label": "Maintained provider-page route"}]
    found: dict[str, PageLead] = {}
    for link in links:
        if not isinstance(link, Mapping) or any(not isinstance(v, str) for v in link.values()):
            continue
        tag = link.get("tag", "a").lower()
        raw_url = link.get("url", "")
        url = safe_lead_url(raw_url or (source if tag == "video" else ""), base_url or source)
        if url is None and tag == "video":
            url = source
        if url is None:
            continue
        parts = urlsplit(url)
        host = (parts.hostname or "").removeprefix("www.").removeprefix("m.")
        label = " ".join(link.get("label", "").split())[:240]
        hint = normalized_text(unquote(parts.path + " " + parts.query + " " + label))
        suffix = Path(parts.path).suffix.lower()
        programme_signal = (
            suffix in {".ics", ".xmltv"}
            or _has_term(hint, "programme_terms")
            or link.get("type", "").split(";")[0].lower()
            in {
                "text/calendar",
                "application/icalendar",
                "application/ics",
                "application/xmltv+xml",
                "application/x-xmltv+xml",
            }
        )
        if suffix in IGNORED_SUFFIXES and not (suffix == ".pdf" and programme_signal):
            continue
        kind: PageLeadKind | None = None
        youtube = host in {"youtube.com", "youtu.be", "youtube-nocookie.com"}
        if youtube:
            video_id = dict(parse_qsl(parts.query)).get("v", "")
            segments = parts.path.strip("/").split("/")
            if parts.path == "/embed/videoseries" and dict(parse_qsl(parts.query)).get("list"):
                kind = "video_archive"
            elif (
                host == "youtu.be"
                and re.fullmatch(r"[\w-]{11}", parts.path.strip("/"))
                or parts.path == "/watch"
                and re.fullmatch(r"[\w-]{11}", video_id)
                or len(segments) == 2
                and segments[0] in {"embed", "shorts"}
                and re.fullmatch(r"[\w-]{11}", segments[1])
            ):
                kind = "recording"
            elif parts.path.startswith(("/@", "/channel/", "/user/", "/c/")):
                kind = "youtube_channel"
            elif parts.path == "/playlist" and any(k == "list" for k, _ in parse_qsl(parts.query)):
                kind = "video_archive"
        elif host in {"vimeo.com", "player.vimeo.com"} and parts.path.startswith(
            ("/channels/", "/showcase/", "/ondemand/")
        ):
            kind = "video_archive"
        elif (
            suffix in MEDIA_SUFFIXES
            or host in {"vimeo.com", "player.vimeo.com"}
            and re.fullmatch(r"/(?:video/)?\d+/?", parts.path)
        ):
            kind = "recording"
        elif host == "livestream.com" and parts.path.strip("/"):
            kind = "viewing_page"
        elif programme_signal:
            kind = "programme_source"
        elif _has_term(hint, "archive_terms") and (
            _has_term(hint, "media_terms")
            or _has_term(normalized_text(source), "media_terms")
            or any(
                normalized_text(term) in hint
                for term in RULES["archive_terms"]
                if term not in {"archive", "archiv"}
            )
        ):
            kind = "video_archive"
        elif tag == "video" or _has_term(hint, "media_terms"):
            kind = "viewing_page"
        if kind is None:
            continue
        found.setdefault(
            url,
            {
                "url": url,
                "kind": kind,
                "label": label,
                "source_page": source,
                "observation": (
                    "Link or media element observed on a maintained source page; target ownership, "
                    "legislative content, availability, programme mapping and rights "
                    "require review."
                ),
            },
        )
        if tag in {"video", "iframe"} and kind != "programme_source":
            found.setdefault(
                source,
                {
                    "url": source,
                    "kind": "viewing_page",
                    "label": "Embedded media surface",
                    "source_page": source,
                    "observation": (
                        "A media element was observed; substantive legislative playback "
                        "and source-wide coverage are unverified."
                    ),
                },
            )
    values = list(found.values())
    return values[:limit], max(0, len(values) - limit)


class _PageLinks(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[dict[str, str]] = []
        self.anchor: dict[str, str] | None = None
        self.base_url: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {k: v or "" for k, v in attrs}
        if tag == "base" and self.base_url is None:
            self.base_url = values.get("href")
        elif tag == "a":
            if self.anchor:
                self.links.append(self.anchor)
            self.anchor = {
                "tag": tag,
                "url": values.get("href", ""),
                "label": values.get("title", ""),
            }
        elif tag in {"iframe", "video", "source", "link"}:
            self.links.append(
                {
                    "tag": tag,
                    "url": values.get("href" if tag == "link" else "src", ""),
                    "label": values.get("title", ""),
                    "type": values.get("type", ""),
                    "rel": values.get("rel", ""),
                }
            )

    def handle_data(self, data: str) -> None:
        if self.anchor:
            self.anchor["label"] = (self.anchor["label"] + " " + data)[:240]

    def handle_endtag(self, tag: str) -> None:
        if tag == "a" and self.anchor:
            self.links.append(self.anchor)
            self.anchor = None


def extract_page_leads(
    html: str, source_page: str, *, base_url: str | None = None
) -> tuple[list[PageLead], int]:
    parser = _PageLinks()
    parser.feed(html)
    parser.close()
    if parser.anchor:
        parser.links.append(parser.anchor)
    base = urljoin(base_url or source_page, parser.base_url or "")
    return classify_page_links(source_page, parser.links, base_url=base)
