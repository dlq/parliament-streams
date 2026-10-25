"""Remove copied credentials from research evidence and check text without exposing values.

Query-parameter redaction is deliberately broader than secret detection: ``key=``
may contain an innocuous identifier, so it is sanitized in published evidence but
does not, by itself, make a repository secret-scan finding.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from collections import Counter
from pathlib import Path
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


def secret_matches(text: str) -> list[str]:
    """Return one type per recognized credential occurrence, never matched values."""
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


def _sensitive_name(name: str) -> bool:
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
    cleaned = _sanitize_text(decoded, depth + 1)
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
        (name, REDACTED if _sensitive_name(name) else _sanitize_text(item, depth + 1))
        for name, item in parse_qsl(parsed.query, keep_blank_values=True)
    ]
    result = urlunsplit(
        (
            parsed.scheme,
            netloc,
            _redact_patterns(parsed.path),
            urlencode(query),
            _sanitize_text(parsed.fragment, depth + 1),
        )
    )
    return _redact_patterns(result)


def sanitize_url(value: str) -> str:
    """Sanitize an HTTP URL, including nested/encoded URLs and credential queries."""
    if ENCODED_URL.search(value):
        return _sanitize_text(value, 0)
    return _sanitize_url(value, 0)


def _sanitize_text(value: str, depth: int = 0) -> str:
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
        return _sanitize_text(value)
    return value


def _check_paths(paths: list[Path]) -> int:
    findings = 0
    for path in sorted(set(paths)):
        try:
            data = path.read_bytes()
            if b"\x00" in data:
                continue
            text = data.decode("utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for number, line in enumerate(text.splitlines(), start=1):
            counts = Counter(secret_matches(line))
            if counts:
                findings += sum(counts.values())
                types = ", ".join(f"{kind}={count}" for kind, count in sorted(counts.items()))
                # Never include the offending line, match, or an exception's contents.
                print(f"{path}:{number}: {types}")
    print(f"Recognized secret occurrences: {findings}")
    return int(bool(findings))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check-tracked", action="store_true")
    mode.add_argument("--check", type=Path, metavar="PATH")
    mode.add_argument("--sanitize", type=Path, metavar="PATH")
    args = parser.parse_args(argv)
    if args.check_tracked:
        root = Path(
            subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True).strip()
        )
        names = subprocess.check_output(["git", "ls-files", "-z"], cwd=root).decode().split("\0")
        return _check_paths([root / name for name in names if name])
    if args.check is not None:
        path = args.check
        if not path.exists():
            parser.error("The check path does not exist.")
        return _check_paths(list(path.rglob("*")) if path.is_dir() else [path])
    path = args.sanitize
    try:
        text = path.read_text(encoding="utf-8")
        if path.suffix.lower() == ".json":
            cleaned = (
                json.dumps(sanitize_value(json.loads(text)), ensure_ascii=False, indent=2) + "\n"
            )
        else:
            cleaned = _sanitize_text(text)
        path.write_text(cleaned, encoding="utf-8")
    except (OSError, UnicodeError, json.JSONDecodeError):
        parser.error("Could not sanitize the requested text/JSON file; no evidence values printed.")
    print(f"Sanitized: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
