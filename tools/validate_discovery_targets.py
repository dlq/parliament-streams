"""Validate maintained Tier 1 and Tier 2 discovery target files."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker


def validate_file(path: Path, schema: dict[str, Any]) -> list[str]:
    value = json.loads(path.read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    errors = sorted(validator.iter_errors(value), key=lambda error: list(error.absolute_path))
    messages = [f"{path}: {error.json_path}: {error.message}" for error in errors]

    countries = [country["country"] for country in value.get("countries", [])]
    if len(countries) != len(set(countries)):
        messages.append(f"{path}: countries must be unique")
    for country in value.get("countries", []):
        targets = [(item["kind"], item["url"]) for item in country.get("results", [])]
        if len(targets) != len(set(targets)):
            messages.append(f"{path}: {country['country']}: targets must be unique")
    return messages


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", type=Path, nargs="+")
    parser.add_argument(
        "--schema",
        type=Path,
        default=Path("schema/discovery-targets.schema.json"),
    )
    args = parser.parse_args()

    schema = json.loads(args.schema.read_text(encoding="utf-8"))
    messages = [message for path in args.paths for message in validate_file(path, schema)]
    if messages:
        print("\n".join(messages))
        return 1
    print(f"Discovery targets valid: {len(args.paths)} file(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
