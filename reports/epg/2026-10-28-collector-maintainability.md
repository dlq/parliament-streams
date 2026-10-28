# Existing Collector Maintainability Ranking — 28 October 2026

Later same-day decision: [structured collector retention](2026-10-28-structured-collector-retirement.md)
retires nine collectors, including the French and Luxembourg additions. Current
scope is 21 collectors / 35 records. The measurements/ranking below are the earlier
checkpoint, not the active implementation queue.

All 30 implemented collectors are ordered from greatest maintenance concern to least. This is an engineering assessment of current code, the latest verified local collection at 16:06:46 UTC and the recorded hosted-access evidence—not measured failure rates or a prediction of how long any publisher will keep its interface. Adjacent positions are judgment calls. No new live collection was performed for this ranking.

Weighting: reliance on website internals; unverified timing assumptions; risk of silent empty/incorrect results; access barriers; request/discovery complexity; and clarity of source contracts and validation. More defensive code or more lines do not by themselves imply greater brittleness. Missing programme ends alone are a coverage limitation, not fragile parsing. Low structural risk does not prove that an endpoint is a documented/versioned API.

Taiwan and Knesset have operational access holds; Taiwan’s parser is structurally simpler than its high overall concern suggests. An isolated UK timeout does not outweigh its comparatively simple JSON contract. New collectors, especially Cablecast, have limited production history. Empty snapshots do not establish that a source is reliable.

