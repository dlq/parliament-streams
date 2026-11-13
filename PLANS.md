# Parliament Streams Plans

This is the active roadmap, reviewed **13 November 2026**. Dated progress reports
and the previous detailed backlog are preserved in [roadmap history](docs/roadmap-history.md).
Use [research status](docs/research-status.md) for evidence and
[GitHub Actions](docs/github-actions.md) for implemented automation.

## Where Work Is Tracked

This file holds project priorities, milestones, scope constraints and deferred
ideas. Link to active work rather than keeping a second task checklist here.

GitHub issues hold reproducible bugs, bounded improvements, contribution tasks
and actionable research questions. Each task should state the problem, relevant
source or record IDs, evidence, and what would count as done. Large review queues
can retain an umbrella issue, with smaller issues for independently useful work.

Current queues: [candidate discovery #12](https://github.com/dlq/parliament-streams/issues/12),
[rights evidence #13](https://github.com/dlq/parliament-streams/issues/13),
[media accessibility #14](https://github.com/dlq/parliament-streams/issues/14),
[monthly inventory source access #51](https://github.com/dlq/parliament-streams/issues/51),
and [Taiwan schedule regression #53](https://github.com/dlq/parliament-streams/issues/53).
The automated inventory issue is a review inbox; an inaccessible URL is not a
reason to remove a legislature. Do not create one issue per raw access failure.
Split out a finding only when it has a concrete investigation or correction.

Canonical data records decisions; dated reports and research status retain the
supporting evidence. Completed work belongs in the changelog and roadmap history,
not in this active checklist. Issues should link to those records rather than
copying large inventories or periodically changing counts into their task lists.

## Current Goal

Maintain an understandable catalogue and legislature inventory with official
sources, reproducible checks and clear limits. Keep the public list compact and
accessible. Institutional eligibility, selected playback, current live coverage,
programme data and reuse rights are separate review questions.

## Current State

See the [service baseline](reports/discovery/2026-10-25-institution-service-baseline.md)
for dated catalogue and inventory counts, exact matches and per-body evidence.
The [shared viewer documentation](docs/public-site.md#shared-viewer-and-navigation)
describes the desktop and mobile behavior. Preserve normal links and the abortable
navigation lifecycle when changing page controllers.

## Next Milestones

1. Continue the remaining eligible-body metadata, official-service, programme and
   rights gaps, using exact institution IDs and recording confirmed and unresolved
   claims separately. Retain the eight precise legal holds outside the eligible
   service queue. See [current findings](docs/research-status.md).
2. Review [inventory findings](https://github.com/dlq/parliament-streams/issues/51)
   and monitor the hardened Actions workflows in use.
   Preserve incomplete/capped checks, source errors and human decisions; no
   workflow should promote a source or change inventory membership automatically.
3. Improve guide accuracy for existing sources before expanding parser coverage:
   verified feed/room mappings, source dates, reliable empty-response recognition,
   freshness/coverage changes and bounded response evidence.
4. Replace unknown rights and accessibility fields with cited evidence where
   available. Keep source-specific restrictions and scoped link-out publication
   intact while broader permissions remain unresolved.

## Catalogue Work

- [ ] Verify boundary identity, component membership, source vintage and
  licensing before adding or replacing outlines. See the
  [map attribution and validation notes](site/assets/maps/ATTRIBUTION.md).

- [ ] Continue the [subnational authority recheck](reports/discovery/2026-10-29-subnational-authority-recheck.md):
  exact legislative organ, territorial tier, substantive enactment powers,
  legal rank, budget/scrutiny and operative grant dates. Evidence-presence checks
  cover all 835 eligible subnational records; fresh framework readings are a
  narrower check. Prioritize Colombian text retrieval, special-status grants
  and older consolidations. Retain the three accepted Basque foral exceptions;
  do not admit ordinary provincial or municipal councils by analogy.
- Review unpublished feed variants and named source holds through the
  [candidate discovery queue #12](https://github.com/dlq/parliament-streams/issues/12).
  Require a supported viewing route for publication.
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

Use **official structured metadata**: XMLTV, JSON/XML APIs, iCalendar/ICS,
event/broadcast JSON-LD, microdata/RDFa, embedded JSON and explicit machine-readable
HTML fields. Generic SEO graphs, upload dates and placeholder meeting bounds do
not establish broadcast programmes. See [source selection](docs/schedules-and-iptv.md#source-selection).

See the [collector retention review](reports/epg/2026-10-28-structured-collector-retirement.md)
and [implementation evidence](reports/epg/2026-10-28-structured-collector-implementation.md)
for dated coverage counts and source decisions.

Collector maintenance is tracked in
[European Parliament #75](https://github.com/dlq/parliament-streams/issues/75),
[Portugal #76](https://github.com/dlq/parliament-streams/issues/76),
[Ontario #77](https://github.com/dlq/parliament-streams/issues/77), and
[UN Web TV #78](https://github.com/dlq/parliament-streams/issues/78).

- Track supported access and live-contract investigations in
  [Taiwan #53](https://github.com/dlq/parliament-streams/issues/53),
  [US Senate hearings XML #54](https://github.com/dlq/parliament-streams/issues/54),
  [New York Senate ICS #55](https://github.com/dlq/parliament-streams/issues/55),
  and [Knesset TV #56](https://github.com/dlq/parliament-streams/issues/56).
  Keep access holds separate from parser correctness, use bounded requests and
  honest last-good/error reporting, and require real time precision for programmes.
- [ ] Follow the [new structured-source priorities](reports/epg/2026-10-28-structured-candidate-priorities.md)
  and [current input register](reports/epg/2026-10-28-unimplemented-collectors.md).
  BC's embedded calendar has historical noon-bounded session blocks, not verified
  upcoming broadcast times. Scotland/Minnesota and Senedd/Northern Ireland need
  structured-feed evidence before another parser. This pass was not a full sweep.
- [ ] Keep France's large agenda ZIP and PDF recurrence grids behind their specific
  cost/mapping holds.
  A future plain-HTML exception requires a concrete source-specific decision.

## Rights And Permission Work

The [rights evidence queue](https://github.com/dlq/parliament-streams/issues/13)
tracks source-specific follow-up. As of this review, **190 of 261 sources** retain
a permission status ending in `pending_review`. This is an evidence queue, not a statement that all uses are
prohibited or permitted. Catalogue fields and dated source findings govern each
source's presentation.

- [ ] Review linking, embedding, independent playback, rebroadcast, copying/recording,
  other audiovisual reuse and programme-data licensing as distinct claims. Reuse
  evidence consistently within a service family without inferring a blanket grant.
- [ ] Prioritize official caption, caption-language, interpretation and audio-description
  evidence through the [media accessibility queue](https://github.com/dlq/parliament-streams/issues/14). Missing evidence remains `unknown`, not confirmed unavailability.
- [ ] Maintain the [rights matrix](docs/source-rights-and-permissions.md),
  [rights summary](docs/rights-summary.md) and [request drafts](docs/permission-requests.md).
  Outreach remains deferred until a coordinated communications package and messages
  have been reviewed; recording this plan does not authorize sending them.

## UI/UX Follow-up

Keep the current visual identity, compact density and straightforward watch
handoff. Revisit broader product direction after another data-stability round.
A hosted television-view application remains a later product decision.

The [25 October Pages audit](reports/ui/2026-10-25-audit.md) records the original
findings and implemented changes. Remaining verification:

- [Manual website accessibility review #57](https://github.com/dlq/parliament-streams/issues/57).
- [Localized result-count plural forms #58](https://github.com/dlq/parliament-streams/issues/58).

### Group Subnational Sources In The Catalogue

- Define the [subnational data model #79](https://github.com/dlq/parliament-streams/issues/79)
  before grouping rows. Preserve territorial distinctions and easy access to national sources.
- [ ] Design keyboard-accessible desktop/mobile expansion, useful counts and direct
  links; search and filters should reveal matches inside their groups.
- [ ] Add dated schedule browsing and shareable filter state when event identifiers
  and timestamps support it. Missing coverage must remain distinct from no events.
  Jurisdiction/listing filters are now shareable. Complete the
  [Now/Next freshness review #59](https://github.com/dlq/parliament-streams/issues/59)
  before expanding dated browsing.

### Language Coverage And Review

Initial fluent-speaker review tasks:

- [Korean (`ko`) #60](https://github.com/dlq/parliament-streams/issues/60).
- [Japanese (`ja`) #61](https://github.com/dlq/parliament-streams/issues/61).
- [Indonesian (`id`) #62](https://github.com/dlq/parliament-streams/issues/62).
- [Inuktitut syllabics (`iu-Cans`) #63](https://github.com/dlq/parliament-streams/issues/63).

All supported locales still welcome review, including recent Czech, Finnish,
Swedish and Traditional Chinese copy. IPTV/VLC help must remain complete in every
supported locale; key completeness does not establish linguistic quality.

- [ ] Revisit language-picker ordering consistently across pages; keep the current
  order until that review. Source labels alone do not establish language coverage.

### Deferred Locale Work

- [ ] After Korean (`ko`), Japanese (`ja`) and Indonesian (`id`), prioritize
  **Basque** (four catalogue entries), **Polish** (two), and **Catalan/Valencian**
  (two combined). Assess whether Valencian needs a separate variant pack while
  preserving distinct broadcast-language labels.
- [ ] Assess the other currently recorded gaps: **Afrikaans, Albanian, Cape Verdean
  Creole, Croatian, Icelandic, Ladin, Lithuanian, Macedonian, Malay, Montenegrin,
  Romanian, Scottish Gaelic, Serbian, Setswana, Sinhala, Slovenian, Tahitian,
  Tamil, Tetum, Welsh and Xhosa**. Seek fluent reviewers and verify source-language
  metadata before exposing a complete interface pack; multilingual source labels
  are not a complete census of languages used in broadcasts.
- [ ] Add **Hebrew** only with a dedicated right-to-left/bidirectional review of
  navigation, compact lists, filters, viewer controls, punctuation and mixed-script
  source/programme text. Keep source-title direction isolation separate from UI direction.
- [ ] Assess European Portuguese and Norwegian variants against source coverage
  and available reviewers. Cyrillic Mongolian and traditional vertical Mongolian
  require separate script/layout choices; do not add them merely because a source
  lists the language.
- [ ] Every future locale must include catalogue, legislatures, map, schedule,
  Data and methods, viewer, IPTV/VLC, placeholders, plural forms and responsive/
  accessibility checks. Keep English fallback and on-demand JSON loading.

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
