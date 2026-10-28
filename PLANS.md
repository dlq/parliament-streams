# Parliament Streams Plans

This is the active roadmap, reviewed **28 October 2026**. Dated progress reports
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

Use **official structured metadata**: XMLTV, JSON/XML APIs, iCalendar/ICS,
event/broadcast JSON-LD, microdata/RDFa, embedded JSON and explicit machine-readable
HTML fields. Generic SEO graphs, upload dates and placeholder meeting bounds do
not establish broadcast programmes. See [source selection](docs/schedules-and-iptv.md#source-selection).

The [retention decision](reports/epg/2026-10-28-structured-collector-retirement.md)
retires nine presentation-based collectors and their tests. After five structured
additions, **26 collectors** cover **42 of 261 catalogue records** through 31
metadata URLs. The 219 other records retain official schedule links. Bundestag is the sole documented hybrid
exception, with source channel identity and explicit end timestamps cross-checking
its printed start/range. Other retained HTML sources expose machine-readable event
fields. New Zealand's legacy HTML/status parser is removed; its JSON API stays.

- [x] Remove TV Câmara, Canadian Harmony, Czech Chamber, French commissions,
  Luxembourg, Mauritius, Quebec's prose TV guide, Spain's weekly guide and the
  heuristic YouTube resolver. Remove retired mappings and stale-recovery paths;
  preserve viewing services, official outlinks and historical evidence.
- [ ] Harden retained interfaces: European Parliament's pinned frontend route,
  Portugal's fixed legislature/link discovery, Ontario's date/title scope and
  UN Web TV's changed-page recognition. Seek supported structured replacements
  before adding more presentation rules.
- [ ] Keep Taiwan/Knesset access holds separate from parser refactoring; use bounded
  requests and honest last-good/error reporting rather than repeated header changes.
- [x] Implement the five structured priorities: Câmara event API, California's
  explicit calendar-export parameters, Harmony JSON for House/Senate/Bermuda,
  US Senate hearings XML and New York session ICS. Keep institutional calendars
  separate from linear guide mappings; see [implementation evidence](reports/epg/2026-10-28-structured-collector-implementation.md).
- [ ] Resolve US Senate/XML and New York/ICS HTTP 403 access holds, then confirm
  their live contracts and New York date/time precision. Parser tests are not
  evidence of successful live retrieval. Do not invent midnight programme starts.
- [ ] Follow the [new structured-source priorities](reports/epg/2026-10-28-structured-candidate-priorities.md)
  and [current input register](reports/epg/2026-10-28-unimplemented-collectors.md).
  BC's embedded calendar has historical noon-bounded session blocks, not verified
  upcoming broadcast times. Scotland/Minnesota and Senedd/Northern Ireland need
  structured-feed evidence before another parser. This pass was not a full sweep.
- [ ] Keep France's large agenda ZIP and PDF recurrence grids behind their specific
  cost/mapping holds.
  A future plain-HTML exception requires a concrete source-specific decision.
- [ ] Check the retained/new collector code and regenerated data in its first
  hosted release run after publication. Local verification does not establish a
  completed deployment.

Historical checkpoints: [stabilization](reports/epg/2026-10-28-collector-stabilization.md),
[three additions](reports/epg/2026-10-28-priority-collectors.md),
[pre-retirement ranking](reports/epg/2026-10-28-collector-maintainability.md), and
[Taiwan hosted-access evidence](reports/epg/2026-10-27-taiwan-actions-access.md).
The later retirement decision governs current scope, including removal of the
French and Luxembourg collectors added earlier the same day.

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
