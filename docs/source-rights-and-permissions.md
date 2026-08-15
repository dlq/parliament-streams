# Source Rights And Permissions

This file records source-by-source rights, permission, and provenance notes for
the Parliaments public catalogue. It is not legal advice. Its job is to keep
technical source discovery separate from the question of whether a stream,
schedule, page, or platform source can be reused by this project or by
downstream projects.

Last reviewed: 2026-08-15.

## Catalogue Position

Public availability is not the same thing as permission to redistribute,
embed, catalogue, or play a stream in a third-party product. This project does
not represent the absence of recorded permission as a licence or other grant of
rights.

The catalogue uses an opt-out playback posture:

- keep CPAC as link-out only: its terms expressly prohibit third-party
  embedding, retransmission, hotlinking, inline linking, and related uses
  without written consent;
- allow client-side playback for technically validated public direct HLS/DASH
  endpoints unless a source's recorded terms expressly prohibit third-party
  reuse; this is a project policy, not a conclusion that permission exists;
- preserve visible attribution, source-condition links, and all known
  restrictions for every playable source;
- keep technically unvalidated endpoints and entries without direct playback
  URLs as official link-out or embed targets;
- keep YouTube sources as official links or compliant embeds only; do not
  extract YouTube manifests.

Source owners may request removal or correction through the repository owner on
GitHub. The project will promptly disable playback while the report is reviewed.

## Evidence Summary

