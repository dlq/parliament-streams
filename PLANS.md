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
  publishes normalized static schedule JSON every six hours. Schedule schema v3
  retains rolling event lists, canonical UTC timestamps, generated or official
  event IDs, event completeness metrics, source coverage windows, and a bounded
  stale fallback for still-future events.
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
- The 2026-08-24 channel-information and EPG reports record the latest complete
  catalogue metadata and schedule-source audits.
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
  event-platform and official-archive link-out records. The public Harmony
  landing pages have an implemented upcoming-event scraper that can expose
  official event links, event IDs, language state, status labels, and
  chamber/room labels when present. The undocumented API, archive-event
  enrichment, and direct stream manifests remain research items.
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
  public site renders related fallbacks in source details; standalone records
  remain available in the machine-readable dataset until they map to channels.
- Schema v8 adds compact per-entry validation history. All 100 catalogue entries
  now link to retained dated health reports, and the public site surfaces the
  latest retained check in the source detail panel.
- Validation-history refresh and drift checking are available through Make and
  the CLI; the drift check is part of `make verify`.
- The public site now labels each source row as playable, link-out, fallback, or
  research so users can distinguish technical playback from safer official
  routes more quickly.
- The public site exposes playback policy as its own filter and source-detail
  field, keeping technical presentation distinct from rights/use guidance.
- Fallback records now reuse the static schedule snapshot for related entries
  and can show linked current/next event titles, event IDs, status labels, and
  chamber/room labels beside official fallback links when that metadata is
  available.
- A schema-validated U.S. discovery inventory now records six federal
  candidates and official research roots for all 50 state legislatures. Nine
  states have verified official video surfaces and are prioritized for deep
  player, schedule, accessibility, and rights research.

Retired from the active project:

- SwiftUI app source.
- Xcode project files.
- Apple-platform build/test/release workflow.
- App-release checklist.

## Next Milestones

This section is the short execution plan. The detailed backlog below remains
the source of context and constraints, but new work should generally start here.

### 1. Rights Closure Pass

Goal: reduce the remaining pending-rights queue while preserving the current
proof-of-concept rule that technically public HLS may remain playable unless
recorded source terms require link-out.

Current queue: 38 of 100 catalogue entries use a permission status ending in
`pending_review`. Ten are newly added U.S. official-page records awaiting a
source-specific terms review; the previous 28-entry queue retains its dated
classification.

Priority order:

1. The 18 pending `official_vendor_hls` entries were reviewed as source
   families on 2026-08-19. No public terms closed third-party native playback,
   so they remain pending and should move to the deferred communications /
   written-clarification package rather than repeated public-terms searching.
2. The 5 pending `first_party_hls` entries were reviewed as source families on
   2026-08-19. No public terms closed third-party native playback. Netherlands
   Tweede Kamer should move to written clarification; Thailand TPchannel and
   El Salvador Legislative Assembly remain pending after dated public-terms
   searches.
3. The 6 pending `official_page` entries were reviewed on 2026-08-19. Brazil
   TV Camara and Manitoba House Broadcasts moved to
   `explicit_reuse_with_conditions` for link-out use. Council of Europe/PACE,
   Saskatchewan, Northwest Territories, and Navarre remain pending because
   public evidence does not clearly close video-specific third-party playback
   or redistribution.
4. The 1 pending `direct_dash_research` entry was reviewed on 2026-08-19.
   Mongolia Parliament TV remains research-only. The official Parliament
   live/session page is the safer user-facing route, while the SkyGo DASH
   manifest still lacks source-specific reuse permission and a supported web
   playback strategy.

