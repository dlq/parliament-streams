# Maintained Data

The project has two canonical lists:

| List | File | Purpose |
| --- | --- | --- |
| Legislature inventory | [discovery/institutions.json](discovery/institutions.json) | Legislative institutions, authority decisions, exclusions, specific holds, aliases and relationships. |
| Stream catalogue | [channels.json](channels.json) | Reviewed official viewing sources, technical posture, schedule references, accessibility and permission evidence. |

An inventory record does not certify a stream. A catalogue source can be a
viewing page or recording archive, and an institution can have several sources.
Keep exact institution IDs when linking the lists; country or parent coverage
does not establish a chamber match. See the [discovery register guide](discovery/README.md)
and [catalogue scope](../docs/catalogue-scope.md).

## Supporting Maintained Inputs

- [fallbacks.json](fallbacks.json) records supplemental official platforms and
  player pages with limited playback claims.
- [supranational.json](supranational.json) records membership and participation
  context for international sources on the map.
- [discovery/tier1.json](discovery/tier1.json) and
  [tier2.json](discovery/tier2.json) preserve the agreed democracy-index research
  baseline and seed routes. They are priorities and discovery inputs, not a second
  copy of the institution inventory.
- [discovery/us-legislatures.json](discovery/us-legislatures.json) retains the
  earlier scoped U.S. discovery register.
- [discovery/service-review-inputs.json](discovery/service-review-inputs.json)
  explicitly selects dated service-review evidence consumed by maintenance.
  `registry_version: 1` and its sorted, unique `reports` paths are validated;
  missing, malformed or unsafe paths fail validation. Creating or renaming a
  report does not enroll it automatically.

## Decision Ledgers

[inventory-review-decisions.json](discovery/inventory-review-decisions.json)
records human dispositions of automated institution findings.
[reviewed-manifests.json](discovery/reviewed-manifests.json) and
[reviewed-page-leads.json](discovery/reviewed-page-leads.json) retain human
decisions about discovered manifests and observed viewing/programme links.

These ledgers preserve reasoning and prevent repeated review intake. They do
not apply inventory edits, publish sources, create EPG parsers or grant rights.

## Generated Views

- The browser loads [data/channels.json](channels.json) directly, without a
  generated JavaScript copy.
- `make institution-site-data` joins the inventory, exact catalogue matches,
  retained chamber/service crosswalks and registered reviews into
  [data/institutions.json](institutions.json), used by the
  [Legislatures page](../site/institutions.html).
- `data/schedules.json` is an ignored local collection snapshot. Pages collects
  its own schedules and generates the playlist, XMLTV and quality files in the
  publication artifact.

Edit maintained inputs and regenerate their views rather than editing generated
data products independently. `make verify` checks schemas, business rules,
review inputs and generated-data freshness; it does not certify current network
availability or legal permission. [Catalogue maintenance](../docs/catalogue-maintenance.md)
documents the review and promotion commands.

Some dated [reports](../reports/README.md) are also explicit maintenance inputs.
Preserve those paths and evidence when changing a current record.

[Data validation and coverage](../docs/data-validation.md) lists the enforced
schemas and cross-format publication checks. `make data-products-check` exercises
the export contracts offline; Pages validates its actual collected/exported
bundle before publication.
