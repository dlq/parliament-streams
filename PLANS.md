# Parliaments Plans

This is the live plan for Parliaments as a documentation and data project. The
current repository should be optimized for public research, source provenance,
machine-readable catalogue data, and reproducible schedule-scraper notes.

## Current Goal

Maintain a public informational repository that documents:

- direct HLS parliamentary video endpoints found from official or
  official-vendor sources;
- official YouTube and official-page alternatives where direct stream reuse is
  not appropriate;
- schedule/EPG surfaces and Python parsers for sources already understood;
- permission, terms, and redistribution evidence for every source;
- research notes that explain how each source was discovered and where the
  openness gaps remain.

This is not a rebroadcast service and not an endorsed source directory.

## Current State

Done:

- `data/channels.json` is the canonical catalogue.
- The catalogue records HLS, YouTube, official-page, and legacy DASH research
  entries with jurisdiction, language, attribution, availability, metadata
  level, EPG sources, and permission status.
- Python scraper modules exist for CPAC, Quebec webdiffusion, Ontario calendar,
  New Zealand calendar, and Brazil TV Camara weekly schedule sources.
- `docs/source-rights-and-permissions.md` records source-by-source rights evidence
  and recommendations.
- `docs/sources-and-provenance.md` explains repository license scope and
  external-source limitations.
- `NOTES.md` remains the working evidence log for stream discovery.
- Democracy-priority Tier 1, Tier 2, and Tier 3 stream checks were refreshed on
  2026-07-29, with detailed JSON reports under `reports/health/`.
- A deeper browser/player validation pass for Tier 1 and Tier 2 official pages
  now exists in `tools/deep_validate_browser.mjs`.
- Catalogue health plus Tier 1/Tier 2 national-level validation was refreshed
  again on 2026-08-14.
- A supranational EU/UN-adjacent pass added official-page and schedule targets
  for European Parliament, EU Council/EBS, UN Web TV, Council of Europe/PACE,
  and OSCE.
- A non-US sub-national pass refreshed Canadian, UK devolved, Australian,
  German, Spanish, and Mexican regional legislature targets on 2026-08-14;
  Nunavut is now the only new validated direct-HLS catalogue promotion from
  that pass.
- CI and `make verify` now validate JSON, compile Python modules, and run the
  contract tests.
- `site/` provides a build-free GitHub Pages catalogue driven by the canonical
  JSON data, with client-side playback only for eligible validated endpoints.
- The 2026-08-15 catalogue/review reports record the latest validation pass.

Retired from the active project:

- SwiftUI app source.
- Xcode project files.
- Apple-platform build/test/release workflow.
- App-release checklist.

## Catalogue Work

Near-term:

1. Normalize validation history so dated health reports can be linked from
   catalogue entries without copying transient HTTP details into every channel.
2. Split repeated permission summaries into a normalized `data/permissions.json`
   only if the inline channel entries become hard to review.
3. Complete schema coverage for validation history and generated reports beyond
   the existing channel, permission, and EPG definitions.
4. Distinguish first-party, official-vendor, platform, and third-party relay
   endpoints explicitly.
5. Add a source freshness field for URLs that are likely to drift.
6. Make the schema distinguish source discovery from permission status, because
   a stream can be technically reachable but unsuitable for redistribution.
7. Decide whether event-specific findings such as HouseLive/C-SPAN should live
   in a separate events/fallback dataset instead of the channel catalogue.
8. Decide whether supranational institutions need a separate `entity_type` or
   `institution_family` field, because they are not country-level legislatures.
9. Decide whether sub-national institutions should get separate expansion
   criteria before adding many official-page/link-out entries.

Later:

1. Publish periodic validation reports without republishing external content.
2. Add CSV exports for source, endpoint, permission, and EPG inventories.

## Scraper Work

The Python scrapers should stay narrow and auditable. They parse supplied
HTML/JSON; network fetches should be explicit in future collection scripts so
the repo can record what was fetched and when.

Near-term:

1. Add fixture-based parser tests for each current scraper.
2. Add a `scripts/fetch_epg.py` command that downloads official schedule pages
   into timestamped local artifacts outside the tracked baseline.
3. Add parser result examples under `examples/` once fixtures exist.
4. Document required request headers and POST bodies beside each scraper.

Candidate future scrapers:

1. UK Parliamentlive guide/day/info surfaces.
2. European Parliament Multimedia Centre REST calls.
3. UN Web TV schedule/event pages.
4. Council of the European Union live schedule.
5. Council of Europe/PACE live and multimedia resources.
6. Portugal ARTV agenda.
7. Spain Congreso/Canal Parlamento programming.
8. Netherlands, France, Denmark, Greece, Luxembourg, Norway, Estonia, Chile,
   Israel, El Salvador, Mauritius, Italy, India, Thailand, Slovakia, Nunavut,
   and other second-ring sources when structured official endpoints are found.
9. Canadian provincial/territorial schedule surfaces for Nunavut, BC, Alberta,
   Saskatchewan, Manitoba, PEI, NWT, and Newfoundland and Labrador if the
   catalogue starts expanding beyond national/supranational coverage.

### Browser-Side EPG Enrichment

Browser-side schedule fetching is not a general replacement for the Python
scrapers. A 2026-08-15 CORS check of the 23 unique recorded EPG URLs found only
two sources that return `Access-Control-Allow-Origin: *`:

- EU Audiovisual Service / EBS: `https://audiovisual.ec.europa.eu/en`
- European Parliament Multimedia Centre:
  `https://multimedia.europarl.europa.eu/en/webstreaming`

Neither surface has yet been validated as a stable, parseable browser-side EPG
feed. The other 21 sources do not currently permit browser cross-origin reads,
even where their pages are publicly reachable. Any future in-page enrichment
must be optional and limited to sources that explicitly allow it; collected
Python inputs and generated catalogue data remain the canonical approach.

### Deferred Locale Work

Before adding Mongolian or Hebrew as selectable site locales, review their
catalogue scan order, label lengths, sorting, and the compact detail grid at
desktop and mobile widths. Hebrew also requires a deliberate right-to-left
layout pass, including column alignment, icon/flag placement, punctuation,
external-link markers, and player controls. Do not expose either locale merely
because the catalogue records content in that language.

## Rights And Permission Work

Near-term:

1. Keep `docs/source-rights-and-permissions.md` as the evidence-backed matrix for
   source terms and permission status.
2. Prioritize rights review for newly added official-page/player discoveries:
   Norway, Estonia, Chile, Israel, El Salvador, Germany, European Parliament,
   UN Web TV, Council of the European Union, Council of Europe/PACE, OSCE, and
   Nunavut.
3. Add a short public-facing `docs/rights-summary.md` if the detailed matrix
   becomes too long for readers who only need the current posture.
4. Record written permission requests and responses as summarized evidence, not
   raw private correspondence.
5. Keep CPAC marked `no_third_party_reuse` unless written consent is obtained.
6. Keep YouTube sources link-out or compliant-embed only; do not extract
   YouTube manifests.

## Research And Advocacy

The project should help show what makes parliamentary video reusable and
discoverable without overclaiming rights.

Useful advocacy asks:

- stable HLS or documented embed routes;
- JSON schedule APIs;
- stable event IDs;
- now/next signals;
- timezone data;
- chamber and room labels;
- captions and audio-language metadata;
- plain-language reuse terms;
- CORS/browser compatibility;
- explicit off-air and no-signal status.

Detailed discovery history belongs in `NOTES.md`; action-oriented next steps
belong here.
