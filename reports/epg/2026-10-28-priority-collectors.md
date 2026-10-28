# Three Prioritized Collectors — 28 October 2026

Later same-day decision: [structured collector retention](2026-10-28-structured-collector-retirement.md)
retires nine collectors, including the French and Luxembourg additions. Current
scope is 21 collectors / 35 records. The measurements/ranking below are the earlier
checkpoint, not the active implementation queue.

[Measured results](2026-10-28-priority-collectors.json) ·
[Remaining unimplemented inputs](2026-10-28-unimplemented-collectors.md)

## Implemented Coverage

All three previously ranked additions now have registered, typed collectors and
catalogue associations. The catalogue remains **261 viewing sources**; there are
now **30 collectors**, **46 parser-connected records**, 36 implemented metadata
URLs and **215 records without an implemented collector**. Programme extraction
does not change media playback or reuse rights. Existing catalogue IDs, map/search
membership and link-out viewing policies remain intact. Generated catalogue data
and the inventory service baseline use the new parser associations.

| Collector | Confirmed source contract | Publication boundary |
| --- | --- | --- |
| [Rhode Island Capitol TV / Cablecast](https://capitoltvri.cablecast.tv/) | Public Remix loader data explicitly pairs site 1, `scheduleChannelId=1`, `liveStreamId=1`, the default stream-1 URL and `America/New_York`. Schedule rows carry stable run IDs, `runDateTime` and `endDateTime`. | Default channel 1 only, not all eight streams. Unknown/changed site mappings fail. Deleted runs and other channel/site IDs are excluded. Use run dates, never recording `eventDate`. The root page exposes a bounded rolling window, not an exhaustive multi-channel schedule or documented permanent API. |
| [French commission broadcasts](https://event2.assemblee-nationale.fr/programme.php) | The official public-broadcast table gives full French weekday/date/year, a broadcast-start column and commission/event heading. | Parallel broadcasts remain separate website events. Inner agenda clocks do not split the broadcast into invented programmes. No reliable ends or linear-feed mapping: outside XMLTV. The listing is for public commissions/events, not an exhaustive plenary agenda. |
| [Luxembourg broadcast agenda](https://www.chd.lu/fr/agenda) | Current and next dated weeks; stable session/meeting IDs and visible local clocks. Admit only cards with the publisher's `Retransmis` TV badge. | Archive-only `Vidéo disponible` cards and unmarked meetings are excluded. Desktop/mobile clocks must agree. The epoch attribute corroborates the local day at midnight; it does not supply the start clock or resolve DST ambiguity. Hidden “En direct” templates never imply live status. No confirmed ends/linear mapping: outside XMLTV. |

French source-date parsing is shared with the existing Quebec linear guide,
preserving its weekday agreement checks and avoiding a second month-name parser.
Both new European collectors use the existing DST-safe source-zone conversion.
They do not guess ambiguous autumn or nonexistent spring clocks. Site-side viewer
conversion still uses the existing UTC/source-zone metadata.

## Fresh Collection And Export

The local run at **2026-10-28 16:06:46 UTC** returned **22 ok, six empty and two
errors** across 30 collectors: **24 channel schedules, 780 events, 23 fresh channels
and one explicitly stale UK calendar**. Knesset still returned HTTP 403. The UK
request hit its 12-second timeout; bounded last-good recovery preserved 92 future
calendar events and removed stale Now information. This run used no retries.

The new collectors returned **28 Rhode Island ranges**, **19 French broadcast
starts**, and **three Luxembourg broadcast starts**. All three were fresh. Their
JSON events preserve source zones, official URLs and IDs where available. France
uses deterministic generated IDs because the table does not publish event IDs.

The validated export contains **246 XMLTV programmes across seven populated
channels**, **45 channel definitions** and four stable / 38 broader playlist
entries. There are now **15 reviewed scraper/feed associations**, with Rhode
Island's default feed added. The new metadata does not admit independent media
playback or add a playlist stream.

Rhode Island contributes **26 exportable programmes**. Two source rows overlap
by three seconds (run 33155 ends 02:30:03 UTC on 29 October; run 33152 starts at
02:30:00). The existing quality gate excludes both; this collector does not trim
the publisher's times or choose a winner. France and Luxembourg remain outside
XMLTV despite improving website schedule discovery. The earlier 221-programme
snapshot is a different collection window, not a controlled count comparison.

## Hosted Access And Verification

The existing [GitHub audit run](https://github.com/dlq/parliament-streams/actions/runs/40696700432)
recorded all three official pages reachable at **13:30:13 UTC**: Rhode Island
1,916,357 bytes, France 35,503 bytes and Luxembourg 240,710 bytes. This is direct
hosted-runner HTTP evidence, not a hosted execution of the new code or a guarantee
against future access changes. The new dated Luxembourg requests succeeded in
local collection; their first hosted parse remains a release check.

A separate full-schedule-page probe for Rhode Island returned a small page without
the expected loader state. It is not used as a silent fallback. The root page's
explicit rolling window is the implemented contract.

Regression cases cover exact feed/site identity, recording-vs-broadcast dates,
other streams, deleted rows, duplicate/conflicting IDs, source truncation, valid
empty containers, naive/invalid ranges, UTC DST folds, French weekday and body
clock handling, Luxembourg broadcast badges, hidden live templates, midnight date
markers, duplicate mobile/desktop clocks, week scope and DST gaps/folds. Shared
malformed-response isolation automatically exercises all 30 registered collectors.
Publication validation checks the collected JSON, playlist, XMLTV and quality
bundle. `make verify` passes: **522 Python tests**, strict typing across **76 source
files**, formatting/linting, JavaScript tests, HTML, browser interactions and
accessibility. No live broadcaster
media or audible playback was used.

## Remaining Unimplemented Inputs

The [complete catalogue-derived list](2026-10-28-unimplemented-collectors.md) contains
**231 distinct input URLs / 237 associations** on 228 records. Of those records,
215 have no collector and 13 already have an implemented source plus unimplemented
alternatives. It separates **19 broadcast/webcast inputs**, **four structured-data
or document inputs**, **63 calendar/meeting inputs** and **145 archive/navigation
surfaces**. These are discovery inputs, not 231 commitments to build bespoke
scrapers. Existing blocked collectors are maintenance holds, not unimplemented
sources. Inventory-only leads are explicitly outside this catalogue-derived list.

No new collector beyond these three was started. Review that remaining list for
value before selecting another implementation batch.
