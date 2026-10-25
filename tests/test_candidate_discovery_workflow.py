"""Run the maintained discovery alert shell offline, with jq and a fake gh."""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import textwrap
import unittest
from pathlib import Path
from typing import Any, ClassVar

ROOT = Path(__file__).resolve().parents[1]
ISSUE_STEP = "Update candidate review issue"
SUMMARY_STEP = "Write discovery summary"

FAKE_GH = """\
import json
import os
import sys
from pathlib import Path

args = sys.argv[1:]
with Path(os.environ["FAKE_GH_LOG"]).open("a", encoding="utf-8") as log:
    log.write(json.dumps(args) + "\\n")
if args[:2] == ["label", "create"]:
    pass
elif args[:2] == ["issue", "list"]:
    rows = [{"number": 7, "title": "Candidate discovery review queue"}]
    print(json.dumps(rows if os.environ["FAKE_ISSUE_EXISTS"] == "1" else []))
elif args[:2] == ["issue", "view"]:
    print(os.environ["FAKE_ISSUE_STATE"])
elif args[:2] in (["issue", "edit"], ["issue", "create"]):
    body = Path(args[args.index("--body-file") + 1]).read_bytes()
    Path(os.environ["FAKE_PUBLISHED_BODY"]).write_bytes(body)
elif args[:2] in (["issue", "close"], ["issue", "reopen"]):
    pass
else:
    raise SystemExit("Unexpected offline gh invocation: " + repr(args))
"""


def finding(
    kind: str, url: str, *, source_page: str | None = None, status: str = "review"
) -> dict[str, Any]:
    row: dict[str, Any] = {
        "tier": "tier1",
        "country": "North Macedonia",
        "kind": kind,
        "url": url,
        "label": "Programme or viewing route",
        "status": status,
    }
    if source_page is not None:
        row["source_page"] = source_page
    return row


def findings_report(rows: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "counts": {
            "validated": sum(row["kind"] in {"hls", "dash"} for row in rows),
            "page_leads": sum(row["kind"] not in {"hls", "dash"} for row in rows),
            "catalogued": sum(row["status"] == "catalogued" for row in rows),
            "reviewed": sum(row["status"] == "reviewed" for row in rows),
            "review": sum(row["status"] == "review" for row in rows),
        },
        "findings": rows,
        "coverage": {
            "counts": {
                "eligible_identities": 948,
                "identities_with_page_routes": 948,
                "identities_without_page_routes": 0,
                "catalogue_records_with_page_routes": 269,
                "catalogue_records": 269,
            },
            "network_checks": {
                "static_unattempted": 0,
                "static_access_gaps": 0,
                "browser_unattempted": 0,
                "browser_access_gaps": 0,
                "browser_pages_omitted_by_cap": 0,
                "browser_manifests_omitted_by_cap": 0,
                "static_page_leads_omitted_by_cap": 0,
                "browser_page_links_omitted_by_cap": 0,
                "browser_page_leads_omitted_by_cap": 0,
            },
        },
    }


