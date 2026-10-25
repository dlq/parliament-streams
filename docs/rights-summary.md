# Rights Summary

This project separates three questions that are easy to confuse:

1. Is a parliamentary video source public and official?
2. Is it technically playable in a browser?
3. Is third-party playback, embedding, or redistribution clearly permitted?

Public availability and technical playability are not treated as permission.
The detailed evidence lives in
[source-rights-and-permissions.md](source-rights-and-permissions.md).

## Current Policy

The proof-of-concept catalogue uses an opt-out playback posture:

- Direct, technically validated public HLS may remain playable when no recorded
  source terms prohibit it.
- The retained DASH record is research-only; technical discovery alone does
  not enable its playback.
- Sources with explicit third-party restrictions are link-out only.
- YouTube sources use official provider embeds only; the project does not
  extract YouTube manifests.
- Official event platforms such as ParlVU/SenVu remain link-out/event-metadata
  surfaces unless stable playback rights and technical routes are documented.
- The catalogue records playback presentation separately as `playback_policy`:
  `native_playback`, `provider_embed`, `link_out`, or `research_only`.
- Source owners can request correction or removal through the repository owner.

This policy is practical for research, but it is not a legal conclusion that
pending sources are licensed for reuse.

## Status Buckets

`explicit_reuse_with_conditions`
: Public terms or official guidance support reuse under recorded conditions
such as attribution, non-commercial use, no alteration, no advertising, no
misleading context, or no implied endorsement.

`embed_only`
: Use the official provider or institution embed/link route. Do not extract or
relay underlying media manifests.

`no_third_party_reuse`
: Recorded terms prohibit or materially restrict third-party playback,
embedding, linking, rebroadcast, reproduction, or redistribution without
separate permission. These sources should remain link-out only.

`personal_use_pending_review` and `noncommercial_pending_review`
: The source is public or official-looking, but the project does not yet have
enough source-specific evidence for confident third-party native playback.
These entries need either written clarification or a future dated terms review.

## Current Open Queue

As of 2026-10-25 (local working tree):

- France's National Assembly now has `no_third_party_reuse`: its current notice
  distinguishes conditionally reusable official documents from multimedia that
  requires prior agreement. Hyperlinks remain conditionally permitted. The
  old extracted feed was research-only. The subsequent publication review replaces
  it with a confirmed official-page link; no native player is enabled.
  [Dated correction and sources](../reports/discovery/2026-10-24-service-review-france-rights-correction.json).
- Two Tweede Kamer meeting feeds now have conditional reuse evidence from the
  current Dutch disclaimer and its linked audiovisual licence. The occasional
  events channel remains pending because its content may fall outside that
  licence's plenary/committee scope.
  [Licence review and conditions](../reports/discovery/2026-10-24-service-review-netherlands-av-licence.json).
- Canada's House and Senate notices expressly permit accurate, unofficial
  proceedings reproductions without financial gain and with source-specific
  safeguards. Their labels now record that conditional grant; both remain
  official link-outs, with independent live-delivery questions still open.
  [Chamber findings](../reports/discovery/2026-10-24-service-review-national-americas.json).
- Colombia's House now records the restrictive current linked terms as
  `no_third_party_reuse`, retaining its official provider viewing link.
  [Dated terms review](../reports/discovery/2026-10-24-service-review-national-americas.json).
- TVW's provider signal is expressly subject to licensure and now records
  `no_third_party_reuse`, while retaining its official viewing link. A legislature's
  provider designation is separate from the provider's audiovisual rights.
  [Current provider conditions](../reports/discovery/2026-10-24-service-review-us-chambers-c.json).
- 194 of 269 catalogue entries remain permission-pending: 16 official-vendor
  HLS, three first-party HLS, 174 official pages and one DASH research record.
- The previous 28-entry review queue remains classified in the dated report;
  it is a historical subset, not the current total.
- Later official-page additions retain source-specific terms notes in the
  catalogue and expansion reports. Their link-out readiness does not resolve
  independent playback or redistribution permission.

The current queue is tracked in the
[rights evidence issue](https://github.com/dlq/parliament-streams/issues/13)
and `data/channels.json`. The dated August classification baseline is
[review-queues-2026-08-19-rights-next.json](../reports/review-queues-2026-08-19-rights-next.json).
Draft outreach text is in
[permission-requests.md](permission-requests.md).

The pending `official_vendor_hls` native-playback records were reviewed as a
family on 2026-08-19. The review did not find public terms that fully close
third-party native playback for the unresolved vendor-stream families, so the
catalogue statuses remain pending. Those records now have a separate review
snapshot in
[review-queues-2026-08-19-official-vendor-hls.json](../reports/review-queues-2026-08-19-official-vendor-hls.json).

The pending `first_party_hls` records were also reviewed on 2026-08-19. The
review kept Netherlands Tweede Kamer in the written-clarification bucket and
kept Thailand TPchannel and El Salvador Legislative Assembly pending after
dated public-terms searches. No catalogue statuses changed. The snapshot is
[review-queues-2026-08-19-first-party-hls.json](../reports/review-queues-2026-08-19-first-party-hls.json).
The 24 October Dutch licence follow-up above supersedes that older conclusion
for the two identified meeting feeds; it does not recertify their current playback.

The pending `official_page` records were reviewed on 2026-08-19. Brazil TV
Camara and Manitoba House Broadcasts moved to
`explicit_reuse_with_conditions` for link-out use. Council of Europe/PACE,
Saskatchewan, Northwest Territories, and Navarre remain pending. The snapshot is
[review-queues-2026-08-19-official-page.json](../reports/review-queues-2026-08-19-official-page.json).

The single `direct_dash_research` record was reviewed on 2026-08-19. Mongolia
Parliament TV remains research-only: the official Parliament live/session page
is the safer user-facing route, and the SkyGo DASH manifest lacks
source-specific reuse permission and a platform playback strategy. The snapshot
is
[review-queues-2026-08-19-direct-dash-research.json](../reports/review-queues-2026-08-19-direct-dash-research.json).

## Practical Rule For New Sources

New sources should start as candidates or link-out records unless they have:

- stable institutional identity;
- official provenance;
- a supportable playback or embed route;
- source-specific rights notes;
- validation evidence; and
- schedule/event semantics where possible.
