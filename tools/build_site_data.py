"""Build the classic-script catalogue snapshot used by direct file previews."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "channels.json"
TARGET = ROOT / "site" / "catalogue-data.js"


def render_catalogue_data() -> str:
    catalogue = json.loads(SOURCE.read_text(encoding="utf-8"))
    payload = json.dumps(catalogue, ensure_ascii=False, indent=2)
    return f"window.PARLIAMENT_STREAMS_CATALOGUE = {payload};\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="fail if the snapshot is stale")
    args = parser.parse_args()
    rendered = render_catalogue_data()

    if args.check:
        if not TARGET.exists() or TARGET.read_text(encoding="utf-8") != rendered:
            parser.error("site/catalogue-data.js is stale; run `make site-data`")
        return 0

    TARGET.write_text(rendered, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