Use [reports/review-queues-2026-08-19-rights-next.json](reports/review-queues-2026-08-19-rights-next.json)
as the historical starting queue. After the HLS and official-page review
snapshots, the remaining pending entries are 16 likely written-clarification
cases and 12 keep-pending-after-dated-search cases. No public-terms follow-up
entries remain.
The official-vendor HLS review snapshot is
[reports/review-queues-2026-08-19-official-vendor-hls.json](reports/review-queues-2026-08-19-official-vendor-hls.json).
The first-party HLS review snapshot is
[reports/review-queues-2026-08-19-first-party-hls.json](reports/review-queues-2026-08-19-first-party-hls.json).
The official-page review snapshot is
[reports/review-queues-2026-08-19-official-page.json](reports/review-queues-2026-08-19-official-page.json).
The direct-DASH research snapshot is
[reports/review-queues-2026-08-19-direct-dash-research.json](reports/review-queues-2026-08-19-direct-dash-research.json).
Draft request templates and public response-tracking rules live in
[docs/permission-requests.md](docs/permission-requests.md). A short
reader-facing explanation of the current posture lives in
[docs/rights-summary.md](docs/rights-summary.md).

Outreach is intentionally deferred for now. Keep permission-request drafts as
preparation, but do not send piecemeal messages until the project has a more
substantive communications package covering the public site, open-stream goals,
catalogue safeguards, attribution, rights handling, and specific source-owner
asks. That package should both ask questions that resolve catalogue
uncertainty and make an advocacy case for genuinely open parliamentary video:
documented streams, stable event identifiers, machine-readable schedules,
clear embed/reuse terms, accessibility metadata, and explicit distinctions
between "public", "technically reachable", "embeddable", "reusable", and
"open".

Specific unresolved direct-playback groups:

- Ontario and Nunavut iSi LIVE feeds: determine whether written clarification is
  needed for full live-stream reuse beyond non-commercial excerpts and official
  page linking.
- Estonia Riigikogu: look for source-specific reuse terms for the two official
  live rooms, or record that no terms were found after a dated pass.
- Netherlands Tweede Kamer: public guidance supports Debat Direct fragments and
  embeds for media/journalistic use, but not general public raw-HLS playback;
  move this to written clarification.
- India Sansad TV, Thailand TPchannel, Israel Knesset Channel, Spain Congreso,
  Portugal ARTV, Greece Hellenic Parliament TV, Luxembourg Chamber TV,
  Slovakia TV NRSR, Chile Camara TV, Jalisco Canal Parlamento, and El Salvador
  Legislative Assembly: keep each as a source-specific review rather than
  inferring permission from public HLS.
- Mongolia Parliament TV: keep the SkyGo DASH manifest research-only and prefer
  the official Parliament live/session page unless source ownership, reuse
  permission, and platform playback strategy are all documented.

Exit criteria:

- `docs/source-rights-and-permissions.md` explains every reviewed family.
- `docs/permission-requests.md` records any written-clarification outreach and
  public response summaries for source owners whose public terms remain
  ambiguous.
- `docs/rights-summary.md` stays short enough for contributors who need the
  current posture without reading the full evidence matrix.
- `data/channels.json` statuses change only when official evidence supports the
  change.
- `reports/review-queues-2026-08-19.json` or its successor records the updated
  counts and decisions.
- `make verify` passes.

### 2. Accessibility Evidence Pass

Goal: replace unknown accessibility fields with cited evidence where official
sources document captions, caption languages, sign-language interpretation, or
audio description.

Priority order:

1. Caption/sign-language evidence for national and high-priority sub-national
   entries that already publish accessibility or broadcast-access pages.
2. Caption-language evidence for multilingual supranational records and
   bilingual Canadian sources.
3. Audio-description review as its own long-tail queue; do not treat missing
   evidence as confirmed unavailability.

Exit criteria:

- Each changed `accessibility` field has an official evidence URL and a concise
  note.
- The accessibility issue and review-queue report have updated counts.
- `make verify` passes.

### 3. Event Resolver V2

Goal: make official fallback links more useful without pretending that
event-based pages are stable channel streams.

Priority order:

1. Finish ParlVU and SenVu archive-event enrichment. Harmony archive landing
   pages are now represented as official link-out fallbacks, and the
   upcoming-event scraper captures official event URLs, stable event IDs,
   language state, status labels, and committee/chamber room labels when
   present.
