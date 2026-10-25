# Naming And Compatibility

Use names that describe the evidence or operation actually present. An official
page, a decoded recording, current live coverage, a usable programme guide and
permission to reuse video are separate findings.

## Domain Vocabulary

| Term | Meaning in this project |
| --- | --- |
| Institution | An identity in the legislature inventory, including retained exclusions, holds and predecessors. |
| Eligible legislature | An institution with a positive reviewed legislative-authority and scope decision. Eligibility does not certify a viewing service. |
| Catalogue source | A published source record: an official viewing page, archive, channel or documented direct stream. |
| Candidate | A tracked source proposal in `candidates/`, with its own review outcome. Promoted and rejected records retain their history. |
| Discovery target | A URL selected for an automated observation. It is not a formal candidate or a publication decision. |
| Page lead / manifest observation | An observed viewing/programme link or manifest result. It may be new, already catalogued or previously reviewed; an HTTP or format check does not certify playback or rights. |
| Schedule source | An endpoint or page that may provide programme information. It does not automatically produce XMLTV data. |
| Programme event | A parsed schedule item describing a programme, meeting or live event. Timing provenance and feed mapping may remain incomplete; XMLTV export has additional quality and mapping requirements. |
| Evidence source | A cited page, document or observation supporting a particular claim. |

Prefer qualified names such as `scraper_id`, `institution_id`, `catalogue_ids`
and `events_by_channel` where several kinds of source or identifier share a
scope. A map named `*_by_scraper` must actually use scraper identifiers as keys.
Short names such as `row`, `value` and `index` are useful in small, obvious scopes.

## Files And Identifiers

- Python modules, functions, parameters and local variables use `snake_case`.
  Classes and type aliases use `PascalCase`; constants use `UPPER_SNAKE_CASE`.
  Parser callbacks and unittest methods retain their framework-required names.
- Browser scripts, styles, documents and assets use descriptive lowercase names
  with hyphens where needed. Python and Node maintenance tools use underscores
  and a leading operation, such as `build_`, `check_` or `validate_`.
- JavaScript functions and variables use `camelCase`, with constants in
  `UPPER_SNAKE_CASE`. CSS classes use descriptive kebab-case. Existing DOM IDs,
  translation keys and browser globals are shared interfaces: trace every caller
  before changing them.
- Boolean names state the condition or inclusion precisely. For example,
  `include_non_always_on` includes sitting-dependent and event-based streams;
  `include_event_based` would describe only part of that selection.
- Use plural names for collections and explicit grouping names for mappings.
  Use `_on` for civil dates and `_at` for timestamps in new maintained fields.
  Preserve protocol or historical field names when consuming existing data.
- New research reports use a date-first descriptive name. Existing evidence
  paths and IDs retain their provenance and references. See the
  [report role guide](../reports/README.md).

Country flag assets use lowercase country codes; regional assets use readable
jurisdiction slugs, qualified where necessary to distinguish identities. Keep
upstream names, licence filenames, standardized repository entry points such as
`README.md`, and tool-managed directories in their established forms.

## Operation Names

| Verb | Expected operation |
| --- | --- |
| `load` / `read` | Read a specified input. |
| `fetch` / `collect` | Perform network I/O or assemble collected source observations. |
| `parse` / `extract` | Interpret supplied content. Parsers do not silently fetch pages. |
| `normalize` / `encode` / `format` | Transform a supplied value; do not imply a network or permission check. |
| `build` / `render` | Construct a payload, plan or presentation from inputs. |
| `validate` | Enforce a declared shape, format or business-rule contract. State the contract; do not imply every aspect of a service is confirmed. |
| `check` | Observe a specific property, such as HTTP access, manifest format or generated-data freshness. |
| `audit` / `review` | Combine findings or prepare evidence and proposals. Automated review does not apply a human decision. |
| `verify` | Establish the named set of conditions, such as the exact revision and successful checks required for Pages publication. |

An established command can combine several operations. Its help and documentation
must explain the scope; renaming a helper does not justify changing its outputs.

## Stable Names With Broader Meanings

The public catalogue uses `channels.json`, `channels`, `ChannelRecord` and nested
candidate `channel` objects. These are established schema names for catalogue
sources, including link-outs and archives; they do not mean every row is a linear
television channel. `epg_sources` similarly includes planned programme pages.
Retain these names until an explicit, versioned data migration is warranted.

Keep source/institution IDs, scraper IDs, enum strings, JSON/XMLTV/M3U fields,
public page and dataset URLs, and workflow filenames/names stable when they are
used as crosswalks, consumer interfaces or deployment-gate inputs. Historical
country-name variants in an identifier are not instructions to rename an identity.

Use `make catalogue-site-data` for catalogue snapshot generation;
`make site-data` remains a compatible alias. `npm run check:browser` runs the local
browser suite; the established accessibility commands remain compatible aliases.
The former `tools/check_accessibility.mjs` path delegates to `tools/check_site.mjs`.
`tools/deep_validate_browser.mjs` retains its established research entry point and
report fields; its successful manifest observations establish HTTP/format checks.

[Development commands](development.md) · [Architecture](architecture.md)
