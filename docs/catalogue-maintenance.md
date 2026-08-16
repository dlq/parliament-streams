# Catalogue Maintenance

`data/channels.json` is the canonical published catalogue. Use the
`parliament-streams` Python command for routine maintenance so schema rules,
cross-record invariants, dates, and the generated direct-file site snapshot stay
coherent.

## Setup And Inspection

Install Python 3.11 or newer, `uv`, and the locked development environment:

```sh
uv sync --locked --extra dev
uv run parliament-streams validate
uv run parliament-streams candidates-validate
uv run parliament-streams list
uv run parliament-streams show cpac-ca
```

`list` accepts `--level`, `--source-type`, `--permission`, and `--json` filters.
Run `uv run parliament-streams <command> --help` for the complete option set.

## Add A Candidate

Start a new source as a reviewable candidate:

```sh
uv run parliament-streams candidate-new example-assembly \
  --name "Example Assembly Live" \
  --level subnational \
  --country-or-region "Example Region" \
  --legislature "Example Assembly" \
  --language English \
  --official-url https://example.gov/watch \
  --wikidata-qid Q123456 \
  --output candidates/example-assembly.json
```

For a direct source, also pass `--source-type direct_hls` or
`--source-type direct_dash` and `--playback-url`. For YouTube, pass
`--source-type youtube` and the official uploads playlist ID with
`--youtube-playlist-id`; the manager creates the privacy-enhanced embed record.

The scaffold deliberately records pending attribution, technical, rights, and
accessibility review. Edit the candidate with evidence from official pages,
source terms, Wikidata, applicable IPU Parline records, and observed stream or
player behavior. Candidate states are:

- `researching`: incomplete evidence is allowed, but the channel shape must be
  valid;
- `ready`: all published-catalogue rules apply, including identity evidence;
- `rejected`: retained as a documented decision but cannot be promoted;
- `promoted`: set only by `candidate-promote` after a successful catalogue
  write, preserving the outcome in the tracked research record.

Validate and promote a completed candidate:

```sh
uv run parliament-streams candidate-validate candidates/example-assembly.json
uv run parliament-streams candidate-status \
  candidates/example-assembly.json ready \
  --note "Identity, source, accessibility, and rights evidence reviewed."
uv run parliament-streams candidate-promote candidates/example-assembly.json
```

Promotion validates the candidate and complete catalogue, updates
`generated_on`, writes the catalogue atomically, and regenerates
`site/catalogue-data.js`. It then marks the candidate `promoted` and records a
dated decision note. A duplicate ID or playback URL is rejected.

## Change Existing Records

Use standalone channel JSON for direct maintenance. Preview mutations first:

```sh
uv run parliament-streams add record.json --dry-run
uv run parliament-streams update channel-id record.json --dry-run
uv run parliament-streams remove channel-id --dry-run
```

Remove `--dry-run` to apply an add or update. A real removal also requires
`--yes`. Candidate wrappers cannot use `add` or `update`; they must pass the
readiness gate through `candidate-promote`.

Manual edits to `data/channels.json` are still possible for bulk, reviewed
changes, but run `make site-data` immediately afterward. Never edit
`site/catalogue-data.js` as an independent source.

## Validate And Report

Create deterministic inputs for the static or Playwright validators:

```sh
uv run parliament-streams seed \
  --level national \
  --output reports/health/YYYY-MM-DD-national-seed.json
```

Run live HTTP and manifest checks for all or selected entries:

```sh
uv run parliament-streams health-check \
  --output reports/health/YYYY-MM-DD-catalogue-health.json

uv run parliament-streams health-check \
  --id cpac-ca \
  --id new-zealand-parliament
```

Use `--fail-on-error` when endpoint failures should produce a nonzero exit.
Compare two health reports and optionally fail on regressions:

```sh
uv run parliament-streams health-diff before.json after.json \
  --output health-diff.json \
  --fail-on-regression
```

Audit Wikidata/IPU field and provenance coherence or export a flattened
inventory:

```sh
uv run parliament-streams identity-audit --output identity-audit.json
uv run parliament-streams export --output parliament-streams.csv
```

The identity audit verifies catalogue coherence; it does not claim that an
external entity match is substantively correct. Live health checks establish
technical reachability, not permission to reuse a source.

## Schedule Parsers

Schedule parsers consume saved official responses so the exact downloaded input
can be retained beside a research run:

```sh
uv run python -m parliament_streams.scrapers cpac cpac-schedule.html
uv run python -m parliament_streams.scrapers \
  quebec-webdiffusion live.json upcoming.json
```

The browser validator remains JavaScript because it drives Chromium and inspects
runtime player traffic. It requires explicit input and output report paths; see
the README for the full invocation.

## Complete Verification

```sh
make verify
```

The verification target checks JSON syntax, schema and cross-record rules,
generated-data drift, Ruff formatting and linting, strict mypy, Python
compilation, unit and branch coverage, HTML validity, Axe results, responsive
browser behavior, and keyboard/accessibility assertions.
