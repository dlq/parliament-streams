# Data Products, Types And Coverage

The project uses static types for code, schemas for data shapes and formats,
and separate semantic checks for identities, mappings and publication policy.
None of these establishes current source availability, complete guide coverage
or permission to reuse a broadcast.

## Data Contracts

| Data | Contract and enforcement |
| --- | --- |
| Catalogue | [channels.schema.json](../schema/channels.schema.json), source/identity/rights business rules and catalogue validation before persistence/publication. |
| Fallback sources | [fallbacks.schema.json](../schema/fallbacks.schema.json), known catalogue references and playback-claim rules. |
| Supranational map context | [supranational.schema.json](../schema/supranational.schema.json), unique organization IDs and country-code lists. |
| Raw legislature inventory | Custom authority, identity, relationship, country-reconciliation and evidence checks in `make institution-inventory-validate`. This research register has no general JSON Schema. |
| Public legislature snapshot | [institution-site-data.schema.json](../schema/institution-site-data.schema.json), plus exact identity/crosswalk checks in the projection builder. Both generation and drift checks enforce the schema. |
| Discovery and U.S. target registers | [discovery-targets.schema.json](../schema/discovery-targets.schema.json) and [us-legislature-candidates.schema.json](../schema/us-legislature-candidates.schema.json), plus maintained-scope/identity checks. These are research inputs, not published viewing sources. |
| Collected schedules | [schedules.schema.json](../schema/schedules.schema.json) before a snapshot is written and when it enters an export/audit. |
| EPG quality | [epg-quality.schema.json](../schema/epg-quality.schema.json) before export or audit output is written. Publication also checks counters, source identity and the reviewed linear-feed allowlist. |
| M3U playlists | Generated extended-M3U structure, HTTP(S) URLs, unique catalogue IDs, eligibility, shared guide URL and byte-identical `.m3u8` compatibility aliases. A channel list is not an HLS media manifest. |
| XMLTV | UTF-8/well-formed XML, top-level records and required fields, known IDs, complete positive time ranges at whole-second precision, no overlaps, and programme content/counts matched to collected schedules and the quality report. This is the generator's supported subset, not a general XMLTV DTD validator. |

Schemas are checked against Draft 2020-12. Declared `date`, `date-time` and
international URL (`iri`) formats are enforced. The locked
`jsonschema[format-nongpl]` dependencies are required: the shared validator fails
if a declared format checker is absent, rather than silently treating it as an
annotation. See the [jsonschema format documentation](https://python-jsonschema.readthedocs.io/en/stable/validate/#validating-formats).

Repeated IRI parsing uses a bounded in-process cache of 8,192 string/checker
pairs. This caches the standard parser's result, including rejection; it does
not cache network availability or bypass schema checks.

## Local And Deployment Checks

```sh
make data-products-check
```

This validates every maintained schema and builds a temporary export bundle
from the current catalogue, fallbacks and map context, using an empty parsed
guide. It performs no source fetching and writes no generated products into the
checkout. Its zero-programme result is intentional; parser fixtures and export
regressions exercise real event records separately.

To validate an assembled publication bundle:

```sh
uv run --locked python tools/validate_data_products.py --data-dir _site/data
```

`make verify` and CI include the offline check. Pages runs the assembled-bundle
check after collecting current schedules and exporting playlists/XMLTV, before
uploading the publication artifact. It catches disagreement between files,
including malformed timestamps, unknown references, misleading guide mappings,
wrong programme content and playlist alias drift.

Historical research reports and human decision ledgers retain their own custom
validation and dated evidence contracts; they are not all covered by one schema.
See [data roles](../data/README.md), [report roles](../reports/README.md) and
[schedules and IPTV](schedules-and-iptv.md).

## Static Types

```sh
make type-check
uv run --locked --extra dev mypy parliament_streams tools \
  --any-exprs-report /tmp/parliament-types \
  --linecount-report /tmp/parliament-types
```

Strict mypy checks the Python package and Python maintenance tools. It does not
check the unit-test modules or browser JavaScript. Typed dictionaries, registered
parser contracts and explicit validation boundaries describe stable data shapes.
Raw JSON, external responses, dynamic adapter lookup and `argparse.Namespace`
still introduce `Any`; strict success is not a claim that every expression has
a precise static type. The expression report makes that distinction measurable.

## Test Coverage

```sh
make coverage
make test-js
make test-browser
```

The configured coverage gate measures Python runtime code under
`parliament_streams/`, with branch tracing enabled and a 90% combined minimum.
Report statement coverage, branch coverage and the combined score separately.
Maintenance tools have regression tests, but are outside that gate's denominator.
An optional diagnostic run can measure both areas without changing the gate:

```sh
COVERAGE_FILE=/tmp/parliament-all.coverage uv run --locked --extra dev \
  coverage run --source=parliament_streams,tools -m unittest discover -s tests
COVERAGE_FILE=/tmp/parliament-all.coverage uv run --locked --extra dev \
  coverage report --fail-under=0
```

That diagnostic measures in-process execution; separate workflow subprocesses
can be exercised without appearing in its line totals. Node unit tests and the
muted Playwright/Axe suite cover JavaScript behavior, desktop/mobile interaction,
localization, blocked storage and accessibility. They currently have no numeric
JavaScript coverage gate.
