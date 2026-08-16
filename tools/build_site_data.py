"""Build the classic-script catalogue snapshot used by direct file previews."""

from __future__ import annotations

import argparse

from parliament_streams.site_data import site_data_is_current, write_site_data


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="fail if the snapshot is stale")
    args = parser.parse_args()
    if args.check:
        if not site_data_is_current():
            parser.error("site/catalogue-data.js is stale; run `make site-data`")
        return 0

    write_site_data()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
