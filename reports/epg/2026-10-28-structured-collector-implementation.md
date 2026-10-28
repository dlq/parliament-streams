# Five Structured Collector Implementations — 28 October 2026

[Machine-readable evidence](2026-10-28-structured-collector-implementation.json) · [Source policy](../../docs/schedules-and-iptv.md#source-selection)

Implemented all five shortlisted collector families, covering seven viewing records. Current totals: **26 collectors, 42 parser-connected records, 31 metadata URLs**. No viewing source, playback permission or linear guide mapping was added.

| Collector | Live validation | Published meaning |
| --- | --- | --- |
| Câmara events JSON | 16 future events | Institutional starts, official IDs; bounded pagination |
| California calendar exports | Three future events | Explicit export parameters, start only; malformed ICS is not repaired |
| Harmony JSON | House 36 events; Senate 21; Bermuda healthy empty | Official event IDs/status, Toronto/Bermuda clocks; meeting windows |
| US Senate hearings XML | HTTP 403 | Parser tested against established public-client contract; fresh XML body unverified |
| New York session ICS | HTTP 403 | Publisher-owned export configuration corroborates fields; actual time precision unverified |

The earlier Harmony probes used a 15-digit watermark. The publisher formatter specifies three millisecond digits: `19700101000000000` succeeds at all three sites. This corrects the request, without reviving the retired presentation scraper.

California export links supply fully dated starts which agree with the public listing; its sampled ICS has empty UID and invalid `VALUE=DATE` date-times. Collection reads only the machine-readable calendar-link parameters, ignores generated two-hour ends and uses America/Los_Angeles. Câmara institutional events do not resolve TV Câmara replay dates.

Senate XML fixtures follow the [established public client](https://github.com/unitedstates/congress/blob/main/congress/tasks/committee_meetings.py). New York fields/path are corroborated by the [publisher-owned calendar view configuration](https://github.com/nysenate/NYSenate.gov-Website-D9/blob/main/config/sync/views.view.session_calendar.yml). These are contract evidence, not fresh successful endpoint bodies. Senate also returned access denied in the browser. No access restrictions were bypassed. New York floating/all-day-only or recurrent records remain explicit precision/contract holds; no midnight programmes are invented.

## Measured Local Collection

At **2026-10-28T18:33:28Z**: **20 successful, three empty, three error sources**; **752 events across 21 fresh schedules**, no stale recovery. Errors: Senate XML, New York ICS and existing Knesset, all HTTP 403. Harmony is one collector for three publishers: its overall success includes a valid empty Bermuda response.

The exported bundle passes product-schema and cross-format validation: **241 XMLTV programmes, 44 channel definitions, four stable and 38 broader playlist entries**. New institutional/event-directory sources have no reviewed linear mapping and add no XMLTV programme ranges. Programme totals are time-sensitive and should not be compared as same-input changes.

The existing scheduled action discovers these registered collectors and their canonical
associations. No additional workflow is needed. Regenerated catalogue data exposes
the new metadata inputs.

## Remaining Work

- Confirm supported access, a nonempty live Senate XML body and current New York ICS time precision.
- Check the first hosted run after publication; local success does not establish GitHub runner behavior.
- Continue structured discovery for remaining inputs; this pass does not establish that those sources lack JSON, XML, ICS or semantic metadata.

Focused tests cover source-zone/DST ambiguity, calendar precision, malformed/changed containers, official IDs, empty lists, cancellation, bounded pagination and mapping scope. Verification passed: **466 Python tests, 94% coverage, nine JavaScript tests,**
HTML validation, browser interaction/accessibility checks, lint/format, strict
type checking (71 files), generated-data checks and product schemas. Focused
contract tests were rerun after explicit-date and XML CDATA hardening.
