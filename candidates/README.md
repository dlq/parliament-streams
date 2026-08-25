# Catalogue Candidates

This directory holds evidence-backed source research and its review outcome,
including records that were rejected or promoted to `data/channels.json`.

Create candidates with `uv run parliament-streams candidate-new`, retain review
decisions in `decision_notes`, and use the `researching`, `ready`, or `rejected`
status while reviewing it. Only a `ready` candidate that passes the complete
published-catalogue contract can be promoted. The promotion command records the
terminal `promoted` state; it cannot be set through `candidate-status`.

As of 2026-08-24, this directory has no unresolved local candidates; the
remaining JSON files are promoted records retained for audit history. Event,
official-player, and provider fallback ideas should normally start in
`data/fallbacks.json` instead of becoming channel candidates unless they have a
stable channel identity and a supportable playback or link-out posture.

Broad discovery watchlists are not candidate records. The U.S. federal and
50-state research inventory remains in `data/discovery/us-legislatures.json`;
move an entry here only after research identifies a distinct source that can
pass the normal catalogue evidence review.

See [the catalogue maintenance guide](../docs/catalogue-maintenance.md) and
[the contribution guide](../CONTRIBUTING.md) for the workflow and evidence
requirements.
