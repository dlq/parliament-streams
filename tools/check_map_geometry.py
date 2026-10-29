# /// script
# requires-python = ">=3.11"
# dependencies = ["shapely==2.2.0"]
# ///
"""Check bundled regional topology without adding a site/runtime dependency.

Run: uv run tools/check_map_geometry.py
Overlaps are review leads: different source generalizations or legitimately
nested jurisdictions need interpretation, not automatic geometry subtraction.
"""

import itertools
import json
from pathlib import Path

from shapely.geometry import shape
from shapely.validation import explain_validity


def main() -> None:
    root = Path(__file__).resolve().parents[1] / "site/assets/maps"
    features = [
        feature
        for name in ("documented-admin1.geojson", "lienchiang-odbl.geojson")
        for feature in json.loads((root / name).read_text())["features"]
        if feature["geometry"]["type"] == "MultiPolygon"
    ]
    areas = [(feature["properties"], shape(feature["geometry"])) for feature in features]
    invalid = [
        {"name": props["name"], "reason": explain_validity(geometry)}
        for props, geometry in areas
        if not geometry.is_valid or geometry.is_empty
    ]
    contexts = [
        json.loads(path.read_text()) for path in sorted((root / "countries").glob("*.geojson"))
    ]
    for feature in contexts:
        geometry = shape(feature["geometry"])
        if not geometry.is_valid or geometry.is_empty:
            invalid.append(
                {
                    "name": f"national context: {feature['properties']['name']}",
                    "reason": explain_validity(geometry),
                }
            )
    by_code = {
        (
            "TW" if feature["properties"]["iso_a2"] == "CN-TW" else feature["properties"]["iso_a2"]
        ): feature
        for feature in contexts
    }
    alignment = []
    for props, geometry in areas:
        context = by_code.get(props["parent_code"])
        if not context or not geometry.is_valid:
            continue
        source = context["properties"].get("context_source", {})
        if not props.get("boundary_source") or props["boundary_source"] != source.get(
            "source_metadata"
        ):
            continue
        national = shape(context["geometry"])
        if national.is_valid and not national.buffer(1e-9).covers(geometry):
            alignment.append({"name": props["name"], "parent_code": props["parent_code"]})
    overlaps = []
    for (left, a), (right, b) in itertools.combinations(areas, 2):
        if left["parent_code"] != right["parent_code"]:
            continue
        if not a.is_valid or not b.is_valid or a.is_empty or b.is_empty:
            continue
        fraction = a.intersection(b).area / min(a.area, b.area)
        if fraction > 0.0001:
            overlaps.append(
                {
                    "regions": [left["name"], right["name"]],
                    "fraction_of_smaller_planar_area": fraction,
                }
            )
    print(
        json.dumps(
            {
                "outlines": len(areas),
                "country_context_outlines": len(contexts),
                "invalid": invalid,
                "overlap_review": overlaps,
                "same_source_context_mismatch": alignment,
            },
            indent=2,
        )
    )
    if invalid or alignment:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
