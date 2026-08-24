"""Tests for the supranational map context dataset."""

from __future__ import annotations

import unittest

from parliament_streams.site_data import load_supranational


class SupranationalDataTests(unittest.TestCase):
    def test_organization_memberships_are_complete_and_unique(self) -> None:
        data = load_supranational()
        organizations = data["organizations"]
        self.assertIsInstance(organizations, list)

        expected_counts = {"eu": 27, "coe": 46, "osce": 57, "un": 193}
        self.assertEqual({item["id"] for item in organizations}, set(expected_counts))
        for organization in organizations:
            codes = organization["member_country_codes"]
            self.assertEqual(len(codes), expected_counts[organization["id"]])
            self.assertEqual(len(codes), len(set(codes)))
            self.assertTrue(all(len(code) == 2 and code.isupper() for code in codes))
            self.assertTrue(organization["source_url"].startswith("https://"))


if __name__ == "__main__":
    unittest.main()