@unittest.skipUnless(shutil.which("jq") and shutil.which("bash"), "requires local jq and bash")
class CandidateDiscoveryWorkflowTests(unittest.TestCase):
    steps: ClassVar[dict[str, str]]

    @classmethod
    def setUpClass(cls) -> None:
        workflow = (ROOT / ".github/workflows/candidate-discovery.yml").read_text(encoding="utf-8")
        cls.steps = {
            match.group(1): match.group(2)
            for match in re.finditer(
                r"^      - name: ([^\n]+)\n(.*?)(?=^      - |\Z)", workflow, re.M | re.S
            )
        }

    def setUp(self) -> None:
        temporary = tempfile.TemporaryDirectory(prefix="candidate-discovery-shell-")
        self.addCleanup(temporary.cleanup)
        self.directory = Path(temporary.name)
        self.bin = self.directory / "bin"
        self.bin.mkdir()
        (self.bin / "gh").write_text(
            '#!/bin/sh\nexec "$FAKE_GH_PYTHON" "$FAKE_GH_HANDLER" "$@"\n', encoding="utf-8"
        )
        (self.bin / "gh").chmod(0o700)
        handler = self.directory / "fake_gh.py"
        handler.write_text(FAKE_GH, encoding="utf-8")
        self.log = self.directory / "gh-calls.jsonl"
        self.published = self.directory / "published-issue.md"
        self.summary = self.directory / "summary.md"
        self.environment = {
            **os.environ,
            "PATH": str(self.bin) + os.pathsep + os.environ.get("PATH", ""),
            "GH_TOKEN": "offline-placeholder",
            "GH_REPO": "offline/fixture",
            "TITLE": "Candidate discovery review queue",
            "RUN_URL": "https://example.invalid/actions/runs/123",
            "GITHUB_STEP_SUMMARY": str(self.summary),
            "FAKE_GH_PYTHON": sys.executable,
            "FAKE_GH_HANDLER": str(handler),
            "FAKE_GH_LOG": str(self.log),
            "FAKE_PUBLISHED_BODY": str(self.published),
            "FAKE_ISSUE_EXISTS": "1",
            "FAKE_ISSUE_STATE": "OPEN",
        }
        self.environment.pop("BASH_ENV", None)

    def execute(self, step: str, report: dict[str, Any]) -> subprocess.CompletedProcess[str]:
        path = self.directory / "reports/automated/candidate-discovery/findings.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(report, ensure_ascii=False), encoding="utf-8")
        match = re.search(r"^        run: \|\n(.*)\Z", self.steps[step], re.M | re.S)
        self.assertIsNotNone(match, f"{step} must retain an executable literal shell block")
        assert match is not None
        shell = textwrap.dedent(match.group(1))
        completed = subprocess.run(
            ["bash", "--noprofile", "--norc", "-e", "-o", "pipefail", "-c", shell],
            cwd=self.directory,
            env=self.environment,
            capture_output=True,
            text=True,
            timeout=15,
            check=False,
        )
        self.assertEqual(completed.returncode, 0, completed.stdout + completed.stderr)
        return completed

    def calls(self) -> list[list[str]]:
        if not self.log.exists():
            return []
        return [json.loads(line) for line in self.log.read_text(encoding="utf-8").splitlines()]

    @staticmethod
    def table_rows(body: str) -> list[str]:
        return [line for line in body.splitlines() if line.startswith("| tier1 |")]

    def test_mixed_leads_are_not_all_called_validated_and_keep_source_provenance(self) -> None:
        report = findings_report(
            [
                finding("hls", "https://media.example/live.m3u8"),
                finding(
                    "viewing_page",
                    "https://assembly.example/watch",
                    source_page="https://assembly.example/official-links",
                ),
                finding(
                    "programme_source",
                    "https://assembly.example/calendar",
                    source_page="https://assembly.example/sittings",
                ),
            ]
        )
        self.execute(ISSUE_STEP, report)
        body = self.published.read_text(encoding="utf-8")
        self.assertIn("Manifest formats checked: 1; unverified page leads: 2", body)
        self.assertNotRegex(body, r"(?i)(?:3|\*\*3\*\*) validated manifests")
        self.assertIn("Page observations do not establish official ownership", body)
        self.assertIn("| Observed on |", body)
        self.assertIn("`https://assembly.example/official-links`", body)
        self.assertIn("`https://assembly.example/sittings`", body)
        self.assertIn("`manifest check`", body)
        self.execute(SUMMARY_STEP, report)
        summary = self.summary.read_text(encoding="utf-8")
        self.assertIn("Manifest formats checked: 1; unverified page leads: 2", summary)
        self.assertIn("No catalogue records were changed automatically", summary)
        self.assertEqual(len(self.table_rows(summary)), 3)

    def test_long_unicode_urls_are_capped_to50_rows_and120_character_excerpts(self) -> None:
        rows = [
            finding(
                "programme_source",
                f"https://assembly.example/{index}/" + "🗳" * 2000,
                source_page=f"https://assembly.example/source-{index}/" + "🗳" * 2000,
            )
            for index in range(65)
        ]
        # Non-review entries must not consume the bounded review table.
        rows.insert(0, finding("viewing_page", "https://known.example/", status="catalogued"))
        rows.insert(1, finding("recording", "https://reviewed.example/", status="reviewed"))
        report = findings_report(rows)
        self.execute(ISSUE_STEP, report)
        issue_bytes = self.published.read_bytes()
        body = issue_bytes.decode("utf-8")
        self.assertLess(len(issue_bytes), 65_536)
        issue_rows = self.table_rows(body)
        self.assertEqual(len(issue_rows), 50)
        self.assertIn("First 50 leads shown", body)
        self.assertIn("complete findings", body)
        self.assertIn("https://assembly.example/49/", issue_rows[-1])
        self.assertNotIn("https://assembly.example/50/", body)
        for row in issue_rows:
            cells = row.split("|")
            self.assertEqual(len(cells), 7)
            for cell in cells[4:6]:
                excerpt = cell.strip().strip("`")
                self.assertTrue(excerpt.startswith("https://assembly.example/"))
                self.assertLessEqual(len(excerpt), 120)
                self.assertTrue(excerpt.endswith("…"))
        self.execute(SUMMARY_STEP, report)
        summary = self.summary.read_text(encoding="utf-8")
        self.assertLess(len(summary.encode("utf-8")), 65_536)
        self.assertEqual(len(self.table_rows(summary)), 20)
        for row in self.table_rows(summary):
            excerpt = row.split("|")[4].strip().strip("`")
            self.assertLessEqual(len(excerpt), 120)

    def test_markdown_url_delimiters_do_not_break_the_issue_table(self) -> None:
        report = findings_report(
            [
                finding(
                    "viewing_page",
                    "https://assembly.example/watch`|extra",
                    source_page="https://assembly.example/source`|extra",
                )
            ]
        )
        self.execute(ISSUE_STEP, report)
        rows = self.table_rows(self.published.read_text(encoding="utf-8"))
        self.assertEqual(len(rows), 1)
        self.assertEqual(len(rows[0].split("|")), 7)
        self.assertIn("https://assembly.example/watch__extra", rows[0])
        self.assertIn("https://assembly.example/source__extra", rows[0])

    def test_already_redacted_evidence_is_published_without_any_credential_values(self) -> None:
        # This tests the shell's handling of an already sanitized report; the
        # sanitizer itself has separate tests. No real credential enters fixtures.
        report = findings_report(
            [
                finding(
                    "recording",
                    "https://assembly.example/watch?token=REDACTED",
                    source_page="https://assembly.example/source?key=REDACTED",
                )
            ]
        )
        self.execute(ISSUE_STEP, report)
        body = self.published.read_text(encoding="utf-8")
        self.assertIn("token=REDACTED", body)
        self.assertIn("key=REDACTED", body)
        self.assertNotRegex(body, r"(?:token|key)=(?!REDACTED)[^`\s|]+")

    def test_zero_findings_with_source_access_or_cap_gaps_preserves_existing_issue(self) -> None:
        for field in (
            "identities_without_page_routes",
            "static_unattempted",
            "browser_access_gaps",
            "browser_page_leads_omitted_by_cap",
        ):
            with self.subTest(field=field):
                self.log.unlink(missing_ok=True)
                report = findings_report([])
                section = (
                    "counts" if field == "identities_without_page_routes" else "network_checks"
                )
                report["coverage"][section][field] = 1
                completed = self.execute(ISSUE_STEP, report)
                self.assertIn("preserving the existing review issue", completed.stdout)
                self.assertFalse(self.published.exists())
                self.assertTrue(self.calls())
                self.assertFalse(
                    any(
                        call[:2] in (["issue", "close"], ["issue", "edit"], ["issue", "create"])
                        for call in self.calls()
                    )
                )

    def test_complete_zero_findings_can_close_existing_issue(self) -> None:
        self.execute(ISSUE_STEP, findings_report([]))
        closes = [call for call in self.calls() if call[:2] == ["issue", "close"]]
        self.assertEqual(len(closes), 1)
        self.assertIn("no new manifest or viewing/programme-page leads", " ".join(closes[0]))

    def test_page_only_findings_create_an_issue_without_a_validated_manifest(self) -> None:
        self.environment["FAKE_ISSUE_EXISTS"] = "0"
        self.execute(
            ISSUE_STEP,
            findings_report(
                [
                    finding(
                        "youtube_channel",
                        "https://www.youtube.com/@example",
                        source_page="https://assembly.example/",
                    )
                ]
            ),
        )
        self.assertTrue(any(call[:2] == ["issue", "create"] for call in self.calls()))
        body = self.published.read_text(encoding="utf-8")
        self.assertIn("Manifest formats checked: 0; unverified page leads: 1", body)

    def test_page_only_findings_reopen_a_closed_review_issue(self) -> None:
        self.environment["FAKE_ISSUE_STATE"] = "CLOSED"
        self.execute(
            ISSUE_STEP,
            findings_report([finding("programme_source", "https://assembly.example/calendar")]),
        )
        actions = [call[:2] for call in self.calls()]
        self.assertIn(["issue", "edit"], actions)
        self.assertIn(["issue", "reopen"], actions)
        self.assertNotIn(["issue", "close"], actions)


if __name__ == "__main__":
    unittest.main()
