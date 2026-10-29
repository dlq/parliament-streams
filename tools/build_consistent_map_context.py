# /// script
# requires-python = ">=3.11"
# dependencies = ["shapely==2.2.0"]
# ///
"""Rebuild Swiss, Indonesian and Manx regions with matching national context.

Run: uv run tools/build_consistent_map_context.py SOURCE_DIRECTORY
Download the files listed in consistent-context-sources.json into that directory
first. This builder verifies their hashes and makes no network requests.
"""

import argparse
import hashlib
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from shapely import STRtree, coverage_is_valid, coverage_simplify
from shapely.geometry import MultiPolygon, mapping, shape
from shapely.geometry.polygon import orient
from shapely.ops import unary_union

if __package__ in {None, ""}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.map_geometry import multipolygon, preserved, snap_exteriors  # noqa: E402

MANIFEST = "consistent-context-sources.json"


def source_features(source: dict[str, Any], directory: Path) -> list[dict[str, Any]]:
    features: list[dict[str, Any]] = []
    for entry in source["source_files"]:
        raw = (directory / entry["file"]).read_bytes()
        if hashlib.sha256(raw).hexdigest() != entry["sha256"]:
            raise ValueError(f"{entry['file']}: input does not match the reviewed source")
        document = json.loads(raw)
        features.extend(
            [document["feature"]] if source["format"] == "swiss-feature" else document["features"]
        )
    filters = source.get("filter", {})
    features = [
        feature
        for feature in features
        if all(feature["properties"].get(key) == value for key, value in filters.items())
    ]
    if len(features) != source["expected_source_units"]:
        raise ValueError("Unexpected number of source units")
    return features


def simplify(
    features: list[dict[str, Any]], tolerance: float
) -> tuple[list[MultiPolygon], MultiPolygon, dict[float, int]]:
    originals = [multipolygon(shape(feature["geometry"])) for feature in features]
    if any(not item.is_valid or item.is_empty for item in originals):
        raise ValueError("Invalid source unit requires review")
    if not coverage_is_valid(originals):
        raise ValueError("Source units do not form a valid coverage")
    original_country = multipolygon(unary_union(originals))
    # A tiny island must not force every mainland coastline to keep excessive detail.
    # Each disconnected landmass retains jointly simplified regional shared edges.
    tree = STRtree(list(original_country.geoms))
    # Nearby islands are processed together too: independent coast simplification
    # can otherwise merge them or create false enclosed water holes.
    parent = list(range(len(original_country.geoms)))

    def representative(index: int) -> int:
        while parent[index] != index:
            parent[index] = parent[parent[index]]
            index = parent[index]
        return index

    for index, part in enumerate(original_country.geoms):
        for nearby in tree.query(part, predicate="dwithin", distance=2 * tolerance):
            left, right = representative(index), representative(int(nearby))
            parent[left] = right
    groups: dict[int, list[tuple[int, MultiPolygon]]] = defaultdict(list)
    for owner, geometry in enumerate(originals):
        for part in geometry.geoms:
            matches = tree.query(part.representative_point(), predicate="intersects")
            if len(matches) != 1:
                raise ValueError("Source component has ambiguous national membership")
            groups[representative(int(matches[0]))].append((owner, multipolygon(part)))
    assembled: list[list[Any]] = [[] for _ in originals]
    tolerances: Counter[float] = Counter()
    for group in groups.values():
        parts = [part for _, part in group]
        original_union = multipolygon(unary_union(parts))
        applied = tolerance
        for _ in range(14):
            results = [
                snap_exteriors(multipolygon(item)) for item in coverage_simplify(parts, applied)
            ]
            country = multipolygon(unary_union(results))
            if preserved(parts, results) and preserved([original_union], [country]):
                break
            applied /= 2
        else:
            raise ValueError("No simplification passed the topology and component safeguards")
        tolerances[applied] += 1
        for (owner, _), result in zip(group, results, strict=True):
            assembled[owner].extend(result.geoms)
    rebuilt = [MultiPolygon(parts) for parts in assembled]
    country = rebuilt[0] if len(rebuilt) == 1 else multipolygon(unary_union(rebuilt))
    if not preserved(originals, rebuilt) or not preserved([original_country], [country]):
        raise ValueError("Reassembled coverage changed topology or lost source components")
    return rebuilt, country, dict(tolerances)


