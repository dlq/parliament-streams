# Architecture

This repository is a catalogue and evidence project, not a streaming service.
The code exists to keep the catalogue reliable, inspectable, and publishable as
a static website.

## Source Of Truth

`data/channels.json` is the canonical published catalogue. Every channel record
contains:

- institutional identity links, usually Wikidata and IPU Parline where
  applicable;
- source type and playback posture;
- official URL and provenance notes;
- accessibility evidence;
- schedule/EPG source metadata; and
- permission evidence and a reuse recommendation.

`schema/channels.schema.json` defines the public JSON shape. Python validation
adds cross-record rules that JSON Schema cannot express, such as source-type and
technical-status coherence.

## Generated And Local Files

`site/catalogue-data.js` is generated from `data/channels.json` so `site/index.html`
can be opened directly from disk. Do not edit it independently; run
`make site-data` or use the catalogue manager.

`data/schedules.json` is a local generated now/next snapshot and is ignored by
Git. GitHub Pages generates its own schedule snapshot during deployment.

`data/fallbacks.json` records official event platforms, live pages, broadcaster
pages, and provider-managed embeds that can support link-out or fallback UI
without claiming a stable direct stream. It is validated separately from the
channel catalogue so event-specific sources do not become misleading permanent
channel records.

`reports/health/` contains dated research and validation reports. These are
evidence artifacts, not runtime inputs.

## Runtime Shape

The public site is static:

1. GitHub Pages serves files from `site/`.
2. The page fetches `data/channels.json`.
3. It optionally fetches `data/schedules.json`.
4. It may use `data/fallbacks.json` for official fallback links and future
   event-resolution UI.
5. It renders catalogue rows, source details, rights notes, and official links.
6. It enables native playback only when catalogue metadata permits it.

There is no server-side proxy, transcoder, database, account system, analytics
pipeline, or request-time scraper.

## Source Types

`source_type` is a coarse UI and compatibility category:

- `direct_hls`: a recorded HLS URL discovered from an official or official-vendor
  surface.
- `direct_dash`: a recorded DASH URL kept for provenance or review.
- `youtube`: an official YouTube source rendered through YouTube's
  privacy-enhanced embed path.
- `official_page`: a link-out source where native playback is not appropriate,
  not validated, or not permitted.

`source_kind` is the more precise provenance and delivery classification:

- `first_party_hls`: HLS served from the legislature, parliament, or closely
  controlled institutional domain.
- `official_vendor_hls`: HLS served by a CDN, streaming contractor, or platform
  clearly used by the official source.
- `third_party_relay_hls`: HLS served by a relay that is not clearly operated or
  authorized by the source. These should normally stay out of playback.
- `direct_dash_research`: DASH endpoint retained as research evidence, not as
  Apple-native playback.
- `official_youtube_embed`: official YouTube presence rendered through the
  provider's embed path without extracting manifests.
- `official_page`: official link-out/player page with no native playback claim.

`stability_risk` is operational rather than legal. It records whether a URL or
player route appears low, medium, high, or unknown risk for drift, event-only
failure, or needing manual review. It does not grant permission to replay a
source.

`technical_status: link_only` must pair with `source_type: official_page`.
Browser-discovered playback URLs should not be promoted to direct playback until
their stability, provenance, and reuse posture are documented.

Fallback sources use a separate model. They can describe official event pages,
official player pages, official broadcaster pages, and provider-managed embeds.
Their `playback_claim` must stay conservative: a fallback can document link-out
or provider-managed playback without asserting that a reusable direct stream
exists.

## Maintenance Flow

Prefer candidate records for new sources:

1. Create a candidate with `parliament-streams candidate-new`.
2. Add official provenance, identity, accessibility, schedule, and permission
   evidence.
3. Validate the candidate.
4. Mark it `ready`.
5. Promote it with `candidate-promote`.

Promotion validates the full catalogue, updates `generated_on`, regenerates the
site snapshot, and records the candidate outcome. Bulk manual edits are possible
for reviewed maintenance, but they should be followed immediately by
`make site-data` and `make verify`.

## Scrapers And Schedules

Schedule parsers live in `parliament_streams/scrapers/`. Parsers should consume
saved HTML or JSON strings and return normalized schedule data. They should not
perform network requests directly; `parliament_streams/schedule_collection.py`
owns HTTP, retries, timestamps, errors, and output shape.

Use `scraper_status: implemented` only when the parser is registered and tested.
Use `scraper: planned` with `scraper_status: planned` for useful official
schedule surfaces that still need implementation.

## Validation Stack

`make verify` is the high-confidence local check. It runs JSON parsing,
catalogue and fallback validation, candidate and discovery validation,
generated-site drift checks, Ruff formatting and linting, strict mypy, Python
compilation, unit tests with coverage, HTML validation, and Playwright/Axe
accessibility checks.

Daily and monthly GitHub Actions workflows repeat catalogue audits, link checks,
health checks, schedule audits, and browser-based candidate discovery. Automated
reports help identify issues; they do not grant permission to reuse a stream.
Stable-stream regression checks use `availability` and `stability_risk` to keep
alerts focused: high-risk sources remain in the full health report, but do not
drive the low-noise always-on regression issue workflow.

## Where To Start

- To understand the data model: read `schema/channels.schema.json` and
  `schema/fallbacks.schema.json`, then `parliament_streams/models.py`.
- To add or change a source: read `docs/catalogue-maintenance.md`.
- To understand source rights posture: read
  `docs/source-rights-and-permissions.md`.
- To work on the static site: start with `site/app.js`, then run
  `npm run check:site`.
- To work on schedule metadata: start with
  `parliament_streams/schedule_collection.py` and one existing scraper.
