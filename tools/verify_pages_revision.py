"""Verify that current main has successful full CI and CodeQL for its pinned SHA."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any, Protocol
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

REQUIRED_WORKFLOWS = ("ci.yml", "codeql.yml")
TRUSTED_EVENTS = {"push", "workflow_dispatch", "schedule"}


class GateError(RuntimeError):
    """A revision cannot safely be published."""


class GitHubReadAPI(Protocol):
    def get(self, path: str, parameters: dict[str, str] | None = None) -> dict[str, Any]: ...


class GitHubAPI:
    def __init__(self, token: str, api_url: str = "https://api.github.com") -> None:
        self.token = token
        self.api_url = api_url.rstrip("/")

    def get(self, path: str, parameters: dict[str, str] | None = None) -> dict[str, Any]:
        url = f"{self.api_url}/{path}"
        if parameters:
            url += "?" + urlencode(parameters)
        request = Request(
            url,
            headers={
                "Accept": "application/vnd.github+json",
                "Authorization": f"Bearer {self.token}",
                "X-GitHub-Api-Version": "2026-03-10",
                "Cache-Control": "no-cache",
                "User-Agent": "parliament-streams-pages-verification",
            },
        )
        with urlopen(request, timeout=30) as response:
            data = json.load(response)
        if not isinstance(data, dict):
            raise GateError("GitHub returned an invalid API response")
        return data


@dataclass
class RevisionVerification:
    pending: list[str]
    successful_runs: dict[str, int]


def validate_context(repository: str, sha: str, event: str, ref: str) -> None:
    if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository):
        raise GateError("Invalid repository identity")
    if not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise GateError("Publication requires a full commit SHA")
    if event not in {"push", "schedule", "workflow_dispatch"} or ref != "refs/heads/main":
        raise GateError("Only trusted main push, schedule, or manual runs may publish")


def require_current_main(api: GitHubReadAPI, repository: str, sha: str) -> None:
    current = api.get(f"repos/{repository}/git/ref/heads/main")
    if current.get("object", {}).get("sha") != sha:
        raise GateError("Main has advanced or no longer identifies the pinned deployment revision")


def workflow_runs(
    api: GitHubReadAPI, repository: str, workflow: str, sha: str
) -> list[dict[str, Any]]:
    runs: list[dict[str, Any]] = []
    for page in range(1, 11):
        data = api.get(
            f"repos/{repository}/actions/workflows/{quote(workflow, safe='')}/runs",
            {"branch": "main", "head_sha": sha, "per_page": "100", "page": str(page)},
        )
        batch = data.get("workflow_runs")
        total = data.get("total_count")
        if not isinstance(batch, list) or not isinstance(total, int):
            raise GateError(f"Invalid workflow-run response for {workflow}")
        if not all(isinstance(run, dict) for run in batch):
            raise GateError(f"Invalid workflow-run entries for {workflow}")
        runs.extend(batch)
        if len(runs) >= total:
            return runs
        if not batch:
            break
    raise GateError(f"Cannot establish the latest {workflow} run from its complete API history")


def inspect_revision(api: GitHubReadAPI, repository: str, sha: str) -> RevisionVerification:
    require_current_main(api, repository, sha)
    pending: list[str] = []
    successful: dict[str, int] = {}
    for workflow in REQUIRED_WORKFLOWS:
        trusted = [
            run
            for run in workflow_runs(api, repository, workflow, sha)
            if run.get("head_sha") == sha
            and run.get("head_branch") == "main"
            and (run.get("head_repository") or {}).get("full_name", "").lower()
            == repository.lower()
            and run.get("event") in TRUSTED_EVENTS
        ]
        if not trusted:
            pending.append(f"{workflow}: no trusted run for this SHA")
            continue
        # Never select only successes: a newer rerun may be pending or failed.
        latest = max(trusted, key=lambda run: (run["run_number"], run["id"]))
        if latest.get("status") != "completed":
            pending.append(f"{workflow}: {latest.get('status', 'unknown')}")
        elif latest.get("conclusion") != "success":
            raise GateError(f"{workflow} did not succeed for this SHA: {latest.get('conclusion')}")
        else:
            successful[workflow] = latest["id"]
    if not pending:
        # Close the API-read window as far as possible before publication.
        require_current_main(api, repository, sha)
    return RevisionVerification(pending, successful)


def wait_for_verification(
    api: GitHubReadAPI,
    repository: str,
    sha: str,
    *,
    timeout: float = 1200,
    interval: float = 20,
    clock: Callable[[], float] = time.monotonic,
    sleep: Callable[[float], None] = time.sleep,
) -> RevisionVerification:
    deadline = clock() + timeout
    while True:
        result = inspect_revision(api, repository, sha)
        if not result.pending:
            return result
        remaining = deadline - clock()
        if remaining <= 0:
            raise GateError("Verification is not complete: " + "; ".join(result.pending))
        print("Waiting for " + "; ".join(result.pending), flush=True)
        sleep(min(interval, remaining))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sha", required=True)
    parser.add_argument("--wait-seconds", type=float, default=1200)
    args = parser.parse_args()
    try:
        repository = os.environ.get("GITHUB_REPOSITORY", "")
        validate_context(
            repository,
            args.sha,
            os.environ.get("GITHUB_EVENT_NAME", ""),
            os.environ.get("GITHUB_REF", ""),
        )
        if args.wait_seconds < 0:
            raise GateError("Wait duration must not be negative")
        checkout = subprocess.run(
            ["git", "rev-parse", "HEAD"], check=True, capture_output=True, text=True
        ).stdout.strip()
        if checkout != args.sha:
            raise GateError("Checked-out revision does not match the pinned deployment SHA")
        token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
        if not token:
            raise GateError("A read-only Actions token is required")
        api = GitHubAPI(token, os.environ.get("GITHUB_API_URL", "https://api.github.com"))
        result = wait_for_verification(api, repository, args.sha, timeout=args.wait_seconds)
    except (GateError, OSError, ValueError, subprocess.SubprocessError) as error:
        print(f"Pages publication blocked: {error}", file=sys.stderr)
        return 1
    print(f"Verified {args.sha}: {result.successful_runs}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
