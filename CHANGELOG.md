# Changelog

## 2026-10-26 — Italian and Taiwanese programme listings

- Collect featured upcoming Italian Chamber WebTV broadcasts with official event
  identities, room labels and Rome source times, excluding archive/live cards.
- Collect Taiwan Parliamentary TV's dated two-channel programme API over supported
  modern TLS, preserving feed labels, broadcast dates and Taipei source clocks.
- Keep unknown ends and aggregate-channel XMLTV mapping holds explicit; retain
  the separate iVOD legacy-TLS access gap without weakening TLS checks.

## 2026-10-26 — Page styles during viewer navigation

- Load and activate each destination page's stylesheets before replacing page
  content, fixing unstyled Legislatures, Coverage map and Schedule tabs.
- Keep the current page and playback available when a stylesheet cannot load.
- Compare tab-navigation layouts with fresh loads on desktop and mobile, and
  test delayed or failed stylesheet requests with the persistent player.

## 26 October — Persistent Floating Viewer

Replace the desktop details sidebar with a movable, resizable floating viewer,
keeping full-width catalogue rows and the mobile bottom sheet. Share the viewer
with Map, Schedule and Legislatures. Enhance navigation between the five ordinary
HTML pages so the same media element and HLS instance survive page, language,
filter and sort changes. Add keyboard move/resize/reset controls, minimise/restore,
viewport bounds, focus restoration and visible navigation-error recovery, with
controls translated across all 23 locales. Close still stops playback.

## 26 October — Norwegian And Swedish Schedule Starts

Add official Norwegian plenary/public-room iCalendar and Swedish chamber XML
collectors. Preserve stable source IDs and UTC times with named source zones;
exclude written submissions and conditional/unknown starts. Calendar end markers
remain unknown programme ends, and both institutional agendas stay outside
linear XMLTV mapping. Refresh catalogue projections and current guide coverage
counts: 45 parser-connected records, 25 collectors and 216 planned records.

## 26 October — Keep Unready Feeds In The Research Queue

Move nine research-only feeds out of the viewing catalogue into researching
candidates, preserving complete records and review history. Keep usable sibling
services and the eligible legislature inventory. Refresh catalogue/inventory
projections and service counts; map and schedule coverage follow the supported
sources. Reject research-only records at catalogue publication and candidate
readiness gates. The catalogue now contains 261 usable viewing sources.

## 26 October — Restore The Homepage Photograph

Give the homepage hero a 300px minimum height on desktop and 220px on phones,
allowing longer translations to grow naturally. Preserve the photographs’
proportions, readable overlay and credits. Tune individual focal positions to
show more of the chambers and architecture, with compact catalogue rows and
search below.

## 26 October — Clearer Viewing Holds

Replace “Research entry” with “Viewing not enabled” in catalogue rows and viewing
details across all 23 locales. Explain that the details contain the recorded
reason and remaining checks. Show a localized explanation of outstanding feed or
provider checks with the recorded review date. Keep the full retained findings
under Viewing and checks, with source-language evidence and official-page links.

## 26 October — Data And Method In Main Navigation

Replace the GitHub header link with Data and method on all five pages, with
localized labels and language-preserving links in all 23 locales. Mark the page
as current in its own header. Keep the existing Code and contribution links.
Show all five destinations on phones in two balanced rows at narrow widths.

## 26 October — Further EPG Coverage And Calendar Contracts

Add exact-channel Germany Bundestag TV1 and Ireland Oireachtas TV collectors,
with explicit programme ranges and strict identity/date/markup validation.
Add Mauritius's official dated event guide while retaining its contradictory
end-time and linear-mapping holds. Restore New Zealand collection through the
official client's House-only public JSON API; genuine empty windows no longer
fail on an unrendered HTML shell. Preserve the human calendar recovery link.
Portugal's agenda now retains official IDs, locations and safe links, skips
missing clocks and all-day items, and rejects ambiguous Lisbon DST instants.

The [measured local preview](reports/epg/2026-10-26-coverage-pass.md) has 44
parser-connected records, 23 collectors, 787 events and 396 XMLTV programmes
across seven populated channels. The new Germany/Ireland collectors contribute
152 complete ranges; eleven Irish terminal ends remain unknown. All collectors
succeed or return healthy empty results. Playlists stay at four stable / 38
broader entries; viewing and reuse admission are unchanged.

Clarify playlist labels as “Continuous channels” and “All supported
channels—including sitting-only streams” across the catalogue, schedule and
Data and method pages in all 23 locales. Explain that event-based and sitting-only
feeds may be offline between proceedings; playlist eligibility and URLs are unchanged.

All 471 Python and eight JavaScript tests pass, with strict mypy for 68 source
files, Ruff formatting/linting and 93.52% combined statement/branch coverage.
The assembled publication bundle passes data-product validation. This pass is
measured before publication; Pages regenerates the live schedules and exports
from current source responses. The translated playlist labels also pass the
site rendering, interaction and accessibility checks, including narrow layouts.

## 25 October — Accessible Map Navigation And Shared Data Explanation

Expose native map search results beside the field, with announced counts and
explicit selection. Replace hundreds of graphic Tab stops with one entry and
arrow/Home/End browsing; preserve selection and focus through the detail heading,
and distinguish selection with a dashed boundary. National/international index
selection resets a previous regional zoom. Mobile details remain reachable.

Add a localized Data and method page with the inventory → catalogue → checks →
generated products explanation, stable asset links, coverage/rights limits and
contribution paths. All five pages share Data and method, Contribute and Code
utilities. Narrow navigation uses two readable rows, and introductory utilities
remain compact on phones. New interface copy covers all 23 locales; fluent review
and physical assistive-technology/device checks remain follow-up work.

Remove the visitor-facing XML sitemap links and align the shared footer order
across all five pages. The XML sitemap remains available for search engines.

Align secondary-page title sizes, top padding, introductory spacing and section
heading scales through shared responsive tokens. Add a pale green wash to the
shared Data and method strip, contribution areas and map location explanations.
Preserve the catalogue hero, compact list rows and existing red action links.

Separate viewing/checks from reuse permissions, omit duplicate source-kind labels,
clarify the parser-connected schedule metric and global IPTV download scope.
Schedule gaps distinguish missing automation, source errors, empty windows and
unavailable products, exposing official links and clear-filter recovery. Retained
listings show their last successful collection; guide-quality labels require a
matching publication timestamp. No catalogue admission or source rights change.

HTML validation, the muted browser/Axe regression suite, eight JavaScript unit
tests and generated-data/publication checks pass. Browser coverage includes all
23 Data-page locales at 320px, map keyboard/search recovery, schedule gap states,
local-file navigation and the existing viewer-timezone/bidirectional text cases.
The heading/colour follow-up also checks all 23 locales on all five pages at
320px, with no horizontal overflow, and verifies text contrast on the pale green.

## 25 October — Public Pages UI/UX Audit

Review the catalogue, legislature inventory, coverage map and schedule on
desktop/mobile, with keyboard, empty-state and narrow translated-layout checks.
Save 25 original screenshots, observed focus evidence and prioritized
[audit findings](reports/ui/2026-10-25-audit.md). Record implementation and manual
accessibility follow-up in the plans; preserve the compact lists and visual
identity. This audit does not implement a redesign or certify WCAG conformance.

## 25 October — Second EPG Pass And Honest Empty Results