| Source | Catalogue status | Evidence checked | Rights read | Recommendation |
| --- | --- | --- | --- | --- |
| CPAC Canada | Direct HLS discovered, `no_third_party_reuse` | [CPAC terms of use](https://www.cpac.ca/terms-of-use) | CPAC grants only personal, non-commercial viewing on CPAC.ca and prohibits retransmission, embedding, hotlinking, inline linking, scraping, caching, and other uses without prior written consent. | Link to CPAC.ca only. Use the recorded HLS in a third-party player only with written consent. |
| Denmark Folketinget | Direct HLS discovered, `explicit_reuse_with_conditions` | [Deling og rettigheder](https://www.ft.dk/da/aktuelt/tv-fra-folketinget/deling-og-rettigheder) | Folketinget grants a global, royalty-free, non-exclusive right to reproduce, disseminate, publicly show, and transmit its TV productions across media and formats, including webcasts. The terms require attribution, a link to the terms, no modification except technically necessary changes, no implied endorsement, no logo use, and no access restrictions inconsistent with the licence. | Native playback is allowed when those conditions are shown and followed. |
| Quebec National Assembly canal01-canal14 | Direct HLS discovered, `explicit_reuse_with_conditions` | [Live webdiffusion](https://www.assnat.qc.ca/fr/video-audio/en-direct-webdiffusion.html), [conditions d'utilisation](https://www.assnat.qc.ca/fr/propos-site/droits-propriete-intellectuelle.html) | Terms cover videos/audio and permit free reproduction when reasonable, fair, non-commercial/non-lucrative, unmodified, non-prejudicial, and credited. Reproducing Assembly, committee, or subcommittee debates in whole or part for dissemination needs no authorization, subject to the Assembly Act. | Native playback is allowed for this non-commercial catalogue with the visible credit “Assemblée nationale du Québec”, no modification, no logo use, and no implication of endorsement. |
| Ontario Legislative Assembly streams | Direct HLS discovered, `noncommercial_pending_review` | [Live House video](https://www.ola.org/en/legislative-business/video), [copyright and privacy](https://www.ola.org/en/office-assembly/copyright-privacy) | Moderate support. Terms define electronic channels to include video streaming services and permit reasonable, fair, non-commercial display/reproduction/use of excerpts with Assembly credit, subject to IP law and parliamentary privilege. | Use cautiously. Full live-stream relay is less clearly covered than excerpts; written clarification is recommended. |
| Brazil TV Camara | Direct HLS discovered, `personal_use_pending_review` | [TV Camara page](https://www.camara.leg.br/tv/), [terms of use](https://www2.camara.leg.br/termo-de-uso-e-politica-de-privacidade) | The Camara portal terms allow reproduction of public portal information with source/author credit, but do not clearly authorize third-party native playback of the recorded TV Camara HLS endpoint. The terms also direct portal video use to YouTube terms where applicable. | Link to the official TV Camara page until it confirms a native-HLS reuse path. |
| Spain Congreso en Directo / Canal Parlamento | Direct HLS discovered, `personal_use_pending_review` | [Congreso en directo](https://www.congreso.es/es/web/guest/congreso-en-directo), [Canal Parlamento information](https://www.congreso.es/es/cem/mas-informacion), [FAQs](https://www.congreso.es/es/cem/faqs) | Official pages state Congreso en Directo provides Plenary and up to five committee/live signals through the Congress website. The FAQ says the institutional signal is distributed free to media and citizens, while videos may be downloaded and used freely after sessions. That is strong support for official access and archive reuse, but it does not clearly authorize a third-party raw-live-HLS player. | Link to the official source for live use. Keep the existing validated endpoint and committee HLS masters as technical/provenance records only. |
| Ireland Oireachtas TV | Official embed/link-out, `explicit_reuse_with_conditions` | [Oireachtas TV](https://www.oireachtas.ie/en/oireachtas-tv/), [embed codes](https://www.oireachtas.ie/en/oireachtas-tv/embed-codes/), [committee schedule](https://www.oireachtas.ie/en/committees/schedule/) | Official page provides live streams and embed codes for Oireachtas TV, Dail, Seanad, and committee rooms. Use is subject to rules of coverage and required credit to the Houses of the Oireachtas Service. Raw HLS URLs returned 403 from this validation environment. | Use official embed codes or link out; do not list raw HLS unless a source-supported direct playback path is confirmed. |
| Scottish Parliament TV | Official page, `explicit_reuse_with_conditions` | [Parliament TV](https://www.scottishparliament.tv/), [copyright licence](https://www.parliament.scot/about/copyright), [clip guidance](https://www.parliament.scot/about/how-parliament-works/policies/social-media-use-of-parliament-tv-clips) | The Scottish Parliament licence permits reuse with attribution, no implied endorsement, and restrictions on party-political and advertising use. Parliament TV clip guidance adds fair-reporting and editing conditions. Official pages must not be framed by third-party sites. | Link to Parliament TV. Preserve attribution and use clips only under the published conditions; do not frame the site or extract dynamic manifests. |
| Senedd TV | Official page, `explicit_reuse_with_conditions` | [Senedd TV](https://www.senedd.tv/), [copyright terms](https://senedd.wales/commission/access-to-information/copyright/), [video guidance](https://senedd.wales/media/images-and-video/) | Commission material may be reproduced with acknowledgement and restrictions against misleading, prohibited, and commercial-promotional uses. Senedd-provided clips may be shared or embedded, but official web pages may not be framed. | Link to Senedd TV and use only its documented clip-sharing or embedding routes under the published terms. |
| Northern Ireland Assembly TV | Official page, `no_third_party_reuse` | [Assembly TV](https://niassembly.tv/), [live calendar](https://niassembly.tv/calendar/), [copyright guidelines](https://www.niassembly.gov.uk/about-the-assembly/corporate-information/copyright-guidelines/) | Live and archive Assembly and committee broadcasts may not be directly linked to, reproduced, copied, or downloaded without formal agreement. Recorded interpretation has additional restrictions. | Link to the Assembly TV home or calendar page only. Do not embed, relay, or extract a broadcast without formal agreement. |
| New Zealand Parliament TV | Direct HLS discovered, `explicit_reuse_with_conditions` | [Parliament TV terms](https://www3.parliament.nz/en/get-involved/information-for-the-press/parliament-tv-terms-and-conditions/), [copyright](https://www3.parliament.nz/en/footer/copyright/) | Parliament TV terms expressly permit television broadcast, webcast, and recording of live House proceedings in other media. Use must comply with legal obligations, contain no commercial sponsorship or advertising, and not mislead; Parliament may direct a broadcaster to stop or alter coverage. The copyright page says the specific Parliament TV terms govern, rather than a Creative Commons licence. | Native playback is allowed for this ad-free, unmodified catalogue with clear attribution and source terms. Do not continue use contrary to a Parliament direction. |
| UK Parliament YouTube | Link-out, `embed_only` | [UK Parliament YouTube](https://www.youtube.com/UKParliament) | Link-out only. The project does not extract YouTube manifests. | Use official YouTube links or compliant embeds only. |
| Australia Parliament Live YouTube | Link-out, `embed_only` | [AUS Parliament Live](https://www.youtube.com/@AUSParliamentLive) | Link-out only. The project does not extract YouTube manifests. | Use official YouTube links or compliant embeds only. |
| Taiwan Parliamentary TV | Link-out, `embed_only` | [Parliamentary TV](https://www.parliamentarytv.org.tw/) | Link-out only in the current catalogue. Terms not yet reviewed. | Keep link-out only pending terms review. |
| Costa Rica Assembly YouTube | Link-out, `embed_only` | [Asamblea CRC YouTube](https://www.youtube.com/@AsambleaCRC) | Link-out only. The project does not extract YouTube manifests. | Use official YouTube links or compliant embeds only. |

## Pending Rights Review

These sources are public or official-looking, but this file does not yet
contain enough documentary evidence for confident reuse. Their rights status is
still unresolved even where the public site makes a technically validated
direct endpoint playable under its opt-out policy.

This status can also mean that terms exist but authorize a different route than
the discovered endpoint: an official embed, a requested broadcast feed, or
post-session video. It does not mean that the project is waiting for a response
from the source.

The recommendations below describe the safest documented route; they do not
override the public site's technical playback gate.

| Source | Catalogue ids | Current status | Official page | Recommendation |
| --- | --- | --- | --- | --- |
| Netherlands Tweede Kamer | `netherlands-tweede-kamer` | `personal_use_pending_review` | https://www.tweedekamer.nl/debat_en_vergadering/livedebat | The Kamer's [audiovisual material guidance](https://www.tweedekamer.nl/contact-en-bezoek/persinformatie/audiovisuele-vergaderbeelden-afnemen) permits recognised media to use the official download/embed service for journalistic use. It does not document public use of the catalogued raw HLS endpoint. Use the official service or link out. |
| Norway Stortinget | `norway-stortinget` | `personal_use_pending_review` | https://www.stortinget.no/nett-tv | The [retransmission terms](https://www.stortinget.no/no/Stottemeny/Hjelp/Nett-TV/Videreformidling-av-Stortingets-nett-TV/) require a formal arrangement and a dedicated publication point. Link out, or obtain that arrangement before enabling third-party playback. |
| France National Assembly | `france-national-assembly` | `personal_use_pending_review` | https://videos.assemblee-nationale.fr/direct.php | Link-out/pending |
| Chile Camara TV | `chile-camara-tv` | `personal_use_pending_review` | https://www.camara.cl/prensa/television.aspx | Link-out/pending until terms or permission are documented |
| Israel Knesset Channel | `israel-knesset-channel` | `personal_use_pending_review` | https://www.knesset.tv/live/ | Link-out/pending until terms or permission are documented |
| Germany Bundestag 1 | `germany-bundestag-1` | `personal_use_pending_review` | https://www.bundestag.de/mediathek | [Bundestag terms](https://www.bundestag.de/resource/blob/296016/nutzungsbedingungen_de.pdf) permit archive downloads/embeds under conditions and offer a live signal to third parties on request. Do not treat the browser-discovered raw HLS as that requested signal; use an official embed, link out, or request the live route. |
| Portugal ARTV Canal Parlamento | `portugal-artv` | `personal_use_pending_review` | https://www.parlamento.pt/ | Link-out/pending |
| Greece Hellenic Parliament TV | `greece-hellenic-parliament-tv` | `personal_use_pending_review` | https://www.hellenicparliament.gr/ | Link-out/pending |
| Luxembourg Chamber TV | `luxembourg-chamber-tv` | `personal_use_pending_review` | https://www.chd.lu/ | Link-out/pending; endpoint was unreachable from the 2026-08-14 validation environment |
| Estonia Riigikogu live streams | `estonia-riigikogu-live-1`, `estonia-riigikogu-live-2` | `personal_use_pending_review` | https://www.riigikogu.ee/en/news-and-publications/multimedia/live-broadcast/ | Link-out/pending until terms or permission are documented |
| Italy Senate | `italy-senate` | `personal_use_pending_review` | https://webtv.senato.it/ | Link-out/pending |
| India Sansad TV 1/2 | `india-sansad-tv-1`, `india-sansad-tv-2` | `personal_use_pending_review` | https://sansadtv.nic.in/ | Link-out/pending |
| Thailand Parliament TV | `thailand-parliament-tv` | `personal_use_pending_review` | https://tpchannel.org/ | Link-out/pending |
| Slovakia TV NRSR | `slovakia-tv-nrsr` | `personal_use_pending_review` | https://www.nrsr.sk/ | Link-out/pending |
| Mongolia Parliament TV | `mongolia-parliament-tv` | `personal_use_pending_review` | https://www.parliament.mn/ | Keep as research-only DASH experiment |
| Nunavut Legislative Assembly TV | `nunavut-legislative-assembly-tv` | `personal_use_pending_review` | https://www.assembly.nu.ca/webcasts | Direct iSi LIVE HLS endpoint returned HTTP 200 with an HLS manifest on 2026-08-14. Keep native playback permission-pending until explicit reuse terms or written permission are documented. |
| Other non-US sub-national targets | Research only | `personal_use_pending_review` | BC, Alberta, Saskatchewan, Manitoba, PEI, NWT, Newfoundland and Labrador, Australian states, German Landtage, Spanish autonomous parliaments, and selected Mexican regional channels | Several official live/archive pages are useful link-out or schedule candidates. Do not promote direct streams into the catalogue until official provenance and reuse terms are documented. |
| Ontario captioned House stream | `ontario-house-en-cc` | `noncommercial_pending_review` | https://www.ola.org/en/legislative-business/video | Direct captioned HLS endpoint returned 404 on 2026-08-14; review current official captioned route. |
| El Salvador Legislative Assembly | `el-salvador-legislative-assembly` | `personal_use_pending_review` | https://www.asamblea.gob.sv/ | Link-out/pending; standard TLS verification failed in the 2026-08-14 Python healthcheck |
| European Parliament Multimedia Centre | `european-parliament-multimedia-centre` | `explicit_reuse_with_conditions` | https://multimedia.europarl.europa.eu/en/webstreaming | Use official links/embeds and preserve EU/EP attribution; no stable raw HLS validated. |
| Council of the European Union Live | `council-of-eu-live` | `personal_use_pending_review` | https://video.consilium.europa.eu/home/en | Link-out/pending until terms or permission are documented. |
| EU Audiovisual Service / EBS | `eu-audiovisual-ebs` | `personal_use_pending_review` | https://audiovisual.ec.europa.eu/en | Link-out/pending; keep distinct from parliamentary chamber streams. |
| United Nations Web TV | `un-web-tv` | `personal_use_pending_review` | https://webtv.un.org/en/schedule | Use official schedule/event links or documented embeds; no native stream reuse permission recorded. |
| Council of Europe / PACE Live | `council-of-europe-pace-live` | `personal_use_pending_review` | https://www.coe.int/en/web/portal/live | Watchlist/link-out pending; Council of Europe/PACE pages returned 403 from parts of this validation environment. |
| OSCE Live | `osce-live` | `personal_use_pending_review` | https://www.osce.org/live | Link-out/pending; keep OSCE PA-specific coverage as a research target. |

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
