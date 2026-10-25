# Parliament Streams Plans

This is the active roadmap, reviewed **25 October 2026**. Dated progress reports
and the previous detailed backlog are preserved in [roadmap history](docs/roadmap-history.md).
Use [research status](docs/research-status.md) for evidence and
[GitHub Actions](docs/github-actions.md) for implemented automation.

## Current Goal

Maintain an understandable catalogue and legislature inventory with official
sources, reproducible checks and clear limits. Keep the public list compact and
accessible. Institutional eligibility, selected playback, current live coverage,
programme data and reuse rights are separate review questions.

## Current State

The catalogue has **269 sources** and the inventory has **940 eligible identity
records**. The [current service baseline](reports/discovery/2026-10-25-institution-service-baseline.md)
records exact matches and remaining per-body work. These are different units;
neither total is a count of fully validated live streams. Completed work and
older totals belong in the [changelog](CHANGELOG.md) and dated evidence.

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

- [ ] Verify feed/room mappings for event platforms; institutional agendas and
  parallel event directories must not become a fictional linear TV guide.
- [ ] Improve Brazil's source-date/inferred-end handling and investigate official
  schedules for Greece and Sansad TV. Prefer documented structured sources, then
  add narrowly scoped parsers and saved-response fixtures.
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

As of this review, **194 of 269 sources** retain a permission status ending in
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

## Future UI/UX Review

Keep the current visual identity, compact density and straightforward watch
handoff. Revisit broader product direction after another data-stability round.
A hosted television-view application remains a later product decision.

### Group Subnational Sources In The Catalogue

- [ ] Establish explicit country → legislature → chamber/room relationships before
  grouping rows. Preserve territorial distinctions and easy access to national sources.
- [ ] Design keyboard-accessible desktop/mobile expansion, useful counts and direct
  links; search and filters should reveal matches inside their groups.
- [ ] Add dated schedule browsing and shareable filter state when event identifiers
  and timestamps support it. Missing coverage must remain distinct from no events.

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
