# Eligible Legislature Metadata And Stream Audit — 2026-10-23

This is the initial-screen snapshot. The [later metadata/Corrientes follow-up](2026-10-23-metadata-followup.md)
resolves 57 more institutional routes, leaves 118 missing and adds two chamber
viewing links. Its current counts supersede this snapshot where different.

[Research status](../../docs/research-status.md) · [Authority register](2026-10-23-legislative-priority.md) · [Per-body JSON](2026-10-23-eligible-metadata-stream-audit.json)

## What this pass establishes

This pass covers the **652 eligible regional and territorial bodies**. The national
audit remains separate. Each body now has a metadata reconciliation, recorded-route
results, a selected browser route, existing catalogue evidence and explicit follow-up
actions. The country inventory is not a count of all chambers or every possible service.

**This is an initial evidence and gap pass, not comprehensive metadata or playback
certification.** Automated page success, extracted links, document language and advancing
video/audio cannot establish the correct provider, broadcast language, exact proceedings
or permission to publish. No new catalogue service has been approved in this pass.

## Coverage and remaining work

- HTTP collection: 2185/2185 recorded URLs; complete: True.
- Normal Chromium selected-route screens: 652/652; complete: True.
- Existing catalogue coverage: 62 bodies / 81 source records; 590 bodies have no matched catalogue service.
- 22 missing institutional URLs filled after individual primary-page review; 175 still missing.
- Every body retains full-service, current-live and chamber/committee validation gaps.
- No failure is treated as proof that an institution has no broadcast.
- Earlier playback evidence remains dated and service-specific; it does not certify current live availability.

Evidence: [HTTP responses](../health/2026-10-23-eligible-route-audit.json),
[browser screens](../health/2026-10-23-eligible-browser-audit.json), and
[individual metadata corrections / wrong-level leads](2026-10-23-eligible-metadata-corrections.json).

## Individual proceedings checks

Corrientes’ provincial Chamber of Deputies links its exact provider channel and
recordings for the 14 October and 23 September 2026 sittings. Both recordings
played after the 30-minute mark in **Chromium and WebKit**. Screenshots show
actual chamber business, institutional branding and an interpreter inset.
This is the provincial lower chamber, not the municipal council. Institutional
identifier, source conditions, broadcast/audio language, Senate/committee
coverage and current-live validation remain open; no catalogue entry was added.

Jambi’s official gallery embeds a playable **159-second JambiTV news clip** about
the 2024–2029 inauguration. It is not a full sitting or a current-live service.
An initial seek beyond that clip’s duration was inconclusive; the valid 60-second
WebKit check succeeds. Neither the clip nor a national DPR visitor hearing
establishes Jambi’s own full proceedings service.

[Exact sample URLs, decoded-frame evidence and decisions](../health/2026-10-23-eligible-deep-playback.json).
The seven broad-screen media signals were also individually reviewed; they
include decorative media, general programming, radio and unverified event pages.
They do not create seven verified proceedings services.

## Follow-up priorities

1. Correct identity and institutional URL gaps; reject municipal, regency and national visitor-hearing false matches.
2. Review institution-to-provider designation and one dated proceeding for each promising service, with screenshots and actual decoded playback beyond the opening.
3. Complete institutional identifiers, broadcast languages, current activity and source-specific publication conditions.
4. Enumerate all chambers and committee rooms, archives, audio and alternate-language routes.
5. Record official schedule sources and media accessibility; implement EPG only when the source/event mapping is sound.

## Gap counts

These overlap: one body normally has several unresolved fields.

| Gap | Bodies |
| --- | ---: |
| `broadcast_language_not_recorded` | 590 |
| `complete_chamber_committee_inventory_unverified` | 652 |
| `current_live_and_full_service_playback_unverified` | 652 |
| `elected_council_activity_not_confirmed` | 9 |
| `institution_identifier_not_reconciled` | 590 |
| `institutional_url_access_needs_followup` | 145 |
| `institutional_url_missing` | 175 |
| `media_accessibility_incomplete` | 652 |
| `national_visitor_hearing_lead` | 3 |
| `no_html_route_retrieved_in_http_pass` | 177 |
| `official_service_not_in_catalogue` | 590 |
| `publication_conditions_need_review` | 629 |
| `schedule_source_not_recorded_in_catalogue` | 590 |
| `wrong_level_media_lead_present` | 4 |

## Individual primary-page metadata corrections

Only the institutional route was reconciled; this is not playback validation.

