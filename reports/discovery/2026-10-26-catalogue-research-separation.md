# Viewing catalogue separation — 26 October 2026

[Measured reconciliation](2026-10-26-catalogue-research-separation.json) · [Current research status](../../docs/research-status.md)

The viewing catalogue now admits supported direct playback, provider embeds and
official viewing links. Nine unready feed variants have moved to researching
candidates. Each candidate preserves its full previous channel record, including
URLs, metadata, source conditions, identity evidence and validation history.
No new playback or rights findings are inferred from this move.

| Unready feed | Research record |
| --- | --- |
| Spain Congreso en Directo 1 | [Retained candidate](../../candidates/spain-congreso-directo-1.json) |
| Spain Congreso en Directo 2 | [Retained candidate](../../candidates/spain-congreso-directo-2.json) |
| Spain Congreso en Directo 3 | [Retained candidate](../../candidates/spain-congreso-directo-3.json) |
| Spain Congreso en Directo 4 | [Retained candidate](../../candidates/spain-congreso-directo-4.json) |
| Spain Congreso en Directo 5 | [Retained candidate](../../candidates/spain-congreso-directo-5.json) |
| Estonia Riigikogu Live 2 | [Retained candidate](../../candidates/estonia-riigikogu-live-2.json) |
| Mongolia Parliament TV | [Retained candidate](../../candidates/mongolia-parliament-tv.json) |
| Ontario Legislative Assembly - House EN CC | [Retained candidate](../../candidates/ontario-house-en-cc.json) |
| El Salvador Legislative Assembly | [Retained candidate](../../candidates/el-salvador-legislative-assembly.json) |

Spain Canal Parlamento, Estonia Live 1 and Ontario's five supported feeds stay
published. Mongolia and El Salvador lose their viewing-map coverage and catalogue
links. Mongolia remains in the eligible inventory; El Salvador is outside the
71-country inventory and retains its institutional evidence in the candidate.
No authority or inventory membership decisions change: 940 eligible identities and eight
legal holds remain; 221 eligible identities link to 239 catalogue source IDs.

The catalogue decreases from 270 to **261 sources**: 38 direct-playback, three
provider embeds and 220 official viewing links, across 225 jurisdictions.
Parser-connected sources decrease from 44 to **43**, because Ontario's separate
unready closed-caption variant no longer duplicates its House schedule.
The 23 registered collectors, four stable and 38 broader playlist admissions,
and 44 XMLTV channel definitions remain unchanged. Generated schedule counts
are build-dependent; the catalogue, inventory projection and exports use current
source IDs. Historical reports retain their original observations and totals.

The candidate queue now has 184 records: 171 promoted, twelve researching and one
rejected. Publication validation rejects research-only records in the catalogue;
candidate readiness and promotion require a supported viewing route. Scheduled
catalogue checks and Pages use the same validation, while discovery continues
from the eligible institution inventory without automatically promoting leads.

## Verification

A fresh schedule/export preview at 17:49:15 UTC on 26 October validates all
publication contracts: 749 events across 19 sources and 370 XMLTV programmes
across eight populated guides. Fourteen reviewed mappings and 44 XMLTV channel
definitions remain distinct from populated guides. Seventeen collectors return
events, five are healthy empty results and Knesset retains its previously known
access error with last-good schedule recovery. These are dated preview counts,
not a new deployment.

All nine candidates preserve their original complete channel records exactly;
all 261 retained channel records and the institution inventory are unchanged.
No removed ID survives in schedules or EPG coverage. Both playlist extensions
for both admission tiers are byte-identical to the deployed hero release.

All 472 Python tests and eight JavaScript unit tests pass, with 93% Python
coverage. Formatting, linting, typing, schemas, generated snapshots, discovery
planning and service-baseline checks pass. HTML, maintained browser interactions,
responsive layouts and Axe accessibility checks pass. Credential scans find no
recognized secrets in the retained candidates or reconciliation report.
