# First catalogue expansion batch — 2026-10-22

Eight additions bring the catalogue to **112 sources**: five national and three subnational records. All eight are **official viewing links**, with no new direct HLS feeds, provider embeds or implemented XMLTV parsers.

| Source | Scope | Published behaviour |
| --- | --- | --- |
| [Japan House of Representatives WebTV](https://www.shugiintv.go.jp/jp/) | national | Open official service; event-based |
| [Japan Senate (Sangiin) WebTV](https://www.webtv.sangiin.go.jp/webtv/index.php) | national | Open official service; event-based |
| [Austria Parliament Mediathek](https://www.parlament.gv.at/aktuelles/mediathek) | national | Open official service; event-based |
| [Mauritius National Assembly Parliament TV](https://parliamenttv.govmu.org/) | national | Open official service; event-based |
| [Italy Chamber of Deputies WebTV](https://webtv.camera.it/) | national | Open official service; event-based |
| [Nagasaki Prefectural Assembly Committees](https://www.pref.nagasaki.jp/gikai/youtube/live.html) | subnational | Open official service; event-based |
| [Córdoba Legislature Video](https://legislaturacba.gob.ar/vivo/) | subnational | Open official service; event-based |
| [Santa Catarina TV Alesc](https://www.alesc.sc.gov.br/tv/) | subnational | Open official service; event-based |

Nagasaki has a retained [committee map](2026-10-22-nagasaki-committee-map.json): eight current committees and three historical ones. These are institution-provided YouTube channel mappings, not eight HLS channels or eight validated physical rooms.

Santa Catarina is listed on official institutional evidence, with local browser/HTTP timeouts explicitly retained. Its live player was not validated.

## Held candidates

- **iceland-althingi**: The official broadcast guide documents plenary and open-committee coverage and permits distribution of the Althingi channel. Chromium received a 403 challenge. Keep researching until a current normal-browser player and supported stream route can be checked; do not restore a historical watchlist HLS URL solely because it existed.
- **sweden-skane**: The official regional assembly web-TV page was identified, but Chromium received HTTP 403 Access Denied. Retain the source for a current player, event/schedule and reuse-terms check before promotion.
- **france-senate**: Chromium returned HTTP 200 and displayed a live service for plenary, committee and delegation proceedings, currently with no broadcast. Senate legal notices require prior webmaster notification for hyperlinks as well as attribution and noncommercial context. No notification was sent; promotion remains pending that condition and confirmation of its applicable scope.

## Audit progress

The national ledger records an initial discovery pass across all 71 maintained Tier 1/Tier 2 countries. The separate subnational inventory now contains **522 searched jurisdictions across 31 countries**, up from 434 across 25. The new 88 cover Czechia, Slovakia, Poland, France, Greece and Uruguay.

The global inventory is incomplete: 40 countries still need a first-level scope/inventory pass, and special-status or related territories remain explicit follow-ups in several countries already represented. An initial search is not active playback, rights, caption, room mapping or EPG validation. No absence of a stream is inferred from missing search results.

Evidence: [promotion decisions](2026-10-22-expansion-decisions.json), [browser access](../health/2026-10-22-expansion-browser.json), [review follow-up](../health/2026-10-22-expansion-review-followup.json), [national ledger](2026-10-22-country-research.md), [subnational ledger](2026-10-22-subnational-research.md).

## Next work

- Complete first-level scope/inventories in the remaining 40 countries, with primary-source evidence before inclusion or exclusion.
- Work through the special-status/territorial scope notes without duplicating legislatures or conflating provinces with cities.
- Validate current players and event/schedule mappings for the next promotion batch, including the additional Dutch and Danish committee services.
- Resolve supported direct HLS routes only from official player evidence, and implement/validate schedule parsers before claiming IPTV/XMLTV coverage.

Validation: `make verify` passed (109 Python tests, one skipped, 91% branch-aware coverage; HTML, desktop/mobile Playwright and Axe checks passed). The retained local preview schedule was preserved.


Map usability: searching by a parent country now finds its regional sources,
including Argentina/Córdoba. Regression checks cover all three new regional
relationships. A further local browser pass verified all eight source links at
1280px and 320px and confirmed that they present official link-outs without
native players or horizontal overflow. The post-fix HTML/Playwright/Axe suite
passed.
Country-name search was subsequently extended consistently to the catalogue and
map using shared parent-country relationships. Canada includes Alberta, Ontario
and Québec alongside national entries; localized country names are also tested.


## Subsequent inventory follow-up

The subnational ledger now records 557 initial jurisdiction searches across 35
country audit groups, up from the 522/31 baseline above. This includes 11 core
bodies in Ireland, Malta, Rodrigues and Tobago, and 24 special-status/associated
or capital bodies. Grouping related territories with a country is for research
navigation; each record carries its constitutional relationship and scope note.
All original 40 remaining countries received a primary scope-source access
attempt; 36 still lack individual jurisdiction inventories. Overseas, disputed
and other special-status coverage remains incomplete. These research additions
have not been promoted to catalogue entries or validated HLS streams.


## Wider run and territorial follow-up

The latest ledger supersedes the intermediate progress counts above: **1,121
initial jurisdiction searches in 58 country audit groups**, plus **13 country
scope dispositions** where the reviewed evidence did not establish a core
regional legislature. Special-status completeness and source validation remain
open. All 71 national audit groups have now received a national discovery pass
and an initial regional inventory or recorded scope disposition.

The discovery net included councils that are outside the public catalogue.
The agreed [scope rule](../../docs/catalogue-scope.md) is substantive legislative
authority, not deliberation, an elected membership or the name “assembly”.
Per-row eligibility assessments now separate excluded planning/service/local
bodies, core legislature candidates and authorities needing individual review.
These 1,121 rows are not 1,121 eligible parliaments or usable streams.

Five clear parliamentary services were added as official viewing links:
Jersey States Assembly, Tynwald (audio and committee video), French Polynesia
Assembly, New Caledonia Congress and Sint Maarten Parliament. The catalogue
now contains **117 sources: 50 national, 61 subnational/territorial, six
supranational**. See [decisions](2026-10-22-territorial-decisions.json) and
[official-page evidence](../health/2026-10-22-territorial-webcasts.json).
Seven further parliamentary services retain explicit readiness gaps; no new
live-media, direct HLS or XMLTV-parser validation is implied.

All 42 published subnational/territorial jurisdictions now have map geometry.
The earlier Nagasaki, Córdoba (Argentina), Santa Catarina (Brazil) gaps are
closed. Tiny Jersey, Isle of Man and Sint Maarten outlines supplement the
coarse overview; Mauritius also needed a missing national outline. Territorial
search associations are separate from map parents, so Crown Dependencies are
not presented as UK provinces and Sint Maarten is not a Dutch province.
Official planned calendar/event links are available in a compact disclosure on
the schedule page, separately from programme-guide rows. Existing localized
strings and runtime territory names cover the interface; source names and
research notes remain in their recorded languages.

IPTV export verification with the retained schedule produced the same four
strict stable channels and 38 validated HLS channels; the five link-only
additions are excluded. The retained snapshot produces 70 XMLTV programmes;
that is a local compatibility check, not fresh guide-quality evidence.


Final checks: `make verify` passed (109 Python tests, one skipped, 91% coverage;
HTML, desktop/mobile Playwright and Axe). Additional local Chromium and WebKit
checks passed at 1280px and 320px for all five source deep links, flags, map
selections and official calendar outlinks, with no page errors or horizontal
overflow. The retained programme snapshot contains seven guide rows; 33 is the
separate catalogue-record count with implemented schedule metadata.
Small-island location dots make otherwise tiny outlines visible while retaining
real boundaries and keyboard selection. Browser plugin was unavailable; the
project's regular Playwright runtime was used.
