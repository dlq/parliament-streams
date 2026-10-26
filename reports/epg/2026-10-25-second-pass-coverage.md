# Second EPG coverage pass — 25 October 2026

[Schedules and IPTV](../../docs/schedules-and-iptv.md) · [Measured results and all-source states](2026-10-25-second-pass-coverage.json) · [Previous pass](2026-10-25-coverage-pass.md)

This local implementation pass adds four collectors and investigates selected
remaining sources. It does not newly fetch every planned programme URL. Playback
admission and reuse rights are unchanged; a usable guide does not grant either.

## Measured publication preview

The final collection at **21:04:12 UTC** validates as an assembled publication
bundle: 20 collectors, 12 with events, seven empty and one source error. All 13
populated channel schedules are fresh; none use retained stale data.

| Measure | Previous deployed pass | Final local preview |
| --- | ---: | ---: |
| Catalogue entries | 270 | 270 |
| Entries connected to implemented parsers | 37 | 41 |
| Reviewed feed mappings | 8 | 12 |
| Channels with collected events | 10 | 13 |
| Events / complete time ranges | 403 / 287 | 598 / 474 |
| XMLTV programmes / populated channels | 83 / 4 | 270 / 6 |
| XMLTV channel definitions | 41 | 42 |
| Stable / broader playlist entries | 4 / 38 | 4 / 38 |
| Broader playlist entries with programme data | 2 | 3 |

The earlier 20:49 preview contained 272 programmes. One CPAC and one Knesset
programme elapsed before the final collection. Snapshot differences include
normal changes to the collection window, not just implementation changes.

## Confirmed improvements

- [Knesset](2026-10-25-second-pass-knesset.json): the official linear guide
  yields 130 distinct complete ranges at the earlier check, 129 still in the
  final window. The official live page confirms the existing catalogue feed.
  Duplicate desktop/mobile cards are reconciled by official ID. Explicit
  overnight continuity is preserved in `Asia/Jerusalem`; ambiguous backwards
  clocks and DST folds/gaps are not guessed. Hebrew titles remain as published,
  without assuming a spoken language from the title script.
- [TV Senado](2026-10-25-second-pass-americas.json): the official daily linear
  table yields 62 events and 59 complete ranges over three São Paulo dates.
  Adjacent starts supply ends only within each documented daily table. Its three
  terminal ends remain unknown. Programme links open the human schedule page;
  exact dated requests remain in collection provenance.
- [Czech Chamber and Estonia](2026-10-25-second-pass-central-europe.json):
  numbered Prague sitting notices and Tallinn's official plenary API now feed
  the schedule. Estonia is mapped only to the Session Hall feed, with five
  upcoming starts. Neither source supplies ends, so neither is promoted to
  XMLTV programmes. Czech current/next-week requests currently yield no future
  plenary sitting in the collection window.
- [New Zealand](2026-10-25-second-pass-new-zealand.json): the official calendar
  currently returns an unrendered Blazor loading shell. This now produces an
  honest collection error rather than a misleading empty calendar. Recognized
  rendered calendars, status messages and genuine empty months remain supported.
- Programme titles and rooms are isolated by text direction in both catalogue
  and schedule; viewer-local clocks stay left-to-right. Mixed Hebrew/Latin text
  and escaped markup pass browser checks in three viewer timezones.

The final programme totals are Câmara20, TV Senado59, CPAC31, Knesset129, Dutch
plenary14 and Quebec linear TV17. Knesset is the third broader-playlist feed with
programme data. CPAC, Senado and Quebec guide availability does not change their
existing playback admission.

## Remaining queue and evidence

All 270 catalogue entries have an explicit machine-readable coverage state:

| State | Entries |
| --- | ---: |
| Parser planned | 229 |
| Implemented collection, no events in this window | 27 |
| Collection error | 1 |
| Events, feed mapping unverified | 5 |
| Reviewed mapping, insufficient programme times | 2 |
| At least one exportable programme | 6 |

Of 328 excluded events, 313 lack a verified feed mapping and 124 lack a complete
time range. These reasons overlap. Twenty collectors connect 41 catalogue
entries through 24 distinct implemented-source URLs; 241 planned URLs remain.

[Greece, Sansad and EBS](2026-10-25-second-pass-linear-holds.json) retain concrete
holds. Greece's permanent transmission bounds span years and are not programmes;
the current programme index is blocked. Sansad's TV2 index exposes dated XLSX
leads, but a current retrievable grid is unresolved. EBS future durations remain
zero and historical gaps rule out blanket next-start inference. Correct official
Greece, Denmark and Sansad TV2 links are retained as planned source metadata.

[Thailand's current official PDF](2026-10-25-second-pass-thailand.json) was
rendered and inspected on all four pages. It is a weekday template with merged
cells, separate time axes and open-ended parliamentary broadcasts; it needs a
careful parser and cannot yet supply dependable complete programme ranges.
Presigned download credentials were excluded from saved evidence. Chile access
and Jalisco's parallel-room/feed-identity holds are recorded in the Americas
report. None of these holds establish absence of official programming.

## Verification

All **427 Python tests** and **eight Node tests** pass; strict mypy passes for
65 source files. Ruff formatting/linting pass. Combined runtime statement/branch
coverage is **93.28%**. Maintained-data, snapshot, crosswalk, publication-product
and sanitized-evidence checks pass. HTML/browser/Axe checks include desktop,
mobile, mixed-direction programme text and viewer dates in Toronto, Amsterdam
and Auckland across language changes. Browser audio was muted before navigation;
no official media was played. This report records verification before publication.
