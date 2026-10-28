# Parliament Streams

[![CI](https://github.com/dlq/parliament-streams/actions/workflows/ci.yml/badge.svg)](https://github.com/dlq/parliament-streams/actions/workflows/ci.yml)
[![Catalogue Audit](https://github.com/dlq/parliament-streams/actions/workflows/catalogue-audit.yml/badge.svg)](https://github.com/dlq/parliament-streams/actions/workflows/catalogue-audit.yml)
[![GitHub Pages](https://github.com/dlq/parliament-streams/actions/workflows/pages.yml/badge.svg)](https://github.com/dlq/parliament-streams/actions/workflows/pages.yml)

Find official parliamentary video and audio from around the world. Parliament
Streams publishes a legislature inventory, a catalogue of official viewing
sources, collected schedules, IPTV playlists and a partial XMLTV guide. The
Python tools and static website make the source evidence and its limits inspectable.

**[Catalogue](https://dlq.ca/parliament-streams/)** ·
**[Legislatures](https://dlq.ca/parliament-streams/institutions.html)** ·
**[Coverage map](https://dlq.ca/parliament-streams/map.html)** ·
**[Schedule](https://dlq.ca/parliament-streams/schedule.html)** ·
**[Data and methods](https://dlq.ca/parliament-streams/data.html)**

## Use the data

Start with [Data and methods](https://dlq.ca/parliament-streams/data.html) for the
file directory, inclusion rules, collection methods, detailed documentation and
credits. No installation is needed to browse the site or use the public files.

- [Viewing-source catalogue (JSON)](https://dlq.ca/parliament-streams/data/channels.json)
- [Legislature inventory (JSON)](data/discovery/institutions.json)
- [Schedules and events (JSON)](https://dlq.ca/parliament-streams/data/schedules.json)
- [Continuous-channel playlist (M3U)](https://dlq.ca/parliament-streams/data/stable-hls.m3u)
- [All supported channels (M3U)](https://dlq.ca/parliament-streams/data/validated-hls.m3u), including sitting-only streams
- [XMLTV programme guide](https://dlq.ca/parliament-streams/data/epg.xml) and
  [guide quality report](https://dlq.ca/parliament-streams/data/epg-quality.json)

Playlists link to the original streams. Guide coverage is partial; a viewing
source does not automatically qualify for IPTV or XMLTV. Scheduled collection
and export run every six hours. The catalogue and schedule pages include copy
buttons and VLC instructions; prefer the `.m3u` channel lists for VLC.

## Contribute

An official link, local knowledge, a translation correction or a usability
observation is a useful contribution. You do not need to write code or install
the project to help. Start with [CONTRIBUTING.md](CONTRIBUTING.md),
[the issue chooser](https://github.com/dlq/parliament-streams/issues/new/choose)
or [open issues](https://github.com/dlq/parliament-streams/issues).

| You can help with… | Start here |
| --- | --- |
| An official source or a better viewing link | [Suggest or correct a source](https://github.com/dlq/parliament-streams/issues/new?template=source_correction.yml) |
| A missing legislature or evidence about its powers | [Share a research finding](https://github.com/dlq/parliament-streams/issues/new?template=contribution.yml) |
| A broken stream, player or page | [Report what happened](https://github.com/dlq/parliament-streams/issues/new?template=endpoint_validation.yml) |
| Translations and more natural wording | [Suggest a translation](https://github.com/dlq/parliament-streams/issues/new?template=translation_review.yml) · [Translation guide](docs/translating.md) |
| Schedules, times, rooms or language labels | [Report a schedule issue](https://github.com/dlq/parliament-streams/issues/new?template=schedule_metadata.yml) |
| Accessibility, research, documentation, code or another idea | [Share an idea or finding](https://github.com/dlq/parliament-streams/issues/new?template=contribution.yml) |

One source, one sentence or one translated phrase is a good first contribution.
Small documentation edits can use GitHub’s web editor. For code changes, fork
the repository, make a focused change and describe how you checked it. Report
sensitive issues through [SECURITY.md](SECURITY.md), rather than a public issue.

## Run locally

For a website preview, install Git, Node.js 24+, Python 3 and Make:

```sh
git clone https://github.com/dlq/parliament-streams.git
cd parliament-streams
npm ci
make site
```

Open [localhost:8000/site/](http://localhost:8000/site/). `npm ci` assembles the
locked HLS.js and D3 assets; `make site` serves the checkout with Python’s HTTP
server. The preview includes the maintained catalogue and inventory snapshots.
Live schedules are generated separately and are not included in a fresh checkout.

For Python tooling and the complete checks, use Python 3.11+ and `uv`, alongside
Node.js 24+ and Make. From the repository root:

```sh
uv sync --locked --extra dev
npm ci
npx playwright install chromium
make verify
```

On Linux, Playwright may also need system browser dependencies; see
[development and validation](docs/development.md). `make verify` checks data,
generated files, formatting, types, tests, coverage, HTML, browser interactions
and accessibility. `make test` runs the Python, JavaScript and browser tests.
For a local schedule snapshot, run `make schedules` after setup; this contacts
official third-party services. Details are in [schedules and IPTV](docs/schedules-and-iptv.md).

Use a checkout for the Python CLI: it resolves `schema/` and `data/` resources
from the repository. A standalone Python package installation is not a complete
catalogue and research workspace.

## Understand and maintain the project

The two maintained lists are [the legislature inventory](data/discovery/institutions.json)
and [the viewing-source catalogue](data/channels.json). An inventory record does
not certify a broadcast. A catalogue entry can be an official page, archive,
embedded player or direct stream; embedding and reuse have separate conditions.

Scope is based on substantive legislative authority, including eligible public
committee proceedings. Research priorities use the EIU Democracy Index 2024
baseline; they are not an absolute catalogue restriction. See
[inclusion rules](docs/catalogue-scope.md) and [research status](docs/research-status.md).

New source records normally start in `candidates/`, then undergo review and
validation before promotion. Edit maintained inputs and regenerate their views;
do not edit `site/catalogue-data.js` or `site/institutions-data.js` independently.

| Topic | Guide |
| --- | --- |
| Data products, methods and credits | [Public guide](https://dlq.ca/parliament-streams/data.html) |
| Source corrections and publication | [Catalogue maintenance](docs/catalogue-maintenance.md) |
| Data roles, generated files and code structure | [Data guide](data/README.md) · [Architecture](docs/architecture.md) |
| Automation and review queues | [GitHub Actions](docs/github-actions.md) |
| Dated findings and their limits | [Reports guide](reports/README.md) |
| All maintained guides | [Documentation index](docs/README.md) |
| Future work and changes | [Plans](PLANS.md) · [Changelog](CHANGELOG.md) |

## Licence and source rights

Project code uses the [BSD 3-Clause licence](LICENSE). Broadcasters’ video,
audio, schedules, images and map data retain their own conditions; a public URL
or play button is not a reuse licence. See [source rights](docs/source-rights-and-permissions.md)
and [asset credits](https://dlq.ca/parliament-streams/data.html#data-colophon-title).
The site has no accounts, analytics, stream proxy or rebroadcast backend;
[privacy notes](PRIVACY.md) explain third-party playback requests.