Add scoped Knesset Channel 99 and Brazil TV Senado programme collectors, plus
start-only Czech Chamber and Estonian plenary parsers with exact feed mappings.
Knesset midnight continuation requires an explicit connected end; named source
zones and unresolved DST clocks retain their existing safeguards. New Zealand's
unrendered Blazor calendar now reports a source error while rendered calendars,
House status and genuine empty months remain compatible.

The measured local preview at 21:04 UTC on 25 October, **not yet a completed
deployment**, has 598 events, 474 with ends and 270 XMLTV programmes across six
channels, including 129 Knesset and 59 TV Senado programmes. TV Senado infers ends
only within each dated daily linear table. The earlier second-pass preview had
272; one CPAC and one Knesset programme elapsed before this collection.
The first-pass checkpoint remains 83 programmes across four channels. There are
41 parser-connected catalogue entries, 20 collectors,
24 implemented URLs and 12 reviewed mappings; 229 entries retain planned
extraction. The catalogue remains at 270 sources. Playlists remain four stable /
38 broader entries, with guides on three broader feeds; 42 XMLTV definitions
do not imply 42 populated guides or new playback rights.

Document Greece's non-programme GRNET alternative, unavailable current Sansad
indexes, EBS end-time placeholders, Thailand's monthly PDF timing conflicts and
other access/mapping holds. No claim is made that every planned URL was fetched.
All 427 Python tests and eight Node tests pass; strict mypy checks 65 Python
source files, and combined runtime statement/branch coverage is 93.28%.
[Second-pass results](reports/epg/2026-10-25-second-pass-coverage.md) and
[measured coverage](reports/epg/2026-10-25-second-pass-coverage.json).

## 25 October — Broader, Feed-Specific EPG Coverage

Add official Dutch room agendas, a dated Spain Canal Parlamento collector and
Quebec's separately identified linear Canal de l'Assemblée. The new Quebec
official viewing-page entry brings the catalogue to 270 sources and retains its
exact inventory crosswalk, existing map/flag/search support and conservative
playback policy. At this first-pass checkpoint, 37 catalogue entries have
implemented parsers.

Recover published Canadian event ends, retain EBS fractional durations and
official identities, require the Italian Senate's exact WebTV1/13440 feed, and
guard Brazil's active source weekday. Missing source dates, end times and room
mappings remain unresolved. UTC serialization rejects naive clocks and source
localization rejects unresolved DST gaps/folds; browser checks verify actual
catalogue/schedule times in Toronto, Amsterdam and Auckland.

The first-pass local export validates 83 programmes across four channels, compared
with the preceding checked deployment's 51 across two; 31 programmes belong to
the newly covered Dutch and Quebec feeds. Playlist admission remains unchanged.
EPG quality now reports every catalogue entry's parser/collection/mapping/guide
state, enforced by schema and publication checks and summarized in Pages Actions.
[Coverage results and remaining queue](reports/epg/2026-10-25-coverage-pass.md).

## 25 October — Code Audit And Data Product Contracts

Removed unreachable UI styles/sort modes, an unused hash helper, unreachable
Wikidata guards and six redundant or checkout-dependent tests. Consolidated JSON
readers, report writing, review-route validation and four next-event parser
assemblers while preserving their source-specific behavior. Fixed cleared
catalogue crosswalks being revived by discovery, structured research-note
rendering, opaque manifest detection, blocked-storage locale handling and the
quality report's count of channels with actual events. Fractional schedule times
are compared at XMLTV's whole-second precision, with collapsed ranges excluded.

New schemas cover public inventory snapshots, supranational map context and EPG
quality. Declared standard format dependencies enforce timestamps and
international URLs instead of silently skipping checks; a bounded cache reuses
only pure IRI parsing. Strict validation exposed two space-containing evidence
links and one malformed historical VOD seed, repaired in maintained inputs while
retaining original research evidence.

CI checks an offline export bundle; Pages checks its actual generated bundle
before publication. Cross-product checks cover playlist aliases and source IDs,
XMLTV structure/times/content, reviewed feed mappings and quality counts. See
[data validation and coverage](docs/data-validation.md) for schema, type and
coverage boundaries.

## 25 October — Consistent Domain And Operation Names

Reviewed tracked file names and handwritten Python/JavaScript names. Shared
helpers now distinguish discovery targets and observations from formal source
candidates, URL encoding/normalization from fetching, XMLTV-exportable events
from general schedule approval, and schedule live labels from media playback.
Catalogue CLI messages describe source records, including viewing pages and
archives. [Naming and compatibility](docs/naming-conventions.md) records the
vocabulary and the schema, identifier, protocol and command names kept stable.

Maintenance script names now identify catalogue snapshot generation, schedule
issue planning and exact-revision Pages verification. The complete local browser
suite lives in `tools/check_site.mjs`; the former accessibility script and npm
commands remain compatible. Existing `make site-data` commands remain aliases
for the explicit `catalogue-site-data` commands. Public data and evidence paths
are preserved.

## 25 October — Repository Navigation And Maintenance Boundaries

Document the catalogue and legislature inventory as separate maintained lists,
with short data/report role guides and an explicit registry of service-review
reports consumed by maintenance. Existing evidence paths and generated public
snapshots are preserved. Shared inventory adapters, crosswalks and projections
now live in `parliament_streams/inventory/`; evidence sanitization helpers live
in the package while their command entry points remain under `tools/`.

Separate the current roadmap from its retained history, label historical
research links, refresh the candidate overview and clarify the checkout-based
development contract. Add explicit Python, JavaScript and browser test commands;
`make test` runs all three, and CI/full verification retain each suite once.

## 25 October — Reviewable Discovery And Verified Deployments

Monthly discovery now reports viewing, archive, channel, recording and programme
page leads alongside format-checked manifests, with separate review ledgers,
bounded observations and explicit skipped/capped work. These are research leads;
no source, candidate or legislature is published automatically. Shared HTTP
handling protects monthly checks and inventory monitoring from international URL
encoding failures while preserving their request limits and safety checks.

Independent catalogue probes continue after another probe or issue API fails,
while failures remain visible. Stable-stream and schedule alerts close only on
an `ok` result. Pages requires successful CI and CodeQL for the exact current
`main` commit, with a pinned checkout and a final pre-publication check; normal
pushes remain allowed. [Workflow and review guide](docs/github-actions.md).
The catalogue remains at 269 sources and the inventory at 940 eligible identities.

## 25 October — Repair International URL Audits

The scheduled catalogue audit crashed on the Serbian Parliament archive's
Cyrillic URL before writing its report. Encode international URLs for HTTP,
preserve existing escapes and query separators, and retain malformed URL or
encoding failures as individual source results. The workflow summary now names
missing reports without adding a second failure; invalid JSON still fails.
Regression tests reproduce the original HTTP encoder error, international
host/path/query handling and a mixed-source audit with one invalid URL.

## 25 October — Continued Official Viewing Sources

Added 13 scoped official viewing links, bringing the catalogue to 269 sources.
Six existing Argentine chamber matches are documented and Finland's existing
source receives further evidence without duplication. Selected historical,
single-sitting, clip and browser limitations remain explicit. Renewed partial
service follow-ups cover 308 of the 940 eligible identities; 632 retain earlier
checks. No complete-service certification, IPTV admission or guide parser is added.

