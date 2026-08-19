"""Generate the classic-script snapshot used by local file previews."""

from __future__ import annotations

import json
from pathlib import Path

from .catalogue import (
    DEFAULT_CATALOGUE_PATH,
    DEFAULT_FALLBACKS_PATH,
    load_catalogue,
    load_fallbacks,
)
from .models import Catalogue, FallbackCatalogue

DEFAULT_SITE_DATA_PATH = Path(__file__).resolve().parents[1] / "site" / "catalogue-data.js"


def render_site_data_payload(
    catalogue: Catalogue, fallbacks: FallbackCatalogue | None = None
) -> str:
    payload = json.dumps(catalogue, ensure_ascii=False, indent=2)
    content = f"window.PARLIAMENT_STREAMS_CATALOGUE = {payload};\n"
    if fallbacks is not None:
        fallback_payload = json.dumps(fallbacks, ensure_ascii=False, indent=2)
        content += f"window.PARLIAMENT_STREAMS_FALLBACKS = {fallback_payload};\n"
    return content


def render_site_data(
    catalogue_path: Path = DEFAULT_CATALOGUE_PATH,
    fallbacks_path: Path = DEFAULT_FALLBACKS_PATH,
) -> str:
    return render_site_data_payload(load_catalogue(catalogue_path), load_fallbacks(fallbacks_path))


def write_site_data(
    catalogue_path: Path = DEFAULT_CATALOGUE_PATH,
    fallbacks_path: Path = DEFAULT_FALLBACKS_PATH,
    target_path: Path = DEFAULT_SITE_DATA_PATH,
) -> None:
    target_path.parent.mkdir(parents=True, exist_ok=True)
    target_path.write_text(render_site_data(catalogue_path, fallbacks_path), encoding="utf-8")


def site_data_is_current(
    catalogue_path: Path = DEFAULT_CATALOGUE_PATH,
    fallbacks_path: Path = DEFAULT_FALLBACKS_PATH,
    target_path: Path = DEFAULT_SITE_DATA_PATH,
) -> bool:
    return target_path.exists() and target_path.read_text(encoding="utf-8") == render_site_data(
        catalogue_path, fallbacks_path
    )
