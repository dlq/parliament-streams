# Provincial Metadata And Proceedings Follow-up — 23 October 2026

This is a further working-tree update, not a deployment assertion or a claim that all 652 bodies have complete metadata and playback certification.

- Catalogue: **165 sources**, including 72 national, 87 subnational/territorial and six supranational; **67 mapped regional jurisdictions**.
- Added four official viewing services: **Arauca, Caquetá, Risaralda and North Kalimantan**.
- Identified **40 further institutional routes**, reducing the 118 missing URLs to **78**. Combined with the previous 57 corrections, 97 of the original 175 gaps now have a scoped institutional route.
- Eligible regional queue: **67 covered; 585 without a matched catalogue service**. Authority remains 652 eligible, 458 excluded, ten specific holds and two predecessors.

## New Services

Each institution explicitly links to its provider. Separate legislative Wikidata identities were reviewed by type, country and jurisdiction; the items lack website/provider claims, so the primary ownership evidence is recorded independently rather than attributed to Wikidata.

Two distinct proceedings per service were sampled in Chromium and WebKit and visually inspected beyond opening graphics. Caquetá covers an environmental hearing and a different victims-policy sitting; Arauca has two ordinary sittings; North Kalimantan includes a selection hearing and a separate plenary accountability presentation; Risaralda shows substantive legal and education budget presentations after introductory tourism material. One detached WebKit frame passed a bounded retry.

All four are permission-pending **official link-outs**. Reviewed Colombian policy pages link to Mi Colombia Digital operator terms, which do not independently license these recordings. No native player, HLS/strict IPTV addition or implemented XMLTV parser is implied. Recording indexes remain planned schedule metadata. Spoken-language, captions, current-live and complete committee-room coverage remain unresolved.

Regional flags, parent-country search, maps and schedule links are reconciled. The three Colombian boundaries use Natural Earth. North Kalimantan uses OCHA ROAP/HDX via geoBoundaries gbHumanitarian, CC BY 3.0 IGO, with 2019 source vintage, rounded coordinates and D3-compatible winding; the obsolete combined East Kalimantan feature was not substituted.

## Metadata Decisions And Holds

The [machine-readable report](2026-10-23-completion-review.json) contains all 40 route decisions, access limitations, 78 remaining metadata records, exact source identities and asset metadata. A contact directory, legal portal or sparse institutional profile has an explicit scope; it is not a verified live service or current-membership certificate.

Remaining URL gaps: Philippines 41, Indonesia 18, Suriname ten, Panama four, Sri Lanka two, Colombia two and Argentina one. Grouped targeted searches remain discovery; they are not relabelled as complete individual reviews.

- Removed Southern Leyte’s board page from Leyte’s media leads; these are separate provinces.
- Aurora’s official embedded session-titled video is a short news item. A 30-minute seek exceeded its 5:40 duration; no full proceedings service was established.
- Casanare’s Live tab shows a 49-second fragment. La Guajira’s designated YouTube collection is historical speeches/news. Both need fuller archive/provider review.
- Iloilo’s inspected video index contains tourism, hymn and job-fair material. Surigao del Sur’s page labelled live contains edited civic/executive events. Neither establishes its own board proceedings.
- Chubut retains its unexpected-content hold; an indexed legislative subpage now times out. Guimaras legislative routes and Ilocos Norte’s former officials route are 404; replacement routes need corroboration.
- Surinamese district commissioners are executive officials, not substitutes for Districtsraad service identity. Panama’s privately administered informational sites and cultural/educational descriptions are not accepted as current congress-owned services.

## Verification

Focused catalogue → source link, country search, regional flag, map polygon → source link and schedule-index flows pass in Chromium and WebKit at 1280 px and 320 px. Screenshots were inspected; no overflow or page/console errors were observed. `make verify` passed, including catalogue/candidate/history/generated-data validation, Python checks and coverage, HTML validation and browser accessibility. `git diff --check` passed.

Evidence: [page reviews](../health/2026-10-23-completion-pages.json), [followed profiles](../health/2026-10-23-completion-pages-2.json), [provider designation](../health/2026-10-23-completion-pages-3.json), [provider indexes](../health/2026-10-23-completion-providers.json), [playback](../health/2026-10-23-completion-validation.json), [UI checks](../health/2026-10-23-completion-ui.json).
