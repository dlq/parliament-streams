# United States Federal and State Candidate Inventory

Date: 2026-08-24

The canonical inventory is
[`data/discovery/us-legislatures.json`](../data/discovery/us-legislatures.json).
It records six federal candidates and one official research starting point for
each of the 50 state legislatures. A verified video surface is evidence for
further research, not yet evidence of a stable channel, embeddability, or
permission to redistribute.

## Federal Candidates

| Priority | Candidate | Role | Current disposition |
| --- | --- | --- | --- |
| High | U.S. House FloorCast / HouseLive | Floor and event video | Existing fallback; separate the stable floor service from rotating events and review House reuse restrictions. |
| High | U.S. Senate Floor Webcast | Floor video and daily schedule | Verified official video surface; discover the supported player route and terms. |
| High | House committee video on Congress.gov | Live and archived committee events | Model as event records rather than permanent channels. |
| High | Congress.gov committee-meeting API | Schedule and event metadata | API-key-backed enrichment candidate, not a video transport. |
| Medium | Senate committee webcasts | Distributed committee event video | Inventory committee sites, vendors, archives, and schedules. |
| Medium | C-SPAN Congress | Broadcaster fallback | Keep separate from first-party Congress sources and preserve C-SPAN-specific licensing. |

## Strong State Candidates

These states have current official evidence of legislative live video, archives,
or both. They should receive the first deep player, schedule, accessibility, and
rights pass.

| State | Confirmed surface | Main research question |
| --- | --- | --- |
| California | Assembly live room feeds and event archives | Add Senate coverage; identify stable room/event identities. |
| Florida | Official video archive and daily broadcast schedule | Separate House, Senate, and joint events; preserve explicit use restrictions. |
| Minnesota | Joint multimedia index, House/Senate live video, schedules, and archives | Determine stable versus event-specific player routes. |
| New York | Assembly live coverage and Senate streamed-event system | Model chambers separately and record their different reuse rules. |
| Oregon | Daily event links to live floor/room video and OLIS archives | Identify player URLs and machine-readable event data. |
| Rhode Island | General Assembly Capitol TV, eight live channels, schedules, and archives | Investigate Cablecast APIs and rights. |
| Texas | Official House/Senate broadcasts and meeting calendars | Inventory chamber and committee-room services separately. |
| Utah | Now Playing, floor video, committee audio/video, calendars, and archives | Discover stable stream and event identifiers. |
| Washington | Legislature-linked TVW live and archived coverage | Treat TVW as an authorized provider and assess its terms separately. |

## Complete State Research Queue

The remaining official roots are retained so that future work is exhaustive and
does not depend on memory:

- Alabama, Alaska, Arizona, Arkansas, Colorado, Connecticut, Delaware, Georgia,
  Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maine,
  Maryland, Massachusetts, Michigan, Mississippi, Missouri, Montana, Nebraska,
  Nevada, New Hampshire, New Jersey, New Mexico, North Carolina, North Dakota,
  Ohio, Oklahoma, Pennsylvania, South Carolina, South Dakota, Tennessee,
  Vermont, Virginia, West Virginia, and Wyoming.
- Wisconsin is marked `blocked_or_changed` because its former WisconsinEye
  route requires a fresh successor/first-party assessment.

Each pass should look for chamber and committee distinctions, stable versus
event-specific identifiers, HLS/DASH or provider embeds, official schedules,
archives, captions and interpretation, source conditions, and redistribution
terms. A legislature should move from `official_root_recorded` only when the
evidence URL is recorded in the JSON.

## Scope Boundaries

- The District of Columbia is not one of the 50 state legislatures and is
  deferred as a separate federal-district candidate.
- Puerto Rico and the other U.S. territories should be handled in a later
  territorial-legislatures pass rather than silently mixed into the state list.
- Open States may help discover event metadata, but official legislative sites
  remain the authority for catalogue identity, video, schedules, and rights.
