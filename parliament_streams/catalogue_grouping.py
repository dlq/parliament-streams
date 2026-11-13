"""Project reviewed catalogue placements from the public inventory crosswalk."""

from __future__ import annotations

from collections import defaultdict
from typing import Any

from .data_contracts import require_json_schema
from .models import Catalogue

SCHEMA = "catalogue-grouping.schema.json"
CHAMBER_RELATION = "chamber_of_existing_umbrella_legislature"


def ancestry(records: dict[str, Any], key: str, parent_field: str) -> list[str]:
    """Return an ancestry path, rejecting dangling references and cycles."""
    path: list[str] = []
    seen: set[str] = set()
    while key is not None:
        if key in seen or key not in records:
            raise ValueError(f"Unknown or cyclic grouping ancestor: {key}")
        path.append(key)
        seen.add(key)
        key = records[key].get(parent_field)
    return path


def build_catalogue_grouping(
    catalogue: Catalogue, inventory: dict[str, Any], reviewed: dict[str, Any]
) -> dict[str, Any]:
    jurisdictions = reviewed["jurisdictions"]
    rooms = reviewed["rooms"]
    overrides = reviewed["source_placements"]
    records = {record["id"]: record for record in inventory["records"]}
    bodies: dict[str, Any] = {}
    matches: dict[str, set[str]] = defaultdict(set)

    for record in records.values():
        for source_id in record["catalogue_ids"]:
            matches[source_id].add(record["id"])
    mappings = reviewed["institution_jurisdictions"]
    resolving: set[str] = set()

    def resolve_body(institution_id: str) -> str:
        if institution_id in bodies:
            return str(bodies[institution_id]["jurisdiction_id"])
        record = records.get(institution_id)
        if record is None or record["status"] != "eligible_legislature":
            raise ValueError(f"Grouping institution must be eligible: {institution_id}")
        if institution_id in resolving:
            raise ValueError(f"Cyclic chamber ancestry: {institution_id}")
        resolving.add(institution_id)
        parents = {
            relation["institution_id"]
            for relation in record["relationships"]
            if relation["type"] == CHAMBER_RELATION
        }
        if len(parents) > 1:
            raise ValueError(f"Grouping institution has multiple umbrellas: {institution_id}")
        parent = next(iter(parents), None)
        inherited = resolve_body(parent) if parent is not None else None
        jurisdiction_id = mappings.get(institution_id, inherited)
        if not isinstance(jurisdiction_id, str):
            raise ValueError(f"Missing jurisdiction mapping for institution: {institution_id}")
        if inherited is not None and inherited != jurisdiction_id:
            raise ValueError(
                f"Grouping umbrella must share the chamber jurisdiction: {institution_id}"
            )
        bodies[institution_id] = {
            "jurisdiction_id": jurisdiction_id,
            "label": record["name"],
            "aliases": record["aliases"],
            "umbrella_id": parent,
        }
        resolving.remove(institution_id)
        return jurisdiction_id

    for institution_id in sorted(set(mappings).union(*matches.values())):
        resolve_body(institution_id)

    jurisdictions_by_label: dict[tuple[str, str], list[str]] = defaultdict(list)
    for key, row in jurisdictions.items():
        jurisdictions_by_label[row["kind"], row["label"]].append(key)

    sources: dict[str, Any] = {}
    known_sources = {source["id"] for source in catalogue["channels"]}
    if (matches.keys() | overrides.keys()) - known_sources:
        raise ValueError("Grouping crosswalk or override references an unknown catalogue source")
    for source in catalogue["channels"]:
        source_id = source["id"]
        linked = matches[source_id]
        ancestors = {
            ancestor
            for institution in linked
            for ancestor in ancestry(bodies, institution, "umbrella_id")[1:]
        }
        deepest = linked - ancestors
        institution_id = next(iter(deepest)) if len(deepest) == 1 else None
        candidates = jurisdictions_by_label[
            source["jurisdiction_level"], source["country_or_region"]
        ]
        default_jurisdiction = candidates[0] if len(candidates) == 1 else None
        if institution_id is not None:
            default_jurisdiction = bodies[institution_id]["jurisdiction_id"]
        elif deepest:
            common = set.intersection(
                *(
                    set(ancestry(jurisdictions, bodies[key]["jurisdiction_id"], "parent_id"))
                    for key in deepest
                )
            )
            default_jurisdiction = max(
                common, key=lambda key: len(ancestry(jurisdictions, key, "parent_id")), default=None
            )
        override = overrides.get(source_id, {})
        if source_id in overrides and (
            override.keys() - {"jurisdiction_id", "room_id", "evidence", "provisional"}
            or not isinstance(override.get("evidence"), str)
            or not override["evidence"].strip()
            or not isinstance(override.get("provisional", False), bool)
        ):
            raise ValueError(f"Invalid grouping override or missing evidence: {source_id}")
        jurisdiction_id = override.get("jurisdiction_id", default_jurisdiction)
        room_id = override.get("room_id")
        if (
            institution_id is not None
            and bodies[institution_id]["jurisdiction_id"] != jurisdiction_id
        ):
            raise ValueError(f"Grouping placement conflicts with its institution: {source_id}")
        if room_id is not None and (
            room_id not in rooms or rooms[room_id]["institution_id"] != institution_id
        ):
            raise ValueError(f"Grouping room must belong to the placed institution: {source_id}")
        sources[source_id] = {
            "placement": (
                {
                    "jurisdiction_id": jurisdiction_id,
                    "institution_id": institution_id,
                    "room_id": room_id,
                }
                if jurisdiction_id is not None
                else None
            ),
            "reviewed_institution_ids": sorted(linked),
            "placement_status": (
                "reviewed"
                if (linked and jurisdiction_id is not None or override.get("evidence"))
                and not override.get("provisional")
                else "provisional"
            ),
        }

    product = {
        "schema_version": 1,
        "jurisdictions": jurisdictions,
        "institutions": bodies,
        "rooms": rooms,
        "sources": sources,
    }
    validate_catalogue_grouping(product, catalogue)
    return product


