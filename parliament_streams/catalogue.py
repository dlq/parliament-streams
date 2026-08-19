"""Helpers for loading the parliamentary stream catalogue."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, cast

from .models import Catalogue, ChannelRecord, FallbackCatalogue

DEFAULT_CATALOGUE_PATH = Path(__file__).resolve().parents[1] / "data" / "channels.json"
DEFAULT_FALLBACKS_PATH = Path(__file__).resolve().parents[1] / "data" / "fallbacks.json"


def load_json_object(path: Path) -> dict[str, Any]:
    """Load one JSON object with a useful error for non-object documents."""
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def load_catalogue(path: Path = DEFAULT_CATALOGUE_PATH) -> Catalogue:
    """Load the JSON catalogue from disk."""
    return cast(Catalogue, load_json_object(path))


def load_fallbacks(path: Path = DEFAULT_FALLBACKS_PATH) -> FallbackCatalogue:
    """Load the fallback-source catalogue from disk."""
    return cast(FallbackCatalogue, load_json_object(path))


def load_channel(path: Path) -> ChannelRecord:
    """Load a standalone channel record from disk."""
    value = load_json_object(path)
    if "candidate_version" in value or "channel" in value:
        raise ValueError("Candidate records must use candidate-promote")
    return cast(ChannelRecord, value)
