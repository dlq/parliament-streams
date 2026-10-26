# Schedules, IPTV And XMLTV

[Documentation index](README.md) · [Catalogue maintenance](catalogue-maintenance.md)

Run the commands below from the repository root.

## Collection And Programme Data

The canonical catalogue records official schedule pages in `epg_sources`.
Typed Python parsers consume their HTML or JSON, while
`parliament-streams schedules-collect` performs explicit network retrieval and
writes a versioned `schedules.json` snapshot. GitHub Actions runs that collector
every six hours and includes the result in the Pages artifact. The page reads
only that same-origin static JSON; it never scrapes third-party sites.

Schedule snapshot schema v3 stores a normalized rolling event list for each
channel. Every event can record a stable or deterministic identifier, canonical
UTC start/end timestamps, source timezone, status, official event URL, location,
and language. The legacy Now/Next fields remain as a derived compatibility view
for the static catalogue and programme guide.

Each run records generation time, coverage range, event completeness, expected
and populated channel counts, and per-source `ok`, `empty`, or `error` status.
An empty source is distinguished from a fetch/parser error. A failed source does
not prevent successful schedules from being published, while a run with no
successful sources fails before deployment. The scheduled workflow may retain
only still-future events from the preceding successful snapshot for up to 24
hours; those channels are marked stale and never retain a stale Now listing.

Current scraper ids:

- `cpac`
- `quebec-webdiffusion`
- `new-zealand-parliament`
- `ontario-calendar`
- `brazil-tv-camara`
- `europarl-webstreaming`
- `ebs-grid`
- `italian-senate-palimpsest`
- `portugal-open-data-agenda`
- `canada-harmony`
- `uk-parliament`
- `un-webtv-schedule`
- `youtube-live`
- `dutch-debat-direct`
- `spain-canal-parlamento-weekly`
- `quebec-canal-assemblee`
- `brazil-tv-senado-grid`
- `czech-chamber-plenary`
- `estonia-riigikogu-plenary`
- `knesset-tv-guide`
- `germany-bundestag-tv1`
- `ireland-oireachtas-tv-guide`
- `mauritius-parliament-tv-guide`
- `norway-stortinget-calendar`
- `sweden-riksdag-calendar`
- `italy-camera-webtv-events`
- `taiwan-parliamentary-tv-programmes`

They parse supplied HTML/JSON strings. Network fetching remains in the shared
collector rather than inside parser functions, so every run records what was
requested, when it ran, and whether each source succeeded.

Schedule sources use `scraper_status: implemented` when a registered Python
parser exists. Sources without a usable parser remain `planned` and appear as
official outlinks.

As of 2026-10-26, all 261 catalogue source records have at least one official
schedule, agenda, meeting or dated video-event surface recorded. Forty-seven
records use implemented parsers across 33 recorded metadata URLs and 27 collectors;
214 catalogue entries still have planned extraction. These are source-discovery
counts, not populated programme-guide coverage or proof that every surface
describes a broadcast. This pass did not freshly fetch every planned URL. The
jurisdiction filter
includes both parsed-guide records and planned official calendar/navigation links.
These official links remain available if generated programme data cannot load.
Catalogue and schedule use the same sourced jurisdiction-flag registry. The earlier
117-record/106-URL snapshot and the source-by-source discovery baseline in
`reports/epg-discovery-2026-08-24.md` remain historical evidence.

The [Nordic continuation](../reports/epg/2026-10-26-nordic-coverage.md) adds Norway's
official plenary/public-room iCalendars and Sweden's documented chamber XML.
Norwegian written-submission deadlines and Swedish conditional/unknown starts
are excluded. Both preserve official IDs and convert source clocks to UTC;
Swedish ambiguous/nonexistent Stockholm times fail rather than selecting an
offset. Fifteen-minute and one-hour calendar end markers are not programme ends.
Both remain institutional agendas without a reviewed linear-feed mapping.

