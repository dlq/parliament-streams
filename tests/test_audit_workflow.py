"""Audit probes remain independent; alert recovery requires positive evidence."""

from __future__ import annotations

import contextlib
import io
import json
import re
import tempfile
import unittest
from pathlib import Path

from tools.build_schedule_issue_plan import build_schedule_issue_plan, main

ROOT = Path(__file__).resolve().parents[1]


class ScheduleIssuePolicyTests(unittest.TestCase):
    def test_failure_counter_reset_and_empty_result_do_not_close_an_issue(self):
        sources = {
            "new-error": {"status": "error", "consecutive_failures": 1},
            "second-error": {"status": "error", "consecutive_failures": 2},
            "cold-baseline-error": {"status": "error", "consecutive_failures": 0},
            "no-data": {"status": "empty", "consecutive_failures": 0},
        }
        self.assertEqual(build_schedule_issue_plan({"sources": sources}), {"actions": []})

    def test_repeated_errors_open_and_confirmed_success_closes(self):
        plan = build_schedule_issue_plan(
            {
                "sources": {
                    "recovered": {"status": "ok", "consecutive_failures": 0},
                    "failing": {
                        "status": "error",
                        "consecutive_failures": 3,
                        "error": "HTTP 503",
                    },
                    "still-failing": {"status": "error", "consecutive_failures": 10},
                }
            }
        )
        self.assertEqual(
            [(row["source_id"], row["action"]) for row in plan["actions"]],
            [("failing", "open"), ("recovered", "close"), ("still-failing", "open")],
        )
        self.assertEqual(plan["actions"][0]["error"], "HTTP 503")

    def test_malformed_source_data_is_not_a_recovery(self):
        for snapshot in (
            {},
            {"sources": []},
            {"sources": {"one": None}},
            {"sources": {"one": {"status": "unknown", "consecutive_failures": 0}}},
            {"sources": {"one": {"status": "ok", "consecutive_failures": -1}}},
            {"sources": {"one": {"status": "ok", "consecutive_failures": True}}},
            {"sources": {"one": {"status": "error", "consecutive_failures": 3, "error": []}}},
        ):
            with self.subTest(snapshot=snapshot), self.assertRaises(ValueError):
                build_schedule_issue_plan(snapshot)

    def test_cli_writes_only_a_validated_plan(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source, output = root / "schedules.json", root / "reports/issue-plan.json"
            source.write_text(
                json.dumps({"sources": {"one": {"status": "ok", "consecutive_failures": 0}}}),
                encoding="utf-8",
            )
            self.assertEqual(main(["--schedules", str(source), "--output", str(output)]), 0)
            self.assertEqual(json.loads(output.read_text())["actions"][0]["action"], "close")
            for invalid in ("{broken", "[]"):
                source.write_text(invalid, encoding="utf-8")
                with (
                    contextlib.redirect_stderr(io.StringIO()),
                    self.assertRaises(SystemExit) as error,
                ):
                    main(["--schedules", str(source), "--output", str(root / "invalid.json")])
                self.assertEqual(error.exception.code, 2)
                self.assertFalse((root / "invalid.json").exists())


class AuditWorkflowControlFlowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        workflow = (ROOT / ".github/workflows/catalogue-audit.yml").read_text(encoding="utf-8")
        cls.steps = {
            match.group(1): match.group(2)
            for match in re.finditer(
                r"^      - name: ([^\n]+)\n(.*?)(?=^      - |\Z)", workflow, re.M | re.S
            )
        }

    def condition(self, name):
        match = re.search(r"^        if: (.+)$", self.steps[name], re.M)
        self.assertIsNotNone(match, f"{name} must declare its prerequisite explicitly")
        return match.group(1)

    def test_independent_probes_override_the_implicit_success_gate(self):
        self.assertIn(
            "id: validate", self.steps["Validate catalogue structure and identity metadata"]
        )
        for name in (
            "Audit every primary playback or official URL",
            "Audit stable streams for regressions",
            "Audit schedule endpoints",
            "Collect parsed schedules",
            "Audit official, rights, identity, and embed links",
        ):
            with self.subTest(step=name):
                # A status function overrides Actions' implicit success(), so an
                # earlier probe or gh failure cannot silently skip this probe.
                condition = self.condition(name)
                self.assertIn("!cancelled()", condition)
                self.assertIn("steps.validate.outcome == 'success'", condition)
                self.assertNotIn("continue-on-error:", self.steps[name])

    def test_consumers_require_their_own_producer_and_failures_remain_visible(self):
        self.assertIn(
            "steps.stable-health.outcome == 'success'",
            self.condition("Compare stable streams with the preceding run"),
        )
        self.assertIn(
            "steps.schedules.outcome == 'success'",
            self.condition("Audit schedule quality and linear guide eligibility"),
        )
        for name, report in (
            ("Update stable-stream regression issues", "stable-health-diff.json"),
            ("Update repeated schedule-source failure issues", "schedules.json"),
        ):
            with self.subTest(step=name):
                self.assertIn("!cancelled()", self.condition(name))
                self.assertIn(report, self.condition(name))
                self.assertNotIn("continue-on-error:", self.steps[name])
        final = self.steps["Fail on new stable-stream regressions"]
        self.assertIn(
            "steps.health-diff.outcome == 'failure'",
            self.condition("Fail on new stable-stream regressions"),
        )
        self.assertIn("run: exit 1", final)
        self.assertNotIn("continue-on-error:", final)

    def test_schedule_issue_updates_consume_the_tested_policy_plan(self):
        body = self.steps["Update repeated schedule-source failure issues"]
        self.assertIn("python tools/build_schedule_issue_plan.py", body)
        self.assertIn("reports/automated/schedule-issue-plan.json", body)
        self.assertIn("'.actions[]", body)
        self.assertIn('[[ "$action" == "close" && -n "$number" ]]', body)
        self.assertNotIn('elif [[ -n "$number" ]]', body)

    def test_weekly_observations_are_sanitized_before_artifact_publication(self):
        safety = self.steps["Sanitize and check weekly browser evidence"]
        self.assertIn("id: deep-evidence-safety", safety)
        self.assertIn("--sanitize", safety)
        self.assertIn("--check reports/automated", safety)
        self.assertIn("!cancelled()", self.condition("Sanitize and check weekly browser evidence"))
        self.assertIn(
            "steps.deep-evidence-safety.outcome == 'success'",
            self.condition("Upload weekly deep-audit reports"),
        )


if __name__ == "__main__":
    unittest.main()
