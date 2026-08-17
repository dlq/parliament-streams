"""Validate the durable manifest-review decision ledger."""

from __future__ import annotations

import argparse
from pathlib import Path

from parliament_streams.catalogue import load_json_object
from parliament_streams.discovery import parse_discovery_decisions


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "path",
        type=Path,
        nargs="?",
        default=Path("data/discovery/reviewed-manifests.json"),
    )
    args = parser.parse_args()
    try:
        decisions = parse_discovery_decisions(load_json_object(args.path))
    except (OSError, ValueError) as error:
        parser.error(str(error))
    print(f"Discovery decisions valid: {len(decisions)} reviewed manifest(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