The [WebTV programme continuation](../reports/epg/2026-10-26-webtv-programmes.md)
adds Italy's featured upcoming Chamber broadcasts and Taiwan's two-channel
programme API. Italy preserves official event IDs and room/category labels;
archive and already-live cards are not upcoming programmes. Taiwan requests the
source's local date separately for `ly1` and `ly2`, preserving the channel label
and broadcast date even when a replay title names an older sitting. Both use
source-zone UTC conversion and retain unknown ends. Neither aggregate portal
is mapped to one continuous XMLTV channel. The iVOD forecast remains planned:
its legacy TLS renegotiation fails under the collector's modern TLS checks;
no TLS security setting is relaxed.

The [renewed institution review](../reports/discovery/2026-10-25-institution-service-baseline.md)
tracks source freshness, timezone/event mapping and programme-data rights
separately. Gipuzkoa's officially linked RSS still contains February 2016 events;
it is not a current guide source. Its sampled committee recording also retains a
camera-clock/session-time discrepancy. Cree Nation's public iCalendar needs date
reconciliation. Bizkaia's timeline discrepancy is now reproduced as a viewer-timezone
display conversion: the same marker reads 03:30 in Toronto, 07:30 in UTC and 09:30
in Madrid. A parser must retain the publisher's event timezone rather than scrape
that browser-formatted clock. [Playback and timing follow-up](../reports/discovery/2026-10-24-service-review-basque-playback-followup.json).

Other renewed leads include Glarus's annual-assembly JSON, Bulgaria's documented
calendar API and California's PDF television schedule. A successful format read
does not establish a current broadcast guide: Bulgaria's sampled upcoming replies
are empty, while California's proposed television programmes lack end times and
can change. Its latest page/PDF update labels both read 21 October, resolving the
earlier observed label discrepancy. No parser or XMLTV coverage is added solely from a feed label, download
control, calendar event or retrospective sitting record.

Mongolia's [official weekly iCalendar](https://tov.parliament.mn/feed/week/TOV-20261026.ics)
now has a confirmed payload: 31 events for 26–30 October, with 29 timed events,
two all-day items, named `Asia/Ulaanbaatar` timezone and distinct UIDs. Every timed
event has a one-hour end interval; all URLs lead to the same weekly page. Confirm
whether those durations are estimates and which meetings actually broadcast before
using them as EPG programmes. [Payload checks and remaining gates](../reports/discovery/2026-10-24-service-review-mongolia-calendar-followup.json).

South Dakota's chamber follow-up also reproduces viewer-local conversion and an
incorrect summer abbreviation on a winter event. Use a named source timezone and
verified timestamp rather than scraping that label. Proposed reconvenings,
cancelled committees, deadline calendars and occasional addresses must be mapped
to an actual broadcast before guide export.
[US chamber timing findings](../reports/discovery/2026-10-24-service-review-us-chambers-c.json).

Collect all implemented sources locally:

```sh
make schedules
```

This writes the ignored development artifact `data/schedules.json`. Equivalent
options are available through the CLI:

```sh
uv run parliament-streams schedules-collect \
  --output data/schedules.json \
  --previous data/schedules.json \
  --stale-ttl-hours 24 \
  --timeout 15 \
  --retries 1
```

Omit `--previous` when testing a clean collection. The option is intended for
scheduled publication, where it provides a bounded last-good fallback during a
temporary source failure.

Parse a saved response with the scraper CLI:

```sh
uv run --extra dev python -m parliament_streams.scrapers cpac /path/to/cpac-schedule.html
```

Quebec uses two official JSON endpoints, so pass the live response first and
the upcoming response second:

```sh
uv run --extra dev python -m parliament_streams.scrapers quebec-webdiffusion live.json upcoming.json
```

The parser command prints metadata from saved inputs and does not fetch the
network. The collector command performs live retrieval and writes the normalized
snapshot consumed by the page.

Audit every unique recorded schedule endpoint without running its parser:

```sh
uv run parliament-streams epg-audit \
  --output reports/epg-validation-YYYY-MM-DD.json
```