Added six regional map outlines, three labelled institution-location markers,
seven sourced flags and the French Community's verified reuse of its adopted
flag. Search, programme links and public institution crosswalks include the
additions. Location markers explain their scope rather than imply a territorial
boundary. Research browser launches now suppress audio before navigation.
Nearby location markers are separated with leader lines to retain pointer access.
[Publication decisions](reports/discovery/2026-10-25-held-source-publication-decisions.json).

## 24 October — Scoped Publication And Monitoring Coverage

Added 13 official viewing sources, exact legislature crosswalks, 11 regional map
outlines, parent-country search and planned programme links. Four old research
feeds now use supported official viewing pages; nine retain specific research
holds with clearer localized labels and visible findings. Added 14 sourced flags
and a shared catalogue/schedule registry; ten unsupported designs remain neutral.

Schedule filters include planned calendars and preserve them when guide data is
unavailable. Public legislature evidence includes current partial follow-ups.
Monthly discovery and inventory monitoring now include maintained eligible routes
and the current catalogue, with explicit budgets, rotation, skipped checks and
per-identity observations. CI checks current baseline and generated evidence.
No automatic promotions, new IPTV admissions or XMLTV parsers are implied.
[Publication decisions](reports/discovery/2026-10-24-institution-publication-decisions.json)


## 24 October — Redact Copied Research Credentials

Redacted Google Maps API key values accidentally retained in third-party embed
URLs in an older route-audit report. The official source-page references remain.
New research evidence sanitizes credential-bearing URL parameters and recognized
secret patterns before saving. CI scans tracked files, and monthly review reports
must pass a credential scan before issue, summary or artifact publication.
This cleanup does not rewrite existing Git history or revoke third-party keys.

## 24 October — Monthly Legislature Inventory Monitoring

Added a monthly GitHub Actions review of the maintained legislature inventory,
national chamber directory, country sources and institutional references. It
reports proposed additions, possible retirements, names, links, metadata and
evidence changes for human review. Access failures and partial responses remain
explicit gaps. The job never edits institutions or their authority status.

Retained report artifacts supply the next baseline. Pending proposals survive
unchanged observations and source outages until reviewed canonical changes or
an explicit decision resolve them. Reports include a persistent review issue,
bounded Actions summary and complete JSON/Markdown artifacts. Offline validation
and regression tests cover the source adapters, fetcher and comparison rules.

## 24 October — Public Legislature Inventory And Contribution Paths

Added a searchable Legislatures page for the working inventory across all 71
baseline country groups. Country groups, nested chambers, authority statuses and
expandable evidence keep confirmed eligibility separate from viewing-service
validation. Explicit source matches link to the catalogue; exclusions and
historical institutions remain available through filters. The interface supports
23 locales while preserving recorded institution names and English research notes.

Missing institutions, official broadcasts, translations, corrections, accessibility
findings and other ideas have dedicated contribution links. Individual records
prefill their correction reports. Shared navigation, the sitemap, documentation
and CI include the new page and its generated snapshot. Python, HTML,
accessibility and Chromium/WebKit desktop/mobile checks pass.

## 24 October — Eleven Legal Holds Reviewed

All 11 starting cases have further primary-source findings. Three French cases
are reclassified as current default-scope exclusions with dated reopening tests;
**eight specific holds remain**: seven Panamanian cases and FNTA. The new evidence
confirms traditional legal/justice authority and FNTA amended-Bill passage without
inventing the missing allocation, assent or commencement. The operational register
is updated. Later metadata, streams, EPG and rights work remains deferred.
[Case findings](reports/discovery/2026-10-24-legal-holds-review.md) ·
[Document-request drafts](reports/discovery/2026-10-24-legal-document-requests.md)
(drafts only; nothing sent).


## Earlier 24 October — Institution Inventory Reconciled

All 19 original scope questions are decided: **14 eligible, five outside scope**.
The operational register applies national/regional chamber crosswalks, comparable
regional autonomies and 22 corrections to older exclusions. It covers all 71
baseline country groups under the confirmed first-level/autonomous boundary.
**Eleven specific legal-instrument holds remained at this stage**; no exhaustive census or full
service validation is claimed. The older 652-body stream register remains its
original cohort. [Findings and holds](reports/discovery/2026-10-24-inventory-reconciliation.md)
· [Operational register](data/discovery/README.md).

## Current Individual Follow-up — 24 October

Local catalogue: **243 sources / 143 mapped regional jurisdictions**. Within the earlier 652-body cohort, **143 have catalogue records / 509 lack a published service**; **23 institutional-reference/route gaps** remain. Thirteen further regional recording services are added in this follow-up, with same-sitting parts, historical footage and browser limits explicitly scoped. All 490 first searches, 123 alias searches and 19 further full-name searches completed; identifier leads still require individual primary crosschecks. The service-evidence register reconciles that original 652-body cohort and 150 formal candidates without treating recorded checks as full validation. [Current evidence and unresolved claims](docs/research-status.md). The inventory crosswalk resolves the 19 original questions; the subsequent legal review leaves eight named holds. It does not certify an exhaustive census. [Inventory findings](reports/discovery/2026-10-24-inventory-reconciliation.md).

## 23 October — Continued Identity And Recording Validation

Added32 official viewing links since the Chubut follow-up: Łódź, Silesia, nine current Korean councils, eleven Argentine provincial/city services nine Brazilian state assemblies and Caldas, Colombia. Local catalogue: **198 sources / 100 mapped regional jurisdictions**, **100 eligible bodies covered / 552 without a published service**. Five scoped institutional references leave **45 URL gaps**. Exact institutional IDs, own provider designation and selected recorded proceedings support the additions; scope and browser limitations are retained individually. All new Brazilian entries are reconciled across catalogue, parent-country search, map and planned event navigation.

Confirmed scope and unresolved claims remain separate. Silesia has a Chromium playback limitation; seven Korean councils retain named access/playback gaps. Tocantins has one confirmed recording but its next selected titles are short stubs; keep the second substantive-recording gate open. Ceará's committee date is unreconciled. Banská Bystrica/TV ESO remains held for its explicit deep-link consent condition. Video reuse, current live, every room, complete language/accessibility and audible quality remain open. Four Argentine flag assets are attributed; subsequent optional asset downloads stopped after Commons429 and use neutral marks. The wider research task is unfinished. [Current evidence and limits](docs/research-status.md) · [Per-body register](reports/discovery/2026-10-23-comprehensive-followup.json).

Colombia: fourteen primary/provider routes and44 playback checks have scoped outcomes;13 assemblies remain unpublished. Wikidata429 stopped exact-item follow-up without retries. Search candidates remain unverified claims, and historical/standby/recess footage is distinguished from current substantive proceedings. The independent47-lead pass is complete:47 primary routes,91 distinct recordings/182 technical checks,91 captured frames visually reviewed and eight secure route corrections. Exact identity review remains deferred after the rate limit; the wider task remains unfinished.

## Comprehensive follow-up — 23 October 2026

Added Chubut’s officially designated recordings:166 local sources,68 mapped regional jurisdictions. Resolved 28 further scoped institutional routes (50 URL gaps remain) and corrected 26 executive/shared-portal substitutions. Reconciled all 652 eligible records with specific evidence and remaining gates; this is not full live/all-room certification. Chubut desktop/mobile Chromium/WebKit flows and `make verify` pass. [Current status](docs/research-status.md) · [Full evidence register](reports/discovery/2026-10-23-comprehensive-followup.json).