2. Official YouTube live-page resolution has a first implementation for the UK,
   Australia, and Costa Rica YouTube records. It checks official `/live` pages
   for explicit watch metadata and records current video IDs when present,
   without extracting YouTube manifests or requiring a public API key. Current
   static checks show these pages often render as channel tabs with no clear
   active event, so unresolved pages intentionally return empty.
3. HouseLive, C-SPAN, Parliamentlive.tv, and similar official event pages with
   stable identifiers and rights-aware display rules.

Exit criteria:

- Fallback records can show stable event identifiers or official active links
  when available.
- No event-specific or off-air manifest is promoted as a permanent channel.
- The public site clearly distinguishes channel playback, official link-out,
  fallback events, and research-only sources.

### 4. Catalogue Schema Cleanup

Goal: make the data model easier to maintain before expanding coverage.

Priority order:

1. Continue the schema v9 playback-policy cleanup. The catalogue now records
   `playback_policy` separately from `permission.status`, so "playable by
   project policy" is no longer inferred from rights evidence. A
   `playback-policy-audit` command now reports native-playback-with-pending-
   rights and retained-playback-URL/link-out tensions, and the public UI now
   exposes playback policy separately from use guidance. Next, decide whether
   source discovery state needs a similarly explicit field.
2. Replace free-form `language` values with structured language codes and
   display labels.
3. Add schema coverage for generated reports beyond the existing channel,
   fallback, validation-history, permission, and EPG definitions.
4. Consider normalizing repeated permission summaries into
   `data/permissions.json` only if inline review becomes noisy.

Exit criteria:

- Existing catalogue entries migrate through tooling, not broad hand edits.
- Site labels continue to make playback, link-out, fallback, and research
  posture obvious.
- `make verify` and generated site-data drift checks pass.

### 5. Coverage Expansion

Goal: add sources deliberately rather than growing a weak directory.

Priority order:

1. Close the remaining Tier 1 national gaps before broad Tier 3 work.
2. Add sub-national entries only when the institution has an official live or
   archive page, a stable identity, a schedule surface or event semantics, and a
   source-specific rights note.
3. Treat supranational bodies as their own family if the country-level schema
   starts to distort search, filters, or identity links.

Exit criteria:

- New sources start as candidates or fallbacks unless they have a stable channel
  identity and a supportable playback/link-out posture.
- Discovery reports and notes record unsuccessful searches, not only successes.

## Catalogue Work

Near-term:

1. Revisit first-party versus official-vendor classifications during future
   source reviews and tighten any conservative defaults.
2. Use `stability_risk` in automated audit prioritization and in any future
   reviewer queues.
3. Expand event resolver behavior for `data/fallbacks.json`: ParlVU and SenVu
   can now surface collected Harmony now/next metadata, official event links,
   event IDs, language state, status labels, and chamber/room labels beside
   fallback links, and House/Senate archive pages are present as official
   link-out fallbacks. Official YouTube live pages can now provide current
   video IDs when YouTube exposes explicit watch metadata, but they are not
   guaranteed live-only feeds. Archive-event enrichment, HouseLive, C-SPAN, and
   Parliamentlive.tv still need stable event identifiers and rights-aware
   display rules. Promote a fallback into
   `data/channels.json` only when it has a stable channel identity and a
   supportable playback or link-out posture.
4. Decide whether supranational institutions need a separate `entity_type` or
   `institution_family` field, because they are not country-level legislatures.
5. Define separate expansion criteria for sub-national institutions before
   adding official-page/link-out entries beyond the current curated set.
6. Evaluate GovDirectory as a discovery and deduplication aid for official
    websites and social channels. Keep it separate from stream, schedule, and
    rights authority, as with the completed Wikidata integration.
7. Canada federal ParlVU/SenVu has been added to the catalogue as official
    event-platform link-out entries. Keep it separate from CPAC because CPAC is a
    broadcaster/channel partner, while Harmony is the closer official House and
    Senate proceedings surface. Landing-page upcoming-event scraping now
    captures official event links, event IDs, language state, status, and room
    labels; archive landing pages are represented as official fallbacks. Next
    work is archive-event enrichment, active-event playback validation, and
    confirming whether the undocumented API has a stable supported access
    pattern.

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

