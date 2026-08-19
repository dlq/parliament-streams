# Parliament Streams Plans

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
  entries with jurisdiction, language, attribution, availability, EPG sources,
  permission status, and media-accessibility evidence.
- Python scraper modules exist for CPAC, Quebec webdiffusion, Ontario calendar,
  New Zealand calendar, Brazil TV Camara, European Parliament webstreaming, and
  Europe by Satellite schedule sources.
- A typed collector fetches implemented schedule sources and GitHub Actions
  publishes normalized static schedule JSON every six hours.
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
- Scottish Parliament TV, Senedd TV, and Northern Ireland Assembly TV are now
  represented as official-page and schedule entries; direct playback remains
  intentionally disabled without a documented supported route.
- CI and `make verify` validate JSON plus catalogue/candidate rules, check
  generated site data, enforce Ruff formatting and linting, run strict mypy and
  branch coverage, validate HTML, and exercise desktop/mobile accessibility
  with Axe and Playwright.
- `site/` provides a build-free GitHub Pages catalogue driven by the canonical
  JSON data, with client-side playback for eligible validated direct endpoints
  and official provider embeds.
- The 2026-08-15 catalogue/review reports record the latest validation pass.
- Schema v5 records Wikidata QIDs for all catalogue institutions and IPU
  Parline country, parliament, and chamber codes for applicable national bodies,
  with dated identity-source provenance and public detail links.
- A strictly typed Python management CLI now owns candidate intake, schema and
  cross-record validation, atomic catalogue mutations, generated site-data
  refreshes, validation seeds, identity audits, health-report comparison, and
  CSV export.
- A schema-validated Tier 1/Tier 2 discovery watchlist now drives a monthly
  static and Chromium audit. It reports uncatalogued validated manifests for
  review in a persistent GitHub issue without making automatic catalogue or
  rights decisions. Daily always-on stream regressions use separate deduplicated
  issues that close on recorded recovery.
- Canada federal ParlVU and Senate SenVu are now represented as official
  event-platform link-out records. The public Harmony landing pages have an
  implemented upcoming-event scraper; the undocumented API and direct stream
  manifests remain research items.
- Schema v7 separates coarse `source_type` from precise `source_kind`, and adds
  `stability_risk` so technical playback, provenance, drift risk, and rights
  posture are no longer collapsed into one field.
- Stability risk is now included in health reports and used by the daily
  stable-stream regression gate; high-risk always-on sources are still audited
  but do not drive the low-noise regression issue workflow.
- UK Parliament schedule metadata is implemented through the official What's on
  Calendar API. Parliamentlive.tv playback and Red Bee stream access remain
  separate research questions.
- The local candidate directory has no unresolved candidates as of 2026-08-19;
  the two retained candidate files are promoted Netherlands records. The stale
  Brazil stable-stream regression issue was closed after Brazil was demoted to
  official link-out.
- `data/fallbacks.json` now records official event, player, broadcaster, and
  provider fallback surfaces separately from permanent channel records. The
  public site renders related fallbacks in source details and exposes a compact
  fallback directory for records that do not yet map to a channel.

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
4. Revisit first-party versus official-vendor classifications during future
   source reviews and tighten any conservative defaults.
5. Use `stability_risk` in automated audit prioritization and in any future
   reviewer queues.
6. Make the schema distinguish source discovery from permission status, because
   a stream can be technically reachable but unsuitable for redistribution.
7. Expand event resolver behavior for `data/fallbacks.json`: ParlVU and SenVu
   can already use collected Harmony schedule metadata, while HouseLive,
   C-SPAN, Parliamentlive.tv, and official YouTube live pages still need stable
   event identifiers, now/next semantics, and rights-aware display rules before
   they can show resolved events instead of static fallback links. Promote a
   fallback into `data/channels.json` only when it has a stable channel identity
   and a supportable playback or link-out posture.
8. Decide whether supranational institutions need a separate `entity_type` or
   `institution_family` field, because they are not country-level legislatures.
9. Define separate expansion criteria for sub-national institutions before
   adding official-page/link-out entries beyond the current curated set.
10. Evaluate GovDirectory as a discovery and deduplication aid for official
    websites and social channels. Keep it separate from stream, schedule, and
    rights authority, as with the completed Wikidata integration.
11. Canada federal ParlVU/SenVu has been added to the catalogue as official
    event-platform link-out entries. Keep it separate from CPAC because CPAC is a
    broadcaster/channel partner, while Harmony is the closer official House and
    Senate proceedings surface. Landing-page upcoming-event scraping is
    implemented; next work is active-event playback validation, archive/event
    enrichment, and confirming whether the undocumented API has a stable
    supported access pattern.

The 2026-08-16 sub-national promotion pass completed the previous strong-candidate
list. It added 18 official-player and schedule records across Canada, Australia,
Germany, and Spain, plus Jalisco's officially attributable direct HLS channel.
The official-player records remain link-out entries unless a stable direct feed
and suitable playback posture are both documented.

Remaining sub-national candidates:

1. Keep Colima separate as a legislature-adjacent regional broadcaster unless
   stronger evidence establishes a parliamentary channel relationship.