## Provincial follow-up — 23 October 2026

Added Arauca, Caquetá, Risaralda and North Kalimantan official viewing services after exact identity/provider designation and two-engine proceedings checks. Local catalogue: 165 sources / 67 mapped regional jurisdictions. Regional flags, parent-country search and planned recording indexes reconciled; no direct HLS, strict IPTV or XMLTV parser addition.

Resolved 40 further institutional routes, leaving 78 of the original 175 missing URLs after both metadata follow-ups. Removed the Southern Leyte/Leyte false match. Blocked, sparse, dead and non-proceedings leads retain explicit limits. [Evidence](reports/discovery/2026-10-23-completion-review.md).

## 23 October — Corrientes And Metadata Follow-up

Added two Corrientes official viewing links with separate chamber IDs: Deputies’
2026 sittings and historical Senate recordings. Two recordings per chamber play
past the opening in Chromium/WebKit. Flag, provincial boundary, Argentina search
and planned indexes reconciled; local catalogue 161 sources / 63 regional bodies.
Current live, committees, Senate audio/date mapping and complete language/media
accessibility remain open. No new IPTV eligibility or XMLTV parser added.

Resolved 57 of the 175 institutional URL gaps; 118 remain. Corroborated ten
Philippine board-item IDs against primary pages; other discovered IDs stay leads.
Chubut’s directory-listed host serves unrelated content and remains held.
The [follow-up](reports/discovery/2026-10-23-metadata-followup.md) tracks every
start-of-batch target and distinguishes reviewed records from work not revisited.
Python/catalogue checks and corrected site accessibility checks pass; focused
Chromium/WebKit desktop/mobile checks pass. Changes remain local.

## 23 October — Eligible Metadata And Stream Evidence Pass

Created per-body audit/gap records for all 652 eligible regional and territorial
legislatures. Checked 2,185 recorded URLs by bounded HTTP and attempted one selected
normal public Chromium route for each body, with hard-deadline retries for stalled
pages. This is initial screening, not comprehensive identity, language, provider,
proceedings, room, permission or accessibility clearance.

Filled 22 missing institutional URLs and flagged four municipal/regency false
matches. Another 175 institutional URLs remain missing. Two official Corrientes
lower-house recordings (14 October / 23 September 2026) play after 30 minutes in
Chromium and WebKit; required institutional ID, publication metadata and broader
coverage remain unresolved. Jambi’s playable historical inauguration news clip
is not a full-session service. No catalogue entry, HLS export or XMLTV parser
was added. Local catalogue remains 159 sources / 62 regional jurisdictions.

[Audit, exact evidence and individual gaps](reports/discovery/2026-10-23-eligible-metadata-stream-audit.md).
Changes remain local and uncommitted.

## 23 October — Full Authority Classification

Assessed all 392 former generic authority reviews: 200 eligible, 180 excluded,
ten specific legal evidence holds and two historical Korean predecessors.
Added the Jeonnam–Gwangju successor separately. The 1,122-row inventory now has
652 eligible bodies, 458 exclusions, ten specific holds and two predecessors.
The ten legal questions are still unresolved; each names the exact evidence
needed. No generic/core review labels remain.

The eligible-service queue contains 590 bodies without matched catalogue
coverage and 62 with existing coverage. Corrected Colombia Córdoba's false
match to Argentina's source. Normalized the 177 earlier eligible decisions’
source references into the common authority register without claiming a fresh
review. No viewing service, HLS feed or XMLTV parser was added in this pass;
the local catalogue remains 159 sources and 62 mapped regional jurisdictions.

See [full decisions and holds](reports/discovery/2026-10-23-authority-completion.md)
and [authority register and validation queue](reports/discovery/2026-10-23-legislative-priority.md).
Work remains local and uncommitted.

## 23 October — Second Authority And Viewing-Service Pass

Resolved the remaining 85 core legislative candidates as eligible under primary
frameworks, preserving Indian union-territory and Swiss Landsgemeinde distinctions.
Documented 16 further exclusions: twelve ordinary mainland French regional
councils, Ceuta/Melilla, and Christmas/Cocos shires. Corsica/overseas arrangements
were separate at this stage. Scope snapshot: 451 eligible, 392 unresolved, 278 excluded.
The later full authority pass above supersedes those scope counts.

Added Neuquén, Sicily and West Virginia as official link-outs, with institution
IDs, decoded proceedings samples, flags, parent-country search, map and planned
calendar/index links. Local catalogue: 159 sources; 62 regional jurisdictions.
Rivera footage passes, but a required institutional ID is unresolved; retain a
research candidate. Lombardy’s initial player signal was header animation.
See [second-pass evidence](reports/discovery/2026-10-23-validation-second-pass.md)
and [authority decisions](reports/discovery/2026-10-23-authority-second-pass.md).
Accent-insensitive catalogue/map search now finds Neuquén without typing the
accent. Existing coverage is matched by institutional identity and country
context; Florida Department is not confused with the US state.
No IPTV or implemented XMLTV parser added; work remains local.


## 23 October — Legislative Priority And Full-Queue Follow-Up

The local catalogue now contains 156 sources (72 national, 78 regional/territorial,
six supranational) and 59 mapped regional jurisdictions. The new pass adds 27
validated official viewing links after the Cook Islands/Guernsey additions;
102 sources are link-outs. This is local work, not a deployment assertion.
National coverage reaches 53/71 target countries; 18 gaps and additional
chamber/committee families remain. Screening completed 931 access lead families
and 318 regional player routes; these counts do not certify usable streams.

Prioritize the 366 bodies with established legislative authority. Resolve the
85 remaining core candidates and 408 borderline authority reviews separately.
All 262 excluded inventory rows now have specific reasons and primary sources;
their old media leads remain archived outside active publication work.
See [full-queue decisions](reports/discovery/2026-10-23-full-queue-decisions.md)
and [legislative priorities/exclusions](reports/discovery/2026-10-23-legislative-priority.md).
No direct HLS, strict IPTV or implemented XMLTV parser eligibility is added.


All notable changes to the documentation and data project are recorded here.
This changelog begins with the 2026-06-19 conversion from the retired SwiftUI
application. Earlier application work remains available in Git history.

## Unreleased - 2026-10-23

### Added

- Cook Islands Parliament’s officially linked September 2020 sitting archive,
  explicitly labelled historical and classified as national coverage for a
  self-governing state in free association. Guernsey’s official meeting recordings
  also added after dated playback checks, with flags, localized names, map,
  country search associations and planned calendars. Bangsamoro remains held on
  current geography and hyperlink conditions; Vojvodina on proceedings access.

- Bermuda Parliament’s official audio archive after advancing House and Senate
  playback in WebKit, with the Chromium CORS limitation and reproduction
  restrictions documented alongside its flag, map, search and calendar links.

- Cayman Islands and Turks and Caicos parliamentary viewing services, with
  recorded/provider-live-event playback evidence, flags, localized names, country
  search, map outlines and planned calendars. Further evidence resolves Cook
  Islands legislative authority and narrows the remaining territorial blockers.

- Guam Legislature and Puerto Rico Senate official viewing services and Gibraltar
  Parliament’s video archive, with playback evidence, territorial flags, localized
  names, country search associations, map outlines and planned calendar links.
  Four other territorial leads retain specific blockers; Vojvodina’s provincial
  legislative authority is resolved positively.

