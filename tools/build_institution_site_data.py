"""Build the public legislature inventory JSON projection."""

from __future__ import annotations

import argparse
import json
import sys
from collections.abc import Sequence
from pathlib import Path
from typing import Any

if __package__ in {None, ""}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from parliament_streams.catalogue import load_json_object  # noqa: E402
from parliament_streams.inventory.projection import (  # noqa: E402
    DIRECTORY_REPORT,
    SERVICE_REGISTER_REPORT,
    build_payload,
)
from parliament_streams.inventory.reviews import load_reviews  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INVENTORY_PATH = ROOT / "data/discovery/institutions.json"
DEFAULT_CATALOGUE_PATH = ROOT / "data/channels.json"
DEFAULT_DIRECTORY_PATH = ROOT / DIRECTORY_REPORT
DEFAULT_SERVICE_REGISTER_PATH = ROOT / SERVICE_REGISTER_REPORT
DEFAULT_TARGET_PATH = ROOT / "data/institutions.json"


def render_site_data(
    inventory_path: Path = DEFAULT_INVENTORY_PATH,
    catalogue_path: Path = DEFAULT_CATALOGUE_PATH,
    directory_path: Path = DEFAULT_DIRECTORY_PATH,
    service_register_path: Path = DEFAULT_SERVICE_REGISTER_PATH,
    service_reviews: list[tuple[str, dict[str, Any]]] | None = None,
) -> str:
    """Render a deterministic JSON data product."""
    if service_reviews is None and inventory_path == DEFAULT_INVENTORY_PATH:
        service_reviews = load_reviews()
    payload = build_payload(
        load_json_object(inventory_path),
        load_json_object(catalogue_path),
        load_json_object(directory_path),
        load_json_object(service_register_path),
        service_reviews,
    )
    return json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n"


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true", help="fail if the snapshot is stale")
    mode.add_argument("--write", action="store_true", help="write the snapshot (default)")
    parser.add_argument("--inventory", type=Path, default=DEFAULT_INVENTORY_PATH)
    parser.add_argument("--catalogue", type=Path, default=DEFAULT_CATALOGUE_PATH)
    parser.add_argument("--directory", type=Path, default=DEFAULT_DIRECTORY_PATH)
    parser.add_argument("--service-register", type=Path, default=DEFAULT_SERVICE_REGISTER_PATH)
    parser.add_argument("--output", type=Path, default=DEFAULT_TARGET_PATH)
    parser.add_argument(
        "--review",
        action="append",
        type=Path,
        default=None,
        help="individual review report; defaults to the maintained service-review registry",
    )
    args = parser.parse_args(argv)
    try:
        reviews = (
            [
                (path.resolve().relative_to(ROOT).as_posix(), load_json_object(path))
                for path in args.review
            ]
            if args.review is not None
            else load_reviews()
            if args.inventory == DEFAULT_INVENTORY_PATH
            else []
        )
        expected = render_site_data(
            args.inventory, args.catalogue, args.directory, args.service_register, reviews
        )
        if args.check:
            if not args.output.exists() or args.output.read_text(encoding="utf-8") != expected:
                parser.error(
                    "institution snapshot is stale; run "
                    "`python tools/build_institution_site_data.py`"
                )
        else:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(expected, encoding="utf-8")
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.error(str(error))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
