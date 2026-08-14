# Parliaments

Parliaments is a documentation and data project for public parliamentary
video sources. It records the stream endpoints, official pages, schedule/EPG
surfaces, scraper notes, and rights/permission evidence found while researching
open parliamentary video access.

The repository is intended to be a public, inspectable catalogue and research
record.

## What Is Here

- `data/channels.json`: canonical source catalogue.
- `schema/channels.schema.json`: machine-readable catalogue schema.
- `parliament_streams/scrapers/`: Python parsers for the schedule/EPG sources
  already understood by the prototype.
- `parliament_streams/healthcheck.py`: repeatable live endpoint/page health
  checker for catalogue entries.
- `tools/deep_validate_browser.mjs`: optional Playwright/Chromium validator
  for official player pages that only expose manifests after JavaScript runs.
- `reports/health/`: dated JSON health reports from live validation passes.
- `docs/sources-and-provenance.md`: source ownership, reuse, and provenance
  boundaries.
- `docs/source-rights-and-permissions.md`: source-by-source permission and
  rights evidence.
- `research.md`: working research log for stream discovery and source notes.
- `plan.md`: current roadmap for the documentation/data project.
- `tests/`: data-contract and scraper-registry tests.

## Catalogue Scope

The catalogue includes:

- direct HLS endpoints discovered from official pages, official APIs, or
  official-vendor player infrastructure;
- official YouTube/link-out sources where direct stream reuse is not
  appropriate;
- supranational official-page/schedule targets for EU, UN, Council of Europe,
  and OSCE coverage where direct stream reuse is not documented;
- selected non-US sub-national legislatures where an official source or
  validated official-vendor stream has been documented;
- one legacy DASH research candidate kept for provenance;
- official pages used for source attribution and validation;
- schedule/EPG scrape surfaces for CPAC, Quebec, Ontario, New Zealand, Brazil,
  Spain, Ireland, Estonia, Norway, Chile, Israel, Germany, El Salvador, and
  Nunavut, plus supranational EU/UN/Council of Europe/OSCE targets;
- permission status, evidence links, and reuse recommendations for every
  channel entry.

This is not an endorsed global directory and not a rebroadcast service. Public
availability does not automatically mean permission to redistribute, embed, or
play a stream natively in another product.

The current democracy-priority validation work is recorded in dated reports,
including:

- `reports/health/2026-08-14-catalogue-health.json`
- `reports/health/2026-08-14-tier1-democracy-hls.json`
- `reports/health/2026-08-14-tier2-democracy-hls.json`
- `reports/health/2026-08-14-tier1-tier2-deep-browser-validation.json`
- `reports/health/2026-08-14-supranational-static.json`
- `reports/health/2026-08-14-supranational-deep-browser-validation.json`
- `reports/health/2026-08-14-non-us-subnational-static.json`
- `reports/health/2026-08-14-non-us-subnational-deep-browser-validation.json`
- `reports/health/2026-07-29-tier1-democracy-hls.json`
- `reports/health/2026-07-29-tier2-democracy-hls.json`
- `reports/health/2026-07-29-tier3-democracy-hls.json`
- `reports/health/2026-07-29-tier1-tier2-deep-browser-validation.json`

The August 14 national refresh added Germany's Bundestag channel 1 as a validated but
permission-pending national HLS source, reconfirmed several existing national
sources, and downgraded endpoints that did not validate cleanly.

The supranational pass added official-page entries for European Parliament
Multimedia Centre, Council of the European Union Live, EU Audiovisual Service /
EBS, United Nations Web TV, Council of Europe / PACE Live, and OSCE Live. These
are link-out/schedule targets; no stable raw HLS/DASH manifest was validated
for them in the static or browser pass.

The non-US sub-national pass reconfirmed that Canada is the strongest expansion
cluster. Nunavut's Legislative Assembly TV HLS endpoint validated on 2026-08-14
and is now recorded as a permission-pending direct HLS source. UK devolved
parliaments, additional Canadian provincial/territorial assemblies, Australian
states, German Landtage, Spanish autonomous parliaments, and selected Mexican
regional channels remain research targets unless their direct stream paths and
reuse terms are documented.

## Python Scrapers

The scraper modules are small standard-library parsers. They are meant to
document and reproduce the parsing logic that used to live in Swift schedule
adapters.

Current scraper ids:

- `cpac`
- `quebec-webdiffusion`
- `new-zealand-parliament`
- `ontario-calendar`
- `brazil-tv-camara`

They parse supplied HTML/JSON strings. Network fetching is deliberately not
hidden inside the parsers so validation runs can record exactly what was
downloaded, when, and from which official endpoint.

Schedule sources use `scraper_status: implemented` when a parser exists and
`scraper_status: planned` when a source is documented but still needs parser
work.

Parse a saved response with the scraper CLI:

```sh
uv run --extra dev python -m parliament_streams.scrapers cpac /path/to/cpac-schedule.html
```

Quebec uses two official JSON endpoints, so pass the live response first and
the upcoming response second:

```sh
uv run --extra dev python -m parliament_streams.scrapers quebec-webdiffusion live.json upcoming.json
```

The command prints parsed channel metadata as JSON. It does not fetch network
resources itself.

## Verify

Install `uv`, then run the local verification pass:

```sh
make verify
```

The Makefile uses `uv run --extra dev`, so contributors get a Python 3.11+
environment and the pinned Ruff version from `uv.lock` instead of relying on a
system Python.

This runs JSON validation, Ruff linting, Python import/compile checks, and the
unit tests.

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
uv run --extra dev python -m parliament_streams.healthcheck --output reports/health/YYYY-MM-DD-catalogue-health.json
```

The health checker records HTTP status, content type, final URL, and whether
direct HLS/DASH entries look like manifests. It is a technical availability
check only; it does not determine redistribution permission.

For a deeper browser/player pass against Tier 1 and Tier 2 official pages, run:

```sh
node --version
npm install --no-save playwright
node tools/deep_validate_browser.mjs
```

If Playwright is installed outside the repository, point `NODE_PATH` at the
directory containing `playwright`:

```sh
NODE_PATH=/path/to/node_modules node tools/deep_validate_browser.mjs
```

The browser validator uses Playwright's Chromium automation to load official
pages, wait for player scripts, capture `.m3u8` and `.mpd` network/DOM
references, and validate discovered manifests. It is intentionally separate
from `make verify` because it performs live network checks against third-party
sites and can be affected by geofencing, cookies, JavaScript changes, sitting
hours, authentication prompts, and player behavior.

## Rights And Reuse

The repository code and original documentation are covered by the repository
license. External stream URLs, official pages, schedule data, video content,
marks, watermarks, screenshots, and YouTube metadata belong to their respective
sources and may be governed by separate terms.

Before using a source outside research or advocacy:

1. Review its official page.
2. Review its terms and attribution requirements.
3. Prefer documented official embeds or APIs.
4. Preserve visible attribution.
5. Avoid implying endorsement.
6. Seek written permission where the status is pending or ambiguous.

See `docs/sources-and-provenance.md` and
`docs/source-rights-and-permissions.md` for the current evidence.

## Why This Exists

Public parliamentary video is often available, but not always in predictable,
machine-readable, app-friendly forms. This project documents what was found and
where openness could improve: stable HLS or documented embeds, JSON schedules,
event IDs, now/next signals, timezone data, chamber labels, captions/audio
metadata, plain-language terms, browser compatibility, and clear off-air
signals.
