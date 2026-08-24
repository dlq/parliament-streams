# Schedule and EPG Discovery - 2026-08-24

## Scope

This pass reviewed all 86 catalogue channels, representing 59 distinct
jurisdiction and legislature combinations. Multiple channel records often share
one institutional agenda, so channel count is not the same as source count or
programme-guide coverage.

After this pass, every channel has at least one official schedule, agenda,
meeting, forecast, or programme surface in `epg_sources`. The catalogue now
contains 75 unique EPG URLs: 17 attached to implemented scrapers and 58 retained
as planned parser or link-only sources.

A fresh `epg-audit` checked all 75 URLs at `2026-08-24T21:06:13Z`: 57 were
reachable, 12 were access-blocked, none returned not-found, and 6 produced
environment, timeout, TLS, or response-size errors. The France and European
Parliament structured endpoints exceeded the audit's 5 MiB safety limit; that
is a collector constraint, not evidence that either source is unavailable.

## Why the Programme Guide Shows Seven Channels

The previous audit's 29-channel figure came from a compatibility collector that
associated generic and placeholder projections with related channels. It was
not a count of channels with useful Now/Next listings.

Schedule schema v3 only publishes real dated events returned in the active
collection window. The snapshot generated at `2026-08-24T20:38:04Z` contains:

- 7 channels with 159 normalized events;
- 7 successful populated sources;
- 5 successful but currently empty sources; and
- 1 failed source.

The schedule page renders all seven channel records in that snapshot. It does
not hide another 22 channels, and it no longer presents placeholders as if they
were programmes.

## Newly Recorded Official Sources

Highest-priority structured sources:

- France National Assembly open-data agenda ZIP:
  `https://data.assemblee-nationale.fr/static/openData/repository/17/vp/reunions/Agenda.json.zip`
- Brazil Chamber Open Data events API:
  `https://dadosabertos.camara.leg.br/api/v2/eventos`
- European Parliament Open Data meetings API:
  `https://data.europarl.europa.eu/api/v2/meetings`

The three channels that previously had no EPG source now have official
discovery targets:

- Thailand Parliament meeting schedule:
  `https://www.parliament.go.th/view/457/%E0%B8%81%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B8%E0%B8%A1/TH-TH`
- Mongolian Parliament meeting timetable: `https://tov.parliament.mn/`
- Taiwan Legislative Yuan IVOD forecast:
  `https://ivod.ly.gov.tw/index.php/Forecast`

Better direct programme or calendar surfaces were also recorded for Norway,
Denmark, Greece, Israel, Slovakia, the Council of the European Union, New South
Wales, and Queensland. France's broadcast programme page and the structured
sources above were retained alongside existing sources rather than replacing a
working parser prematurely.

## Additional Findings

The official-source search also confirmed useful existing or candidate
surfaces for the Bundestag plenary agenda, Luxembourg Chamber calendar,
Oireachtas committee and TV schedule, Scottish Parliament What's On, Senedd and
Northern Ireland calendars, Netherlands live debates, PACE live sessions,
Ontario committee video, and several Canadian and Australian subnational
legislatures.

An Estonia parliamentary API documents calendar endpoints, but the required
query contract was not verified sufficiently to add a canonical URL in this
pass. India, Costa Rica, El Salvador, Chile, Jalisco, Andalusia, Navarre, and
North Rhine-Westphalia did not expose a clearly better stable machine-readable
source than the official pages already recorded.

## Parser Priorities

1. Implement the France, Brazil, and European Parliament structured sources.
2. Parse Taiwan's forecast, Mongolia's timetable, and Thailand's meeting
   schedule.
3. Add narrow parsers for Norway, Denmark, Greece, Israel, and Slovakia.
4. Improve event-to-channel mapping for Ontario, New South Wales, Queensland,
   and other institutions with multiple rooms or channels.
5. Keep sources `planned` until fixtures and tests prove dated event extraction,
   timezone handling, stable identity, and empty/off-session behavior.

This discovery pass records official surfaces, not a claim that every source is
machine-readable, currently populated, CORS-enabled, or suitable for direct
redistribution.
