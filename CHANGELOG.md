# Changelog

All notable changes to the documentation and data project are recorded here.
This changelog begins with the 2026-06-19 conversion from the retired SwiftUI
application. Earlier application work remains available in Git history.

## Unreleased - 2026-08-17

### Added

- A build-free GitHub Pages catalogue driven directly by `data/channels.json`.
- In-page native HLS playback for technically validated sources not expressly
  prohibited from third-party reuse.
- Local rectangular SVG jurisdiction flags, including Quebec, Ontario, Nunavut,
  the 2026 sub-national expansion jurisdictions, EU, UN, and OSCE markers,
  with asset attribution and licence records.
- The recovered historical parliamentary chamber/play icon as the local site
  header mark and favicon.
- A client-side locale selector and URL/local-storage locale support for the
  public catalogue interface.
- Dated catalogue and review health reports.
- A focused static, child-media, and browser validation report for Review
  sources, including event-based Spain, France, and Ontario feeds.
- A typed Python schedule collector, normalized schedule snapshot schema, and
  six-hour GitHub Actions publication for current and next event data.
- Python schedule adapters for European Parliament webstreaming and Europe by
  Satellite, alongside the existing CPAC, Quebec, Ontario, New Zealand, and
  Brazil parsers.
- Schedule adapters for the Italian Senate's dated WebTV JSON API and
  Portugal's official open-data agenda, including resolution of Portugal's
  current opaque download URL from its stable resource index.
- A reproducible `epg-audit` command and dated full-catalogue endpoint report
  that distinguishes blocked, missing, and failed schedule sources.
- Dependabot version updates for Python and GitHub Actions, plus CodeQL scans
  for Python and JavaScript.
- Parser and health-check tests with a 90% enforced Python branch-coverage
  threshold.
- Official-page, schedule, rights, and jurisdiction-flag records for the
  Scottish Parliament, Senedd Cymru, and Northern Ireland Assembly.
- Schema v3 media-accessibility records for captions, caption languages,
  sign-language interpretation, audio description, and evidence notes.
- Locked HTML validation, Axe, and Playwright accessibility checks in local
  verification and CI, including desktop and mobile interaction assertions.
- Official privacy-enhanced YouTube uploads-playlist embeds for Australia, UK
  Parliament, and Costa Rica, with stable live-page fallbacks.
- Schema v5 external identity metadata: Wikidata QIDs for every catalogue
  institution plus IPU Parline country, parliament, and chamber codes for
  applicable national bodies, each backed by dated provenance records.
- Eighteen official-player and schedule records for Canadian, Australian,
  German, and Spanish sub-national legislatures, plus Jalisco's validated
  direct HLS parliamentary channel.
- A dated static and deep-browser validation set for the 2026-08-16
  sub-national promotion pass.
- A strict-typed Python catalogue manager with candidate scaffolding and
  promotion, safe add/update/remove operations, JSON Schema plus cross-record
  validation, validation-seed generation, identity audits, health checks and
  report diffs, CSV export, and automatic site-snapshot regeneration.
- Candidate review records under `candidates/` and a complete catalogue
  maintenance guide.
- Strict mypy and catalogue business-rule checks in local verification and CI.

### Changed

- Reworked the mobile source details into a non-modal, resizable bottom sheet
  that keeps the catalogue available for switching streams.
- Tightened mobile catalogue rows and reorganized sheet spacing, actions, and
  metadata for smaller screens.
- Made selection of an embeddable catalogue entry start its player immediately.
- Simplified the schema v2 catalogue by removing inactive `short_name`,
  `display_mode`, and `metadata_level` fields.
- Made deep browser validation require explicit input and output report paths,
  preventing a fresh run from overwriting historical evidence.
- Refined the catalogue table, sorting, compact stream detail panel, and link
  labels for supporting source evidence.
- Recorded the opt-out playback posture and source-specific reuse evidence more
  clearly in the catalogue and documentation.
- Replaced simulated table rows with a native list of buttons, preserved focus
  during selection, and added keyboard focus management for the mobile detail
  sheet.
