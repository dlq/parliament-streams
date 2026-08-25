from __future__ import annotations

import copy
import json
import unittest
from pathlib import Path
from typing import Any

from tools.validate_us_candidates import EXPECTED_STATE_CODES, validate_file


class UnitedStatesCandidateInventoryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.path = Path("data/discovery/us-legislatures.json")
        cls.schema = json.loads(
            Path("schema/us-legislature-candidates.schema.json").read_text(encoding="utf-8")
        )
        cls.value: dict[str, Any] = json.loads(cls.path.read_text(encoding="utf-8"))

    def test_inventory_is_valid_and_covers_all_states(self) -> None:
        self.assertEqual(validate_file(self.path, self.schema), [])
        codes = {candidate["postal_code"] for candidate in self.value["state_candidates"]}
        self.assertEqual(codes, EXPECTED_STATE_CODES)

    def test_verified_candidates_have_video_evidence(self) -> None:
        candidates = self.value["federal_candidates"] + self.value["state_candidates"]
        verified = [
            candidate
            for candidate in candidates
            if candidate["research_status"] == "verified_official_video_surface"
        ]
        self.assertGreaterEqual(len(verified), 10)
        for candidate in verified:
            self.assertIsNotNone(candidate["video_url"])
            self.assertGreaterEqual(len(candidate["evidence_urls"]), 2)

    def test_duplicate_state_code_is_rejected(self) -> None:
        value = copy.deepcopy(self.value)
        value["state_candidates"][0]["postal_code"] = "AK"
        path = Path("data/discovery/.us-legislatures-invalid-test.json")
        try:
            path.write_text(json.dumps(value), encoding="utf-8")
            messages = validate_file(path, self.schema)
        finally:
            path.unlink(missing_ok=True)
        self.assertTrue(any("state codes mismatch" in message for message in messages))
        self.assertTrue(any("postal codes must be unique" in message for message in messages))


if __name__ == "__main__":
    unittest.main()
