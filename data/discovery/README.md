# Discovery registers

`institutions.json` is the current institution/authority crosswalk for the fixed
71-country research baseline. Start the next institution-level work from this
file, rather than assuming the older 652-body service cohort is the complete list.

The [service baseline and queue](../../reports/discovery/2026-10-24-institution-service-baseline.md)
now reconcile all 940 eligible identity records with exact catalogue matches,
the earlier service evidence and new individual source follow-ups. Keep a new
review keyed to the exact inventory ID, with dated source observations and
separate per-use rights. Parent or jurisdiction coverage must not be copied into
a chamber. A partial source review is not complete media/EPG/rights validation.

The register contains eligible institutions, exclusions, specific legal holds and
historical predecessors. Its rows have different grains: umbrella legislatures,
chambers, constitutional formations and retained research entries. **The row total
is not a count of jurisdictions, parliaments or usable broadcasts.**

- `country_reconciliations` accounts for every target country and its known holds.
- `original_scope_decision_crosswalk` resolves the original 19 named questions.
- `identity_alias_crosswalk` prevents duplicate unicameral institutions.
- `authority_classification_overrides` applies current decisions while preserving
  the earlier regional ledger's dated conclusions.
- `territorial_dispositions` accounts for reviewed territories without inventing
  an institution when their framework provides no separate eligible legislature.
- Each institution retains primary sources, report provenance, scope reasoning
  and relationships. Authority clearance does not promote a viewing service.

Keep a source-backed decision when changing an identity or authority status;
preserve aliases and predecessor relationships. Reconcile country and summary
counts after an edit. Run `make institution-inventory-validate`; `make verify`
also runs this check. The validator checks identities, country coverage, chamber
crosswalks, authority overrides and counts; it does not revalidate legal texts or
network services.

The monthly `Legislature Inventory Review` GitHub Action checks the current IPU
directory and retained institutional/country evidence for proposed additions,
possible removals, other changes and access gaps. It produces review reports and
maintains one `inventory-review` issue; it does not alter this register. Successful
source observations survive a later fetch or parser failure, and a missing
previous snapshot is identified as a baseline gap. See the
[maintenance process](../../docs/catalogue-maintenance.md#monthly-legislature-inventory-review)
for evidence, retention, limitations and `make inventory-review`.
`make inventory-review-validate` checks review inputs, source planning and the
decision journal offline, and is included in CI and `make verify`.

`inventory-review-decisions.json` records human dispositions of automated findings:
each entry names its `finding_id`, `accepted` or `dismissed` decision, ISO
`reviewed_on` date and an evidence `note`. Additions, removals and authority changes
still require a source-backed edit to `institutions.json`; an accepted finding
does not apply that edit automatically. Undecided proposals remain in later
comparison snapshots, while resolved access failures clear after recovery.

`tier1.json` and `tier2.json` maintain the agreed EIU 2024 baseline, published in
2025. `us-legislatures.json` retains the earlier US discovery targets.
`reviewed-manifests.json` records source-specific manifest decisions. These files
have different roles and should not be summed as institution inventories.

[Readable reconciliation](../../reports/discovery/2026-10-24-inventory-reconciliation.md)
· [Public scope rule](../../docs/catalogue-scope.md)
· [Research status](../../docs/research-status.md).

The [eleven-case legal follow-up](../../reports/discovery/2026-10-24-legal-holds-review.md) records three current French exclusions and eight remaining holds. The register preserves previous authority findings and exact missing instruments; finishing a research pass does not clear unresolved legal authority.
