# Catalogue Maintenance

`data/channels.json` is the canonical published catalogue. Use the
`parliament-streams` Python command for routine maintenance so schema rules,
cross-record invariants, dates, and the generated direct-file site snapshot stay
coherent.

## Which File Should I Edit?

| Task | Start here | Notes |
| --- | --- | --- |
| Add a new source | `parliament-streams candidate-new` | Prefer a candidate record under `candidates/` until evidence is complete. |
| Fix an existing channel | `parliament-streams show <id>` | Export or prepare one full channel object, then use `update --dry-run`. |
| Change generated site data | `make site-data` | Do not hand-edit `site/catalogue-data.js`. |
| Refresh validation-history links | `make validation-history` | Run after adding retained `reports/health/` artifacts. |
| Check validation-history drift | `make validation-history-check` | Included in `make verify`. |
| Add now/next metadata | `epg_sources` plus a scraper | Use `planned` until the parser is implemented, registered, and tested. |
| Record research context | `NOTES.md` | Move stable guidance into `docs/` when it becomes reusable. |
| Check source rights | `docs/source-rights-and-permissions.md` | Technical playback and permission are separate decisions. |
| Change the public site UI | `site/` | Run `npm run check:site` or `make verify`. |

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

Audit all unique supporting links recorded across channel metadata:

```sh
uv run parliament-streams links-audit \
  --output reports/links-validation-YYYY-MM-DD.json
```

The link audit checks official pages, permission evidence, identity references,
and embed surfaces in parallel. It deliberately excludes playback and EPG URLs,
which receive manifest-aware and request-aware checks from `health-check` and
`epg-audit`. Reachable responses include a bounded byte count and SHA-256
fingerprint so a later report can reveal that source evidence changed.

Audit playback presentation against rights and technical evidence:

```sh
uv run parliament-streams playback-policy-audit \
  --output reports/playback-policy-audit-YYYY-MM-DD.json
```

The playback-policy audit is local and does not make network requests. It
reports review tensions such as `native_playback` entries whose permission
status is still pending, `link_out` entries that retain a validated playback
URL as evidence, and `research_only` entries that keep a playback URL for
future review.

`.github/workflows/catalogue-audit.yml` runs these checks daily and uploads the
reports without committing transient results. Its Sunday job generates a full
catalogue seed and runs Chromium against every official page. The workflow
compares only `always_on` stream health with the preceding run so event-based
feeds do not cause false regression failures outside sitting hours.

## Schedule And EPG Sources

Add and update schedule-page metadata through the normal typed catalogue record
workflow. An implemented source names a registered Python parser:

```json
{
  "scraper": "europarl-webstreaming",
  "scraper_status": "implemented",
  "url": "https://multimedia.europarl.europa.eu/en/webstreaming",
  "method": "GET",
  "kind": "webstreaming_schedule_page"
}
```

Use `parliament-streams update` to persist a reviewed endpoint change; it
validates the complete record and regenerates the direct-file site snapshot.
Then run `make schedules` to test retrieval, parsing, and normalized output.

Check every unique recorded EPG URL and retain a dated report:

```sh
uv run parliament-streams epg-audit \
  --output reports/epg-validation-YYYY-MM-DD.json
```

The endpoint audit checks reachability independently of parser output and
deduplicates URLs shared by multiple channels. Access-blocked responses are
kept distinct from missing endpoints. Discovery-based collectors may resolve a
current machine-readable download from a stable official index, as the
Portugal open-data adapter does; do not persist opaque download tokens in the
catalogue.

The shared collector writes `data/schedules.json` locally. GitHub Actions writes
the same snapshot directly into the Pages artifact every six hours without
committing transient events. The European Parliament's Next.js data URL
contains a deployment-specific build ID and must be updated in its Python
scraper when the official site deploys a new build. A source failure is recorded
and the page retains the official schedule links without presenting stale
Now/Next text.

### Offline Research Parsers

Schedule parsers consume saved official responses so the exact downloaded input
can be retained beside a research run:

```sh
uv run python -m parliament_streams.scrapers cpac cpac-schedule.html
uv run python -m parliament_streams.scrapers \
  quebec-webdiffusion live.json upcoming.json
```

The Node-based browser tools use the official Playwright and Axe integrations.
`tools/check_accessibility.mjs` is part of `make verify` and tests the local
catalogue UI; `tools/deep_validate_browser.mjs` is an explicit live research
tool that inspects third-party player traffic. Neither tool builds or runs the
deployed static site. The deep validator requires explicit input and output
report paths; see the README for the full invocation.

## Scheduled Candidate Discovery

The monthly `Candidate Discovery` workflow checks the canonical Tier 1 and
Tier 2 watchlists in `data/discovery/`. Static checks revisit known manifests
and inspect official-page HTML; Chromium checks capture player-loaded HLS/DASH
requests. The findings report deduplicates validated URLs against catalogue
playback and embed URLs.

Treat every `review` finding as research intake, not as an approved source.
Confirm that it represents the intended legislature and a stable channel,
record its official provenance, schedule behavior, accessibility evidence, and
rights posture, then create a candidate record. Scheduled discovery does not
edit `data/channels.json` or `candidates/`.

When a validated manifest is deliberately rejected, record the outcome in
`data/discovery/reviewed-manifests.json`. The monthly workflow retains those
findings in its report but does not reopen them as candidates. Use this only
for evidence-backed dispositions such as a third-party relay, an executive
broadcaster outside the catalogue scope, an insecure legacy endpoint, or a
timestamped event manifest.

The workflow mirrors the current findings into one persistent
`candidate-discovery` issue so the queue remains visible after artifacts expire.
Reruns update that issue rather than creating duplicates, and a clean monthly
run closes it.

The daily catalogue audit separately opens one `stream-regression` issue for
each newly degraded `always_on` stream and closes it only when the health diff
records a recovery. Event-based sources, isolated EPG failures, blocked
supporting links, and browser-only noise stay in artifacts until the project
has repeated-failure evidence strong enough to avoid notification churn.
CodeQL and Dependabot continue to use their native alerts and pull requests.

The watchlist itself requires maintenance. General web search, new official
sites, renamed institutions, and entirely new player surfaces cannot be
discovered reliably from a closed set of URLs. Update the target files when
manual research identifies a better official page.

## Complete Verification

```sh
make verify
```

The verification target checks JSON syntax, schema and cross-record rules,
generated-data drift, Ruff formatting and linting, strict mypy, Python
compilation, unit and branch coverage, HTML validity, Axe results, responsive
browser behavior, and keyboard/accessibility assertions.
