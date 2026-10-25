"""Pure primary-directory adapters for the review-only institution inventory monitor.

Extracted HTML links are discovery leads, never declarations that a body qualifies.
IPU exports are accepted only when their published pagination and row identities agree.
No network requests or inventory mutations happen in this module.
"""

from __future__ import annotations

import hashlib
import ipaddress
import json
import re
from collections.abc import Collection, Mapping, Sequence
from dataclasses import dataclass
from datetime import date
from html import unescape
from html.parser import HTMLParser
from typing import cast
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit

IPU_ENDPOINT = "https://data.ipu.org/wp-json/v1/data-explorer"
IPU_FIELDS = (
    "country_code",
    "country_name",
    "chamber_code",
    "chamber_name",
    "parliament_name",
    "structure_of_parliament",
    "is_suspended_chamber",
    "is_suspended_parliament",
    "parliamentary_website_url",
)


@dataclass(frozen=True)
class DirectorySource:
    id: str
    country: str
    url: str


@dataclass(frozen=True)
class IpuChamber:
    external_id: str
    country_code: str
    name: str
    website_urls: tuple[str, ...]
    suspended: bool
    parliament_name: str = ""
    structure: str = ""
    website_urls_known: bool = True


@dataclass(frozen=True)
class ParsedIpuPage:
    chambers: tuple[IpuChamber, ...]
    page: int
    per_page: int
    total_results: int
    complete: bool
    row_count: int
    all_external_ids: tuple[str, ...]


def safe_public_url(url: str) -> str | None:
    """Normalize an ordinary public HTTP URL without doing DNS or trusting credentials.

    Fetchers must also validate DNS answers and every redirect; syntax checks alone
    cannot prevent a public-looking hostname from resolving to a private address.
    """
    value = unescape(url).strip()
    if not value or re.search(r"[\s\\\x00-\x1f\x7f]", value):
        return None
    try:
        parsed = urlsplit(value)
        host = parsed.hostname
        port = parsed.port
        if (
            parsed.scheme.lower() not in {"http", "https"}
            or not host
            or parsed.username is not None
            or parsed.password is not None
            or port not in {None, 80 if parsed.scheme.lower() == "http" else 443}
        ):
            return None
        host = host.lower().rstrip(".").encode("idna").decode("ascii")
    except (ValueError, UnicodeError):
        return None
    try:
        address = ipaddress.ip_address(host)
    except ValueError:
        labels = host.split(".")
        if (
            len(labels) < 2
            or any(not re.fullmatch(r"[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", s) for s in labels)
            or not re.fullmatch(r"[a-z]{2,}|xn--[a-z0-9-]+", labels[-1])
            or labels[-1] in {"local", "localhost", "internal", "test", "invalid"}
        ):
            return None
        netloc = host
    else:
        if not address.is_global:
            return None
        netloc = f"[{host}]" if address.version == 6 else host
    query = [
        (key, val)
        for key, val in parse_qsl(parsed.query, keep_blank_values=True)
        if not key.lower().startswith("utm_") and key.lower() not in {"fbclid", "gclid"}
    ]
    return urlunsplit((parsed.scheme.lower(), netloc, parsed.path or "/", urlencode(query), ""))


def _nested_urls(value: object) -> list[str]:
    if isinstance(value, str):
        normalized = safe_public_url(value)
        return [normalized] if normalized else []
    if isinstance(value, list):
        return [url for item in value for url in _nested_urls(item)]
    if isinstance(value, dict):
        # Restrict recursion to documented URL-bearing fields, not arbitrary prose.
        return [
            url
            for key in ("url", "sources", "primary_sources", "primary_urls")
            for url in _nested_urls(value.get(key))
        ]
    return []


