# Nordic EPG continuation — 26 October 2026

[Measured results and source hashes](2026-10-26-nordic-coverage.json) · [Schedules and IPTV](../../docs/schedules-and-iptv.md) · [Earlier continuation](2026-10-26-coverage-pass.md)

This pass adds official Norwegian and Swedish institutional calendar collectors,
with explicit programme-time and feed-mapping limits. It also rechecks selected
Denmark, Greece and Finland leads. It does not freshly check every remaining
planned URL, promote viewing sources or change media/rebroadcast permission.
No official media was downloaded or played.

## Measured local publication preview

The assembled preview generated at **2026-10-26T18:56:49Z** passes publication
schema and cross-format validation. Twenty populated schedules are fresh and
Knesset retains last-good data after its known HTTP 403. Both new collectors
succeed with fresh source responses.

| Measure | Deployed catalogue separation | This local preview |
| --- | ---: | ---: |
| Catalogue sources | 261 | 261 |
| Parser-connected sources | 43 | 45 |
| Registered collectors | 23 | 25 |
| Planned catalogue records | 218 | 216 |
| Populated schedules | 19 | 21 |
| Events / explicit or inferred ends | 760 / 588 | 776 / 588 |
| XMLTV programmes / populated guides | 370 / 8 | 370 / 8 |
| Reviewed mappings / XMLTV definitions | 14 / 44 | 14 / 44 |
| Stable / broader playlist entries | 4 / 38 | 4 / 38 |

The new sources add **26 start-only events**: 15 Norwegian events and 11 Swedish
events. Net differences between collections also include publisher changes and
elapsed events. Both remain institutional agendas without linear XMLTV admission;
calendar coverage is useful separately from a continuous television guide.
All four playlist files are byte-identical to the preceding deployed release.

## Norway: plenaries and public-room hearings

The [official subscription page](https://www.stortinget.no/no/Hva-skjer-pa-Stortinget/abonner-pa-kalenderhendelser/)
identifies separate plenary and hearing iCalendars. They carry UTC starts and
stable UUIDs. Ten plenary starts agree exactly with the independently published
[long-term programme](https://www.stortinget.no/no/Hva-skjer-pa-Stortinget/Moteprogram/?w=0&yw=all).
Five hearings name public rooms exposed by the official viewing page. The
inspected October/November hearing entries also contain 33 written-submission
deadlines; those are excluded, as are other non-room entries and cancellations.

Both calendars publish 15-minute end markers, including meetings whose own
notes say they continue for hours. Those markers are discarded. Starts retain
`Europe/Oslo` as source timezone, official IDs, location and safe official links.
Missing, floating or malformed starts, conflicting IDs, unexpected links and
truncated/unrecognized calendars fail the contract. The collector covers a rolling
30-day window and does not infer current-live status from a passed start alone.
The aggregate Nett-TV page offers parallel rooms; no single linear-feed mapping
or programme end is established.

## Sweden: explicit chamber starts

The [documented calendar API](https://www.riksdagen.se/sv/dokument-och-lagar/riksdagens-oppna-data/kalender/)
provides chamber-specific XML with official UIDs, source clocks and explicit
start-status fields. The [announced 3 November election webcast](https://www.riksdagen.se/sv/webb-tv/video/val/val-av-riksdagens-rad-for-riksrevisionen_hec120261103va/)
independently publishes **12:00 UTC**, matching **13:00 Europe/Stockholm** in the
calendar. Named-zone localization handles summer/winter offsets and rejects
ambiguous or nonexistent clocks. It never uses the viewer's local timezone to
interpret source clocks.

`Ingen starttid` and `Efter debattens slut` carry numeric values used for ordering;
those do not establish start times. All nonempty start-status markers remain
excluded. The one-hour calendar ends are not broadcast durations and are omitted.
Eleven explicit upcoming chamber starts survive the 30-day filter. Conflicting
UIDs, wrong organs, missing fields, truncated XML, entity declarations and list
count mismatches fail the contract. A correctly shaped empty list is distinct
from access/format failure. The multi-event video portal remains unmapped to a
single continuous linear feed.

The [open-data guidance](https://www.riksdagen.se/sv/dokument-och-lagar/riksdagens-oppna-data/)
allows calendar-data use with Sveriges riksdag credited. This does not grant new
media playback or rebroadcast rights; viewing policies are unchanged.

## Still unresolved

- **Denmark:** the official TV-channel guide returns HTTP 403 with both the
  research client and ordinary browser compatibility header. Keep its parser
  planned until a supported official programme response is available.
- **Greece:** the official television-programme route again returns HTTP 403.
  No dated ranges or new mapping are claimed.
- **Finland:** the plenary page exposes archive `publishingDate` values and a
  linked future-plan page. A past title's 13:00 clock agrees with 10:00Z in summer,
  but publication timestamps do not establish future broadcast starts. The
  fetched future-plan response is a client-rendered shell without usable rows.
  Do not turn recurring weekday guidance into dated broadcasts.
- The earlier EBS/Italian and Czech/Estonian end-time gaps, TV Câmara date
  provenance, Spain's unresolved terminal slots, and other named parser/mapping
  holds remain explicit. They were not all freshly rechecked here.

Current coverage states: **216 planned**, 24 implemented but empty in this window,
nine with events but no reviewed linear mapping, four reviewed mappings with
insufficient programme times and eight with at least one exportable programme.
These are preview measurements, not a completed deployment. Pages regenerates
schedules and exports from source responses when the change is published.

## Verification

All **483 Python tests** and **eight JavaScript unit tests** pass. Strict mypy
passes for **70 source files**; Ruff formatting/linting and generated-data,
schema, discovery and service-baseline checks pass. Combined statement/branch
coverage is **93.58%**. Focused tests cover DST ambiguity/gaps and summer/winter
conversion, placeholder/unknown times, source identities, written submissions,
duplicate conflicts, healthy empty responses versus shape/access failures,
collector integration and exclusion from linear export. Credential scans find
no recognized secrets in the new modules, tests or source-evidence report.

HTML and maintained browser/interaction/Axe checks pass. The local schedule page
loads, filters Norway/Sweden correctly, and renders without horizontal overflow
on desktop and at 390px. Source time conversions are verified visibly: Norway's
2 November 12:00 UTC hearing and Sweden's 3 November 12:00 UTC election display
07:00 EST in Toronto, after its DST change. Both remain event listings, with no
current-live or linear-guide claim. No relevant console warnings/errors or
framework overlays appear; no media was played. The existing singular-result
plural wording remains a separately recorded localization follow-up.

These checks validate this scoped addition and the assembled preview; they do
not constitute fresh verification of every planned source or a new deployment.
