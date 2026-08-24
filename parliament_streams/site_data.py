"""Generate the classic-script snapshot used by local file previews."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .catalogue import (
    DEFAULT_CATALOGUE_PATH,
    DEFAULT_FALLBACKS_PATH,
    load_catalogue,
    load_fallbacks,
)
from .models import Catalogue, FallbackCatalogue

DEFAULT_SITE_DATA_PATH = Path(__file__).resolve().parents[1] / "site" / "catalogue-data.js"
DEFAULT_SUPRANATIONAL_PATH = Path(__file__).resolve().parents[1] / "data" / "supranational.json"
DEFAULT_SCHEDULES_PATH = Path(__file__).resolve().parents[1] / "data" / "schedules.json"


def load_supranational(path: Path = DEFAULT_SUPRANATIONAL_PATH) -> dict[str, Any]:
    """Load the map's supranational membership context."""
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"Expected a JSON object in {path}")
    return value


def load_schedules(path: Path = DEFAULT_SCHEDULES_PATH) -> dict[str, Any]:
    """Load the retained schedule snapshot used by local file previews."""
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"Expected a JSON object in {path}")
    return value


def render_site_data_payload(
    catalogue: Catalogue,
    fallbacks: FallbackCatalogue | None = None,
    supranational: dict[str, Any] | None = None,
    schedules: dict[str, Any] | None = None,
) -> str:
    payload = json.dumps(catalogue, ensure_ascii=False, indent=2)
    content = f"window.PARLIAMENT_STREAMS_CATALOGUE = {payload};\n"
    if fallbacks is not None:
        fallback_payload = json.dumps(fallbacks, ensure_ascii=False, indent=2)
        content += f"window.PARLIAMENT_STREAMS_FALLBACKS = {fallback_payload};\n"
    if supranational is not None:
        supranational_payload = json.dumps(supranational, ensure_ascii=False, indent=2)
        content += f"window.PARLIAMENT_STREAMS_SUPRANATIONAL = {supranational_payload};\n"
    if schedules is not None:
        schedule_payload = json.dumps(schedules, ensure_ascii=False, indent=2)
        content += f"window.PARLIAMENT_STREAMS_SCHEDULES = {schedule_payload};\n"
    return content


def render_site_data(
    catalogue_path: Path = DEFAULT_CATALOGUE_PATH,
    fallbacks_path: Path = DEFAULT_FALLBACKS_PATH,
    supranational_path: Path = DEFAULT_SUPRANATIONAL_PATH,
    schedules_path: Path = DEFAULT_SCHEDULES_PATH,
) -> str:
    supranational = load_supranational(supranational_path)
    return render_site_data_payload(
        load_catalogue(catalogue_path),
        load_fallbacks(fallbacks_path),
        supranational,
        load_schedules(schedules_path),
    )


def write_site_data(
    catalogue_path: Path = DEFAULT_CATALOGUE_PATH,
    fallbacks_path: Path = DEFAULT_FALLBACKS_PATH,
    target_path: Path = DEFAULT_SITE_DATA_PATH,
    supranational_path: Path = DEFAULT_SUPRANATIONAL_PATH,
    schedules_path: Path = DEFAULT_SCHEDULES_PATH,
) -> None:
    target_path.parent.mkdir(parents=True, exist_ok=True)
    target_path.write_text(
        render_site_data(catalogue_path, fallbacks_path, supranational_path, schedules_path),
        encoding="utf-8",
    )


def site_data_is_current(
    catalogue_path: Path = DEFAULT_CATALOGUE_PATH,
    fallbacks_path: Path = DEFAULT_FALLBACKS_PATH,
    target_path: Path = DEFAULT_SITE_DATA_PATH,
    supranational_path: Path = DEFAULT_SUPRANATIONAL_PATH,
    schedules_path: Path = DEFAULT_SCHEDULES_PATH,
) -> bool:
    return target_path.exists() and target_path.read_text(encoding="utf-8") == render_site_data(
        catalogue_path, fallbacks_path, supranational_path, schedules_path
    )