| Body | Institutional page |
| --- | --- |
| `indonesia--jambi` | [DPRD Provinsi Jambi  /  DPRD-JAMBIPROV.GO.ID](https://dprd-jambiprov.go.id/) |
| `indonesia--kalimantan-tengah` | [DPRD Provinsi Kalimantan Tengah - Bersama Membangun Kalteng](https://dprd.kalteng.go.id/) |
| `argentina--la-rioja` | [Legislatura de la provincia de La Rioja](https://legislaturalarioja.gob.ar/) |
| `colombia--atlantico` | [Inicio · Asamblea Departamental del Atlántico](https://asamblea-atlantico.gov.co/) |
| `colombia--cesar` | [Inicio  /  Asamblea Departamental del Cesar](https://asambleacesar.gov.co/) |
| `colombia--cordoba` | [Asamblea de Córdoba – Asamblea de Córdoba Herramientas de accesibilidad Aumentar texto Disminuir texto Escala ](https://asamblea-cordoba.gov.co/) |
| `indonesia--banten` | [Beranda - DPRD Provinsi Banten](https://dprd-bantenprov.go.id/) |
| `indonesia--gorontalo` | [Deprov Gorontalo - Media Parlemen](https://dprd.gorontaloprov.go.id/) |
| `indonesia--jawa-tengah` | [DPRD Jateng – Portal Resmi DPRD Provinsi Jawa Tengah Facebook X YouTube Instagram Expand Expand Expand Expand ](https://dprd.jatengprov.go.id/) |
| `indonesia--jawa-timur` | [Website Resmi DPRD Jawa Timur](https://dprd.jatimprov.go.id/) |
| `indonesia--kalimantan-timur` | [Selamat Datang - Website DPRD Provinsi Kalimantan Timur](https://dprd.kaltimprov.go.id/) |
| `indonesia--papua` | [DEWAN PERWAKILAN RAKYAT PROVINSI PAPUA](https://dpr.papua.go.id/home) |
| `indonesia--papua-tengah` | [Website Resmi - DPR Papua Tengah](https://dprpapuatengah.go.id/) |
| `philippines--cagayan` | [Sangguniang Panlalawigan ng Cagayan  /  Official Website](https://sp.cagayan.gov.ph/) |
| `philippines--bataan` | [Sangguniang Panlalawigan - Bataan.gov.ph](https://bataan.gov.ph/departments/sangguniang-panlalawigan/) |
| `philippines--davao-occidental` | [Government-Legislative - PROVINCIAL GOVERNMENT OF DAVAO OCCIDENTAL](https://davaooccidental.gov.ph/government-legislative/) |
| `philippines--davao-del-sur` | [SP-LEGISLATIVE - Provincial Government of Davao del Sur](https://davaodelsur.gov.ph/sp-legislative/) |
| `philippines--cavite` | [Office of the Sangguniang Panlalawigan - Provincial Government of Cavite Facebook Expand Toggle Menu Scroll to](https://cavite.gov.ph/provincial-offices/office-of-the-sangguniang-panlalawigan/) |
| `philippines--cotabato` | [Vice-Governor and Sangguniang Panlalawigan – Province of Cotabato](https://cotabatoprov.gov.ph/directory-of-offices/vice-governor-and-sangguniang-panlalawigan/) |
| `philippines--la-union` | [Sangguniang Panlalawigan - Provincial Government of La Union](https://launion.gov.ph/department/sangguniang-panlalawigan/) |
| `argentina--cordoba` | [HOME - Legislatura de la Provincia de Córdoba iconos home iconos home iconos home iconos home iconos home icon](https://legislaturacba.gob.ar/) |
| `argentina--corrientes` | [Sesiones en vivo – Honorable Cámara de Diputados de la Provincia de Corrientes](https://hcdcorrientes.gov.ar/sesiones/sesiones-en-vivo/) |

## Wrong-level leads

These remain documented for provenance and must not be mistaken for the eligible body.

- `argentina--corrientes`: [https://concejocorrientes.gob.ar/](https://concejocorrientes.gob.ar/) — Corrientes capital municipal council is not the provincial Chamber of Deputies. The provincial lead hcdcorrientes.gov.ar remains separate.
- `indonesia--aceh`: [https://dprd.acehbesarkab.go.id/](https://dprd.acehbesarkab.go.id/) — Aceh Besar regency DPRD is not the Aceh provincial DPRA.
- `indonesia--gorontalo`: [https://dprd.gorontalokota.go.id/](https://dprd.gorontalokota.go.id/) — Gorontalo city DPRD is not the provincial DPRD at dprd.gorontaloprov.go.id.
- `philippines--batangas`: [https://sb.taysan.gov.ph/](https://sb.taysan.gov.ph/) — Taysan municipal Sangguniang Bayan is not the Batangas provincial Sangguniang Panlalawigan.

## All 652 body records

The full JSON contains the field-level gaps, source URLs and next action for each row.
“Existing” means catalogue coverage, not a fresh full-service validation.

### Argentina (24)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `argentina--buenos-aires` — Legislatura Buenos Aires | [page](https://www.hcdiputados-ba.gov.ar/) | provider or frame leads only | not catalogued | 8 |
| `argentina--catamarca` — Legislatura Catamarca | **missing** | no player signal on selected page | not catalogued | 9 |
| `argentina--chaco` — Legislatura Chaco | **missing** | access or challenge | not catalogued | 9 |
| `argentina--chubut` — Legislatura Chubut | **missing** | access or challenge | not catalogued | 10 |
| `argentina--ciudad-autonoma-de-buenos-aires` — Legislatura Ciudad Autónoma de Buenos Aires | **missing** | provider or frame leads only | not catalogued | 9 |
| `argentina--cordoba` — Legislatura Córdoba | [page](https://legislaturacba.gob.ar/) | provider or frame leads only | existing | 4 |
| `argentina--corrientes` — Legislatura Corrientes | [page](https://hcdcorrientes.gov.ar/sesiones/sesiones-en-vivo/) | provider or frame leads only | not catalogued | 9 |
| `argentina--entre-rios` — Legislatura Entre Ríos | **missing** | advancing media identity and proceedings unverified | not catalogued | 9 |
| `argentina--formosa` — Legislatura Formosa | **missing** | provider or frame leads only | not catalogued | 9 |
| `argentina--jujuy` — Legislatura Jujuy | [page](https://www.legislaturajujuy.gov.ar/) | browser inspection error | not catalogued | 9 |
| `argentina--la-pampa` — Legislatura La Pampa | **missing** | access or challenge | not catalogued | 9 |
| `argentina--la-rioja` — Legislatura La Rioja | [page](https://legislaturalarioja.gob.ar/) | provider or frame leads only | not catalogued | 8 |
| `argentina--mendoza` — Legislatura Mendoza | **missing** | access or challenge | not catalogued | 10 |
| `argentina--misiones` — Legislatura Misiones | **missing** | media element without advancing signal | not catalogued | 9 |
| `argentina--neuquen` — Legislatura Neuquén | [page](https://legislaturaneuquen.gob.ar/) | provider or frame leads only | existing | 4 |
| `argentina--rio-negro` — Legislatura Rio Negro | **missing** | media element without advancing signal | not catalogued | 9 |
| `argentina--salta` — Legislatura Salta | **missing** | provider or frame leads only | not catalogued | 9 |
| `argentina--san-juan` — Legislatura San Juan | **missing** | provider or frame leads only | not catalogued | 9 |
| `argentina--san-luis` — Legislatura San Luis | **missing** | provider or frame leads only | not catalogued | 9 |
| `argentina--santa-cruz` — Legislatura Santa Cruz | **missing** | provider or frame leads only | not catalogued | 9 |
| `argentina--santa-fe` — Legislatura Santa Fe | [page](https://diputadossantafe.gov.ar/web/) | provider or frame leads only | not catalogued | 8 |
| `argentina--santiago-del-estero` — Legislatura Santiago del Estero | **missing** | provider or frame leads only | not catalogued | 9 |
| `argentina--tierra-del-fuego` — Legislatura Tierra del Fuego | **missing** | provider or frame leads only | not catalogued | 9 |
| `argentina--tucuman` — Legislatura Tucumán | **missing** | provider or frame leads only | not catalogued | 9 |

### Australia (8)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `australia--australian-capital-territory` — Australian Capital Territory Legislative Assembly | [page](https://www.parliament.act.gov.au/) | access or challenge | not catalogued | 10 |
| `australia--new-south-wales` — New South Wales Parliament | [page](https://www.parliament.nsw.gov.au/Pages/home.aspx) | access or challenge | existing | 4 |
| `australia--northern-territory` — Northern Territory Legislative Assembly | [page](https://parliament.nt.gov.au/) | access or challenge | not catalogued | 10 |
| `australia--queensland` — Queensland Parliament | [page](https://tv.parliament.qld.gov.au/) | provider or frame leads only | existing | 5 |
| `australia--south-australia` — South Australia Parliament | [page](http://www.parliament.sa.gov.au/) | provider or frame leads only | not catalogued | 8 |
| `australia--tasmania` — Tasmania Parliament | [page](http://www.parliament.tas.gov.au/) | access or challenge | not catalogued | 10 |
| `australia--victoria` — Victoria Parliament | [page](http://www.parliament.vic.gov.au/) | provider or frame leads only | existing | 3 |
| `australia--western-australia` — Western Australia Parliament | [page](http://www.parliament.wa.gov.au/) | media element without advancing signal | existing | 5 |

### Austria (9)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `austria--karntner-landtag` — Kärntner Landtag | [page](https://www.ktn.gv.at/Politik/Landtag) | browser inspection error | not catalogued | 10 |
| `austria--landtag-burgenland` — Landtag Burgenland | [page](https://www.bgld-landtag.at/) | provider or frame leads only | not catalogued | 8 |
| `austria--landtag-steiermark` — Landtag Steiermark | [page](https://www.landtag.steiermark.at/) | provider or frame leads only | not catalogued | 8 |
| `austria--niederosterreichische-landtag` — Niederösterreichische Landtag | [page](https://noe-landtag.gv.at/) | no player signal on selected page | not catalogued | 8 |
| `austria--oberosterreichischer-landtag` — Oberösterreichischer Landtag | [page](https://www.ooe-landtag.at/) | no player signal on selected page | not catalogued | 8 |
| `austria--salzburger-landtag` — Salzburger Landtag | [page](https://www.salzburg.gv.at/pol/landtag) | provider or frame leads only | not catalogued | 8 |
| `austria--tiroler-landtag` — Tiroler Landtag | [page](https://www.tirol.gv.at/landtag/) | provider or frame leads only | existing | 4 |
| `austria--vorarlberger-landtag` — Vorarlberger Landtag | [page](https://vorarlberg.at/web/landtag) | access or challenge | not catalogued | 8 |
| `austria--wiener-landtag` — Wiener Landtag | [page](https://www.wien.gv.at/politik/landtag) | provider or frame leads only | not catalogued | 8 |

### Belgium (6)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `belgium--french-community-commission-of-brussels` — Parlement francophone bruxellois | [page](https://www.parlementfrancophone.brussels/) | provider or frame leads only | not catalogued | 9 |
| `belgium--parlament-der-deutschsprachigen-gemeinschaft` — Parlament der Deutschsprachigen Gemeinschaft | [page](https://pdg.be/) | access or challenge | not catalogued | 10 |
| `belgium--parlement-bruxellois-brussels-parlement` — Parlement bruxellois · Brussels Parlement | [page](https://www.parlement.brussels/) | provider or frame leads only | existing | 4 |
| `belgium--parlement-de-la-federation-wallonie-bruxelles` — Parlement de la Fédération Wallonie-Bruxelles | [page](https://www.pfwb.be/) | provider or frame leads only | not catalogued | 8 |
| `belgium--parlement-de-wallonie` — Parlement de Wallonie | [page](https://www.parlement-wallonie.be/) | provider or frame leads only | existing | 3 |
| `belgium--vlaams-parlement` — Vlaams Parlement | [page](https://www.vlaamsparlement.be/nl) | access or challenge | not catalogued | 10 |

### Brazil (27)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `brazil--assembleia-legislativa-da-bahia` — Assembleia Legislativa da Bahia | [page](http://www.al.ba.gov.br) | access or challenge | not catalogued | 9 |
| `brazil--assembleia-legislativa-da-paraiba` — Assembleia Legislativa da Paraíba | [page](http://www.al.pb.leg.br) | provider or frame leads only | not catalogued | 8 |
| `brazil--assembleia-legislativa-de-alagoas` — Assembleia Legislativa de Alagoas | [page](http://www.al.al.leg.br) | provider or frame leads only | not catalogued | 9 |
| `brazil--assembleia-legislativa-de-goias` — Assembleia Legislativa de Goiás | [page](http://www.al.go.leg.br) | provider or frame leads only | not catalogued | 8 |
| `brazil--assembleia-legislativa-de-mato-grosso` — Assembleia Legislativa de Mato Grosso | [page](http://www.al.mt.gov.br) | provider or frame leads only | not catalogued | 8 |
| `brazil--assembleia-legislativa-de-mato-grosso-do-sul` — Assembleia Legislativa de Mato Grosso do Sul | [page](http://www.al.ms.gov.br) | media element without advancing signal | not catalogued | 8 |
| `brazil--assembleia-legislativa-de-minas-gerais` — Assembleia Legislativa de Minas Gerais | [page](http://www.almg.gov.br) | provider or frame leads only | not catalogued | 8 |
| `brazil--assembleia-legislativa-de-pernambuco` — Assembleia Legislativa de Pernambuco | [page](http://www.alepe.pe.gov.br) | media element without advancing signal | not catalogued | 8 |
| `brazil--assembleia-legislativa-de-rondonia` — Assembleia Legislativa de Rondônia | [page](http://www.al.ro.leg.br) | provider or frame leads only | not catalogued | 8 |
| `brazil--assembleia-legislativa-de-roraima` — Assembleia Legislativa de Roraima | [page](http://www.al.rr.leg.br) | media element without advancing signal | not catalogued | 9 |
| `brazil--assembleia-legislativa-de-santa-catarina` — Assembleia Legislativa de Santa Catarina | [page](http://www.alesc.sc.gov.br) | browser inspection error | existing | 6 |
| `brazil--assembleia-legislativa-de-sao-paulo` — Assembleia Legislativa de São Paulo | [page](http://www.al.sp.gov.br) | browser inspection error | not catalogued | 8 |
| `brazil--assembleia-legislativa-de-sergipe` — Assembleia Legislativa de Sergipe | [page](https://al.se.leg.br/) | advancing media identity and proceedings unverified | not catalogued | 8 |
| `brazil--assembleia-legislativa-do-acre` — Assembleia Legislativa do Acre | [page](http://www.al.ac.leg.br) | provider or frame leads only | not catalogued | 8 |
| `brazil--assembleia-legislativa-do-amapa` — Assembleia Legislativa do Amapá | [page](http://www.al.ap.leg.br) | provider or frame leads only | not catalogued | 9 |
| `brazil--assembleia-legislativa-do-amazonas` — Assembleia Legislativa do Amazonas | [page](http://www.aleam.gov.br) | browser inspection error | not catalogued | 10 |
| `brazil--assembleia-legislativa-do-ceara` — Assembleia Legislativa do Ceará | [page](http://www.al.ce.gov.br) | provider or frame leads only | not catalogued | 8 |
| `brazil--assembleia-legislativa-do-espirito-santo` — Assembleia Legislativa do Espírito Santo | [page](http://www.al.es.gov.br) | no player signal on selected page | not catalogued | 9 |
| `brazil--assembleia-legislativa-do-maranhao` — Assembleia Legislativa do Maranhão | [page](http://www.al.ma.leg.br) | browser inspection error | not catalogued | 10 |
| `brazil--assembleia-legislativa-do-para` — Assembleia Legislativa do Pará | [page](http://www.alepa.pa.gov.br) | media element without advancing signal | not catalogued | 8 |
| `brazil--assembleia-legislativa-do-parana` — Assembleia Legislativa do Paraná | [page](http://www.alep.pr.gov.br) | provider or frame leads only | not catalogued | 8 |
| `brazil--assembleia-legislativa-do-piaui` — Assembleia Legislativa do Piauí | [page](http://www.al.pi.leg.br) | no player signal on selected page | not catalogued | 8 |
| `brazil--assembleia-legislativa-do-rio-de-janeiro` — Assembleia Legislativa do Rio de Janeiro | [page](http://www.alerj.rj.gov.br) | provider or frame leads only | not catalogued | 8 |
| `brazil--assembleia-legislativa-do-rio-grande-do-norte` — Assembleia Legislativa do Rio Grande do Norte | [page](http://www.al.rn.gov.br) | browser navigation failed | not catalogued | 10 |
| `brazil--assembleia-legislativa-do-rio-grande-do-sul` — Assembleia Legislativa do Rio Grande do Sul | [page](http://www.al.rs.gov.br) | browser inspection error | not catalogued | 10 |
| `brazil--assembleia-legislativa-do-tocantins` — Assembleia Legislativa do Tocantins | [page](http://www.al.to.leg.br) | media element without advancing signal | not catalogued | 8 |
| `brazil--camara-legislativa-do-distrito-federal` — Câmara Legislativa do Distrito Federal | [page](http://www.cl.df.gov.br) | browser inspection error | not catalogued | 10 |

### Canada (13)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `canada--alberta` — Alberta Legislative Assembly | [page](https://www.assembly.ab.ca/) | provider or frame leads only | existing | 3 |
| `canada--british-columbia` — British Columbia Legislative Assembly | [page](http://www.leg.bc.ca) | provider or frame leads only | existing | 3 |
| `canada--manitoba` — Manitoba Legislative Assembly | [page](https://www.gov.mb.ca/legislature/) | media element without advancing signal | existing | 3 |
| `canada--new-brunswick` — New Brunswick Legislative Assembly | [page](https://www.legnb.ca/en) | provider or frame leads only | not catalogued | 8 |
| `canada--newfoundland-and-labrador` — Newfoundland and Labrador Legislative Assembly | [page](https://www.assembly.nl.ca/) | access or challenge | existing | 3 |
| `canada--northwest-territories` — Northwest Territories Legislative Assembly | [page](https://www.ntassembly.ca/) | access or challenge | existing | 4 |
| `canada--nova-scotia` — Nova Scotia Legislative Assembly | [page](https://nslegislature.ca/) | browser inspection error | not catalogued | 10 |
| `canada--nunavut` — Nunavut Legislative Assembly | [page](https://assembly.nu.ca/) | provider or frame leads only | existing | 4 |
| `canada--ontario` — Ontario Legislative Assembly | [page](https://www.ola.org/) | provider or frame leads only | existing | 4 |
| `canada--prince-edward-island` — Prince Edward Island Legislative Assembly | [page](https://www.assembly.pe.ca/index.php) | no player signal on selected page | existing | 3 |
| `canada--quebec` — Assemblée nationale du Québec | [page](http://assnat.qc.ca/en/index.html) | access or challenge | existing | 3 |
| `canada--saskatchewan` — Saskatchewan Legislative Assembly | [page](https://www.legassembly.sk.ca/) | provider or frame leads only | existing | 4 |
| `canada--yukon` — Yukon Legislative Assembly | [page](https://yukonassembly.ca/) | access or challenge | not catalogued | 10 |

### Colombia (32)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `colombia--amazonas` — Asamblea Departamental de Amazonas | **missing** | no player signal on selected page | not catalogued | 9 |
| `colombia--antioquia` — Asamblea Departamental de Antioquia | **missing** | no player signal on selected page | not catalogued | 10 |
| `colombia--arauca` — Asamblea Departamental de Arauca | **missing** | access or challenge | not catalogued | 9 |
| `colombia--atlantico` — Asamblea Departamental de Atlántico | [page](https://asamblea-atlantico.gov.co/) | provider or frame leads only | not catalogued | 8 |
| `colombia--bolivar` — Asamblea Departamental de Bolívar | **missing** | provider or frame leads only | not catalogued | 9 |
| `colombia--boyaca` — Asamblea Departamental de Boyacá | **missing** | provider or frame leads only | not catalogued | 9 |
| `colombia--caldas` — Asamblea Departamental de Caldas | **missing** | advancing media identity and proceedings unverified | not catalogued | 9 |
| `colombia--caqueta` — Asamblea Departamental de Caquetá | **missing** | no player signal on selected page | not catalogued | 10 |
| `colombia--casanare` — Asamblea Departamental de Casanare | **missing** | no player signal on selected page | not catalogued | 10 |
| `colombia--cauca` — Asamblea Departamental de Cauca | **missing** | media element without advancing signal | not catalogued | 9 |
| `colombia--cesar` — Asamblea Departamental de Cesar | [page](https://asambleacesar.gov.co/) | provider or frame leads only | not catalogued | 8 |
| `colombia--choco` — Asamblea Departamental de Chocó | **missing** | provider or frame leads only | not catalogued | 9 |
| `colombia--cordoba` — Asamblea Departamental de Córdoba | [page](https://asamblea-cordoba.gov.co/) | media element without advancing signal | not catalogued | 8 |
| `colombia--cundinamarca` — Asamblea Departamental de Cundinamarca | **missing** | access or challenge | not catalogued | 10 |
| `colombia--guainia` — Asamblea Departamental de Guainía | **missing** | no player signal on selected page | not catalogued | 9 |
| `colombia--guaviare` — Asamblea Departamental de Guaviare | **missing** | no player signal on selected page | not catalogued | 9 |
| `colombia--huila` — Asamblea Departamental de Huila | **missing** | no player signal on selected page | not catalogued | 9 |
| `colombia--la-guajira` — Asamblea Departamental de La Guajira | **missing** | no player signal on selected page | not catalogued | 10 |
| `colombia--magdalena` — Asamblea Departamental de Magdalena | **missing** | access or challenge | not catalogued | 10 |
| `colombia--meta` — Asamblea Departamental de Meta | **missing** | no player signal on selected page | not catalogued | 9 |
| `colombia--narino` — Asamblea Departamental de Nariño | **missing** | access or challenge | not catalogued | 9 |
| `colombia--norte-de-santander` — Asamblea Departamental de Norte de Santander | **missing** | no player signal on selected page | not catalogued | 9 |
| `colombia--putumayo` — Asamblea Departamental de Putumayo | **missing** | no player signal on selected page | not catalogued | 9 |
| `colombia--quindio` — Asamblea Departamental de Quindío | **missing** | no player signal on selected page | not catalogued | 10 |
| `colombia--risaralda` — Asamblea Departamental de Risaralda | **missing** | browser navigation failed | not catalogued | 10 |
| `colombia--san-andres-providencia-y-santa-catalina` — Asamblea Departamental de San Andrés, Providencia y Santa Catalina | **missing** | provider or frame leads only | not catalogued | 9 |
| `colombia--santander` — Asamblea Departamental de Santander | **missing** | provider or frame leads only | not catalogued | 9 |
| `colombia--sucre` — Asamblea Departamental de Sucre | **missing** | no player signal on selected page | not catalogued | 10 |
| `colombia--tolima` — Asamblea Departamental de Tolima | **missing** | no player signal on selected page | not catalogued | 10 |
| `colombia--valle-del-cauca` — Asamblea Departamental de Valle del Cauca | **missing** | no player signal on selected page | not catalogued | 10 |
| `colombia--vaupes` — Asamblea Departamental de Vaupés | **missing** | no player signal on selected page | not catalogued | 10 |
| `colombia--vichada` — Asamblea Departamental de Vichada | **missing** | no player signal on selected page | not catalogued | 10 |

### Cyprus (1)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `cyprus--northern-cyprus-de-facto` — Cumhuriyet Meclisi | [page](https://cm.gov.ct.tr/) | browser inspection error | not catalogued | 10 |

### Czech Republic (14)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `czech-republic--jihocesky-kraj` — Zastupitelstvo Jihočeský kraj | [page](https://kraj-jihocesky.cz/) | advancing media identity and proceedings unverified | not catalogued | 8 |
| `czech-republic--jihomoravsky-kraj` — Zastupitelstvo Jihomoravský kraj | [page](https://kr-jihomoravsky.cz/) | provider or frame leads only | not catalogued | 9 |
| `czech-republic--karlovarsky-kraj` — Zastupitelstvo Karlovarský kraj | [page](https://kr-karlovarsky.cz/) | provider or frame leads only | not catalogued | 8 |
| `czech-republic--kralovehradecky-kraj` — Zastupitelstvo Královéhradecký kraj | [page](https://kr-kralovehradecky.cz/) | browser inspection error | not catalogued | 10 |
| `czech-republic--liberecky-kraj` — Zastupitelstvo Liberecký kraj | [page](https://kraj-lbc.cz/) | provider or frame leads only | not catalogued | 8 |
| `czech-republic--moravskoslezsky-kraj` — Zastupitelstvo Moravskoslezský kraj | [page](https://kraj-moravskoslezsky.cz/) | browser navigation failed | not catalogued | 9 |
| `czech-republic--olomoucky-kraj` — Zastupitelstvo Olomoucký kraj | [page](https://kr-olomoucky.cz/) | browser inspection error | not catalogued | 10 |
| `czech-republic--pardubicky-kraj` — Zastupitelstvo Pardubický kraj | [page](https://pardubickykraj.cz/) | browser navigation failed | not catalogued | 9 |
| `czech-republic--plzensky-kraj` — Zastupitelstvo Plzeňský kraj | [page](https://kr-plzensky.cz/) | browser inspection error | not catalogued | 9 |
| `czech-republic--praha` — Zastupitelstvo hlavního města Prahy | [page](https://praha-mesto.cz/) | browser navigation failed | not catalogued | 10 |
| `czech-republic--stredocesky-kraj` — Zastupitelstvo Středočeský kraj | [page](https://kr-stredocesky.cz/) | browser inspection error | not catalogued | 10 |
| `czech-republic--ustecky-kraj` — Zastupitelstvo Ústecký kraj | [page](https://kr-ustecky.cz/) | no player signal on selected page | not catalogued | 9 |
| `czech-republic--vysocina` — Zastupitelstvo Vysočina | [page](https://kr-vysocina.cz/) | browser navigation failed | not catalogued | 9 |
| `czech-republic--zlinsky-kraj` — Zastupitelstvo Zlínský kraj | [page](https://kr-zlinsky.cz/) | provider or frame leads only | not catalogued | 8 |

### Denmark (2)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `denmark--faroe-islands` — Løgtingið | [page](https://www.logting.fo/) | access or challenge | not catalogued | 10 |
| `denmark--greenland` — Inatsisartut | [page](https://ina.gl/) | provider or frame leads only | not catalogued | 8 |

### Finland (1)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `finland--alands-lagting` — Ålands Lagting | [page](https://www.lagtinget.ax/) | media element without advancing signal | not catalogued | 8 |

### France (10)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `france--french-polynesia` — Assemblée de la Polynésie française | [page](https://www.assemblee.pf/) | media element without advancing signal | existing | 4 |
| `france--martinique` — Assemblée de Martinique | [page](https://collectivitedemartinique.mq/) | browser navigation failed | not catalogued | 10 |
| `france--new-caledonia` — Congrès de la Nouvelle-Calédonie | [page](https://www.congres.nc/) | provider or frame leads only | existing | 4 |
| `france--new-caledonia-loyalty-islands-province` — Assemblée de la province des îles Loyauté | [page](https://www.province-iles.nc/) | browser inspection error | not catalogued | 10 |
| `france--new-caledonia-north-province` — Assemblée de la province Nord | [page](https://www.province-nord.nc/) | provider or frame leads only | not catalogued | 8 |
| `france--new-caledonia-south-province` — Assemblée de la province Sud | [page](https://www.province-sud.nc/) | browser inspection error | not catalogued | 10 |
| `france--saint-barthelemy` — Conseil territorial de Saint-Barthélemy | [page](https://www.comstbarth.fr/) | no player signal on selected page | not catalogued | 8 |
| `france--saint-martin` — Conseil territorial de Saint-Martin | [page](https://www.com-saint-martin.fr/) | provider or frame leads only | not catalogued | 8 |
| `france--saint-pierre-and-miquelon` — Conseil territorial de Saint-Pierre-et-Miquelon | [page](https://www.ct975.fr/) | browser navigation failed | not catalogued | 10 |
| `france--wallis-and-futuna` — Assemblée territoriale de Wallis et Futuna | [page](https://www.assembleeterritoriale.wf/) | provider or frame leads only | not catalogued | 8 |

### Germany (16)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `germany--bayerischer-landtag` — Bayerischer Landtag | [page](https://www.bayern.landtag.de/) | provider or frame leads only | existing | 3 |
| `germany--berlin` — Berlin | [page](https://www.parlament-berlin.de/) | provider or frame leads only | not catalogued | 8 |
| `germany--brandenburg` — Brandenburg | [page](https://www.landtag.brandenburg.de/) | provider or frame leads only | not catalogued | 8 |
| `germany--bremische-burgerschaft` — Bremische Bürgerschaft | [page](https://www.bremische-buergerschaft.de/?noMobile=1) | no player signal on selected page | not catalogued | 8 |
| `germany--hamburgische-burgerschaft` — Hamburgische Bürgerschaft | [page](https://www.hamburgische-buergerschaft.de/) | provider or frame leads only | not catalogued | 8 |
| `germany--hesse` — Hesse | [page](https://hessischer-landtag.de/) | media element without advancing signal | not catalogued | 8 |
| `germany--landtag-des-saarlandes` — Landtag des Saarlandes | [page](https://www.landtag-saar.de/home/) | browser inspection error | not catalogued | 10 |
| `germany--landtag-mecklenburg-vorpommern` — Landtag Mecklenburg-Vorpommern | [page](https://www.landtag-mv.de/) | media element without advancing signal | not catalogued | 8 |
| `germany--landtag-niedersachsen` — Landtag Niedersachsen | [page](https://www.landtag-niedersachsen.de/) | provider or frame leads only | not catalogued | 8 |
| `germany--landtag-rheinland-pfalz` — Landtag Rheinland-Pfalz | [page](https://landtag-rlp.de/) | provider or frame leads only | not catalogued | 8 |
| `germany--landtag-von-baden-wurttemberg` — Landtag von Baden Württemberg | [page](https://www.landtag-bw.de/) | media element without advancing signal | existing | 3 |
| `germany--north-rhine-westphalia` — North Rhine-Westphalia | [page](https://www.landtag.nrw.de/) | provider or frame leads only | existing | 3 |
| `germany--sachsischer-landtag` — Sächsischer Landtag | [page](https://www.landtag.sachsen.de/de) | provider or frame leads only | not catalogued | 8 |
| `germany--saxony-anhalt` — Saxony-Anhalt | [page](https://www.landtag.sachsen-anhalt.de/) | provider or frame leads only | not catalogued | 8 |
| `germany--schleswig-holsteinischer-landtag` — Schleswig-Holsteinischer Landtag | [page](https://www.landtag.ltsh.de/) | provider or frame leads only | not catalogued | 8 |
| `germany--thuringer-landtag` — Thüringer Landtag | [page](https://www.thueringer-landtag.de/) | provider or frame leads only | not catalogued | 8 |

### India (31)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `india--andhra-pradesh` — Andhra Pradesh Legislative Assembly | [page](http://www.aplegislature.org/) | media element without advancing signal | not catalogued | 9 |
| `india--arunachal-pradesh` — Arunachal Pradesh Legislative Assembly | [page](http://arla.neva.gov.in/) | provider or frame leads only | not catalogued | 9 |
| `india--assam` — Assam Legislative Assembly | [page](http://www.assambidhansabha.org/home) | provider or frame leads only | not catalogued | 8 |
| `india--bihar` — Bihar Legislative Assembly | [page](http://vidhansabha.bih.nic.in/) | provider or frame leads only | not catalogued | 9 |
| `india--chhattisgarh` — Chhattisgarh Legislative Assembly | [page](http://cgvidhansabha.gov.in/) | browser inspection error | not catalogued | 8 |
| `india--delhi` — Delhi Legislative Assembly | [page](https://delhiassembly.delhi.gov.in/) | browser inspection error | not catalogued | 10 |
| `india--goa` — Goa Legislative Assembly | [page](http://www.goavidhansabha.gov.in/) | media element without advancing signal | not catalogued | 8 |
| `india--gujarat` — Gujarat Legislative Assembly | [page](http://www.gujaratassembly.gov.in/) | browser navigation failed | not catalogued | 9 |
| `india--haryana` — Haryana Legislative Assembly | [page](http://haryanaassembly.gov.in/) | browser inspection error | not catalogued | 10 |
| `india--himachal-pradesh` — Himachal Pradesh Legislative Assembly | [page](https://hpvidhansabha.nic.in/) | provider or frame leads only | not catalogued | 9 |
| `india--jammu-and-kashmir` — Jammu and Kashmir Legislative Assembly | [page](https://jkla.neva.gov.in/) | provider or frame leads only | not catalogued | 8 |
| `india--jharkhand` — Jharkhand Legislative Assembly | [page](http://jharkhandvidhansabha.nic.in/) | media element without advancing signal | not catalogued | 9 |
| `india--karnataka` — Karnataka Legislative Assembly | [page](http://kla.kar.nic.in/assembly/assembly.htm) | browser inspection error | not catalogued | 10 |
| `india--kerala` — Kerala Legislative Assembly | [page](http://www.niyamasabha.org/) | provider or frame leads only | not catalogued | 8 |
| `india--madhya-pradesh` — Madhya Pradesh Legislative Assembly | [page](http://www.mpvidhansabha.nic.in/) | provider or frame leads only | not catalogued | 8 |
| `india--maharashtra` — Maharashtra Legislative Assembly | [page](http://mls.org.in/) | no player signal on selected page | not catalogued | 8 |
| `india--manipur` — Manipur Legislative Assembly | [page](https://manipurassembly.net/) | provider or frame leads only | not catalogued | 9 |
| `india--meghalaya` — Meghalaya Legislative Assembly | [page](http://megassembly.gov.in/) | browser inspection error | not catalogued | 10 |
| `india--mizoram` — Mizoram Legislative Assembly | [page](http://www.mizoramassembly.in/) | provider or frame leads only | not catalogued | 8 |
| `india--nagaland` — Nagaland Legislative Assembly | [page](https://www.nagaland.gov.in/portal/portal/StatePortal/Government/StateLegislature) | provider or frame leads only | not catalogued | 9 |
| `india--odisha` — Odisha Legislative Assembly | [page](http://odishaassembly.nic.in/) | provider or frame leads only | not catalogued | 9 |
| `india--puducherry` — Puducherry Legislative Assembly | [page](https://py.gov.in/government/mlas.html) | provider or frame leads only | not catalogued | 9 |
| `india--punjab-india` — Punjab, India Legislative Assembly | [page](http://punjabassembly.gov.in/) | browser inspection error | not catalogued | 10 |
| `india--rajasthan` — Rajasthan Legislative Assembly | [page](https://assembly.rajasthan.gov.in/) | provider or frame leads only | not catalogued | 8 |
| `india--sikkim` — Sikkim Legislative Assembly | [page](https://sikkim.gov.in/) | provider or frame leads only | not catalogued | 8 |
| `india--tamil-nadu` — Tamil Nadu Legislative Assembly | [page](http://www.assembly.tn.gov.in/) | media element without advancing signal | not catalogued | 9 |
| `india--telangana` — Telangana Legislative Assembly | [page](http://www.telanganalegislature.org.in/web/legislative-assembly/home) | media element without advancing signal | not catalogued | 8 |
| `india--tripura` — Tripura Legislative Assembly | [page](http://www.tripuraassembly.nic.in/) | browser inspection error | not catalogued | 10 |
| `india--uttar-pradesh` — Uttar Pradesh Legislative Assembly | [page](http://uplegisassembly.gov.in/index_en.html) | no player signal on selected page | not catalogued | 9 |
| `india--uttarakhand` — Uttarakhand Legislative Assembly | [page](http://ukvidhansabha.uk.gov.in/) | access or challenge | not catalogued | 10 |
| `india--west-bengal` — West Bengal Legislative Assembly | [page](http://www.wbassembly.gov.in/) | browser inspection error | not catalogued | 10 |

### Indonesia (38)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `indonesia--aceh` — Dewan Perwakilan Rakyat Aceh | **missing** | provider or frame leads only | not catalogued | 10 |
| `indonesia--bali` — Dewan Perwakilan Rakyat Daerah Provinsi Bali | **missing** | no player signal on selected page | not catalogued | 9 |
| `indonesia--banten` — Dewan Perwakilan Rakyat Daerah Provinsi Banten | [page](https://dprd-bantenprov.go.id/) | provider or frame leads only | not catalogued | 8 |
| `indonesia--bengkulu` — Dewan Perwakilan Rakyat Daerah Provinsi Bengkulu | **missing** | browser inspection error | not catalogued | 10 |
| `indonesia--di-yogyakarta` — Dewan Perwakilan Rakyat Daerah Provinsi DI Yogyakarta | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--dki-jakarta` — Dewan Perwakilan Rakyat Daerah Provinsi DKI Jakarta | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--gorontalo` — Dewan Perwakilan Rakyat Daerah Provinsi Gorontalo | [page](https://dprd.gorontaloprov.go.id/) | provider or frame leads only | not catalogued | 9 |
| `indonesia--jambi` — Dewan Perwakilan Rakyat Daerah Provinsi Jambi | [page](https://dprd-jambiprov.go.id/) | provider or frame leads only | not catalogued | 9 |
| `indonesia--jawa-barat` — Dewan Perwakilan Rakyat Daerah Provinsi Jawa Barat | **missing** | access or challenge | not catalogued | 10 |
| `indonesia--jawa-tengah` — Dewan Perwakilan Rakyat Daerah Provinsi Jawa Tengah | [page](https://dprd.jatengprov.go.id/) | no player signal on selected page | not catalogued | 8 |
| `indonesia--jawa-timur` — Dewan Perwakilan Rakyat Daerah Provinsi Jawa Timur | [page](https://dprd.jatimprov.go.id/) | provider or frame leads only | not catalogued | 8 |
| `indonesia--kalimantan-barat` — Dewan Perwakilan Rakyat Daerah Provinsi Kalimantan Barat | **missing** | access or challenge | not catalogued | 9 |
| `indonesia--kalimantan-selatan` — Dewan Perwakilan Rakyat Daerah Provinsi Kalimantan Selatan | **missing** | access or challenge | not catalogued | 10 |
| `indonesia--kalimantan-tengah` — Dewan Perwakilan Rakyat Daerah Provinsi Kalimantan Tengah | [page](https://dprd.kalteng.go.id/) | provider or frame leads only | not catalogued | 9 |
| `indonesia--kalimantan-timur` — Dewan Perwakilan Rakyat Daerah Provinsi Kalimantan Timur | [page](https://dprd.kaltimprov.go.id/) | provider or frame leads only | not catalogued | 8 |
| `indonesia--kalimantan-utara` — Dewan Perwakilan Rakyat Daerah Provinsi Kalimantan Utara | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--kepulauan-bangka-belitung` — Dewan Perwakilan Rakyat Daerah Provinsi Kepulauan Bangka Belitung | **missing** | provider or frame leads only | not catalogued | 10 |
| `indonesia--kepulauan-riau` — Dewan Perwakilan Rakyat Daerah Provinsi Kepulauan Riau | **missing** | access or challenge | not catalogued | 10 |
| `indonesia--lampung` — Dewan Perwakilan Rakyat Daerah Provinsi Lampung | **missing** | access or challenge | not catalogued | 10 |
| `indonesia--maluku` — Dewan Perwakilan Rakyat Daerah Provinsi Maluku | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--maluku-utara` — Dewan Perwakilan Rakyat Daerah Provinsi Maluku Utara | **missing** | access or challenge | not catalogued | 9 |
| `indonesia--nusa-tenggara-barat` — Dewan Perwakilan Rakyat Daerah Provinsi Nusa Tenggara Barat | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--nusa-tenggara-timur` — Dewan Perwakilan Rakyat Daerah Provinsi Nusa Tenggara Timur | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--papua` — Dewan Perwakilan Rakyat Papua | [page](https://dpr.papua.go.id/home) | retrieved on retry playback not tested | not catalogued | 8 |
| `indonesia--papua-barat` — Dewan Perwakilan Rakyat Papua Barat | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--papua-barat-daya` — Dewan Perwakilan Rakyat Papua Barat Daya | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--papua-pegunungan` — Dewan Perwakilan Rakyat Papua Pegunungan | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--papua-selatan` — Dewan Perwakilan Rakyat Papua Selatan | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--papua-tengah` — Dewan Perwakilan Rakyat Papua Tengah | [page](https://dprpapuatengah.go.id/) | provider or frame leads only | not catalogued | 8 |
| `indonesia--riau` — Dewan Perwakilan Rakyat Daerah Provinsi Riau | **missing** | browser inspection error | not catalogued | 10 |
| `indonesia--sulawesi-barat` — Dewan Perwakilan Rakyat Daerah Provinsi Sulawesi Barat | **missing** | browser navigation failed | not catalogued | 10 |
| `indonesia--sulawesi-selatan` — Dewan Perwakilan Rakyat Daerah Provinsi Sulawesi Selatan | **missing** | browser navigation failed | not catalogued | 10 |
| `indonesia--sulawesi-tengah` — Dewan Perwakilan Rakyat Daerah Provinsi Sulawesi Tengah | **missing** | browser navigation failed | not catalogued | 10 |
| `indonesia--sulawesi-tenggara` — Dewan Perwakilan Rakyat Daerah Provinsi Sulawesi Tenggara | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--sulawesi-utara` — Dewan Perwakilan Rakyat Daerah Provinsi Sulawesi Utara | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--sumatera-barat` — Dewan Perwakilan Rakyat Daerah Provinsi Sumatera Barat | **missing** | browser navigation failed | not catalogued | 10 |
| `indonesia--sumatera-selatan` — Dewan Perwakilan Rakyat Daerah Provinsi Sumatera Selatan | **missing** | provider or frame leads only | not catalogued | 9 |
| `indonesia--sumatera-utara` — Dewan Perwakilan Rakyat Daerah Provinsi Sumatera Utara | **missing** | provider or frame leads only | not catalogued | 9 |

### Italy (22)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `italy--assemblea-legislativa-della-regione-emilia-romagna` — Assemblea legislativa della Regione Emilia-Romagna | [page](https://www.assemblea.emr.it/) | provider or frame leads only | not catalogued | 8 |
| `italy--assemblea-legislativa-della-regione-umbria` — Assemblea legislativa della Regione Umbria | [page](https://consiglio.regione.umbria.it/) | provider or frame leads only | not catalogued | 8 |
| `italy--assemblea-regionale-siciliana` — Assemblea regionale Siciliana | [page](https://www.ars.sicilia.it/) | media element without advancing signal | existing | 4 |
| `italy--consiglio-della-provincia-autonoma-di-bolzano` — Consiglio della Provincia Autonoma di Bolzano | [page](https://www.landtag-bz.org/de/home) | no player signal on selected page | not catalogued | 8 |
| `italy--consiglio-della-provincia-autonoma-di-trento` — Consiglio della Provincia Autonoma di Trento | [page](https://www.consiglio.provincia.tn.it/) | provider or frame leads only | not catalogued | 8 |
| `italy--consiglio-regionale-del-friuli-venezia-giulia` — Consiglio regionale del Friuli Venezia Giulia | [page](https://www.consiglio.regione.fvg.it/cms/home/crfvg.html;jsessionid=09D3B935A1C04E9D59CE32C2F70DDA92) | browser inspection error | not catalogued | 10 |
| `italy--consiglio-regionale-del-lazio` — Consiglio regionale del Lazio | [page](https://www.consiglio.regione.lazio.it/) | media element without advancing signal | not catalogued | 8 |
| `italy--consiglio-regionale-del-molise` — Consiglio regionale del Molise | [page](https://consiglio.regione.molise.it/) | browser navigation failed | not catalogued | 10 |
| `italy--consiglio-regionale-del-piemonte` — Consiglio regionale del Piemonte | [page](https://www.cr.piemonte.it/cms/) | browser inspection error | not catalogued | 10 |
| `italy--consiglio-regionale-del-trentino-alto-adige` — Consiglio regionale del Trentino-Alto Adige | [page](https://www.consiglio.regione.taa.it/it/) | provider or frame leads only | not catalogued | 8 |
| `italy--consiglio-regionale-del-veneto` — Consiglio regionale del Veneto | [page](https://www.consiglioveneto.it/) | access or challenge | not catalogued | 10 |
| `italy--consiglio-regionale-della-basilicata` — Consiglio regionale della Basilicata | [page](https://www.consiglio.basilicata.it/) | browser inspection error | not catalogued | 10 |
| `italy--consiglio-regionale-della-calabria` — Consiglio regionale della Calabria | [page](https://www.consiglioregionale.calabria.it/portale) | provider or frame leads only | not catalogued | 8 |
| `italy--consiglio-regionale-della-campania` — Consiglio regionale della Campania | [page](https://www.cr.campania.it/) | provider or frame leads only | not catalogued | 8 |
| `italy--consiglio-regionale-della-liguria` — Consiglio regionale della Liguria | [page](https://www.regione.liguria.it/homepage-consiglio.html) | browser inspection error | not catalogued | 10 |
| `italy--consiglio-regionale-della-lombardia` — Consiglio regionale della Lombardia | [page](https://www.consiglio.regione.lombardia.it/wps/portal/crl) | media element without advancing signal | not catalogued | 8 |
| `italy--consiglio-regionale-della-puglia` — Consiglio regionale della Puglia | [page](https://www.consiglio.puglia.it/) | provider or frame leads only | not catalogued | 8 |
| `italy--consiglio-regionale-della-sardegna` — Consiglio regionale della Sardegna | [page](https://www.consregsardegna.it/) | provider or frame leads only | not catalogued | 8 |
| `italy--consiglio-regionale-della-toscana` — Consiglio regionale della Toscana | [page](https://www.consiglio.regione.toscana.it/) | browser inspection error | not catalogued | 10 |
| `italy--consiglio-regionale-della-valle-daosta` — Consiglio regionale della Valle d’Aosta | [page](https://www.consiglio.vda.it/) | browser inspection error | not catalogued | 10 |
| `italy--consiglio-regionale-dellabruzzo` — Consiglio regionale dell’Abruzzo | [page](https://www.crabruzzo.it/) | browser inspection error | not catalogued | 10 |
| `italy--consiglio-regionale-delle-marche` — Consiglio regionale delle Marche | [page](https://www.consiglio.marche.it/) | provider or frame leads only | not catalogued | 8 |

### Japan (47)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `japan--aichi` — 愛知県議会 | [page](https://www.pref.aichi.jp/site/gikai/index.html) | no player signal on selected page | not catalogued | 8 |
| `japan--akita` — 秋田県議会 | [page](http://pref.akita.gsl-service.net/) | provider or frame leads only | not catalogued | 8 |
| `japan--aomori` — 青森県議会 | [page](http://www.pref.aomori.lg.jp/soshiki/gikai/home.html) | provider or frame leads only | not catalogued | 8 |
| `japan--chiba` — 千葉県議会 | [page](http://www.pref.chiba.lg.jp/gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--ehime` — 愛媛県議会 | [page](https://www.pref.ehime.jp/site/gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--fukui` — 福井県議会 | [page](https://www.pref.fukui.lg.jp/gikai/) | no player signal on selected page | not catalogued | 8 |
| `japan--fukuoka` — 福岡県議会 | [page](http://www.gikai.pref.fukuoka.lg.jp/) | provider or frame leads only | not catalogued | 8 |
| `japan--fukushima` — 福島県議会 | [page](http://www.pref.fukushima.lg.jp/site/gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--gifu` — 岐阜県議会 | [page](https://www.pref.gifu.lg.jp/site/gikai/) | no player signal on selected page | not catalogued | 8 |
| `japan--gunma` — 群馬県議会 | [page](http://www.pref.gunma.jp/gikai/index.html) | browser inspection error | not catalogued | 8 |
| `japan--hiroshima` — 広島県議会 | [page](http://www.pref.hiroshima.lg.jp/site/gikai/) | no player signal on selected page | not catalogued | 8 |
| `japan--hokkaido` — 北海道議会 | [page](http://www.gikai.pref.hokkaido.lg.jp/) | provider or frame leads only | not catalogued | 8 |
| `japan--hyogo` — 兵庫県議会 | [page](https://web.pref.hyogo.lg.jp/gikai/index.html) | provider or frame leads only | not catalogued | 8 |
| `japan--ibaraki` — 茨城県議会 | [page](http://www.pref.ibaraki.jp/gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--ishikawa` — 石川県議会 | [page](http://www.pref.ishikawa.lg.jp/gikai/) | no player signal on selected page | not catalogued | 8 |
| `japan--iwate` — 岩手県議会 | [page](https://www.pref.iwate.jp/gikai/index.html) | provider or frame leads only | not catalogued | 8 |
| `japan--kagawa` — 香川県議会 | [page](http://www.pref.kagawa.lg.jp/gikai/) | no player signal on selected page | not catalogued | 8 |
| `japan--kagoshima` — 鹿児島県議会 | [page](http://www.pref.kagoshima.jp/gikai/) | no player signal on selected page | not catalogued | 8 |
| `japan--kanagawa` — 神奈川県議会 | [page](http://www.pref.kanagawa.jp/cnt/gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--kochi` — 高知県議会 | [page](http://gikai.pref.kochi.lg.jp/) | provider or frame leads only | not catalogued | 8 |
| `japan--kumamoto` — 熊本県議会 | [page](http://www.pref.kumamoto.jp/gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--kyoto` — 京都府議会 | [page](http://www.pref.kyoto.jp/gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--mie` — 三重県議会 | [page](http://www.pref.mie.lg.jp/KENGIKAI/) | provider or frame leads only | not catalogued | 8 |
| `japan--miyagi` — 宮城県議会 | [page](http://www.pref.miyagi.jp/site/kengikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--miyazaki` — 宮崎県議会 | [page](http://www.pref.miyazaki.lg.jp/gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--nagano` — 長野県議会 | [page](http://www.pref.nagano.lg.jp/gikai/chosa/index.html) | provider or frame leads only | not catalogued | 8 |
| `japan--nagasaki` — 長崎県議会 | [page](https://www.pref.nagasaki.jp/gikai/) | provider or frame leads only | existing | 4 |
| `japan--nara` — 奈良県議会 | [page](http://www.pref.nara.jp/dd_aspx_menuid-1690.htm) | access or challenge | not catalogued | 10 |
| `japan--niigata` — 新潟県議会 | [page](http://www.pref.niigata.lg.jp/gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--oita` — 大分県議会 | [page](https://www.pref.oita.jp/site/gikai/) | media element without advancing signal | not catalogued | 8 |
| `japan--okayama` — 岡山県議会 | [page](http://www.pref.okayama.jp/site/gikai/index.html) | provider or frame leads only | not catalogued | 8 |
| `japan--okinawa` — 沖縄県議会 | [page](https://www.pref.okinawa.jp/kensei/gikai/index.html) | no player signal on selected page | not catalogued | 8 |
| `japan--osaka` — 大阪府議会 | [page](http://www.pref.osaka.lg.jp/gikai_giji/toppage/index.html) | provider or frame leads only | not catalogued | 8 |
| `japan--saga` — 佐賀県議会 | [page](https://www.pref.saga.lg.jp/gikai/default.html) | provider or frame leads only | not catalogued | 8 |
| `japan--saitama` — 埼玉県議会 | [page](http://www.pref.saitama.lg.jp/s-gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--shiga` — 滋賀県議会 | [page](http://www.shigaken-gikai.jp/) | provider or frame leads only | not catalogued | 8 |
| `japan--shimane` — 島根県議会 | [page](http://www.pref.shimane.lg.jp/gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--shizuoka` — 静岡県議会 | [page](https://www.pref.shizuoka.jp/kensei/kengikai/index.html) | provider or frame leads only | not catalogued | 8 |
| `japan--tochigi` — 栃木県議会 | [page](https://www.pref.tochigi.lg.jp/kengikai/index.html) | no player signal on selected page | not catalogued | 8 |
| `japan--tokushima` — 徳島県議会 | [page](https://www.pref.tokushima.lg.jp/gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--tokyo` — 東京都議会 | [page](https://www.gikai.metro.tokyo.lg.jp/) | provider or frame leads only | not catalogued | 8 |
| `japan--tottori` — 鳥取県議会 | [page](http://www.pref.tottori.lg.jp/dd.aspx?menuid=1367) | provider or frame leads only | not catalogued | 8 |
| `japan--toyama` — 富山県議会 | [page](http://www.pref.toyama.jp/sections/0100/index.html) | provider or frame leads only | not catalogued | 8 |
| `japan--wakayama` — 和歌山県議会 | [page](http://www.pref.wakayama.lg.jp/prefg/200100/www/index.html) | browser inspection error | not catalogued | 8 |
| `japan--yamagata` — 山形県議会 | [page](http://www.pref.yamagata.jp/assembly/) | no player signal on selected page | not catalogued | 8 |
| `japan--yamaguchi` — 山口県議会 | [page](https://www.pref.yamaguchi.lg.jp/site/gikai/) | provider or frame leads only | not catalogued | 8 |
| `japan--yamanashi` — 山梨県議会 | [page](http://www.pref.yamanashi.jp/gikaisom/index.html) | provider or frame leads only | not catalogued | 8 |

### Malaysia (13)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `malaysia--johor` — Dewan Undangan Negeri Johor | [page](https://www.johor.gov.my/) | media element without advancing signal | not catalogued | 8 |
| `malaysia--kedah-darulaman` — Dewan Undangan Negeri Kedah Darulaman | [page](https://mmk.kedah.gov.my/) | provider or frame leads only | not catalogued | 8 |
| `malaysia--kelantan` — Dewan Undangan Negeri Kelantan | [page](https://www.kelantan.gov.my/) | browser inspection error | not catalogued | 10 |
| `malaysia--melaka` — Dewan Undangan Negeri Melaka | [page](https://www.melaka.gov.my/en/government/main/melaka-state-legislative-assembly) | media element without advancing signal | not catalogued | 9 |
| `malaysia--negeri-sembilan` — Dewan Undangan Negeri Negeri Sembilan | [page](https://www.ns.gov.my/) | media element without advancing signal | not catalogued | 9 |
| `malaysia--pahang` — Dewan Undangan Negeri Pahang | [page](https://www.pahang.gov.my/) | provider or frame leads only | not catalogued | 8 |
| `malaysia--penang` — Dewan Undangan Negeri Penang | [page](http://dun.penang.gov.my/) | browser inspection error | not catalogued | 8 |
| `malaysia--perak` — Dewan Undangan Negeri Perak | [page](https://www.perak.gov.my/index.php/en/) | browser inspection error | not catalogued | 10 |
| `malaysia--perlis` — Dewan Undangan Negeri Perlis | [page](https://www.perlis.gov.my/) | browser inspection error | not catalogued | 10 |
| `malaysia--sabah` — Dewan Undangan Negeri Sabah | [page](https://www.sabah.gov.my/dun/ms/) | access or challenge | not catalogued | 9 |
| `malaysia--sarawak` — Dewan Undangan Negeri Sarawak | [page](https://duns.sarawak.gov.my/modules/web/index.php?lang=en) | browser inspection error | not catalogued | 10 |
| `malaysia--selangor` — Dewan Undangan Negeri Selangor | [page](http://dewan.selangor.gov.my/?lang=en) | browser inspection error | not catalogued | 9 |
| `malaysia--terengganu` — Dewan Undangan Negeri Terengganu | [page](http://dun.terengganu.gov.my/?lang=en) | access or challenge | not catalogued | 9 |

### Mauritius (1)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `mauritius--rodrigues` — Rodrigues Regional Assembly | [page](https://assembly-rra.govmu.org/) | provider or frame leads only | not catalogued | 8 |

### Moldova (2)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `moldova--gagauzia` — Adunarea Populară a Găgăuziei | [page](https://halktoplushu.md/) | provider or frame leads only | not catalogued | 8 |
| `moldova--transnistria-de-facto` — Верховный Совет | [page](https://vspmr.org/) | media element without advancing signal | not catalogued | 8 |

### Netherlands (15)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `netherlands--aruba` — Parlamento di Aruba | [page](https://www.parlamento.aw/) | provider or frame leads only | not catalogued | 8 |
| `netherlands--curacao` — Parlamento di Kòrsou | [page](https://www.parlamento.cw/) | provider or frame leads only | not catalogued | 8 |
| `netherlands--drenthe` — Provinciale Staten Drenthe | [page](http://www.provincie.drenthe.nl) | provider or frame leads only | existing | 4 |
| `netherlands--flevoland` — Provinciale Staten Flevoland | [page](https://www.flevoland.nl) | no player signal on selected page | not catalogued | 8 |
| `netherlands--fryslan` — Provinciale Staten Fryslân | [page](https://www.fryslan.frl) | provider or frame leads only | not catalogued | 8 |
| `netherlands--gelderland` — Provinciale Staten Gelderland | [page](https://www.gelderland.nl) | provider or frame leads only | not catalogued | 8 |
| `netherlands--groningen` — Provinciale Staten Groningen | [page](http://www.provinciegroningen.nl) | provider or frame leads only | not catalogued | 8 |
| `netherlands--limburg` — Provinciale Staten Limburg | [page](https://www.limburg.nl/) | provider or frame leads only | existing | 4 |
| `netherlands--noord-brabant` — Provinciale Staten Noord-Brabant | [page](http://www.brabant.nl) | provider or frame leads only | existing | 4 |
| `netherlands--noord-holland` — Provinciale Staten Noord-Holland | [page](http://www.noord-holland.nl) | provider or frame leads only | not catalogued | 8 |
| `netherlands--overijssel` — Provinciale Staten Overijssel | [page](https://www.overijssel.nl) | access or challenge | not catalogued | 8 |
| `netherlands--sint-maarten` — Parliament of Sint Maarten | [page](https://www.sxmparliament.org/) | provider or frame leads only | existing | 4 |
| `netherlands--utrecht` — Provinciale Staten Utrecht | [page](https://www.provincie-utrecht.nl) | provider or frame leads only | not catalogued | 8 |
| `netherlands--zeeland` — Provinciale Staten Zeeland | [page](https://www.zeeland.nl) | access or challenge | not catalogued | 9 |
| `netherlands--zuid-holland` — Provinciale Staten Zuid-Holland | [page](http://www.zuid-holland.nl) | provider or frame leads only | not catalogued | 8 |

### New Zealand (3)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `new-zealand--cook-islands` — Parliament of the Cook Islands | [page](https://parliament.gov.ck/) | provider or frame leads only | existing | 4 |
| `new-zealand--niue` — Niue Assembly | [page](https://www.gov.nu/) | provider or frame leads only | not catalogued | 8 |
| `new-zealand--tokelau` — General Fono | [page](https://www.tokelau.org.nz/) | provider or frame leads only | not catalogued | 10 |

### Panama (5)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `panama--embera-wounaan-comarca` — Congreso General Comarca Emberá Wounaan | **missing** | no player signal on selected page | not catalogued | 9 |
| `panama--guna-madungandi` — Congreso General Comarca Guna Madungandí | **missing** | no player signal on selected page | not catalogued | 9 |
| `panama--guna-wargandi` — Congreso General Comarca Guna Wargandi | **missing** | no player signal on selected page | not catalogued | 9 |
| `panama--guna-yala` — Congreso General Comarca Gunayala | **missing** | no player signal on selected page | not catalogued | 9 |
| `panama--ngabe-bugle-comarca` — Congreso General Comarca Ngäbe–Buglé | **missing** | no player signal on selected page | not catalogued | 9 |

### Philippines (83)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `philippines--abra` — Sangguniang Panlalawigan ng Abra | **missing** | access or challenge | not catalogued | 10 |
| `philippines--agusan-del-norte` — Sangguniang Panlalawigan ng Agusan del Norte | **missing** | access or challenge | not catalogued | 10 |
| `philippines--agusan-del-sur` — Sangguniang Panlalawigan ng Agusan del Sur | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--aklan` — Sangguniang Panlalawigan ng Aklan | **missing** | access or challenge | not catalogued | 10 |
| `philippines--albay` — Sangguniang Panlalawigan ng Albay | **missing** | access or challenge | not catalogued | 10 |
| `philippines--antique` — Sangguniang Panlalawigan ng Antique | **missing** | access or challenge | not catalogued | 10 |
| `philippines--apayao` — Sangguniang Panlalawigan ng Apayao | **missing** | access or challenge | not catalogued | 10 |
| `philippines--aurora` — Sangguniang Panlalawigan ng Aurora | **missing** | access or challenge | not catalogued | 10 |
| `philippines--bangsamoro` — Bangsamoro Parliament | [page](https://parliament.bangsamoro.gov.ph/) | provider or frame leads only | not catalogued | 8 |
| `philippines--basilan` — Sangguniang Panlalawigan ng Basilan | **missing** | access or challenge | not catalogued | 10 |
| `philippines--bataan` — Sangguniang Panlalawigan ng Bataan | [page](https://bataan.gov.ph/departments/sangguniang-panlalawigan/) | no player signal on selected page | not catalogued | 8 |
| `philippines--batanes` — Sangguniang Panlalawigan ng Batanes | **missing** | access or challenge | not catalogued | 10 |
| `philippines--batangas` — Sangguniang Panlalawigan ng Batangas | **missing** | provider or frame leads only | not catalogued | 10 |
| `philippines--benguet` — Sangguniang Panlalawigan ng Benguet | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--biliran` — Sangguniang Panlalawigan ng Biliran | **missing** | access or challenge | not catalogued | 10 |
| `philippines--bohol` — Sangguniang Panlalawigan ng Bohol | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--bukidnon` — Sangguniang Panlalawigan ng Bukidnon | **missing** | access or challenge | not catalogued | 10 |
| `philippines--bulacan` — Sangguniang Panlalawigan ng Bulacan | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--cagayan` — Sangguniang Panlalawigan ng Cagayan | [page](https://sp.cagayan.gov.ph/) | provider or frame leads only | not catalogued | 8 |
| `philippines--camarines-norte` — Sangguniang Panlalawigan ng Camarines Norte | **missing** | access or challenge | not catalogued | 10 |
| `philippines--camarines-sur` — Sangguniang Panlalawigan ng Camarines Sur | **missing** | access or challenge | not catalogued | 10 |
| `philippines--camiguin` — Sangguniang Panlalawigan ng Camiguin | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--capiz` — Sangguniang Panlalawigan ng Capiz | **missing** | access or challenge | not catalogued | 10 |
| `philippines--catanduanes` — Sangguniang Panlalawigan ng Catanduanes | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--cavite` — Sangguniang Panlalawigan ng Cavite | [page](https://cavite.gov.ph/provincial-offices/office-of-the-sangguniang-panlalawigan/) | browser navigation failed | not catalogued | 8 |
| `philippines--cebu` — Sangguniang Panlalawigan ng Cebu | **missing** | access or challenge | not catalogued | 10 |
| `philippines--cotabato` — Sangguniang Panlalawigan ng Cotabato | [page](https://cotabatoprov.gov.ph/directory-of-offices/vice-governor-and-sangguniang-panlalawigan/) | media element without advancing signal | not catalogued | 8 |
| `philippines--davao-de-oro` — Sangguniang Panlalawigan ng Davao de Oro | **missing** | access or challenge | not catalogued | 10 |
| `philippines--davao-del-norte` — Sangguniang Panlalawigan ng Davao del Norte | **missing** | access or challenge | not catalogued | 10 |
| `philippines--davao-del-sur` — Sangguniang Panlalawigan ng Davao del Sur | [page](https://davaodelsur.gov.ph/sp-legislative/) | provider or frame leads only | not catalogued | 8 |
| `philippines--davao-occidental` — Sangguniang Panlalawigan ng Davao Occidental | [page](https://davaooccidental.gov.ph/government-legislative/) | provider or frame leads only | not catalogued | 8 |
| `philippines--davao-oriental` — Sangguniang Panlalawigan ng Davao Oriental | **missing** | access or challenge | not catalogued | 10 |
| `philippines--dinagat-islands` — Sangguniang Panlalawigan ng Dinagat Islands | **missing** | access or challenge | not catalogued | 10 |
| `philippines--eastern-samar` — Sangguniang Panlalawigan ng Eastern Samar | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--guimaras` — Sangguniang Panlalawigan ng Guimaras | **missing** | access or challenge | not catalogued | 10 |
| `philippines--ifugao` — Sangguniang Panlalawigan ng Ifugao | **missing** | access or challenge | not catalogued | 10 |
| `philippines--ilocos-norte` — Sangguniang Panlalawigan ng Ilocos Norte | **missing** | access or challenge | not catalogued | 10 |
| `philippines--ilocos-sur` — Sangguniang Panlalawigan ng Ilocos Sur | **missing** | media element without advancing signal | not catalogued | 9 |
| `philippines--iloilo` — Sangguniang Panlalawigan ng Iloilo | **missing** | browser inspection error | not catalogued | 10 |
| `philippines--isabela` — Sangguniang Panlalawigan ng Isabela | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--kalinga` — Sangguniang Panlalawigan ng Kalinga | **missing** | access or challenge | not catalogued | 10 |
| `philippines--la-union` — Sangguniang Panlalawigan ng La Union | [page](https://launion.gov.ph/department/sangguniang-panlalawigan/) | provider or frame leads only | not catalogued | 8 |
| `philippines--laguna` — Sangguniang Panlalawigan ng Laguna | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--lanao-del-norte` — Sangguniang Panlalawigan ng Lanao del Norte | **missing** | access or challenge | not catalogued | 10 |
| `philippines--lanao-del-sur` — Sangguniang Panlalawigan ng Lanao del Sur | **missing** | access or challenge | not catalogued | 10 |
| `philippines--leyte` — Sangguniang Panlalawigan ng Leyte | **missing** | access or challenge | not catalogued | 10 |
| `philippines--maguindanao-del-norte` — Sangguniang Panlalawigan ng Maguindanao del Norte | **missing** | access or challenge | not catalogued | 10 |
| `philippines--maguindanao-del-sur` — Sangguniang Panlalawigan ng Maguindanao del Sur | **missing** | access or challenge | not catalogued | 10 |
| `philippines--marinduque` — Sangguniang Panlalawigan ng Marinduque | **missing** | access or challenge | not catalogued | 10 |
| `philippines--masbate` — Sangguniang Panlalawigan ng Masbate | **missing** | access or challenge | not catalogued | 10 |
| `philippines--misamis-occidental` — Sangguniang Panlalawigan ng Misamis Occidental | **missing** | access or challenge | not catalogued | 10 |
| `philippines--misamis-oriental` — Sangguniang Panlalawigan ng Misamis Oriental | **missing** | access or challenge | not catalogued | 10 |
| `philippines--mountain-province` — Sangguniang Panlalawigan ng Mountain Province | **missing** | access or challenge | not catalogued | 10 |
| `philippines--negros-occidental` — Sangguniang Panlalawigan ng Negros Occidental | **missing** | access or challenge | not catalogued | 9 |
| `philippines--negros-oriental` — Sangguniang Panlalawigan ng Negros Oriental | **missing** | access or challenge | not catalogued | 10 |
| `philippines--northern-samar` — Sangguniang Panlalawigan ng Northern Samar | **missing** | access or challenge | not catalogued | 10 |
| `philippines--nueva-ecija` — Sangguniang Panlalawigan ng Nueva Ecija | **missing** | access or challenge | not catalogued | 10 |
| `philippines--nueva-vizcaya` — Sangguniang Panlalawigan ng Nueva Vizcaya | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--occidental-mindoro` — Sangguniang Panlalawigan ng Occidental Mindoro | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--oriental-mindoro` — Sangguniang Panlalawigan ng Oriental Mindoro | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--palawan` — Sangguniang Panlalawigan ng Palawan | **missing** | access or challenge | not catalogued | 10 |
| `philippines--pampanga` — Sangguniang Panlalawigan ng Pampanga | **missing** | media element without advancing signal | not catalogued | 9 |
| `philippines--pangasinan` — Sangguniang Panlalawigan ng Pangasinan | **missing** | access or challenge | not catalogued | 10 |
| `philippines--quezon` — Sangguniang Panlalawigan ng Quezon | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--quirino` — Sangguniang Panlalawigan ng Quirino | **missing** | access or challenge | not catalogued | 10 |
| `philippines--rizal` — Sangguniang Panlalawigan ng Rizal | **missing** | access or challenge | not catalogued | 10 |
| `philippines--romblon` — Sangguniang Panlalawigan ng Romblon | **missing** | provider or frame leads only | not catalogued | 10 |
| `philippines--samar` — Sangguniang Panlalawigan ng Samar | **missing** | access or challenge | not catalogued | 10 |
| `philippines--sarangani` — Sangguniang Panlalawigan ng Sarangani | **missing** | access or challenge | not catalogued | 10 |
| `philippines--siquijor` — Sangguniang Panlalawigan ng Siquijor | **missing** | access or challenge | not catalogued | 10 |
| `philippines--sorsogon` — Sangguniang Panlalawigan ng Sorsogon | **missing** | provider or frame leads only | not catalogued | 10 |
| `philippines--south-cotabato` — Sangguniang Panlalawigan ng South Cotabato | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--southern-leyte` — Sangguniang Panlalawigan ng Southern Leyte | **missing** | access or challenge | not catalogued | 10 |
| `philippines--sultan-kudarat` — Sangguniang Panlalawigan ng Sultan Kudarat | **missing** | access or challenge | not catalogued | 10 |
| `philippines--sulu` — Sangguniang Panlalawigan ng Sulu | **missing** | access or challenge | not catalogued | 10 |
| `philippines--surigao-del-norte` — Sangguniang Panlalawigan ng Surigao del Norte | **missing** | access or challenge | not catalogued | 10 |
| `philippines--surigao-del-sur` — Sangguniang Panlalawigan ng Surigao del Sur | **missing** | access or challenge | not catalogued | 10 |
| `philippines--tarlac` — Sangguniang Panlalawigan ng Tarlac | **missing** | access or challenge | not catalogued | 10 |
| `philippines--tawi-tawi` — Sangguniang Panlalawigan ng Tawi-Tawi | **missing** | provider or frame leads only | not catalogued | 9 |
| `philippines--zambales` — Sangguniang Panlalawigan ng Zambales | **missing** | access or challenge | not catalogued | 10 |
| `philippines--zamboanga-del-norte` — Sangguniang Panlalawigan ng Zamboanga del Norte | **missing** | access or challenge | not catalogued | 10 |
| `philippines--zamboanga-del-sur` — Sangguniang Panlalawigan ng Zamboanga del Sur | **missing** | access or challenge | not catalogued | 10 |
| `philippines--zamboanga-sibugay` — Sangguniang Panlalawigan ng Zamboanga Sibugay | **missing** | access or challenge | not catalogued | 10 |

### Poland (16)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `poland--dolnoslaskie` — Sejmik Województwa Dolnośląskie | [page](https://dolnyslask.pl/) | provider or frame leads only | not catalogued | 8 |
| `poland--kujawsko-pomorskie` — Sejmik Województwa Kujawsko-Pomorskie | [page](https://kujawsko-pomorskie.pl/) | provider or frame leads only | not catalogued | 8 |
| `poland--lubelskie` — Sejmik Województwa Lubelskie | [page](https://lubelskie.pl/) | browser navigation failed | not catalogued | 9 |
| `poland--lubuskie` — Sejmik Województwa Lubuskie | [page](https://lubuskie.pl/) | media element without advancing signal | not catalogued | 10 |
| `poland--maopolskie` — Sejmik Województwa Małopolskie | [page](https://malopolska.pl/) | browser navigation failed | not catalogued | 10 |
| `poland--mazowieckie` — Sejmik Województwa Mazowieckie | [page](https://mazovia.pl/) | browser navigation failed | not catalogued | 8 |
| `poland--odzkie` — Sejmik Województwa Łódzkie | [page](https://lodzkie.pl/) | provider or frame leads only | not catalogued | 8 |
| `poland--opolskie` — Sejmik Województwa Opolskie | [page](https://opolskie.pl/) | browser inspection error | not catalogued | 10 |
| `poland--podkarpackie` — Sejmik Województwa Podkarpackie | [page](https://podkarpackie.pl/) | provider or frame leads only | not catalogued | 8 |
| `poland--podlaskie` — Sejmik Województwa Podlaskie | [page](https://wrotapodlasia.pl/) | browser navigation failed | not catalogued | 10 |
| `poland--pomorskie` — Sejmik Województwa Pomorskie | [page](https://pomorskie.eu/) | provider or frame leads only | not catalogued | 8 |
| `poland--slaskie` — Sejmik Województwa Śląskie | [page](https://slaskie.pl/) | provider or frame leads only | not catalogued | 8 |
| `poland--swietokrzyskie` — Sejmik Województwa Świętokrzyskie | [page](https://swietokrzyskie.pro/) | browser inspection error | not catalogued | 10 |
| `poland--warminsko-mazurskie` — Sejmik Województwa Warmińsko-Mazurskie | [page](https://warmia.mazury.pl/) | access or challenge | not catalogued | 8 |
| `poland--wielkopolskie` — Sejmik Województwa Wielkopolskie | [page](https://umww.pl/) | media element without advancing signal | not catalogued | 8 |
| `poland--zachodniopomorskie` — Sejmik Województwa Zachodniopomorskie | [page](https://wzp.pl/) | access or challenge | not catalogued | 8 |

### Portugal (2)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `portugal--assembleia-legislativa-da-regiao-autonoma-dos-acores` — Assembleia Legislativa da Região Autónoma dos Açores | [page](https://www.alra.pt/) | provider or frame leads only | not catalogued | 8 |
| `portugal--assembleia-legislativa-de-regiao-autonoma-da-madeira` — Assembleia Legislativa de Região Autónoma da Madeira | [page](https://www.alram.pt/pt/inicio/) | provider or frame leads only | not catalogued | 9 |

### Serbia (2)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `serbia--kosovo-separate-status-review` — Kuvendi i Kosovës | [page](https://www.kuvendikosoves.org/) | access or challenge | not catalogued | 10 |
| `serbia--vojvodina` — Assembly of the Autonomous Province of Vojvodina | [page](https://www.skupstinavojvodine.gov.rs/) | no player signal on selected page | not catalogued | 8 |

### Slovakia (8)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `slovakia--banskobystricky-kraj` — Zastupiteľstvo Banskobystrický samosprávny kraj | [page](https://bbsk.sk/) | provider or frame leads only | not catalogued | 8 |
| `slovakia--bratislavsky-kraj` — Zastupiteľstvo Bratislavský samosprávny kraj | [page](https://bratislavskykraj.sk/) | access or challenge | not catalogued | 10 |
| `slovakia--kosicky-kraj` — Zastupiteľstvo Košický samosprávny kraj | [page](https://web.vucke.sk/) | access or challenge | not catalogued | 10 |
| `slovakia--nitriansky-kraj` — Zastupiteľstvo Nitriansky samosprávny kraj | [page](https://unsk.sk/) | provider or frame leads only | not catalogued | 10 |
| `slovakia--presovsky-kraj` — Zastupiteľstvo Prešovský samosprávny kraj | [page](https://po-kraj.sk/) | provider or frame leads only | not catalogued | 8 |
| `slovakia--trenciansky-kraj` — Zastupiteľstvo Trenčiansky samosprávny kraj | [page](https://tsk.sk/) | provider or frame leads only | not catalogued | 8 |
| `slovakia--trnavsky-kraj` — Zastupiteľstvo Trnavský samosprávny kraj | [page](https://trnava-vuc.sk/) | provider or frame leads only | not catalogued | 8 |
| `slovakia--zilinsky-kraj` — Zastupiteľstvo Žilinský samosprávny kraj | [page](https://zilinskazupa.sk/) | browser inspection error | not catalogued | 10 |

### South Africa (9)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `south-africa--eastern-cape` — Eastern Cape Provincial Legislature | [page](http://www.eclegislature.gov.za/) | provider or frame leads only | not catalogued | 8 |
| `south-africa--free-state` — Free State Provincial Legislature | [page](https://fsl.gov.za/) | provider or frame leads only | not catalogued | 8 |
| `south-africa--gauteng` — Gauteng Provincial Legislature | [page](http://gpl.gov.za/) | access or challenge | not catalogued | 10 |
| `south-africa--kwazulu-natal` — KwaZulu-Natal Provincial Legislature | [page](https://kznlegislature.gov.za/) | provider or frame leads only | not catalogued | 8 |
| `south-africa--limpopo` — Limpopo Provincial Legislature | [page](http://www.limpopoleg.gov.za/home.html) | browser inspection error | not catalogued | 9 |
| `south-africa--mpumalanga` — Mpumalanga Provincial Legislature | [page](http://www.mpuleg.gov.za/) | provider or frame leads only | not catalogued | 8 |
| `south-africa--north-west` — North-West Provincial Legislature | [page](http://nwpl.co.za/) | access or challenge | not catalogued | 8 |
| `south-africa--northern-cape` — Northern Cape Provincial Legislature | [page](https://www.ncpleg.gov.za/) | provider or frame leads only | not catalogued | 8 |
| `south-africa--western-cape` — Western Cape Provincial Legislature | [page](https://www.wcpp.gov.za/) | provider or frame leads only | not catalogued | 8 |

### South Korea (16)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `south-korea--busan` — 부산광역시의회 | [page](http://english.busan.go.kr/) | provider or frame leads only | not catalogued | 9 |
| `south-korea--chungcheongbuk` — 충청북도의회 | [page](http://www.chungbuk.go.kr/wwweng/index.do) | browser navigation failed | not catalogued | 9 |
| `south-korea--chungcheongnam` — 충청남도의회 | [page](https://www.chungnam.go.kr/english.do) | provider or frame leads only | not catalogued | 8 |
| `south-korea--daegu` — 대구광역시의회 | [page](http://www.daegu.go.kr/english/index.do) | provider or frame leads only | not catalogued | 8 |
| `south-korea--daejeon` — 대전광역시의회 | [page](http://www.daejeon.go.kr/dre/index.do) | provider or frame leads only | not catalogued | 8 |
| `south-korea--gangwon` — 강원특별자치도의회 | [page](https://state.gwd.go.kr/portal) | provider or frame leads only | not catalogued | 8 |
| `south-korea--gyeonggi` — 경기도의회 | [page](http://english.gg.go.kr/) | provider or frame leads only | not catalogued | 8 |
| `south-korea--gyeongsangbuk` — 경상북도의회 | [page](https://www.gb.go.kr/Main/eng/index.html) | no player signal on selected page | not catalogued | 8 |
| `south-korea--gyeongsangnam` — 경상남도의회 | [page](http://www.gyeongnam.go.kr/english/) | browser inspection error | not catalogued | 9 |
| `south-korea--incheon` — 인천광역시의회 | [page](http://incheon.go.kr/en/index) | provider or frame leads only | not catalogued | 9 |
| `south-korea--jeju` — 제주특별자치도의회 | [page](https://www.jeju.go.kr/index.htm) | provider or frame leads only | not catalogued | 8 |
| `south-korea--jeonbuk` — 전북특별자치도의회 | [page](http://www.jeonbuk.go.kr/eng/index.jeonbuk) | provider or frame leads only | not catalogued | 8 |
| `south-korea--jeonnam-gwangju` — 전남광주통합특별시의회 (Jeonnam–Gwangju Integrated Special City Council) | [page](https://council.jeonnam-gwangju.go.kr/jngjassem/main) | provider or frame leads only | not catalogued | 8 |
| `south-korea--sejong` — 세종특별자치시의회 | [page](http://www.sejong.go.kr/eng.do) | no player signal on selected page | not catalogued | 8 |
| `south-korea--seoul` — 서울특별시의회 | [page](http://english.seoul.go.kr/?SSid=101_01) | media element without advancing signal | not catalogued | 8 |
| `south-korea--ulsan` — 울산광역시의회 | [page](http://www.ulsan.go.kr/english/index) | provider or frame leads only | not catalogued | 8 |

### Spain (17)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `spain--asamblea-de-extremadura` — Asamblea de Extremadura | [page](https://www.asambleaex.es/) | access or challenge | not catalogued | 8 |
| `spain--asamblea-de-madrid` — Asamblea de Madrid | [page](https://www.asambleamadrid.es/) | provider or frame leads only | not catalogued | 9 |
| `spain--asamblea-regional-de-murcia` — Asamblea Regional de Murcia | [page](https://www.asambleamurcia.es/) | access or challenge | not catalogued | 10 |
| `spain--cortes-de-aragon` — Cortes de Aragón | [page](https://www.cortesaragon.es/) | no player signal on selected page | not catalogued | 9 |
| `spain--cortes-de-castilla-la-mancha` — Cortes de Castilla – La Mancha | [page](https://www.cortesclm.es/) | access or challenge | not catalogued | 10 |
| `spain--cortes-de-castilla-y-leon` — Cortes de Castilla y León | [page](https://www.ccyl.es/) | provider or frame leads only | not catalogued | 8 |
| `spain--corts-valencianes` — Corts Valencianes | [page](https://www.cortsvalencianes.es/) | provider or frame leads only | existing | 3 |
| `spain--eusko-legebiltzarra-parlamento-vasco` — Eusko Legebiltzarra – Parlamento Vasco | [page](https://www.legebiltzarra.eus/portal/es/web/eusko-legebiltzarra) | browser inspection error | not catalogued | 9 |
| `spain--junta-general-del-principado-de-asturias` — Junta General del Principado de Asturias | [page](https://www.jgpa.es/) | access or challenge | not catalogued | 10 |
| `spain--parlament-de-catalunya` — Parlament de Catalunya | [page](https://www.parlament.cat/web/index.html) | provider or frame leads only | existing | 3 |
| `spain--parlament-de-les-illes-balears` — Parlament de les Illes Balears | [page](https://www.parlamentib.es/) | browser inspection error | not catalogued | 10 |
| `spain--parlamento-de-andalucia` — Parlamento de Andalucía | [page](https://www.parlamentodeandalucia.es/webdinamica/portal-web-parlamento/inicio.do) | provider or frame leads only | existing | 3 |
| `spain--parlamento-de-canarias` — Parlamento de Canarias | [page](https://www.parcan.es/) | provider or frame leads only | not catalogued | 8 |
| `spain--parlamento-de-cantabria` — Parlamento de Cantabria | [page](https://parlamento-cantabria.es/) | provider or frame leads only | not catalogued | 8 |
| `spain--parlamento-de-galicia` — Parlamento de Galicia | [page](https://www.es.parlamentodegalicia.es/) | access or challenge | not catalogued | 10 |
| `spain--parlamento-de-la-rioja` — Parlamento de La Rioja | [page](https://www.parlamento-larioja.org/) | provider or frame leads only | not catalogued | 8 |
| `spain--parlamento-de-navarra` — Parlamento de Navarra | [page](https://parlamentodenavarra.es/) | access or challenge | existing | 6 |

### Sri Lanka (9)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `sri-lanka--central` — Central Provincial Council | **missing** | no player signal on selected page | not catalogued | 10 |
| `sri-lanka--eastern` — Eastern Provincial Council | **missing** | provider or frame leads only | not catalogued | 10 |
| `sri-lanka--north-central` — North Central Provincial Council | **missing** | provider or frame leads only | not catalogued | 10 |
| `sri-lanka--north-western` — North Western Provincial Council | **missing** | no player signal on selected page | not catalogued | 10 |
| `sri-lanka--northern` — Northern Provincial Council | **missing** | provider or frame leads only | not catalogued | 10 |
| `sri-lanka--sabaragamuwa` — Sabaragamuwa Provincial Council | **missing** | browser navigation or inspection failed on retry | not catalogued | 10 |
| `sri-lanka--southern` — Southern Provincial Council | **missing** | provider or frame leads only | not catalogued | 10 |
| `sri-lanka--uva` — Uva Provincial Council | **missing** | provider or frame leads only | not catalogued | 10 |
| `sri-lanka--western` — Western Provincial Council | **missing** | browser inspection error | not catalogued | 11 |

### Suriname (10)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `suriname--brokopondo` — Districtsraad Brokopondo | **missing** | access or challenge | not catalogued | 10 |
| `suriname--commewijne` — Districtsraad Commewijne | **missing** | access or challenge | not catalogued | 10 |
| `suriname--coronie` — Districtsraad Coronie | **missing** | access or challenge | not catalogued | 10 |
| `suriname--marowijne` — Districtsraad Marowijne | **missing** | access or challenge | not catalogued | 10 |
| `suriname--nickerie` — Districtsraad Nickerie | **missing** | access or challenge | not catalogued | 10 |
| `suriname--para` — Districtsraad Para | **missing** | access or challenge | not catalogued | 10 |
| `suriname--paramaribo` — Districtsraad Paramaribo | **missing** | access or challenge | not catalogued | 10 |
| `suriname--saramacca` — Districtsraad Saramacca | **missing** | access or challenge | not catalogued | 10 |
| `suriname--sipaliwini` — Districtsraad Sipaliwini | **missing** | access or challenge | not catalogued | 10 |
| `suriname--wanica` — Districtsraad Wanica | **missing** | access or challenge | not catalogued | 10 |

### Switzerland (26)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `switzerland--aargau` — Kanton Aargau | [page](http://www.ag.ch/grossrat/) | provider or frame leads only | not catalogued | 8 |
| `switzerland--appenzell-auserrhoden` — Kanton Appenzell Auserrhoden | [page](http://www.ar.ch/kantonsrat/) | provider or frame leads only | existing | 4 |
| `switzerland--appenzell-innerrhoden` — Kanton Appenzell Innerrhoden | [page](http://www.ai.ch/de/politik/grosserrat/grosserratmain) | access or challenge | not catalogued | 9 |
| `switzerland--basel-landschaft` — Kanton Basel-Landschaft | [page](http://www.baselland.ch/Parlament.273441.0.html) | access or challenge | not catalogued | 10 |
| `switzerland--basel-stadt` — Kanton Basel-Stadt | [page](http://www.grosserrat.bs.ch/) | provider or frame leads only | not catalogued | 8 |
| `switzerland--bern` — Kanton Bern | [page](https://www.gr.be.ch/de/start.html) | media element without advancing signal | existing | 3 |
| `switzerland--fribourg-freiburg` — Kanton Fribourg (Freiburg) | [page](http://admin.fr.ch/gc/de/pub/index.cfm) | provider or frame leads only | not catalogued | 8 |
| `switzerland--geneve-genf` — Kanton Genève (Genf) | [page](http://www.etat-ge.ch/grandconseil/index.asp) | no player signal on selected page | not catalogued | 8 |
| `switzerland--glarus` — Kanton Glarus | [page](http://www.gl.ch/xml_1/internet/de/intro.cfm) | provider or frame leads only | not catalogued | 8 |
| `switzerland--graubunden` — Kanton Graubünden | [page](http://www.gr.ch/DE/publikationen/abstimmungenwahlen/resultate/Seiten/2014_02_09_Resultat.aspx) | provider or frame leads only | not catalogued | 9 |
| `switzerland--jura` — Kanton Jura | [page](http://www.jura.ch/PLT.html) | access or challenge | not catalogued | 9 |
| `switzerland--luzern` — Kanton Luzern | [page](http://www.lu.ch/index/kantonsrat.htm) | provider or frame leads only | not catalogued | 8 |
| `switzerland--neuchatel-neuenburg` — Kanton Neuchatel (Neuenburg) | **missing** | provider or frame leads only | not catalogued | 9 |
| `switzerland--nidwalden` — Kanton Nidwalden | [page](http://www.nw.ch/de/politik/landratmain/landratview) | access or challenge | not catalogued | 9 |
| `switzerland--obwalden` — Kanton Obwalden | [page](http://www.ow.ch/de/politik/kantonsratmain/kantonsratview) | provider or frame leads only | not catalogued | 8 |
| `switzerland--schaffhausen` — Kanton Schaffhausen | [page](http://www.sh.ch/Parlament.15.0.html) | no player signal on selected page | not catalogued | 8 |
| `switzerland--schwyz` — Kanton Schwyz | [page](http://www.sz.ch/xml_1/internet/de/application/d999/d960/d31/f32.cfm) | provider or frame leads only | not catalogued | 8 |
| `switzerland--solothurn` — Kanton Solothurn | [page](http://www.so.ch/parlament/start.html) | provider or frame leads only | not catalogued | 9 |
| `switzerland--st-gallen` — Kanton St. Gallen | [page](http://www.sg.ch/k/kantonsrat_neu.html) | provider or frame leads only | not catalogued | 9 |
| `switzerland--thurgau` — Kanton Thurgau | [page](http://www.parlament.tg.ch/xml_57/internet/de/intro.cfm) | provider or frame leads only | not catalogued | 9 |
| `switzerland--ticino-tessin` — Kanton Ticino (Tessin) | [page](http://www.ti.ch/legislativo) | browser inspection error | not catalogued | 10 |
| `switzerland--uri` — Kanton Uri | [page](http://www.ur.ch/de/landrat/landrat-m384) | access or challenge | not catalogued | 9 |
| `switzerland--valais-wallis` — Kanton Valais (Wallis) | [page](http://www.vs.ch/Navig/departement.asp?MenuID=1831) | access or challenge | not catalogued | 9 |
| `switzerland--vaud-waadt` — Kanton Vaud (Waadt) | [page](http://www.vd.ch/fr/autorites/grand-conseil/) | provider or frame leads only | not catalogued | 9 |
| `switzerland--zug` — Kanton Zug | [page](http://www.zug.ch/kantonsrat) | access or challenge | not catalogued | 10 |
| `switzerland--zurich` — Kanton Zürich | [page](http://www.kantonsrat.zh.ch/) | provider or frame leads only | not catalogued | 8 |

### Taiwan (22)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `taiwan--changhua` — 彰化縣議會 | [page](https://www.chcc.gov.tw/home.aspx) | provider or frame leads only | not catalogued | 8 |
| `taiwan--chiayi-city` — 嘉義市議會 | [page](https://www.cycc.gov.tw/) | no player signal on selected page | not catalogued | 8 |
| `taiwan--chiayi-county` — 嘉義縣議會 | [page](https://www.cyscc.gov.tw/) | no player signal on selected page | not catalogued | 8 |
| `taiwan--hsinchu-city` — 新竹市議會 | [page](https://www.hsinchu-cc.gov.tw/) | browser inspection error | not catalogued | 8 |
| `taiwan--hsinchu-county` — 新竹縣議會 | [page](https://www.hcc.gov.tw/) | access or challenge | not catalogued | 10 |
| `taiwan--hualien` — 花蓮縣議會 | [page](https://www.hlcc.gov.tw/) | provider or frame leads only | not catalogued | 8 |
| `taiwan--kaohsiung` — 高雄市議會 | [page](https://www.kcc.gov.tw/Default.aspx) | provider or frame leads only | not catalogued | 8 |
| `taiwan--keelung` — 基隆市議會 | [page](http://www.kmc.gov.tw/) | provider or frame leads only | not catalogued | 8 |
| `taiwan--kinmen` — 金門縣議會 | [page](https://www.kmcc.gov.tw/) | media element without advancing signal | not catalogued | 8 |
| `taiwan--lienchiang` — 連江縣議會 | [page](https://www.mtcc.gov.tw/) | provider or frame leads only | not catalogued | 8 |
| `taiwan--miaoli` — 苗栗縣議會 | [page](https://www.mcc.gov.tw/) | no player signal on selected page | not catalogued | 8 |
| `taiwan--nantou` — 南投縣議會 | [page](http://www.ntcc.gov.tw/index.aspx) | access or challenge | not catalogued | 10 |
| `taiwan--new-taipei` — 新北市議會 | [page](https://www.ntp.gov.tw/) | no player signal on selected page | not catalogued | 10 |
| `taiwan--penghu` — 澎湖縣議會 | [page](http://www.phcouncil.gov.tw/) | provider or frame leads only | not catalogued | 8 |
| `taiwan--pingtung` — 屏東縣議會 | [page](http://www.ptcc.gov.tw/) | browser inspection error | not catalogued | 10 |
| `taiwan--taichung` — 臺中市議會 | [page](http://www.tccc.gov.tw/) | no player signal on selected page | not catalogued | 8 |
| `taiwan--tainan` — 臺南市議會 | [page](https://www.tncc.gov.tw/) | media element without advancing signal | not catalogued | 8 |
| `taiwan--taipei` — 臺北市議會 | [page](http://council.taipei/Default.aspx) | browser inspection error | not catalogued | 9 |
| `taiwan--taitung` — 臺東縣議會 | [page](http://www.taitungcc.gov.tw/Index.aspx) | media element without advancing signal | not catalogued | 9 |
| `taiwan--taoyuan` — 桃園市議會 | [page](https://www.tycc.gov.tw/) | browser inspection error | not catalogued | 10 |
| `taiwan--yilan` — 宜蘭縣議會 | [page](https://www.ilcc.gov.tw/IlccHome.aspx) | browser inspection error | not catalogued | 10 |
| `taiwan--yunlin` — 雲林縣議會 | [page](https://www.ylcc.gov.tw/index.php) | browser inspection error | not catalogued | 10 |

### United Kingdom (17)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `united-kingdom--alderney` — States of Alderney | [page](https://alderney.gov.gg/) | access or challenge | not catalogued | 8 |
| `united-kingdom--anguilla` — House of Assembly | [page](https://hoa.gov.ai/) | browser navigation failed | not catalogued | 10 |
| `united-kingdom--bermuda` — Parliament of Bermuda | [page](https://parliament.bm/) | no player signal on selected page | existing | 3 |
| `united-kingdom--british-virgin-islands` — House of Assembly of the Virgin Islands | [page](https://hoa.gov.vg/) | provider or frame leads only | existing | 4 |
| `united-kingdom--cayman-islands` — Parliament of the Cayman Islands | [page](https://parliament.ky/) | provider or frame leads only | existing | 4 |
| `united-kingdom--falkland-islands` — Legislative Assembly of the Falkland Islands | [page](https://www.fig.gov.fk/assembly/) | no player signal on selected page | not catalogued | 9 |
| `united-kingdom--gibraltar` — Gibraltar Parliament | [page](https://www.parliament.gi/) | provider or frame leads only | existing | 4 |
| `united-kingdom--guernsey` — States of Deliberation | [page](https://parliament.gg/) | no player signal on selected page | existing | 4 |
| `united-kingdom--isle-of-man` — Tynwald | [page](https://tynwald.im/) | provider or frame leads only | existing | 4 |
| `united-kingdom--jersey` — States Assembly of Jersey | [page](https://www.statesassembly.je/) | provider or frame leads only | existing | 5 |
| `united-kingdom--montserrat` — Montserrat Legislative Assembly | [page](https://parliament.ms/) | advancing media identity and proceedings unverified | existing | 4 |
| `united-kingdom--northern-ireland` — Northern Ireland | [page](http://www.niassembly.gov.uk/) | provider or frame leads only | existing | 3 |
| `united-kingdom--saint-helena` — Legislative Council of Saint Helena | [page](https://www.sainthelena.gov.sh/government/legislative-council/) | browser navigation failed | not catalogued | 10 |
| `united-kingdom--sark` — Chief Pleas of Sark | [page](https://sarkgov.co.uk/) | provider or frame leads only | not catalogued | 8 |
| `united-kingdom--scotland` — Scotland | [page](https://www.parliament.scot/) | no player signal on selected page | existing | 3 |
| `united-kingdom--turks-and-caicos-islands` — Parliament of the Turks and Caicos Islands | [page](https://www.gov.tc/hoa/) | provider or frame leads only | existing | 4 |
| `united-kingdom--wales` — Wales | [page](https://senedd.cymru/) | access or challenge | existing | 3 |

### United States (56)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `united-states--alabama` — Alabama Legislature | [page](https://www.legislature.state.al.us/) | provider or frame leads only | not catalogued | 8 |
| `united-states--alaska` — Alaska State Legislature | [page](https://akleg.gov/) | browser navigation failed | not catalogued | 8 |
| `united-states--american-samoa` — American Samoa Fono | [page](https://www.asfono.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--arizona` — Arizona State Legislature | [page](https://www.azleg.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--arkansas` — Arkansas General Assembly | [page](https://www.arkleg.state.ar.us/) | provider or frame leads only | not catalogued | 8 |
| `united-states--california` — California State Legislature | [page](https://leginfo.legislature.ca.gov/) | no player signal on selected page | existing | 5 |
| `united-states--colorado` — Colorado General Assembly | [page](https://leg.colorado.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--connecticut` — Connecticut General Assembly | [page](https://www.cga.ct.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--delaware` — Delaware General Assembly | [page](https://legis.delaware.gov/) | provider or frame leads only | not catalogued | 9 |
| `united-states--district-of-columbia` — Council of the District of Columbia | [page](https://dccouncil.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--florida` — Florida Legislature | [page](https://www.leg.state.fl.us/) | browser inspection error | existing | 3 |
| `united-states--georgia` — Georgia General Assembly | [page](https://www.legis.ga.gov/) | no player signal on selected page | not catalogued | 8 |
| `united-states--guam` — Guam Legislature | [page](https://guamlegislature.gov/) | provider or frame leads only | existing | 5 |
| `united-states--hawaii` — Hawaii State Legislature | [page](https://www.capitol.hawaii.gov/) | access or challenge | not catalogued | 10 |
| `united-states--idaho` — Idaho Legislature | [page](https://legislature.idaho.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--illinois` — Illinois General Assembly | [page](https://www.ilga.gov/) | media element without advancing signal | not catalogued | 8 |
| `united-states--indiana` — Indiana General Assembly | [page](https://iga.in.gov/) | no player signal on selected page | not catalogued | 8 |
| `united-states--iowa` — Iowa General Assembly | [page](https://www.legis.iowa.gov/) | access or challenge | not catalogued | 8 |
| `united-states--kansas` — Kansas Legislature | [page](https://www.kslegislature.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--kentucky` — Kentucky General Assembly | [page](https://legislature.ky.gov/) | access or challenge | not catalogued | 8 |
| `united-states--louisiana` — Louisiana State Legislature | [page](https://www.legis.la.gov/) | no player signal on selected page | not catalogued | 8 |
| `united-states--maine` — Maine Legislature | [page](https://legislature.maine.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--maryland` — Maryland General Assembly | [page](https://mgaleg.maryland.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--massachusetts` — Massachusetts General Court | [page](https://malegislature.gov/) | no player signal on selected page | not catalogued | 8 |
| `united-states--michigan` — Michigan Legislature | [page](https://www.legislature.mi.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--minnesota` — Minnesota Legislature | [page](https://www.leg.mn.gov/) | provider or frame leads only | existing | 4 |
| `united-states--mississippi` — Mississippi Legislature | [page](https://www.legislature.ms.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--missouri` — Missouri General Assembly | [page](https://www.mo.gov/government/legislative-branch/) | no player signal on selected page | not catalogued | 8 |
| `united-states--montana` — Montana Legislature | [page](https://leg.mt.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--nebraska` — Nebraska Legislature | [page](https://nebraskalegislature.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--nevada` — Nevada Legislature | [page](https://www.leg.state.nv.us/) | access or challenge | not catalogued | 10 |
| `united-states--new-hampshire` — New Hampshire General Court | [page](https://www.gencourt.state.nh.us/) | access or challenge | not catalogued | 8 |
| `united-states--new-jersey` — New Jersey Legislature | [page](https://www.njleg.state.nj.us/) | browser inspection error | not catalogued | 10 |
| `united-states--new-mexico` — New Mexico Legislature | [page](https://www.nmlegis.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--new-york` — New York State Legislature | [page](https://nyassembly.gov/) | provider or frame leads only | existing | 4 |
| `united-states--north-carolina` — North Carolina General Assembly | [page](https://www.ncleg.gov/) | access or challenge | not catalogued | 10 |
| `united-states--north-dakota` — North Dakota Legislative Assembly | [page](https://www.legis.nd.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--northern-mariana-islands` — Northern Mariana Islands Commonwealth Legislature | [page](https://cnmileg.net/) | provider or frame leads only | not catalogued | 8 |
| `united-states--ohio` — Ohio General Assembly | [page](https://www.legislature.ohio.gov/) | browser inspection error | not catalogued | 10 |
| `united-states--oklahoma` — Oklahoma Legislature | [page](https://www.oklegislature.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--oregon` — Oregon Legislative Assembly | [page](https://www.oregonlegislature.gov/) | provider or frame leads only | existing | 4 |
| `united-states--pennsylvania` — Pennsylvania General Assembly | [page](https://www.legis.state.pa.us/) | provider or frame leads only | not catalogued | 8 |
| `united-states--puerto-rico` — Asamblea Legislativa de Puerto Rico | [page](https://www.oslpr.org/) | provider or frame leads only | existing | 4 |
| `united-states--rhode-island` — Rhode Island General Assembly | [page](https://www.rilegislature.gov/) | provider or frame leads only | existing | 4 |
| `united-states--south-carolina` — South Carolina General Assembly | [page](https://www.scstatehouse.gov/) | provider or frame leads only | not catalogued | 9 |
| `united-states--south-dakota` — South Dakota Legislature | [page](https://sdlegislature.gov/) | no player signal on selected page | not catalogued | 8 |
| `united-states--tennessee` — Tennessee General Assembly | [page](https://www.capitol.tn.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--texas` — Texas Legislature | [page](https://capitol.texas.gov/) | provider or frame leads only | existing | 4 |
| `united-states--united-states-virgin-islands` — Legislature of the Virgin Islands | [page](https://legvi.org/) | provider or frame leads only | not catalogued | 8 |
| `united-states--utah` — Utah State Legislature | [page](https://le.utah.gov/) | media element without advancing signal | existing | 4 |
| `united-states--vermont` — Vermont General Assembly | [page](https://legislature.vermont.gov/) | provider or frame leads only | not catalogued | 8 |
| `united-states--virginia` — Virginia General Assembly | [page](https://virginiageneralassembly.gov/) | no player signal on selected page | not catalogued | 8 |
| `united-states--washington` — Washington State Legislature | [page](https://leg.wa.gov/) | browser inspection error | existing | 4 |
| `united-states--west-virginia` — West Virginia Legislature | [page](https://www.wvlegislature.gov/) | media element without advancing signal | existing | 4 |
| `united-states--wisconsin` — Wisconsin Legislature | [page](https://legis.wisconsin.gov/) | no player signal on selected page | not catalogued | 8 |
| `united-states--wyoming` — Wyoming Legislature | [page](https://www.wyoleg.gov/) | no player signal on selected page | not catalogued | 8 |

### Uruguay (19)

| Inventory ID / institution | Institutional route | Browser screen | Catalogue | Gaps |
| --- | --- | --- | --- | ---: |
| `uruguay--artigas` — Junta Departamental de Artigas | [page](https://juntadeartigas.gub.uy/) | advancing media identity and proceedings unverified | not catalogued | 8 |
| `uruguay--canelones` — Junta Departamental de Canelones | [page](https://www.juntadecanelones.gub.uy/) | provider or frame leads only | not catalogued | 8 |
| `uruguay--cerro-largo` — Junta Departamental de Cerro Largo | [page](https://juntacerrolargo.gub.uy/) | browser navigation failed | not catalogued | 10 |
| `uruguay--colonia` — Junta Departamental de Colonia | [page](https://www.juntacolonia.gub.uy/) | provider or frame leads only | not catalogued | 8 |
| `uruguay--durazno` — Junta Departamental de Durazno | [page](https://juntadedurazno.gub.uy/) | provider or frame leads only | not catalogued | 8 |
| `uruguay--flores` — Junta Departamental de Flores | [page](https://www.juntadeflores.gub.uy/) | no player signal on selected page | not catalogued | 8 |
| `uruguay--florida` — Junta Departamental de Florida | [page](https://www.juntaflorida.gub.uy/) | provider or frame leads only | not catalogued | 8 |
| `uruguay--lavalleja` — Junta Departamental de Lavalleja | [page](https://juntadepartamentallavalleja.gub.uy/) | provider or frame leads only | not catalogued | 8 |
| `uruguay--maldonado` — Junta Departamental de Maldonado | [page](https://www.juntamaldonado.gub.uy/) | media element without advancing signal | not catalogued | 8 |
| `uruguay--montevideo` — Junta Departamental de Montevideo | [page](https://www.juntamvd.gub.uy/) | provider or frame leads only | not catalogued | 8 |
| `uruguay--paysandu` — Junta Departamental de Paysandú | [page](https://www.juntadepaysandu.gub.uy/) | provider or frame leads only | not catalogued | 8 |
| `uruguay--rio-negro` — Junta Departamental de Río Negro | [page](https://juntarionegro.gub.uy/) | browser inspection error | not catalogued | 8 |
| `uruguay--rivera` — Junta Departamental de Rivera | [page](https://www.juntaderivera.gub.uy/) | advancing media identity and proceedings unverified | not catalogued | 8 |
| `uruguay--rocha` — Junta Departamental de Rocha | [page](https://www.juntarocha.gub.uy/) | provider or frame leads only | not catalogued | 8 |
| `uruguay--salto` — Junta Departamental de Salto | [page](https://juntadesalto.gub.uy/) | provider or frame leads only | not catalogued | 8 |
| `uruguay--san-jose` — Junta Departamental de San José | [page](https://portal.juntasanjose.gub.uy/) | provider or frame leads only | not catalogued | 8 |
| `uruguay--soriano` — Junta Departamental de Soriano | [page](https://www.juntadesoriano.gub.uy/) | no player signal on selected page | not catalogued | 8 |
| `uruguay--tacuarembo` — Junta Departamental de Tacuarembó | [page](https://juntatacuarembo.com.uy/) | provider or frame leads only | not catalogued | 8 |
| `uruguay--treinta-y-tres` — Junta Departamental de Treinta y Tres | [page](https://juntatreintaytres.gub.uy/) | no player signal on selected page | not catalogued | 8 |
