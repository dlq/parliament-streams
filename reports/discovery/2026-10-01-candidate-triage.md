# October 1 candidate discovery triage

The [monthly audit](https://github.com/dlq/parliament-streams/actions/runs/36877188739)
reported ten uncatalogued manifest URLs. They represent four official-source
groups, including rendition playlists. The retained
[evidence JSON](2026-10-01-candidate-triage-evidence.json) records browser
provenance, HTTP results, and later same-day checks. A successful master response
alone does not establish playable media or permanent channel stability.

| Source | URLs | Decision |
| --- | ---: | --- |
| Czech Chamber of Deputies Stream 1 | 2 | One new candidate, retained as researching; master plus HD rendition. |
| France National Assembly event 19478557 | 4 | Exact event URLs recorded as `event_specific`; vendor/official master mirrors and two renditions. |
| Thailand Parliament TV | 2 | Existing channel repaired after master, child-playlist, and media-segment validation; recovered master plus 1080p rendition. |
| U.S. Senate floor session `stv100126` | 2 | Exact session URLs recorded as `event_specific`; master plus child rendition. |

## Czech candidate

The [official Stream 1 page](https://www.psp.cz/stream/1) publishes the discovered
HTTPS master for external applications and online players, together with
third-party iframe instructions. This documents live playback and embedding,
without establishing unrestricted recording or redistribution rights. The
[English live page](https://pspen.psp.cz/live-broadcast/) embeds the same vendor
player.

[Wikidata Q320265](https://www.wikidata.org/wiki/Q320265) and
[IPU CZ-LC01](https://data.ipu.org/parliament/CZ/CZ-LC01/parliamentary-mandate/parliamentary-mandate/)
identify the Chamber. The [official weekly programme](https://www.psp.cz/sqw/hp.sqw?k=203)
provides dated sitting times; its parser remains planned.

The morning discovery browser reached the master and HD rendition. At about
18:00 UTC, the master still returned HTTP 200 with CORS enabled, but every
advertised MQ, LQ, HD, and audio-only playlist returned HTTP 404. The
[candidate](../../candidates/czech-chamber-of-deputies.json) therefore remains
`researching`, `needs_review`, and `research_only` pending an active-sitting
playback check. This is a sitting-aware source, not a confirmed always-on feed.

The [accessibility statement](https://www.psp.cz/sqw/hp.sqw?k=32) notes incomplete
caption/audio alternatives on some recordings. The
[Czech sign-language page](https://www.psp.cz/informace-v-ceskem-znakovem-jazyce)
describes separate information videos. Neither establishes live-feed captions,
interpretation, or audio description, so those fields remain unknown.

## France and United States

France's live page resolved to
[event 19478557](https://videos.assemblee-nationale.fr/direct.19478557_6abe55d3d75f4),
matching all four discovered URLs. Its vendor master returned HTTP 404 later
the same day. These endpoints belong in event resolution research for the
existing record; they must not replace a permanent channel URL.

The [Senate floor page](https://www.senate.gov/floor/) loaded the date-scoped
`stv100126` session in the browser. The master subsequently advertised the exact
child video playlist and an English subtitle track, but the video child
returned HTTP 404. The session interpretation follows the date-shaped path and
the official sitting context; the enduring catalogue route remains the official
floor page. Browser access succeeded while a direct Python request returned
HTTP 403, so access-blocking remains distinct from a missing page.

Six **exact URL** decisions cover only these observed French and Senate
endpoints. Future event identifiers, new stable streams, and the unresolved
Czech source are not suppressed. The existing HouseLive decision is unchanged.

## Follow-up

Thailand's restored master and sample media validated, and its existing record
now offers native playback under the current permission-pending project policy.
The Senate link-out, discovery inventory, and rights evidence now use the
current floor page without changing its rights status. New Zealand's obsolete
official viewing link has also been replaced by the Parliament Video service.

The [reconciled findings](2026-10-01-reconciled-findings.json) classify 54 validated
URLs from the morning audit: 42 are catalogued families, ten have recorded
review decisions, and two represent the one Czech candidate. Keep that candidate
visible until an active sitting demonstrates playable media. Future event
resolvers should track official event identity rather than publishing transient
manifests as permanent channels.
