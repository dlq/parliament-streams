"""Guard the distinctions that prevent an inflated or incomplete institution queue."""

from __future__ import annotations

import copy
import unittest
from pathlib import Path

from tools.validate_institution_inventory import load_object, validate_inventory

ROOT = Path(__file__).resolve().parents[1]


class InstitutionInventoryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.inventory = load_object(ROOT / "data/discovery/institutions.json")

    def test_current_register_is_consistent(self) -> None:
        validate_inventory(self.inventory, ROOT)

    def test_duplicate_institution_is_rejected(self) -> None:
        data = copy.deepcopy(self.inventory)
        data["records"].append(data["records"][0])
        with self.assertRaisesRegex(ValueError, "duplicate id"):
            validate_inventory(data, ROOT)

    def test_missing_country_is_rejected(self) -> None:
        data = copy.deepcopy(self.inventory)
        data["scope"]["countries"].pop()
        with self.assertRaisesRegex(ValueError, "Country scope"):
            validate_inventory(data, ROOT)

    def test_missing_original_scope_question_is_rejected(self) -> None:
        data = copy.deepcopy(self.inventory)
        data["original_scope_decision_crosswalk"].pop()
        with self.assertRaisesRegex(ValueError, "Original named scope questions"):
            validate_inventory(data, ROOT)

    def test_alias_cannot_be_counted_as_another_institution(self) -> None:
        data = copy.deepcopy(self.inventory)
        alias = data["identity_alias_crosswalk"][0]
        alias["alias_id"] = data["records"][0]["id"]
        with self.assertRaisesRegex(ValueError, "alias duplicates"):
            validate_inventory(data, ROOT)

    def test_crosswalk_cannot_hide_an_authority_hold(self) -> None:
        data = copy.deepcopy(self.inventory)
        country = next(
            row for row in data["country_reconciliations"] if row["known_scope_hold_ids"]
        )
        country["known_scope_hold_ids"].clear()
        with self.assertRaisesRegex(ValueError, "authority holds missing"):
            validate_inventory(data, ROOT)

    def test_alias_cannot_point_to_another_states_legislature(self) -> None:
        data = copy.deepcopy(self.inventory)
        data["identity_alias_crosswalk"][0]["canonical_id"] = "united-states--alabama"
        with self.assertRaisesRegex(ValueError, "alias points to a different institution"):
            validate_inventory(data, ROOT)

    def test_new_eligible_institution_does_not_inherit_old_service_evidence(self) -> None:
        data = copy.deepcopy(self.inventory)
        institution = next(row for row in data["records"] if row["id"] == "hungary--budapest")
        institution["service_validation_register"] = "historical-service-register.json"
        with self.assertRaisesRegex(ValueError, "service cohort"):
            validate_inventory(data, ROOT)

    def test_completeness_claim_cannot_exceed_the_evidence(self) -> None:
        data = copy.deepcopy(self.inventory)
        data["summary"]["complete_exhaustive_institutional_census_certified"] = True
        with self.assertRaisesRegex(ValueError, "does not certify"):
            validate_inventory(data, ROOT)

    def test_provenance_must_point_to_an_existing_source_record(self) -> None:
        data = copy.deepcopy(self.inventory)
        data["records"][0]["provenance"][0]["record_id"] = "invented-institution"
        with self.assertRaisesRegex(ValueError, "provenance record does not exist"):
            validate_inventory(data, ROOT)

    def test_review_cannot_omit_a_starting_legal_hold(self) -> None:
        data = copy.deepcopy(self.inventory)
        data["legal_hold_review"]["reviewed_institution_ids"].pop()
        with self.assertRaisesRegex(ValueError, "every starting institution"):
            validate_inventory(data, ROOT)

    def test_review_cannot_claim_open_legal_questions_are_resolved(self) -> None:
        data = copy.deepcopy(self.inventory)
        data["legal_hold_review"]["summary"]["all_legal_holds_resolved"] = True
        with self.assertRaisesRegex(ValueError, "unsupported summary claim"):
            validate_inventory(data, ROOT)

    def test_review_preserves_the_exact_missing_legal_instrument(self) -> None:
        data = copy.deepcopy(self.inventory)
        institution = next(
            row
            for row in data["records"]
            if row["id"] == "india--frontier-nagaland-territorial-authority"
        )
        institution["remaining_authority_instruments"] = ["Check legal status later"]
        with self.assertRaisesRegex(ValueError, "exact missing instruments"):
            validate_inventory(data, ROOT)


if __name__ == "__main__":
    unittest.main()
