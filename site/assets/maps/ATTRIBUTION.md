# Map data

Country boundaries in `countries-110m.geojson` are derived from Natural Earth's
1:110m Admin 0 Countries dataset. The documented subdivision boundaries in
`documented-admin1.geojson` are extracted from Natural Earth's 1:10m Admin 1
States and Provinces dataset. Natural Earth data is in the public domain.
Exceptions below include current official Swiss geometry for Bern and attributed county aggregation for Daegu and Gyeongsangbuk.

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

## Bern canton — ©swisstopo

Bern (CH-BE) uses the Federal Office of Topography swisstopo's
[swissBOUNDARIES3D cantonal boundaries](https://www.swisstopo.admin.ch/en/landscape-model-swissboundaries3d),
data status 1 January 2026. This accounts for Moutier's transfer to Jura and
avoids using the older Natural Earth canton outline. The layer is
`ch.swisstopo.swissboundaries3d-kanton-flaeche.fill`, feature 2, retrieved via
the public geo.admin.ch Find API in EPSG:4326, with coordinates rounded to six
decimals. The boundary is bundled locally, without a runtime API dependency.

Source: **©swisstopo**. The [OGD terms](https://www.swisstopo.admin.ch/en/terms-of-use-free-geodata-and-geoservices)
permit use, processing and redistribution with source attribution, also shown
in the map footer. Retrieval metadata is retained in
`reports/discovery/2026-10-22-bern-promotion.json`.

The Dutch provincial additions are Drenthe (NL-DR), Limburg (NL-LI, Netherlands,
not Belgium), and Noord-Brabant (NL-NB), from the same public-domain Natural
Earth Admin 1 dataset. Coordinates are rounded to six decimals.

Guam, Puerto Rico and Gibraltar also use public-domain Natural Earth Admin 1
outlines (GUM, PRI and GIB source groups), rounded to six decimals. Guam and
Gibraltar supplement the coarser overview, which omits them. Their separate
GU/PR/GI map parents and US/GB search associations are navigation choices, not
changes to territorial or constitutional status.

Cayman Islands and Turks and Caicos Islands use the Natural Earth Admin 1 CYM
and TCA groups, respectively. All TCA island components are combined into one
territorial outline. They also supplement the coarse overview where absent.
Separate KY/TC map parents and UK search associations preserve their territorial
identity; coordinates are rounded to six decimals.

Bermuda combines all eleven Natural Earth Admin 1 BMU components, with its
separate BM map parent and UK search association. It supplements the overview
where absent; coordinates are rounded to six decimals.

Cook Islands (COK) and Guernsey (GGY) overview geometry uses public-domain
Natural Earth Admin 1, rounded to six decimals. Cook Islands combines all 11
source features as national CK coverage, reflecting its self-governing status in
free association with New Zealand; NZ is only a search association. The coarse
GGY aggregate is misleadingly labelled Sark in the source: its three polygon
components are Guernsey, Sark and Alderney. GG retains that territorial overview;
the documented Guernsey regional outline selects only the western main-island
component (longitude west of -2.5), excluding Sark and Alderney. Small outlying
islets are below this generalised geometry's resolution. This viewing record
does not claim their separate legislatures, broadcasts or territorial authority.

Full-queue additions (23 October 2026) use public-domain Natural Earth Admin 1
outlines, rounded to six decimals: Tyrol AT-7, Appenzell Ausserrhoden CH-AR,
Brussels BE-BRU and the five Belgian provinces whose source region is Walloon.
The Wallonia aggregate includes the German-speaking area as part of the regional
territory; it is not a map of the French Community. VGB and MSR component groups
provide British Virgin Islands and Montserrat regional/overview outlines. Their
VG/MS map parents and separate GB search associations preserve territorial status.
CPV components supplement the coarse overview for Cabo Verde's national source.
These additions do not change the previously corrected current Bern boundary.

The later 23 October follow-up adds public-domain Natural Earth Admin1 geometry
for Neuquén (AR-Q) and West Virginia (US-WV). Sicily aggregates all nine Italian
province features carrying region code IT-82 into one regional MultiPolygon;
provincial components are not presented as separate catalogue legislatures.
Coordinates are rounded to six decimal places.

The Corrientes follow-up adds the public-domain Natural Earth Admin1 province
feature AR-W, checked by its Corrientes name. This is the Argentine provincial
legislature’s jurisdiction, not a municipality. Coordinates rounded to six decimals.

The October 23 completion follow-up adds Natural Earth public-domain Admin1 features
CO-ARA (Arauca), CO-CAQ (Caquetá), and CO-RIS (Risaralda). Polygon features are
normalized to MultiPolygon and coordinates rounded to six decimals.

North Kalimantan uses the 2019-represented Kalimantan Utara feature
`30024224B24146714486683` from [geoBoundaries gbHumanitarian IDN ADM1](https://www.geoboundaries.org/api/current/gbHumanitarian/IDN/ADM1/),
[OCHA ROAP / HDX administrative boundaries](https://data.humdata.org/dataset/cod-ab-idn),
under [CC BY 3.0 IGO](https://creativecommons.org/licenses/by/3.0/igo/).
The source simplified geometry is rounded to six decimals; its historical data
vintage is retained here rather than claiming a newly surveyed 2026 boundary.
Natural Earth’s older combined East Kalimantan feature was not used for this province.

Chubut (AR-U), added 23 October 2026, uses the public-domain Natural Earth Admin1 feature. Polygon normalized to MultiPolygon and coordinates rounded to six decimals.

Łódź Voivodeship, added 23 October 2026, uses the public-domain Natural Earth Admin1 feature labelled PL-LD (current ISO PL-10). Polygon normalized to MultiPolygon and coordinates rounded to six decimals.

Silesian Voivodeship, added 23 October 2026, uses public-domain Natural Earth Admin1 feature PL-SL (current ISO PL-24). Geometry normalized to MultiPolygon and coordinates rounded to six decimals.

## Daegu and Gyeongsangbuk — geoBoundaries, CC BY 3.0

The 23 October 2026 additions aggregate [geoBoundaries KOR ADM2](https://github.com/wmgeolab/geoBoundaries/blob/9469f09/releaseData/gbOpen/KOR/ADM2/geoBoundaries-KOR-ADM2.geojson), ID KOR-ADM2-91817680, source year 2020, attributed to geoBoundaries and citypopulation.de under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). County membership is checked against the councils' district lists. Whole Gunwi county is assigned to Daegu under [Act 19155](https://www.law.go.kr/LSW/lsRvsDocListP.do?chrClsCd=010202&lsId=014378&lsRvsGubun=all), effective 1 July 2023: Daegu has nine districts/counties, Gyeongsangbuk 22. Changes: aggregate polygons, update Gunwi membership, normalize winding and round coordinates to six decimals. This reconstruction is a navigation outline, not a new cadastral survey. Source count discrepancy (228 downloaded features versus 229 advertised) and generalized-boundary limitations are retained in the reconstruction report. Incheon uses public-domain Natural Earth KR-28, normalized and rounded without a legislative-boundary reconstruction claim.

Busan, Chungcheongnam-do and Jeonbuk State, added 23 October 2026, use public-domain Natural Earth Admin1 KR-26, KR-44 and KR-45 respectively. Normalize to MultiPolygon and round coordinates to six decimals. Current province naming does not imply a new cadastral survey.

Jeonnam–Gwangju Integrated Special City, added 23 October 2026, dissolves public-domain Natural Earth KR-29 and KR-46 into a single successor navigation feature under the enacted 2026 special-city framework. Coordinates rounded to six decimals and spherical winding checked. Older geometry is not represented as a new cadastral survey. No predecessor regional flag is substituted for the successor: it uses the standard legislature mark pending a verified current flag.

Gyeongsangnam-do and Sejong, added 23 October 2026, use public-domain Natural Earth Admin1 KR-48 and KR-50. Normalize to MultiPolygon and round coordinates to six decimals. Generalized navigation outlines do not claim current cadastral survey accuracy.

The eleven Argentine additions of23October2026 use public-domain Natural Earth Admin1 AR-B, AR-K, AR-C, AR-F, AR-M, AR-R, AR-A, AR-J, AR-Z, AR-V, AR-T. Buenos Aires Province and Buenos Aires City retain separate outlines and legislature/chamber identities. Normalize to MultiPolygon, round to six decimals and check spherical winding/representative points. Tierra del Fuego retains the source administered island outline without importing additional claimed-area geometry.

The nine Brazilian state assembly additions of 23 October 2026 use public-domain Natural Earth Admin1 BR-MS, BR-PB, BR-GO, BR-MT, BR-PE, BR-RO, BR-CE, BR-PR, BR-RJ. Normalize to MultiPolygon, round to six decimals, and verify spherical winding and representative-point containment.

Caldas department (CO-CAL), added23October2026, uses public-domain Natural Earth Admin1 geometry, normalized to MultiPolygon and rounded to six decimals. This is a navigation outline.

New Brunswick (CA-NB) and Åland (the Aland municipal feature collection), added 23 October 2026, use public-domain Natural Earth Admin1 geometry, normalized to MultiPolygon and rounded to six decimals. These are navigation outlines; Åland retains its autonomous Finnish relationship.

Seventeen regional recording services added 23 October 2026 use public-domain Natural Earth Admin1 outlines (DE-HE, DE-SN, ID-AC, JP-28, JP-36, ZA-NC, ZA-WC, ES-S, ES-LO, TW-PEN, TW-TNN, US-DC, US-KS, US-MS, US-WY, UY-CA, UY-MO). These are navigation outlines, not cadastral boundaries. Coordinates rounded to six decimals; spherical winding checked. La Rioja, Spain is distinct from La Rioja, Argentina.

Six Colombian departmental recording services added 23 October 2026 use public-domain Natural Earth Admin1 outlines (CO-BOL, CO-CES, CO-GUV, CO-MAG, CO-QUI, CO-TOL). These are navigation outlines, not cadastral boundaries. Coordinates rounded to six decimals; spherical winding checked. The Magdalena Bicentennial commission subject is not the separate Bolívar assembly.

Three regional recording services added 23 October 2026 use public-domain Natural Earth Admin1 outlines (ES-AV, ES-BU, ES-LE, ES-P, ES-SA, ES-SG, ES-SO, ES-VA, ES-ZA, ES-GC, ES-TF, VI-X01~, VI-X03~, VI-X02~). These are navigation outlines, not cadastral boundaries. Coordinates rounded to six decimals; spherical winding checked. Castile and León combines nine provincial outlines; Canary Islands combines its two provinces; US Virgin Islands combines three island districts.

Glarus and Jura parliamentary recording services added 23 October 2026 use public-domain Natural Earth Admin1 outlines (CH-GL, CH-JU). These are navigation outlines, not cadastral boundaries. Coordinates rounded to six decimals; spherical winding checked.

The union of Natural Earth US Virgin Islands district outlines is also used as the VI world-map context feature. The US relationship is a separate catalogue-search association, following the existing treatment of territories. This does not assert independent sovereignty or cadastral precision.

Thurgau, Zurich and Vaud recording services added24October2026 use public-domain Natural Earth Admin1 outlines CH-TG, CH-ZH and CH-VD, respectively. These are navigation outlines, not cadastral surveys; spherical winding checked separately.

Nine scoped recording services reconciled24October2026 use public-domain Natural Earth Admin1 navigation outlines: DE-TH, JP-18, JP-07, JP-03, TW-HSZ, ID-KT, ID-JT, ID-YO, ZA-FS. The Yogyakarta feature is the province, not the city; Hsinchu City is distinct from Hsinchu County. These generalized outlines are not cadastral surveys; spherical winding checked separately.

## Lienchiang / Matsu — separate ODbL dataset

The [Lienchiang navigation outline](lienchiang-odbl.geojson) is a derivative of
[geoBoundaries TWN ADM1](https://www.geoboundaries.org/api/current/gbOpen/TWN/ADM1/),
boundary ID TWN-ADM1-90331920, source year2017, attributed to geoBoundaries,
Wambacher and ©OpenStreetMap contributors. Source
[feature TW-LIE / Matsu Islands](https://github.com/wmgeolab/geoBoundaries/blob/9469f09/releaseData/gbOpen/TWN/ADM1/geoBoundaries-TWN-ADM1_simplified.geojson),
shape ID90331920B68512430020187, contains six island polygons.

The extracted dataset remains available under
[Open Database License1.0](https://opendatacommons.org/licenses/odbl/1-0/).
Changes: extract the Matsu feature, retain original source identifiers, label it
Lienchiang for catalogue navigation and normalize spherical ring winding. The
complete derivative is provided as machine-readable GeoJSON; visible map credits
link the source and licence. It is loaded separately from documented-admin1.geojson
and does not change the licences of the other datasets or application code.
The2017generalization is a navigation outline, not a current cadastral survey
or a position on territorial status.

Thirteen scoped viewing-service publications reconciled 24 October 2026 add eleven public-domain Natural Earth Admin1 navigation outlines: ES-VI (Álava), ES-BI (Bizkaia), ES-SS (Gipuzkoa), CZ-MO (Moravian-Silesian Region), CH-GE (Geneva), CH-SG (St Gallen), DE-MV (Mecklenburg-Vorpommern), IT-BZ (South Tyrol), ZA-EC (Eastern Cape), TW-KIN (Kinmen), and the union of IT-SA/IT-NA/IT-CE/IT-BN/IT-AV (Campania). Basque foral territories retain their own outlines within the Basque Country; Campania is assembled from its five provincial components. Coordinates rounded to six decimals, MultiPolygon normalized and spherical winding checked. These generalized navigation outlines are not cadastral surveys or positions on territorial status.

## 25 October 2026 continuation

Six additional generalized navigation outlines use public-domain Natural Earth
Admin 1 version 5.1.1: CH-ZG (Zug), CZ-LI (Liberec), CZ-ZL (Zlín), PT-30 (Madeira),
AR-D (San Luis) and ID-KR (Kepulauan Riau). Coordinates rounded to six decimals,
MultiPolygon normalized and spherical winding/centroids checked.

Three separately labelled Point features locate institutions without inventing
territorial outlines: French Community Parliament in Brussels, Chakma council's
Kamalanagar headquarters town and Lai council's Lawngtlai headquarters town.
They are hollow diamond locators, not administrative or linguistic boundaries.
Each feature retains its primary institutional source, coordinate source/method
and explicit English research scope note. The Indian council locations do not
shade all Mizoram or all Lawngtlai as their jurisdiction. PFWB's official Brussels
Lambert 72 building-group coordinate is transformed to WGS84; the conflicting
Commons coordinate is not used. See the dated publication and individual reports.
