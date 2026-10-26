# Parliament Streams Plans

This is the active roadmap, reviewed **26 October 2026**. Dated progress reports
and the previous detailed backlog are preserved in [roadmap history](docs/roadmap-history.md).
Use [research status](docs/research-status.md) for evidence and
[GitHub Actions](docs/github-actions.md) for implemented automation.

## Current Goal

Maintain an understandable catalogue and legislature inventory with official
sources, reproducible checks and clear limits. Keep the public list compact and
accessible. Institutional eligibility, selected playback, current live coverage,
programme data and reuse rights are separate review questions.

## Current State

The catalogue has **261 usable viewing sources** and the inventory has **940 eligible identity
records**. The [current service baseline](reports/discovery/2026-10-25-institution-service-baseline.md)
records exact matches and remaining per-body work. These are different units;
neither total is a count of fully validated live streams. Completed work and
older totals belong in the [changelog](CHANGELOG.md) and dated evidence.

The desktop [shared viewer](docs/public-site.md#shared-viewer-and-navigation)
now floats over the unchanged list width, with move/resize keyboard alternatives
and uninterrupted playback during enhanced navigation between the five pages.
The existing mobile sheet remains. Keep future page controllers within the
abortable navigation lifecycle and retain normal HTML links/deep links.

## Next Milestones

1. Continue the remaining eligible-body metadata, official-service, programme and
   rights gaps, using exact institution IDs and recording confirmed and unresolved
   claims separately. Retain the eight precise legal holds outside the eligible
   service queue. See [current findings](docs/research-status.md).
2. Review discovery findings and monitor the hardened Actions workflows in use.
   Preserve incomplete/capped checks, source errors and human decisions; no
   workflow should promote a source or change inventory membership automatically.
3. Improve guide accuracy for existing sources before expanding parser coverage:
   verified feed/room mappings, source dates, reliable empty-response recognition,
   freshness/coverage changes and bounded response evidence.
4. Replace unknown rights and accessibility fields with cited evidence where
   available. Keep source-specific restrictions and scoped link-out publication
   intact while broader permissions remain unresolved.

## Catalogue Work

- [ ] Resolve the nine unready feed variants retained in candidates after the
  [catalogue separation](reports/discovery/2026-10-26-catalogue-research-separation.md);
  keep publication gated on a supported viewing route.
- [ ] Work through the named holds for France's Senate, Chile Sala IV, Rivera and
  other unpublished discovery leads. Resolve the specific evidence gap for each;
  a failed route or an identifier search without a result does not prove absence.
- [ ] Continue current-live, chamber/committee-room, language and source-condition
  checks for published viewing services. Selected historical recordings and parts
  of one sitting must retain their narrower scope.
- [ ] Reconcile every later promotion across catalogue, exact inventory crosswalk,
  map, search, flags, locale labels and useful programme links. IPTV and XMLTV
  admission keep their own technical and guide-data gates.
- [ ] Reconcile future EIU editions country by country before changing discovery
  tiers or coverage denominators. Keep the agreed 25 + 46-country baseline until
  that review is complete; broader Tier 3 work remains a later expansion.
- [ ] Consider structured language codes, explicit source-discovery state and
  further report schemas where they reduce ambiguity. Migrate through tooling.

## Scraper Work

The [WebTV programme continuation](reports/epg/2026-10-26-webtv-programmes.md)
brings the current 261-source catalogue to 47 parser-connected records and 27
collectors, with 214 sources still awaiting extraction. It adds Italian Chamber
featured broadcasts and Taiwan's official two-channel programme API. Keep their
aggregate portals outside linear XMLTV; resolve separate feed records/mappings
and dependable broadcast ends before expanding export. Taiwan's iVOD forecast
still has a modern-TLS access hold; use the supported official programme API
without weakening TLS checks.

The earlier [Nordic continuation](reports/epg/2026-10-26-nordic-coverage.md) brought
the catalogue to 45 parser-connected records and 25 collectors.
Norway and Sweden add source-timezone-aware starts, with official identities and
explicit calendar-duration, unknown-start and linear-mapping holds. There are
216 sources with planned extraction at that checkpoint; XMLTV/playlist admissions stayed
unchanged. Finland, Denmark and Greece retain specific fresh source-access/time
findings for the next pass.

The earlier [26 October continuation](reports/epg/2026-10-26-coverage-pass.md) and
[measured data](reports/epg/2026-10-26-coverage-pass.json) record a local publication
preview at 05:52:28 UTC: 44 parser-connected records, 23 collectors and 396 XMLTV
programmes across seven channels. Germany and Ireland add 152 explicit ranges;
Mauritius adds a start-only event guide. New Zealand's supported House-calendar
API returns a healthy current empty window. Portugal preserves source IDs and
metadata without midnight defaults or fabricated ends. These are pre-publication
measurements; live schedules and exports are regenerated during deployment.
The [first](reports/epg/2026-10-25-coverage-pass.md) and
[second](reports/epg/2026-10-25-second-pass-coverage.md) 25 October checkpoints remain
historical measurements. The quality report tracks every catalogue entry through
parser, collection, mapping and programme availability states; its 226 planned
records describe that earlier checkpoint.

- [ ] Verify feed/room mappings for event platforms; institutional agendas and
  parallel event directories must not become a fictional linear TV guide.
- [ ] Resolve EBS/Italian and Czech/Estonian end-time gaps, TV Camara's assumed
  broadcast dates, and Greece/Sansad/Denmark/Slovakia access or mapping holds.
  Validate Thailand's monthly PDF recurrence and timing conflicts before parser
  work; keep Chile/Jalisco signal mappings separate from institutional agendas.
- [x] Restore a supported New Zealand calendar-data contract. House-only public
  JSON now distinguishes genuine empty windows from source errors; calendar
  intervals remain outside XMLTV until broadcast continuity is established.
- [ ] Resolve Ireland's terminal-slot ends and Mauritius's contradictory end clock
  from authoritative broadcast evidence; keep both unknown in the meantime.
- [ ] Cover empty/off-session responses, changed markup, cancellations, rescheduling,
  overnight events, timezones and daylight-saving transitions. Preserve valid
  partial results and explain exclusions without manufacturing programme times.
- [ ] Retain bounded public response samples, retrieval metadata, hashes and parser
  versions; compare event counts and usable coverage across runs. Reconcile sample
  output with the source and try playlist/guide identifiers in an IPTV client.
- [ ] Enrich ParlVU/SenVu archives and other official event links using stable
  identifiers and documented access. Event-specific manifests remain unsuitable
  as permanent channels; YouTube manifests must not be extracted.

## Rights And Permission Work

As of this review, **194 of 270 sources** retain a permission status ending in
`pending_review`. This is an evidence queue, not a statement that all uses are
prohibited or permitted. Catalogue fields and dated source findings govern each
source's presentation.

- [ ] Review linking, embedding, independent playback, rebroadcast, copying/recording,
  other audiovisual reuse and programme-data licensing as distinct claims. Reuse
  evidence consistently within a service family without inferring a blanket grant.
- [ ] Prioritize official caption, caption-language, interpretation and audio-description
  evidence. Missing evidence remains `unknown`, not confirmed unavailability.
- [ ] Maintain the [rights matrix](docs/source-rights-and-permissions.md),
  [rights summary](docs/rights-summary.md) and [request drafts](docs/permission-requests.md).
  Outreach remains deferred until a coordinated communications package and messages
  have been reviewed; recording this plan does not authorize sending them.

## UI/UX Follow-up

Keep the current visual identity, compact density and straightforward watch
handoff. Revisit broader product direction after another data-stability round.
A hosted television-view application remains a later product decision.

The [25 October Pages audit](reports/ui/2026-10-25-audit.md) is complete for the
documented journeys, with 25 original captures. The first implementation pass
was published in release `ae5337e`:

- [x] Repair map search feedback, keyboard tab order, selection/focus state and
  the mobile route to selected details and the textual jurisdiction index.
- [x] Explain the inventory → catalogue → reviewed checks → generated products
  relationship through a shared Data and method route, consistent code/data/
  contribution utilities and clearly defined coverage counts.
- [x] Connect schedule empty/error/stale/mapping states to specific explanations
  and official-source actions; simplify detail and reuse-permission wording.
  State explicitly that IPTV downloads are global and independent of page filters.
- [x] Repair narrow translated navigation, retain always-visible catalogue
  coverage and tighten secondary spacing and repeated labels.
- [x] Align secondary-page headings and introductory spacing; use a restrained
  green wash for shared explanations and contribution areas, retaining compact
  white list rows.
- [ ] Verify real screen-reader, zoom/text-resize, forced-colour and physical
  mobile behaviour. Obtain fluent-speaker review of the new translated copy.
- [ ] Review singular/plural result-count wording across locales, including
  the schedule's one-channel filter result.

### Group Subnational Sources In The Catalogue

- [ ] Establish explicit country → legislature → chamber/room relationships before
  grouping rows. Preserve territorial distinctions and easy access to national sources.
- [ ] Design keyboard-accessible desktop/mobile expansion, useful counts and direct
  links; search and filters should reveal matches inside their groups.
- [ ] Add dated schedule browsing and shareable filter state when event identifiers
  and timestamps support it. Missing coverage must remain distinct from no events.
  Jurisdiction/listing filters are now shareable. Review how Now/Next summaries
  age between scheduled collections before expanding dated browsing; distinguish
  publisher-reported live status from a programme inferred from its time range.

### Language Coverage And Review

- [ ] Arrange fluent-speaker review of all 23 locales, especially the newer Czech,
  Finnish, Swedish and Traditional Chinese packs and provisional Inuktitut text.
  IPTV/VLC help must remain complete in every supported locale.
- [ ] Revisit language-picker ordering consistently across pages; keep the current
  order until that review. Source labels alone do not establish language coverage.

### Deferred Locale Work

Assess Welsh, Catalan/Valencian, Basque, Scottish Gaelic, European Portuguese and
Norwegian language variants against source coverage and available reviewers.
Hebrew needs a dedicated right-to-left/bidirectional layout review. Cyrillic
Mongolian and traditional vertical Mongolian require separate script/layout
choices; do not add them merely because a source lists the language.

## Deferred Search Visibility Follow-up

- [ ] Revisit Search Console verification, sitemap submission and indexing of all
  public pages when ready. Account setup or submission is not part of current work.
- [ ] Prepare useful country/legislature pages and a concise About/methodology page
  only when they add substantive source information. Keep technical SEO and
  [search-visibility guidance](docs/search-visibility.md) current.

## Research And Advocacy

- [ ] Prepare a project introduction and a readable audit summary with dates,
  methods, limitations and evidence links; refresh counts before publication.
- [ ] Develop a coordinated clarification/advocacy package for relevant parliamentary,
  civic-tech, research and accessibility communities. Ask for documented streams,
  stable event IDs, machine-readable schedules, accessible media and clear use terms.
  Prepare messages for review before any outreach.
- [ ] Triage contributions into small source, translation, accessibility, schedule,
  documentation and code tasks. Keep native-language review needs visible.

## History And Detail

The [preserved roadmap](docs/roadmap-history.md) retains all earlier milestones,
country/territory leads, source-specific questions and deferred ideas. Consult
those details when taking up a task, then reconcile them with current canonical
data and [research status](docs/research-status.md). [NOTES.md](NOTES.md) retains
the chronological research log; historical statements do not override current
reviewed decisions.
