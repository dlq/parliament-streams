# Changelog

All notable changes to the documentation and data project are recorded here.
This changelog begins with the 2026-06-19 conversion from the retired SwiftUI
application. Earlier application work remains available in Git history.

## Unreleased - 2026-08-15

### Added

- A build-free GitHub Pages catalogue driven directly by `data/channels.json`.
- In-page native HLS playback for technically validated sources not expressly
  prohibited from third-party reuse.
- Local rectangular SVG jurisdiction flags, including Quebec, Ontario, Nunavut,
  EU, UN, and OSCE markers, with asset attribution and licence records.
- The recovered historical parliamentary chamber/play icon as the local site
  header mark and favicon.
- A client-side locale selector and URL/local-storage locale support for the
  public catalogue interface.
- Dated catalogue and review health reports.

### Changed

- Simplified the schema v2 catalogue by removing inactive `short_name`,
  `display_mode`, and `metadata_level` fields.
- Made deep browser validation require explicit input and output report paths,
  preventing a fresh run from overwriting historical evidence.
- Refined the catalogue table, sorting, compact stream detail panel, and link
  labels for supporting source evidence.
- Recorded the opt-out playback posture and source-specific reuse evidence more
  clearly in the catalogue and documentation.
- Renamed the working roadmap to `PLANS.md` and the research log to `NOTES.md`.
- Documented browser-side EPG enrichment as an optional future path: only the
  EU Audiovisual Service and European Parliament Multimedia Centre currently
  permit browser CORS reads among recorded EPG sources.

### Fixed

- Removed an unused catalogue-filter helper and obsolete multilingual
  translation keys.
- Standardized row alignment, outbound-link treatment, terminology tooltips,
  and source-evidence labels in the public catalogue.
- Removed internal scraper implementation status from the public EPG display.

## 2026-08-14

### Added

- Refreshed Tier 1 and Tier 2 national validation, supranational research, and
  non-US sub-national research reports.
- Added Nunavut as a validated direct-HLS catalogue source.

### Changed

- Updated catalogue entries, provenance, permission notes, documentation, and
  browser validation tooling following the refresh.

## 2026-07-29

### Added

- Repeatable Python health-check tooling and dated live validation reports.
- Democracy Tier 1, Tier 2, and Tier 3 discovery reports.
- Browser/player validation for sources that expose manifests only after
  JavaScript loads.

### Changed

- Expanded the catalogue schema, data-contract tests, contributor guidance,
  source-rights evidence, and research documentation.

## 2026-06-19

### Added

- Canonical JSON catalogue, schema, Python schedule parsers, data-contract
  tests, and source-rights documentation.
- CI validation with Ruff, JSON checks, compilation, and unit tests.

### Changed

- Converted the repository from an Apple-platform application to a public
  parliamentary-stream documentation and data project.

### Removed

- Active SwiftUI, Xcode, TestFlight, and Apple-platform release material from
  the working tree. The previous application remains in Git history.
