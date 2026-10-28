# Existing Collector Stabilization — 28 October 2026

## Result And Scope

This pass maintains the existing **27 collectors**, without adding another parser,
network dependency or extraction framework. The catalogue remains **261 viewing
sources**. Correcting four Ontario room associations leaves **43 parser-connected
records**, 33 metadata URLs and **218 records with planned extraction**. The earlier
47-record count included room mappings the House-only parser never returned.
Catalogue eligibility, viewing policies, map membership and permissions are unchanged.

[Measured results and source hashes](2026-10-28-collector-stabilization.json) accompany
this report. Generated schedules and raw response bodies remain temporary local
artifacts rather than committed programme data.

## Corrections

- Ireland: equal start/end timestamps mean an unknown end even inside a guide day.
  Preserve other complete programmes instead of rejecting the entire guide. Keep
  backwards ranges, conflicting identities and changed/truncated markup as errors.
  The fresh local guide has 128 events; 119 have exportable ranges, nine remain
  start-only. No end is inferred to fill those gaps.
- Italian Chamber: official event ID, title and valid source clock stay mandatory;
  unused player-channel metadata and an optional room label no longer invalidate
  an otherwise identifiable broadcast. The new response also parsed with the old
  parser, so the earlier transient failure's precise bad field is **unconfirmed**.
- JSON APIs: two shared shape checks replace unchecked casts at the Quebec,
  European Parliament, EBS, Italian Senate and UK boundaries. Malformed containers
  become source-local errors without catching every programming exception.
- Timezones: UK local times use the existing DST-safe localization helper; gaps
  and ambiguous folds are omitted instead of choosing an offset. European
  Parliament naive timestamps are omitted and start-only events do not become
  indefinitely live merely because their start passed.
- Collection precedence: YouTube Now/Next metadata remains a fallback when a fresh
  institutional calendar exists for the same record. Retained stale data cannot
  replace another successful source's current result. Source metrics still report
  what each collector returned; they need not sum to the selected published rows.
- Ontario: House sitting events apply to the House only. Room 151, Committee 1,
  Committee 2 and Media Studio return to planned extraction. Generated catalogue
  data and the inventory service baseline use the corrected association count.
- XMLTV: an assumed broadcast date now receives `assumed_broadcast_date` and is
  excluded, including legacy TV Camara cached records. Start-only/assumed listings
  remain in schedule JSON with provenance. The active weekday tab is insufficient
  evidence of a calendar date. Correctly dated CPAC/Senado next-listing end
  inference remains available and disclosed.

## Fresh Local Collection

At **2026-10-28 15:42:37 UTC**, all 27 collectors ran with 12-second request timeouts
and no retries: **20 ok, six empty, one error; 21 populated channel schedules,
743 events, no retained stale channels**. Knesset returned HTTP 403. Taiwan worked
locally; its separately reproduced GitHub Actions 403 hold remains unresolved.
An `empty` status means the parser found no events, rather than independently
confirming that every publisher has no upcoming broadcast.

The validated bundle has **221 XMLTV programmes across six populated channels**,
44 channel definitions and four stable / 38 broader playlist entries. There are
14 reviewed feed mappings. Twenty TV Camara events have assumed dates; 19 would
otherwise have a complete range. Holding those 19 is a deliberate quality gate,
not lost parsing. Counts from earlier publication timestamps are not a controlled
before/after comparison.

## Verification

Regression checks exercise malformed responses through every registered collector,
including multi-request collectors, with a successful neighbouring calendar kept
in the same run. Additional cases cover nested JSON shapes, Irish partial guides,
optional Italian metadata, source targets, UK DST and provider fallback precedence.
`make verify` passes with **509 Python tests**, strict typing across 72 source
files and the JavaScript checks, plus lint/format, publication
schemas, generated-data consistency, HTML, browser interaction and accessibility.
The live schedules/playlist/XMLTV/quality bundle also passes publication validation.
No live broadcaster media or audible playback was used during this pass.

## Maintenance Policy

Keep the existing useful guides working before increasing collector count. Prefer
an existing parser family or documented JSON/XML/iCalendar contract over a new
HTML scraper. Missing ends, uncertain dates and simultaneous rooms are recorded
as limitations rather than filled with guesses. A planned URL is a discovery link,
not a commitment to implement a collector. Require real dated sample output,
source timezone and identity checks, sensible empty/error behavior and a named
maintenance owner/review path before admitting a new collector. Feed mapping and
rights remain separate gates.

Repeated 403s are access holds: keep outlinks and bounded retries, retain useful
last-good data only within the existing TTL, and reconsider when publisher access
changes. Do not spend successive passes changing headers without new evidence.

## Ranked Unimplemented Candidates

| Priority | Candidate and value | Evidence and implementation gate |
| --- | --- | --- |
| 1 — next implementation | [Rhode Island Capitol TV / Cablecast](https://capitoltvri.cablecast.tv/): a real linear broadcast guide and a reusable platform family. | Fresh official HTML contains structured Remix state: 43 schedule items on channel 1, stable schedule IDs and explicit UTC run/end timestamps spanning 28–29 October. Use broadcast `runDateTime`/`endDateTime`, not the recording's `eventDate`. Corroborate channel 1 against the catalogue viewing service, compare visible local clocks, filter deleted runs and test pagination, empty windows and GitHub runner access before XMLTV admission. Public embedded state is not yet a documented stable API. |
| 2 — optional schedule discovery | [French National Assembly commission broadcasts](https://event2.assemblee-nationale.fr/programme.php): explicitly scheduled public broadcasts with dates and starts. | Fresh page has dated future rows, but parallel commission rooms and no confirmed ends. A small parser could improve website discovery, not one linear XMLTV guide. Implement only if that user value justifies a new HTML contract; reuse existing French/source-time utilities where practical. |
| 3 — optional schedule discovery | [Luxembourg Chamber agenda](https://www.chd.lu/fr/agenda): identified sessions and broadcast-marked committee meetings. | Fresh agenda includes IDs and dated starts. Admit only broadcast-marked cards. Its epoch date attribute denotes midnight, not the meeting clock; hidden “live” template text is not live evidence. Nested HTML and start-only events make this less valuable per maintenance cost than Cablecast. |

The French and Luxembourg bounded response hashes are retained below; they are
research candidates, **not newly implemented or XMLTV-admitted services**.

### Deferred Alternatives

- Bermuda Harmony: root and upcoming-view requests both returned the same client
  template without dated event cards. Existing Canadian Harmony code suggests a
  reuse opportunity, but Bermuda requires its actual data route and Atlantic/
  Bermuda clock handling; this is an investigation hold, not a ready collector.
- France's official JSON agenda ZIP: HEAD returned 200, `application/zip`,
  **8,547,225 bytes**, above the shared 5 MiB response cap before decompression.
  Institutional meeting metadata is not a broadcast grid. Do not widen download
  limits merely to add this source; investigate a bounded supported API first.
- Greece, Denmark and Sansad: retain the earlier documented access/mapping holds;
  this pass did not freshly revalidate those routes. Thailand's recurring PDF
  grid has date/recurrence conflicts. Prioritize these only when those specific
  blockers change, rather than creating fragile replacement scrapers.
- Mongolia's weekly calendar remains behind its viewing-route/mapping hold;
  template-duration meeting ends cannot establish programme ends. Glarus's
  low-frequency assembly offers little near-term guide gain. Neither is next.

This ranking favors useful broadcast coverage and manageable maintenance. It does
not imply that the other 218 planned catalogue records have no usable metadata.
