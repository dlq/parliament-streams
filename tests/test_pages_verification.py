from __future__ import annotations

import io
import unittest
from pathlib import Path
from typing import Any
from unittest.mock import MagicMock, patch

from tools.verify_pages_revision import (
    GateError,
    RevisionVerification,
    inspect_revision,
    main,
    validate_context,
    wait_for_verification,
)

REPOSITORY = "dlq/parliament-streams"
SHA = "a" * 40
OTHER_SHA = "b" * 40
ROOT = Path(__file__).resolve().parents[1]


def run_record(run_id: int = 1, **updates: Any) -> dict[str, Any]:
    return {
        "id": run_id,
        "run_number": run_id,
        "run_attempt": 1,
        "head_sha": SHA,
        "head_branch": "main",
        "head_repository": {"full_name": REPOSITORY},
        "event": "push",
        "status": "completed",
        "conclusion": "success",
        **updates,
    }


class FakeAPI:
    def __init__(self) -> None:
        self.branch_shas = [SHA]
        self.runs = {"ci.yml": [run_record()], "codeql.yml": [run_record()]}
        self.calls: list[tuple[str, dict[str, str] | None]] = []

    def get(self, path: str, parameters: dict[str, str] | None = None) -> dict[str, Any]:
        self.calls.append((path, parameters))
        if path.endswith("git/ref/heads/main"):
            sha = self.branch_shas.pop(0) if len(self.branch_shas) > 1 else self.branch_shas[0]
            return {"object": {"sha": sha}}
        workflow = path.split("/workflows/")[1].split("/")[0]
        records = self.runs[workflow]
        assert parameters is not None
        start = (int(parameters["page"]) - 1) * 100
        return {"total_count": len(records), "workflow_runs": records[start : start + 100]}


class PagesVerificationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.api = FakeAPI()

    def test_success_requires_both_exact_sha_workflows_and_current_main(self) -> None:
        result = inspect_revision(self.api, REPOSITORY, SHA)
        self.assertEqual(result, RevisionVerification([], {"ci.yml": 1, "codeql.yml": 1}))
        self.assertEqual(sum(path.endswith("git/ref/heads/main") for path, _ in self.api.calls), 2)
        for _, parameters in self.api.calls:
            if parameters:
                self.assertEqual(parameters["head_sha"], SHA)
                self.assertEqual(parameters["branch"], "main")

    def test_success_for_another_sha_cannot_authorize_publication(self) -> None:
        self.api.runs["ci.yml"] = [run_record(head_sha=OTHER_SHA)]
        result = inspect_revision(self.api, REPOSITORY, SHA)
        self.assertEqual(len(result.pending), 1)
        self.assertNotIn("ci.yml", result.successful_runs)

    def test_missing_ci_or_codeql_remains_unverified(self) -> None:
        for workflow in ("ci.yml", "codeql.yml"):
            with self.subTest(workflow=workflow):
                api = FakeAPI()
                api.runs[workflow] = []
                with self.assertRaisesRegex(GateError, "no trusted run"):
                    wait_for_verification(api, REPOSITORY, SHA, timeout=0)

    def test_pending_latest_run_overrides_an_older_success(self) -> None:
        self.api.runs["ci.yml"] = [
            run_record(),
            run_record(2, status="in_progress", conclusion=None),
        ]
        result = inspect_revision(self.api, REPOSITORY, SHA)
        self.assertEqual(result.pending, ["ci.yml: in_progress"])
        self.assertNotIn("ci.yml", result.successful_runs)

    def test_failed_latest_run_overrides_an_older_success(self) -> None:
        self.api.runs["ci.yml"] = [run_record(), run_record(2, conclusion="failure")]
        with self.assertRaisesRegex(GateError, "ci.yml did not succeed"):
            inspect_revision(self.api, REPOSITORY, SHA)

    def test_unsuccessful_conclusions_fail_closed(self) -> None:
        for conclusion in ("failure", "cancelled", "timed_out", "neutral", "skipped", None):
            with self.subTest(conclusion=conclusion):
                self.api.runs["codeql.yml"] = [run_record(conclusion=conclusion)]
                with self.assertRaisesRegex(GateError, "codeql.yml did not succeed"):
                    inspect_revision(self.api, REPOSITORY, SHA)

    def test_current_rerun_attempt_must_complete_successfully(self) -> None:
        self.api.runs["ci.yml"] = [
            run_record(run_attempt=2, status="queued", conclusion=None),
        ]
        with self.assertRaisesRegex(GateError, "queued"):
            wait_for_verification(self.api, REPOSITORY, SHA, timeout=0)

    def test_pr_fork_other_branch_and_missing_repository_runs_are_not_trusted(self) -> None:
        for updates in (
            {"event": "pull_request"},
            {"event": "pull_request_target"},
            {"head_branch": "feature"},
            {"head_repository": {"full_name": "someone/fork"}},
            {"head_repository": None},
        ):
            with self.subTest(updates=updates):
                self.api.runs["ci.yml"] = [run_record(**updates)]
                with self.assertRaisesRegex(GateError, "no trusted run"):
                    wait_for_verification(self.api, REPOSITORY, SHA, timeout=0)

    def test_branch_advance_rejects_successful_stale_checks(self) -> None:
        self.api.branch_shas = [OTHER_SHA]
        with self.assertRaisesRegex(GateError, "Main has advanced"):
            inspect_revision(self.api, REPOSITORY, SHA)
        self.assertEqual(len(self.api.calls), 1)

    def test_branch_advance_during_final_api_reads_also_blocks(self) -> None:
        self.api.branch_shas = [SHA, OTHER_SHA]
        with self.assertRaisesRegex(GateError, "Main has advanced"):
            inspect_revision(self.api, REPOSITORY, SHA)

    def test_branch_advance_while_waiting_blocks_the_old_revision(self) -> None:
        self.api.branch_shas = [SHA, OTHER_SHA]
        self.api.runs["ci.yml"] = []
        with self.assertRaisesRegex(GateError, "Main has advanced"):
            wait_for_verification(
                self.api, REPOSITORY, SHA, timeout=20, clock=lambda: 0, sleep=lambda _: None
            )

    def test_waits_for_pending_then_accepts_both_successes(self) -> None:
        pending = RevisionVerification(["ci.yml: queued"], {"codeql.yml": 1})
        ready = RevisionVerification([], {"ci.yml": 2, "codeql.yml": 1})
        sleep = MagicMock()
        with patch("tools.verify_pages_revision.inspect_revision", side_effect=[pending, ready]):
            result = wait_for_verification(
                self.api, REPOSITORY, SHA, timeout=20, clock=lambda: 0, sleep=sleep
            )
        self.assertEqual(result, ready)
        sleep.assert_called_once_with(20)

    def test_complete_run_history_is_examined_for_a_newer_failure(self) -> None:
        self.api.runs["ci.yml"] = [run_record(n) for n in range(1, 101)] + [
            run_record(101, conclusion="failure")
        ]
        with self.assertRaisesRegex(GateError, "did not succeed"):
            inspect_revision(self.api, REPOSITORY, SHA)
        self.assertTrue(any(params and params["page"] == "2" for _, params in self.api.calls))

    def test_scheduled_and_manual_refresh_reuse_success_for_the_same_sha(self) -> None:
        for event in ("push", "schedule", "workflow_dispatch"):
            with self.subTest(event=event):
                validate_context(REPOSITORY, SHA, event, "refs/heads/main")
                self.api.runs["codeql.yml"] = [run_record(event="schedule")]
                self.assertFalse(inspect_revision(self.api, REPOSITORY, SHA).pending)

    def test_untrusted_trigger_or_non_main_manual_dispatch_is_rejected(self) -> None:
        for event, ref in (
            ("workflow_run", "refs/heads/main"),
            ("pull_request", "refs/pull/1/merge"),
            ("workflow_dispatch", "refs/heads/feature"),
        ):
            with (
                self.subTest(event=event, ref=ref),
                self.assertRaisesRegex(GateError, "Only trusted main"),
            ):
                validate_context(REPOSITORY, SHA, event, ref)

    def test_invalid_commit_or_repository_is_rejected(self) -> None:
        for repository, sha in ((REPOSITORY, "main"), ("invalid/repo/path", SHA)):
            with self.subTest(repository=repository, sha=sha), self.assertRaises(GateError):
                validate_context(repository, sha, "push", "refs/heads/main")

    def test_cli_rejects_a_different_checkout_before_reading_actions(self) -> None:
        environment = {
            "GITHUB_REPOSITORY": REPOSITORY,
            "GITHUB_EVENT_NAME": "push",
            "GITHUB_REF": "refs/heads/main",
            "GH_TOKEN": "test-token",
        }
        with (
            patch.dict("os.environ", environment),
            patch("sys.argv", ["gate", "--sha", SHA]),
            patch("tools.verify_pages_revision.subprocess.run") as checkout,
            patch("tools.verify_pages_revision.GitHubAPI") as api,
            patch("sys.stderr", new_callable=io.StringIO) as stderr,
        ):
            checkout.return_value.stdout = OTHER_SHA
            self.assertEqual(main(), 1)
            self.assertIn("Checked-out revision", stderr.getvalue())
            api.assert_not_called()

    def test_cli_api_errors_fail_closed_without_exposing_token(self) -> None:
        environment = {
            "GITHUB_REPOSITORY": REPOSITORY,
            "GITHUB_EVENT_NAME": "schedule",
            "GITHUB_REF": "refs/heads/main",
            "GH_TOKEN": "test-token",
        }
        with (
            patch.dict("os.environ", environment),
            patch("sys.argv", ["gate", "--sha", SHA, "--wait-seconds", "0"]),
            patch("tools.verify_pages_revision.subprocess.run") as checkout,
            patch("tools.verify_pages_revision.GitHubAPI") as api,
            patch("sys.stderr", new_callable=io.StringIO) as stderr,
        ):
            checkout.return_value.stdout = SHA
            api.return_value.get.side_effect = OSError("API unavailable")
            self.assertEqual(main(), 1)
            self.assertIn("API unavailable", stderr.getvalue())
            self.assertNotIn("test-token", stderr.getvalue())

    def test_workflow_gates_all_triggers_and_pins_both_checkouts(self) -> None:
        workflow = (ROOT / ".github/workflows/pages.yml").read_text()
        gate, deploy = workflow.split("  deploy:\n", 1)
        self.assertNotIn("pages: write", gate)
        self.assertNotIn("id-token: write", gate)
        self.assertIn("needs: verify_revision", deploy)
        self.assertEqual(workflow.count("ref: ${{ github.sha }}"), 2)
        self.assertIn('cron: "17 */6 * * *"', workflow)
        self.assertIn("workflow_dispatch:", workflow)
        self.assertNotIn("workflow_run:", workflow)
        self.assertIn("tools/verify_pages_revision.py", workflow)
        self.assertLess(deploy.index("upload-pages-artifact"), deploy.index("--wait-seconds 0"))
        self.assertLess(deploy.index("--wait-seconds 0"), deploy.index("actions/deploy-pages"))
        self.assertIn("schedules-collect", deploy)
        self.assertIn("iptv-export", deploy)
        self.assertIn("--minimum-successful-sources 1", deploy)
        self.assertNotIn("accessibility-check", deploy)

    def test_docs_only_main_pushes_still_receive_required_workflows(self) -> None:
        for filename in ("ci.yml", "codeql.yml"):
            with self.subTest(filename=filename):
                workflow = (ROOT / ".github/workflows" / filename).read_text()
                triggers = workflow.split("\njobs:", 1)[0]
                self.assertIn("push:\n    branches: [main]", triggers)
                self.assertNotIn("    paths:", triggers)
                self.assertNotIn("    paths-ignore:", triggers)


if __name__ == "__main__":
    unittest.main()
