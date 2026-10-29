# Development And Validation

[Documentation index](README.md) · [Catalogue maintenance](catalogue-maintenance.md) ·
[Naming and compatibility](naming-conventions.md)

[Data validation and coverage](data-validation.md) explains publication schemas,
format checks, the static-type boundary and the scope of coverage metrics.

Run these commands from the repository root. Local checks use the working
catalogue; live audits separately contact third-party sources.

Use a repository checkout for development and the Python CLI. Catalogue commands
resolve resources in `schema/` and `data/` from that checkout. The packaged
page-lead rules JSON supports its Python module; it does not make a standalone
wheel a complete installation of the catalogue, schemas or maintenance tools.

## Setup And Verification

Development uses two deliberately separate toolchains:

| Tooling | Responsibility |
| --- | --- |
| Python 3.11+ and `uv` | Catalogue CLI and mutations, JSON Schema and business-rule validation, inventory JSON generation, scrapers, HTTP health checks, unit tests and coverage, Ruff formatting/linting, and mypy type checking. |
| Node.js 24+ and npm | Locked HLS.js and selected D3 exports, JavaScript unit tests, static HTML validation, Playwright browser interaction tests, Axe accessibility checks, and the optional deep browser/player research pass. |
| Make | Stable command entry points that compose the Python and Node checks without hiding which toolchain runs them. |
| Playwright Chromium | The downloaded browser used to test rendered desktop, intermediate-width, mobile, keyboard, and accessibility behavior. |

Node assembles the browser libraries during installation. Python generates the
public inventory JSON projection; neither toolchain serves production traffic. The deployed GitHub Page is static HTML, CSS, JavaScript,
and JSON and requires neither Python nor Node at runtime.

Install `uv`, Node.js 24 or newer, both locked development environments, and
the Playwright Chromium runtime:

```sh
uv sync --locked --extra dev
npm ci
npx playwright install chromium
```

