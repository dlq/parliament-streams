# Development And Validation

[Documentation index](README.md) · [Catalogue maintenance](catalogue-maintenance.md)

Run these commands from the repository root. Local checks use the working
catalogue; live audits separately contact third-party sources.

## Setup And Verification

Development uses two deliberately separate toolchains:

| Tooling | Responsibility |
| --- | --- |
| Python 3.11+ and `uv` | Catalogue CLI and mutations, JSON Schema and business-rule validation, site-data generation, scrapers, HTTP health checks, unit tests and coverage, Ruff formatting/linting, and mypy type checking. |
| Node.js 24+ and npm | Locked HLS.js/D3 browser-asset assembly, static HTML validation, Playwright browser interaction tests, Axe accessibility checks, and the optional deep browser/player research pass. |
| Make | Stable command entry points that compose the Python and Node checks without hiding which toolchain runs them. |
| Playwright Chromium | The downloaded browser used to test rendered desktop, intermediate-width, mobile, keyboard, and accessibility behavior. |

Node assembles the browser libraries during installation. Python generates the
catalogue snapshots; neither toolchain serves production traffic. The deployed GitHub Page is static HTML, CSS, JavaScript,
and JSON and requires neither Python nor Node at runtime.

Install `uv`, Node.js 24 or newer, both locked development environments, and
the Playwright Chromium runtime:

```sh
uv sync --locked --extra dev
npm ci
npx playwright install chromium
```

```sh
make verify
```

The Makefile uses `uv run --locked --extra dev`, so contributors get a Python
3.11+ environment and pinned development tools from `uv.lock` instead of
relying on a system Python.

This runs JSON syntax plus schema/business-rule validation, checks that the
direct-file site snapshot is current, checks Ruff formatting and linting, runs
strict mypy over production Python and Python tools, compiles Python modules,
and runs the unit suite with a 90% minimum coverage gate for
`parliament_streams/`, with branch measurement enabled. It also validates the HTML and runs Axe plus browser
assertions for desktop and mobile semantics, keyboard focus, reflow, control
contrast, and reduced-motion support.

After changing `data/channels.json`, refresh the direct-file snapshot with:

```sh
make site-data
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

The browser validator uses Playwright's Chromium automation to load official
pages, wait for player scripts, capture `.m3u8` and `.mpd` network/DOM
references, and validate discovered manifests. It is intentionally separate
from `make verify` because it performs live network checks against third-party
sites and can be affected by geofencing, cookies, JavaScript changes, sitting
hours, authentication prompts, and player behavior.

### Candidate discovery audit

GitHub Actions runs `.github/workflows/candidate-discovery.yml` on the first
day of each month and on manual dispatch. It checks 25 maintained Tier 1 and 46
Tier 2 targets statically, inspects official players in Chromium, validates
discovered HLS/DASH manifests, and compares validated URLs with the catalogue.
The workflow uploads 90-day evidence artifacts and writes uncatalogued results
to the run summary. When review findings exist, it creates or updates the
`Candidate discovery review queue` GitHub issue; it closes that issue when a
later monthly run has no findings. It never adds or promotes catalogue records
automatically.

Run the same stages locally:

```sh
uv run python tools/validate_discovery_targets.py \
  data/discovery/tier1.json data/discovery/tier2.json
uv run python tools/validate_discovery_decisions.py
uv run python tools/validate_democracy_tier_static.py \
  --input data/discovery/tier1.json \
  --output reports/discovery/tier1-static.json
uv run python tools/validate_democracy_tier_static.py \
  --input data/discovery/tier2.json \
  --output reports/discovery/tier2-static.json
node tools/deep_validate_browser.mjs \
  --input data/discovery/tier1.json \
  --input data/discovery/tier2.json \
  --output reports/discovery/browser-validation.json
uv run python tools/summarize_discovery_audit.py \
  --static reports/discovery/tier1-static.json \
  --static reports/discovery/tier2-static.json \
  --browser reports/discovery/browser-validation.json \
  --output reports/discovery/findings.json
```

This is repeatable discovery against a maintained institutional watchlist, not
an internet-wide search. Add newly confirmed official legislature/player pages
to the appropriate target file so subsequent runs cover them. Evidence-backed
rejections belong in `data/discovery/reviewed-manifests.json`; they remain in
the report but do not reopen the candidate issue on every monthly run.

The separate U.S. inventory covers six federal candidates and all 50 state
legislatures. It is schema-validated but is not yet part of the monthly browser
discovery workflow:

```sh
uv run python tools/validate_us_candidates.py
```

Update `data/discovery/us-legislatures.json` when official research confirms a
better video or schedule surface. Use
`reports/us-federal-state-candidates-2026-08-24.md` for the initial priority
order. A `verified_official_video_surface` label means an official video page
was confirmed; it does not claim a stable direct stream, embeddability, or
redistribution permission.
