# WebTV programme continuation — 26 October 2026

[Measured output and response hashes](2026-10-26-webtv-programmes.json) · [Collection and export rules](../../docs/schedules-and-iptv.md)

This pass adds two supported collectors for existing catalogue records. It also
investigates Taiwan's iVOD forecast and the official French/Luxembourg calendars.
It does not freshly inspect every remaining planned source, promote viewing
sources, play media or expand embed/rebroadcast permissions.

## Measured publication preview

The preview generated at **2026-10-26T21:40:50Z** passes data-product schema and
cross-format validation. Both new collectors succeed through the production
fetcher, with normal certificate verification and TLS settings.

| Measure | Result |
| --- | ---: |
| Catalogue entries | 261 |
| Parser-connected entries / registered collectors | 47 / 27 |
| Entries still awaiting extraction | 214 |
| Populated schedules / fresh populated schedules | 24 / 23 |
| Newly collected Italian / Taiwanese slots | 25 / 23 |
| Events / events with ends across the entire preview | 818 / 584 |
| XMLTV programmes / populated guide channels | 365 / 8 |
| Reviewed mappings / XMLTV channel definitions | 14 / 44 |
| Stable / broader playlist entries | 4 / 38 |

Knesset's known collection error retains last-good future entries; the other
26 collectors return successful populated or healthy empty results. Counts
describe this collection window, not permanent on-air availability. Changes in
the entire snapshot also reflect other publishers and elapsed events.

## Italy: featured upcoming Chamber broadcasts

The [official WebTV portal](https://webtv.camera.it/) publishes dated future
cards with numeric event IDs and room/category labels. Its own client constructs
the event-detail links. The [27 October chamber event](https://webtv.camera.it/evento/32692)
independently confirms 11:00 Rome time, or 10:00 UTC.

The collector retains 25 future events over a 30-day bound, preserves official
IDs and locations, and rejects malformed/truncated containers or conflicting
identities. Rome DST gaps/folds fail rather than selecting an offset. Archive
and already-live cards do not become upcoming broadcasts; passed starts do not
establish current-live status. The featured index is not an exhaustive calendar.
Future ends remain unknown. This multi-room portal is outside linear XMLTV.

## Taiwan: supported two-channel programme API

The [official Parliamentary TV portal](https://www.parliamentarytv.org.tw/)
identifies two television channels and calls its own dated programme API. The
collector requests `ly1` and `ly2` separately over three Taipei-local dates,
retaining 23 upcoming slots and their distinct feed labels. Request dates are
part of the official client contract; replay subtitles naming earlier meetings
never replace the broadcast date. The response has no official programme IDs,
so identities are deterministic, with feed labels included.

The parser rejects malformed arrays, incomplete windows, invalid clocks,
conflicting slots and backwards clock order. It does not infer midnight
rollover, ends from adjacent starts, or current-live status from the API's
`now` flag. Both feeds remain distinct within the aggregate catalogue record;
one combined linear XMLTV channel would be misleading. Separate feed mapping
and trustworthy programme ends remain required before export.

The separate [iVOD forecast](https://ivod.ly.gov.tw/index.php/Forecast) has usable
dated meeting data, but modern OpenSSL rejects its legacy TLS renegotiation.
An older research client can read 17 meetings, and one official detail agrees
on its start. This is source evidence, not a successful production collector.
The route remains planned; no TLS settings are relaxed or alternate protocol
downgrade adopted. Institutional calendar end bounds do not establish TV ends.

## Remaining queue

- France's [official commission broadcast table](https://event2.assemblee-nationale.fr/programme.php)
  is reachable with dated starts. Exact event identity, room/feed bindings and a
  parser remain to implement; no new guide admission is claimed.
- Luxembourg's [official agenda](https://www.chd.lu/fr/agenda) has dated clocks,
  titles and rooms, alongside date-only calendar summaries. Public-broadcast
  scope, identities and end semantics remain to review.
- The current Czech, Estonian, Italian Senate and Spanish mapped guides still
  have events excluded for missing ranges. Other earlier access, mapping and
  time holds remain; this pass does not resolve them by inference.

## Verification

Eighteen focused tests cover parser contracts, feed/room separation, duplicate
conflicts, malformed/empty responses, date handling, DST and collection/export
integration. `make verify` passes: 501 Python tests, nine JavaScript tests,
Ruff formatting/linting, strict mypy for 72 source files, maintained data/schema
checks and HTML/browser/interaction/Axe checks. Combined statement/branch
coverage is 93.66%; the new source, test and report files pass credential scans.
All four playlists are byte-identical to the preceding release.

The fresh local preview renders Italian/Taiwanese listings correctly at desktop
width and 390px without horizontal overflow. Italy's 27 October 10:00 Rome start
shows 05:00 EDT; Taiwan's 27 October 07:20 Taipei slot shows 19:20 EDT on 26
October. New-preview console checks are clear. An older local preview origin
stalled with missing shared globals; a fresh preview origin renders correctly.
No media was played. The previously recorded singular-result wording issue
(`1 channels with schedule data`) remains a separate localization follow-up.

These are local checked changes, not a completed deployment or a fresh audit of
the entire outstanding queue.
