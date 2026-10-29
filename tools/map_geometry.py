"""Shared geometry safeguards for optional, offline Shapely map builders."""

from shapely import coverage_is_valid, set_precision
from shapely.geometry import MultiPolygon, Polygon
from shapely.geometry.base import BaseGeometry
from shapely.geometry.polygon import orient


def multipolygon(geometry: BaseGeometry) -> MultiPolygon:
    if isinstance(geometry, Polygon):
        return MultiPolygon([geometry])
    if isinstance(geometry, MultiPolygon):
        return geometry
    raise ValueError("Expected polygonal boundary geometry")


def snap_exteriors(geometry: MultiPolygon) -> MultiPolygon:
    """Quantize shared exterior edges, retaining even tiny source interior holes."""
    snapped = multipolygon(set_precision(geometry, 0.0000001))
    holes = [list(ring.coords) for part in geometry.geoms for ring in part.interiors]
    parts = []
    for part in snapped.geoms:
        shell = Polygon(part.exterior)
        retained = [ring for ring in holes if shell.covers(Polygon(ring).representative_point())]
        coordinates = [(round(x, 7), round(y, 7)) for x, y in part.exterior.coords]
        parts.append(orient(Polygon(coordinates, retained), sign=-1))
    return MultiPolygon(parts)


def preserved(originals: list[MultiPolygon], results: list[MultiPolygon]) -> bool:
    return bool(coverage_is_valid(results)) and all(
        new.is_valid
        and not new.is_empty
        and len(old.geoms) == len(new.geoms)
        and sum(len(part.interiors) for part in old.geoms)
        == sum(len(part.interiors) for part in new.geoms)
        and all(new.covers(part.representative_point()) for part in old.geoms)
        for old, new in zip(originals, results, strict=True)
    )
