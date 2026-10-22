# Map data

Country boundaries in `countries-110m.geojson` are derived from Natural Earth's
1:110m Admin 0 Countries dataset. The documented subdivision boundaries in
`documented-admin1.geojson` are extracted from Natural Earth's 1:10m Admin 1
States and Provinces dataset. Natural Earth data is in the public domain.

- Source: https://www.naturalearthdata.com/downloads/110m-cultural-vectors/
- Admin 1 source: https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/
- Terms: https://www.naturalearthdata.com/about/terms-of-use/

The map is a catalogue-navigation aid, not an authoritative statement about
political boundaries or territorial status.

The 22 October 2026 additions use the same public-domain Admin 1 source:
Nagasaki (JP-42), Córdoba **Argentina** (AR-X), Santa Catarina **Brazil**
(BR-SC), Jersey, Isle of Man, Sint Maarten, New Caledonia and French Polynesia.
The latter two retain their constituent Admin 1 polygon parts in a combined
feature. Small Jersey, Isle of Man and Sint Maarten outlines also
supplement the overview geometry, whose coarser source omits them. Map grouping
does not turn Crown Dependencies into UK subdivisions or Sint Maarten into a
province of the Netherlands.

Mauritius also supplements the overview with its Admin 1 outline components,
because the 1:110m overview omits that documented national jurisdiction. This
uses the source's Mauritius components without importing separately attributed
Chagos/BIOT geometry or deciding the territorial-status question.