- Drenthe, Limburg and Noord-Brabant provincial council official viewing links,
  with dated recording playback evidence, flags, map outlines, Netherlands search
  and planned calendar links. All twelve Dutch provincial services were checked;
  nine retain explicit validation blockers in the research ledger.

- Bern Grand Council's official Online-Tagblatt archive, with institutional
  identity evidence, cantonal flag, localized jurisdiction names, Switzerland
  search association and current swisstopo canton geometry. Recorded video is
  validated; live coverage, IPTV and XMLTV parsing remain separate.

- Collapsed IPTV setup on catalogue and schedule pages, with public playlist
  and XMLTV links, copy buttons with manual fallback, partial-guide guidance,
  and official VLC desktop instructions.
- Czech Chamber of Deputies native HLS after progressing live-media and browser
  decode validation; Sweden and Finland official video-portal link-outs with
  identity, rights, accessibility, and event-source evidence.
- Dated whole-catalogue, official-player, discovery, and media audit evidence;
  one Chile Sala IV research candidate and exact event/VOD review decisions.
- Flags and country labels for Czech Republic, Sweden, and Finland, plus
  validation support for recorded Swedish caption evidence.
- Thirteen official viewing links across the first expansion and territorial
  follow-up: Japan's two chambers, Austria, Mauritius, Italy's lower house,
  Nagasaki committees, Córdoba, Santa Catarina, Jersey, Tynwald, French
  Polynesia, New Caledonia and Sint Maarten. These add no direct HLS or XMLTV
  parser coverage.
- Country/territory research ledger with 1,121 initial searches, per-body
  eligibility assessments and explicit unresolved leads.
- Czech, Finnish, Swedish and Traditional Chinese interface packs; localized
  IPTV/VLC instructions across all 23 supported locales.
- Official calendar/event links on the schedule page, separate from automated
  programme listings.
- Newcomer contribution paths, translation-review guidance and issue form,
  general contribution form and a lightweight pull-request template.

### Changed

- Keep Parliament Streams in rendered page titles, correct canonical/social URLs
  to the custom domain, and add page-specific Open Graph/Twitter cards, truthful
  website/page structured data, and a sitemap for the three public pages.
- Simplify desktop/mobile browsing with a shorter introduction, a full-width
  compact list, direct official-site watch links, and expandable source and use
  details. Remove inactive players for link-only sources and add explicit detail
  dismissal with keyboard focus restoration.
- Withhold Swiss National Council and Estonia feed 2 native playback after
  repeated failing media checks; preserve their provenance and rights evidence.
- Refresh compact validation history for every published entry and keep current
  roadmap/rights/candidate summaries aligned with the 117-entry working catalogue.
- Adopt legislative authority as the catalogue scope rule, preserving broader
  council research without treating it as publication eligibility.
- Reduce the root README to a welcoming overview and move detailed site,
  development, schedule/IPTV and research guidance into indexed documents.
- Simplify the GitHub About description and reduce sidebar topics to five.
- Add geometry for all 42 published regional/territorial jurisdictions and
  location dots for tiny outlines; preserve special-status relationships in
  country searches and map grouping.

### Fixed

- Align external watch links and native playback labels with the catalogue
  playback header in full-width and selected-source desktop layouts.
- Fingerprint assembled JavaScript/CSS URLs by content and retain compatibility
  for cached catalogue scripts, fixing Safari loading failures after the
  coverage-disclosure change.
- Correct mobile Schedule Sources alignment and add missing flags for Austria,
  Japan, Mauritius, Switzerland, Nagasaki, Córdoba and Santa Catarina.

### Security

- Require and lock certifi 2026.10.19 or newer to address
  GHSA-6q48-6c7w-9gw2, removing compromised emSign CA trust material.

## Earlier unreleased work through 2026-10-14

### Fixed

- Stop mapping the European Parliament's parallel event directory to one
  XMLTV channel. Keep its events and structured room labels in website data;
  only reviewed broadcast-feed mappings can export guide programmes.
- Preserve unknown EBS durations without manufacturing zero-length events.
- Quarantine conflicting linear-feed programmes, duplicates, invalid time
  ranges, and cancellations while preserving valid partial guide output.

### Added

- Published `epg-quality.json`, a `schedules-audit` command, and quality
  summaries/artifacts in Pages and daily catalogue audit workflows.
- Explicit parser time provenance and XMLTV disclosures for inferred Brazil
  and CPAC end times and Brazil's assumed collection date.

## Earlier unreleased work through 2026-10-07

### Added

- Automated extended-M3U exports for always-on and broader validated HLS
  sources, plus XMLTV guide conversion with matching catalogue IDs. Pages
  regenerates them after schedule collection; incomplete programme times are
  omitted rather than inferred, and playlist selection respects playback policy.

## Earlier unreleased work through 2026-10-01

### Added

- A researching Czech Chamber of Deputies candidate with official HLS/embed
  evidence; promotion awaits successful active-sitting media validation.
- Retained October scheduled-audit triage and a documented false-positive
  dismissal of CodeQL alert #2; no open CodeQL alerts remain at this review.

### Changed

- Generate same-origin HLS.js 1.7.3 and D3.js 7.9.0 browser libraries, content
  hashes, and upstream license notices from locked npm dependencies. Every
  Pages deployment regenerates these assets.
- Update Ruff, html-validate, and Playwright through reviewed Dependabot PRs,
  and update the transitive fast-uri dependency to resolve the npm audit finding.
- Refresh current Markdown guidance against the October catalogue, candidate
  queue, tooling, and review counts while retaining dated research evidence.

### Fixed

- Restore Thailand native playback using the channel-level HLS endpoint
  advertised by the official player, retaining event-based availability and
  pending reuse rights.
- Replace obsolete New Zealand and U.S. Senate official-page links.
- Record six exact France/Senate event-manifest decisions so they do not reopen
  the stable-channel discovery queue.

## Earlier unreleased work through 2026-09-11

### Added

- Swiss National Council live video, backed by a validated official-vendor HLS
  endpoint, official third-party embed instructions, IPU/Wikidata identity, and
  the published parliamentary session schedule.

- Four official U.S. federal catalogue records covering House and Senate floor
  and committee video services, with Wikidata/IPU identities and schedule
  surfaces but no unsupported direct-playback claim.
- Ten official U.S. state service records covering California, Florida,
  Minnesota, both New York chambers, Oregon, Rhode Island, Texas, Utah, and
  Washington, including state flags, Wikidata identities, schedule links,
  accessibility evidence, and source-specific rights posture.
- A retained health report for all fourteen promoted U.S. records, explicitly
  distinguishing reachable pages from bot-blocked and certificate-chain
  responses.
- A schema-validated United States discovery inventory covering six federal
  floor, committee, API, and broadcaster candidates plus official research
  roots for all 50 state legislatures, with nine state video surfaces
  prioritized for deeper validation.
- Validation and tests that enforce complete, unique 50-state coverage and
  require stronger evidence for candidates labelled as verified video surfaces.

- A full official-source schedule discovery pass covering all catalogue
  institutions, with newly recorded meeting or programme sources for Thailand,
  Mongolia, Taiwan, France, Brazil, Denmark, Norway, Greece, Israel, Slovakia,
  the EU Council, the European Parliament, New South Wales, and Queensland.
