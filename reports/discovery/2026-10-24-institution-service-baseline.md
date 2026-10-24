# Eligible institution service baseline — 24 October 2026

[Research status](../../docs/research-status.md) · [All eligible records](2026-10-24-institution-service-baseline.json)

The public list's 948 default entries comprise **940 eligible records and eight
specific authority holds**. These are mixed institutional grains: umbrella
legislatures, chambers, formations and organs. They are not 948 separate
parliaments, jurisdictions or broadcasts. The eight holds remain outside the
eligible service queue.

## Coverage and progress

| Measure | Records | Meaning |
| --- | ---: | --- |
| Current eligible identity queue | 940 | All exact eligible inventory IDs |
| Exact documented catalogue matches | 190 | Identity-to-source crosswalks, referencing 220 distinct catalogue IDs |
| No documented exact catalogue match | 750 | A crosswalk gap; not a finding that no official service exists |
| Historical regional service cohort | 652 | Earlier metadata/route checks and selected deeper validation; gaps retained |
| Outside that historical cohort | 288 | New chambers, national identities and newly admitted institutions |
| New individual source follow-ups in this run | 302 | Partial source checks with dated evidence and unresolved claims |
| Outside historical cohort, without this run's follow-up | 0 | Every expanded identity now has an individual follow-up |
| Marked complete across all requested dimensions | 0 | The baseline does not certify source-wide metadata, media, EPG and rights completion |

All **103 main national chamber identities** now have a renewed individual source
follow-up, alongside separate constitutional organs and regional bodies. Within
the historical regional cohort, 14 Czech assemblies have renewed follow-ups and
638 retain their earlier checks. All 288 records outside that cohort now have
an individual renewed follow-up. Together, those two evidence stages account
for every one of the 940 eligible identities; none is left without a recorded
individual service disposition. The 638 earlier checks are not a fresh replay
or current-page inspection in this renewed batch.

The older checks and all 302 renewed follow-ups still have unresolved dimensions.
**Zero unreviewed expanded identities is not zero validation work**; combining
these buckets into one completion percentage would conceal differences in evidence depth.

The canonical catalogue has 243 sources. Thirty-three source records have an
implemented schedule parser. Its aggregate permission labels are retained as
source evidence, not converted into permission for every use.

## New source follow-ups

| Group | Records | Main confirmation and remaining gate |
| --- | ---: | --- |
| [Canadian treaty legislatures](2026-10-24-service-review-canada-treaty.json) | 4 | Own-site media/calendar references and dated proceedings documents; access, date conflicts and source integrity remain material |
| [Basque foral assemblies](2026-10-24-service-review-basque-foral.json) | 3 | Official routes and selected substantive playback; later WebKit seeking, timing, audio and per-use rights retain specific gaps |
| [India autonomous councils](2026-10-24-service-review-india-autonomous.json) | 10 | Institutional route evidence and designated Chakma/Lai video channels; no decoded service or broadcast guide validated |
| [Budapest and City of Zagreb assemblies](2026-10-24-service-review-capital-assemblies.json) | 2 | Exact institutional/provider designation and agenda routes; playback, event mapping and independent reuse conditions remain open |
| [Special formations and organs](2026-10-24-service-review-special-organs.json) | 6 | Distinct joint/shared or annual organs, official document/media routes and Glarus JSON; exact-service mapping and current annual coverage remain open |
| [Croatian counties](2026-10-24-service-review-croatian-counties.json) | 20 | Each assembly has a source disposition; several official video/audio routes, no decoded county service certified |
| [US national/state chamber batch](2026-10-24-service-review-us-chambers-a.json) | 26 | Two national and 24 state chambers with separate provider, schedule and rights observations; no fresh decoded playback |
| [National coverage-gap countries](2026-10-24-service-review-national-gaps.json) | 23 | Belgian House playback, Bulgaria public API and Iceland distribution terms; access, guide freshness and per-use limits remain explicit |
| [European national chambers](2026-10-24-service-review-national-europe.json) | 33 | Exact House/Senate services and current terms; Czech Senate decoded, Finland seek stalled, operational/embed limitations retained |
| [Americas national chambers](2026-10-24-service-review-national-americas.json) | 18 | Separate institutional/media/guide and rights reviews, including Canadian content grants; source-item, stale-page and delivery gaps retained |
| [Asia-Pacific national chambers](2026-10-24-service-review-national-asia-pacific.json) | 18 | Official chamber/channel routes and programme surfaces; private sessions, date conflicts and channel-wide rights limits remain separate |
| [African/Balkan national chambers](2026-10-24-service-review-national-africa-balkans.json) | 9 | Current institutional routes with dated agenda/media observations; old indexes and exact-chamber service gaps retained |
| [Czech regional assemblies](2026-10-24-service-review-czech-regions.json) | 14 | All 14 historical-cohort identities revisited; one Moravia-Silesia archive decoded, other service/rights/freshness gates remain open |
| [Remaining US chambers B](2026-10-24-service-review-us-chambers-b.json) | 40 | American Samoa and 19 state chamber pairs, exact House/Senate routes and conditions; no decoded proceedings or complete guide certified |
| [Remaining US chambers C](2026-10-24-service-review-us-chambers-c.json) | 40 | 18 state pairs and two territorial pairs; current provider routes, timing/access gaps and licence limits retained |
| [Remaining regional/territorial chambers](2026-10-24-service-review-regional-chamber-gaps.json) | 36 | Argentina 16, Australia 10, Indian Councils six, Bermuda/Manx organs four; each exact chamber has its own disposition |

