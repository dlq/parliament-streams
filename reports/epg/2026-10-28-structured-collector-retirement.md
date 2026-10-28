# Structured Collector Retention — 28 October 2026

[Measured results](2026-10-28-structured-collector-retirement.json) ·
[Current input backlog](2026-10-28-unimplemented-collectors.md)

The later same-day structured-source decision removes **nine of 30 collectors**.
There are now **21 collectors**, **35 parser-connected records** and **24 implemented
metadata URLs**. The viewing catalogue stays at **261 sources**, with **226 records
without an active collector**. Official viewing/schedule links, map membership,
search and media/rights policies are retained. Existing `planned` source status
means no active collector; it does not promise restoration of a presentation scraper.

## Retired Code

| Collector | Reason |
| --- | --- |
| Brazil TV Câmara | Visible clock/title rows and active-weekday tab; no authoritative broadcast date. |
| Canadian ParlVU/SenVu | Long presentation-card matching with human-readable date/time strings. |
| Czech Chamber | Human-readable weekly programme and localized HTML date/clock parsing. |
| French commissions | Presentation table, human date/clock columns and no structured event record. |
| Luxembourg agenda | IDs and midnight date markers do not supply the start; depends on visible desktop/mobile clocks and badges. |
| Mauritius Parliament TV | Presentation cards, human-readable dates and titles rather than structured programme records. |
| Quebec linear TV guide | Human-written French programme paragraphs and ranges. |
| Spain Canal Parlamento | Weekly-link discovery and presentation date/clock conventions. |
| YouTube live resolver | Heuristic live/upcoming markers combined with canonical/social-card metadata, not parsed dated event records. |

Their modules and parser-specific tests are deleted. The unused shared French
human-date helper is also removed. New Zealand's active JSON collector stays,
but its legacy presentation-HTML/status parsing path is removed; non-JSON HTML
is an error, with concise bot/loading diagnostics. Shared tests for active sources,
publication schemas, quality gates, timezone handling and stale recovery remain.
The YouTube-specific publication-precedence branch is gone with the resolver.

## Retained Inputs

| Input contract | Active collectors |
| --- | --- |
| JSON | TV Senado, Dutch Debat Direct, EBS, Estonia, European Parliament, Italian Senate, New Zealand, Portugal, Quebec webdiffusion, Taiwan, UK Parliament |
| XML / iCalendar | Sweden / Norway |
| Embedded JSON | Rhode Island Cablecast |
| Machine-readable HTML fields | CPAC (`data-airdate`); Ireland (Unix start/end attributes); Italian Chamber (event IDs and explicit start attributes); Knesset (programme IDs, date/time/title attributes); Ontario (`time datetime`); UN Web TV (machine timestamp nodes and event IDs) |
| Sole hybrid exception | Bundestag TV 1: exact channel identity and explicit Unix end timestamps cross-check the dated printed start/range. |

Machine-readable HTML is still coupled to some layout. Ontario's title association
and UN Web TV's section recognition need hardening; retained does not mean immune
to change. Portugal's terminal JSON remains useful despite fragile HTML link
resolution. European Parliament's JSON route still pins a frontend build ID.
Taiwan and Knesset retain separate access holds. These remain targeted maintenance
items; the policy does not automatically remove every HTML-discovered JSON source.

There are no pure-presentation exceptions beyond the explicitly retained Bundestag
hybrid. Any future exception or reimplementation needs source-specific value and
an explicit recorded decision. Generic SEO JSON-LD or recording upload metadata
cannot establish event/broadcast times.

## Collection And Publication Effect

The fresh local snapshot at **2026-10-28 17:49:36 UTC** contains **16 successful
sources, four empty windows and one Knesset HTTP 403**, with **16 fresh channel
schedules**, **679 events** and no stale channels. Retired sources and their channel
outputs are absent even though the collection received the earlier 30-source
snapshot for recovery. Regression checks verify that last-good recovery cannot
revive them and offline XMLTV export rejects their old complete cached ranges.

The validated bundle contains **242 XMLTV programmes across seven populated
channels**, **44 definitions**, and unchanged **four stable / 38 broader playlist
admissions**. Reviewed scraper/feed associations fall from 15 to 11; definitions
for playlist-only services can remain without programme data. Programme coverage
and channel definitions are separate counts.

A controlled comparison using the earlier **16:06:46 UTC snapshot** still exports
**246 programmes before and after removing the retired mappings**. Those retired
collectors contributed no usable XMLTV programmes at that checkpoint. The fresh
242-programme count is from a later time window, not a measured four-programme
loss caused by retirement. Website-only meeting listings and potential future
guide coverage for retired sources are reduced; official schedule links remain.

The current backlog has **243 distinct inputs / 249 source associations** on 236
records; 226 records have no active collector and ten retain unimplemented
alternatives alongside an active one. This is a discovery register, not a queue
to recreate every deleted collector. The earlier same-day ranking/addition reports
remain historical evidence and are superseded by this retention decision.

## Validation

Verification passes with **457 Python tests**, **nine JavaScript tests**, strict
typing across **66 source files**, lint/format, data-product validation and the
updated browser/accessibility checks. Browser coverage now verifies the retired
Czech guide exposes official links rather than claiming an active empty window.

Repository checks cover the active registry, canonical/source associations,
generated site and service data, strict typing, meaningful surviving tests,
publication contracts, HTML, browser interactions and accessibility. Dedicated
retirement tests cover stale-cache and offline-export boundaries. The actual local
JSON/playlist/XMLTV/quality bundle passes publication validation. No broadcaster
playback or audible media was used. Changes have not been committed or deployed.