def validate_catalogue_grouping(product: dict[str, Any], catalogue: Catalogue) -> None:
    require_json_schema(product, SCHEMA, label="catalogue grouping")
    jurisdictions = product["jurisdictions"]
    institutions = product["institutions"]
    rooms = product["rooms"]
    if set(product["sources"]) != {source["id"] for source in catalogue["channels"]}:
        raise ValueError("Grouping source IDs must match the catalogue")
    for key, jurisdiction in jurisdictions.items():
        ancestry(jurisdictions, key, "parent_id")
        associations = set(jurisdiction.get("search_association_ids", []))
        if key in associations or associations - jurisdictions.keys():
            raise ValueError(f"Invalid jurisdiction search association: {key}")
    for key, body in institutions.items():
        ancestry(institutions, key, "umbrella_id")
        parent = body["umbrella_id"]
        if body["jurisdiction_id"] not in jurisdictions or (
            parent is not None
            and institutions[parent]["jurisdiction_id"] != body["jurisdiction_id"]
        ):
            raise ValueError(f"Invalid grouping institution jurisdiction: {key}")
    for key, room in rooms.items():
        if room["institution_id"] not in institutions:
            raise ValueError(f"Unknown grouping room owner: {key}")
    for key, source in product["sources"].items():
        linked = set(source["reviewed_institution_ids"])
        if linked - institutions.keys():
            raise ValueError(f"Unknown grouping institution match: {key}")
        if (placement := source["placement"]) is None:
            if source["placement_status"] != "provisional":
                raise ValueError(f"Unplaced grouping source must be provisional: {key}")
            continue
        jurisdiction = placement["jurisdiction_id"]
        institution = placement["institution_id"]
        room_id = placement["room_id"]
        if jurisdiction not in jurisdictions or (
            institution is not None
            and (
                institution not in linked
                or institutions[institution]["jurisdiction_id"] != jurisdiction
            )
        ):
            raise ValueError(f"Invalid grouping placement: {key}")
        if room_id is not None and (
            room_id not in rooms or rooms[room_id]["institution_id"] != institution
        ):
            raise ValueError(f"Invalid grouping room: {key}")
