# Help With Translation

[Contribution paths](../CONTRIBUTING.md) · [Documentation index](README.md)

Help make the catalogue sound natural and understandable in your language.
You can review one phrase, one page or an entire interface. Suggestions in a
GitHub issue are welcome; JavaScript experience is optional.

## Suggest Wording

Use the [translation review form](https://github.com/dlq/parliament-streams/issues/new?template=translation_review.yml)
and include:

1. The language and page, or the feature you were using.
2. The current wording and your suggested wording.
3. Any context that helps: a regional variant, an ambiguous term, a screenshot
   or wording used by the official legislature.

Use the language selector on the [catalogue](https://dlq.ca/parliament-streams/),
[Legislatures page](https://dlq.ca/parliament-streams/institutions.html),
[map](https://dlq.ca/parliament-streams/map.html),
[schedule](https://dlq.ca/parliament-streams/schedule.html) or
[Data and method page](https://dlq.ca/parliament-streams/data.html).
A shared URL can also set the language, for example `?lang=fr`.
Screenshots are useful when text wraps badly or a control is unclear.

## Useful Reviews

- Natural wording, spelling, punctuation and consistent terminology.
- Names for legislatures, jurisdictions, committees and parliamentary business.
- Search/filter labels, source details and accessibility instructions.
- Legislature inventory statuses, scope explanations and contribution prompts.
- The Data and method explanation, public-file labels and shared utility links.
- Schedule coverage, collection-error and retained-listing explanations.
- The distinction between viewing checks, reuse permissions and a populated guide.
- IPTV setup, copy-button feedback and the VLC desktop instructions.
- Dates, numbers, plural forms and text that overflows on mobile.
- Keyboard and screen-reader pronunciation, including language annotations.

All 23 supported locales welcome review. Czech, Finnish, Swedish and
Traditional Chinese are recent additions needing fluent-speaker feedback.
The Inuktitut syllabics interface is an explicitly provisional machine-generated
draft and especially needs review by an Inuktitut speaker. Complete message-key
coverage does not establish translation quality.
The new project, scope, permissions, schedule-coverage and global-playlist copy
also needs fluent review across all 23 locales. Review should preserve the
difference between a research body, a viewing source and a verified linear
programme guide; none of those labels grants reuse permission.

| Language | URL code | Language | URL code |
| --- | --- | --- | --- |
| English | `en` | French | `fr` |
| Spanish | `es` | Brazilian Portuguese | `pt-BR` |
| Danish | `da` | German | `de` |
| Estonian | `et` | Greek | `el` |
| Hindi | `hi` | Irish | `ga` |
| Italian | `it` | Luxembourgish | `lb` |
| Dutch | `nl` | Norwegian Bokmål | `nb` |
| Slovak | `sk` | Thai | `th` |
| Simplified Chinese | `zh-Hans` | Traditional Chinese | `zh-Hant` |
| Inuktitut syllabics | `iu-Cans` | Te reo Māori | `mi` |
| Czech | `cs` | Finnish | `fi` |
| Swedish | `sv` | | |

## Editing The Translation Files

The translation tables are in `site/i18n.js`, `site/institutions-i18n.js`,
`site/map-i18n.js`, `site/schedule-i18n.js`, `site/iptv.js` and
`site/project-i18n.js`. The project table supplies all 23 locales for the
Data and method page and shared Data/Contribute/Code links; it is rendered by
`site/data-page.js` and `site/project-info.js`. The Czech, Finnish,
Swedish and Traditional Chinese packs live in `site/extra-locales.js`. Some jurisdiction
names are localized through the browser's `Intl.DisplayNames` data. See
[site and language behaviour](public-site.md) for fallback and content rules.

Preserve message keys, placeholder names such as `{count}` and `{date}`, and
locale-specific plural forms. Translate the interface consistently across
catalogue, Legislatures, map, schedule, Data and method, and IPTV/VLC surfaces. The working
legislature inventory has interface messages in all 23 locales, while its
English research notes and recorded institution names retain their language.
Official programme titles, source names and rights notes retain their recorded
language; changes to their meaning need separate source evidence.

For a pull request, name the locale and affected pages, and explain any
terminology choices. Run `npm run check:site` after setting up the
[development environment](development.md), then inspect the changed screens
in that language at desktop and mobile widths. Automated checks cover message
keys and UI behaviour; fluent review establishes whether the wording is good.
Check long navigation labels at 320px as well as the two by two mobile
navigation layout. Real screen-reader pronunciation, zoom, forced colors and
physical-device checks are still needed; passing automated checks does not
establish accessibility conformance.

Suggestions for new languages are welcome too. An issue can establish likely
users, source-language coverage, terminology, reviewers and any script/layout
requirements before adding a complete interface pack.