### United States Expansion

The schema-validated
[`data/discovery/us-legislatures.json`](data/discovery/us-legislatures.json)
inventory records six federal candidates and all 50 state legislatures. The
dated review in
[`reports/us-federal-state-candidates-2026-08-24.md`](reports/us-federal-state-candidates-2026-08-24.md)
prioritized federal floor and committee services plus California, Florida,
Minnesota, New York, Oregon, Rhode Island, Texas, Utah, and Washington. Four
federal services and ten state/chamber services are now published as honest
official-page link-outs with identity, schedule, accessibility, rights, and
validation metadata.

Keep the unpromoted state roots as a candidate inventory until each has a
distinct current legislative video surface, stable institutional identity,
source-specific rights note, and either a supported playback route or an honest
official-page link-out. Research the District of Columbia and U.S. territorial
legislatures in separate passes rather than treating them as states.

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

1. Convert the newly recorded Taiwan IVOD forecast, Mongolian Parliament
   timetable, and Thai Parliament meeting schedule into normalized parsers.
2. Prefer structured official sources where available: France's open-data
   agenda ZIP, Brazil's Open Data events API, and the European Parliament Open
   Data meetings API.
3. Council of the European Union live schedule and meeting calendar.
4. Council of Europe/PACE live and multimedia resources.
5. Spain Congreso/Canal Parlamento programming, ideally mapping its shared
   schedule to all six recorded signals.
6. Netherlands room schedules, including the Aletta Jacobszaal and
   Actualiteitenkanaal records.
7. Scotland, Wales, and Northern Ireland schedule surfaces.
8. Denmark, Greece, Luxembourg, Norway, Estonia, Chile, Israel, El Salvador,
   Mauritius, India, Slovakia, Nunavut, and other second-ring sources. The
   2026-08-24 discovery report records direct programme/calendar candidates for
   several of these.
9. Canada federal ParlVU/SenVu deeper metadata for House, Senate, and committee
   proceedings, including active-event state, audio-language, closed-caption,
   archive, and `PowerBrowserV2` event links where available.
10. Canadian provincial/territorial schedule surfaces for Nunavut, BC, Alberta,
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
The workflow caches the preceding version 3 snapshot and may retain still-future
events for at most 24 hours when a source fails. Per-source consecutive failure
counts are also consumed by the daily audit, which opens a deduplicated issue
after three failed runs and closes it after recovery.

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

## Future UI/UX Review

The current static site is intentionally a public research catalogue rather
than a consumer streaming app. Keep the evidence-forward design, but revisit
whether the product framing is missing a stronger organizing idea after the
catalogue stabilizes further.

Defer a deliberate UI/UX review until after the next catalogue/data stability
round, rather than making piecemeal visual changes. Use that review to look at
the whole product shape: catalogue discovery, visual hierarchy, schedule
surfacing, global/regional navigation, and whether the site should start to feel
more like a channel guide without losing its evidence and rights posture.

Later review prompts:

1. Strengthen the first impression if the current hero does not explain quickly
   enough why open parliamentary video access matters.
2. Make the distinction between playable sources, official-player/link-out
   sources, and research-only sources more obvious without overstating rights.
3. Clarify the trust and verification story: what was checked, when, by which
   method, and what remains uncertain.
4. Consider a coverage map, regional coverage view, or map/list hybrid if the
   source list becomes too abstract for readers. Evaluate whether map browsing
   helps people understand jurisdiction coverage, sub-national clusters, and
   gaps, or whether it adds weight without improving discovery.
5. Extend the new Now / Next programme guide toward dated agenda browsing only
   when collectors provide normalized event timestamps and stable event IDs.
6. Give the open-stream principles and advocacy angle a more prominent path if
   the project becomes useful for outreach to legislatures or vendors.
