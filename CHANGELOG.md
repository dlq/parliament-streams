# Changelog

All notable changes to the documentation and data project are recorded here.
This changelog begins with the 2026-06-19 conversion from the retired SwiftUI
application. Earlier application work remains available in Git history.

## Unreleased - 2026-08-19

### Added

- Canada House of Commons ParlVU and Canada Senate SenVu as official
  event-platform link-out catalogue records, while deliberately avoiding
  unvalidated direct-HLS claims.
- A Canada Harmony schedule scraper that extracts upcoming-event metadata from
  the public ParlVU and SenVu landing pages while leaving the unstable
  undocumented API as planned research.
- Schema v7 source classification fields: precise `source_kind` values for
  first-party HLS, official-vendor HLS, DASH research, YouTube embeds, and
  official pages, plus `stability_risk` for drift/review risk.
- Stability-risk-aware health reports and stable-stream regression automation,
  so high-risk always-on sources remain audited without driving noisy regression
  issues.
- A UK Parliament What's on Calendar API schedule scraper for public chamber,
  Westminster Hall, Grand Committee, and oral-evidence events.
- A public architecture guide explaining source-of-truth files, generated
  artifacts, runtime shape, source types, maintenance flow, schedule scrapers,
  and validation entry points.
- A README start-here section and workflow badges so GitHub visitors can quickly
  understand the project shape and current automation health.
- A catalogue-maintenance "Which file should I edit?" guide and clearer
  contribution review gates for official provenance, technical stability,
  metadata/accessibility, and rights.
- A 1200 x 630 Open Graph and social-preview image, with explicit canonical,
  Open Graph, and Twitter metadata for GitHub Pages shares.
- Promoted official Tweede Kamer Aletta Jacobszaal and Actualiteitenkanaal HLS
  records after fresh master and child-playlist validation.
- Durable discovery-review decisions for third-party, out-of-scope, insecure,
  and event-specific manifests so monthly audits do not reopen settled leads.
- Tests for discovery-decision handling and bot-protection response detection.
- A schema-validated `data/fallbacks.json` dataset, CLI validation command,
  GitHub Pages publication, and public fallback directory for official
  event/player/provider surfaces such as ParlVU, SenVu, Parliamentlive.tv,
  C-SPAN, and HouseLive.
- A focused rights/accessibility review pass that moved France National
  Assembly to conditional-reuse status and added current Knesset, Sansad TV,
  and TPchannel evidence without overclaiming reuse permission.
- A short public rights summary plus ready-to-send written-clarification batches
  for the remaining ambiguous native-playback and official-page sources.
- Schema v8 validation-history references, a CLI refresh command, and public
  source-detail links to retained health reports for channels with dated
  validation evidence.
- Schema v9 `playback_policy`, separating the catalogue's playback presentation
  from rights/permission evidence.
- Make targets and `--check` support for validation-history refreshes, so
  retained report-link drift is caught by `make verify`.
- Source-row posture labels for playable, link-out, fallback, and research
  records, plus fallback now/next hints sourced from already-collected schedule
  metadata.
- Optional schedule event URL, ID, language, status, and location fields, with
  Harmony parsing and public fallback rendering for official ParlVU/SenVu event
  links.
- Official House ParlVU and Senate SenVu recordings fallbacks, kept link-out
  while archive-event metadata and playback rights remain unresolved.
- A conservative official YouTube live-page resolver for the UK, Australia, and
  Costa Rica records. It records a current provider watch video only when the
  official `/live` page exposes explicit watch metadata; otherwise it leaves the
  source on the existing uploads-playlist embed.
- Ontario source-family accessibility evidence across its six feeds, including
  documented English captions and source-dependent sign-language treatment while
  keeping full-stream reuse permission conservative.

