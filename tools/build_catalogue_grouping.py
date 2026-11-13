"""Build or check the catalogue grouping data product."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

if __package__ in {None, ""}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from parliament_streams.catalogue import load_catalogue, load_json_object  # noqa: E402
from parliament_streams.catalogue_grouping import build_catalogue_grouping  # noqa: E402

DATA = Path(__file__).resolve().parents[1] / "data"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    target = DATA / "catalogue-grouping.json"
    try:
        product = build_catalogue_grouping(
            load_catalogue(DATA / "channels.json"),
            load_json_object(DATA / "institutions.json"),
            load_json_object(DATA / "discovery/catalogue-grouping.json"),
        )
        expected = (
            json.dumps(product, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n"
        )
        if args.check:
            if not target.exists() or target.read_text(encoding="utf-8") != expected:
                parser.error("Grouping snapshot is stale; run make catalogue-grouping")
        else:
            target.write_text(expected, encoding="utf-8")
            unresolved = [
                key
                for key, row in product["sources"].items()
                if row["placement_status"] == "provisional"
                and (
                    row["placement"] is None
                    or product["jurisdictions"][row["placement"]["jurisdiction_id"]]["kind"]
                    == "subnational"
                )
            ]
            if unresolved:
                print("Provisional subnational or unplaced sources:", ", ".join(sorted(unresolved)))
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.error(str(error))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
