"""Scan or sanitize repository research evidence without exposing credential values."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from collections import Counter
from pathlib import Path

if __package__ in {None, ""}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from parliament_streams.research_evidence import (  # noqa: E402
    detect_secret_types,
    sanitize_text,
    sanitize_value,
)


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
            counts = Counter(detect_secret_types(line))
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
            cleaned = sanitize_text(text)
        path.write_text(cleaned, encoding="utf-8")
    except (OSError, UnicodeError, json.JSONDecodeError):
        parser.error("Could not sanitize the requested text/JSON file; no evidence values printed.")
    print(f"Sanitized: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
