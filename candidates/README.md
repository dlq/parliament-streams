# Catalogue Candidates

This directory holds evidence-backed source research and its review outcome,
including records that were rejected or promoted to `data/channels.json`.

Create candidates with `uv run parliament-streams candidate-new`, retain review
decisions in `decision_notes`, and use the `researching`, `ready`, or `rejected`
status while reviewing it. Only a `ready` candidate that passes the complete
published-catalogue contract can be promoted. The promotion command records the
terminal `promoted` state; it cannot be set through `candidate-status`.

## Current Review Queue

As of **26 October 2026**, the 184 candidate files contain **171 promoted**,
**twelve researching** and **one rejected** record. This is a dated directory
snapshot, not the catalogue's total source count; the JSON status fields govern
each candidate's current state.

- Nine formerly published unready feeds: five Spanish Congreso variants, Estonia
  Live 2, Mongolia Parliament TV, Ontario House EN CC and El Salvador. Full records
  and review history are retained; usable sibling services stay published. See the
  [catalogue separation](../reports/discovery/2026-10-26-catalogue-research-separation.md).
- Chile Chamber Sala IV: room identity, schedule mapping and rights scope need
  review despite official-page discovery and sample media checks.
- France's Senate: the live service opened, but published hyperlink conditions
  include prior webmaster notification. No notification has been sent.
- Rivera Departmental Board: official channel and October proceedings validated,
  but a separate institutional Wikidata ID has not been established.

Iceland Alþingi is now `promoted` as a **historical committee archive**. Its
selected 2023 recording supports that narrow scope; the title/camera date
conflict, current-player challenges and independent reuse questions remain
explicit. See the [25 October national review](../reports/discovery/2026-10-25-continued-national-viewing-validation.json).

Skåne is retained as `rejected`: official authority evidence places it outside
the current regional-legislature scope. Its browser access failure is a separate
finding. See the [held-candidate and authority follow-up](../reports/discovery/2026-10-22-authority-followup.md).

## Review And Promotion

Apply the [catalogue scope rule](../docs/catalogue-scope.md) before promotion.
Ordinary councils are not eligible merely because they broadcast meetings.
Broad discovery watchlists are not candidate records: the authority inventory
is `data/discovery/institutions.json`, while the older U.S. federal/50-state
watchlist remains in `data/discovery/us-legislatures.json`. Create a candidate
only when research identifies a distinct source for normal evidence review.

Event, official-player and provider fallback ideas can start in
`data/fallbacks.json` when they lack a distinct channel identity. A published
candidate needs a supportable playback or link-out posture. See
[catalogue maintenance](../docs/catalogue-maintenance.md) and
[contributing](../CONTRIBUTING.md) for the workflow and evidence requirements.

## Historical Promotion Evidence

The following dated findings preserve earlier review stages, including source
limitations observed then. They are not a second current candidate queue; use
[research status](../docs/research-status.md) and the canonical JSON for later
decisions.

The Czech chamber feed
passed active live-media and browser-decode checks and was promoted; Sweden
and Finland were added as official-page link-outs. See the
[in-depth audit](../reports/discovery/2026-10-22-in-depth-audit.md).
Earlier passes retained sixty-eight promoted records for audit history, including the eight
first-expansion links, five later territorial services, three Dutch provincial
viewing services and Bern's official
Online-Tagblatt archive. Bern's cantonal-parliament identity is Q664547; the
archive promotion does not assert validated live coverage. See the
[current research status](../docs/research-status.md);
`data/channels.json` governs their current published status.

Drenthe, Limburg and Noord-Brabant were promoted after recording playback checks.
Nine other Dutch provincial services remain discovery leads with access blockers,
not formal candidates. See [the twelve-province review](../reports/discovery/2026-10-22-dutch-province-decisions.md).

The [territorial follow-up](../reports/discovery/2026-10-22-territorial-followup-decisions.md)
adds Guam, Puerto Rico Senate and Gibraltar archive. Bangsamoro and Vojvodina
remain discovery leads with specific blockers, rather than formal candidates or
published sources. Cook Islands’ historical archive was added in the later
[23 October pass](../reports/discovery/2026-10-23-territorial-validation.md), alongside
Guernsey’s official meeting recordings. Cook Islands current live coverage is
still unverified.

The [further territorial pass](../reports/discovery/2026-10-22-territorial-continuation.md)
adds Cayman Islands and Turks and Caicos after public playback checks, and
retains narrower next actions for the remaining held discovery leads.

Bermuda was subsequently promoted as an official audio archive after House and
Senate playback succeeded in WebKit. Chromium fails with provider CORS errors;
that browser limitation and the personal-use reproduction restriction remain
explicit in its candidate and catalogue evidence.

The [full-queue pass](../reports/discovery/2026-10-23-full-queue-decisions.md) adds 27 more official viewing services after institution, proceedings and source-condition checks. All remain link-outs; legislative eligibility and media readiness are separate gates.

The [second validation pass](../reports/discovery/2026-10-23-validation-second-pass.md) adds Neuquén, Sicily and West Virginia, while retaining Rivera as researching.

The [metadata follow-up](../reports/discovery/2026-10-23-metadata-followup.md) adds
Corrientes Deputies and separate historical Senate recordings after exact chamber
identifiers, official provider links and two-engine proceedings checks. Neither
entry certifies all committee rooms or current live coverage.

The [provincial follow-up](../reports/discovery/2026-10-23-completion-review.md) promotes Arauca, Caquetá, Risaralda and North Kalimantan as official viewing links after exact legislative identity, source-designated provider and distinct-proceedings checks in Chromium and WebKit. Current live, all rooms and independent reuse rights remain open.

Chubut is promoted as a permission-pending official viewing link after exact institutional identity, independent government-to-provider designation and two ordinary sittings plus a committee recording checked in Chromium/WebKit. [Evidence](../reports/discovery/2026-10-23-chubut-review.json).

New Brunswick committee recordings, Åland plenaries and Montenegro plenary/committee recordings are added after exact institutional identity, current provider designation and scoped recordings in Chromium/WebKit. Fourteen selected checks were visually reviewed; default audio was muted, and all rooms/live, accessibility and independent reuse remain unresolved. See the [current individual follow-up](../docs/research-status.md).

Bolívar, Cesar, Guaviare, Magdalena, Quindío and Tolima have scoped recording links following recovered identity reviews; Quindío remains explicitly historical. [Six individual publication decisions](../reports/discovery/2026-10-24-colombia-six-publication-reviews.json).