def derive_directory_sources(inventory: Mapping[str, object]) -> list[DirectorySource]:
    """Return the explicit country reconciliation evidence URLs, deduplicated per country.

    These include constitutional documents and scope evidence as well as directories.
    Their inclusion does not assert that all are machine-readable body lists.
    """
    reconciliations = inventory.get("country_reconciliations")
    if not isinstance(reconciliations, list):
        raise ValueError("Inventory country_reconciliations must be a list")
    pairs: set[tuple[str, str]] = set()
    for row in reconciliations:
        if not isinstance(row, dict) or not isinstance(row.get("country"), str):
            raise ValueError("Country reconciliation lacks a country name")
        country = row["country"].strip()
        if not country:
            raise ValueError("Country reconciliation has a blank country name")
        for field in ("primary_sources", "primary_evidence", "retained_primary_sources"):
            pairs.update((country, url) for url in _nested_urls(row.get(field)))
    return [
        DirectorySource(
            id="country-evidence-" + hashlib.sha256(f"{country}\n{url}".encode()).hexdigest()[:20],
            country=country,
            url=url,
        )
        for country, url in sorted(pairs)
    ]


def ipu_api_url(as_of: str, page: int = 1, per_page: int = 500) -> str:
    """Build the date-specific public IPU explorer URL using published field names."""
    if date.fromisoformat(as_of).isoformat() != as_of:
        raise ValueError("IPU date must be an ISO calendar date")
    if isinstance(page, bool) or isinstance(per_page, bool) or page < 1 or not 1 <= per_page <= 500:
        raise ValueError("IPU pagination is outside the bounded request range")
    return (
        IPU_ENDPOINT
        + "?"
        + urlencode(
            {
                "lang": "en",
                "current_page": page,
                "per_page": per_page,
                "fields": ",".join(IPU_FIELDS),
                "region": "",
                "subregion": "",
                "country": "",
                "country_grouping": "",
                "structure": "",
                "date": as_of,
                "keyword": "",
                "sort": "country_name",
                "language": "",
                "show_notes": "true",
                "show_sources": "true",
            }
        )
    )


def _mapping(value: object, field: str) -> Mapping[str, object]:
    if not isinstance(value, dict) or any(not isinstance(key, str) for key in value):
        raise ValueError(f"IPU {field} must be an object")
    return cast(Mapping[str, object], value)


def _positive_integer(value: object, field: str) -> int:
    if isinstance(value, bool) or not isinstance(value, (int, str)):
        raise ValueError(f"IPU {field} must be a positive integer")
    if isinstance(value, str) and not re.fullmatch(r"[1-9][0-9]*", value):
        raise ValueError(f"IPU {field} must be a positive decimal integer")
    result = int(value)
    if result < 1:
        raise ValueError(f"IPU {field} must not be empty or zero")
    return result


class _WebsiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.urls: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "a":
            href = dict(attrs).get("href")
            if href:
                self.urls.append(href)


def _website_urls(value: str) -> tuple[str, ...]:
    if value.strip() in {"", "No information available"}:
        return ()
    parser = _WebsiteParser()
    parser.feed(value)
    raw_urls = parser.urls
    if not raw_urls and value.strip():
        raw_urls = re.findall(r"https?://[^\s<>\"']+", unescape(value))
        if not raw_urls:
            raise ValueError("IPU parliamentary website cell has no parseable URLs")
    urls = [safe_public_url(url) for url in raw_urls]
    if any(url is None for url in urls):
        raise ValueError("IPU parliamentary website contains an unsafe or malformed URL")
    return tuple(sorted({url for url in urls if url is not None}))


def _parse_chamber(row: object) -> IpuChamber:
    cells = _mapping(row, "row").get("row_data")
    if not isinstance(cells, list):
        raise ValueError("IPU row_data must be a list")
    fields: dict[str, str] = {}
    for cell in cells:
        item = _mapping(cell, "cell")
        key, value = item.get("field_id"), item.get("cell_value")
        if not isinstance(key, str) or not isinstance(value, str) or key in fields:
            raise ValueError("IPU cells need unique string field IDs and string values")
        fields[key] = value
    required = {
        "country_code",
        "chamber_code",
        "chamber_name",
        "is_suspended_chamber",
        "is_suspended_parliament",
        "parliamentary_website_url",
    }
    if not required <= fields.keys():
        raise ValueError("IPU chamber is missing required fields")
    country, chamber = fields["country_code"], fields["chamber_code"]
    if not re.fullmatch(r"[A-Z]{2}", country) or not re.fullmatch(
        rf"{country}-[A-Z]{{2}}[0-9]{{2}}", chamber
    ):
        raise ValueError("IPU country/chamber codes are malformed or inconsistent")
    name = " ".join(unescape(fields["chamber_name"]).split())
    suspension = [fields[key] for key in ("is_suspended_chamber", "is_suspended_parliament")]
    if not name or any(value not in {"Yes", "No"} for value in suspension):
        raise ValueError("IPU chamber name or suspension state is missing or unknown")
    return IpuChamber(
        external_id=chamber,
        country_code=country,
        name=name,
        website_urls=_website_urls(fields["parliamentary_website_url"]),
        suspended="Yes" in suspension,
        parliament_name=" ".join(unescape(fields.get("parliament_name", "")).split()),
        structure=fields.get("structure_of_parliament", ""),
        website_urls_known=fields["parliamentary_website_url"].strip()
        not in {"", "No information available"},
    )


