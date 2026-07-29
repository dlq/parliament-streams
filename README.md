# Parliaments

Parliaments is a documentation and data project for public parliamentary
video sources. It records the stream endpoints, official pages, schedule/EPG
surfaces, scraper notes, and rights/permission evidence found while researching
open parliamentary video access.

The repository is intended to be a public, inspectable catalogue and research
record.

## What Is Here

- `data/channels.json`: canonical source catalogue.
- `schema/channels.schema.json`: machine-readable catalogue schema.
- `parliament_streams/scrapers/`: Python parsers for the schedule/EPG sources
  already understood by the prototype.
- `parliament_streams/healthcheck.py`: repeatable live endpoint/page health
  checker for catalogue entries.
- `reports/health/`: dated JSON health reports from live validation passes.
- `docs/sources-and-provenance.md`: source ownership, reuse, and provenance
  boundaries.
- `docs/source-rights-and-permissions.md`: source-by-source permission and
  rights evidence.
- `research.md`: working research log for stream discovery and source notes.
- `plan.md`: current roadmap for the documentation/data project.
- `tests/`: data-contract and scraper-registry tests.

## Catalogue Scope

The catalogue includes:

- direct HLS endpoints discovered from official pages, official APIs, or
  official-vendor player infrastructure;
- official YouTube/link-out sources where direct stream reuse is not
  appropriate;
- one legacy DASH research candidate kept for provenance;
- official pages used for source attribution and validation;
- schedule/EPG scrape surfaces for CPAC, Quebec, Ontario, New Zealand, Brazil,
  Spain, Ireland, and Nunavut;
- permission status, evidence links, and reuse recommendations for every
  channel entry.

This is not an endorsed global directory and not a rebroadcast service. Public
availability does not automatically mean permission to redistribute, embed, or
play a stream natively in another product.

## Python Scrapers

The scraper modules are small standard-library parsers. They are meant to
document and reproduce the parsing logic that used to live in Swift schedule
adapters.

Current scraper ids:

- `cpac`
- `quebec-webdiffusion`
- `new-zealand-parliament`
- `ontario-calendar`
- `brazil-tv-camara`

They parse supplied HTML/JSON strings. Network fetching is deliberately not
hidden inside the parsers so validation runs can record exactly what was
downloaded, when, and from which official endpoint.

Schedule sources use `scraper_status: implemented` when a parser exists and
`scraper_status: planned` when a source is documented but still needs parser
work.

Parse a saved response with the scraper CLI:

```sh
uv run --extra dev python -m parliament_streams.scrapers cpac /path/to/cpac-schedule.html
```

Quebec uses two official JSON endpoints, so pass the live response first and
the upcoming response second:

```sh
uv run --extra dev python -m parliament_streams.scrapers quebec-webdiffusion live.json upcoming.json
```

The command prints parsed channel metadata as JSON. It does not fetch network
resources itself.

## Verify

Install `uv`, then run the local verification pass:

```sh
make verify
```

The Makefile uses `uv run --extra dev`, so contributors get a Python 3.11+
environment and the pinned Ruff version from `uv.lock` instead of relying on a
system Python.

This runs JSON validation, Ruff linting, Python import/compile checks, and the
unit tests.

Format Python sources with:

```sh
make format
```

Run a live health check against playback URLs and official link-out pages:

```sh
make healthcheck
```

To save a dated report:

```sh
uv run --extra dev python -m parliament_streams.healthcheck --output reports/health/YYYY-MM-DD-catalogue-health.json
```

The health checker records HTTP status, content type, final URL, and whether
direct HLS/DASH entries look like manifests. It is a technical availability
check only; it does not determine redistribution permission.

## Rights And Reuse

The repository code and original documentation are covered by the repository
license. External stream URLs, official pages, schedule data, video content,
marks, watermarks, screenshots, and YouTube metadata belong to their respective
sources and may be governed by separate terms.

Before using a source outside research or advocacy:

1. Review its official page.
2. Review its terms and attribution requirements.
3. Prefer documented official embeds or APIs.
4. Preserve visible attribution.
5. Avoid implying endorsement.
6. Seek written permission where the status is pending or ambiguous.

See `docs/sources-and-provenance.md` and
`docs/source-rights-and-permissions.md` for the current evidence.

## Why This Exists

Public parliamentary video is often available, but not always in predictable,
machine-readable, app-friendly forms. This project documents what was found and
where openness could improve: stable HLS or documented embeds, JSON schedules,
event IDs, now/next signals, timezone data, chamber labels, captions/audio
metadata, plain-language terms, browser compatibility, and clear off-air
signals.
