# Schedule collector error review, 20 November 2026

The [successful Pages run 44695163830](https://github.com/dlq/parliament-streams/actions/runs/44695163830)
published a snapshot generated at 07:29:06 UTC with three collector errors.
These findings describe that snapshot and a subsequent local check of the
official endpoints.

## Harmony JSON

The House endpoint returns a published, not-started event with ID 46159, an
empty string title, a valid November 24 start, and a room. Its modification
timestamp is November 18 at 16:44:40 UTC. The parser previously rejected that
row and discarded the entire shared collector result, including valid Senate
and Bermuda responses.

The parser now logs and omits an explicitly blank title inside the collection
window, while retaining valid events. Missing or non-string titles, invalid IDs,
invalid timestamps and conflicting event records still fail validation. If
untitled events leave no usable events in the window, collection reports an
error. The title is required for a published schedule event.

The current local responses produced 27 House events, 27 Senate events and
two Bermuda events, omitting event 46159 with a warning. A regression test
covers the mixed-publisher case and the all-untitled failure case.

Official inputs:

- [House](https://parlvu.parl.gc.ca/Harmony/en/api/Data/GetUpcomingEvents?lastModified=19700101000000000)
- [Senate](https://senparlvu.parl.gc.ca/Harmony/en/api/Data/GetUpcomingEvents?lastModified=19700101000000000)
- [Bermuda](https://sg001-harmony.sliq.net/00290/Harmony/en/api/Data/GetUpcomingEvents?lastModified=19700101000000000)

Hosted verification of this parser change remains pending deployment.

## New York Senate

The hosted snapshot records HTTP 403, with 80 consecutive failures.
A local request to the [official ICS export](https://www.nysenate.gov/session/calendar-download)
returned HTTP 200 and parsed successfully into an empty upcoming window.

The official [events page](https://www.nysenate.gov/events) still links the
session export. The [Open Legislation calendar API](https://openleg.nysenate.gov/static/docs/html/calendars.html)
describes legislative calendar documents and their publication dates; those
timestamps do not establish a timed House broadcast schedule.

The parser is functioning on the current local export. No supported
hosted-access fix was demonstrated. The access hold remains tracked in
[#55](https://github.com/dlq/parliament-streams/issues/55) and the recurring
alert [#66](https://github.com/dlq/parliament-streams/issues/66).

## Taiwan parliamentary television

The hosted snapshot records HTTP 403, with 86 consecutive failures.
All six local requests made with the collector's production request settings
for the three Taipei dates and both feeds succeeded. The parser produced
48 upcoming events. These responses are local observations.

The [existing hosted investigation](2026-10-27-taiwan-actions-access.md)
already tested the official API, homepage, published JavaScript, normal AJAX
headers and independent HTTPS clients. It found CloudFront 403 responses
throughout the hosted environment. The current hosted failure is consistent
with that access hold.

No supported hosted-access fix was demonstrated. Operator-supported access or
an equivalent dated feed remains necessary, tracked in
[#53](https://github.com/dlq/parliament-streams/issues/53).


## Subsequent hosted investigation

The [Linux/macOS and local comparison](2026-11-20-hosted-access-comparison.md)
identifies Cloudflare challenges on New York's hosted responses and variable
CloudFront blocking for Taiwan. One hosted Linux API probe succeeded, while
the complete Taiwan collector failed with HTTP 403 on the next fresh Linux
runner. This updates the earlier access observations without establishing
reliable hosted recovery.
