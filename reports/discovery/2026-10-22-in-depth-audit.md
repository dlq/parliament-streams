# October 22 in-depth official-stream audit

This pass rechecked all 101 previously published entries, browsed 78 catalogue
pages and 76 maintained discovery pages, refreshed all 25 Tier 1 and 46 Tier 2
country targets, and sampled actual media beyond reachable masters. It is a
bounded official-source expansion pass, not an exhaustive search of every
legislature, room, or jurisdiction.

## Existing catalogue

The [HTTP health report](../health/2026-10-22-catalogue-health.json) records
82 OK, five warnings, and 14 errors. Browser results are retained separately
for the [catalogue](../health/2026-10-22-catalogue-browser.json) and
[discovery targets](../health/2026-10-22-discovery-browser.json).
Of the 78 catalogue pages, 68 returned 200, eight returned 403, one returned
202, and one had no HTTP result. Browser probes permit certificate errors for
observation; they do not establish TLS validity. The separate HTTP and media
checks verify TLS.

The [media audit](../health/2026-10-22-hls-media.json) checked 52 existing HLS
records plus two Czech routes. Forty-one existing feeds and Czech Stream 1
passed bounded MPEG-TS/fMP4 signature sampling; 11 existing routes and Czech
Stream 2 did not. Each probe follows the first advertised variant and samples
at most 8 KiB of the first media segment. This verifies sample delivery, not
full audiovisual quality, every rendition, or that proceedings are underway.
No DRM keys were fetched or video recordings retained.

- Switzerland: repeated master 404s also occur in the official player. Retain
  its published embed/rights evidence, but require an active-sitting route
  recheck before native playback resumes.
- Estonia feed 2: the master is intermittent and sample media playlists return
  404 on initial and [follow-up](../health/2026-10-22-targeted-media-followup.json)
  checks. All four advertised renditions also failed in the
  [all-rendition check](../health/2026-10-22-estonia-all-renditions.json). Keep the
  URL as research evidence rather than exporting it as playable.
- Luxembourg is unreachable from this network; Nunavut's retained legacy host
  fails DNS. Both were already research-only and remain so. Network reachability
  is not evidence that an official service has permanently closed.
- Spain's five supplementary feeds still expose masters with failing sample
  renditions. They remain research-only. The main Canal Parlamento feed passes.
- El Salvador fails TLS verification. Do not disable certificate checks to
  enable playback. Other official-page 403s remain access-block evidence.
- Norway media works technically, but its documented retransmission agreement
  requirement still makes the catalogue link-out only. Rights gates are unchanged.

## Additions

### Czech Chamber of Deputies: direct HLS

The [official Stream 1 page](https://www.psp.cz/stream/1) explicitly publishes
an external-player HLS master and third-party iframe code. The previously
researching candidate now passes master, rendition, media, and CORS checks.
Its [media sequence advanced](../health/2026-10-22-czech-live-progression.json)
from 16319319 to 16319338 with no end marker. A fresh
[HLS.js browser player](../health/2026-10-22-czech-hls-browser-decode.json)
decoded 720x405 video, 78 frames, without player errors. A separate official-page
navigation timed out; the bulk official-page browser check succeeded, and the
explicit master decoded independently.

Promote the existing candidate as sitting-only, medium risk, native playback.
Its documented live-playback/embed permission does not imply unrestricted
recording or redistribution. Live accessibility stays unknown. The weekly
programme remains a planned source, not an implemented XMLTV schedule.

### Sweden and Finland: official-page link-outs

Add [Riksdag Webb-TV](https://www.riksdagen.se/sv/webb-tv/) and
[Eduskunta webcasts](https://verkkolahetys.eduskunta.fi/). Official pages,
Wikidata/IPU identity, dated event surfaces, and source terms were reviewed.
All three new catalogue routes returned 200 in the
[promotion health report](../health/2026-10-22-promoted-sources-health.json).
No permanent raw HLS route was established for either Nordic portal.

[Swedish guidance](https://www.riksdagen.se/sv/om-webbplatsen/hjalp-och-support/sa-fungerar-webb-tv/)
distinguishes selected archived AI captions from currently uncaptioned live
broadcasts; sign-language coverage is event-dependent. Its
[rights page](https://www.riksdagen.se/sv/om-webbplatsen/rattigheter-for-bild-film-och-webb-tv/)
requires Riksdag source credit for webcast use.
[Finnish terms](https://verkkolahetys.eduskunta.fi/fi/kayttoehdot) allow linking
and unaltered use under attribution/context conditions, with YLE credited when
it produces the signal and Parliament otherwise. No unsupported live
accessibility claims were added. These portal records do not become IPTV or
XMLTV channels merely because they have dated event listings.

## Discovery triage

The [original findings](2026-10-22-findings.json) contain 61 validated manifest
URLs, including renditions; these are not 61 new channels. After promotion and
exact-URL review, the [reconciled report](2026-10-22-reconciled-findings.json)
classifies 45 as catalogue families, 12 as reviewed, and four as unresolved.

- Four Czech URLs now belong to the promoted Stream 1 family.
- Four France event-19612474 URLs and two C-SPAN event.448413 URLs are session
  media, not standing channel replacements. Exact-URL decisions leave future
  event identifiers and possible stable feeds discoverable.
- Guyana's official homepage loaded an expiring signed Vimeo VOD route. It is
  evidence of official video, not a permanent live endpoint.
- Chile's official TV page loaded a separate `salaiv` master/rendition and a
  media sample passed. Retain one researching candidate until specific room
  identity, schedule mapping, and reuse scope are established.
- Two Malaysian manifest seeds remain unresolved: the official homepage did
  not establish their player provenance in this pass. Do not promote on a
  technically reachable third-party seed alone.

The full-catalogue browser pass adds further leads beyond the maintained
national watchlists. The [combined findings](2026-10-22-complete-findings.json)
contain 82 unique validated manifest URLs: 51 catalogue families, 19 reviewed,
and 12 unresolved URLs. The unresolved group consists of three BC room feeds
(six master/rendition URLs), Chile Sala IV (three URLs across the two runs), two
Malaysian seeds, and one additional Jalisco-page manifest requiring provenance
review. BC's existing conditional replay/excerpt rights are not expanded into a
new full-live rebroadcast permission claim. These discoveries remain leads, not
automatic channel promotions.

Five Northern Ireland Vimeo URLs and two NWT Boxcast URLs are signed event
routes, now recorded as exact-URL event-specific decisions. Northern Ireland's
existing formal-agreement restriction remains binding in catalogue playback
policy; NWT's video rights remain pending. This audit reviewed the new sources'
terms, not a fresh legal assessment of every existing source's terms.

The catalogue grows to 104 entries. All 104 now have compact retained health
history. Pending-rights count remains 38. The strict always-on playlist remains
four channels; broader eligible HLS becomes 38 after adding Czech Stream 1 and
withholding Switzerland and Estonia feed 2. Six candidate records are promoted
history; Chile Sala IV is the one remaining researching candidate. Event and
room schedule mapping, inactive-feed rechecks, and wider U.S./regional expansion
remain future work.
