# Catalogue Maintenance

`data/channels.json` is the canonical published catalogue. Use the
`parliament-streams` Python command for routine maintenance so schema rules,
cross-record invariants, dates, and the generated direct-file site snapshot stay
coherent.

Apply the [catalogue scope rule](catalogue-scope.md) before promoting a new
institution: legislative authority matters; a council's public meetings alone
do not make it eligible.

## Protecting The Default Branch

The 24 October 2026 API check confirms that `main` is the public repository's
default branch and has no branch protection or rulesets. The recommended initial
setup is an **active branch ruleset targeting the default branch**, with
**Restrict deletions** and **Block force pushes** enabled. Leave ordinary updates
available so the current direct-push maintenance workflow continues.

Create it under repository **Settings → Rulesets → New ruleset → New branch
ruleset**; select the default branch as the target and set enforcement to Active.
These are independent controls; see GitHub's
[ruleset creation guide](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository).
The scheduled workflows read repository contents and produce deployment/report
artifacts or issues; they do not commit or push to `main`.

A later stricter mode can require a pull request and the
`Verify catalogue and scrapers` check, with zero required approvals for solo
maintenance. Do not require the Pages deployment as a pre-merge check: it runs
after changes reach `main`. The inspection made no settings changes.

## Which File Should I Edit?

| Task | Start here | Notes |
| --- | --- | --- |
| Add a new source | `parliament-streams candidate-new` | Prefer a candidate record under `candidates/` until evidence is complete. |
| Fix an existing channel | `parliament-streams show <id>` | Export or prepare one full channel object, then use `update --dry-run`. |
| Change generated site data | `make site-data` | Do not hand-edit `site/catalogue-data.js`. |
| Check for institution-inventory changes | `make inventory-review` | Live research signals and a report for review; no automatic membership changes. |
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

## Scope Recorded Viewing Evidence

An official archive can be listed with carefully scoped recorded-business
samples when institutional identity and provider ownership are independently
supported. Two member segments or morning/afternoon parts of one sitting are
not two meeting dates: retain that limitation in provenance and the publication
review. Ceremonies, introductory films and youth competitions are not ordinary
legislative business. Selected muted playback does not establish current live,
every room, audible tracks, complete accessibility or permission to redistribute.

The map combines the main regional collection with the separately licensed
`site/assets/maps/lienchiang-odbl.geojson`. Preserve that dataset's ODbL notice,
source/year, visible attribution and winding; do not silently relabel it as
Natural Earth or change the other map-data licences.

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
report paths; see [development and validation](development.md) for the full
invocation.

## Monthly Legislature Inventory Review

`.github/workflows/legislature-inventory-review.yml` runs on the fifth day of
each month at **08:23 UTC**, or on demand from Actions. It checks the national
IPU directory against the current canonical institution records and revisits
evidence pages recorded in `data/discovery/institutions.json`. The retained
reviewed chamber directory supplies fallback exact identity crosswalks, rather
than overriding current reviewed names, aliases or institution URLs. Country
reconciliation sources and institution pages provide change signals for regional
and special-status bodies as well as national ones. Watched sources also include
legal texts and directories; a reachable reference does not establish that it is
the institution's own official website or complete metadata coverage.

The result separates proposed additions, possible removals and other changes
from access failures and review gaps. A disappeared directory entry is a proposed
review, not a dissolution decision. A changed page, redirect or broken link does
not establish that an institution has changed its name or ceased to exist.
Generic directory-link changes are research leads; confirming legislative
authority and the agreed territorial scope still requires a person. This is a
maintained-source check, not a new exhaustive search of all possible bodies.
Reviews older than 365 days are flagged independently of HTTP freshness; a page
loading today is not a fresh authority review. HTTP responses are bounded to
2 MiB each, and truncated responses cannot establish removals.
Use an evidence-backed `institution_reviewed_on` date for an individual institution
review; updating one record must not freshen every other record's review date.
Without that field, the latest recorded legal-hold review or the inventory-wide
review date provides the fallback.
Collection has a 2,400-second budget within the one-hour workflow. Sources left
unchecked when that budget is exhausted remain explicit access gaps in the
partial report; the action does not treat them as unchanged or disappeared.

Each run writes `report.json`, readable `report.md`, a comparison `snapshot.json`
and a bounded `issue.md` in `reports/automated/legislature-inventory/`. A summary
of at most 30 findings appears in the Actions step summary; the complete report
and evidence are retained as an artifact for 90 days. One persistent `inventory-review` issue exposes
findings requiring attention, including inaccessible evidence. The workflow
does not automatically close human review when a later run observes no changes.

The next run restores a snapshot from the preceding successful default-branch
run's artifact. This avoids depending on an Actions cache that could expire
between monthly checks. Failed, partial or unparseable sources retain their last
successful observations; they cannot produce a false disappearance. Without a
retained baseline, the report explicitly identifies the first-run limitation:
page observations establish a new baseline, while the current national directory
can still be compared with the canonical inventory and retained identity crosswalk.

Run the same live check locally:

```sh
make inventory-review
```

The target uses an existing local `snapshot.json` as its previous baseline when
available. To compare with a downloaded Actions artifact instead:

