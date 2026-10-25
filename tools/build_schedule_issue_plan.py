"""Plan schedule alerts without treating missing failure history as a recovery."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def build_schedule_issue_plan(snapshot: dict[str, Any]) -> dict[str, Any]:
    """Only repeated errors open alerts, and only current parsed data closes them."""
    sources = snapshot.get("sources")
    if not isinstance(sources, dict):
        raise ValueError("Schedule snapshot needs a sources object")
    actions = []
    for source_id, source in sorted(sources.items()):
        if not isinstance(source_id, str) or not source_id or not isinstance(source, dict):
            raise ValueError("Invalid schedule source")
        status = source.get("status")
        failures = source.get("consecutive_failures")
        if status not in {"ok", "empty", "error"}:
            raise ValueError(f"Unknown schedule status for {source_id}")
        if type(failures) is not int or failures < 0:
            raise ValueError(f"Invalid consecutive failure count for {source_id}")
        error = source.get("error")
        if error is not None and not isinstance(error, str):
            raise ValueError(f"Invalid schedule error for {source_id}")
        if status == "error" and failures >= 3:
            action = "open"
        elif status == "ok":
            action = "close"
        else:
            # A cold baseline or an empty result does not resolve an existing alert.
            continue
        actions.append(
            {
                "source_id": source_id,
                "action": action,
                "status": status,
                "consecutive_failures": failures,
                "error": error,
            }
        )
    return {"actions": actions}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--schedules", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args(argv)
    try:
        snapshot = json.loads(args.schedules.read_text(encoding="utf-8"))
        if not isinstance(snapshot, dict):
            raise ValueError("Schedule snapshot must be an object")
        plan = build_schedule_issue_plan(snapshot)
    except (OSError, ValueError) as error:
        parser.error(str(error))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
