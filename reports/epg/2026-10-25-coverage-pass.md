# EPG coverage improvement — 25 October 2026

[Schedules and IPTV](../../docs/schedules-and-iptv.md) · [All-source queue and measured results](2026-10-25-coverage-pass.json)

This pass improves recorded official sources and classifies the remaining parser
queue. It does not newly fetch every planned programme URL or certify all streams.

## Measured Local Export

The fresh collection at **19:58 UTC** on 25 October validates as an assembled
publication bundle. It has 16 collectors: nine with data, seven empty, no errors
and no retained stale channels.

| Measure | Previous checked deployment | This local export |
| --- | ---: | ---: |
| Catalogue sources | 269 | 270 |
| Sources connected to implemented parsers | 33 | 37 |
| Channels with collected events | 9 | 10 |
| Collected events | 376 | 403 |
| Events with complete time ranges | 190 | 287 |
| XMLTV programmes | 51 | 83 |
| Channels with XMLTV programmes | 2 | 4 |
| Stable / broader IPTV entries | 4 / 38 | 4 / 38 |

The new Dutch plenary guide contributes **14 programmes** and Quebec's separate
Canal de l'Assemblée contributes **17**. CPAC also advances from 31 to 32 between
the two collections; the comparison is not a controlled claim that all 32 extra
programmes came from code changes. Brazil contributes 20 in both snapshots.

The XMLTV file has **41 channel definitions**, distinct from four channels with
programmes. Two of the 38 broader playlist entries have programme data: Brazil
and the Dutch plenary feed. CPAC and Quebec's linear TV guide do not imply new
independent playback admission; Quebec is published as an official viewing-page
link. Its existing jurisdiction geometry, search, sourced flag and exact
`canada--quebec` inventory crosswalk also cover the new entry.

## Confirmed Improvements

- [Dutch room broadcasts](2026-10-25-dutch-room-guide.json): official dated JSON
  supplies programme IDs, exact room IDs and explicit-offset start/end times.
  Plenary and Aletta Jacobs mappings stay separate; the sampled Aletta window
  has no events. Other rooms and the Actualiteitenkanaal are not inferred.
- [Canadian guides](2026-10-25-canada-guide-mappings.json): recover 65 published
  ParlVU/SenVu end times. Those portals still mix parallel rooms and remain
  outside linear XMLTV. Quebec's official player identifies canal17 separately
  from canal01–14, and its dated weekly page yields 17 explicit time ranges.
- [Spain and access holds](2026-10-25-new-linear-parsers.json): the dated weekly
  Canal Parlamento collector works with its source-specific compatible HTTP
  header. The current week is legitimately empty. `Fin Anterior`, ambiguous
  clocks and unknown overnight boundaries are not invented programme times.
- [Existing source times](2026-10-25-existing-source-times.json): EBS preserves
  positive fractional durations, official IDs and Brussels request dates.
  Italy requires both WebTV1 and channel 13440, excluding other simultaneous
  rooms. Brazil verifies the active São Paulo weekday and preserves its
  explicitly disclosed collection-date/inferred-end assumptions.

## Remaining Coverage Queue

The new `epg-quality.json` coverage section includes **every catalogue ID**,
including entries missing from parsed snapshots. The JSON companion preserves
the observed state of all 270 entries:

| State | Sources | Meaning |
| --- | ---: | --- |
| `parser_planned` | 233 | Recorded official source; automated extraction remains to implement |
| `empty` | 27 | Implemented collection produced no events for this catalogue ID in this window |
| `mapping_unverified` | 5 | Events exist, but their directory/agenda does not establish one broadcast feed |
| `quality_hold` | 1 | Reviewed feed has events without exportable time ranges |
| `guide_available` | 4 | At least one programme passes the XMLTV rules |

Eight catalogue feeds have reviewed guide mappings. This is separate from the
four populated guides. Of 320 excluded events, 313 have an unverified mapping and
116 lack a complete time range; reasons overlap and must not be added together.

Priorities are EBS programme ends, exact room/feed evidence for institutional
directories, current accessible Greece/Sansad/Denmark programmes, and missing
parsers for the remaining recorded sources. EBS future durations are zero and
past listings have genuine gaps, so next-start inference is unsupported. Italian
WebTV1 events likewise omit ends. Greece/Denmark direct HTTP access is blocked;
India's current schedule times out. Historical PDFs and indexed snippets do not
become current guide feeds. Brazil still lacks an explicit broadcast calendar
date; recording dates in titles cannot resolve it.

## Verification

Parser tests cover identifiers, room separation, explicit/missing ends, source
dates, changed/empty/stale markup, midnight and DST. Shared UTC serialization
rejects naive timestamps; named-zone wall clocks reject unresolved DST gaps and
folds. Full muted browser/HTML/Axe checks pass, including actual catalogue and
schedule rendering in Toronto, Amsterdam and Auckland before/after changing UI
language. No source media was played.

All **391 Python tests** and **eight Node tests** pass. Ruff formatting/linting
and strict mypy pass for 61 Python source files. Runtime statement/branch
coverage combines to **93.08%**, above the existing 90% minimum. Maintained data,
snapshot, exact-crosswalk, link and evidence checks also pass. A stale test's
14-entry Quebec assumption was replaced with its actual institution-name
contract so the distinct linear TV entry remains covered.

Coverage is schema-checked and reconciled with catalogue/parser/event facts
before publication. The Pages Actions summary now reports parser, event,
reviewed-mapping and populated-programme totals separately.
