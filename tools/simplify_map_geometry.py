# /// script
# requires-python = ">=3.11"
# dependencies = ["shapely==2.2.0"]
# ///
"""Create a generalized display layer, retaining shared borders and island parts.

Run: uv run tools/simplify_map_geometry.py INPUT.geojson OUTPUT.geojson
Keep the unsimplified input separately; the output is a cartographic derivative.
"""

import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path
from typing import Any

from shapely import coverage_is_valid, coverage_simplify
from shapely.geometry import MultiPolygon, mapping, shape
from shapely.geometry.polygon import orient


def generalize(document: dict[str, Any], tolerance: float) -> dict[str, Any]:
    if "display_generalization" in document:
        raise ValueError("Use an unsimplified input, not an existing display derivative")
    groups = defaultdict(list)
    for feature in document["features"]:
        if feature["geometry"]["type"] == "MultiPolygon":
            groups[feature["properties"]["parent_code"]].append(feature)
    simplified, unchanged, tolerances = [], [], {}
    for code, features in sorted(groups.items()):
        originals: list[MultiPolygon] = []
        for feature in features:
            geometry = shape(feature["geometry"])
            if not isinstance(geometry, MultiPolygon):
                raise ValueError(f"{code}: expected a MultiPolygon source geometry")
            originals.append(geometry)
        if not coverage_is_valid(originals):
            unchanged.append(code)
            continue
        applied = tolerance
        for _ in range(12):
            results = coverage_simplify(originals, tolerance=applied)
            preserved = all(
                new.is_valid
                and not new.is_empty
                and len(old.geoms) == len(new.geoms)
                and sum(len(p.interiors) for p in old.geoms)
                == sum(len(p.interiors) for p in new.geoms)
                and all(new.covers(p.representative_point()) for p in old.geoms)
                for old, new in zip(originals, results, strict=True)
            )
            if preserved and coverage_is_valid(results):
                break
            applied /= 2
        else:
            unchanged.append(code)
            continue
        for feature, geometry in zip(features, results, strict=True):
            feature["geometry"] = mapping(
                MultiPolygon([orient(p, sign=-1) for p in geometry.geoms])
            )
        simplified.append(code)
        tolerances[code] = applied
    return {
        "method": "Shapely 2.2.0 coverage_simplify; shared edges processed together",
        "tolerance_degrees": tolerance,
        "applied_tolerance_degrees_by_parent": tolerances,
        "simplified_parent_codes": simplified,
        "unchanged_parent_codes": unchanged,
        "preserved": (
            "Feature identities, polygon-component counts, hole counts, original component "
            "interior points and valid shared-edge coverage. Institution-location Points "
            "are unchanged."
        ),
        "limits": (
            "Generalized display geometry, not cadastral accuracy. Angular tolerance is not "
            "a uniform metre distance. Invalid source coverages are left unchanged for review."
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--tolerance", type=float, default=0.005)
    args = parser.parse_args()
    if args.source.resolve() == args.output.resolve():
        parser.error("Input and output must be separate files")
    if not 0 < args.tolerance < 1:
        parser.error("Tolerance must be positive and less than one degree")
    raw = args.source.read_bytes()
    document = json.loads(raw)
    metadata = generalize(document, args.tolerance)
    metadata["source_sha256"] = hashlib.sha256(raw).hexdigest()
    document["display_generalization"] = metadata
    args.output.write_text(json.dumps(document, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
