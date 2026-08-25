# Permission Requests

This file tracks draft written-clarification requests for catalogue entries
whose public source evidence is useful but not enough to resolve third-party
playback, embedding, or redistribution questions.

Do not store raw private replies here. Record only the public contact route,
date sent, summary of the response, and any conditions that can be cited in the
public catalogue.

## Current Status

Last prepared: 2026-08-24.

Communication status: deferred. Do not send piecemeal permission requests yet.
Reserve outreach for a more substantive communications push after the catalogue,
rights posture, public-site direction, and source-owner asks are complete enough to
present coherently.

The eventual communications push should do two jobs:

- resolve concrete uncertainties about permission, preferred technical routes,
  attribution, schedules, embeds, event identifiers, and native playback; and
- advocate for more genuinely open parliamentary video services by explaining
  what is public but not open, technically reachable but not documented,
  embeddable but not reusable, or reusable but not standardized.

Current rights queue:

- 38 of 100 catalogue entries use a permission status ending in
  `pending_review`; ten are newly published U.S. official-page records that
  have not yet been triaged into the dated 2026-08-19 outreach buckets.
- 16 entries in the previous queue likely need written clarification.
- 12 entries in the previous queue should remain pending after a dated public-terms search unless
  source owners publish clearer terms or the post-proof-of-concept playback
  policy changes.

The 2026-08-19 official-vendor HLS pass reviewed the 18 pending native-playback
`official_vendor_hls` entries as source families. It found no public terms that
cleanly close third-party native playback for the unresolved families, so no
catalogue permission statuses changed. The pass kept Ontario, Nunavut, Sansad
TV, Knesset Channel, ARTV, and Hellenic Parliament TV in the written-
clarification bucket, and kept Chile, Luxembourg, Estonia, Slovakia, and
Jalisco pending after dated public-terms searches.

The 2026-08-19 first-party HLS pass reviewed the 5 pending `first_party_hls`
entries as 3 source families. No catalogue permission statuses changed.
Netherlands Tweede Kamer remains a written-clarification candidate because its
public guidance covers media/journalistic use through Debat Direct rather than
general public raw-HLS playback. Thailand TPchannel and El Salvador Legislative
Assembly remain pending after dated searches because no source-specific
third-party playback or embedding terms were found.

The 2026-08-19 official-page pass reviewed the 6 pending `official_page`
entries. Brazil TV Camara and Manitoba House Broadcasts moved to
`explicit_reuse_with_conditions` for link-out use. Council of Europe/PACE,
Saskatchewan, Northwest Territories, and Navarre remain pending because public
evidence does not clearly close video-specific third-party playback or
redistribution.

The 2026-08-19 direct-DASH research pass reviewed `mongolia-parliament-tv`.
No status changed. The official Parliament live/session page is the safer
user-facing route; the SkyGo DASH manifest remains research-only until source
ownership, reuse permission, and platform playback strategy are documented.

Execution queue:

- [reports/review-queues-2026-08-19-rights-next.json](../reports/review-queues-2026-08-19-rights-next.json)
- [reports/review-queues-2026-08-19-official-vendor-hls.json](../reports/review-queues-2026-08-19-official-vendor-hls.json)
- [reports/review-queues-2026-08-19-first-party-hls.json](../reports/review-queues-2026-08-19-first-party-hls.json)
- [reports/review-queues-2026-08-19-official-page.json](../reports/review-queues-2026-08-19-official-page.json)
- [reports/review-queues-2026-08-19-direct-dash-research.json](../reports/review-queues-2026-08-19-direct-dash-research.json)

## Request Principles

Ask for concrete, narrow confirmation:

- May this project list the official live page and schedule metadata?
- Is there a recommended official embed route?
- May a public-interest, non-commercial catalogue play a technically public HLS
  or DASH URL client-side, without proxying, recording, editing, caching, or
  monetizing the video?
- What source credit, link, logo, wording, technical route, or restriction is
  required?
- Should the project use an official page/link-out instead of native playback?

Do not ask for blanket ownership, endorsement, exclusivity, scraping rights, or
permission to rebroadcast at scale.

## Base Request