| Rank | Collector | Concern | Main reason |
| ---: | --- | --- | --- |
| 1 | [European Parliament](../../parliament_streams/scrapers/european_parliament.py) | Very high | Pins a frontend build ID in the JSON URL; a website deployment can invalidate the route. |
| 2 | YouTube resolver (subsequently retired) | Very high | Unofficial page markers and canonical/watch metadata; consent, rendering and page changes can defeat extraction. |
| 3 | Brazil TV Câmara (subsequently retired) | Very high | HTML active-weekday tabs with no authoritative broadcast date; date is assumed and ends inferred. |
| 4 | [Ontario House calendar](../../parliament_streams/scrapers/ontario_calendar.py) | Very high | Loose time-to-heading HTML matching; changed or unrelated markup can silently yield an empty result. |
| 5 | [Portugal agenda](../../parliament_streams/scrapers/portugal_agenda.py) | High | Three-step HTML link discovery hard-codes “XVII Legislatura” before reaching JSON. |
| 6 | [Knesset TV](../../parliament_streams/scrapers/knesset_tv.py) | High operational | Observed HTTP 403 plus custom HTML and connected-midnight broadcast-day rules. |
| 7 | [Taiwan Parliamentary TV](../../parliament_streams/scrapers/taiwan_parliamentary_tv.py) | High operational | JSON is fairly simple, but hosted-runner 403 remains unresolved; six requests form one window. |
| 8 | Spain Canal Parlamento (subsequently retired) | High | Follows a weekly HTML link; multilingual dates, special clock text and inferred ends need custom handling. |
| 9 | Luxembourg broadcast agenda (subsequently retired) | High–moderate | Nested HTML, broadcast badges, duplicated desktop/mobile clocks and misleading midnight date attributes. |
| 10 | [UN Web TV](../../parliament_streams/scrapers/un_webtv.py) | High–moderate | Regex depends on exact class ordering and English section headings; missing sections can look empty. |
| 11 | Canadian ParlVU/SenVu (subsequently retired) | Moderate | Long HTML card regex across two portals; English display dates, status text and room extraction. |
| 12 | Mauritius Parliament TV (subsequently retired) | Moderate | Custom nested event/empty-card HTML and English date strings; recent window is empty. |
| 13 | [Italian Chamber WebTV](../../parliament_streams/scrapers/italy_camera.py) | Moderate | Featured-card HTML data attributes and container structure; optional-field failure handling was just simplified. |
| 14 | Czech Chamber (subsequently retired) | Moderate | Two weekly HTML pages with Czech date parsing and semantic filtering of plenary sittings. |
| 15 | Quebec linear TV guide (subsequently retired) | Moderate | French headings and human-written programme paragraphs/ranges are a formatting contract. |
| 16 | French commission broadcasts (subsequently retired) | Moderate | Specific three-column HTML table and French headings, but a small single-page extraction path. |
| 17 | [Ireland Oireachtas TV](../../parliament_streams/scrapers/ireland_oireachtas.py) | Moderate | Custom HTML guide structure; recently encountered unknown-end markers in interior slots. |
| 18 | [Bundestag TV 1](../../parliament_streams/scrapers/germany_bundestag.py) | Moderate | Custom dated HTML tables, channel attributes and printed clock/epoch-end agreement. |
| 19 | [Rhode Island Cablecast](../../parliament_streams/scrapers/rhode_island_cablecast.py) | Moderate | Structured data embedded in private Remix state, tied to the default channel/site identity; newly implemented. |
| 20 | [CPAC](../../parliament_streams/scrapers/cpac.py) | Moderate | Small HTML extraction using data-airdate and button classes; ends come from the next listing. |
| 21 | [New Zealand House calendar](../../parliament_streams/scrapers/new_zealand_parliament.py) | Lower–moderate | Structured official-client API, but app-backend hosting and retained HTML diagnostics add coupling. |
| 22 | [Quebec live webdiffusion](../../parliament_streams/scrapers/quebec_webdiffusion.py) | Lower–moderate | Two ASP.NET JSON endpoints with explicit live signal URLs; frontend backend rather than a documented general API. |
| 23 | [Europe by Satellite](../../parliament_streams/scrapers/ebs.py) | Lower–moderate | Structured dated grid with channel identity and source durations; API deployment URL and optional fields still couple it to the site. |
| 24 | [Italian Senate WebTV](../../parliament_streams/scrapers/italian_senate.py) | Lower–moderate | JSON palimpsest, exact channel filter and three dated requests; clock/text fields remain app-specific. |
| 25 | [Dutch Debat Direct](../../parliament_streams/scrapers/dutch_debat_direct.py) | Lower–moderate | Dated JSON, offset-bearing times and explicit room IDs; seven daily requests increase failure exposure. |
| 26 | [Brazil TV Senado](../../parliament_streams/scrapers/brazil_tv_senado.py) | Lower–moderate | Compact dated JSON rows with strict order checks; adjacent ends are inferred within a daily grid. |
| 27 | [UK Parliament calendar](../../parliament_streams/scrapers/uk_parliament.py) | Low structural | Simple official JSON calendar. The latest timeout is a transport incident, not evidence of brittle parsing. |
| 28 | [Estonia Riigikogu](../../parliament_streams/scrapers/estonia_riigikogu.py) | Low | Official dated JSON with UUIDs and explicit week coverage; small single-source contract. |
| 29 | [Norway Stortinget](../../parliament_streams/scrapers/norway_stortinget.py) | Low | Publisher iCalendar feeds with UTC starts and UUIDs; a deliberately narrow calendar subset. |
| 30 | [Sweden Riksdag](../../parliament_streams/scrapers/sweden_riksdag.py) | Low | Documented calendar XML with IDs, organ filters and explicit start-status fields. |

## Maintenance Order

