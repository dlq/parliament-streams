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

They parse supplied HTML/JSON strings. Network fetching remains in the shared
collector rather than inside parser functions, so every run records what was
requested, when it ran, and whether each source succeeded.

Schedule sources use `scraper_status: implemented` when a registered Python
parser exists. Sources without a usable parser remain `planned` and appear as
official outlinks.

As of 2026-10-22, all 117 channel records have at least one official schedule,
agenda, meeting, or dated video-event surface recorded. This is source coverage,
not programme-guide coverage: 17 unique URLs have implemented parsers, while
89 of the 106 recorded URLs remain planned or link-only research sources. See
`reports/epg-discovery-2026-08-24.md` for the dated source-by-source discovery
baseline.

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

Pages generates IPTV exports after each six-hourly schedule collection:

- `data/stable-hls.m3u8`: validated, native-playback HLS with low/medium risk
  and `always_on` availability. Currently four channels: Brazil TV Camara,
  Hellenic Parliament TV, and both Sansad TV channels.
- `data/validated-hls.m3u8`: the same eligibility rules with sitting-only and
  event-based sources included. These feeds may be off-air outside proceedings;
  catalogue validation is retained evidence, not a fresh playback guarantee.
- `data/epg.xml`: XMLTV guide data with catalogue IDs matching playlist `tvg-id`
  values. Set this separately as the EPG URL if an app ignores `url-tvg`.
- `data/epg-quality.json`: per-channel source scope, guide eligibility, overlap
  counts, time-provenance counts, and event-level XMLTV exclusion reasons.

Use the published site root `https://dlq.ca/parliament-streams/` followed by
the paths above. `.m3u8` here is a UTF-8 channel list, not an HLS media manifest.
These exports link directly to the original streams under the same playback
policy as the site; CPAC, prohibited/embed-only sources, DASH, YouTube, and
research-only records are excluded from the playlists. Pending rights remain
pending, and no recording or catch-up permission is asserted.

The guide requires a reviewed mapping from the schedule source to a particular
broadcast feed, plus valid timezone-aware start/end times. The reviewed sources
are Brazil TV Camara, CPAC, EBS, and the Italian Senate palimpsest. Other sources
default to excluded until their feed mapping is reviewed. European Parliament's
parallel event directory remains in the website schedule JSON, with room labels,
but is not exported as a single XMLTV channel. Institutional agendas and other
event directories likewise remain available to the website.

Cancelled, incomplete, duplicate, invalid, and conflicting linear-feed events
are omitted. Every programme involved in an overlap is excluded; no programme
is arbitrarily chosen to represent that timeslot. Channel definitions cover
playlist entries and reviewed broadcast feeds, including CPAC/EBS metadata;
guide availability does not imply IPTV playback rights.

Brazil and CPAC infer end times from the next listing; Brazil currently assumes
the programme date from the collection date. These assumptions are recorded as
`end_basis`/`start_basis` in schedule JSON and disclosed in XMLTV descriptions.
Legacy cached records from those parsers receive the same disclosures. Missing
or nonpositive EBS durations remain unknown instead of creating zero-length
programmes. Bounded retained schedules are also labelled in descriptions.
Official HTML/JSON/calendar URLs in `epg_sources` are research inputs, not
generally importable IPTV guide URLs.

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
