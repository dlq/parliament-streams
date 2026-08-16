# Catalogue Candidates

This directory holds evidence-backed source research and its review outcome,
including records that were rejected or promoted to `data/channels.json`.

Create candidates with `uv run parliament-streams candidate-new`, retain review
decisions in `decision_notes`, and use the `researching`, `ready`, or `rejected`
status while reviewing it. Only a `ready` candidate that passes the complete
published-catalogue contract can be promoted. The promotion command records the
terminal `promoted` state; it cannot be set through `candidate-status`.

See [the catalogue maintenance guide](../docs/catalogue-maintenance.md) and
[the contribution guide](../CONTRIBUTING.md) for the workflow and evidence
requirements.
