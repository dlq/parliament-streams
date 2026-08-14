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
- source type: HLS, DASH, YouTube, official player, official page, or unknown;
- validation date and region;
- status code, content type, and observed player behavior if tested;
- whether the URL came from a static HTTP response, official API, browser
  network trace, DOM/player configuration, or a third-party playlist seed;
- terms, permission, or attribution notes;
- schedule/EPG endpoint, if one exists;
- known caveats such as geofencing, login prompts, off-air behavior, or
  event-only availability.

Avoid adding community playlist URLs unless they can be traced back to an
official page, official API, official embed, or official streaming vendor path.

## Data And Scraper Changes

Before opening a pull request, run:

```sh
make verify
```

The Makefile uses `uv run --extra dev`, so install `uv` first if it is not
already available. `make verify` validates the JSON catalogue, checks the
schema contract, runs Ruff linting, compiles Python modules, and runs the
data/scraper contract tests.

Python scrapers should parse supplied HTML/JSON strings. Do not hide network
fetches inside parser functions; fetch scripts should record where data came
from and when it was retrieved.

For `epg_sources`, use `scraper_status: implemented` only when the named
scraper module exists. Use `scraper: planned` and `scraper_status: planned` for
documented schedule sources that still need parser work.

To test a parser manually, save the official response to disk and run:

```sh
uv run --extra dev python -m parliament_streams.scrapers <scraper-id> <response-file>
```

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
npm install --no-save playwright
node tools/deep_validate_browser.mjs
```

To validate a specific seed or prior report and write a dated output:

```sh
node tools/deep_validate_browser.mjs \
  --input reports/health/YYYY-MM-DD-seed-or-report.json \
  --output reports/health/YYYY-MM-DD-browser-validation.json
```

Do not treat a browser-discovered stream as redistributable just because it
plays. Add or update the permission evidence in
`docs/source-rights-and-permissions.md`.

## Research Notes

`research.md` is a working log. Prefer moving polished, reusable source guidance
into `docs/` once a finding is stable.