2. Revisit official-player records during active sittings for stable manifests,
   especially Baden-Wurttemberg and the Spanish autonomous parliaments. Do not
   promote event-specific or off-air endpoints as permanent feeds.
3. Expand beyond the current Canadian, Australian, German, Spanish, Mexican,
   and UK clusters only with an official live/archive page, a schedule surface,
   a stable institutional identity, and a source-specific rights note.

### Tier 3 Expansion

Prepare for hybrid-regime coverage now, but keep Tier 1 and Tier 2 as the
active discovery priority. As of 2026-08-17, national-level catalogue coverage
is 16 of 25 Tier 1 countries (64%) and 9 of 46 Tier 2 countries (19.6%). The
previous lightweight pass across the 32 Tier 3 countries produced one strong
official direct-HLS result, El Salvador, so a deep Tier 3 pass is currently
likely to yield less than closing the remaining Tier 1 gaps and reviewing the
Tier 1/Tier 2 candidate queue.

Staged approach:

1. Keep the Tier 1/Tier 2 candidate queue clear. As of 2026-08-19 there is no
   open candidate-review GitHub issue and no unresolved local candidate file;
   next discovery work should focus on the nine Tier 1 countries without a
   national-level catalogue entry.
2. Improve official-player, event-based, and supported YouTube discovery before
   relying on direct-manifest discovery in lower-yield countries.
3. Add a canonical, schema-validated Tier 3 discovery watchlist without treating
   its contents as approved catalogue records.
4. Run Tier 3 discovery quarterly at first and maintain its findings in a
   separate, deduplicated GitHub issue.
5. Promote a Tier 3 source whenever official provenance, institutional identity,
   technical behavior, schedule semantics, and source-specific rights evidence
   are adequately documented; do not wait for a tier-wide review cycle.
6. Consider moving Tier 3 discovery to the monthly workflow when Tier 1 national
   coverage reaches about 80% and the Tier 1/Tier 2 candidate queue is routinely
   small enough to review.

Democracy tiers are a research-prioritization device, not an inclusion rule.
Recording a legislature or stream documents public access and does not endorse
the government or its democratic status.

Later:

1. Publish periodic validation reports without republishing external content.

## Scraper Work

The Python scrapers should stay narrow and auditable. They parse supplied
HTML/JSON; the shared collector owns explicit network requests, retries,
timestamps, failure records, and static JSON output.

Near-term:

1. Add Python catalogue commands for adding and replacing schedule endpoints
   without hand-editing complete channel records. Endpoint checking is now
   available through `parliament-streams epg-audit`.
2. Add parser result examples under `examples/`.
3. Expand fixture coverage as official source markup and response formats
   change.

Candidate future scrapers:

1. UN Web TV schedule/event pages.
2. Council of the European Union live schedule.
3. Council of Europe/PACE live and multimedia resources.
4. Spain Congreso/Canal Parlamento programming.
5. Netherlands, France, Denmark, Greece, Luxembourg, Norway, Estonia, Chile,
   Israel, El Salvador, Mauritius, India, Thailand, Slovakia, Nunavut,
   and other second-ring sources when structured official endpoints are found.
6. Canada federal ParlVU/SenVu deeper metadata for House, Senate, and committee
   proceedings, including active-event state, audio-language, closed-caption,
   archive, and `PowerBrowserV2` event links where available.
7. Canadian provincial/territorial schedule surfaces for Nunavut, BC, Alberta,
   Saskatchewan, Manitoba, PEI, NWT, and Newfoundland and Labrador if the
   catalogue starts expanding beyond national/supranational coverage.

Future country-specific API integrations:

- Keep a watchlist of country-specific parliamentary APIs and civic-tech
  archive/search APIs that may enrich catalogue entries with event, archive,
  speech, transcript, committee, or official-video links. Possible examples
  include Open Parliament TV for Germany/Bundestag archive search, UK
  Parliament APIs, Congress.gov committee/video metadata, Canadian ParlVU, and
  comparable official APIs discovered later.
- Treat these integrations as enrichment and provenance sources, not as
  replacements for stream validation, schedule-source review, or rights review.
- Add source-specific adapters only when the API has stable identifiers,
  documented access rules, and a clear mapping to an existing catalogue entry or
  future event/archive dataset.

### Scheduled EPG Publication

GitHub Actions collects implemented schedule sources every six hours and
publishes `data/schedules.json` inside the Pages artifact. This avoids browser
CORS restrictions without adding a continuously running backend or committing
transient schedule data to `main`. The page reads only the same-origin snapshot.

### Scheduled Catalogue Audits

GitHub Actions audits the complete catalogue daily. The retained artifact
contains structural and identity validation, every primary playback or official
URL, every schedule endpoint and implemented parser, and all unique official,
rights, identity, and embed links. A Sunday Chromium pass loads every official
page and validates dynamically discovered HLS/DASH manifests. Only newly
degraded `always_on` sources fail the routine audit; event-based results remain
evidence for review without producing expected out-of-session failures.

