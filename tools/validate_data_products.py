"""Validate publication products, or build and check an offline preview bundle."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import cast

if __package__ in {None, ""}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from parliament_streams.catalogue import load_catalogue, load_json_object  # noqa: E402
from parliament_streams.data_contracts import SCHEMA_DIRECTORY, schema_validator  # noqa: E402
from parliament_streams.data_products import validate_data_products  # noqa: E402
from parliament_streams.iptv import write_iptv_exports  # noqa: E402
from parliament_streams.schedule_collection import ScheduleSnapshot, utc_timestamp, write_snapshot  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-dir", type=Path, help="actual assembled publication data directory")
    args = parser.parse_args(argv)
    try:
        for path in sorted(SCHEMA_DIRECTORY.glob("*.json")):
            schema_validator(load_json_object(path))
        if args.data_dir is not None:
            result = validate_data_products(args.data_dir)
        else:
            with TemporaryDirectory(prefix="parliament-products-") as temporary:
                directory = Path(temporary)
                for name in (
                    "channels.json",
                    "fallbacks.json",
                    "supranational.json",
                    "institutions.json",
                ):
                    shutil.copyfile(ROOT / "data" / name, directory / name)
                schedule_schema = load_json_object(SCHEMA_DIRECTORY / "schedules.schema.json")
                snapshot = cast(
                    ScheduleSnapshot,
                    {
                        "schema_version": 3,
                        "generated_at": utc_timestamp(),
                        "refresh_interval_hours": 6,
                        "channels": {},
                        "sources": {},
                        "counts": {
                            field: 0
                            for field in schedule_schema["properties"]["counts"]["required"]
                        },
                    },
                )
                write_snapshot(directory / "schedules.json", snapshot)
                write_iptv_exports(
                    load_catalogue(directory / "channels.json"),
                    snapshot,
                    directory,
                    "https://dlq.ca/parliament-streams/data/epg.xml",
                )
                result = validate_data_products(directory)
        print(json.dumps(result, sort_keys=True))
    except (OSError, ValueError) as error:
        parser.error(str(error))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
