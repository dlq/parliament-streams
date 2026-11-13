# Catalogue grouping data model

Implemented for [issue #79](https://github.com/dlq/parliament-streams/issues/79).
The catalogue continues to count and link to viewing sources. Grouping adds a
way to browse those sources by jurisdiction and legislative body.

## Identities and relationships

| Record | Stable key | Meaning |
| --- | --- | --- |
| Viewing source | Existing `channels[].id` | One published viewing route. Playback, schedule mappings and direct links keep this key. |
| Jurisdiction | Reviewed opaque ID such as `ca`, `ca-ab` or `im` | One display jurisdiction. A code can seed an ID where it identifies the exact jurisdiction. IDs survive label changes and do not require an ISO code. |
| Legislature or chamber | Existing canonical inventory record ID | The legislative body served by a source. Resolve retired aliases through the existing inventory crosswalk. |
| Room | Reviewed ID scoped to the institution that operates it | A stable venue when evidence distinguishes it. A room can serve multiple committees and have multiple viewing sources. |

Maintain jurisdiction records with `id`, `kind`, `label`, optional
`parent_id` for reviewed territorial nesting, and `search_association_ids`
for other discoverability links. An optional `region_code` supports locale
labels and an optional map reference points to the corresponding geometry.
Neither field determines jurisdiction identity. Ordinary regions can appear
under their reviewed parent. Special-status territories can have their own
top-level group and still be found by searching for an associated country.
Membership in an international organization is a separate relationship
maintained in `data/supranational.json`.

Keep a reviewed mapping from inventory IDs to jurisdiction IDs. A chamber
inherits its umbrella legislature's jurisdiction when the inventory has a
`chamber_of_existing_umbrella_legislature` relationship. Other inventory
relationship types retain their meanings. Shared membership, territorial
association and historical succession do not create chamber nesting.

Invert the generated `data/institutions.json` catalogue crosswalk to obtain
the reviewed institution matches for each source. Keep all matches. Treat
an umbrella match and a match to its explicit child as one display path.
Multiple incomparable matches remain shared coverage at their common
jurisdiction when one is evidenced. Cross-jurisdiction services can retain
a separately reviewed placement and be found from all associated groups.
Record venue assignments only where source evidence identifies the room.

## Catalogue projection

Generate a grouping JSON sidecar from the inventory projection, catalogue,
and a reviewed grouping input. The input records jurisdictions, mappings
from inventory IDs to jurisdiction IDs, any room records and source-level
placement exceptions, with evidence references. The sidecar carries its
own schema version and contains:

- Jurisdictions and their display-parent and search-association IDs.
- Grouping bodies with their inventory ID, jurisdiction ID and optional
  umbrella legislature ID. Room records include their owning institution ID.
- One entry per catalogue source, keyed by source ID. Each entry has a
  `placement` with a jurisdiction ID and optional institution and room IDs.
  A flat fallback has a null `placement`.
  It also carries the full set of reviewed institution IDs and a placement
  status of `reviewed` or `provisional`.

For a single exact institution match, place the source under that body. For
an umbrella and an explicit chamber match, use the chamber as the placement
and the umbrella as its ancestor. For shared or unresolved coverage, use a
reviewed jurisdiction-only placement where available. A source with no
verified jurisdiction remains visible under a flat fallback. A provisional
placement can use the current catalogue display label and reviewed geographic
mapping while its institution link is pending. An unresolved link stays empty.

Render country → jurisdiction → legislature → chamber or room as applicable.
Each source has one row. Group counts use distinct source IDs, including after
filtering. Search includes source text, localized jurisdiction labels, verified
institution aliases, territorial ancestors and explicit search associations.
A search for Canada can reveal Alberta. A search for the United Kingdom can
reveal the Isle of Man in its own group. Search associations do not change
placement. Keep existing source URLs and reveal the selected source's group
when following a direct link.

## Examples from the current data

| Source | Placement | Evidence and limits |
| --- | --- | --- |
| `canada-senate-senvu` | Canada → Senate of Canada | Exact crosswalk to `national--ca-uc01`. A national umbrella can be added when the inventory supplies the relationship. |
| `alberta-assembly-online` | Canada → Alberta → Legislative Assembly of Alberta | Exact crosswalk to `canada--alberta`. |
| `cpac-ca` | Canada → shared broadcaster source | The catalogue identifies CPAC and its national scope. The generated inventory has no exact institution crosswalk for this source. |
| `ontario-house-en`, `ontario-committee-1-en`, `ontario-committee-2-en` | Canada → Ontario → Legislative Assembly of Ontario → the applicable room, where reviewed | All three match `canada--ontario`. Keep the three source IDs. The committee feed labels alone do not establish permanent venue or committee identities. |
| `argentina-corrientes-deputies-webcasts` | Argentina → Corrientes → provincial legislature → Chamber of Deputies | Both the umbrella and chamber are crosswalk matches, and the inventory explicitly links the chamber to its umbrella. Display one source row. |
| `isle-of-man-tynwald-listen-watch` | Isle of Man → Tynwald | Exact crosswalk to `united-kingdom--isle-of-man`. The UK inventory research grouping can support a search association. The Isle of Man keeps its distinct jurisdiction ID and top-level display. |
| `jalisco-canal-parlamento` | Mexico → Jalisco with provisional institution placement | The existing catalogue names Jalisco and its Congress. The generated inventory has no exact source match. Review that crosswalk before claiming a verified institution placement. |

The Corrientes entry in the sidecar looks like this.

```json
{
  "argentina-corrientes-deputies-webcasts": {
    "placement": {
      "jurisdiction_id": "ar-w",
      "institution_id": "argentina--corrientes--organ--camara-de-diputados",
      "room_id": null
    },
    "reviewed_institution_ids": [
      "argentina--corrientes",
      "argentina--corrientes--organ--camara-de-diputados"
    ],
    "placement_status": "reviewed"
  }
}
```

The grouping body record carries the chamber's umbrella ID. The source entry
only needs the deepest reviewed placement and the original crosswalk matches.

## Migration and validation

1. Establish the jurisdiction register and review its ID mappings against the
   existing catalogue labels, inventory jurisdictions and search associations.
   Resolve same-name regions by ID. Review territories and their relationships
   individually, including Crown Dependencies, overseas territories and
   constituent countries.
2. Build the sidecar from the existing inventory projection so reviewed
   crosswalk precedence stays in one place. In the current data, 184 of 185
   subnational sources have a generated match. Six match both a chamber and
   its umbrella. Check that the generator emits exactly one placement for
   each source and reports missing or ambiguous evidence for review.
3. Add schema and generated-data checks before enabling grouped rows. Validate
   unique stable IDs, existing references, acyclic territorial and display
   ancestry, eligible inventory links, chamber-to-umbrella consistency, room
   ownership and full catalogue source coverage. Check that the flat and
   grouped views expose the same source IDs. Validate reference existence for
   search associations separately from display ancestry.
4. Adopt the sidecar for catalogue grouping and parent-country search. Keep
   the flat view available if grouping data is unavailable. Replace the
   catalogue's label-based parent lookup after parity checks for aliases,
   territories, filters, direct links and localized search. The map can adopt
   reviewed geometry references in a separate change.

Automated checks can establish consistency between records. Reviewers still
need official evidence for territorial status, exact institution coverage,
shared broadcaster scope and durable room assignments. Keep those questions
in the inventory or review evidence, and keep playback and EPG admission tied
to their existing source-specific checks.

## Maintaining the grouping data

Edit `data/discovery/catalogue-grouping.json` to add or update stable jurisdiction
IDs, inventory mappings, source exceptions or evidence-backed rooms. The initial
register carries forward the existing catalogue jurisdiction labels and search
associations. Exact source-to-institution links come from the inventory crosswalk.
Run `make site-data` to regenerate the inventory and grouping products in order.
CI and Pages check the generated output against the maintained inputs and the
grouping schema. A new exact crosswalk needs a jurisdiction mapping for its legislature. A
chamber can inherit that mapping through its reviewed umbrella relationship. A new
unmatched source can appear provisionally in a known jurisdiction or in the
flat fallback until its placement is reviewed.

The catalogue starts with expanded groups. Each group can be collapsed on
desktop and mobile. Search expands matching groups and clearing the query
restores the previous expansion state. Selecting a column sorts the flat
list. **Group by jurisdiction** restores the grouped view with the current search
and filters. A single source can carry its institution label in the row itself
to keep groups compact.