def parse_ipu_page(payload: object, scope_country_codes: Collection[str]) -> ParsedIpuPage:
    """Validate one complete API page before selecting in-scope chambers.

    A valid partial page has ``complete=False`` and cannot establish disappearance.
    An empty, malformed, truncated or internally inconsistent response raises ValueError.
    """
    data = _mapping(payload, "response")
    page = _positive_integer(data.get("page"), "page")
    per_page = _positive_integer(data.get("per_page"), "per_page")
    total = _positive_integer(data.get("total_results"), "total_results")
    if per_page > 500 or page > (total + per_page - 1) // per_page:
        raise ValueError("IPU pagination exceeds its declared results")
    rows = _mapping(data.get("table_array"), "table_array").get("body")
    expected = min(per_page, total - (page - 1) * per_page)
    if not isinstance(rows, list) or len(rows) != expected:
        raise ValueError("IPU page is truncated or does not match declared pagination")
    chambers = tuple(_parse_chamber(row) for row in rows)
    ids = tuple(chamber.external_id for chamber in chambers)
    if len(ids) != len(set(ids)):
        raise ValueError("IPU page contains duplicate chamber IDs")
    return ParsedIpuPage(
        chambers=tuple(
            chamber for chamber in chambers if chamber.country_code in scope_country_codes
        ),
        page=page,
        per_page=per_page,
        total_results=total,
        complete=page == 1 and len(rows) == total,
        row_count=len(rows),
        all_external_ids=ids,
    )


def parse_ipu_pages(
    payloads: Sequence[object], scope_country_codes: Collection[str]
) -> tuple[IpuChamber, ...]:
    """Accept all pages together; refuse missing pages or duplicate global identities."""
    if not payloads:
        raise ValueError("No IPU pages supplied")
    pages = [parse_ipu_page(payload, scope_country_codes) for payload in payloads]
    first = pages[0]
    count = (first.total_results + first.per_page - 1) // first.per_page
    if any(
        page.total_results != first.total_results or page.per_page != first.per_page
        for page in pages
    ):
        raise ValueError("IPU pagination metadata changed between pages")
    if len(pages) != count or {page.page for page in pages} != set(range(1, count + 1)):
        raise ValueError("IPU export is partial or contains repeated pages")
    all_ids = [identity for page in pages for identity in page.all_external_ids]
    if len(set(all_ids)) != first.total_results:
        raise ValueError("IPU export contains duplicate chamber IDs across pages")
    return tuple(
        sorted((item for page in pages for item in page.chambers), key=lambda c: c.external_id)
    )


_VOID_TAGS = frozenset(
    {
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "wbr",
    }
)
_IGNORED_TAGS = frozenset(
    {"script", "style", "nav", "footer", "header", "noscript", "template", "form"}
)
_BOILERPLATE_ID = re.compile(
    r"(?:^|[-_\s])(?:cookie|consent|breadcrumb|pagination|social|share|toolbar)(?:$|[-_\s])", re.I
)
_GENERIC_LABELS = frozenset(
    {
        "home",
        "homepage",
        "back",
        "next",
        "previous",
        "contact",
        "contact us",
        "privacy",
        "privacy policy",
        "terms",
        "terms of use",
        "accessibility",
        "sitemap",
        "search",
        "login",
        "sign in",
        "skip to content",
        "skip to main content",
        "english",
        "français",
        "español",
        "deutsch",
        "print",
        "subscribe",
        "read more",
        "learn more",
        "more",
        "menu",
        "accept",
    }
)