On Linux, `npx playwright install --with-deps chromium` also installs missing
browser system packages. Run `make site` from the repository root and open
[localhost:8000/site/](http://localhost:8000/site/) for a static preview.
The checked-in catalogue and inventory work without a collected schedule;
`make schedules` creates that ignored local snapshot through live source requests.

The Makefile uses `uv run --locked --extra dev`, so contributors get a Python
3.11+ environment and pinned development tools from `uv.lock` instead of
relying on a system Python.

## Test Commands

| Command | What it runs |
| --- | --- |
| `make test-python` | Python unit and offline workflow integration tests. |
| `make test-js` or `npm test` | JavaScript unit tests using Node's test runner; no browser is launched. |
| `make test-browser` or `npm run test:browser` | Static HTML validation and the local Playwright/Axe interaction and accessibility suite. |
| `make test` | All three test suites above, once each. |
| `make coverage` | The Python suite with branch coverage and a 90% minimum for `parliament_streams/`. |
| `make verify` | Full data and code validation, Python coverage, JavaScript unit tests and local browser checks. |

`npm run test:unit` explicitly selects the JavaScript unit suite.
`npm run check:site` and `make accessibility-check` remain compatible names for
the HTML/browser checks. JavaScript tests have their own target rather than
running implicitly under `make discovery-plan-validate`.

The local browser runner, `tools/check_site.mjs`, runs the whole suite
and has no command-line filtering or `--help` mode. Run it through the commands
above without extra arguments. `npm run check:browser` selects the browser portion;
the former `tools/check_accessibility.mjs` path remains a compatibility entry
point. Its Chromium process is launched with audio muted.
This local suite is separate from the live third-party browser audit below.

For complete verification:

```sh
make verify
```

This runs JSON syntax plus schema/business-rule validation, checks that the
public inventory JSON projection is current, checks Ruff formatting and linting, runs
strict mypy over production Python and Python tools, compiles Python modules,
and runs Python tests through the coverage gate. It runs JavaScript unit tests
once, validates the HTML and runs Axe plus browser
assertions for desktop and mobile semantics, keyboard focus, reflow, control
contrast, and reduced-motion support. It does not rerun the Python suite without
coverage or repeat the browser suite.

On GitHub, Python/data and JavaScript/browser checks run in parallel. Local
`make verify` retains the complete sequential checks; no coverage threshold or
publication validation is weakened by CI scheduling.

Focused CLI/store tests use four representative source records. Export-failure
tests use a one-record synthetic inventory in `tests/fixtures/public-inventory.json`.
The real catalogue and full inventory remain covered by maintained-data contract,
projection and offline-publication checks. Tests do not bypass validators to run faster.

Browser coverage avoids repeating the same component matrix: all 26 IPTV/VLC
locales run at 320px once; other catalogue/schedule placements exercise English,
French, long German labels, Devanagari, Thai, Chinese, Korean, Japanese,
Indonesian and syllabics. Fast key/schema/
placeholder checks still cover every locale. All five pages retain direct-load
versus soft-navigation layout and language-picker width checks at desktop and
mobile widths, plus existing narrow-screen, keyboard, Axe, playback, timezone
and bidirectional-source checks.

After changing catalogue or inventory inputs, refresh public inventory matches with:

```sh
make institution-site-data
```

Format Python sources with:

```sh
make format
```

Run a live health check against playback URLs and official link-out pages:

```sh
make healthcheck
```

To save a dated report:

```sh
uv run parliament-streams health-check \
  --output reports/health/YYYY-MM-DD-catalogue-health.json
```

To check selected entries only, repeat `--id`:

```sh
uv run parliament-streams health-check \
  --id france-national-assembly \
  --id mongolia-parliament-tv
```

The health checker records HTTP status, content type, final URL, and whether
direct HLS/DASH entries look like manifests. It is a technical availability
check only; it does not determine redistribution permission.

For a deeper browser/player pass against Tier 1 and Tier 2 official pages, run:

```sh
node --version
npm ci
npx playwright install chromium
node tools/deep_validate_browser.mjs \
  --input data/discovery/tier1.json \
  --input data/discovery/tier2.json \
  --output reports/health/YYYY-MM-DD-tier1-tier2-deep-browser-validation.json
```

If Playwright is installed outside the repository, point `NODE_PATH` at the
directory containing `playwright`:

```sh
NODE_PATH=/path/to/node_modules node tools/deep_validate_browser.mjs \
  --input data/discovery/tier1.json \
  --input data/discovery/tier2.json \
  --output reports/health/YYYY-MM-DD-tier1-tier2-deep-browser-validation.json
```

The browser discovery tool uses Playwright's Chromium automation to load maintained
pages, wait for player scripts, capture `.m3u8` and `.mpd` network/DOM
references, observe viewing/programme links, and check discovered manifest formats.
These observations do not certify decoded playback or reuse rights. It is separate
from `make verify` because it performs live network checks against third-party
sites and can be affected by geofencing, cookies, JavaScript changes, sitting
hours, authentication prompts, and player behavior.

### Candidate discovery audit

The monthly/manual [Candidate Discovery workflow](../.github/workflows/candidate-discovery.yml)
builds its input plan from eligible legislature inventory routes, maintained
Tier 1/Tier 2 targets and the current catalogue. It records source and access
gaps, checks discovered manifest formats, and queues unverified viewing,
archive, recording and programme-page leads. It never promotes catalogue
records automatically. See [GitHub Actions](github-actions.md) for review queues,
evidence limits and the conditions for retaining or closing an issue.

To validate or build the maintained plan locally:

```sh
make discovery-plan-validate
uv run --locked python tools/build_discovery_targets.py \
  --output-dir reports/automated/candidate-discovery/targets
```

Plan validation is separate from the JavaScript unit tests. The workflow's
static/browser stages are live third-party audits with explicit time budgets;
retain its evidence-sanitization steps before sharing reports. These network
stages are separate from `make test` and `make verify`.

Evidence-backed decisions belong in
`data/discovery/reviewed-manifests.json` or
`data/discovery/reviewed-page-leads.json`. They preserve why a lead was reviewed
without treating ownership, playback, schedules or rights as interchangeable.

The separate U.S. inventory records six federal candidates and all 50 state
legislatures. Validate this additional maintained research resource with:

```sh
uv run python tools/validate_us_candidates.py
```

Update `data/discovery/us-legislatures.json` when official research confirms a
better video or schedule surface. Use
`reports/us-federal-state-candidates-2026-08-24.md` for the initial priority
order. A `verified_official_video_surface` label means an official video page
was confirmed; it does not claim a stable direct stream, embeddability, or
redistribution permission.
