"""Validate the maintained U.S. federal and state candidate inventory."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker

EXPECTED_STATE_CODES = {
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
}


def validate_file(path: Path, schema: dict[str, Any]) -> list[str]:
    value = json.loads(path.read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    errors = sorted(validator.iter_errors(value), key=lambda error: list(error.absolute_path))
    messages = [f"{path}: {error.json_path}: {error.message}" for error in errors]

    candidates = value.get("federal_candidates", []) + value.get("state_candidates", [])
    identifiers = [item.get("id") for item in candidates]
    if len(identifiers) != len(set(identifiers)):
        messages.append(f"{path}: candidate IDs must be unique")

    states = value.get("state_candidates", [])
    codes = [item.get("postal_code") for item in states]
    if set(codes) != EXPECTED_STATE_CODES:
        missing = sorted(EXPECTED_STATE_CODES - set(codes))
        extra = sorted(set(codes) - EXPECTED_STATE_CODES)
        messages.append(f"{path}: state codes mismatch; missing={missing}, extra={extra}")
    if len(codes) != len(set(codes)):
        messages.append(f"{path}: state postal codes must be unique")

    for item in candidates:
        if item.get("research_status") == "verified_official_video_surface":
            if not item.get("video_url"):
                messages.append(f"{path}: {item.get('id')}: verified candidate needs video_url")
            if len(item.get("evidence_urls", [])) < 2:
                messages.append(
                    f"{path}: {item.get('id')}: verified candidate needs two evidence URLs"
                )
    return messages


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "path",
        type=Path,
        nargs="?",
        default=Path("data/discovery/us-legislatures.json"),
    )
    parser.add_argument(
        "--schema",
        type=Path,
        default=Path("schema/us-legislature-candidates.schema.json"),
    )
    args = parser.parse_args()
    schema = json.loads(args.schema.read_text(encoding="utf-8"))
    messages = validate_file(args.path, schema)
    if messages:
        print("\n".join(messages))
        return 1
    print("U.S. legislature candidates valid: 50 states plus federal candidates")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
