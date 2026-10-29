# GitHub Actions And Review Queues

[Data validation and coverage](data-validation.md) describes the JSON schemas and
cross-format publication gate. CI checks an offline export bundle; Pages checks
its actual generated schedules, playlists, XMLTV and quality report before
uploading the publication artifact.

The automation maintains two different lists:

| List | Canonical file | What a row means |
| --- | --- | --- |
| Legislature inventory | `data/discovery/institutions.json` | A legislative identity, authority decision or retained research entry; eligibility does not certify a viewing service. |
| Stream catalogue | `data/channels.json` | A reviewed viewing source with its identity, access, schedule, accessibility and rights evidence. One source is not necessarily one legislature. |

As of 28 October 2026 these contain **940 eligible identities** and **261 catalogue
sources**, respectively. Scheduled jobs produce observations, review issues and
artifacts. They do not add or remove institutions, publish a new source, promote
a candidate or rewrite these lists automatically.

## When Workflows Run

All times below are UTC. Every workflow also supports a manual Actions run.

| Workflow | Automatic cadence | Output or purpose |
| --- | --- | --- |
| [CI](../.github/workflows/ci.yml) | Every `main` push and pull request | Full offline/data, code, site and accessibility verification |
| [CodeQL](../.github/workflows/codeql.yml) | `main` pushes, pull requests to `main`, and Mondays at 03:23 | Python and JavaScript/TypeScript security analysis |
| [Catalogue Audit](../.github/workflows/catalogue-audit.yml) | Daily at 06:41; additional browser job on Sundays | Published-source health, schedules, supporting links and regression alerts |
| [Candidate Discovery](../.github/workflows/candidate-discovery.yml) | First day of each month at 07:19 | Manifest findings and unverified viewing/programme page leads |
| [Legislature Inventory Review](../.github/workflows/legislature-inventory-review.yml) | Fifth day of each month at 08:23 | Proposed inventory changes, evidence gaps and a retained comparison baseline |
| [Deploy GitHub Pages](../.github/workflows/pages.yml) | Relevant `main` pushes and every six hours at minute 17 | Static site, current schedules, playlists and partial XMLTV guide |

CI runs two independent jobs in parallel: **Python and data contracts** runs
formatting, linting, types, maintained-data checks and Python coverage;
**JavaScript, browser and accessibility** runs JavaScript tests, HTML validation
and the silent browser/Axe suite. Each job installs only its own toolchain.
Neither job is conditional or allowed to fail. Pages still requires the entire
`CI` workflow to succeed for the exact current revision, so both jobs must pass.
Python coverage and data-generation timings have separate steps for diagnosis.

## Publication Requires Successful Checks

Pages pins its checkout to the triggering commit SHA and requires that SHA to
still be the current `main` revision. The latest trusted `main` runs of **both
CI and CodeQL** for that exact SHA must succeed. A pull-request check, an older
successful revision or an earlier success superseded by a failed/pending run
does not satisfy the gate.

The initial gate can wait up to 20 minutes for checks. Pages checks the revision
and successful runs again immediately before publication. Missing, failed,
cancelled or unfinished checks, an API failure, or an advanced `main` blocks
deployment. Scheduled and manual builds use this same rule; they do not fall
back to an older passing commit. Inspect the failed check, fix or rerun it for
the current revision, then rerun Pages if needed.

This is a deployment gate, separate from branch protection. The `main` history
rules block force pushes and deletion while allowing normal pushes.

## Audits And Recovery Alerts

After catalogue structure passes, primary URLs, stable streams, schedule
endpoints, parsed schedules and supporting links run independently. A failed
probe or issue API call does not skip unrelated probes. Failures remain visible
in the job, summary and retained reports; missing reports are named explicitly.
International URLs use shared HTTP encoding, and malformed URLs or connection
failures remain individual source errors.

A stable-stream regression issue closes only when the health diff records
`status: ok`. A schedule-source issue opens after at least three consecutive
errors and closes only when that source returns `status: ok` with parsed data.
Warnings, empty/skipped/error results, missing history and a reset failure
counter are not recoveries. Event-based source failures remain evidence without
being treated as always-on regressions.

Daily artifacts last 30 days; weekly browser and monthly discovery/inventory
artifacts last 90 days. The inventory review restores its baseline from retained
successful-run artifacts and keeps unresolved proposals for human review.

## Discovery Findings Need A Person

Monthly discovery covers maintained eligible institution routes and current
catalogue pages, including a supplemental bucket outside the 71-country tier
baseline. Static HTML and rendered pages can reveal viewing pages, archives,
YouTube channels, recordings and programme sources as well as HLS/DASH URLs.
**A manifest-format check and an observed page link are different evidence.**
A page lead does not establish ownership, legislative content, availability,
playback, programme mapping, accessibility or rights. Media is not played to
certify these leads.

The browser retains at most 100 link/media observations per page; classification
retains at most 20 page leads per page. Manifest inspection has its own
ten-per-page cap. Static batches have 360-second budgets and the monthly browser
phase has 1,800 seconds; ordering rotates monthly. Omitted and unattempted work
is reported explicitly. The issue shows the first 50 review rows and the Actions
summary the first 20, using URL excerpts of at most 120 characters; artifacts
retain the full bounded findings and coverage report. Generated evidence is
sanitized and must pass its credential scan before
issue, summary or artifact publication.

Keep manifest dispositions in `data/discovery/reviewed-manifests.json` and page
dispositions in `data/discovery/reviewed-page-leads.json`. Both use
`decision_version: 1` and a `decisions` list containing `country`, exactly one of
`url` or `url_prefix`, `disposition`, `reviewed_on`, `reason` and `evidence` URLs.
Page decisions can use `not_legislative_content` or
`not_a_viewing_or_programme_source`, alongside the existing `event_specific`,
`insecure_legacy`, `out_of_scope` and `third_party` dispositions. They retain
evidence-backed review decisions rather than silently dropping repeat findings.

Review authority and exact identity before changing the inventory. For a useful
source, confirm official provenance, scoped media evidence, schedule semantics,
accessibility and each intended use's rights, then use the normal candidate
review and promotion process. See [catalogue maintenance](catalogue-maintenance.md)
and the [discovery registers](../data/discovery/README.md). The persistent
`inventory-review` and `candidate-discovery` issues are review handoffs, not
automatic publication approvals. Incomplete discovery preserves its review
issue; a later clean inventory observation does not dismiss unresolved questions.