- Complete schedule-source coverage across all 100 catalogue entries, while
  retaining `planned` status for sources that do not yet have reliable parsers.
- Schedule snapshot schema v3 with normalized rolling event lists, canonical
  start/end timestamps, source timezones, status values, official or
  deterministic event IDs, links, locations, and languages.
- Per-source schedule diagnostics covering expected/populated channels, event
  counts, field completeness, coverage windows, consecutive failures, and
  bounded last-good usage.
- Twenty-four-hour last-good recovery for still-future events, with stale Now
  records explicitly removed and stale listings labelled on the public page.
- Repeated schedule-source regression issues after three failed audit runs,
  automatically closed when the source recovers.

- An official UN Web TV schedule scraper using the server-rendered Live Now and
  Coming Up sections, including event URLs, identifiers, status, and language.
- Schedule snapshot counts for concrete current listings, upcoming listings,
  and channels with both, plus schema validation of the published snapshot.
- Canonical RFC 3339 event start timestamps and browser-local timezone display
  across the programme guide and catalogue details.
- A localized static Now/Next programme-guide page, styled as compact TV
  listings and backed by the six-hourly schedule snapshot, with jurisdiction
  and listing-status filters, freshness warnings, responsive mobile rows, and
  playback handoff to eligible catalogue channels.
- Retained schedule data in the classic-script site snapshot so direct local
  file previews can render the programme guide without a server.

### Changed

- Reworked the phone and tablet layouts after a responsive UX and WCAG audit:
  primary navigation now remains available on small screens, the catalogue hero
  and rows are denser, programme listings stack into readable Now/Next blocks,
  the mobile map uses its available space more effectively, and intermediate
  source details expose metadata sooner.
- Localized source-kind, playback-policy, and stability-risk terminology across
  every supported interface language instead of filling missing values from
  English at runtime.
- Expanded frontend regression coverage for small-screen navigation, first-
  viewport catalogue access, intermediate detail-sheet density, mobile schedule
  order, and mobile map sizing. CI now runs on pushes to `main`, and non-scheduled
  Pages deployments run catalogue, site-data, and accessibility checks before
  publishing.
- Restored native playback for Brazil TV Camara after its first-party HLS
  endpoint recovered and passed both static and browser validation.
- Re-ran the complete 25-country Tier 1 and 46-country Tier 2 discovery audit;
  improved rotating EUDDN edge-manifest matching so child renditions no longer
  appear as uncatalogued channels.

- Reclassified Thailand Parliament TV as an event-based, high-risk research
  source after the former permanent HLS endpoint regressed to HTTP 404. The
  September catalogue recorded the Channel 1 URL advertised by the official OTT API,
  while discovery data also retains Channel 2 for an active-broadcast check.
- Repaired the Ontario calendar collector by using the CDN-compatible canonical
  URL and the project's transparent user agent, and moved New Zealand schedule
  collection to the working official weekly calendar endpoint.
- New Zealand bot-protection detection now accepts complete calendar responses,
  treats “The House next meets” as an upcoming event rather than a current
  programme, and preserves its source-provided date when no timestamp exists.
- New Zealand schedule collection now reads the official calendar's public
  Azure host, avoiding the protection challenge that blocked GitHub runners.
- Clean-checkout verification and site-data freshness checks now treat the
  ignored, generated `data/schedules.json` snapshot as optional while still
  validating it exactly whenever it is present. Static catalogue, fallback,
  and map metadata remain checked in every checkout.
- Current-state documentation now reflects the 2026-08-24 catalogue and report
  set, the dated 28-entry rights-classification baseline, the static-site project terminology,
  and the manual validation workflow and evidence boundaries for the U.S.
  candidate inventory.

- Schedule documentation now distinguishes records with an official schedule
  link from channels with real dated events in the published programme guide;
  the 2026-08-24 v3 snapshot contained 159 events for seven channels.
- Existing multi-event parsers now retain their complete collected horizon
  instead of discarding all but Now and Next. The 2026-08-24 live run expanded
  seven producing channels from ten displayed slots to 159 normalized events,
  71 with known end times.
- Now/Next fields are compatibility projections derived from canonical events;
  the six-hourly Pages workflow persists a versioned schedule baseline for
  bounded transient-failure recovery.

- Schedule schema v2 makes current programmes nullable and no longer reports a
  future calendar event as Now.
- Source-published time labels now use the source's actual timezone and remain
  only as fallbacks when an event has no canonical timestamp.
- Québec and Ontario schedule collectors no longer duplicate service-wide
  empty or generic results across every channel; only channel-mappable events
  are published.

- Canada House of Commons ParlVU and Canada Senate SenVu as official
  event-platform link-out catalogue records, while deliberately avoiding
  unvalidated direct-HLS claims.
- A Canada Harmony schedule scraper that extracts upcoming-event metadata from
  the public ParlVU and SenVu landing pages while leaving the unstable
  undocumented API as planned research.
- Schema v7 source classification fields: precise `source_kind` values for
  first-party HLS, official-vendor HLS, DASH research, YouTube embeds, and
  official pages, plus `stability_risk` for drift/review risk.
- Stability-risk-aware health reports and stable-stream regression automation,
  so high-risk always-on sources remain audited without driving noisy regression
  issues.
- A UK Parliament What's on Calendar API schedule scraper for public chamber,
  Westminster Hall, Grand Committee, and oral-evidence events.
- A public architecture guide explaining source-of-truth files, generated
  artifacts, runtime shape, source types, maintenance flow, schedule scrapers,
  and validation entry points.
- A README start-here section and workflow badges so GitHub visitors can quickly
  understand the project shape and current automation health.
- A catalogue-maintenance "Which file should I edit?" guide and clearer
  contribution review gates for official provenance, technical stability,
  metadata/accessibility, and rights.
- A 1200 x 630 Open Graph and social-preview image, with explicit canonical,
  Open Graph, and Twitter metadata for GitHub Pages shares.
- Promoted official Tweede Kamer Aletta Jacobszaal and Actualiteitenkanaal HLS
  records after fresh master and child-playlist validation.
- Durable discovery-review decisions for third-party, out-of-scope, insecure,
  and event-specific manifests so monthly audits do not reopen settled leads.
- Tests for discovery-decision handling and bot-protection response detection.
- A schema-validated `data/fallbacks.json` dataset, CLI validation command,
  GitHub Pages publication, and channel-detail links for official event,
  player, and provider surfaces such as ParlVU, SenVu, and Parliamentlive.tv.
- A focused rights/accessibility review pass that moved France National
  Assembly to conditional-reuse status and added current Knesset, Sansad TV,
  and TPchannel evidence without overclaiming reuse permission.
- A short public rights summary plus ready-to-send written-clarification batches
  for the remaining ambiguous native-playback and official-page sources.
- Schema v8 validation-history references, a CLI refresh command, and public
  source-detail links to retained health reports for channels with dated
  validation evidence.
- Schema v9 `playback_policy`, separating the catalogue's playback presentation
  from rights/permission evidence.
- A `playback-policy-audit` command and Make target that report review tensions
  between playback policy, permission status, and retained technical evidence.
- Public catalogue playback-mode filtering and source-detail display, so
  provider embeds, native playback, link-outs, and research-only records are
  visible independently from use guidance.
