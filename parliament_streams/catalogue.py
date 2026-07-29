"""Helpers for loading the parliamentary stream catalogue."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DEFAULT_CATALOGUE_PATH = Path(__file__).resolve().parents[1] / "data" / "channels.json"


def load_catalogue(path: Path = DEFAULT_CATALOGUE_PATH) -> dict[str, Any]:
    """Load the JSON catalogue from disk."""
    return json.loads(path.read_text(encoding="utf-8"))