The [Basque playback follow-up](2026-10-24-service-review-basque-playback-followup.json)
deepens three already counted identities. Bizkaia and two Gipuzkoa recordings
advanced in Chromium and WebKit, including after a 20-minute seek. Álava's two
samples started in both engines; Chromium later advanced after seeking, while
WebKit did not. Visually inspected frames distinguish substantive business from
opening/standby footage. All checks were muted: audible language, interpretation
and caption quality remain untested. These are dated samples, not current-live
or complete room-inventory confirmations.

## EPG and source-quality gates

- **Gipuzkoa:** the institution-linked RSS agenda resolves to February 2016
  content. Keep it out of current EPG ingestion; its current HTML agenda is the
  next parser lead. The sampled committee's camera clock and session header
  also disagree; that gap is separate from Bizkaia's display conversion.
- **Bizkaia:** a controlled timezone comparison resolves the six-hour display
  difference as viewer-local conversion (Toronto/UTC/Madrid). Use the publisher's
  event timezone rather than browser-formatted timeline labels.
- **Álava:** a two-file committee runtime differs from its start/end span. A
  recording's runtime is not an uninterrupted broadcast schedule.
- **Cree Nation:** dated event wrappers conflict with linked agenda dates, and
  some event times need verification. Its public iCalendar endpoint is a format
  confirmation, not a trustworthy broadcast guide yet. The terms page also
  contains unrelated gambling text; its substantive reproduction clauses remain
  provisional pending a clean, applicable source. No cause or compromise
  attribution is asserted.
- **Budapest/Zagreb:** general public-information/calendar lists also contain
  non-broadcast decisions or coordination meetings. Match institution, organ,
  event and media before creating programme entries.
- **India:** a summons confirms a scheduled sitting, not that it took place or
  was broadcast. Ceremony announcements are likewise distinct from proceedings.
- **Bulgaria/Glarus:** a documented public calendar API and per-assembly JSON
  are genuine formats, not ready XMLTV guides. Bulgaria's sampled upcoming replies
  are empty; Glarus is annual sitting/item data.
- **California:** the latest television-schedule page and linked PDF both carry
  21 October update labels, superseding an earlier discrepancy. Proposed programmes
  still lack end times and can change.
- **National follow-ups:** private/secret committee agenda items, stale indexes
  beside current notices, upload/sitting date differences and internally
  inconsistent date text remain explicit ingestion gates.
- **Mongolia:** the [follow-up calendar payload](2026-10-24-service-review-mongolia-calendar-followup.json)
  has 31 future-week events, 29 timed and two all-day, with a named timezone and
  distinct UIDs. Uniform one-hour durations, party/room coverage, shared page URLs
  and unconfirmed broadcast mapping prevent automatic XMLTV promotion.
- **South Dakota:** controlled viewer-zone comparisons show timezone conversion,
  but a winter event still displays a summer abbreviation. Match a named source
  zone and timestamp; do not infer UTC from the displayed abbreviation alone.

## Rights are reviewed by use

Each new review separately records **linking, embedding, direct playback,
rebroadcast, copying/recording, audiovisual reuse and programme-data use**.
Public availability, a download button, source-credit condition, onsite press
access and a published iframe control establish different things.

Bizkaia's public-download statement, Gipuzkoa's conditional reproduction notice,
Álava's reserved IP rights, Zagreb's media instructions and Budapest's provider
controls retain their exact scope. None is converted into an unrestricted
signal-relay licence. The detailed reports identify each source and outstanding
condition. The [current Appenzell leaflet review](2026-10-24-service-review-appenzell-current-conditions.json)
resolves the earlier unread-document gap and records express official-signal
recording/replay restrictions. The [French Assembly correction](2026-10-24-service-review-france-rights-correction.json)
separates document reproduction from prior agreement for multimedia. The
[Dutch audiovisual licence](2026-10-24-service-review-netherlands-av-licence.json)
supports conditional meeting-material use while leaving occasional events and
current endpoint compliance separate. Canadian national House/Senate content
grants are also corrected without enabling extracted streams. No outreach was sent.

## Reproducing the baseline

Run from the repository root:

```sh
uv run --locked --extra dev python - <<'PY'
import subprocess
import sys
from pathlib import Path

command = [
    sys.executable, "-m", "tools.build_institution_service_baseline",
    "--reviewed-on", "2026-10-24",
    "--output", "reports/discovery/2026-10-24-institution-service-baseline.json",
]
for path in sorted(Path("reports/discovery").glob("2026-10-24-service-review-*.json")):
    command.extend(["--review", str(path)])
subprocess.run(command, check=True)
PY
```

The builder reuses the public snapshot's exact national/body crosswalk. It
rejects unknown, excluded, held or duplicate review identities, dangling source
references, unsafe evidence URLs and future review dates. Repeated report
arguments do not inflate the reviewed-record count. Parent services and evidence
never propagate automatically into chamber records. Regression tests preserve
these boundaries; the baseline itself performs no network retrieval.

Next: deepen the designated services and date/rights gates above, revisit the
638 earlier-only cases where current evidence is needed, and resolve the named
partial-review gaps. Do not restart the identity queue or call these checks full validation.

Validation passed: **229 tests, one skipped; 91% coverage**. Format, lint, type
checks, institution inventory, generated site snapshots, HTML and browser accessibility
checks passed. All source reports have valid eligible IDs and seven rights dimensions; baseline
references and local documentation links reconcile. Credential scans found zero
recognized secrets in the new reports and baseline. The 15 new regression tests
exercise the counting/evidence boundaries above. Public catalogue rights evidence
is updated; no frontend layout or player code changed.