- Marked untranslated source and legal fields with their recorded language and
  strengthened control borders, focus indicators, and reduced-motion behavior.
- Advanced the catalogue to schema v4 with explicit provider, playlist,
  live-page, and qualification metadata for official embeds.
- Renamed the working roadmap to `PLANS.md` and the research log to `NOTES.md`.
- Replaced browser-side EPG retrieval with same-origin static schedule JSON
  generated during the Pages deployment.
- Clarified that Python and `uv` own catalogue management and verification,
  while Node and npm provide HTML, browser, and accessibility development
  checks and are not part of the deployed site's runtime.
- Promoted Mongolia Parliament TV to technically validated after its live DASH
  manifest, initialization object, and current media segment all responded.
- Made schedule collection tolerant of individual source errors while blocking
  deployment when no source succeeds.
- Added official schedule and agenda surfaces to previously undocumented
  national sources and replaced Prince Edward Island's stale month-specific
  calendar URL with its stable calendar route.

### Fixed

- Aligned the repository description, website, topics, and README branding with
  the Parliament Streams public catalogue.
- Installed `uv` in CI so Makefile verification commands use the same locked
  environment as local development and Dependabot checks.
- Applied the current tested Ruff and GitHub Actions dependency updates in one
  consolidated maintenance change.
- Switched Python dependency updates from Dependabot's `pip` integration to its
  native `uv` integration so `pyproject.toml` and `uv.lock` remain synchronized.
- Verified the catalogue manager and scrapers with mypy 2.3.1 and Ruff 0.16.3.
- Restored the jurisdiction, format, and use-guidance filters at desktop widths
  while keeping them in a collapsible control on mobile.
- Made `site/index.html` load the complete catalogue when opened directly as a
  local file, with a generated data snapshot kept in sync by CI.
- Removed an unused catalogue-filter helper and obsolete multilingual
  translation keys.
- Standardized row alignment, outbound-link treatment, terminology tooltips,
  and source-evidence labels in the public catalogue.
- Removed internal scraper implementation status from the public EPG display.
- Removed invalid and unsupported ARIA attributes from catalogue controls and
  restored focus to the selected source when the mobile detail sheet closes.
- Replaced YouTube Error 153 in direct-file previews with an explicit HTTP
  preview/public-catalogue fallback; hosted and local-server embeds are unchanged.
- Added a favicon-specific crop with a full very-dark-green background that
  fills the browser icon canvas while preserving the original recovered mark
  for the site header.
- Added compact Wikidata and IPU Parline identity links to each public stream
  detail view without importing unrelated external political datasets.
- Extended the resizable source-detail bottom sheet through tablet and narrow
  desktop widths, eliminating the easy-to-miss detail card below the catalogue.
- Raised Python catalogue-management coverage to 95% overall branch coverage
  while retaining the enforced 90% CI floor.
- Made the Python health checker record remote HTTP disconnects as per-source
  failures instead of aborting the complete validation run.

## 2026-08-14

### Added

- Refreshed Tier 1 and Tier 2 national validation, supranational research, and
  non-US sub-national research reports.
- Added Nunavut as a validated direct-HLS catalogue source.

### Changed

- Updated catalogue entries, provenance, permission notes, documentation, and
  browser validation tooling following the refresh.

## 2026-07-29

### Added

- Repeatable Python health-check tooling and dated live validation reports.
- Democracy Tier 1, Tier 2, and Tier 3 discovery reports.
- Browser/player validation for sources that expose manifests only after
  JavaScript loads.

### Changed

- Expanded the catalogue schema, data-contract tests, contributor guidance,
  source-rights evidence, and research documentation.

## 2026-06-19

### Added

- Canonical JSON catalogue, schema, Python schedule parsers, data-contract
  tests, and source-rights documentation.
- CI validation with Ruff, JSON checks, compilation, and unit tests.

### Changed

- Converted the repository from an Apple-platform application to a public
  parliamentary-stream documentation and data project.

### Removed

- Active SwiftUI, Xcode, TestFlight, and Apple-platform release material from
  the working tree. The previous application remains in Git history.