The audit reports `reachable`, `access_blocked`, `not_found`, and `error`
separately. A `403` is therefore preserved as runner access evidence, not
misreported as a dead official source.

Audit every recorded non-media supporting link:

```sh
uv run parliament-streams links-audit \
  --output reports/links-validation-YYYY-MM-DD.json
```

This covers official pages, permission evidence, identity sources, and embed
surfaces. Playback manifests and schedule endpoints remain in their specialized
health and EPG reports so each check can apply the right validation rules. For
reachable supporting pages, the report records a bounded response size and
SHA-256 fingerprint to support comparison with later audit artifacts.

Refresh compact validation-history references from retained health reports:

```sh
make validation-history
make validation-history-check
```

The refresh target writes dated report links into catalogue entries and
regenerates the static site data snapshot. The check target fails if the
catalogue's compact validation-history references no longer match retained
`reports/health/` artifacts; it is included in `make verify`.

## IPTV Playlists And XMLTV

The catalogue and schedule pages include a collapsed **Use in an IPTV app**
section with public playlist/guide URLs, copy buttons, and VLC desktop setup
instructions. XMLTV guide coverage is partial and is separate from playlist
playback. The VLC instructions link to VideoLAN’s official documentation.

The public labels are **Continuous channels** and **All supported channels—including
sitting-only streams**. The latter includes the continuous channels plus
sitting-only and event-based feeds, which may be offline between proceedings.
Both playlists use the same technical eligibility checks.

Pages generates IPTV exports after each six-hourly schedule collection:

- `data/stable-hls.m3u`: validated, native-playback HLS with low/medium risk
  and `always_on` availability. Currently four channels: Brazil TV Camara,
  Hellenic Parliament TV, and both Sansad TV channels.
- `data/validated-hls.m3u`: the same eligibility rules with sitting-only and
  event-based sources included. These feeds may be off-air outside proceedings;
  catalogue validation is retained evidence, not a fresh playback guarantee.
- `data/epg.xml`: XMLTV guide data with catalogue IDs matching playlist `tvg-id`
  values. Set this separately as the EPG URL if an app ignores `url-tvg`.
- `data/epg-quality.json`: per-channel source scope, guide eligibility, overlap
  counts, time-provenance counts, and event-level XMLTV exclusion reasons.

Use the published site root `https://dlq.ca/parliament-streams/` followed by
the paths above. These are UTF-8 extended M3U channel lists. Individual entries
still point to their original HLS `.m3u8` media/master manifests.

Use the `.m3u` URLs for VLC and other channel-list readers. The earlier
`stable-hls.m3u8` and `validated-hls.m3u8` filenames remain byte-identical
compatibility exports, but GitHub Pages serves that extension with the HLS MIME
type. VLC 3.0.24 was verified to skip remote channel-list import with that type;
the same content imports with `audio/x-mpegurl`, including all IPTV attributes.
This is a delivery/import distinction, separate from whether each source is
currently on air or playable.
These exports link directly to the original streams under the same playback
policy as the site; CPAC, prohibited/embed-only sources, DASH, YouTube, and
research-only records are excluded from the playlists. Pending rights remain
pending, and no recording or catch-up permission is asserted.

The guide requires a reviewed mapping from the schedule source to a particular
broadcast feed, plus valid timezone-aware start/end times. The reviewed sources
are Brazil TV Camara and TV Senado, CPAC, EBS, the Italian Senate's identified
WebTV1/13440 feed,
the Dutch plenary and Aletta Jacobs rooms, Spain Canal Parlamento, and Quebec's
separate Canal de l'Assemblée (canal17), plus Czech Chamber Stream 1, Estonia
Riigikogu Live 1 and Knesset Channel 99. These are 12 reviewed feed mappings;
an implemented parser or reviewed mapping does not guarantee populated programmes.
Other sources
default to excluded until their feed mapping is reviewed. European Parliament's
parallel event directory remains in the website schedule JSON, with room labels,
but is not exported as a single XMLTV channel. Institutional agendas and other
event directories likewise remain available to the website.

