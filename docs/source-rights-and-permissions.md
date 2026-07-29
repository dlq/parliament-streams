# Source Rights And Permissions

This file records source-by-source rights, permission, and provenance notes for
the Parliaments public catalogue. It is not legal advice. Its job is to keep
technical source discovery separate from the question of whether a stream,
schedule, page, or platform source can be reused by this project or by
downstream projects.

Last reviewed: 2026-07-29.

## Catalogue Position

Public availability is not the same thing as permission to redistribute,
embed, catalogue, or play a stream in a third-party product. A source should be
described as reusable only when an official page, terms of use, licence, or
direct written permission supports that use.

The conservative catalogue posture is:

- keep CPAC as link-out/pending unless CPAC gives written consent;
- keep Denmark as a strong rights-supported candidate, subject to attribution,
  no-modification, no-endorsement, and licence-copy conditions;
- treat Quebec and Ontario as non-commercial, attribution-required candidates
  where written clarification would still reduce risk;
- treat Brazil as promising but incomplete until TV Camara-specific native HLS
  reuse expectations are confirmed;
- treat Spain Congreso en Directo as a strong rights candidate because official
  pages document up to five simultaneous web signals and free
  institutional-signal access, while keeping the newly discovered committee HLS
  masters in technical review until variant playback is confirmed;
- treat Oireachtas as official embed/link-out unless a source-supported direct
  HLS route is documented;
- treat all other direct HLS/DASH sources as research entries until their terms
  or permissions are documented;
- keep YouTube sources as official links or compliant embeds only; do not
  extract YouTube manifests.

## Evidence Summary

