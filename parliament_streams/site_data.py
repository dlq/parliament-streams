"""Load and validate the shared map context JSON product."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from .catalogue import load_json_object
from .data_contracts import require_json_schema

DEFAULT_SUPRANATIONAL_PATH = Path(__file__).resolve().parents[1] / "data" / "supranational.json"


def load_supranational(path: Path = DEFAULT_SUPRANATIONAL_PATH) -> dict[str, Any]:
    """Load the map's supranational membership context."""
    value = load_json_object(path)
    require_json_schema(value, "supranational.schema.json", label="supranational map context")
    organizations = value["organizations"]
    if len({item["id"] for item in organizations}) != len(organizations):
        raise ValueError("Supranational organization IDs must be unique")
    return value