Cancelled, incomplete, duplicate, invalid, and conflicting linear-feed events
are omitted. Every programme involved in an overlap is excluded; no programme
is arbitrarily chosen to represent that timeslot. Channel definitions cover
playlist entries and reviewed broadcast feeds, including CPAC/EBS metadata;
guide availability does not imply IPTV playback rights.

CPAC, Brazil TV Camara, TV Senado and Spain Canal Parlamento infer end times from
the next listing. TV Senado and Spain keep inference within a validated dated
daily table and leave terminal ends unknown. TV Camara currently assumes the
programme date from collection and verifies the active source weekday. These
assumptions are recorded as
`end_basis`/`start_basis` in schedule JSON and disclosed in XMLTV descriptions.
Legacy cached records from those parsers receive the same disclosures. Missing
or nonpositive EBS durations remain unknown instead of creating zero-length
programmes. Bounded retained schedules are also labelled in descriptions.
Official HTML/JSON/calendar URLs in `epg_sources` are research inputs, not
generally importable IPTV guide URLs.

## Coverage And Remaining Work

The quality report now includes `coverage.counts` and a `coverage.channels` entry
for every catalogue source, including sources absent from the current snapshot.
Each entry identifies its implemented and reviewed parsers, event/programme
counts and one of these states: `parser_planned`, `not_collected`, `empty`,
`collection_error`, `mapping_unverified`, `quality_hold`, or `guide_available`.
An XMLTV channel definition is separate from a channel with programme entries.
Pages includes the coverage totals in its Actions summary, and publication
validation checks the coverage against the catalogue and collected events.
Older quality reports without the optional coverage section remain readable.

The [Nordic continuation](../reports/epg/2026-10-26-nordic-coverage.md) records a
later local preview at **18:56:49 UTC**: 776 events across 21 populated schedules,
20 fresh and one last-good Knesset schedule after its known HTTP 403. Norway and
Sweden add 26 identified starts, retaining their calendar-duration and linear-feed
mapping holds. XMLTV remains at 370 programmes across eight populated guides;
14 reviewed mappings, 44 definitions and four stable / 38 broader playlist
entries remain separate from the new event-calendar coverage. These are dated
preview measurements; deployment collects current source data again.

The earlier [26 October continuation](../reports/epg/2026-10-26-coverage-pass.md) and
[measured results](../reports/epg/2026-10-26-coverage-pass.json) record a verified
local publication preview at **05:52:28 UTC**: 787 events, 600 with ends, and
**396 XMLTV programmes across seven populated channels**. Ireland and Germany
contribute 149 and three complete ranges respectively, with exact linear-feed
identity checks. Ireland's 11 terminal daily ends remain unknown. Both viewing
records remain link-outs, with no admission to the playlists. Mauritius adds a
dated start-only event guide, not a linear XMLTV channel mapping.

That earlier checkpoint had 14 reviewed mappings and 44 XMLTV definitions,
distinct from its seven populated guides. The playlists remain four stable / 38 broader entries. All 18
populated channel schedules are fresh; 23 collectors return 17 event collections
and six healthy empty results, with no errors or last-good retention. These are
local measurements, not a claim that this pass has been deployed.

New Zealand now collects the House-only public calendar JSON used by its official
client. The current empty window is independently supported by the official
sitting-status endpoint, while a historical replay confirms the dated event
contract. Sitting intervals can contain parliamentary breaks and remain outside
linear XMLTV. Portugal now preserves official IDs, locations and safe event links;
missing start clocks no longer become midnight, and Lisbon DST gaps/folds remain
unresolved. Its repeated 23:59 calendar ends are not broadcast end evidence.

The 28 recorded metadata URLs include human navigation/recovery links; collectors
record their actual dated HTTP requests separately. See the continuation report
for remaining parser, mapping and time holds and which sources were checked.

