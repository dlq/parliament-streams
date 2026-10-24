# Metadata Follow-up And Corrientes — 23 October 2026

[Research status](../../docs/research-status.md) · [Full decision data](2026-10-23-metadata-followup.json) · [652-body initial audit](2026-10-23-eligible-metadata-stream-audit.md)

## Current result

- **57 of 175 institutional URL gaps resolved; 118 remain.** Each resolution names its scope: institution, one chamber, secretariat, legal-document portal or officially designated legislative news collection.
- **Two Corrientes sources added:** provincial Chamber of Deputies webcasts and separate historical Senate recordings. Both are official viewing links.
- Local catalogue: **161 sources**, including 83 regional/territorial sources across **63 mapped jurisdictions**.
- Of 652 eligible bodies, **63 have catalogue coverage and 589 do not**. Coverage is not a claim that every room or current live feed is validated.
- 75 Philippine provincial-board item candidates found; **ten corroborated against individually reviewed primary board profiles**. Sparse or unmatched items remain identity leads.
- This batch does **not** claim fresh individual review of all 175 URL gaps. Every start-of-batch target is tracked in JSON, with explicit review status and next action.

## Corrientes: exact chambers and viewing services

| Chamber | Institutional item | Official viewing route | Checked scope |
| --- | --- | --- | --- |
| Provincial Deputies | [Q56316686](https://www.wikidata.org/wiki/Q56316686) | [Official sitting index](https://hcdcorrientes.gov.ar/sesiones/sesiones-en-vivo/) | 14 October / 23 September 2026 sittings after 30 minutes, Chromium and WebKit; agenda dates and session numbers agree |
| Provincial Senate | [Q40323796](https://www.wikidata.org/wiki/Q40323796) | [Institution-designated channel](https://www.youtube.com/channel/UCG53mcv5LYAOzJrLGnGTy-A/streams) | Two own-Senate recordings after 30 minutes in both engines; provider publication dates 21 March 2024 / 30 November 2023 |

Exact items’ website claims match the primary chamber sites. The Senate website
designates its channel independently of the lower house. The regional conference
and cultural programming on the channel do not establish Senate-sitting coverage.
The municipal Corrientes council is a separate institution.

Senate publication timestamps are not asserted to be independently reconciled
sitting dates. Its official audio archive is retained as a lead: playback is not
yet tested, and the 21 November 2024 entry points to a `17-11-2024` filename.

Current-live availability, all public committee rooms, full audio-language and
accessibility coverage remain open. The Deputies samples visibly contain an
interpreter; no service-wide availability or specific sign language is certified.
The reviewed public pages establish official viewing routes, without an independent
audiovisual reuse grant. Both entries remain link-outs with pending reuse review.
No IPTV eligibility or implemented XMLTV parser was added.

[Playback and public-date evidence](../health/2026-10-23-corrientes-validation.json) · [Desktop/mobile UI evidence](../health/2026-10-23-corrientes-ui.json)

## Chubut: unexpected site content

The domain listed by the primary legislature-network directory currently serves an
unrelated French-language file listing, rather than legislative content. HTTP 200
does not establish that it remains a usable institutional site. Its route stays
held until a primary institution announcement or verified replacement establishes
the current address. No listed archives, scripts or internal files were opened.
This observation alone does not establish the cause.

## Institutional route corrections

These close address/identity fields only. They do not certify streams or all metadata.

| Inventory ID | Reviewed route | Scope |
| --- | --- | --- |
| `argentina--chaco` | [Portal Legislatura del Chaco](https://www.legislaturachaco.gob.ar/) | institutional page |
| `argentina--ciudad-autonoma-de-buenos-aires` | [Legislatura Ciudad Autónoma de Buenos Aires](https://www.legislatura.gob.ar/InfoSesion/) | institutional page |
| `argentina--entre-rios` | [Diputados Medios - Cámara de Diputados de Entre Ríos](https://medios.hcder.gov.ar/) | lower chamber only |
| `argentina--formosa` | [Cámara de Diputados](https://www.legislaturaformosa.gob.ar/) | institutional page |
| `argentina--misiones` | [Camara de Representantes de Misiones](https://diputadosmisiones.gob.ar/) | institutional page |
| `argentina--rio-negro` | [Emisión en directo de Legislatura de Río Negro](https://web.legisrn.gov.ar/vivo) | institutional page |
| `argentina--salta` | [Cámara de Diputados de la Provincia de Salta](https://www.diputadosalta.gob.ar/) | lower chamber only |
| `argentina--san-luis` | [Cámara de Senadores de la Provincia de San Luis](https://senado.sanluis.gov.ar/) | upper chamber only |
| `argentina--tierra-del-fuego` | [Legislatura TDF A.I.A.S. – Sitio oficial de la Legislatura de Tierra del Fuego Antártida e Isla](https://www.legistdf.gob.ar/) | institutional page |
| `colombia--bolivar` | [Asamblea Departamental de Bolivar](https://www.asambleadebolivar.gov.co/) | institutional page |
| `colombia--choco` | [Asambloea Departamental del Chocó – Web Oficial](https://www.asambleachoco.gov.co/web/) | institutional page |
| `colombia--san-andres-providencia-y-santa-catalina` | [Asamblea Departamental Archipielago San Andrés, Providencia y Santa Catalina, Colombia](https://www.asambleasai.gov.co/actas) | institutional page |
| `colombia--santander` | [Asamblea Departamental de Santander – Asamblea Departamental de Santander Accesibilidad Aumenta](https://asambleadesantander.gov.co/) | institutional page |
| `indonesia--bali` | [Jaringan Dokumentasi dan Informasi Hukum DPRD Provinsi Bali](https://jdih-dprd.baliprov.go.id/) | legislative legal documentation portal |
| `indonesia--di-yogyakarta` | [JDIH DPRD DI Yogyakarta](https://jdih-dprd-diy.jogjaprov.go.id/) | legislative legal documentation portal |
| `philippines--agusan-del-sur` | [Legislative Branch](https://agusandelsur.gov.ph/branches/legislative-branch/) | institutional page |
| `philippines--benguet` | [Office of the Secretary to the Sangguniang Panlalawigan – Province of Benguet](https://benguet.gov.ph/office-of-the-secretary-to-the-sangguniang-panlalawigan/) | institutional page |
| `philippines--camiguin` | [SANGGUNIANG PANLALAWIGAN  /  OFFICE OF THE VICE- GOVERNOR](https://camiguin.gov.ph/sangguniang-panlalawigan-office-of-the-vice-governor/) | institutional page |
| `philippines--eastern-samar` | [Sangguniang Panglalawigan  /  Province of Eastern Samar](https://easternsamar.gov.ph/sangguniang-panglalawigan/) | institutional page |
| `philippines--isabela` | [Office of the Secretary to the Sangguniang Panlalawigan - Official Website of the Province of I](https://provinceofisabela.gov.ph/department/office-of-the-secretary-to-the-sangguniang-panlalawigan/) | institutional page |
| `philippines--tawi-tawi` | [SANGGUNIANG PANLALAWIGAN – PROVINCE OF TAWI-TAWI](https://tawi-tawi.gov.ph/sangguniang-panlalawigan/) | institutional page |
| `sri-lanka--central` | [Central Provincial Council](https://cp.gov.lk/web/?lang=en) | provincial council administration |
| `sri-lanka--north-western` | [About Us - North Western Provincial Council](https://pcsec.nw.gov.lk/aboutus.html) | provincial council administration |
| `sri-lanka--sabaragamuwa` | [Sabaragamuwa Provincial Council Expand Expand Expand Expand Expand Expand Expand Toggle Menu Co](https://sg.gov.lk/) | provincial council administration |
| `switzerland--neuchatel-neuenburg` | [Grand Conseil  /  ne.ch](https://www.ne.ch/en/node/2928) | institutional page |
| `argentina--catamarca` | [inicio - Cámara de Senadores de la Provincia de Catamarca](https://senadodecatamarca.gob.ar/) | upper chamber only |
| `argentina--mendoza` | [Home](https://www.hcdmza.gob.ar/site/) | lower chamber only |
| `argentina--san-juan` | [Legislatura Provincial de San Juan](https://diputadossanjuan.gob.ar/) | institutional page |
| `argentina--santa-cruz` | [Bienvenido a la Honorable Cámara de Diputados de Santa Cruz.](https://diputadosdesantacruz.gob.ar/) | institutional page |
| `argentina--tucuman` | [Honorable Legislatura de Tucumán](https://www.legislaturadetucuman.gob.ar/) | institutional page |
| `colombia--caldas` | [Visita el sitio oficial de la Asamblea de Caldas. Encuentra información sobre sesiones, proyect](https://www.asambleadecaldas.gov.co/) | institutional page |
| `colombia--amazonas` | [Asamblea Departamental De Amazonas](https://www.asamblea-amazonas.gov.co/) | institutional page |
| `colombia--boyaca` | [Asamblea Departamental De Boyacá](https://asamblea-boyaca.gov.co/) | institutional page |
| `colombia--cauca` | [Asamblea Departamental De Cauca](https://www.asamblea-cauca.gov.co/) | institutional page |
| `colombia--cundinamarca` | [Asamblea Departamental De Cundinamarca, Diputado, Plenaria, Ponencia](https://www.asamblea-cundinamarca.gov.co/) | institutional page |
| `colombia--huila` | [Asamblea Departamental De Huila](https://www.asamblea-huila.gov.co/) | institutional page |
| `colombia--guaviare` | [Asamblea Departamental de Guaviare es una corporación gubernamental del Departamento de Guaviar](https://www.asamblea-guaviare.gov.co/) | institutional page |
| `colombia--guainia` | [Asamblea Departamental del Guainia](https://www.asamblea-guainia.gov.co/) | institutional page |
| `colombia--meta` | [Asamblea Departamental del Meta](https://www.asamblea-meta.gov.co/) | institutional page |
| `colombia--narino` | [Asamblea Departamental de Nariño](https://asambleanarino.gov.co/) | institutional page |
| `colombia--quindio` | [Asamblea Departamental del Quindío](https://www.asamblea-quindio.gov.co/) | institutional page |
| `colombia--putumayo` | [Inicio](https://asambleadelputumayo.gov.co/) | institutional page |
| `panama--guna-yala` | [Congresos Generales de Gunayala](https://www.gunayala.org.pa/) | institutional page |
| `sri-lanka--southern` | [Council Secretariat - Southern Province Council](https://spcs.sp.gov.lk/index_en.html) | provincial council administration or secretariat |
| `sri-lanka--uva` | [Uva Provincial Council – Official Web Portal – Uva Provincial Council – Official Web Portal](https://www.up.gov.lk/) | provincial council administration or secretariat |
| `argentina--santiago-del-estero` | [Cámara de Diputados – Santiago del Estero](https://sde.gob.ar/tag/camara-de-diputados/) | official legislative news collection |
| `colombia--sucre` | [Asamblea Departamental De Sucre](https://asambleasucre.gov.co/) | institutional page |
| `colombia--tolima` | [Asamblea Departamental Del Tolima](https://asambleatolima.gov.co/) | institutional page |
| `colombia--vichada` | [Asamblea Departamental De Vichada](https://www.asamblea-vichada.gov.co/) | institutional page |
| `sri-lanka--northern` | [Assembly Secretariat – Northern Provincial Council, Sri Lanka](https://np.gov.lk/assembly-secretariat/) | provincial council administration or secretariat |
| `philippines--quezon` | [ELIS QUEZON](https://sp.quezon.gov.ph/) | institutional page |
| `philippines--ilocos-sur` | [Province of Ilocos Sur](https://esanggunian.ilocossur.gov.ph/IlocosSur/Legislative/) | institutional page |
| `philippines--occidental-mindoro` | [ELMS OCCIDENTAL MINDORO](https://sp.occidentalmindoro.gov.ph/) | institutional page |
| `indonesia--aceh` | [DEWAN PERWAKILAN RAKYAT ACEH  /  Adat Bak Po Teumeuruhom Hukom Bak Syiah Kuala](https://dpra.acehprov.go.id/) | institutional page |
| `indonesia--sulawesi-utara` | [Website Resmi DPRD Provinsi Sulawesi Utara - Corporate](https://dprd.sulutprov.go.id/) | institutional page |
| `argentina--la-pampa` | [Honorable Cámara de diputados de la Provincia de la Pampa](https://legislatura.lapampa.gob.ar/) | institutional site address access unresolved |
| `philippines--cebu` | [Cebu Legislature  /  Sangguniang Panlalawigan & Governance](https://www.cebu.gov.ph/vice-governor-sangguniang-panlalawigan/) | provincial board profile |

## Remaining missing institutional URLs

| Country | Bodies |
| --- | ---: |
| Argentina | 1 |
| Colombia | 10 |
| Indonesia | 25 |
| Panama | 4 |
| Philippines | 65 |
| Sri Lanka | 3 |
| Suriname | 10 |

A failed request, a missing item claim and an empty JavaScript shell do not prove
that a legislature lacks a website or broadcast. Generic executive pages, municipal
bodies, country inventories and national visitor hearings are not substituted for
an exact institutional page. Sri Lankan secretariat routes do not certify current
elected-council sittings; Guna Yala’s political-administrative and cultural congresses
remain distinct. Some Ilocos Sur documents require registration; public metadata
was inspected without accessing restricted documents.

| Inventory ID | Individual work in this batch | Next gate |
| --- | --- | --- |
| `indonesia--kepulauan-bangka-belitung` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `argentina--chubut` | unexpected-content hold | Find a current primary institutional announcement or verified replacement site, then confirm ownership and proceedings. Keep this route held; no listed scripts, archives or internal files were opened. |
| `colombia--antioquia` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `colombia--arauca` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `colombia--caqueta` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `colombia--casanare` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `colombia--la-guajira` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `colombia--magdalena` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `colombia--norte-de-santander` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `colombia--risaralda` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `colombia--valle-del-cauca` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `colombia--vaupes` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--bengkulu` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--dki-jakarta` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--jawa-barat` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--kalimantan-barat` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--kalimantan-selatan` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--kalimantan-utara` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--kepulauan-riau` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--lampung` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--maluku` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--maluku-utara` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--nusa-tenggara-barat` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--nusa-tenggara-timur` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--papua-barat` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--papua-barat-daya` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--papua-pegunungan` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--papua-selatan` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--riau` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--sulawesi-barat` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--sulawesi-selatan` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--sulawesi-tengah` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--sulawesi-tenggara` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--sumatera-barat` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--sumatera-selatan` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `indonesia--sumatera-utara` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `panama--embera-wounaan-comarca` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `panama--guna-madungandi` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `panama--guna-wargandi` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `panama--ngabe-bugle-comarca` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--abra` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--agusan-del-norte` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--aklan` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--albay` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--antique` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--apayao` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--aurora` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--basilan` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--batanes` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--batangas` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--biliran` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--bohol` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--bukidnon` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--bulacan` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--camarines-norte` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--camarines-sur` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--capiz` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--catanduanes` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--davao-oriental` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--davao-de-oro` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--davao-del-norte` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--dinagat-islands` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--guimaras` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--ifugao` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--ilocos-norte` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--iloilo` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--kalinga` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--laguna` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--lanao-del-norte` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--lanao-del-sur` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--leyte` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--maguindanao-del-norte` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--maguindanao-del-sur` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--marinduque` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--masbate` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--misamis-occidental` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--misamis-oriental` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--mountain-province` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--negros-occidental` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--negros-oriental` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--northern-samar` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--nueva-ecija` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--nueva-vizcaya` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--oriental-mindoro` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--palawan` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--pampanga` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--pangasinan` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--quirino` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--rizal` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--romblon` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--samar` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--sarangani` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--siquijor` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--sorsogon` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--south-cotabato` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--southern-leyte` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--sultan-kudarat` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--sulu` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--surigao-del-norte` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--surigao-del-sur` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--tarlac` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--zambales` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--zamboanga-sibugay` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--zamboanga-del-norte` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `philippines--zamboanga-del-sur` | identity lead only | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `sri-lanka--eastern` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `sri-lanka--north-central` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `sri-lanka--western` | primary route checked; unresolved | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `suriname--brokopondo` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `suriname--commewijne` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `suriname--coronie` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `suriname--marowijne` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `suriname--nickerie` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `suriname--para` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `suriname--paramaribo` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `suriname--saramacca` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `suriname--sipaliwini` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |
| `suriname--wanica` | not individually revisited in this batch | Corroborate exact primary legislative page; retain provider and metadata checks separately. |

## Evidence and validation

- [Rendered primary pages and failures](../health/2026-10-23-metadata-followup-pages.json).
- [Philippine board-item and government-route discovery](2026-10-23-philippine-board-metadata-discovery.json).
- 109 Python tests pass, one skipped; coverage 91%. Catalogue, candidates, identity/history coherence, formatting, lint, typing and HTML checks pass.
- The initial map check caught a Polygon/MultiPolygon contract mismatch; Corrientes is now normalized to MultiPolygon. Accessibility checks pass after that correction.
- Focused catalogue, map, parent-country search, flag, keyboard and planned schedule-index checks pass at 1280px and 320px in Chromium and WebKit; no overflow or relevant console errors. Browser plugin was unavailable, so regular Playwright was used.
- Changes are local; no deployment is asserted.
