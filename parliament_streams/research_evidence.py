"""Remove copied credentials from research evidence and check text without exposing values.

Query-parameter redaction is deliberately broader than secret detection: ``key=``
may contain an innocuous identifier, so it is sanitized in published evidence but
does not, by itself, make a repository secret-scan finding.
"""

from __future__ import annotations

import re
from collections import Counter
from typing import Any
from urllib.parse import parse_qsl, quote, unquote, urlencode, urlsplit, urlunsplit

REDACTED = "REDACTED"
SECRET_PATTERNS = (
    ("google_api_key", re.compile(r"(?<![\w-])AIza[0-9A-Za-z_-]{35}(?![\w-])")),
    ("github_token", re.compile(r"(?<!\w)gh[pousr]_[0-9A-Za-z]{36}(?!\w)")),
    ("github_token", re.compile(r"(?<!\w)github_pat_[0-9A-Za-z_]{82}(?!\w)")),
    ("aws_access_key_id", re.compile(r"(?<!\w)(?:AKIA|ASIA)[A-Z0-9]{16}(?!\w)")),
    ("private_key", re.compile(r"-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----")),
)
PRIVATE_KEY_BLOCK = re.compile(
    r"-----BEGIN (?P<kind>(?:[A-Z0-9]+ )*PRIVATE KEY)-----"
    r"[\s\S]*?-----END (?P=kind)-----"
)
PLAIN_URL = re.compile(r"https?://[^\s<>\"']+", re.IGNORECASE)
ENCODED_URL = re.compile(r"https?%(?:25)*3a%(?:25)*2f%(?:25)*2f[^\s<>\"']+", re.IGNORECASE)
SENSITIVE_PART = re.compile(
    r"(?:^|[_-])(?:key|token|auth|authorization|signature|sig|password|passwd|pwd|"
    r"credential|credentials|secret)(?:$|[_-])",
    re.IGNORECASE,
)
SENSITIVE_NAMES = {
    "apikey",
    "accesstoken",
    "refreshtoken",
    "idtoken",
    "clientsecret",
    "sessiontoken",
    "securitytoken",
    "accesskey",
    "accesskeyid",
}
ENCODED_COMPONENT = re.compile(r"(?:%[0-9a-fA-F]{2}|[A-Za-z0-9_~-])+")


def detect_secret_types(text: str) -> list[str]:
    """Return one credential type per recognized occurrence, never matched values."""
    counts: Counter[str] = Counter()
    for _ in range(5):
        current = Counter(kind for kind, pattern in SECRET_PATTERNS for _ in pattern.finditer(text))
        counts |= current
        decoded = unquote(text)
        if decoded == text:
            break
        text = decoded
    return list(counts.elements())


def _redact_patterns(text: str) -> str:
    def clean_encoded(match: re.Match[str]) -> str:
        value = match.group()
        if "%" not in value:
            return value
        decoded = value
        for _ in range(4):
            next_value = unquote(decoded)
            if next_value == decoded:
                break
            decoded = next_value
        cleaned = PRIVATE_KEY_BLOCK.sub(REDACTED, decoded)
        for _, pattern in SECRET_PATTERNS:
            cleaned = pattern.sub(REDACTED, cleaned)
        return quote(cleaned, safe="") if cleaned != decoded else value

    text = ENCODED_COMPONENT.sub(clean_encoded, text)
    text = PRIVATE_KEY_BLOCK.sub(REDACTED, text)
    for _, pattern in SECRET_PATTERNS:
        text = pattern.sub(REDACTED, text)
    return text


def _is_sensitive_query_name(name: str) -> bool:
    # Decode names as well as values: some pages double-encode their query strings.
    for _ in range(4):
        decoded = unquote(name)
        if decoded == name:
            break
        name = decoded
    name = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", name)
    name = re.sub(r"[\[\].]", "_", name)
    compact = re.sub(r"[^a-z0-9]", "", name.lower())
    return bool(SENSITIVE_PART.search(name) or compact in SENSITIVE_NAMES)


def _sanitize_encoded(value: str, depth: int) -> str:
    decoded = value
    rounds = 0
    for _ in range(4):
        next_value = unquote(decoded)
        if next_value == decoded:
            break
        decoded = next_value
        rounds += 1
        # Stop at an ordinary URL so its query parser owns further URL decoding.
        if PLAIN_URL.search(decoded):
            break
    cleaned = sanitize_text(decoded, depth + 1)
    if cleaned == decoded:
        return value
    for _ in range(rounds):
        cleaned = quote(cleaned, safe="")
    return cleaned


def _sanitize_url(value: str, depth: int) -> str:
    if depth > 8:
        return REDACTED
    try:
        parsed = urlsplit(value)
    except ValueError:
        return _redact_patterns(value)
    if parsed.scheme.lower() not in {"http", "https"} or not parsed.netloc:
        return _redact_patterns(value)
    # urlsplit leaves credentials escaped in netloc. Never retain userinfo.
    netloc = parsed.netloc.rsplit("@", 1)[-1]
    query = [
        (name, REDACTED if _is_sensitive_query_name(name) else sanitize_text(item, depth + 1))
        for name, item in parse_qsl(parsed.query, keep_blank_values=True)
    ]
    result = urlunsplit(
        (
            parsed.scheme,
            netloc,
            _redact_patterns(parsed.path),
            urlencode(query),
            sanitize_text(parsed.fragment, depth + 1),
        )
    )
    return _redact_patterns(result)


def sanitize_url(value: str) -> str:
    """Sanitize an HTTP URL, including nested/encoded URLs and credential queries."""
    if ENCODED_URL.search(value):
        return sanitize_text(value, 0)
    return _sanitize_url(value, 0)


def sanitize_text(value: str, depth: int = 0) -> str:
    """Sanitize prose and nested URLs without exposing copied credential values."""
    if depth > 8:
        return REDACTED
    value = ENCODED_URL.sub(lambda match: _sanitize_encoded(match.group(), depth), value)
    value = PLAIN_URL.sub(lambda match: _sanitize_url(match.group(), depth + 1), value)
    return _redact_patterns(value)


def sanitize_value(value: Any) -> Any:
    """Return sanitized JSON-shaped evidence without modifying the input object."""
    if isinstance(value, dict):
        return {key: sanitize_value(item) for key, item in value.items()}
    if isinstance(value, list):
        return [sanitize_value(item) for item in value]
    if isinstance(value, tuple):
        return tuple(sanitize_value(item) for item in value)
    if isinstance(value, str):
        return sanitize_text(value)
    return value
