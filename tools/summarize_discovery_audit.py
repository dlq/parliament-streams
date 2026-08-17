"""Summarize validated discovery results that are absent from the catalogue."""

from __future__ import annotations

import argparse
from pathlib import Path

from parliament_streams.catalogue import load_catalogue, load_json_object
from parliament_streams.discovery import build_discovery_findings, parse_discovery_decisions
from parliament_streams.management import write_json


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--static", type=Path, action="append", default=[])
    parser.add_argument("--browser", type=Path, action="append", default=[])
    parser.add_argument(
        "--decisions",
        type=Path,
        default=Path("data/discovery/reviewed-manifests.json"),
    )
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    decisions = parse_discovery_decisions(load_json_object(args.decisions))
    report = build_discovery_findings(
        load_catalogue(),
        [(str(path), load_json_object(path)) for path in args.static],
        [(str(path), load_json_object(path)) for path in args.browser],
        decisions=decisions,
    )
    write_json(args.output, report)
    print(
        f"Validated {report['counts']['validated']} manifest(s); "
        f"{report['counts']['reviewed']} previously reviewed; "
        f"{report['counts']['review']} need review"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