- The catalogue table now orders columns as Source, Jurisdiction, Language,
  Mode, Access, and Use; the former Format column is replaced by a sortable
  Mode column for Playable, Fallback, Link-out, and Research row markers, while
  format remains available through filters and source details.
- Playback and Use Guidance dropdown filters were removed now that Mode and Use
  are sortable, leaving search, Jurisdiction, and Source type as the active
  filtering controls.
- Mode row markers now explain the playback posture on hover, and Access/Use
  row markers share the same compact tag styling.
- Norway Stortinget and Germany Bundestag moved from native playback to
  link-out/no-third-party-reuse because their documented terms point to formal
  requested retransmission/live-signal routes, not browser-discovered HLS.
- Make targets and `--check` support for validation-history refreshes, so
  retained report-link drift is caught by `make verify`.
- Source-row posture labels for playable, link-out, fallback, and research
  records, plus fallback now/next hints sourced from already-collected schedule
  metadata.
- Optional schedule event URL, ID, language, status, and location fields, with
  Harmony parsing and public fallback rendering for official ParlVU/SenVu event
  links.
- Official House ParlVU and Senate SenVu recordings fallbacks, kept link-out
  while archive-event metadata and playback rights remain unresolved.
- Dated official-vendor and first-party HLS rights review snapshots, keeping
  unresolved native-playback records permission-pending where public terms do
  not clearly authorize third-party playback.
- A dated official-page rights review snapshot, moving Brazil TV Camara and
  Manitoba House Broadcasts to conditional link-out reuse while keeping four
  official-page records permission-pending.
- A direct-DASH research snapshot for Mongolia Parliament TV, keeping the SkyGo
  DASH manifest research-only and preferring the official Parliament live page.
- A conservative official YouTube live-page resolver for the UK, Australia, and
  Costa Rica records. It records a current provider watch video only when the
  official `/live` page exposes explicit watch metadata; otherwise it leaves the
  source on the existing uploads-playlist embed.
- Ontario source-family accessibility evidence across its six feeds, including
  documented English captions and source-dependent sign-language treatment while
  keeping full-stream reuse permission conservative.

- Canonical Tier 1 and Tier 2 discovery target data plus a monthly GitHub
  Actions audit that performs static and Chromium source discovery, compares
  validated manifests with the catalogue, and retains review evidence for 90
  days without automatically promoting sources. The workflow maintains a
  persistent candidate-review issue, while daily always-on regressions receive
  deduplicated issues that close on recovery. Deep browser validation uses four
  isolated concurrent page contexts to keep broad audits within job limits;
  findings suppress child playlists of catalogued masters and malformed or VOD
  URLs that are not new live-channel candidates.
- A daily GitHub Actions catalogue audit covering schema and identity rules,
  primary stream/page health, schedule endpoints and parsers, and supporting
  official, rights, identity, and embed links, plus a weekly full-catalogue
  Chromium manifest-discovery pass and stable-stream regression tracking.
- A typed, parallel `links-audit` Python command with deduplicated URL roles,
  HTTP classifications, CLI output, and tests.
- A public-domain 1890 House of Commons chamber photograph as the responsive
  catalogue hero, with visible credit and repository attribution.
- A data-derived catalogue coverage summary, per-source evidence dates, and a
  five-part open-stream principles index.

- A build-free GitHub Pages catalogue driven directly by `data/channels.json`.
- In-page native HLS playback for technically validated sources not expressly
  prohibited from third-party reuse.
- Local rectangular SVG jurisdiction flags, including Quebec, Ontario, Nunavut,
  the 2026 sub-national expansion jurisdictions, EU, UN, and OSCE markers,
  with asset attribution and licence records.
- The recovered historical parliamentary chamber/play icon as the local site
  header mark and favicon.
- A client-side locale selector and URL/local-storage locale support for the
  public catalogue interface.
- Dated catalogue and review health reports.
- A focused static, child-media, and browser validation report for Review
  sources, including event-based Spain, France, and Ontario feeds.
- A typed Python schedule collector, normalized schedule snapshot schema, and
  six-hour GitHub Actions publication for current and next event data.
- Python schedule adapters for European Parliament webstreaming and Europe by
  Satellite, alongside the existing CPAC, Quebec, Ontario, New Zealand, and
  Brazil parsers.
- Schedule adapters for the Italian Senate's dated WebTV JSON API and
  Portugal's official open-data agenda, including resolution of Portugal's
  current opaque download URL from its stable resource index.
- A reproducible `epg-audit` command and dated full-catalogue endpoint report
  that distinguishes blocked, missing, and failed schedule sources.
- Dependabot version updates for Python and GitHub Actions, plus CodeQL scans
  for Python and JavaScript.
- Parser and health-check tests with a 90% enforced Python branch-coverage
  threshold.
- Official-page, schedule, rights, and jurisdiction-flag records for the
  Scottish Parliament, Senedd Cymru, and Northern Ireland Assembly.
- Schema v3 media-accessibility records for captions, caption languages,
  sign-language interpretation, audio description, and evidence notes.
- Locked HTML validation, Axe, and Playwright accessibility checks in local
  verification and CI, including desktop and mobile interaction assertions.
- Official privacy-enhanced YouTube uploads-playlist embeds for Australia, UK
  Parliament, and Costa Rica, with stable live-page fallbacks.
- Schema v5 external identity metadata: Wikidata QIDs for every catalogue
  institution plus IPU Parline country, parliament, and chamber codes for
  applicable national bodies, each backed by dated provenance records.
- Eighteen official-player and schedule records for Canadian, Australian,
  German, and Spanish sub-national legislatures, plus Jalisco's validated
  direct HLS parliamentary channel.
- A dated static and deep-browser validation set for the 2026-08-16
  sub-national promotion pass.
- A strict-typed Python catalogue manager with candidate scaffolding and
  promotion, safe add/update/remove operations, JSON Schema plus cross-record
  validation, validation-seed generation, identity audits, health checks and
  report diffs, CSV export, and automatic site-snapshot regeneration.
- Candidate review records under `candidates/` and a complete catalogue
  maintenance guide.
- Strict mypy and catalogue business-rule checks in local verification and CI.

### Changed

- Removed the redundant public "How to read this catalogue" section and its
  obsolete localization and accessibility-test hooks.
- Recorded Tier 3 expansion criteria as future planning only; no Tier 3
  discovery targets or automation have been implemented.

- Migrated the catalogue to schema v6: renamed the misleading
  `attribution_text` field to `provenance_note`, removed obsolete static
  `program` placeholders now superseded by generated schedule snapshots, and
  represented absent accessibility notes as null instead of repeated prose.
- Made public-page playback reject insecure HTTP manifests when served over
  HTTPS, count only implemented schedule collectors in the coverage summary,
  and localize the newer sub-national jurisdiction names in major translated
  interfaces.
- Linked the selected catalogue row and evidence panel with a shared visual
  marker, and localized the new research-interface labels in every supported
  language.
- Localized generated detail-card headings, accessibility states, schedule
  link categories, and evidence-link labels while preserving catalogue notes
  and source-authored text in their recorded language.
- Removed the redundant attribution row and generic accessibility fallback
  note, limited Now/Next display to collected schedule snapshots, and localized
  the catalogue's generated playback-policy recommendations. Rights paragraphs
  are now identified as catalogue summaries rather than implied quotations.
