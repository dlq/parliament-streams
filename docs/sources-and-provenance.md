# Sources and Provenance

This project is a public-interest documentation and data repository for
exploring parliamentary live video access. It is not an official source for any
legislature, broadcaster, streaming vendor, or video platform.

## Code License Scope

The repository licence covers the project code and documentation written for
this repository. Local third-party visual assets have their own recorded terms:
see `site/assets/flags/ATTRIBUTION.md` and its accompanying licence file.

It does not grant rights to:

- parliamentary broadcast video;
- official logos, coats of arms, seals, watermarks, or marks;
- official website screenshots;
- third-party player assets, except local assets whose separate terms are
  recorded in their attribution files;
- stream URLs or schedule data owned or operated by external bodies;
- YouTube pages, thumbnails, metadata, or embedded player behavior.

## Catalogue Entries

The current catalogue is `data/channels.json`. It contains a curated set of
public official pages, official-vendor HLS candidates, direct HLS/DASH research
entries, schedule/EPG scrape surfaces, and official YouTube/link-out sources.

Each source should be treated as provisional unless its own official page and terms clearly support the intended use. Some direct URLs are discovered through official pages, official APIs, or official player infrastructure, but that does not automatically mean they are appropriate for all redistribution or embedding contexts.

## External Institutional Identity

Each catalogue entry records a Wikidata QID for the named legislature or
institution. National entries covered by IPU Parline also record its country,
parliament, and, where the source maps to one chamber, chamber code. The
associated `identity_sources` records preserve the source URL, check date,
confidence, and scope note.

These links support stable identity, deduplication, and further research. They
do not make Wikidata or IPU Parline authoritative sources for video endpoints,
schedule data, technical health, or reuse rights. IPU identifiers are left null
for devolved, sub-national, supranational, and other bodies outside its national
parliament coverage. The catalogue does not mirror broad external facts such as
seat counts, election results, party data, or biographies.

## Validation Reports

`reports/health/` contains dated technical validation artifacts. They are
snapshots from a specific date, network environment, and validator method; they
are not permanent availability guarantees and not permission records.

The current report families are:

- catalogue health checks, which validate entries already in
  `data/channels.json`;
- democracy-tier HLS/DASH refresh reports, which validate known candidates and
  static official-page manifest references;
- supranational and non-US sub-national discovery reports, which document
  bounded exploratory passes and should not be read as comprehensive coverage;
- sub-national promotion reports, which revalidate the official pages and
  direct candidates selected for addition to the catalogue;
- deep browser validation reports, which load official pages in Chromium and
  capture manifests revealed by player scripts or network requests.

Deep browser findings need extra caution. A manifest can be technically public
but still be event-specific, session-conditioned, geofenced, DRM-protected, or
unsuitable for native playback or redistribution. Preserve the discovery page,
validator method, and rights status when promoting a finding into the
catalogue.

## Legal and Terms Posture

The catalogue uses labels such as personal-use pending review, noncommercial
pending review, explicit reuse with conditions, embed-only, and no third-party
reuse. These are research notes, not legal advice.

Maintain the source-by-source evidence in
[`source-rights-and-permissions.md`](source-rights-and-permissions.md). Public
availability alone is not a licence or other grant of rights. The public site
nevertheless offers technically validated direct endpoints under its opt-out
playback policy unless recorded terms expressly prohibit third-party reuse.
Source owners can request prompt removal through the repository owner on
GitHub.

Before using this catalogue outside research or advocacy:

- review the official source page;
- review terms of use and attribution requirements;
- prefer documented official embeds or APIs where available;
- preserve source links and visible attribution;
- avoid implying endorsement by any legislature or broadcaster.

## Research Log

`NOTES.md` is a working log. It contains validated findings, failed checks,
speculative candidates, external references, browser-discovered manifests, and
older observations that can become stale. It should not be treated as a
polished public registry.

The file is intended to be public, but it should still be treated as research evidence rather than permission guidance. Revalidate URLs, playback behavior, schedules, and terms before relying on an entry.

The long-term advocacy direction is an open parliamentary streams catalogue
with explicit schema, validation history, provenance, and terms fields.
