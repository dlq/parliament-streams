# Parliament Streams

[![CI](https://github.com/dlq/parliament-streams/actions/workflows/ci.yml/badge.svg)](https://github.com/dlq/parliament-streams/actions/workflows/ci.yml)
[![Catalogue Audit](https://github.com/dlq/parliament-streams/actions/workflows/catalogue-audit.yml/badge.svg)](https://github.com/dlq/parliament-streams/actions/workflows/catalogue-audit.yml)
[![GitHub Pages](https://github.com/dlq/parliament-streams/actions/workflows/pages.yml/badge.svg)](https://github.com/dlq/parliament-streams/actions/workflows/pages.yml)

Find official parliamentary video from around the world. Parliament Streams
is an independent catalogue of official viewing pages, documented streams,
schedules and evidence about source access, accessibility and reuse.

**[Catalogue](https://dlq.ca/parliament-streams/)** ·
**[Legislatures](https://dlq.ca/parliament-streams/institutions.html)** ·
**[Coverage map](https://dlq.ca/parliament-streams/map.html)** ·
**[Programme guide](https://dlq.ca/parliament-streams/schedule.html)**

## Help Improve The Catalogue

Contributions of any size are welcome. Share an official source, check a
translation, report something confusing, or help improve the code. Local
knowledge, language skills and experience using the site are all useful.

| You can help with… | Start here |
| --- | --- |
| An official parliamentary source or a better viewing link | [Suggest or correct a source](https://github.com/dlq/parliament-streams/issues/new?template=source_correction.yml) |
| A missing legislature, authority evidence or inventory correction | [Share a research finding](https://github.com/dlq/parliament-streams/issues/new?template=contribution.yml&title=%5BInventory%5D%3A%20&contribution=Legislature%20or%20territory%3A%20%0AProposed%20addition%20or%20correction%3A%20%0A&page=https%3A%2F%2Fdlq.ca%2Fparliament-streams%2Finstitutions.html) |
| A broken stream, player or page | [Report what happened](https://github.com/dlq/parliament-streams/issues/new?template=endpoint_validation.yml) |
| Translations and more natural wording in any supported language | [Suggest a translation](https://github.com/dlq/parliament-streams/issues/new?template=translation_review.yml) · [Translation guide](docs/translating.md) |
| Incorrect schedules, times, room names or language labels | [Report a schedule issue](https://github.com/dlq/parliament-streams/issues/new?template=schedule_metadata.yml) |
| Accessibility, mobile usability, documentation, research, code or another idea | [Share an idea or finding](https://github.com/dlq/parliament-streams/issues/new?template=contribution.yml) |

For a small first contribution, try one link, one sentence, one translation or
one source you know well. A plain-language issue is enough to get started;
pull requests are welcome too. See [all contribution paths](CONTRIBUTING.md)
or [browse open issues](https://github.com/dlq/parliament-streams/issues).

## What It Covers

National parliaments and state, provincial, territorial, autonomous or devolved
legislatures with substantive **legislative authority**, including their public
committee proceedings. Ordinary local councils and planning/service bodies are
outside default scope. See [catalogue eligibility](docs/catalogue-scope.md) for
borderline and special-status cases; international sources are labelled
separately.

The [Legislatures page](https://dlq.ca/parliament-streams/institutions.html)
shares the working inventory and research status, with 23 interface locales
and English research notes. Inclusion does not certify a stream or reuse rights.

Research priorities use the Economist Intelligence Unit's Democracy Index.
See [how the research tiers work](docs/catalogue-scope.md#research-priorities-and-democracy-tiers)
for the edition, country lists and the distinction between priority and eligibility.

The site plays documented sources when the catalogue's technical and playback
policy permits it, and otherwise links to the official service. It is a static
site with no accounts, analytics, stream proxy or rebroadcast backend.
Public availability is not a reuse licence; each source retains its evidence
and conditions. See the [rights summary](docs/rights-summary.md).

## IPTV And Programme Data

The catalogue and schedule pages offer playlist/guide links, copy buttons and
localized VLC desktop instructions:

- [Stable HLS playlist](https://dlq.ca/parliament-streams/data/stable-hls.m3u)
- [Broader validated HLS playlist](https://dlq.ca/parliament-streams/data/validated-hls.m3u) — some feeds are available only during proceedings
- [XMLTV guide](https://dlq.ca/parliament-streams/data/epg.xml) — partial coverage

These UTF-8 channel lists link to the original streams. Official viewing links
and calendar pages do not automatically qualify for IPTV or XMLTV. Pages
regenerates exports every six hours; details and local commands are in
[schedules, IPTV and XMLTV](docs/schedules-and-iptv.md).

## Run Locally

For an HTTP preview, install Node.js 24+ and run:

```sh
npm ci
make site
```

Open [localhost:8000/site/](http://localhost:8000/site/). Python 3 supplies the
preview server. `npm ci` prepares the locked HLS.js and D3 browser assets.
The interface supports 23 locales; source records retain their recorded
languages. See [site and language behaviour](docs/public-site.md).

For the complete development checks, install Python 3.11+, `uv` and Node.js 24+:

```sh
uv sync --locked --extra dev
npm ci
npx playwright install chromium
make verify
```

See [development and validation](docs/development.md) for individual checks and
live audits. [CONTRIBUTING.md](CONTRIBUTING.md) explains evidence requirements.

## Maintain And Explore

`data/channels.json` is the canonical catalogue. New sources normally start as
reviewable records in `candidates/`; the catalogue manager validates changes
and regenerates `site/catalogue-data.js`. Do not edit that generated snapshot
independently. Start with [catalogue maintenance](docs/catalogue-maintenance.md).

| Topic | Guide |
| --- | --- |
| Documentation index | [All guides](docs/README.md) |
| Data model, files and runtime | [Architecture](docs/architecture.md) |
| Scope and eligibility | [What counts as a parliament](docs/catalogue-scope.md) |
| Current coverage and research leads | [Research status and evidence](docs/research-status.md) |
| Rights and attribution evidence | [Source rights](docs/source-rights-and-permissions.md) |
| Roadmap | [Plans](PLANS.md) |
| Change history | [Changelog](CHANGELOG.md) |
| Research history | [Working notes](NOTES.md) |

The project also documents how public parliamentary video could become easier
to find and use: stable protocols, clear terms, machine-readable schedules and
accessible media. Read the [open-stream principles](docs/open-stream-principles.md).