7. Explore browsing by legislature/institution rather than only by stream,
   especially once external identity links and chamber mappings are stable.

### Schedule Page

The dedicated schedule page is now a peer to the catalogue and coverage map.
It uses the same static `data/schedules.json` snapshot that GitHub Actions
refreshes every six hours, with no backend or live cross-origin browser requests.

The first version now:

1. Presents a Now / Next television-listing view derived from canonical event
   records while retaining source-published time strings as fallbacks. The data
   now supports dated browsing; the multi-day interface remains planned.
2. Links each event to its catalogue channel detail and, when recorded, its
   official event or schedule page. Playable events may offer the existing
   catalogue player without implying that every scheduled event is live.
3. Supports compact filtering by jurisdiction and listing/playback status.
   Legislature, language, and shareable URL filters remain possible follow-ups.
4. Shows collection time, source freshness, and stale schedule state
   explicitly. Missing schedule coverage must remain visibly different from
   "nothing scheduled."
5. Works as dense listings on desktop and a compact two-column Now/Next list on
   mobile without pretending the snapshot is a complete multi-day TV grid.
6. Preserves partial results when individual scrapers fail and explains the
   catalogue's current schedule coverage rather than presenting the page as a
   comprehensive parliamentary calendar.

Next, add dated browsing over the rolling event lists, preserve date and filter
state in shareable URLs, and prioritize official IDs, event links, and end times
for sources whose current events still rely on generated identities.

## Rights And Permission Work

Near-term:

1. Keep `docs/source-rights-and-permissions.md` as the evidence-backed matrix for
   source terms and permission status.
2. Prioritize rights review for newly added official-page/player discoveries
   that remain unresolved after the 2026-08-19 rights pass: Norway, Estonia,
   Chile, Israel, El Salvador, Germany, Council of Europe/PACE, Nunavut, and the
   remaining official-page/link-out sources without clear reuse terms.
3. Add a short public-facing `docs/rights-summary.md` if the detailed matrix
   becomes too long for readers who only need the current posture.
4. Keep written permission-request drafts in `docs/permission-requests.md`, but
   defer sending them until a coordinated communications push is ready. When
   replies eventually arrive, record only summarized public evidence, not raw
   private correspondence.
5. Shape the future communications push as both clarification and advocacy:
   ask for missing permission/technical facts, and explain what would make each
   service more open, standardized, accessible, and reusable.
6. Keep CPAC marked `no_third_party_reuse` unless written consent is obtained.
7. Keep YouTube sources compliant-embed only; do not extract YouTube manifests.
   The current permanent uploads playlists are useful fallbacks but are not
   guaranteed live-only feeds. The metadata-only `youtube-live` resolver can
   record current official video IDs when static live-page metadata is explicit;
   future work is to decide whether YouTube Data API support is worth the
   operational/API-key cost for better scheduled-event metadata.
8. Replace the current `unknown` accessibility states with cited evidence for
   captions and caption languages, sign-language interpretation, and audio
   description. Do not equate missing evidence with confirmed unavailability.

Current measurable review queues, last reconciled with the catalogue on
2026-08-24:

- 38 of 100 catalogue entries still use a permission status ending in
  `pending_review`. Prioritize common service families once, then apply the
  same evidence consistently to their related channel records.
  Breakdown: 18 official-vendor HLS, 4 official pages, 5 first-party HLS, and
  1 DASH research record.
- All 100 entries retain at least one `unknown` media-accessibility field. Start
  with sources that publish caption or interpretation documentation, and keep
  unsupported fields `unknown` rather than inferring `unavailable`.
  Breakdown: 37 national, 43 sub-national, and 6 supranational entries.
  Ontario caption availability and source-dependent sign-language evidence is
  documented across its six feeds; Scottish Parliament TV, Senedd TV, Northern
  Ireland Assembly TV, BC Legislature webcasts, and the three Tweede Kamer
  records now also have cited source-dependent sign-language evidence. Audio
  description evidence remains unknown for every entry.
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