```text
Subject: Clarification request: official parliamentary video access

Hello,

I maintain Parliament Streams, an unofficial public-interest research catalogue
of public parliamentary video sources, official pages, and schedule metadata:

https://github.com/dlq/parliament-streams

The project does not download, save, edit, record, proxy, cache, or monetize
video. It records source evidence and links back to the official page. For some
technically public HLS streams, the prototype can play the stream directly in a
browser with visible attribution and source links.

Could you confirm the recommended route for your public proceedings video?

1. Is it permitted to list the official live page and schedule/event pages?
2. Is there an official embed or player route you prefer third parties to use?
3. For a non-commercial public-interest catalogue, is client-side playback of
   the public HLS stream permitted if the source is attributed and linked?
4. Are there required credits, wording, restrictions, or uses that should be
   avoided?

If native playback is not permitted, I will keep the catalogue as link-out only
for your source.

Thank you.
```

## Family Requests

### Canadian iSi LIVE Legislatures

Catalogue IDs:

- `ontario-house-en`
- `ontario-house-en-cc`
- `ontario-rm151-en`
- `ontario-committee-1-en`
- `ontario-committee-2-en`
- `ontario-media-en`
- `nunavut-legislative-assembly-tv`

Current status:

- Ontario: `noncommercial_pending_review`
- Nunavut: `personal_use_pending_review`

Contact routes:

