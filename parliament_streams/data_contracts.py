"""Validate maintained and generated data at their publication boundaries."""

from __future__ import annotations

from collections.abc import Callable
from functools import lru_cache
from pathlib import Path
from typing import Any, cast

from jsonschema import Draft202012Validator, FormatChecker
from jsonschema.protocols import Validator

from .catalogue import load_json_object

SCHEMA_DIRECTORY = Path(__file__).resolve().parents[1] / "schema"


@lru_cache(maxsize=8192)
def _cached_string_format(check: Callable[[object], bool], value: str) -> bool:
    """Reuse pure IRI parsing for repeated evidence URLs, with bounded memory."""
    return check(value)


def schema_validator(schema: dict[str, Any]) -> Validator:
    """Build a validator that cannot silently skip a schema's declared formats."""
    Draft202012Validator.check_schema(schema)
    formats: set[str] = set()
    pending: list[object] = [schema]
    while pending:
        item = pending.pop()
        if isinstance(item, dict):
            if isinstance(value := item.get("format"), str):
                formats.add(value)
            pending.extend(item.values())
        elif isinstance(item, list):
            pending.extend(item)
    checker = FormatChecker()
    missing = formats - checker.checkers.keys()
    if missing:
        raise ValueError(
            "Schema format validators unavailable: "
            + ", ".join(sorted(missing))
            + "; install the locked jsonschema format dependencies"
        )
    if "iri" in formats:
        check, raises = checker.checkers["iri"]

        @checker.checks("iri", raises=raises)
        def check_iri(value: object) -> bool:
            return not isinstance(value, str) or _cached_string_format(check, value)

    return Draft202012Validator(schema, format_checker=checker)


def require_json_schema(document: object, schema_filename: str, *, label: str) -> None:
    """Reject a malformed data product before writing or publishing it."""
    schema = load_json_object(SCHEMA_DIRECTORY / schema_filename)
    error = next(schema_validator(schema).iter_errors(cast(Any, document)), None)
    if error is not None:
        raise ValueError(f"Invalid {label}: {error.json_path}: {error.message}")
