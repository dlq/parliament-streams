# Contributing

This project is early and curated. Small, evidence-backed changes are easiest to
review.

Use the GitHub issue templates for source corrections, endpoint validation
problems, and schedule metadata issues. If the report is sensitive, follow
[SECURITY.md](SECURITY.md) instead of opening a public issue.

## Source Or Stream Corrections

For channel/source changes, include:

- official legislature or broadcaster page URL;
- stream URL, official embed URL, official YouTube URL, or official player URL;
- source type: `direct_hls`, `direct_dash`, `youtube`, or `official_page`;
- validation date and region;
- status code, content type, and observed player behavior if tested;
- whether the URL came from a static HTTP response, official API, browser
  network trace, DOM/player configuration, or a third-party playlist seed;
- terms, permission, or attribution notes;
- schedule/EPG endpoint, if one exists;
- caption availability and languages, sign-language interpretation, and audio
  description evidence, using `unknown` when the evidence is incomplete;
- known caveats such as geofencing, login prompts, off-air behavior, or
  event-only availability.

Avoid adding community playlist URLs unless they can be traced back to an
official page, official API, official embed, or official streaming vendor path.

## Data And Scraper Changes

Use the typed catalogue manager for normal maintenance. New sources should be
created under `candidates/` and promoted only after their technical, identity,
accessibility, schedule, and rights evidence is complete:

```sh
uv run parliament-streams candidate-new example-assembly \
  --name "Example Assembly Live" \
  --level subnational \
  --country-or-region "Example Region" \
  --legislature "Example Assembly" \
  --language English \
  --official-url https://example.gov/watch \
  --output candidates/example-assembly.json
```

After reviewing and editing the candidate, validate it, mark it ready with a
decision note, and promote it:

```sh
uv run parliament-streams candidate-validate candidates/example-assembly.json
uv run parliament-streams candidate-status \
  candidates/example-assembly.json ready \
  --note "Identity, source, accessibility, and rights evidence reviewed."
uv run parliament-streams candidate-promote candidates/example-assembly.json
```

For an existing source, export or prepare one standalone channel object and use
`parliament-streams update <id> <record.json> --dry-run` before applying it.
Do not hand-edit `site/catalogue-data.js`; catalogue mutations regenerate it.
See [docs/catalogue-maintenance.md](docs/catalogue-maintenance.md) for direct
feeds, YouTube candidates, removals, reports, audits, and exports.

## Development Tooling

Python 3.11 and `uv` own catalogue management, schema and business-rule checks,
site-data generation, scrapers, health checks, tests and coverage, Ruff, and
mypy. Node.js 24 and npm own HTML validation, Playwright browser behavior, Axe
accessibility checks, and the optional live deep-browser research tool. `make`
provides the shared command entry points. Neither development runtime is
required by the deployed static site.

Before opening a pull request, install the locked Python and JavaScript tooling
and the Playwright browser once, then run:

```sh
uv sync --locked --extra dev
npm ci
npx playwright install chromium
make verify
```

The Makefile uses `uv run --locked --extra dev`, so install `uv` first if it is
not already available. `make verify` validates the JSON catalogue and generated
site snapshot, checks schema and cross-record contracts, checks Ruff formatting
and linting, runs strict mypy, compiles Python modules, enforces at least 90%
branch coverage, validates the HTML, and checks desktop/mobile accessibility
with Axe and Playwright. After an exceptional manual change to
`data/channels.json`, run `make site-data` to refresh the direct-file snapshot.

Every channel requires an `accessibility` record. Record only what supporting
evidence establishes; `unknown` is preferable to inferring that captions,
sign-language interpretation, or audio description are absent.

Python scrapers should parse supplied HTML/JSON strings. Do not hide network
fetches inside parser functions; the shared schedule collector owns HTTP,
timeouts, retries, timestamps, and normalized static output.

For `epg_sources`, use `scraper_status: implemented` only when the named Python
parser exists, is registered, and has fixture coverage. Use
`scraper: planned` and `scraper_status: planned` for documented schedule
sources that still need parser work. This is maintainer metadata and is not
presented as live schedule status on the public catalogue page.

To test a parser manually, save the official response to disk and run:

```sh
uv run --extra dev python -m parliament_streams.scrapers <scraper-id> <response-file>
```

Run `make schedules` for an end-to-end live check. The resulting ignored
`data/schedules.json` uses the same schema and path consumed by local HTTP
previews and the generated Pages artifact. Never commit transient schedule
output to the catalogue history.

## Validation Reports

Live validation reports belong under `reports/health/` and should use dated
filenames. Static endpoint checks and browser/player checks answer different
questions, so keep them separate:

- static health checks confirm current URL reachability and manifest shape;
- tier refresh reports document country-level stream-discovery coverage;
- browser validation reports document manifests discovered only after an
  official page loads scripts or player configuration.

To rerun the browser validator locally:

```sh
npm ci
npx playwright install chromium
node tools/deep_validate_browser.mjs \
  --input reports/health/YYYY-MM-DD-seed-or-report.json \
  --output reports/health/YYYY-MM-DD-browser-validation.json
```

Do not represent a browser-discovered stream as licensed or otherwise permitted
just because it plays. Add or update the permission evidence in
`docs/source-rights-and-permissions.md`, including any terms that expressly
prohibit third-party playback.

## Research Notes

`NOTES.md` is a working log. Prefer moving polished, reusable source guidance
into `docs/` once a finding is stable.
