# /// script
# requires-python = ">=3.11"
# dependencies = ["shapely==2.2.0"]
# ///
"""Rebuild mapped Korean regions and their national context from one pinned source.

Run: uv run tools/build_korean_map_geometry.py HangJeongDong_ver20261001.geojson
"""

import argparse
import hashlib
import json
import sys
from collections import defaultdict
from pathlib import Path

from shapely import coverage_is_valid, coverage_simplify
from shapely.geometry import MultiPolygon, mapping, shape
from shapely.geometry.base import BaseGeometry
from shapely.geometry.polygon import orient
from shapely.ops import unary_union

if __package__ in {None, ""}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.map_geometry import multipolygon, preserved, snap_exteriors  # noqa: E402

SOURCE_COMMIT = "3bc00489b76696db864bdbea4b19985cdfa8b403"
SOURCE_SHA256 = "843ece3a0b3429742cd4a1b699cc13987a88b5e5401f382e7fdaaa194ea5e605"
LICENSE_COMMIT = "d5d5a821c8de6cc337d47eeca604d7af76271c9b"
SOURCE_URL = (
    f"https://raw.githubusercontent.com/vuski/admdongkor/{SOURCE_COMMIT}/"
    "ver20261001/HangJeongDong_ver20261001.geojson"
)
REGIONS = {
    "Daegu": ("27", "대구광역시"),
    "Gyeongsangbuk-do": ("47", "경상북도"),
    "Incheon": ("28", "인천광역시"),
    "Busan": ("26", "부산광역시"),
    "Chungcheongnam-do": ("44", "충청남도"),
    "Jeonbuk State": ("52", "전북특별자치도"),
    "Jeonnam–Gwangju Integrated Special City": ("12", "전남광주통합특별시"),
    "Gyeongsangnam-do": ("48", "경상남도"),
    "Sejong": ("36", "세종특별자치시"),
}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument(
        "--map-directory",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "site/assets/maps",
    )
    args = parser.parse_args()
    raw = args.source.read_bytes()
    if hashlib.sha256(raw).hexdigest() != SOURCE_SHA256:
        raise ValueError("Input does not match the pinned October 2026 boundary snapshot")
    features = json.loads(raw)["features"]
    groups: dict[str, list[BaseGeometry]] = defaultdict(list)
    names: dict[str, set[str]] = defaultdict(set)
    for feature in features:
        geometry = shape(feature["geometry"])
        if not geometry.is_valid or geometry.is_empty:
            raise ValueError("Invalid source unit requires review before aggregation")
        code = feature["properties"]["sido"]
        groups[code].append(geometry)
        names[code].add(feature["properties"]["sidonm"])
    if len(features) != 3559 or len(groups) != 16:
        raise ValueError("Unexpected source unit or first-level group count")
    selected = []
    for code, name in REGIONS.values():
        if names[code] != {name}:
            raise ValueError(f"{code}: mismatched regional identity")
        selected.append(multipolygon(unary_union(groups[code])))
    if not coverage_is_valid(selected):
        raise ValueError("Mapped regional source boundaries do not form a valid coverage")
    country = multipolygon(
        unary_union([geometry for group in groups.values() for geometry in group])
    )
    remainder = multipolygon(country.difference(unary_union(selected)))
    partition = selected + [remainder]
    if not coverage_is_valid(partition):
        raise ValueError("Regional outlines and remaining national context do not match")
    tolerance = 0.005
    for _ in range(12):
        simplified = [multipolygon(item) for item in coverage_simplify(partition, tolerance)]
        results = [snap_exteriors(item) for item in simplified]
        if preserved(partition, results):
            break
        tolerance /= 2
    else:
        raise ValueError("No simplification passed the topology and island safeguards")
    national = multipolygon(unary_union(results))
    if len(national.geoms) != len(country.geoms) or not national.is_valid:
        raise ValueError("National reconstruction changed island components or validity")
    root = args.map_directory
    path = root / "documented-admin1.geojson"
    document = json.loads(path.read_text())
    replacements = dict(zip(REGIONS, results[:-1], strict=True))
    if {
        f["properties"]["name"]
        for f in document["features"]
        if f["properties"]["parent_code"] == "KR"
    } != set(REGIONS):
        raise ValueError("Mapped Korean inventory differs from the reviewed source mapping")
    for feature in document["features"]:
        name = feature["properties"]["name"]
        if feature["properties"]["parent_code"] == "KR":
            feature["geometry"] = mapping(replacements[name])
            feature["properties"].update(
                {"boundary_source": "korea-source.json", "source_sido_code": REGIONS[name][0]}
            )
    generalization = document["display_generalization"]
    generalization["unchanged_parent_codes"] = [
        code for code in generalization["unchanged_parent_codes"] if code != "KR"
    ]
    generalization["simplified_parent_codes"] = sorted(
        set(generalization["simplified_parent_codes"]) | {"KR"}
    )
    generalization["applied_tolerance_degrees_by_parent"]["KR"] = tolerance
    generalization.setdefault("source_overrides", {})["KR"] = "korea-source.json"
    path.write_text(json.dumps(document, ensure_ascii=False, separators=(",", ":")) + "\n")
    context_path = root / "countries/KR.geojson"
    context = json.loads(context_path.read_text())
    context["geometry"] = mapping(MultiPolygon([orient(part, sign=-1) for part in national.geoms]))
    override = {
        "preserve_source_override": True,
        "source_metadata": "korea-source.json",
        "dataset": "SGIS-derived vuski/admdongkor, 2026-10-01 snapshot",
        "license": "CC BY 4.0 with SGIS attribution under KOGL Type 1",
        "source_sha256": SOURCE_SHA256,
        "tolerance_degrees": tolerance,
    }
    context["properties"]["context_source"] = override
    context_path.write_text(json.dumps(context, ensure_ascii=False, separators=(",", ":")) + "\n")
    metadata = {
        "snapshot_date": "2026-10-01",
        "source_url": SOURCE_URL,
        "source_commit": SOURCE_COMMIT,
        "source_sha256": SOURCE_SHA256,
        "license_url": f"https://github.com/vuski/admdongkor/blob/{LICENSE_COMMIT}/LICENSE-DATA",
        "license": override["license"],
        "attribution": (
            "SGIS administrative-dong boundaries (KOGL Type 1), adapted by vuski/admdongkor "
            "(CC BY 4.0), further processed by Parliament Streams."
        ),
        "source_units": len(features),
        "source_first_level_groups": len(groups),
        "mapped_regions": {
            name: {"sido_code": code, "source_name": label, "units": len(groups[code])}
            for name, (code, label) in REGIONS.items()
        },
        "display_tolerance_degrees": tolerance,
        "changes": (
            "Dissolve source units by explicit current first-level codes; simplify nine mapped "
            "regions and the unlabelled remaining national context together. Snap exterior edges "
            "to seven decimals, retaining source hole rings. Preserve all components and original "
            "component interior points; normalize D3 winding."
        ),
        "limits": (
            "A maintained SGIS-derived snapshot, not a newly surveyed 2026 cadastral dataset. "
            "The seven unmapped regional groups are used only for national context; their "
            "individual authority or shared-edge accuracy is not certified. Three tiny "
            "source-edge mismatches among Seoul/Gyeonggi/Incheon disappear within "
            "national-context union; no additional regional records are published."
        ),
    }
    (root / "korea-source.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n"
    )
    index_path = root / "country-detail-index.json"
    index = json.loads(index_path.read_text())
    for row in index["countries"]:
        if row["code"] == "KR":
            row.update({"bytes": context_path.stat().st_size, "source_override": override})
    index["description"] = (
        "Detailed national context loaded only for visible countries at regional zoom. "
        "Source overrides take precedence over the default Natural Earth source."
    )
    index_path.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n")
    print(f"Rebuilt nine Korean regions and matching national context at tolerance {tolerance}.")


if __name__ == "__main__":
    main()