- Ontario Broadcast and Recording Service:
  [Ontario contact page](https://www.ola.org/en/office-assembly/contact-us)
  lists `brs-reception@ola.org`.
- Nunavut Legislative Assembly:
  [contact page](https://www.assembly.nu.ca/contact-us-1) lists
  `leginfo@assembly.nu.ca`.

Question focus:

- Ontario terms support non-commercial excerpts with credit, but not full live
  stream relay. Ask whether full client-side HLS playback of House/committee
  feeds is acceptable for a non-commercial catalogue.
- Nunavut has public webcasts and downloads, but no recorded reuse terms. Ask
  whether the Assembly prefers link-out, downloads/archive use, or native
  client-side playback with attribution.

Status:

| Target | Contact route | Status | Last action | Notes |
| --- | --- | --- | --- | --- |
| Ontario Legislative Assembly BRS | `brs-reception@ola.org` | draft | 2026-08-19 | Ask about six public iSi LIVE feeds and required Assembly credit. |
| Nunavut Legislative Assembly | `leginfo@assembly.nu.ca` | draft | 2026-08-19 | Ask about live HLS, archived downloads, and preferred attribution. |

### National Direct HLS / Official-Vendor Streams

Catalogue IDs:

- `norway-stortinget`
- `germany-bundestag-1`
- `netherlands-tweede-kamer`
- `netherlands-tweede-kamer-aletta-jacobszaal`
- `netherlands-tweede-kamer-actualiteitenkanaal`
- `india-sansad-tv-1`
- `india-sansad-tv-2`
- `israel-knesset-channel`
- `portugal-artv`
- `greece-hellenic-parliament-tv`

Contact routes:

- Stortinget:
  [contact page](https://stortinget.no/no/Stottemeny/kontakt/) lists
  `postmottak@stortinget.no`; its press office is `presse@stortinget.no`.
- Deutscher Bundestag:
  [imprint](https://www.bundestag.de/services/impressum) lists
  `vorzimmer.ik6@bundestag.de` for Internet editorial /
  Parlamentsfernsehen and `mail@bundestag.de` as general contact.
- Tweede Kamer:
  [press information](https://www.tweedekamer.nl/contact-en-bezoek/persinformatie)
  lists `persvoorlichting@tweedekamer.nl`.
- Sansad TV:
  [about/contact page](https://sansadtv.nic.in/about-us) lists
  `sansadtv-digital[at]sansad[dot]nic[dot]in` and
  `sansadtv-sm[at]sansad[dot]nic[dot]in`.
- Knesset Channel:
  [official Knesset page](https://main.knesset.gov.il/en/news/pages/channel99.aspx)
  and [channel contact page](https://www.knesset.tv/%D7%A6%D7%95%D7%A8-%D7%A7%D7%A9%D7%A8/)
  list `support@Knesset.tv`; Knesset site directory also lists Knesset
  web/contact routes.
- Assembleia da Republica / ARTV:
  use the official [Assembleia da Republica site](https://www.parlamento.pt/)
  and contact pages; request should be routed to Canal Parlamento / ARTV or the
  Assembly communications office.
- Hellenic Parliament TV:
  [contact page](https://www.hellenicparliament.gr/contact/) lists
  `infopar@parliament.gr`; [press office page](https://www.hellenicparliament.gr/en/Dioikitiki-Organosi/Ypiresies/Other-Services/Grafeio-Typou-kai-Koinovouleftikis-Pliroforisis/)
  lists `pressoffice@parliament.gr`.

Question focus:

- Norway and Germany document requested or dedicated official live-signal
  routes. Ask whether Parliament Streams should use only that route, and how to
  request it.
- Netherlands provides recognised-media AV guidance. Ask whether public
  catalogue playback of Debat Direct HLS is acceptable, or whether only the
  official page/download/embed service is appropriate.
- India, Portugal, Greece, and Israel have official/public parliamentary
  channels but incomplete native-playback reuse terms. Ask for the recommended
  route and required attribution.

Status:

| Target | Contact route | Status | Last action | Notes |
| --- | --- | --- | --- | --- |
| Norway Stortinget | `postmottak@stortinget.no` / `presse@stortinget.no` | draft | 2026-08-19 | Ask whether the dedicated retransmission route is required. |
| Germany Bundestag IK6 | `vorzimmer.ik6@bundestag.de` | draft | 2026-08-19 | Ask about Parlamentsfernsehen live HLS vs requested live signal. |
| Netherlands Tweede Kamer | `persvoorlichting@tweedekamer.nl` | draft | 2026-08-19 | Ask about Debat Direct HLS and public non-media catalogue use. |
| India Sansad TV | `sansadtv-digital[at]sansad[dot]nic[dot]in` | draft | 2026-08-19 | Ask about Sansad TV 1/2 public HLS and required credit. |
| Israel Knesset Channel | `support@Knesset.tv` | draft | 2026-08-19 | Ask how to distinguish proceedings from non-proceeding channel content. |
| Portugal ARTV | Official Assembly contact route | draft | 2026-08-19 | Find a better ARTV/communications contact before sending. |
| Hellenic Parliament TV | `pressoffice@parliament.gr` / `infopar@parliament.gr` | draft | 2026-08-19 | Ask whether full live playback is permitted or excerpts only. |

### Supranational And Official-Page Cases

Catalogue IDs:

- `council-of-europe-pace-live`

Contact routes:

- Council of Europe / PACE:
  [copyright and licensing page](https://www.coe.int/en/web/portal/copyright-licensing-permissions)
  directs audiovisual-material questions to Council of Europe audiovisual
  contacts; [audiovisual services](https://www.coe.int/en/web/portal/audiovisual-services1)
  and [PACE contacts](https://pace.coe.int/en/pages/contacts) list the relevant
  communications and technical routes.

Question focus:

- Council of Europe/PACE: ask whether PACE livestream and downloadable video
  may be listed, embedded, or played natively in a public-interest catalogue,
  and whether the public YouTube/live resources are the preferred route.

Status:

| Target | Contact route | Status | Last action | Notes |
| --- | --- | --- | --- | --- |
| Council of Europe / PACE | Council audiovisual / PACE communications routes | draft | 2026-08-19 | Use the official permission form/contact route; do not email a guessed address. |

Resolved official-page notes:

- Manitoba Legislative Assembly moved to `explicit_reuse_with_conditions` on
  2026-08-19 for link-out/non-commercial use under the Assembly website
  copyright statement. Keep native playback disabled unless a supported stream
  route and permission are separately documented.

## Ready-To-Send Batches

These drafts are preparation, not an active send queue. Keep them on hand for a
future coordinated outreach pass that can explain the project, its public
benefits, its safeguards, its technical asks, and its open-stream advocacy in
one package.

Send these in small batches so replies can be processed without mixing
conditions across institutions.

### Batch 1: Canadian iSi LIVE

Targets:

- Ontario Legislative Assembly BRS
- Nunavut Legislative Assembly

Purpose:

- Clarify whether the existing public iSi LIVE HLS feeds may be played
  client-side by a non-commercial public-interest catalogue.
- Ask whether the legislatures prefer official page link-out, official embeds,
  archive downloads, or another route.

Catalogue impact:

- A positive Ontario reply could move six Ontario entries from
  `noncommercial_pending_review` to `explicit_reuse_with_conditions`.
- A negative or link-out-only reply should move those entries to link-out
  playback posture while preserving schedule/accessibility metadata.
- A positive Nunavut reply could resolve `nunavut-legislative-assembly-tv`;
  otherwise it should remain pending or link-out.

### Batch 2: Dedicated Or Recognised-Media Signal Routes

Targets:

- Norway Stortinget
- Germany Bundestag
- Netherlands Tweede Kamer

Purpose:

- These institutions publish or imply controlled official signal routes,
  recognised-media workflows, or requested access procedures.
- Ask whether Parliament Streams should apply for that route or keep the
  catalogue link-out only.

Catalogue impact:

- Do not treat a browser-discovered HLS endpoint as equivalent to a requested
  official signal unless the institution explicitly confirms that route.
- If a supported embed/download/current-event route exists, prefer that over raw
  direct playback.

### Batch 3: Parliamentary Channel Terms

Targets:

- India Sansad TV
- Israel Knesset Channel
- Portugal ARTV / Canal Parlamento
- Hellenic Parliament TV

Purpose:

- Clarify whether public parliamentary-channel HLS/native playback is allowed,
  and whether proceedings must be distinguished from non-proceeding or
  broadcaster-produced programming.
- Ask for required credit language and any restrictions on editing,
  advertising, commentary, or commercial contexts.

Catalogue impact:

- Positive replies should still be converted into narrow conditions rather than
  broad reuse claims.
- If the reply only supports official pages or embeds, keep native playback
  disabled or permission-pending.

### Batch 4: Official-Page / Supranational Clarification

Targets:

- Council of Europe / PACE

Purpose:

- Council of Europe/PACE: clarify audiovisual-specific permission because
  general website permissions do not settle live video reuse.

Catalogue impact:

- A positive reply can resolve link-out/event metadata conditions.
- A negative or ambiguous reply keeps the entry link-out/pending.

## Source-Specific Drafts

### Ontario

```text
Subject: Clarification request: Legislative Assembly of Ontario video streams

Hello,

I maintain Parliament Streams, an unofficial public-interest research catalogue
of public parliamentary video sources, official pages, and schedule metadata:

https://github.com/dlq/parliament-streams

The catalogue records the Legislative Assembly of Ontario's official video page
and the public House, captioned House, committee-room, and media-studio streams.
The project does not download, save, edit, record, proxy, cache, or monetize
video. It links back to the official Assembly page and displays the recorded
source attribution and rights notes.

Your published copyright/privacy terms appear to allow reasonable, fair,
non-commercial use of excerpts with Assembly credit, while the media guidance
refers accredited media to the Assembly broadcast feed. I would like to clarify
the recommended route for a non-commercial public catalogue.

Is client-side playback of the public live streams permitted with visible
Assembly attribution and links, or should third-party projects link only to the
official Assembly video page?

If playback is permitted, are there required credits, wording, technical routes,
or restrictions beyond those already published?

Thank you.
```

### Nunavut

```text
Subject: Clarification request: Nunavut Legislative Assembly webcast video

Hello,

I maintain Parliament Streams, an unofficial public-interest research catalogue
of public parliamentary video sources, official pages, and schedule metadata:

https://github.com/dlq/parliament-streams

The catalogue records the Nunavut Legislative Assembly's official webcast page
and the public Assembly TV stream. The project does not download, save, edit,
record, proxy, cache, or monetize video. It links back to the official Assembly
page and displays source attribution and rights notes.

Could you confirm the recommended route for public-interest access to Assembly
webcast video?

1. May the project list the official webcast page and archive links?
2. Is there an official embed or player route that third parties should use?
3. Is client-side playback of the public live stream permitted for a
   non-commercial catalogue with Assembly attribution and links?
4. Are there required credits, wording, restrictions, or uses to avoid?

If native playback is not permitted, I will keep the catalogue as link-out only
for this source.

Thank you.
```

### Norway / Germany / Netherlands Signal-Route Request

Use this for Stortinget, Bundestag, and Tweede Kamer after replacing the
bracketed fields.

```text
Subject: Clarification request: [institution] official live video route

Hello,

I maintain Parliament Streams, an unofficial public-interest research catalogue
of public parliamentary video sources, official pages, and schedule metadata:

https://github.com/dlq/parliament-streams

The catalogue records [institution/source] at:

[official URL]

The project does not download, save, edit, record, proxy, cache, or monetize
video. It links back to the official page and displays source attribution and
rights notes.

Your public information appears to describe an official live-signal,
recognised-media, embed, or requested-access route for parliamentary video. I
would like to avoid relying on a browser-discovered HLS URL if that is not the
supported third-party route.

Could you confirm the recommended route for a non-commercial public-interest
catalogue?

1. Should third-party projects use only the official page or embedded player?
2. Is there an application or permission process for a supported live signal?
3. Is client-side playback of the public HLS stream permitted with source
   attribution and links, or should that be avoided?
4. Are there required credits, wording, restrictions, or uses to avoid?

If native playback is not permitted, I will keep this source as link-out only.

Thank you.
```

### Parliamentary Channels

Use this for Sansad TV, Knesset Channel, ARTV / Canal Parlamento, and Hellenic
Parliament TV after replacing the bracketed fields.

```text
Subject: Clarification request: [channel] public parliamentary video

Hello,

I maintain Parliament Streams, an unofficial public-interest research catalogue
of public parliamentary video sources, official pages, and schedule metadata:

https://github.com/dlq/parliament-streams

The catalogue records [channel/source] at:

[official URL]

The project does not download, save, edit, record, proxy, cache, or monetize
video. It links back to the official page and displays source attribution and
rights notes.

Could you confirm the recommended route for third-party public-interest access
to this parliamentary video?

1. May the project list the official live page and schedule/event links?
2. Is there an official embed/player route you prefer?
3. Is client-side playback of the public live stream permitted for a
   non-commercial catalogue with source attribution and links?
4. Does permission differ between live parliamentary proceedings and other
   channel programming?
5. Are there required credits, wording, restrictions, or uses to avoid?

If native playback is not permitted, I will keep this source as link-out only.

Thank you.
```

### Council of Europe / PACE

```text
Subject: Clarification request: PACE live audiovisual access

Hello,

I maintain Parliament Streams, an unofficial public-interest research catalogue
of public parliamentary and supranational assembly video sources, official
pages, and schedule metadata:

https://github.com/dlq/parliament-streams

The catalogue records the Council of Europe / PACE live page and related public
event-video surfaces. The project does not download, save, edit, record, proxy,
cache, or monetize video. It links back to the official page and displays
source attribution and rights notes.

The Council of Europe website permissions describe some website-material reuse,
but audiovisual permissions appear to be handled separately. Could you confirm
the recommended route for PACE live or recorded video in a non-commercial
public-interest catalogue?

1. May the project list the official live page and event links?
2. Is there an official embed/player route that third parties should use?
3. Is client-side playback of a public live stream permitted with Council/PACE
   attribution and links?
4. Are downloadable or archived PACE videos subject to different conditions?
5. Are there required credits, wording, restrictions, or uses to avoid?

If native playback is not permitted, I will keep the catalogue as link-out only
for this source.

Thank you.
```

### Shared Short Form

Use this for the remaining targets after replacing the bracketed fields.

```text
Subject: Clarification request: [institution] public proceedings video

Hello,

I maintain Parliament Streams, an unofficial public-interest research catalogue
of public parliamentary video sources, official pages, and schedule metadata:

https://github.com/dlq/parliament-streams

The catalogue records [institution/source] at:

[official URL]

The project does not download, save, edit, record, proxy, cache, or monetize
video. It links back to the official page and displays source attribution and
rights notes.

Could you confirm the recommended route for third-party public-interest access
to this proceedings video?

1. May we list the official live page and schedule/event links?
2. Is there an official embed/player route you prefer?
3. Is client-side playback of the technically public HLS stream permitted for a
   non-commercial catalogue with source attribution and links?
4. Are there required credits, wording, restrictions, or uses to avoid?

If native playback is not permitted, I will keep this source as link-out only.

Thank you.
```

## Response Handling

When a reply arrives:

1. Summarize the reply here without quoting private correspondence at length.
2. Add the public contact route and response summary to
   [docs/source-rights-and-permissions.md](source-rights-and-permissions.md).
3. Update `data/channels.json` only if the reply clearly supports a status
   change.
4. Regenerate `site/catalogue-data.js`.
5. Update the relevant review-queue report or create a successor report.
6. Run `make verify`.