| Source | Catalogue status | Evidence checked | Rights read | Recommendation |
| --- | --- | --- | --- | --- |
| CPAC Canada | Direct HLS discovered, `personalUsePendingReview` | [CPAC terms of use](https://www.cpac.ca/terms-of-use) | CPAC grants only personal, non-commercial viewing on CPAC.ca and prohibits retransmission, embedding, hotlinking, inline linking, scraping, caching, and other uses without prior written consent. | Link to CPAC.ca only unless written consent is obtained. |
| Denmark Folketinget | Direct HLS discovered, `personalUsePendingReview` | [Deling og rettigheder](https://www.ft.dk/da/aktuelt/tv-fra-folketinget/deling-og-rettigheder) | Strong support. Folketinget states TV productions may be used and shared subject to conditions, grants broad royalty-free rights across media/formats, permits public digital performance/webcast, and lists attribution/no-modification/no-endorsement limitations. | Strong reuse candidate if attribution and licence conditions are represented. |
| Quebec National Assembly canal01-canal14 | Direct HLS discovered, `noncommercialPendingReview` | [Live webdiffusion](https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html), [conditions d'utilisation](https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html) | Strong but bounded. Terms cover videos/audio and permit free reproduction if reasonable, fair, non-commercial/non-lucrative, unmodified, non-prejudicial, and credited. Debate reproduction for diffusion does not require authorization subject to Assembly law sections 48 and 49; other uses need authorization. | Possible for non-commercial catalogue/reuse with visible credit and no modification. Written clarification would reduce risk. |
| Ontario Legislative Assembly streams | Direct HLS discovered, `noncommercialPendingReview` | [Live House video](https://www.ola.org/en/legislative-business/video), [copyright and privacy](https://www.ola.org/en/office-assembly/copyright-privacy) | Moderate support. Terms define electronic channels to include video streaming services and permit reasonable, fair, non-commercial display/reproduction/use of excerpts with Assembly credit, subject to IP law and parliamentary privilege. | Use cautiously. Full live-stream relay is less clearly covered than excerpts; written clarification is recommended. |
| Brazil TV Camara | Direct HLS discovered, `explicitReuseWithConditions` | [TV Camara page](https://www.camara.leg.br/tv/), [terms of use](https://www2.camara.leg.br/termo-de-uso-e-politica-de-privacidade) | Promising but incomplete. The Camara portal terms allow free reproduction of published data, images, infographics, and information with source/author credit, and state portal information is public and free to reproduce. The same terms also note YouTube API terms for videos on the portal. | Keep as promising but confirm TV Camara-specific stream reuse before treating the HLS endpoint as redistributable. |
| Spain Congreso en Directo / Canal Parlamento | Direct HLS discovered, `explicitReuseWithConditions` | [Congreso en directo](https://www.congreso.es/es/web/guest/congreso-en-directo), [Canal Parlamento information](https://www.congreso.es/es/cem/mas-informacion), [FAQs](https://www.congreso.es/es/cem/faqs) | Strong rights support. Official pages state Congreso en Directo provides Plenary and up to five committee/live signals through the Congress website. FAQ text says the institutional signal is distributed free to media and citizens, and videos can be downloaded and used freely after sessions. The five committee HLS masters returned 200 but sample variants returned 404 on 2026-07-29. | Keep the existing Canal Parlamento entry as validated; keep newly added committee HLS masters in technical review until variant playback is confirmed. |
| Ireland Oireachtas TV | Official embed/link-out, `explicitReuseWithConditions` | [Oireachtas TV](https://www.oireachtas.ie/en/oireachtas-tv/), [embed codes](https://www.oireachtas.ie/en/oireachtas-tv/embed-codes/), [committee schedule](https://www.oireachtas.ie/en/committees/schedule/) | Official page provides live streams and embed codes for Oireachtas TV, Dail, Seanad, and committee rooms. Use is subject to rules of coverage and required credit to the Houses of the Oireachtas Service. Raw HLS URLs returned 403 from this validation environment. | Use official embed codes or link out; do not list raw HLS unless a source-supported direct playback path is confirmed. |
| New Zealand Parliament TV | Direct HLS discovered, `explicitReuseWithConditions` | [Parliament in action portal](https://videos.parliament.nz/), [New Zealand Parliament homepage](https://www.parliament.nz/) | Official video portal found, but no current explicit reuse or native-stream permission found in this pass. | Treat as pending/link-out until terms or permission are found. |
| UK Parliament YouTube | Link-out, `embedOnly` | [UK Parliament YouTube](https://www.youtube.com/UKParliament) | Link-out only. The project does not extract YouTube manifests. | Use official YouTube links or compliant embeds only. |
| Australia Parliament Live YouTube | Link-out, `embedOnly` | [AUS Parliament Live](https://www.youtube.com/@AUSParliamentLive) | Link-out only. The project does not extract YouTube manifests. | Use official YouTube links or compliant embeds only. |
| Taiwan Parliamentary TV | Link-out, `embedOnly` | [Parliamentary TV](https://www.parliamentarytv.org.tw/) | Link-out only in the current catalogue. Terms not yet reviewed. | Keep link-out only pending terms review. |
| Costa Rica Assembly YouTube | Link-out, `embedOnly` | [Asamblea CRC YouTube](https://www.youtube.com/@AsambleaCRC) | Link-out only. The project does not extract YouTube manifests. | Use official YouTube links or compliant embeds only. |

## Pending Rights Review

These sources are public or official-looking, but this file does not yet
contain enough documentary evidence for confident reuse. Until each has a terms
page, licence, or written permission record, treat it as a research entry rather
than a redistributable native stream.

| Source | Catalogue ids | Current status | Official page | Recommendation |
| --- | --- | --- | --- | --- |
| Netherlands Tweede Kamer | `netherlands-tweede-kamer` | `personalUsePendingReview` | https://www.tweedekamer.nl/debat_en_vergadering/livedebat | Link-out/pending |
| France National Assembly | `france-national-assembly` | `personalUsePendingReview` | https://videos.assemblee-nationale.fr/direct.php | Link-out/pending |
| Portugal ARTV Canal Parlamento | `portugal-artv` | `personalUsePendingReview` | https://www.parlamento.pt/ | Link-out/pending |
| Greece Hellenic Parliament TV | `greece-hellenic-parliament-tv` | `personalUsePendingReview` | https://www.hellenicparliament.gr/ | Link-out/pending |
| Luxembourg Chamber TV | `luxembourg-chamber-tv` | `personalUsePendingReview` | https://www.chd.lu/ | Link-out/pending |
| Italy Senate | `italy-senate` | `personalUsePendingReview` | https://webtv.senato.it/ | Link-out/pending |
| India Sansad TV 1/2 | `india-sansad-tv-1`, `india-sansad-tv-2` | `personalUsePendingReview` | https://sansadtv.nic.in/ | Link-out/pending |
| Thailand Parliament TV | `thailand-parliament-tv` | `personalUsePendingReview` | https://tpchannel.org/ | Link-out/pending |
| Slovakia TV NRSR | `slovakia-tv-nrsr` | `personalUsePendingReview` | https://www.nrsr.sk/ | Link-out/pending |
| Mongolia Parliament TV | `mongolia-parliament-tv` | `personalUsePendingReview` | https://www.parliament.mn/ | Keep as research-only DASH experiment |
| Nunavut Legislative Assembly TV | `nunavut-legislative-assembly-tv` | `personalUsePendingReview` | https://www.assembly.nu.ca/webcasts?page=1 | Previous direct HLS URL returned 404 on 2026-07-29; link to the official live player page pending a current source-supported manifest. |

## Permission Request Template

Use short, concrete permission requests. Ask for wording that is suitable for a
public catalogue and for downstream projects that may need documentary evidence.

```text
Hello,

I maintain Parliaments, an unofficial public-interest research catalogue of
public parliamentary video sources, official pages, and schedule metadata. I
would like to document your live public parliamentary video stream and the
recommended way to link to, embed, or otherwise reuse it, with source
attribution and a direct link back to your official page. The project does not
download, save, edit, record, or monetize the video.

Could you confirm whether this use is permitted under your terms, or provide
the correct permission process?

If native playback, embedding, or catalogue listing is permitted, a short
confirmation of the allowed use and required conditions would be sufficient.

Thank you.
```