class _ContentParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, bool, bool]] = []
        self.text: list[tuple[str, bool]] = []
        self.links: list[tuple[str, str, bool]] = []
        self.anchor: tuple[str, list[str], bool] | None = None
        self.has_main = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        parent_blocked = bool(self.stack and self.stack[-1][1])
        parent_main = bool(self.stack and self.stack[-1][2])
        role = attributes.get("role", "")
        is_main = tag == "main" or role == "main"
        blocked = (
            parent_blocked
            or tag in _IGNORED_TAGS
            or role in {"navigation", "banner", "contentinfo"}
            or "hidden" in attributes
            or attributes.get("aria-hidden") == "true"
            or bool(
                _BOILERPLATE_ID.search(
                    (attributes.get("id") or "") + " " + (attributes.get("class") or "")
                )
            )
        )
        if is_main and not blocked:
            self.has_main = True
        in_main = parent_main or is_main
        if tag not in _VOID_TAGS:
            self.stack.append((tag, blocked, in_main))
        if tag == "a" and not blocked:
            href = attributes.get("href")
            if href:
                self.anchor = (href, [], in_main)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if tag not in _VOID_TAGS:
            self.handle_endtag(tag)

    def handle_data(self, data: str) -> None:
        if self.stack and self.stack[-1][1]:
            return
        text = " ".join(data.split())
        if not text or re.fullmatch(
            r"(?:last updated|last modified|printed on)\s*:?.*", text, re.I
        ):
            return
        self.text.append((text, bool(self.stack and self.stack[-1][2])))
        if self.anchor is not None:
            self.anchor[1].append(text)

    def handle_endtag(self, tag: str) -> None:
        if tag == "a" and self.anchor is not None:
            href, text, in_main = self.anchor
            self.links.append((href, " ".join(text), in_main))
            self.anchor = None
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break


def extract_directory_links(html: str, base_url: str) -> list[dict[str, str]]:
    """Extract content links as review leads, excluding navigation and unsafe URLs."""
    base = safe_public_url(base_url)
    if base is None:
        raise ValueError("Directory base URL must be a public HTTP(S) URL")
    parser = _ContentParser()
    parser.feed(html)
    by_url: dict[str, str] = {}
    for href, name, in_main in parser.links:
        if (
            (parser.has_main and not in_main)
            or len(name) < 3
            or len(name) > 200
            or name.casefold().strip(" .:»›→") in _GENERIC_LABELS
            or href.startswith("#")
        ):
            continue
        url = safe_public_url(urljoin(base, href))
        if url is None or url == base:
            continue
        host = urlsplit(url).hostname or ""
        if any(
            host == social or host.endswith("." + social)
            for social in ("facebook.com", "x.com", "twitter.com", "instagram.com", "linkedin.com")
        ):
            continue
        by_url.setdefault(url, name)
    return [{"name": name, "url": url} for url, name in sorted(by_url.items())]


def source_fingerprint(content: str | bytes, content_type: str = "text/html") -> str:
    """Hash main HTML text and content links; binary documents retain a byte-level hash.

    This reduces cosmetic boilerplate churn. A changed hash is a prompt to review,
    and does not certify a legal, institutional or even substantive change.
    """
    raw = content.encode() if isinstance(content, str) else content
    mime = content_type.partition(";")[0].strip().lower()
    if mime not in {"text/html", "application/xhtml+xml"}:
        return hashlib.sha256(raw).hexdigest()
    text = content if isinstance(content, str) else content.decode("utf-8", errors="replace")
    parser = _ContentParser()
    parser.feed(text)
    visible = " ".join(value for value, main in parser.text if not parser.has_main or main)
    links = sorted(
        (unescape(href).strip(), label)
        for href, label, main in parser.links
        if (not parser.has_main or main) and not href.startswith("#")
    )
    normalized = json.dumps({"text": visible, "links": links}, ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(normalized.encode()).hexdigest()
