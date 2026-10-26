# Reports And Evidence

This directory preserves dated research, source observations and review
decisions. Some reports are also explicit maintenance inputs. Check their role
and references before moving, renaming or removing them.

The current canonical lists live in [data/](../data/README.md): the
[Legislature inventory](../data/discovery/institutions.json) and
[Stream catalogue](../data/channels.json). A historical report's counts and
observations describe its own date and scope.

## Reports Used By Maintenance

| Input | Current role |
| --- | --- |
| [National chamber directory](discovery/2026-10-24-national-chamber-inventory.json) | Retained national identities, country codes and exact chamber crosswalks used by inventory projection and monitoring. |
| [Historical service register](discovery/2026-10-24-current-validation-register.json) | Earlier service cohort and exact catalogue associations. It supplements the maintained inventory; it does not define its complete scope. |
| Individual service reviews selected by [service-review-inputs.json](../data/discovery/service-review-inputs.json) | Dated institutional, media, programme and rights observations used in discovery planning, the public inventory projection and service baseline. |
| Per-channel reports under `health/` | Retained validation evidence used by `make validation-history` to build compact catalogue references. |

The service-review registry has `registry_version: 1` and a sorted, unique
`reports` list of repository-relative JSON paths under `reports/discovery/`.
Only listed reviews enter that maintenance input set. An unlisted report remains
evidence and can still be cited by a decision or catalogue entry.

The [current service baseline](discovery/2026-10-25-institution-service-baseline.json)
is a generated reconciliation of eligible identities, catalogue matches and
registered reviews. Its [readable queue](discovery/2026-10-25-institution-service-baseline.md)
helps select further work. Refresh it through the maintenance builder and use
`make service-baseline-check` to detect drift; it is not a third canonical list.

## Historical Evidence And Automated Outputs

- `discovery/` retains country research, authority analysis, reconciliations,
  publication decisions and service follow-ups. Several generations of a review
  can coexist; newer canonical decisions must retain their dated provenance.
- `health/` retains HTTP, manifest and browser observations. Reachable HTML,
  decoded recorded video, current live operation and reuse permission are
  separate findings. A successful old observation does not certify today's service.
- `ui/` retains dated usability/accessibility audits and original screenshot
  evidence. The [25 October Pages audit](ui/2026-10-25-audit.md) covers all four
  public views; its recommendations are human review inputs, not deployment gates
  or claims of complete WCAG conformance.
- Older reports directly in this directory retain their original paths so
  existing references remain meaningful.
- Workflows write fresh observations under `reports/automated/` and upload
  artifacts. Monthly inventory snapshots also carry pending findings into the
  next comparison. [GitHub Actions](../docs/github-actions.md) documents retention,
  review issues, missing baselines and incomplete checks.

Automated reports propose work for people. They do not edit either canonical
list, promote a source or clear media rights. Record accepted or dismissed
findings in the appropriate [decision ledger](../data/README.md#decision-ledgers)
and make source-backed maintained-data edits separately.

Preserve original source URLs and dates, identify uncertainty, and sanitize
copied credentials before publishing evidence. See
[sources and provenance](../docs/sources-and-provenance.md) and
[catalogue maintenance](../docs/catalogue-maintenance.md).