```sh
uv run --locked python tools/check_legislature_inventory.py \
  --baseline /path/to/downloaded/snapshot.json \
  --output-dir reports/automated/legislature-inventory \
  --timeout 15 --workers 6 --budget-seconds 2400
```

Transient reports are review evidence rather than canonical data. After deciding
a proposal, update the inventory with dated official evidence, preserve historical
identities and exclusions. Record the finding's ID, `accepted` or `dismissed`
decision, review date and evidence note in
`data/discovery/inventory-review-decisions.json`. Pending proposals are retained
in subsequent snapshots until they are resolved by a reviewed canonical update
or an explicit decision; simply observing an unchanged page does not dismiss
them. Current access gaps clear when a source recovers. Then run:

```sh
make institution-inventory-validate institution-site-data
```

Review and commit the resulting change through the normal process. The monthly
workflow has read access to contents and earlier Actions artifacts plus permission
to maintain its review issue. It cannot push inventory or public-page changes.
Its live network check is deliberately separate from `make verify`.
`make inventory-review-validate` checks source planning and the decision journal
offline; it runs in `make verify`, CI and before the monthly collection.

Research pages can contain third-party credentials in embedded URLs, including
map-provider keys. Retained evidence redacts these values while preserving the
public page URL and useful institutional references. `make research-secrets-check`
scans tracked text offline and reports only credential types, file names and line
numbers. It runs in `make verify`, CI and the monthly preflight. The monthly
workflow also scans every generated report before publishing an issue, summary
contents or artifact. A failed or unavailable scan withholds those outputs and
the next comparison baseline, and records an explicit warning in the step summary.

For a newly reviewed national chamber, record the explicit
`external_ids.ipu_chamber_code` and `external_ids.ipu_country_code` so later checks
can match it without rewriting a dated research report. Where verified, current
`ipu_suspended`, `ipu_structure` and `ipu_parliament_name` values record changes
from the retained crosswalk. These fields, names, aliases and
`source_published_institution_urls` require reviewed evidence; a reported IPU
difference does not update them automatically.

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

### United States Candidate Inventory

`data/discovery/us-legislatures.json` is the canonical research inventory for
U.S. expansion. It contains six federal floor, committee, API, and broadcaster
candidates plus exactly one record for each of the 50 state legislatures. The
inventory is not a set of catalogue-ready channel records and is not currently
fed into the monthly Tier 1/Tier 2 browser workflow.

Validate it directly or through `make verify`:

```sh
uv run python tools/validate_us_candidates.py
```

The validator enforces unique candidate IDs, complete and unique 50-state
postal-code coverage, schema-valid official URLs, and stronger evidence for
records labelled `verified_official_video_surface`. That label means an
official legislature or authorized provider documents legislative video. It
does not establish a permanent channel identity, an open HLS/DASH endpoint,
embeddability, or permission to redistribute.

When researching a state, update its official, video, schedule, evidence, and
notes fields. Promote work into `candidates/` only after a distinct stable
channel or supportable official-page record has emerged and the normal
identity, technical, accessibility, schedule, and rights review can begin. The
initial priorities and scope boundaries are recorded in
`reports/us-federal-state-candidates-2026-08-24.md`.

## Complete Verification

```sh
make verify
```

The verification target checks JSON syntax, schema and cross-record rules,
generated-data drift, Ruff formatting and linting, strict mypy, Python
compilation, unit and branch coverage, HTML validity, Axe results, responsive
browser behavior, and keyboard/accessibility assertions.

## Cached Wikidata Research

Use `tools/wikidata_research.py` for new research batches rather than issuing
independent requests from each script. For example:

```sh
uv run python tools/wikidata_research.py \
  '{"action":"wbsearchentities","search":"Ålands lagting","language":"sv","uselang":"en","limit":3}'
```

The ignored `.cache/wikidata/` directory retains successful search responses,
including empty results, for 24 hours and entity responses for seven days.
A cache hit makes no network request, even during a service cooldown. Retained
successful search evidence can be imported with `WikidataClient.import_search`;
these entries identify the source report and their narrower retained-field scope.
Do not import failed searches as empty results. An empty result still requires
alias research and is not evidence that the institution has no item.

A shared file lock serializes batches. Normal requests are spaced three seconds
apart. Transient HTTP/service, network and API errors (including HTTP-200 `maxlag`) persist an
increasing cooldown: 60 seconds, 120, 240 and so on, capped at one hour. A longer
`Retry-After`, including an HTTP date, takes precedence. Authentication/access
blocks receive at least a one-day hold; do not work around them. Success resets
the failure streak. Cache files retain their original fetch/expiry dates.

The CLI makes one attempt and exits with status 75 when cooling down. Python
callers catch `Cooldown` and use its `seconds` field to defer the next attempt;
keep long waits outside blocking UI/tool calls. Reuse the same cache directory
across batches so restarting research does not reset the cooldown. `maxlag=5`
and normal TLS remain enabled. Cache evidence is not independent verification
of institutional identity, legislative authority, playback or reuse permission.

Rejected query parameters and other ordinary client errors return CLI status 2, with three-second request spacing but no service-failure increment. Correct those queries before retrying; genuine cooldowns return status75. Error messages go to stderr, keeping successful JSON output parseable.
