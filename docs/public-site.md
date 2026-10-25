# Public Site And Languages

[Documentation index](README.md) · [Development setup](development.md)

The repository includes a GitHub Pages interface in `site/`. It provides
search and filters over the canonical catalogue, source/EPG/provenance details,
external institutional identity links, playback mode, and an official outbound
link for every entry. Country-name searches include documented regional sources as well as national
ones. The coverage map includes all published subnational jurisdictions, with
location dots for tiny outlines. Shared search associations preserve territorial
relationships without presenting Crown Dependencies as UK subdivisions.

The [Legislatures page](https://dlq.ca/parliament-streams/institutions.html)
opens the working institution inventory, including authority decisions and
remaining research gaps. It is broader than the video catalogue: an eligible
legislature does not automatically have a verified stream, programme guide or
reuse permission. Its interface supports all 23 locales; institution names and
English research notes retain their recorded language. Use the page's
contribution links to suggest a missing body or provide official evidence for
a correction, including unresolved legislative-authority questions.

Its dedicated programme guide presents the latest
six-hourly schedule snapshot as compact Now/Next channel listings, with
jurisdiction and listing-status filters, source-published times, explicit
freshness warnings, and playback handoff for eligible channels.

The number of catalogue entries with an `epg_sources` link is deliberately
larger than the number shown in the programme guide. A linked sitting calendar,
agenda, or programme page is useful provenance, but the guide includes a
channel only when an implemented parser returns at least one real dated event
inside the current collection window. It does not publish generic placeholders
as programmes. A separate collapsed calendar/agenda list exposes useful
official event and calendar pages whose automated guide collection is still
pending; machine-only API/download inputs stay in the catalogue metadata.

The page enables in-page playback where `data/channels.json` records
`playback_policy` as `native_playback` for a direct feed or `provider_embed`
for an official provider iframe. For direct feeds, that policy is only used
when the entry has a direct playback URL, its technical status is `validated`,
and its recorded terms do not expressly prohibit third-party reuse.

This is an opt-out research posture: the absence of recorded affirmative
permission is not represented as a licence or other grant of rights. Direct
endpoints with `no_third_party_reuse` remain `link_out`, and direct endpoints
kept for unresolved DASH or technical research remain `research_only`. HLS playback uses the
browser's native support where available and lazily loads the local `hls.js`
asset for compatible non-Safari browsers. `npm ci` prepares HLS.js and D3 from
the locked npm dependencies, including D3's installed submodules. Dependabot
updates therefore reach the published assets without manual file copies or CDN
pins. This is client-side code only, not a backend or proxy. See
[the vendor asset workflow](../site/assets/vendor/README.md) for regeneration and
license details.

For the current proof of concept, technically public HLS is treated as
sufficient for native client-side playback unless recorded rights evidence
requires link-out. The catalogue should expose that uncertainty clearly rather
than silently demoting all pending direct streams.

YouTube catalogue entries use YouTube's official privacy-enhanced iframe and a
permanent official uploads playlist. The playlist starts with the latest
published item and may show an active broadcast when YouTube places it first;
it is not represented as a guaranteed live-only feed. The official outbound
link points to the channel's stable live page, which may redirect to an active
or upcoming event. A conservative schedule resolver records a current YouTube
  watch video ID only when the official live page exposes explicit watch
  metadata; otherwise the site keeps the playlist embed. The catalogue does not
extract YouTube manifests.

Every native player includes the recorded source attribution and direct links
to relevant supporting sources. Its detail view also presents the latest
retained validation evidence and the catalogue's recorded media-accessibility
status. `explicit_reuse_with_conditions` means the project has recorded
affirmative official terms. `personal_use_pending_review` and
`noncommercial_pending_review` mean that the player is offered under this
opt-out policy, not that permission has been granted. `no_third_party_reuse`
means the source terms expressly rule out a third-party player without separate
permission. Source owners can request prompt removal through the repository
owner on GitHub.

Official fallback records from `data/fallbacks.json` appear as related links in
the selected channel's source details. These records cover event platforms,
official player pages, broadcaster pages, and
provider-managed embeds that are useful for users without claiming a stable
direct channel stream. When a fallback is related to a channel with collected
schedule data, the site can show the current and next event titles beside the
fallback link; it still links to the official platform rather than resolving or
extracting an event-specific stream.

The deploy workflow in `.github/workflows/pages.yml` publishes the site files,
the canonical catalogue/fallback/organization JSON and a freshly collected
schedule snapshot. After assembly, `tools/version_site_assets.mjs` fingerprints
HTML references to JavaScript and CSS by file content to avoid stale-script
failures such as the Safari catalogue-loading issue. Map geometry URLs also
carry explicit versions.
It runs after relevant pushes, on demand, and every six hours at 17 minutes
past the hour. Publication requires successful CI and CodeQL for the exact
current `main` SHA, checked before assembly and again immediately before
deployment. Both jobs pin their checkout to that SHA; a failed or missing check,
an unavailable verification API or an advanced `main` blocks publication.
Scheduled builds use the same gate without falling back to an older commit.
Normal pushes remain allowed. See [GitHub Actions and review queues](github-actions.md).
To enable Pages once
on GitHub, set **Settings → Pages → Build and deployment → Source** to
**GitHub Actions**. Thereafter pushes affecting `site/` or `data/channels.json`
trigger a checked publication of the updated page. The scheduled collection is a batch build; the
deployed site remains static and has no request-time backend.

The separate `.github/workflows/catalogue-audit.yml` runs a complete catalogue
audit every day at 06:41 UTC. It validates the schema and identity contract,
checks all primary playback or official URLs, audits every unique schedule
endpoint, exercises implemented schedule parsers, and checks deduplicated
official, rights, Wikidata/IPU, and embed links. Reports are retained as GitHub
Actions artifacts for 30 days. On Sundays the workflow also uses Chromium to
load every recorded official page, discover dynamically exposed HLS/DASH
manifests, and retain that report for 90 days. Independent probes continue after
another probe or issue API fails, while command failures remain visible.
Newly degraded `always_on` streams explicitly fail the audit; event-based source
results remain recorded without triggering that regression rule. Stable-stream
and schedule-source alerts close only on `ok` results, not empty data, warnings
or reset counters.

For a quick local preview, run `npm ci` once to prepare the browser libraries,
then open `site/index.html` directly. The checked-in
`site/catalogue-data.js` snapshot allows the page to work without a local
server. It is generated from the canonical JSON and checked for drift by CI.
The Legislatures page similarly reads `site/institutions-data.js`, generated
from the operational institution register with `make institution-site-data`.
`make institution-site-data-check` checks that snapshot for drift, and
`make institution-inventory-validate` checks the underlying register.
The monthly [legislature inventory review](catalogue-maintenance.md#monthly-legislature-inventory-review)
reports proposed institutional changes and source-access gaps for human review.
It does not automatically add or remove bodies on the public page; reviewed
inventory changes still require regeneration, commit and deployment.
YouTube does not permit iframe playback from a `file://` page because it has no
HTTP origin/referrer; the direct-file preview therefore shows a link to the
public catalogue instead of a broken player.

To preview the hosted data-loading path instead, serve the repository root:

```sh
make site
```

Then visit `http://localhost:8000/site/`. This HTTP preview also enables the
official YouTube embeds. The served page requests the same
canonical `data/channels.json` file used by the deployment workflow and falls
back to the generated snapshot if that request is unavailable.

## Languages

The static interface supports English, French, Spanish, Brazilian Portuguese,
Danish, German, Estonian, Greek, Hindi, Irish, Italian, Luxembourgish, Dutch,
Norwegian Bokmal, Slovak, Thai, Simplified Chinese, Inuktitut syllabics,
te reo Maori, Czech, Finnish, Swedish, and Traditional Chinese (23 locales).
Select a
language in the site header or use `?lang=fr` (substituting a supported locale
code) in a shared URL; the selection is also stored locally in the browser.
Chinese browser locales for Taiwan, Hong Kong, and Macao select Traditional
Chinese unless an explicit Simplified Chinese script is requested. The four
additional packs live in `site/extra-locales.js`; catalogue, map, schedule,
Legislatures and IPTV/VLC messages are checked for complete key coverage. Czech
source counts use the locale's plural categories. Dates, numbers, and sorting
use `Intl`.

IPTV setup, copy feedback, and VLC desktop instructions follow the selected
language on both the catalogue and schedule pages. The external VideoLAN
documentation link is labelled as English. Exact VLC menu wording can vary
with the installed VLC version and interface language.

The locale setting translates interface chrome and project-authored explanatory
copy. Official source names, programme records, attribution text, permission
summaries, and evidence links remain as recorded in the canonical catalogue.
This avoids presenting unreviewed translations as authoritative source or legal
material. The page marks those English-language catalogue fields separately so
assistive technology does not pronounce them as translated interface text.

The Inuktitut syllabics interface is a best-effort machine-generated draft,
using terminology sources from Nunavut and awaiting review by an Inuktitut
speaker. It must not be treated as an authoritative translation.
The Czech, Finnish, Swedish, and Traditional Chinese additions also need native
speaker review. Automated coverage and accessibility checks verify interface
behavior, not linguistic accuracy or the completeness of source-language video.
