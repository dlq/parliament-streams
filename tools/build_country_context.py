# /// script
# requires-python = ">=3.11"
# dependencies = ["shapely==2.2.0"]
# ///
"""Build optional detailed country context from Natural Earth Admin 0 v5.1.1.

Run: uv run tools/build_country_context.py ne_10m_admin_0_countries.geojson
The input is a local upstream snapshot; this command makes no network requests.
"""

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

from shapely.geometry import MultiPolygon, Polygon, mapping, shape
from shapely.geometry.base import BaseGeometry
from shapely.geometry.polygon import orient

SOURCE_URL = "https://github.com/nvkelso/natural-earth-vector/blob/v5.1.1/geojson/ne_10m_admin_0_countries.geojson"


def canonical_code(code: str) -> str:
    return "TW" if code == "CN-TW" else code


def polygons(geometry: BaseGeometry) -> list[Polygon]:
    if isinstance(geometry, Polygon):
        return [geometry]
    if isinstance(geometry, MultiPolygon):
        return list(geometry.geoms)
    raise ValueError("Country context must be polygonal")


def simplify_country(source: dict[str, Any]) -> tuple[dict[str, Any], float]:
    original = shape(source["geometry"])
    if not original.is_valid or original.is_empty:
        raise ValueError("Invalid upstream country needs source review before publication")
    components = polygons(original)
    tolerance = 0.005
    for _ in range(12):
        result = original.simplify(tolerance, preserve_topology=True)
        if (
            result.is_valid
            and len(polygons(result)) == len(components)
            and all(result.covers(part.representative_point()) for part in components)
        ):
            break
        tolerance /= 2
    else:
        result, tolerance = original, 0
    return mapping(MultiPolygon([orient(part, sign=-1) for part in polygons(result)])), tolerance


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    root = Path(__file__).resolve().parents[1] / "site/assets/maps"
    parser.add_argument("--output-directory", type=Path, default=root / "countries")
    args = parser.parse_args()
    raw = args.source.read_bytes()
    upstream = json.loads(raw)["features"]
    overview = json.loads((root / "countries-110m.geojson").read_text())["features"]
    regions = json.loads((root / "documented-admin1.geojson").read_text())["features"]
    parents = {feature["properties"]["parent_code"] for feature in regions}
    index: dict[str, Any] = {
        "source": {
            "dataset": "Natural Earth Admin 0 Countries v5.1.1, 1:10 million",
            "url": SOURCE_URL,
            "sha256": hashlib.sha256(raw).hexdigest(),
            "license": "Public domain",
            "changes": (
                "Preserve existing navigation identities; detailed polygons, topology-preserving "
                "simplification at at most 0.005 degrees, component-interior checks, D3 winding. "
                "No ODbL-derived geometry is incorporated."
            ),
        },
        "description": (
            "Detailed national context loaded only for visible countries at regional zoom."
        ),
        "countries": [],
    }
    args.output_directory.mkdir(parents=True, exist_ok=True)
    for code in sorted(parents):
        anchor = next(
            row for row in overview if canonical_code(row["properties"]["iso_a2"]) == code
        )
        candidates = [row for row in upstream if row["properties"]["ISO_A2_EH"] == code]
        matches = [row for row in candidates if row["properties"]["ISO_A2"] == code]
        if not matches:
            matches = [
                row
                for row in candidates
                if anchor["properties"]["name"]
                in (row["properties"]["ADMIN"], row["properties"]["NAME"])
            ]
        if not matches and len(candidates) == 1:
            matches = candidates
        if len(matches) != 1:
            raise ValueError(f"{code}: expected exactly one upstream country identity")
        source = matches[0]
        geometry, tolerance = simplify_country(source)
        feature = dict(anchor, properties=dict(anchor["properties"]), geometry=geometry)
        feature["properties"]["context_source"] = {
            "code": anchor["properties"]["iso_a2"],
            "source_admin0_id": source["properties"]["ADM0_A3"],
            "tolerance_degrees": tolerance,
        }
        path = args.output_directory / f"{code}.geojson"
        path.write_text(json.dumps(feature, ensure_ascii=False, separators=(",", ":")) + "\n")
        index["countries"].append(
            {"code": code, "file": f"countries/{code}.geojson", "bytes": path.stat().st_size}
        )
    (args.output_directory.parent / "country-detail-index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2) + "\n"
    )
    print(f"Built {len(parents)} detailed country context files.")


if __name__ == "__main__":
    main()
