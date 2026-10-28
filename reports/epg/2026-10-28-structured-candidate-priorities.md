# New Structured Collector Priorities — 28 October 2026

**Historical shortlist:** all five now have [implementations and measured results](2026-10-28-structured-collector-implementation.md). Harmony succeeds with the corrected 17-digit watermark; Senate/New York live access remains held. The probe outcomes below retain their original scope.

[Measured discovery evidence](2026-10-28-structured-candidate-priorities.json) · [Selection policy](../../docs/schedules-and-iptv.md#source-selection)

This is a bounded pass over promising sources, not an exhaustive format audit of all 243 inputs. The active registry remains at **21 collectors**; no new collector was implemented or promoted. Prefer useful explicit event metadata, supported access and a small reusable contract over increasing collector count.

## Work Order

| Priority | Candidate | Evidence and readiness |
| ---: | --- | --- |
| 1 | [Brazil Câmara institutional events](https://dadosabertos.camara.leg.br/api/v2/eventos) | **next implementation candidate**. Fresh bounded response contains seven upcoming meetings with official IDs, dated starts, status and room/organ fields. |
| 2 | [California Assembly event calendar](https://www.assembly.ca.gov/events) | **validation before implementation**. Three advertised upcoming event-calendar links. One fetched ICS has an empty UID and declares VALUE=DATE for date-time values; no source timezone is supplied in that sample. |
| 3 | [Harmony public JSON family: Canada House, Canada Senate, Bermuda](https://sg001-harmony.sliq.net/00290/Harmony/javascript/upcomingEvents.js) | **request contract investigation**. Published script requests api/Data/GetUpcomingEvents and consumes ContentEntityDatas with ScheduledStart/ScheduledEnd. Isolated requests using a historical lastModified value returned HTTP 500 at all three sites. |
| 4 | [U.S. Senate committee hearings](https://www.senate.gov/general/committee_schedules/hearings.xml) | **access hold**. The official hearings page links to this XML feed; the normal collection client returned HTTP 403 in this pass. The public page currently reports no hearings. |
| 5 | [New York Senate session calendar](https://www.nysenate.gov/session/calendar-download) | **access hold and precision unverified**. The official events page advertises adding all session dates to a calendar; the normal collection client returned HTTP 403. |

**Only Brazil is the next implementation candidate.** California and Harmony enter a bounded validation queue. The Senate and New York stay parked until access changes; they are not instructions to spend another pass retrying headers. The order is an engineering judgment about value, evidence and likely maintenance, not measured reliability.

## 1. Brazil Câmara institutional events

Corroborate source timezone; implement bounded pagination, cancellation and genuine-empty handling. Publish institutional events separately from TV replay times. No linear XMLTV mapping is implied.

## 2. California Assembly event calendar

Resolve malformed ICS/date types and corroborate source-zone semantics. Treat generated end times as unverified planned boundaries until corroborated. If useful starts cannot be established without guessing, defer. Do not quietly turn this into a presentation scraper.

## 3. Harmony public JSON family: Canada House, Canada Senate, Bermuda

Reproduce the exact public request/session/parameter contract and obtain real nonempty JSON before implementing. HTTP 500 from the probe does not establish that the publisher API is generally broken. Verify each publisher identity and Toronto/Bermuda timezone independently; never revive the retired HTML parser as fallback.

## 4. U.S. Senate committee hearings

Establish ordinary collector/hosted access and corroborate a nonempty XML example, including source clocks and stable identity. Keep committee-calendar metadata separate from continuous broadcast ranges. Do not prioritize repetitive header work.

## 5. New York Senate session calendar

Obtain and inspect the calendar body through supported access. Determine whether it has actual clocks or only sitting dates. Date-only events are useful calendar metadata, not fabricated midnight programmes.

## Other Findings

- **British Columbia:** Embedded Drupal/FullCalendar JSON confirmed, with America/Vancouver, 145 entries and IDs. In Session entries sampled are historical multi-day noon-bounded blocks; no current upcoming session example was found. Holidays dominate the non-session remainder. Low priority until genuinely useful current session/meeting granularity is established; do not interpret noon placeholders as broadcasts.
- **Scotland:** The sampled business page had no JSON-LD, microdata, datetime or ICS hints in this bounded inspection. Its TV homepage script refreshes /Home/ContentPartial, a presentation partial rather than a demonstrated structured event feed. Further structured-feed discovery only; absence is not established and no new HTML parser is prioritized.
- **Minnesota:** Combined calendar is reachable; inspected hints point to a calendar-details request. No suitable event JSON/XML/ICS contract was verified. Discovery only; no implementation priority yet.
- **European Parliament published meetings JSON:** Previously verified JSON contains coarse meeting-day boundaries. An existing broadcast collector already supplies event listings. Treat as a possible structured replacement/metadata enrichment, not a new coverage win or automatic source of broadcast starts/ends.
- **France JSON agenda ZIP:** Previously observed 8,547,225-byte archive exceeds the shared fetch cap; meeting-vs-broadcast mapping is unresolved. Defer until a bounded supported route is found.
- **Senedd / Northern Ireland:** Existing observed pages provide useful presentation listings; Northern Ireland JSON-LD describes page/site/breadcrumbs, not the webcast entries. A suitable structured schedule feed has not been verified. Do not reinstate plain HTML collection merely because those pages are easy to read.

## Limits And Next Step

Brazil has a verified documented structured source with nonempty upcoming records; it is not already an admission-ready collector. Timezone, cancellations, pagination, freshness and publisher identity still require normal implementation tests. It restores institutional metadata for a record whose TV presentation scraper was retired, without claiming to restore TV replay dates or a linear EPG.

California’s malformed ICS is not a reason to build a permissive universal calendar parser. Corroborate usable machine-readable starts or ask the publisher for a correct feed; leave ambiguous fields unknown. Harmony is a potential shared JSON family, not permission to evaluate JavaScript, guess private credentials or restore the deleted card regex. Its exact public request contract remains unconfirmed.

No source here has been admitted to XMLTV or playlists. Meeting-calendar end fields, generated two-hour windows, noon boundaries, upload dates and whole-day placeholders must not become broadcast programme ranges. Calendar identity/timezone/recurrence/cancellation semantics and rights remain separate review gates.

Bodies and scripts remain temporary local discovery artifacts; this report retains retrieval times, hashes, public routes and bounded findings. Native-client 403s and isolated 500 probes are scoped observations, not claims of universal source unavailability.