The subsequent [structured-source preference](../../docs/schedules-and-iptv.md#source-selection)
governs implementation choices: look for supported JSON/XML/XMLTV, ICS and semantic
HTML metadata before further presentation scraping. This risk ranking remains a
diagnostic list, not an automatic order to refactor every existing HTML parser.

First address the avoidable code/contract risks: European Parliament’s pinned build route, YouTube changed-page recognition, TV Câmara’s broadcast-date evidence, Ontario empty-page validation and Portugal’s fixed legislature/link discovery. These are bounded investigations, not a mandate to replace all five interfaces. Do not weaken existing quality holds to increase event counts.

Keep Knesset and Taiwan in a separate access-hold queue. Continue bounded requests and honest stale/error reporting; repeated parser changes or header experiments are not an access solution.

For the remaining HTML collectors, improve changed-shell/empty-response recognition where it is weak, and keep focused fixtures for observed changes. Protect productive guides with small targeted fixes. For the structured sources near the bottom, routine monitoring is preferable to broad refactoring.

## Source-Specific Next Actions

1. **European Parliament:** Resolve the active data route, or migrate only if a supported source preserves the same broadcast coverage.
2. **YouTube resolver:** Keep a best-effort fallback; strengthen changed-page recognition rather than chase manifests or add browser automation.
3. **Brazil TV Câmara:** Resolve a genuine broadcast date or keep the XMLTV hold. Institutional event dates cannot date a replay slot.
4. **Ontario House calendar:** Add source-container and explicit empty-response validation before extending scope beyond House events.
5. **Portugal agenda:** Remove the fixed legislature assumption and make download discovery independent of attribute order.
6. **Knesset TV:** Keep an explicit access hold and bounded recovery; parser refactoring cannot resolve publisher blocking.
7. **Taiwan Parliamentary TV:** Park repeated header experiments. Retain the parser and reconsider on supported access evidence.
8. **Spain Canal Parlamento:** Preserve date/room boundaries and strict unknown starts; prefer a supported structured grid if one becomes available.
9. **Luxembourg broadcast agenda:** Monitor the new contract and retain badge/date disagreement fixtures; do not infer a linear feed.
10. **UN Web TV:** Validate the expected page/sections and distinguish a changed shell from a genuine no-event window.
11. **Canadian ParlVU/SenVu:** Share only proven platform contracts and validate empty/client-template responses before extending to another Harmony site.
12. **Mauritius Parliament TV:** Maintain strict identity/empty checks; obtain more real nonempty samples before expanding time semantics.
13. **Italian Chamber WebTV:** Monitor the recovery and retain official ID/date checks; do not make optional room/player metadata mandatory again.
14. **Czech Chamber:** Keep weekday/week/link corroboration; avoid interpreting all institutional events as broadcasts.
15. **Quebec linear TV guide:** Keep shared French dates and explicit range checks; report unfamiliar prose instead of guessing.
16. **French commission broadcasts:** Monitor the new table contract and empty recognition; preserve simultaneous start-only events.
17. **Ireland Oireachtas TV:** Keep partial valid guides and unknown ends; this pass already removed the avoidable whole-guide rejection.
18. **Bundestag TV 1:** Maintain narrow feed/date checks and use source mismatches as explicit holds.
19. **Rhode Island Cablecast:** Monitor the first hosted parse and loader shape. Keep rolling-window scope and overlap quarantine explicit.
20. **CPAC:** Add clear changed-page recognition if hardening it; preserve/disclose inference and leave the last end unknown.
21. **New Zealand House calendar:** Keep the restored House API contract; simplify legacy HTML paths only after confirming their diagnostic value.
22. **Quebec live webdiffusion:** Maintain JSON shape checks and exact signal mapping; unassigned upcoming meetings remain unassigned.
23. **Europe by Satellite:** Routine schema/duration monitoring; no justification for a larger rewrite.
24. **Italian Senate WebTV:** Monitor source field/channel changes and keep date-filter assumptions tested.
25. **Dutch Debat Direct:** Routine contract monitoring; consider partial-day recovery only when actual failures justify its extra complexity.
26. **Brazil TV Senado:** Maintain daily boundaries and explicit provenance; leave terminal ends unknown.
27. **UK Parliament calendar:** Routine monitoring and bounded last-good recovery; preserve DST-safe clock handling.
28. **Estonia Riigikogu:** Maintain date/type checks; unknown ends stay unknown.
29. **Norway Stortinget:** Monitor standard fields and source-specific room/event filters. Placeholder ends remain outside broadcast ranges.
30. **Sweden Riksdag:** Routine contract monitoring; preserve conditional-start and placeholder-end exclusions.

## Evidence

- [Stabilization findings](2026-10-28-collector-stabilization.md): source isolation, date assumptions, target corrections and recent failures.
- [Three additions and latest verified collection](2026-10-28-priority-collectors.md): actual outcomes, overlaps, stale recovery and hosted HTTP access limits.
- [Taiwan hosted access investigation](2026-10-27-taiwan-actions-access.md): observed 403 evidence, separate from parser correctness.
- [Remaining unimplemented inputs](2026-10-28-unimplemented-collectors.md): a different queue; not included in the 30 above.
