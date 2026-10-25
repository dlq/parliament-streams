"""Only registered, available research inputs may change maintained discovery."""

from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from parliament_streams.inventory.reviews import REVIEW_REGISTRY, load_reviews


class ReviewInputRegistryTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.report = "reports/discovery/dated-review.json"
        self.review = {"reviewed_on": "2026-10-25", "records": [{"id": "assembly"}]}
        self.write(self.report, self.review)
        self.write(REVIEW_REGISTRY, {"registry_version": 1, "reports": [self.report]})

    def write(self, path: str, document: object) -> None:
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(document), encoding="utf-8")

    def test_only_listed_reviews_are_inputs_even_when_another_filename_matches_old_glob(self):
        self.write("reports/discovery/unlisted-service-review-test.json", {"invalid": True})
        self.assertEqual(load_reviews(self.root), [(self.report, self.review)])

    def test_missing_registry_or_review_fails_instead_of_silently_dropping_evidence(self):
        (self.root / self.report).unlink()
        with self.assertRaisesRegex(ValueError, "registered review is missing"):
            load_reviews(self.root)
        (self.root / REVIEW_REGISTRY).unlink()
        with self.assertRaises(FileNotFoundError):
            load_reviews(self.root)

    def test_unknown_version_or_invalid_registry_shape_fails(self):
        for registry in [
            [],
            {"registry_version": 2, "reports": []},
            {"registry_version": True, "reports": []},
            {"registry_version": 1, "reports": "not a list"},
            {"registry_version": 1, "reports": [None]},
        ]:
            with self.subTest(registry=registry):
                self.write(REVIEW_REGISTRY, registry)
                with self.assertRaisesRegex(ValueError, "version-1"):
                    load_reviews(self.root)

    def test_duplicate_or_unsorted_paths_fail(self):
        for reports in [[self.report, self.report], ["reports/discovery/z.json", self.report]]:
            with self.subTest(reports=reports):
                self.write(REVIEW_REGISTRY, {"registry_version": 1, "reports": reports})
                with self.assertRaisesRegex(ValueError, "unique and sorted"):
                    load_reviews(self.root)

    def test_paths_cannot_escape_or_point_to_non_report_inputs(self):
        for report in [
            "/reports/discovery/review.json",
            "reports/discovery/../../../outside.json",
            "data/channels.json",
            "reports/discovery/review.md",
            "reports//discovery/review.json",
            "reports/discovery/review.json#fragment",
            "reports/discovery/review\n.json",
        ]:
            with self.subTest(report=report):
                self.write(REVIEW_REGISTRY, {"registry_version": 1, "reports": [report]})
                with self.assertRaisesRegex(ValueError, "repository-relative discovery JSON"):
                    load_reviews(self.root)

    def test_symlink_cannot_read_an_input_outside_the_checkout(self):
        with tempfile.TemporaryDirectory() as other:
            outside = Path(other) / "outside.json"
            outside.write_text(json.dumps(self.review), encoding="utf-8")
            path = self.root / self.report
            path.unlink()
            path.symlink_to(outside)
            with self.assertRaisesRegex(ValueError, "outside the repository"):
                load_reviews(self.root)

    def test_malformed_review_fails_before_projection(self):
        for review in [[], {"records": []}, {"reviewed_on": "2026-10-25", "records": [None]}]:
            with self.subTest(review=review):
                self.write(self.report, review)
                with self.assertRaisesRegex(ValueError, "individual service-review records"):
                    load_reviews(self.root)

    def test_report_and_record_dates_must_be_canonical_iso_dates(self):
        for invalid in [None, "not-a-date", "20261025", "2026-02-30"]:
            with self.subTest(invalid=invalid):
                self.write(self.report, {**self.review, "reviewed_on": invalid})
                with self.assertRaisesRegex(ValueError, "ISO dates"):
                    load_reviews(self.root)
                self.write(
                    self.report,
                    {**self.review, "records": [{"id": "assembly", "reviewed_on": invalid}]},
                )
                with self.assertRaisesRegex(ValueError, "ISO dates"):
                    load_reviews(self.root)


if __name__ == "__main__":
    unittest.main()