def write_json(path: Path, document: Any, *, pretty: bool = False) -> None:
    options: dict[str, Any] = {"ensure_ascii": False}
    options.update({"indent": 2} if pretty else {"separators": (",", ":")})
    path.write_text(json.dumps(document, **options) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_directory", type=Path)
    parser.add_argument(
        "--map-directory",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "site/assets/maps",
    )
    args = parser.parse_args()
    root = args.map_directory
    sources = json.loads((root / MANIFEST).read_text())
    regions_path = root / "documented-admin1.geojson"
    regions = json.loads(regions_path.read_text())
    index_path = root / "country-detail-index.json"
    index = json.loads(index_path.read_text())
    # Complete source validation and all three rebuilds before writing outputs.
    contexts = {}
    for code, source in sources.items():
        features = source_features(source, args.source_directory)
        identities = [feature["properties"][source["identity_property"]] for feature in features]
        if len(set(identities)) != len(identities):
            raise ValueError(f"{code}: ambiguous source identities")
        results, country, tolerances = simplify(features, source["max_display_tolerance_degrees"])
        tolerance = max(tolerances)
        by_id = dict(zip(identities, zip(features, results, strict=True), strict=True))
        mapped = {
            feature["properties"]["name"]: feature
            for feature in regions["features"]
            if feature["properties"]["parent_code"] == code
        }
        if set(mapped) != set(source["mapped_regions"]):
            raise ValueError(f"{code}: mapped inventory differs from reviewed identities")
        for name, selection in source["mapped_regions"].items():
            feature, geometry = by_id[selection["source_id"]]
            if feature["properties"][source["name_property"]] != selection["source_name"]:
                raise ValueError(f"{code}/{name}: source name differs from reviewed identity")
            mapped[name]["geometry"] = mapping(geometry)
            mapped[name]["properties"].update(
                {
                    "boundary_source": MANIFEST,
                    "source": source["dataset"],
                    "source_url": source["source_files"][0]["url"]
                    if len(source["source_files"]) == 1
                    else MANIFEST,
                    "license_url": source["license_url"],
                    "source_id": selection["source_id"],
                    "source_date": source["source_date"],
                    "simplification": (
                        f"Joint coverage simplification by landmass groups, "
                        f"up to {tolerance} degrees."
                    ),
                }
            )
        override = {
            "preserve_source_override": True,
            "source_metadata": MANIFEST,
            "source_key": code,
            "dataset": source["dataset"],
            "license": source["license"],
            "tolerance_degrees": tolerance,
            "minimum_tolerance_degrees": min(tolerances),
        }
        path = root / "countries" / f"{code}.geojson"
        context = json.loads(path.read_text())
        context["geometry"] = mapping(
            MultiPolygon([orient(part, sign=-1) for part in country.geoms])
        )
        context["properties"]["context_source"] = override
        contexts[code] = context
        source["processing"] = {
            "display_tolerance_degrees": tolerance,
            "landmass_group_counts_by_tolerance_degrees": dict(sorted(tolerances.items())),
            "national_components": len(country.geoms),
            "changes": (
                "Simplify source units jointly within groups of neighboring national landmasses; "
                "use smaller tolerances where island safeguards require them. "
                "Snap exterior edges to seven decimals, "
                "retain interior hole rings and normalize D3 winding. Preserve components, "
                "holes and original component interior points. National context is the union "
                "of these same simplified units; no regional clipping or guessed borders."
            ),
        }
        generalization = regions["display_generalization"]
        generalization.setdefault("source_overrides", {})[code] = MANIFEST
        generalization["applied_tolerance_degrees_by_parent"][code] = tolerance
        generalization["unchanged_parent_codes"] = [
            item for item in generalization["unchanged_parent_codes"] if item != code
        ]
        generalization["simplified_parent_codes"] = sorted(
            set(generalization["simplified_parent_codes"]) | {code}
        )
        print(
            f"{code}: {len(mapped)} regions, {len(country.geoms)} national components, {tolerance=}"
        )
    for code, context in contexts.items():
        path = root / "countries" / f"{code}.geojson"
        write_json(path, context)
        entry = next(item for item in index["countries"] if item["code"] == code)
        entry.update(
            {
                "bytes": path.stat().st_size,
                "source_override": context["properties"]["context_source"],
            }
        )
    write_json(regions_path, regions)
    write_json(index_path, index, pretty=True)
    write_json(root / MANIFEST, sources, pretty=True)


if __name__ == "__main__":
    main()
