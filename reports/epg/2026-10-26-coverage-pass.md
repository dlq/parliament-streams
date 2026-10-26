# EPG coverage continuation — 26 October 2026

[Schedules and IPTV](../../docs/schedules-and-iptv.md) · [Measured results and all-source states](2026-10-26-coverage-pass.json) · [Previous pass](2026-10-25-second-pass-coverage.md)

This pass implements selected missing collectors, verifies two exact linear-feed
mappings, restores New Zealand's collection contract and improves Portuguese
agenda metadata. It does not freshly validate every planned URL or change
playback admission or source reuse rights. The measurements below describe the
verified local preview before publication. Pages regenerates live schedules and
exports separately, so these counts are not a claim about the current live snapshot.

## Measured publication preview

The combined collection at **05:52:28 UTC** validates as an assembled publication
bundle. All 18 populated channel schedules are fresh; no last-good retention is
used. The 23 collectors return 17 successful event collections and six healthy
empty results, with no collection errors.

| Measure | Published snapshot at 04:57:43 UTC | Local preview at 05:52:28 UTC |
| --- | ---: | ---: |
| Catalogue entries | 270 | 270 |
| Entries connected to implemented parsers | 41 | 44 |
| Registered collectors | 20 | 23 |
| Reviewed feed mappings | 12 | 14 |
| Channels with collected events | 14 | 18 |
| Events / complete time ranges | 627 / 450 | 787 / 600 |
| XMLTV programmes / populated channels | 246 / 5 | 396 / 7 |
| XMLTV channel definitions | 42 | 44 |
| Stable / broader playlist entries | 4 / 38 | 4 / 38 |
| Collection errors | 1 | 0 |

Snapshot differences also include elapsed programmes and publisher updates.
The newly implemented collectors contribute **164 events and 152 exportable
ranges** in this preview; that contribution is distinct from the net change
between two differently timed collections. The seven populated XMLTV channels
are TV Câmara, TV Senado, CPAC, Knesset, Dutch plenary, Bundestag TV1 and
Oireachtas TV. A channel definition alone does not claim programme coverage.

## Confirmed changes

- [Ireland and Germany](2026-10-26-europe-next.json): Ireland's specific linear
  `oirtv` player is paired with an official dated guide containing explicit Unix
  starts and ends. It supplies 160 current/future events, including 149 complete
  ranges. Eleven terminal daily slots repeat their start as their end; those
  ends remain unknown. Germany's channel-1 preview supplies three complete
  programmes for 4–6 November. Displayed dates and clock ranges must agree with
  the official Unix end; unrelated channels, conflicting duplicates and truncated
  guide markup are rejected. Both catalogue records remain link-outs; their new
  guide mappings do not admit them to either playlist. Ireland's official viewing
  URL now identifies the exact linear channel rather than the multi-stream portal.
- [Mauritius](2026-10-26-asia-africa-next.json): the official dated guide supplies
  one main-chamber event on 27 October at 11:00 Mauritius time / 07:00 UTC, with a
  stable UUID and official event link. The detail page's same-day end precedes
  its start. No overnight assumption, duration or live status is invented. This
  remains event-directory data, excluded from linear XMLTV.
- [New Zealand](2026-10-26-oceania-next.json): public resources declared by the
  official calendar client establish a House-only JSON endpoint. The live window
  returns `[]`, independently supported by the official sitting-status response.
  A bounded historical replay produces three identified House sittings with
  three explicit ranges. The collector now reports a healthy current empty
  window instead of a Blazor-shell error. Committees, malformed replies,
  conflicting IDs and ambiguous Auckland clocks fail the contract. These are
  institutional sitting intervals, excluded from XMLTV until feed continuity and
  breaks are resolved. The human calendar link remains available for recovery.
- [Portugal and existing-source timing](2026-10-26-existing-source-times.json):
  missing start clocks no longer become midnight; all-day items are excluded,
  while an explicit midnight remains valid. Lisbon DST gaps/folds are not guessed.
  Twenty current meeting records retain official IDs, locations and safe links.
  Their repeated 23:59 calendar end fields do not establish broadcast ends and
  remain unused. The institutional agenda is not newly mapped to ARTV's linear feed.

## Remaining queue

All 270 catalogue records retain explicit coverage states:

| State | Entries |
| --- | ---: |
| Parser planned | 226 |
| Implemented collection, no events in this window | 26 |
| Events, linear-feed mapping unverified | 8 |
| Reviewed mapping, insufficient programme times | 3 |
| At least one exportable programme | 7 |

Forty-four records are connected to implemented parsers through 28 recorded
metadata URLs, including human navigation/recovery URLs. Those URLs are not a
count of HTTP requests. Twenty-three collectors record their actual dated
requests separately; 238 unique metadata URLs retain planned extraction.

South Korea NATV still returns HTTP 400 through the checked official routes.
Australia's checked parliamentary broadcast-index route remains blocked; its
existing YouTube collector still supplies live-event metadata without programme
ranges or a resolved mapping for parallel chamber/committee feeds. EBS supplies 13 future
starts with zero durations. The checked Italian replies contain other WebTV
rooms, not the reviewed WebTV1 feed. TV Câmara still needs stronger calendar-date
evidence than its active weekday tab. Greece/Sansad access, Thailand's recurring
PDF and other previously documented access/mapping/time holds remain unresolved;
they were not all rechecked here. No fixed lengths, blanket next-day bridging or
simultaneous-room copying is used to inflate guide counts.

## Verification

All **471 Python tests** and **eight JavaScript tests** pass. Strict mypy passes
for **68 source files**; Ruff formatting and linting pass. Combined statement and
branch coverage is **93.52%**. The assembled playlists, schedules, quality report
and XMLTV pass cross-format publication validation. No official media was played.

The local site renders all 18 populated rows without horizontal overflow or
runtime warnings/errors. Ireland uses the exact channel link; Germany's November
event displays EST after the Toronto DST change, while Mauritius's October start
displays EDT. New Zealand's healthy empty result retains its human calendar link.
The single-channel result label still uses plural wording; that existing UI
localization follow-up is recorded in the plans.
