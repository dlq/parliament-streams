"""Generate the classic-script snapshot used by local file previews."""

from __future__ import annotations

import json
from pathlib import Path

from .catalogue import DEFAULT_CATALOGUE_PATH, load_catalogue
from .models import Catalogue

DEFAULT_SITE_DATA_PATH = Path(__file__).resolve().parents[1] / "site" / "catalogue-data.js"


def render_site_data_payload(catalogue: Catalogue) -> str:
    payload = json.dumps(catalogue, ensure_ascii=False, indent=2)
    return f"window.PARLIAMENT_STREAMS_CATALOGUE = {payload};\n"


def render_site_data(catalogue_path: Path = DEFAULT_CATALOGUE_PATH) -> str:
    return render_site_data_payload(load_catalogue(catalogue_path))


def write_site_data(
    catalogue_path: Path = DEFAULT_CATALOGUE_PATH,
    target_path: Path = DEFAULT_SITE_DATA_PATH,
) -> None:
    target_path.parent.mkdir(parents=True, exist_ok=True)
    target_path.write_text(render_site_data(catalogue_path), encoding="utf-8")


def site_data_is_current(
    catalogue_path: Path = DEFAULT_CATALOGUE_PATH,
    target_path: Path = DEFAULT_SITE_DATA_PATH,
) -> bool:
    return target_path.exists() and target_path.read_text(encoding="utf-8") == render_site_data(
        catalogue_path
    )
