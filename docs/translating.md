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
[Data and methods page](https://dlq.ca/parliament-streams/data.html).
A shared URL can also set the language, for example `?lang=fr`.
Screenshots are useful when text wraps badly or a control is unclear.

## Useful Reviews

- Natural wording, spelling, punctuation and consistent terminology.
- Names for legislatures, jurisdictions, committees and parliamentary business.
- Search/filter labels, source details and accessibility instructions.
- Legislature inventory statuses, scope explanations and contribution prompts.
- The Data and methods explanation, public-file labels and shared utility links.
- Schedule coverage, collection-error and retained-listing explanations.
- The distinction between viewing checks, reuse permissions and a populated guide.
- IPTV setup, copy-button feedback and the VLC desktop instructions.
- Dates, numbers, plural forms and text that overflows on mobile.
- Keyboard and screen-reader pronunciation, including language annotations.

All 26 supported locales welcome review, especially the new Korean, Japanese
and Indonesian packs. Czech, Finnish, Swedish and
Traditional Chinese are recent additions needing fluent-speaker feedback.
The Inuktitut syllabics interface is an explicitly provisional machine-generated
draft and especially needs review by an Inuktitut speaker. Complete message-key
coverage does not establish translation quality.
The new project, scope, permissions, schedule-coverage and global-playlist copy
also needs fluent review across all 26 locales. Review should preserve the
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
| Swedish | `sv` | Korean | `ko` |
| Japanese | `ja` | Indonesian | `id` |

## Editing The Translation Files

Each supported language has one JSON file in [site/locales/](../site/locales/),
for example [fr.json](../site/locales/fr.json). Its named sections cover
`common` catalogue text, `map`, `schedule`, `institutions`, `viewer`, `project`
(Data and methods), and `iptv` (including VLC instructions). `jurisdictions`,
`source` and `sourceCount` hold translated display names and plural forms.
Edit these files directly; there is no JavaScript translation table to regenerate.
A new locale also needs its code and autonym registered in the small `locales`
list in `site/i18n.js`; tests keep that list and the JSON files in agreement.

The small `site/i18n.js` runtime loads English plus the selected language and
caches additional languages when selected. `site/page-locale.js` owns the shared
header and language picker; page controllers translate only their own content.
Some jurisdiction names come from the browser's `Intl.DisplayNames` data.
The [locale schema](../schema/ui-locale.schema.json), key-coverage checks and
placeholder checks validate all 26 files even though normal startup loads only
one or two. See [site and language behaviour](public-site.md) for fallback rules.

Preserve message keys, placeholder names such as `{count}` and `{date}`, and
locale-specific plural forms. Translate the interface consistently across
catalogue, Legislatures, map, schedule, Data and methods, and IPTV/VLC surfaces. The working
legislature inventory has interface messages in all 26 locales, while its
English research notes and recorded institution names retain their language.
Official programme titles, source names and rights notes retain their recorded
language; changes to their meaning need separate source evidence.

For a pull request, name the locale and affected pages, and explain any
terminology choices. Run `npm test` and `npm run check:site` after setting up the
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