The European Parliament Next.js endpoint contains a deployment-specific build
ID and needs periodic maintenance. New Zealand currently returns Radware bot
protection to the Python client in some environments; the collector records
that as an error and the page falls back to the catalogue record. Future
collectors should preserve this partial-success behavior and must not turn
blocked responses into empty schedules.

The 2026-08-17 EPG review added Italy's dated WebTV JSON API and Portugal's
official open-data agenda resolver. It also recorded official schedule or
agenda surfaces for Denmark, the Netherlands, Spain Canal Parlamento, France,
Greece, Luxembourg, India, Slovakia, the UK, Australia, and Costa Rica. No
current schedule source was confirmed for Thailand Parliament TV, Mongolia
Parliament TV, or Taiwan Parliamentary TV; those three remain explicit research
gaps rather than links to stale or generic pages.

### Deferred Locale Work

The explicitly named catalogue languages currently expose these interface
locale gaps:

1. Add Welsh (`cy`) for Senedd TV.
2. Add Catalan (`ca`) for Catalonia Canal Parlament.
3. Add Basque (`eu`) for Navarre Parliament Live.
4. Add a Valencian locale (`ca-ES-valencia`) for Valencia Canal Corts, sharing
   Catalan strings only where that is linguistically and institutionally
   appropriate.
5. Add Scottish Gaelic (`gd`) for Scottish Parliament TV. Do not reuse the
   existing Irish (`ga`) locale; they are distinct languages.
6. Add European Portuguese (`pt-PT`) for Portugal ARTV while retaining
   Brazilian Portuguese (`pt-BR`) for Brazil TV Camara.
7. Add Traditional Chinese (`zh-Hant`) for Taiwan Parliamentary TV while
   retaining Simplified Chinese (`zh-Hans`).
8. Confirm whether the Stortinget record should say Norwegian Bokmal (`nb`) or
   whether Nynorsk (`nn`) also needs interface coverage.

Before adding Mongolian (`mn`) or Hebrew (`he`) as selectable site locales,
review their catalogue scan order, label lengths, sorting, and the compact
detail grid at desktop and mobile widths. Hebrew requires a deliberate
right-to-left layout pass, including column alignment, icon/flag placement,
punctuation, external-link markers, and player controls. Mongolian requires an
explicit decision about Cyrillic versus traditional Mongolian script and its
layout implications. Do not expose either locale merely because the catalogue
records content in that language.

Replace the free-form channel `language` string with structured language codes
and display labels so locale coverage can be checked automatically. Expand the
six `Multilingual` supranational records and the Northwest Territories
`Multiple official languages` record into evidence-backed language lists; the
current generic labels prevent a complete coverage audit.

## Future Site/Product Review

The current static site is intentionally a public research catalogue rather
than a consumer streaming app. Keep the evidence-forward design, but revisit
whether the product framing is missing a stronger organizing idea after the
catalogue stabilizes further.

Later review prompts:

1. Strengthen the first impression if the current hero does not explain quickly
   enough why open parliamentary video access matters.
2. Make the distinction between playable sources, official-player/link-out
   sources, and research-only sources more obvious without overstating rights.
3. Clarify the trust and verification story: what was checked, when, by which
   method, and what remains uncertain.
4. Consider a coverage map or regional coverage view if the source list becomes
   too abstract for readers.
5. Add a stronger schedule or "now live / upcoming" surface if collected EPG
   snapshots become reliable enough.
6. Give the open-stream principles and advocacy angle a more prominent path if
   the project becomes useful for outreach to legislatures or vendors.
7. Explore browsing by legislature/institution rather than only by stream,
   especially once external identity links and chamber mappings are stable.

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
6. Keep YouTube sources compliant-embed only; do not extract YouTube manifests.
   The current permanent uploads playlists are useful fallbacks but are not
   guaranteed live-only feeds. Consider a scheduled catalogue refresh that
   records current or upcoming official video IDs without exposing an API key.
7. Replace the current `unknown` accessibility states with cited evidence for
   captions and caption languages, sign-language interpretation, and audio
   description. Do not equate missing evidence with confirmed unavailability.

Current measurable review queues as of 2026-08-19:

- 42 of 86 catalogue entries still use a permission status ending in
  `pending_review`. Prioritize common service families once, then apply the
  same evidence consistently to their related channel records.
  Breakdown: 22 official-vendor HLS, 14 official pages, 5 first-party HLS, and
  1 DASH research record.
- All 86 entries retain at least one `unknown` media-accessibility field. Start
  with sources that publish caption or interpretation documentation, and keep
  unsupported fields `unknown` rather than inferring `unavailable`.
  Breakdown: 37 national, 43 sub-national, and 6 supranational entries.
- Track these as two persistent GitHub research issues rather than opening one
  issue per stream. Update their counts after catalogue promotions and close
  them only when the underlying evidence gaps are actually resolved.
  Current queues: [rights evidence](https://github.com/dlq/parliament-streams/issues/13)
  and [media accessibility evidence](https://github.com/dlq/parliament-streams/issues/14).
  Current triage snapshot:
  [reports/review-queues-2026-08-19.json](reports/review-queues-2026-08-19.json).

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