- In non-English views, kept localized evidence links and generated guidance
  visible while moving English catalogue-authored rights and recommendation
  prose into a clearly labelled, collapsed research-notes disclosure. Also
  suppressed source-dependent accessibility notes that repeated the statuses
  immediately above them.
- Replaced Quebec's two machine-only POST schedule API links in the public card
  with one usable link to the Assembly's webcast page; both live and upcoming
  API records remain available to the Python schedule collector.
- Completed an interface-localization contract for every supported locale,
  including filters, errors, sorting announcements, player failures, mobile
  controls, and assistive descriptions; automated browser checks now reject
  missing messages or status labels in any locale.
- Kept source-authored and catalogue research prose in its recorded language
  while moving useful English accessibility notes into the explicitly labelled
  research disclosure on non-English pages. Corrected the accented official
  name `Assemblée nationale du Québec` across all 14 Quebec channel records and
  added consistency checks for repeated service families and source statuses.
- Corrected the Council of Europe / PACE official-page record from the
  misleading `needs_review` access status to `link_only`; no direct playback
  endpoint is currently recorded for that source.
- Reworked the mobile source details into a non-modal, resizable bottom sheet
  that keeps the catalogue available for switching streams.
- Tightened mobile catalogue rows and reorganized sheet spacing, actions, and
  metadata for smaller screens.
- Made selection of an embeddable catalogue entry start its player immediately.
- Simplified the schema v2 catalogue by removing inactive `short_name`,
  `display_mode`, and `metadata_level` fields.
- Made deep browser validation require explicit input and output report paths,
  preventing a fresh run from overwriting historical evidence.
- Refined the catalogue table, sorting, compact stream detail panel, and link
  labels for supporting source evidence.
- Recorded the opt-out playback posture and source-specific reuse evidence more
  clearly in the catalogue and documentation.
- Replaced simulated table rows with a native list of buttons, preserved focus
  during selection, and added keyboard focus management for the mobile detail
  sheet.
- Marked untranslated source and legal fields with their recorded language and
  strengthened control borders, focus indicators, and reduced-motion behavior.
- Advanced the catalogue to schema v4 with explicit provider, playlist,
  live-page, and qualification metadata for official embeds.
- Renamed the working roadmap to `PLANS.md` and the research log to `NOTES.md`.
- Replaced browser-side EPG retrieval with same-origin static schedule JSON
  generated during the Pages deployment.
- Clarified that Python and `uv` own catalogue management and verification,
  while Node and npm provide HTML, browser, and accessibility development
  checks and are not part of the deployed site's runtime.
- Promoted Mongolia Parliament TV to technically validated after its live DASH
  manifest, initialization object, and current media segment all responded.
- Made schedule collection tolerant of individual source errors while blocking
  deployment when no source succeeds.
- Added official schedule and agenda surfaces to previously undocumented
  national sources and replaced Prince Edward Island's stale month-specific
  calendar URL with its stable calendar route.

### Fixed

- Removed the redundant standalone fallback-source directory from the public
  catalogue while retaining related official fallbacks in channel details and
  the complete machine-readable fallback dataset.

- Corrected copied Knesset accessibility metadata that had been attached to
  Chile Camara TV, recorded the separate official Hebrew-captioned Knesset
  stream as source-dependent accessibility, and added validation to reject
  caption-language metadata that conflicts with a channel's declared language.
- Removed two non-existent Harmony API guesses while retaining the working
  ParlVU and SenVu HTML schedule collector, replaced stale Netherlands and
  Thailand supporting links, and moved Nunavut's non-resolving historical HLS
  endpoint to research-only review status.
- Demoted Brazil TV Camara from native direct-HLS playback to official-page
  link-out after the official page's embedded HLS manifest began returning HTTP
  404, matching the scheduled stable-stream regression audit.
- The accessibility/browser site check now derives expected catalogue metrics
  from `data/channels.json` instead of hard-coding counts that drift when new
  sources are added.
- Replaced an ambiguous bot-protection substring check with an explicit
  response-body pattern, resolving the CodeQL URL-sanitization finding without
  weakening the New Zealand schedule parser.
- Made health-check retries cover transient HTTP 4xx responses as well as
  disconnects and server errors, avoiding false stable-stream regressions when
  a CDN briefly redirects a valid manifest to an unavailable edge.

- Aligned the repository description, website, topics, and README branding with
  the Parliament Streams public catalogue.
- Installed `uv` in CI so Makefile verification commands use the same locked
  environment as local development and Dependabot checks.
- Applied the current tested Ruff and GitHub Actions dependency updates in one
  consolidated maintenance change.
- Switched Python dependency updates from Dependabot's `pip` integration to its
  native `uv` integration so `pyproject.toml` and `uv.lock` remain synchronized.
- Verified the catalogue manager and scrapers with mypy 2.3.1 and Ruff 0.16.3.
- Restored the jurisdiction, format, and use-guidance filters at desktop widths
  while keeping them in a collapsible control on mobile.
- Made `site/index.html` load the complete catalogue when opened directly as a
  local file, with a generated data snapshot kept in sync by CI.
- Removed an unused catalogue-filter helper and obsolete multilingual
  translation keys.
- Standardized row alignment, outbound-link treatment, terminology tooltips,
  and source-evidence labels in the public catalogue.
- Removed internal scraper implementation status from the public EPG display.
- Removed invalid and unsupported ARIA attributes from catalogue controls and
  restored focus to the selected source when the mobile detail sheet closes.
- Replaced YouTube Error 153 in direct-file previews with an explicit HTTP
  preview/public-catalogue fallback; hosted and local-server embeds are unchanged.
- Added a favicon-specific crop with a full very-dark-green background that
  fills the browser icon canvas while preserving the original recovered mark
  for the site header.
- Added compact Wikidata and IPU Parline identity links to each public stream
  detail view without importing unrelated external political datasets.
- Extended the resizable source-detail bottom sheet through tablet and narrow
  desktop widths, eliminating the easy-to-miss detail card below the catalogue.
- Raised Python catalogue-management coverage to 95% overall branch coverage
  while retaining the enforced 90% CI floor.
- Made the Python health checker record remote HTTP disconnects as per-source
  failures instead of aborting the complete validation run.

## 2026-08-14

### Added

- Refreshed Tier 1 and Tier 2 national validation, supranational research, and
  non-US sub-national research reports.
- Added Nunavut as a validated direct-HLS catalogue source.

### Changed

- Updated catalogue entries, provenance, permission notes, documentation, and
  browser validation tooling following the refresh.

## 2026-07-29

### Added

- Repeatable Python health-check tooling and dated live validation reports.
- Democracy Tier 1, Tier 2, and Tier 3 discovery reports.
- Browser/player validation for sources that expose manifests only after
  JavaScript loads.

### Changed

- Expanded the catalogue schema, data-contract tests, contributor guidance,
  source-rights evidence, and research documentation.

## 2026-06-19

### Added

- Canonical JSON catalogue, schema, Python schedule parsers, data-contract
  tests, and source-rights documentation.
- CI validation with Ruff, JSON checks, compilation, and unit tests.

### Changed

- Converted the repository from an Apple-platform application to a public
  parliamentary-stream documentation and data project.

### Removed

- Active SwiftUI, Xcode, TestFlight, and Apple-platform release material from
  the working tree. The previous application remains in Git history.
