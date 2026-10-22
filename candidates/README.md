# Catalogue Candidates

This directory holds evidence-backed source research and its review outcome,
including records that were rejected or promoted to `data/channels.json`.

Create candidates with `uv run parliament-streams candidate-new`, retain review
decisions in `decision_notes`, and use the `researching`, `ready`, or `rejected`
status while reviewing it. Only a `ready` candidate that passes the complete
published-catalogue contract can be promoted. The promotion command records the
terminal `promoted` state; it cannot be set through `candidate-status`.

As of 2026-10-22, four candidates remain `researching`:

- Chile Chamber Sala IV: room identity, schedule mapping and rights scope need
  review despite official-page discovery and sample media checks.
- Iceland Althingi: official broadcasts are documented, but the browser player
  returned an access challenge.
- Skåne: official regional WebTV was found, but browser access was denied;
  eligibility also needs the legislative-authority review.
- France's Senate: the live service opened, but published hyperlink conditions
  include prior webmaster notification. No notification has been sent.

The Czech chamber feed
passed active live-media and browser-decode checks and was promoted; Sweden
and Finland were added as official-page link-outs. See the
[in-depth audit](../reports/discovery/2026-10-22-in-depth-audit.md).
Nineteen promoted records are retained for audit history, including the eight
first-expansion links and five later territorial services. See the
[current research status](../docs/research-status.md);
`data/channels.json` governs their current published status. Event,
official-player, and provider fallback ideas should normally start in
`data/fallbacks.json` instead of becoming channel candidates unless they have a
stable channel identity and a supportable playback or link-out posture.

Apply the [catalogue scope rule](../docs/catalogue-scope.md) before promotion.
Ordinary councils are not eligible merely because they broadcast meetings.

Broad discovery watchlists are not candidate records. The U.S. federal and
50-state research inventory remains in `data/discovery/us-legislatures.json`;
move an entry here only after research identifies a distinct source that can
pass the normal catalogue evidence review.

See [the catalogue maintenance guide](../docs/catalogue-maintenance.md) and
[the contribution guide](../CONTRIBUTING.md) for the workflow and evidence
requirements.