The [first 25 October pass](../reports/epg/2026-10-25-coverage-pass.md) remains a
historical checkpoint: 83 programmes across four channels, 37 parser-connected
entries and 16 collectors. The [second-pass results](../reports/epg/2026-10-25-second-pass-coverage.md)
and [measured data](../reports/epg/2026-10-25-second-pass-coverage.json) describe a
verified **local preview at 21:04 UTC on 25 October**, not a completed deployment:
598 events, 474 with ends, and **270 XMLTV programmes across six populated channels**,
including 129 Knesset and 59 TV Senado programmes. An earlier second-pass preview
had 272; one CPAC and one Knesset programme elapsed before this collection.
There are 42 XMLTV channel definitions, distinct from six populated guides.
The playlists remain four stable / 38 broader entries; three broader entries
have populated guides. No new independent playback or reuse permission is implied.
Collection records 12 successful sources, seven empty sources, one New Zealand
error and no retained stale channels.

Dutch agendas use exact room IDs;
the Actualiteitenkanaal retains its mapping hold. Quebec's linear programme
belongs to the separately catalogued canal17 service, never the canal01–14 event
webcasts. Recovered ParlVU/SenVu end times improve website event data while those
mixed-room directories remain outside the linear guide. Spain's current dated
view can legitimately be empty. Czech and Estonian plenary parsers preserve
starts without inventing ends. New Zealand's earlier Blazor-shell failure is
preserved in those historical results; current collection uses the verified API.

EBS future durations and Italian WebTV1 ends remain unknown. Greece's reachable
GRNET metadata describes permanent streaming sessions rather than programmes;
the dated television timetable remains inaccessible. Sansad TV's current
channel-specific indexes time out. Thailand's current monthly TV PDF is a
recurring grid with unresolved timing/layout conflicts, while Denmark, Slovakia,
Chile and Jalisco retain access or feed-mapping holds. Details and bounded
source checks are linked from the second-pass report.

## Source And Viewer Timezones

Parsers interpret printed clocks in the named source zone, or preserve explicit
source offsets, then publish RFC 3339 UTC instants with `source_timezone`
provenance. Source-calendar dates determine request windows, not the collection
runner's date. A naive timestamp cannot be silently converted using the runner's
timezone. Ambiguous autumn clocks and nonexistent spring clocks without an
explicit resolving offset remain unresolved. Printed overnight ends are resolved
on the correct next calendar date before timezone conversion.
Knesset's broadcast-day sequence advances after midnight only through an
explicitly connected preceding end; a bare clock rollback is not enough.

Catalogue and schedule pages display these instants in the viewer's browser
timezone using the selected UI language; changing language does not change the
viewer's timezone. XMLTV writes explicit `+0000` offsets at whole-second precision
for IPTV apps to localize. Regression checks exercise Toronto, Amsterdam and
Auckland, including DST and local dates that differ from the UTC date.

Generate local files from a collected schedule snapshot:

```sh
uv run parliament-streams iptv-export \
  --schedules data/schedules.json \
  --output-dir /tmp/parliament-iptv \
  --epg-url https://dlq.ca/parliament-streams/data/epg.xml
```

The command reports playlist counts, exported programmes, and omitted events.
The quality report's exclusion counts may overlap when one event has multiple
problems. Audit a snapshot independently with:

```sh
uv run parliament-streams schedules-audit \
  --schedules data/schedules.json \
  --output /tmp/parliament-schedule-quality.json
```

Daily catalogue audits retain this report as an Actions artifact. Pages writes
the report alongside XMLTV and summarizes its counts in the deployment run.
Publication preserves valid partial results; a green workflow is not a claim
that all sources have complete or independently verified guide data.
The file formats follow the
[Kodi IPTV playlist conventions](https://github.com/kodi-pvr/pvr.iptvsimple/blob/Matrix/README.md)
and [XMLTV format](https://github.com/XMLTV/xmltv/blob/master/xmltv.dtd).