- Canonical Tier 1 and Tier 2 discovery target data plus a monthly GitHub
  Actions audit that performs static and Chromium source discovery, compares
  validated manifests with the catalogue, and retains review evidence for 90
  days without automatically promoting sources. The workflow maintains a
  persistent candidate-review issue, while daily always-on regressions receive
  deduplicated issues that close on recovery. Deep browser validation uses four
  isolated concurrent page contexts to keep broad audits within job limits;
  findings suppress child playlists of catalogued masters and malformed or VOD
  URLs that are not new live-channel candidates.
- A daily GitHub Actions catalogue audit covering schema and identity rules,
  primary stream/page health, schedule endpoints and parsers, and supporting
  official, rights, identity, and embed links, plus a weekly full-catalogue
  Chromium manifest-discovery pass and stable-stream regression tracking.
- A typed, parallel `links-audit` Python command with deduplicated URL roles,
  HTTP classifications, CLI output, and tests.
- A public-domain 1890 House of Commons chamber photograph as the responsive
  catalogue hero, with visible credit and repository attribution.
- A data-derived catalogue coverage summary, per-source evidence dates, and a
  five-part open-stream principles index.

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

- Removed the redundant public "How to read this catalogue" section and its
  obsolete localization and accessibility-test hooks.
- Recorded Tier 3 expansion criteria as future planning only; no Tier 3
  discovery targets or automation have been implemented.

- Migrated the catalogue to schema v6: renamed the misleading
  `attribution_text` field to `provenance_note`, removed obsolete static
  `program` placeholders now superseded by generated schedule snapshots, and
  represented absent accessibility notes as null instead of repeated prose.
- Made public-page playback reject insecure HTTP manifests when served over
  HTTPS, count only implemented schedule collectors in the coverage summary,
  and localize the newer sub-national jurisdiction names in major translated
  interfaces.
- Linked the selected catalogue row and evidence panel with a shared visual
  marker, and localized the new research-interface labels in every supported
  language.
- Localized generated detail-card headings, accessibility states, schedule
  link categories, and evidence-link labels while preserving catalogue notes
  and source-authored text in their recorded language.
- Removed the redundant attribution row and generic accessibility fallback
  note, limited Now/Next display to collected schedule snapshots, and localized
  the catalogue's generated playback-policy recommendations. Rights paragraphs
  are now identified as catalogue summaries rather than implied quotations.
- In non-English views, kept localized evidence links and generated guidance
  visible while moving English catalogue-authored rights and recommendation
  prose into a clearly labelled, collapsed research-notes disclosure. Also
  suppressed source-dependent accessibility notes that repeated the statuses
  immediately above them.
- Replaced Quebec's two machine-only POST schedule API links in the public card
  with one usable link to the Assembly's webcast page; both live and upcoming
  API records remain available to the Python schedule collector.
- Completed an interface-localization contract for every supported locale,
  including filters, errors, sorting announcements, player failures, mobile
  controls, and assistive descriptions; automated browser checks now reject
  missing messages or status labels in any locale.
- Kept source-authored and catalogue research prose in its recorded language
  while moving useful English accessibility notes into the explicitly labelled
  research disclosure on non-English pages. Corrected the accented official
  name `Assemblée nationale du Québec` across all 14 Quebec channel records and
  added consistency checks for repeated service families and source statuses.
- Corrected the Council of Europe / PACE official-page record from the
  misleading `needs_review` access status to `link_only`; no direct playback
  endpoint is currently recorded for that source.
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

- Demoted Brazil TV Camara from native direct-HLS playback to official-page
  link-out after the official page's embedded HLS manifest began returning HTTP
  404, matching the scheduled stable-stream regression audit.
- The accessibility/browser site check now derives expected catalogue metrics
  from `data/channels.json` instead of hard-coding counts that drift when new
  sources are added.
- Replaced an ambiguous bot-protection substring check with an explicit
  response-body pattern, resolving the CodeQL URL-sanitization finding without
  weakening the New Zealand schedule parser.
- Made health-check retries cover transient HTTP 4xx responses as well as
  disconnects and server errors, avoiding false stable-stream regressions when
  a CDN briefly redirects a valid manifest to an unavailable edge.

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
