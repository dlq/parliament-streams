# Parliament Streams

Parliament Streams is a documentation and data project for public parliamentary
video sources. It records the stream endpoints, official pages, schedule/EPG
surfaces, media-accessibility metadata, scraper notes, and rights/permission
evidence found while researching open parliamentary video access.

The repository is intended to be a public, inspectable catalogue and research
record.

**[Browse the public catalogue](https://dlq.github.io/parliament-streams/)**

## What Is Here

- `site/`: a build-free static catalogue interface for GitHub Pages. It
  loads the published `data/channels.json` artifact directly; no application
  backend, user accounts, analytics, or server-side stream proxy is used.
- `data/channels.json`: canonical source catalogue, including recorded caption,
  sign-language, audio-description, Wikidata identity, and applicable IPU
  Parline parliament/chamber identifiers.
- `schema/channels.schema.json`: machine-readable catalogue schema.
- `parliament_streams/cli.py`: typed Python catalogue manager for validation,
  candidate intake, safe mutations, health reports, identity audits, and exports.
- `parliament_streams/scrapers/`: Python parsers for schedule/EPG sources with
  documented, reproducible parsing logic.
- `parliament_streams/healthcheck.py`: repeatable live endpoint/page health
  checker for catalogue entries.
- `tools/deep_validate_browser.mjs`: optional Playwright/Chromium validator
  for official player pages that only expose manifests after JavaScript runs.
- `tools/check_accessibility.mjs`: local and CI browser accessibility checks for
  the static catalogue.
- `reports/health/`: dated JSON health reports from live validation passes.
- `candidates/`: reviewable source-research records and their rejected or
  promoted outcomes.
- `docs/sources-and-provenance.md`: source ownership, reuse, and provenance
  boundaries.
- `docs/source-rights-and-permissions.md`: source-by-source permission and
  rights evidence.
- `docs/open-stream-principles.md`: the project position on open protocols,
  access, terms, metadata, and accessibility for public legislative streams.
- `NOTES.md`: working research log for stream discovery and source notes.
- `PLANS.md`: current roadmap for the documentation/data project.
- `CHANGELOG.md`: project-focused change history.
- `tests/`: catalogue-manager, data-contract, parser, and health-check tests
  with enforced branch coverage for the Python package; frontend checks live in
  `tools/`.

## Manage The Catalogue

Python 3.11 or newer and `uv` are required. Install the locked development
environment, validate the current catalogue, and inspect the available
commands:

```sh
uv sync --locked --extra dev
uv run parliament-streams validate
uv run parliament-streams --help
```

New sources should normally begin as tracked candidate records rather than as
hand-edits to `data/channels.json`. The manager scaffolds and validates those
records, promotes only candidates marked `ready`, validates every catalogue
mutation against both JSON Schema and cross-record rules, updates the catalogue
date, and regenerates the direct-file site snapshot. It also supports dry-run
add/update/remove operations, validation-seed generation, live health reports,
health-report diffs, Wikidata/IPU coherence audits, and CSV export.

See [docs/catalogue-maintenance.md](docs/catalogue-maintenance.md) for the
complete workflow and command examples. Contribution evidence requirements are
in [CONTRIBUTING.md](CONTRIBUTING.md).

## Catalogue Scope

The catalogue includes:

- direct HLS endpoints discovered from official pages, official APIs, or
  official-vendor player infrastructure;
- official YouTube sources using compliant privacy-enhanced playlist embeds,
  plus link-out sources where in-page playback is not appropriate;
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
  channel entry;
- explicit caption, caption-language, sign-language, and audio-description
  status. `unknown` means the project has not yet recorded sufficient evidence,
  not that the feature is unavailable.
- durable Wikidata QIDs for every recorded legislature or institution and IPU
  Parline country, parliament, and chamber codes where IPU covers the national
  body. These are identity and discovery links, not sources for stream health,
  schedule data, or permission decisions.

This is not an endorsed global directory and not a rebroadcast service. Public
availability does not automatically mean permission to redistribute, embed, or
play a stream natively in another product.

## Public Catalogue Site

The repository includes a GitHub Pages interface in `site/`. It provides
search and filters over the canonical catalogue, source/EPG/provenance details,
external institutional identity links, and an official outbound link for every
entry.

The page enables in-page playback where a validated direct feed or official
provider embed is recorded in `data/channels.json`. For direct feeds, all of
the following conditions apply:

1. the entry has a direct playback URL;
2. its technical status is `validated`; and
3. its recorded terms do not expressly prohibit third-party reuse.

This is an opt-out research posture: the absence of recorded affirmative
permission is not represented as a licence or other grant of rights. Direct
endpoints with `no_third_party_reuse` remain link-out only, and sources without
a validated playback route remain link-out only. HLS playback uses the
browser's native support where available and loads pinned `hls.js` in the
browser for compatible non-Safari browsers; this is client-side code only, not
a backend or proxy.

YouTube catalogue entries use YouTube's official privacy-enhanced iframe and a
permanent official uploads playlist. The playlist starts with the latest
published item and may show an active broadcast when YouTube places it first;
it is not represented as a guaranteed live-only feed. The official outbound
link points to the channel's stable live page, which may redirect to an active
or upcoming event. The catalogue does not extract YouTube manifests.

Every native player includes the recorded source attribution and direct links
to relevant supporting sources. Its detail view also presents the catalogue's
recorded media-accessibility status. `explicit_reuse_with_conditions` means the
project has recorded affirmative official terms. `personal_use_pending_review` and
`noncommercial_pending_review` mean that the player is offered under this
opt-out policy, not that permission has been granted. `no_third_party_reuse`
means the source terms expressly rule out a third-party player without separate
permission. Source owners can request prompt removal through the repository
owner on GitHub.

The deploy workflow in `.github/workflows/pages.yml` publishes the site files
and the canonical `data/channels.json` data artifact. To enable it once
on GitHub, set **Settings → Pages → Build and deployment → Source** to
**GitHub Actions**. Thereafter pushes affecting `site/` or `data/channels.json`
publish the updated page.

For a quick local preview, open `site/index.html` directly. The checked-in
`site/catalogue-data.js` snapshot allows the page to work without a local
server. It is generated from the canonical JSON and checked for drift by CI.
YouTube does not permit iframe playback from a `file://` page because it has no
HTTP origin/referrer; the direct-file preview therefore shows a link to the
public catalogue instead of a broken player.

To preview the hosted data-loading path instead, serve the repository root:

```sh
make site
```

Then visit `http://localhost:8000/site/`. This HTTP preview also enables the
official YouTube embeds. The served page requests the same
canonical `data/channels.json` file used by the deployment workflow and falls
back to the generated snapshot if that request is unavailable.

## Languages

The static interface supports English, French, Spanish, Brazilian Portuguese,
Danish, German, Estonian, Greek, Hindi, Irish, Italian, Luxembourgish, Dutch,
Norwegian Bokmal, Slovak, Thai, Simplified Chinese, Inuktitut syllabics, and
te reo Maori. Select a
language in the site header or use `?lang=fr` (substituting a supported locale
code) in a shared URL; the selection is also stored locally in the browser.

The locale setting translates interface chrome and project-authored explanatory
copy. Official source names, programme records, attribution text, permission
summaries, and evidence links remain as recorded in the canonical catalogue.
This avoids presenting unreviewed translations as authoritative source or legal
material. The page marks those English-language catalogue fields separately so
assistive technology does not pronounce them as translated interface text.

The Inuktitut syllabics interface is a best-effort machine-generated draft,
using terminology sources from Nunavut and awaiting review by an Inuktitut
speaker. It must not be treated as an authoritative translation.

The current democracy-priority validation work is recorded in dated reports,
including:

- `reports/health/2026-08-16-subnational-promotion-static.json`
- `reports/health/2026-08-16-subnational-promotion-deep-browser.json`
- `reports/health/2026-08-16-subnational-promotion-seed.json`
- `reports/health/2026-08-15-catalogue-health.json`
- `reports/health/2026-08-15-review-health.json`
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

The non-US sub-national work records Nunavut and Jalisco as validated,
permission-pending direct HLS sources. Scottish Parliament TV, Senedd TV, and
Northern Ireland Assembly TV are documented as official-page and schedule
entries with source-specific rights guidance. The 2026-08-16 promotion pass
added 18 more official-player and schedule records covering Canadian
provinces and territories, Australian states, German Landtage, and Spanish
autonomous parliaments. These remain link-out sources unless a stable direct
feed and suitable playback posture are both documented. Colima remains
excluded because the validated regional broadcaster has not been established
as a parliamentary channel.

## Python Scrapers

The scraper modules are small standard-library parsers. They document and
reproduce the parsing logic used to turn official schedule surfaces into
catalogue metadata.

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

Development uses two deliberately separate toolchains:

| Tooling | Responsibility |
| --- | --- |
| Python 3.11+ and `uv` | Catalogue CLI and mutations, JSON Schema and business-rule validation, site-data generation, scrapers, HTTP health checks, unit tests and coverage, Ruff formatting/linting, and mypy type checking. |
| Node.js 24+ and npm | Static HTML validation, Playwright browser interaction tests, Axe accessibility checks, and the optional deep browser/player research pass. |
| Make | Stable command entry points that compose the Python and Node checks without hiding which toolchain runs them. |
| Playwright Chromium | The downloaded browser used to test rendered desktop, intermediate-width, mobile, keyboard, and accessibility behavior. |

Node does not build the catalogue, generate the site, run a backend, or serve
production traffic. The deployed GitHub Page is static HTML, CSS, JavaScript,
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
and runs the unit suite with a 90% minimum branch-coverage gate for
`parliament_streams/`. It also validates the HTML and runs Axe plus browser
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
  --input reports/health/2026-08-14-tier1-democracy-hls.json \
  --input reports/health/2026-08-14-tier2-democracy-hls.json \
  --output reports/health/YYYY-MM-DD-tier1-tier2-deep-browser-validation.json
```

If Playwright is installed outside the repository, point `NODE_PATH` at the
directory containing `playwright`:

```sh
NODE_PATH=/path/to/node_modules node tools/deep_validate_browser.mjs \
  --input reports/health/2026-08-14-tier1-democracy-hls.json \
  --input reports/health/2026-08-14-tier2-democracy-hls.json \
  --output reports/health/YYYY-MM-DD-tier1-tier2-deep-browser-validation.json
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
