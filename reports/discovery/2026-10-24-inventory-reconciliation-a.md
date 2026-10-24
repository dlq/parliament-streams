# Inventory reconciliation A — 24 countries

> Snapshot note: this report precedes the final scope decisions and operational integration. Use the [current reconciliation](2026-10-24-inventory-reconciliation.md) and [institution register](../../data/discovery/institutions.json) for the applied decisions and remaining legal holds.

Reviewed 24 October 2026. Retained selection: EIU**2024** baseline, published2025,25full+46flaweddemocracies. These 24 countries account for 327 existing subnational inventory rows. This is a bounded institutional/framework reconciliation, **not a claim that all legislative bodies or their services are fully validated**.

Concrete corrections: missing Brussels Assemblée réunie lawmaking capacity; named chamber children for Argentina/Australia; current Mayotte name; dated Danish regional transition; explicit special-status authority candidates/exclusions. National chamber checklists are named here because a catalogue source count cannot substitute for a body inventory.

## Albania

Existing regional/territorial rows: **12** — outside_default_scope: 12.

**National chamber checklist:** Kuvendi i Shqipërisë.

12 regional councils present; no proposed new core legislature.

- Keep all 12 exclusions linked to Constitution 110–114 and distinguish generally binding local ordinances from primary lawmaking.

**New primary evidence (and actual evidence level):**

- [primary_search_index_excerpt_review](https://www.gjk.gov.al/web/constitution_of_albania_2090.pdf): Constitution articles 110–114 distinguish regional self-government and generally binding ordinances from state legislation. Exclusion must turn on the adopted lawmaking threshold, not merely the word council.
- [primary_search_index_excerpt_review](https://www.parlament.al/kuvendi/legjislaturat/): National Assembly identified as single 140-deputy body.

**Still unresolved:** Current council legal powers compared consistently against Czech/Colombian regional threshold; no exhaustive post-source law-change review.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Argentina

Existing regional/territorial rows: **24** — eligible_legislature: 24.

**National chamber checklist:** Cámara de Diputados de la Nación; Senado de la Nación.

23 provincial legislatures+CABA present, but institution rows collapse 8 bicameral bodies.

- Create named chamber children for 8 bicameral provinces; retain 24 parent institutions and 32 regional chamber units. Do not add a second institution just because it has 2 chambers.

Named chamber children (retain their parent institution):

- Buenos Aires: Cámara de Diputados; Cámara de Senadores.
- Catamarca: Cámara de Diputados; Cámara de Senadores.
- Corrientes: Cámara de Diputados; Cámara de Senadores.
- Entre Ríos: Cámara de Diputados; Cámara de Senadores.
- Mendoza: Cámara de Diputados; Cámara de Senadores.
- Salta: Cámara de Diputados; Cámara de Senadores.
- San Luis: Cámara de Diputados; Cámara de Senadores.
- Santa Fe: Cámara de Diputados; Cámara de Senadores.

**New primary evidence (and actual evidence level):**

- [primary_page_content_review](https://www.argentina.gob.ar/normativa/constituciones/provinciales-y-caba): Government constitution directory enumerates CABA and 23 provinces; retained 24 regional names match this territorial checklist.
- [primary_search_index_excerpt_review](https://www.argentina.gob.ar/sites/default/files/revista_diciembre_01d_0.pdf): Government institute publication distinguishes 16 unicameral and 8 bicameral regional legislatures. This is a chamber-grain check; older seat counts are not adopted.
- [primary_search_index_excerpt_review](https://www.congreso.gob.ar/poderLegislativo.php): Congress explicitly comprises national Chamber of Deputies and Senate.

**Still unresolved:** Verify current 2025 SantaFe Constitution against chamber names/changes when populating child IDs; current government publication does not certify every 2026 stream. Falklands/Malvinas sovereignty claims must not duplicate existing UK territory legislature; no position on recognition.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Australia

Existing regional/territorial rows: **11** — eligible_legislature: 8, outside_default_scope: 3.

**National chamber checklist:** House of Representatives; Senate.

6 state+ACT+NT institutions present;5 bicameral parents need chamber children.

- Represent 13 regional chamber units under 8 parents; retain Norfolk/Christmas/Cocos local councils as exclusions.

Named chamber children (retain their parent institution):

- New South Wales: Legislative Assembly; Legislative Council.
- South Australia: House of Assembly; Legislative Council.
- Tasmania: House of Assembly; Legislative Council.
- Victoria: Legislative Assembly; Legislative Council.
- Western Australia: Legislative Assembly; Legislative Council.

**New primary evidence (and actual evidence level):**

- [primary_search_index_excerpt_review](https://peo.gov.au/understand-our-parliament/how-parliament-works/three-levels-of-government/three-levels-of-government-governing-australia): Parliamentary Education Office identifies 6 state and 2 territory parliaments; Queensland and the 2 territories unicameral, other 5 states bicameral.

**Still unresolved:** External territories without elected legislatures need explicit territory-level no-body dispositions; existing 3 council rows are not an exhaustive external-territory checklist. Review Norfolk abolishedAssembly 2015 as historical-only, not a current legislature.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Austria

Existing regional/territorial rows: **9** — eligible_legislature: 9.

**National chamber checklist:** Nationalrat; Bundesrat.

All 9 state Landtage represented.

- Normalize Lower/UpperAustria official German institution spelling and keep Vienna Landtag capacity separate from Gemeinderat.

**New primary evidence (and actual evidence level):**

- [primary_search_index_excerpt_review](https://www.parlament.gv.at/verstehen/politisches-system/bund-laender/landtage): Austrian Parliament identifies 9 Landtage and national Nationalrat/Bundesrat.

**Still unresolved:** Institution-level 9/9 match does not certify committees, source metadata or all rooms.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Belgium

Existing regional/territorial rows: **6** — eligible_legislature: 6.

**National chamber checklist:** Chambre des représentants / Kamer van volksvertegenwoordigers; Sénat / Senaat.

6 existing regional/community institution rows; at least 1 distinct lawmaking capacity absent.

- Add Assemblée réunie de la Commission communautaire commune / Verenigde Vergadering van de Gemeenschappelijke Gemeenschapscommissie, relationship shares 89 members/services with Brussels Parliament, adopts ordinances.
- Record Flemish Community Commission regulatory/advisory boundary explicitly; do not duplicate Flemish regional/community merged parliament.

**New primary evidence (and actual evidence level):**

- [primary_pdf_text_review](https://www.lachambre.be/kvvcr/pdf_sections/pri/fiche/fr_26_00.pdf): Chamber factsheet dated 1 Feb 2025, page 2: the Brussels language groups also constitute the Assemblée réunie, which adopts ordinances. Distinct lawmaking capacity is missing from the 6 regional rows.
- [primary_search_index_statute_excerpt_review](https://senlex.senate.be/fr/dia/structure/str_88/article/art_3823_fr_2014-01-06/articleversions): Special Law 12 Jan 1989 article 68: Assemblée réunie and Collège réuni jointly exercise ordinance lawmaking. Search index returned actual text; direct open cache-missed.
- [primary_page_content_review_with_contamination_warning](https://www.ccc-ggc.brussels/fr/organisation/assemblee-reunie): Official page describes 89 Brussels members sitting in Assemblée réunie, but fresh page also contains unrelated casino promotion. Treat as source-quality warning; use independent Chamber factsheet/statute for institutional conclusion.

**Still unresolved:** Do not treat contaminated COCOM page as sole authority. Regional/cultural geographic coverage and shared broadcast services need deduplication.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Botswana

Existing regional/territorial rows: **31** — outside_default_scope: 31.

**National chamber checklist:** National Assembly.

31 local council exclusions present; no autonomous regional parliament established.

- Add explicit national auxiliary exclusion Ntlo ya Dikgosi, with referral/advisory function, rather than inventing an upper legislative chamber.

**New primary evidence (and actual evidence level):**

- [primary_search_index_excerpt_review](https://parliament.gov.bw/index.php?Itemid=611&id=221&option=com_content&view=article): Ntlo ya Dikgosi is an advisory body to National Assembly. Document explicitly as national auxiliary exclusion, not a second coequal legislative chamber.

**Still unresolved:** 31 local councils were not freshly reconciled against every 2026 local reform; count is retained, not certified complete.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Brazil

Existing regional/territorial rows: **27** — eligible_legislature: 27.

**National chamber checklist:** Câmara dos Deputados; Senado Federal.

26 state assemblies+FederalDistrict chamber match fresh official directory.

- Retain 27 single-chamber regional parents and distinguish national Senado/Câmara.

**New primary evidence (and actual evidence level):**

- [primary_page_content_review](https://www2.camara.leg.br/a-camara/estruturaadm/mesa/segundavice/interacao-legislativa/links-relacionados-1/legislativos-estaduais): National Chamber directory lists 26 state assemblies plus Federal District legislative chamber;27 regional rows match its jurisdiction names.
- [primary_search_index_excerpt_review](https://www12.senado.leg.br/institucional/carta-de-servicos/finalidade-e-competencias-legais): Senate identifies national bicameral Congress.

**Still unresolved:** Fernando de Noronha administrative/district council and Indigenous-specific bodies need explicit scope notes if expanding special-status inventory; no automatic eligibility from general regulatory powers.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Bulgaria

Existing regional/territorial rows: **0** — .

**National chamber checklist:** National Assembly.

No regional legislature established by constitutional regional administration framework.

- Retain 0 core subnational bodies; document appointed governors, municipality exclusion and auxiliary planning councils.

**New primary evidence (and actual evidence level):**

- [primary_search_index_statute_excerpt_review](https://parliament.bg/en/const): Constitution articles 135–143 provide municipalities/regions and appointed regional governors; no separate regional legislative tier established by these provisions.
- [primary_search_index_excerpt_review](https://www.government.bg/en/About-Bulgaria/FORM-OF-GOVERNMENT/Form-of-government): Government identifies unicameral National Assembly.

**Still unresolved:** No exhaustive inventory of advisory development councils or every statute amendment.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Canada

Existing regional/territorial rows: **13** — eligible_legislature: 13.

**National chamber checklist:** House of Commons; Senate.

All 10 province+3 territory legislatures present; special autonomous Indigenous bodies not exhausted.

- Add Nunatsiavut Assembly as specific authority/scope candidate under NewfoundlandandLabrador with own Inuit legislation/AssemblyAct; do not classify as municipality or add everybandcouncil.
- Retain 13 core provincial/territorial parents; catalogue CPAC aggregate is not a complete federal chamber inventory.

**New primary evidence (and actual evidence level):**

- [primary_search_index_excerpt_review](https://www.canada.ca/en/intergovernmental-affairs/services/provinces-territories.html): Federal intergovernmental directory covers 10 provinces/3 territories and legislative-assembly links.13 existing core rows reconcile to this geography.
- [primary_page_content_review](https://nunatsiavut.com/legislation/): Official Inuit government legislation index identifies consolidated Inuit Laws and Nunatsiavut Assembly Act; supports an explicit autonomous legislature scope candidate beyond 13 province/territory rows.
- [primary_pdf_retrieved_title_only](https://www.nunatsiavut.com/wp-content/uploads/2022/01/CIL-N-2-30-11-2021-Nunatsiavut-Assembly-Act.pdf): Official Assembly Act retrieved 22 pages; title establishes Assembly/powers subject. Text parser returned empty; no detailedsection-specific legal conclusion inferred.

**Still unresolved:** Nunatsiavut detailed lawmaking powers and scope relationship require review of agreement/Act beyondtitle. Other treaty-based self-governments such as Nisga’a/Tłı̨chǫ warrant bounded primary-directory review if included; not a claim that all qualify.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Cape Verde

Existing regional/territorial rows: **0** — .

**National chamber checklist:** Assembleia Nacional.

0 regional legislatures established by retained constitutional framework.

- Keep municipal assemblies outside first-level legislative inventory; islands are not automatically 10 parliaments.

**New primary evidence (and actual evidence level):**

- [primary_pdf_framework_retained_and_retrieved](https://www.governo.cv/wp-content/uploads/2019/04/cr.pdf): Government-hosted Constitution retrieved 107 pages. Retain municipal local-government framework; this file is not an exhaustive 2026 statute/reform check.
- [primary_search_index_excerpt_review](https://www.parlamento.cv/dsdip/arquivos/Livro_40anos.pdf): National Assembly institutional history describes unicameral structure; historical source, not current member count.

**Still unresolved:** Government PDF is older constitutional edition; later regionalization statutes need dated negative-scope check.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Chile

Existing regional/territorial rows: **16** — outside_default_scope: 16.

**National chamber checklist:** Cámara de Diputadas y Diputados; Senado.

16 regional councils retained as outside default scope; national 2 chambers separate.

- Add explicit special-territory scope disposition for Rapa Nui and JuanFernández; territorial label is not a legislative assembly.

**New primary evidence (and actual evidence level):**

- [primary_search_index_excerpt_review](https://www.bcn.cl/formacioncivica/detalle_guia?h=10221.3%2F45683): Congress Library identifies Cámara de Diputados and Senado as national bicameral legislature.

**Still unresolved:** Specific enacted special-territory governance legislation not freshly examined here; do not infer absence of legislative body from regional count.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Colombia

Existing regional/territorial rows: **33** — eligible_legislature: 32, outside_default_scope: 1.

**National chamber checklist:** Cámara de Representantes; Senado de la República.

32 departmental assemblies plus Bogotá exclusion present.

- Retain 32 eligible departmental parents and explicit Bogotá municipal/district scope boundary; national 2 chambers separate.

**New primary evidence (and actual evidence level):**

- [primary_search_index_excerpt_review](https://www.camara.gov.co/directorios/entidades-2/): National Chamber directory identifies Senate as other chamber.

**Still unresolved:** Constitutional ordinance-power threshold should be compared consistently with other regional councils; special Indigenous territorial authorities not exhaustively inventoried.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Costa Rica

Existing regional/territorial rows: **0** — .

**National chamber checklist:** Asamblea Legislativa.

No provincial legislature created by reviewed constitutional territorial/local framework.

- Retain 0 core regional bodies; distinguish provinces, cantons, municipal and autonomous district councils.

**New primary evidence (and actual evidence level):**

- [primary_search_index_statute_excerpt_review](https://pgrweb.go.cr/SCIJ/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?nValor1=1&nValor2=871&nValor3=85571&param1=NRTC&strTipM=TC): Official legal database Constitution articles 168–169 distinguishes provincial territorial divisions from elected canton municipal governments; no provincial chamber established by these sections.

**Still unresolved:** Indigenous territorial associations/consultative bodies not automatically first-level legislatures; reforms beyond reviewed source still bounded.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Croatia

Existing regional/territorial rows: **21** — outside_default_scope: 21.

**National chamber checklist:** Hrvatski sabor.

20 counties+Zagreb present as 21 exclusions.

- Retain count match; explain why regional general acts fail chosen legislative threshold rather than mere council naming.

**New primary evidence (and actual evidence level):**

- [primary_search_index_excerpt_review](https://mpudt.gov.hr/sustav-lokalne-i-podrucne-regionalne-samouprave-23640/23640): Ministry identifies 20 counties plus City of Zagreb. Existing 21 rows cover this administrative list.
- [primary_search_index_statute_excerpt_review](https://usud.hr/hr/ustav-rh): Constitutional Court text provides elected local/regional representative bodies and counties; representative/regulatory status alone does not settle adopted parliamentary eligibility threshold.

**Still unresolved:** Eligibility consistency review against Czech regions is warranted; constitution itself establishes representative/regulatory powers, not parliamentary label.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Cyprus

Existing regional/territorial rows: **6** — outside_default_scope: 5, eligible_legislature: 1.

**National chamber checklist:** House of Representatives.

5 district organisational exclusions and northern de-facto legislature represented.

- Keep CumhuriyetMeclisi explicitly de-facto and separate from RepublicHouse; no recognition inference.
- Cross-reference Akrotiri/Dhekelia as UK special territories governed by Administrator, not new Cyprus elected chambers.

**New primary evidence (and actual evidence level):**

- [primary_route_access_failure](https://www.gov.cy/moi/en/about/directorate-of-local-government/section-of-district-self-government-organizations/): Direct ministry route returned 403; retained 5 district-body count not independently refreshed from this route.
- [primary_search_index_excerpt_review](https://www.parliament.cy/en/general-information/election-composition-and-dissolution-of-the-house-of-representatives): Own parliamentary source identifies House of Representatives; seats by districts are electoral geography, not district parliaments.
- [primary_search_index_excerpt_review](https://www.gov.uk/government/publications/permanent-joint-operating-bases-pjobs/fd): UK primary source confirms Akrotiri/Dhekelia SBA administration is separate UK organisation. Associate with UK territory register, not invented Cypriot regional legislature.
- [primary_search_index_statute_excerpt_review](https://www.sbaadministration.org/home/legislation/law_reports/SBA_Law_Reports_1988-2020.pdf): SBA administration legal reports describe Administrator power to make laws under 1960 Order article 4; lawmaking executive does not establish representative assembly.

**Still unresolved:** Ministry district route 403; current list not independently refreshed here. Northern legislative identity/recognition disclaimer retained; do not add electoral districts as legislatures.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Czech Republic

Existing regional/territorial rows: **14** — eligible_legislature: 14.

**National chamber checklist:** Poslanecká sněmovna; Senát.

14 higherregional representatives including Prague match constitutional territory list.

- Normalize malformed mixed-case Czech institution names and keep Prague regional function distinct from municipal council role.

**New primary evidence (and actual evidence level):**

- [primary_search_index_statute_excerpt_review](https://www.psp.cz/docs/laws/1997/347.html): Chamber-hosted Constitutional Act 347/1997 lists 14 higher self-governing regions including Prague; retained 14 names match.
- [primary_search_index_statute_excerpt_review](https://pspen.psp.cz/chamber-members/legal-framework/): Official constitutional framework separates parliamentary legislative power from regional/municipal self-government. Keep legal basis with accepted Czech regional eligibility.

**Still unresolved:** Reconcile adopted regional general-ordinance threshold with Albanian/Croatian exclusions; count match is not enough to resolve legal consistency.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Denmark

Existing regional/territorial rows: **7** — outside_default_scope: 5, eligible_legislature: 2.

**National chamber checklist:** Folketinget.

Greenland/Faroes eligible,5 domesticregional exclusions; upcoming 2027 transition affects broader inventory.

- Add dated RegionØstdanmark preparatory council record 2026 outside default scope, succeedsHovedstaden/Sjælland 1 Jan 2027; preserve existing 2026 parents until transition.
- Keep Inatsisartut and Løgting separate autonomous legislatures rather than Folketing chambers.

**New primary evidence (and actual evidence level):**

- [primary_search_index_enacted_statute_excerpt_review](https://www.ft.dk/samling/20241/lovforslag/l213/20241_l213_som_vedtaget.htm): Enacted transition law sections 6–7 merges Hovedstaden and Sjælland into Østdanmark on 1 Jan 2027; preparatory council operates in 2026. Current 5 regional rows need dated transition relationship, not premature deletion.
- [primary_search_index_excerpt_review](https://stm.dk/statsministeriet/rigsfaellesskabet/): Prime Minister office distinguishes Faroese/Greenland self-government and their lawmaking responsibilities.
- [primary_search_index_statute_excerpt_review](https://www.retsinformation.dk/eli/lta/2009/473): Greenland Self-Government Act section 1 places transferred-field legislative power in Inatsisartut.

**Still unresolved:** Future-healthcouncils are not automatically legislatures; committees/territorial administrative layers excluded.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Dominican Republic

Existing regional/territorial rows: **0** — .

**National chamber checklist:** Cámara de Diputados; Senado de la República.

0 regional legislative bodies established by retained planning-law framework; national 2 chambers.

- Document regional/provincial development councils as auxiliary planning bodies, not silently absent rows.

**New primary evidence (and actual evidence level):**

- [primary_search_index_excerpt_review](https://camaradediputados.gob.do/nosotros/): Own national Chamber source identifies bicameral Congress with Senate and Chamber. Do not adopt potentially old member counts.

**Still unresolved:** RetainedLaw 498-06 legal framework not newly exhaustively amended-law checked.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Estonia

Existing regional/territorial rows: **0** — .

**National chamber checklist:** Riigikogu.

0 county legislatures; historicalcounty executives ended 2018.

- Preserve 0 core regional count with reformsource; county/municipalcooperation associations are administrative/auxiliary.

**New primary evidence (and actual evidence level):**

- [primary_page_historical_reform_content_review](https://www.riigikogu.ee/en/pressiteated/riigikogu-passed-two-acts-concerning-termination-activities-county-governments-local-government-organisation/): Parliament confirms county governments ended 1 Jan 2018; counties remain administrative areas, not implied legislatures.

**Still unresolved:** 2017 reform statement does not alone prove no subsequent 2026 reform; no complete municipal or advisory inventory claimed.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Finland

Existing regional/territorial rows: **41** — eligible_legislature: 1, outside_default_scope: 40.

**National chamber checklist:** Eduskunta / Riksdagen.

Åland eligible;18 planning councils+21 wellbeing counties+Helsinki excluded.

- Add explicit SámiParliament cultural-self-government scope disposition using ownstatute/officialguide; not territorial parliament merely because namedParliament.
- MaintainÅland distinct from mainland county and Helsinki service arrangements.

**New primary evidence (and actual evidence level):**

- [primary_search_index_current_directory_excerpt_review](https://stat.fi/en/luokitukset/hyvinvointialue/hyvinvointialue_1_20260101): 2026 official classification identifies 21 wellbeing counties plus Helsinki and Åland separately. Existing inventory 21 county+Helsinki+Åland follows correct distinct scope.
- [primary_search_index_excerpt_review](https://www.suomi.fi/citizen/rights-and-participation-in-society/legal-and-consumer-protection/guide/how-finlands-public-administration-works/self-governance): Official guide distinguishes Åland regional parliament legislative power and Sámi linguistic/cultural self-government; add explicit Sámi authority boundary, not automatic parliament eligibility.

**Still unresolved:** Fresh 2026 wellbeingclassification reconciles 21 counties;18 regionalplanningcouncil names remain retained not fully refreshed. Sámi delegated legal powers need precise authority standard before finalexclude/include.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## France

Existing regional/territorial rows: **27** — outside_default_scope: 14, specific_authority_evidence_hold: 3, eligible_legislature: 10.

**National chamber checklist:** Assemblée nationale; Sénat.

27 regional/specialinstitution rows;10 eligible,14 excluded,3 authorityholds retained.

- Correct Conseil départemental de Mayotte to Assemblée de Mayotte, Département-Région from 1 Jan 2026; retain formernamealias/history.
- Add explicit TAAF/Clipperton consultative exclusions; special territory list must include these even with no elected regionalparliament.
- Keep 3 NewCaledonian provincialassemblies separately from Congress; do not duplicate Guyane/Martinique with abolishedparallelcouncils.

**New primary evidence (and actual evidence level):**

- [primary_statute_full_article_review](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000052092585/2026-01-01): CGCT L 7311-4 effective 1 Jan 2026 replaces departmental/regional council references with assemblée de Mayotte and territory with Département-Région. Existing Conseil départemental de Mayotte name needs current-name correction.
- [primary_search_index_current_directory_excerpt_review](https://www.insee.fr/fr/information/7929497): Official geography explains Mayotte Département-Région 976 R from 1 Jan 2026 and unique authorities of Guyane/Martinique/Corse.
- [primary_search_index_excerpt_review](https://taaf.fr/collectivites/conseil-consultatif/): Own TAAF page identifies consultative council; record explicit special-territory exclusion, not representative legislature.
- [primary_search_index_excerpt_review](https://www.assemblee-nationale.fr/dyn/dyn/contenu/visualisation/1089992/file/8-Jaune2026_Commissions.pdf): 2026 National Assembly budget annex identifies Clipperton consultative council created 13 Dec 2023; add explicit auxiliary-scope disposition.

**Still unresolved:** Corsica/Guyane/Martinique specificauthorityholds persist; legislative reform proposals are not enactedlaw. Ordinarydepartmental/specialmunicipal institutions Lyon/Paris/Alsace need explicit scope boundary; not automatically regionallegislatures.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Germany

Existing regional/territorial rows: **16** — eligible_legislature: 16.

**National chamber checklist:** Deutscher Bundestag; Bundesrat.

All 16 stateparliaments matched against fresh federal directory.

- Normalize 4 geographic placeholders to LandtagBrandenburg, LandtagNordrhein-Westfalen, AbgeordnetenhausvonBerlin, LandtagvonSachsen-Anhalt.
- BremenStadtbürgerschaft municipal capacity remains distinct from stateBürgerschaft; nationalBundesrat is not a 17 thregionalparliament.

**New primary evidence (and actual evidence level):**

- [primary_search_index_current_directory_excerpt_review](https://bundeswahlleiterin.de/service/landtagswahlen.html): Federal election authority names all 16 Länder and proper parliamentary classes; existing 16 state rows reconcile.
- [primary_search_index_excerpt_review](https://www.bundestag.de/parlament/wahlen/wahltermine/): Bundestag current election calendar reinforces all 16 state parliament coverage and national federal distinction.

**Still unresolved:** Council/election assemblies and committee rooms not extra permanent chambers; no service completeness inferred.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Ghana

Existing regional/territorial rows: **0** — .

**National chamber checklist:** Parliament.

No core regional legislature; regionalcoordinatingcouncils administrative.

- Create explicit 16 RCCadministrative exclusions from primaryentitydirectory if the master intends allfirst-level bodies; currently only country-level exclusion.

**New primary evidence (and actual evidence level):**

- [primary_search_index_excerpt_review](https://arcc.gov.gh/): Official Ashanti RCC framework identifies administrative/coordinating function under Act 936; no regional parliament inferred.
- [primary_search_index_directory_excerpt_review](https://ppa.gov.gh/procurement-centre/entity-categorization/): Primary public-procurement entity directory names 16 RCCs; useful explicit administrative exclusion inventory, not 16 legislatures.

**Still unresolved:** Districtassemblies hold statutorylocalpowers but are second/local tier outside currentcore; indigenouschiefs bodies not automatically territoriallegislatures.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.

## Greece

Existing regional/territorial rows: **13** — outside_default_scope: 13.

**National chamber checklist:** Vouli ton Ellinon.

13 regionalcouncils excluded; MountAthos special-status boundary missing.

- Add HolyCommunity ofMountAthos as specificauthority-review candidate linked to Greece/selfgovernedmonasticterritory; constitution 105 establishes administration/Charterstructure, not automatic parliamentaryeligibility.

**New primary evidence (and actual evidence level):**

- [primary_constitution_full_article_review](https://www.hellenicparliament.gr/vouli-ton-ellinon/to-politevma/syntagma/article-109/): Constitution 105 explicitly establishes self-governed Mount Athos and Holy Community administration; Charter drawn/voted by 20 monasteries and ratified by Patriarchate/national Parliament. Create specific special-status authority review; do not equate internal monastic administration with eligible territorial parliament.

**Still unresolved:** Examine Charterallocation ofgeneralrulemaking versusreligiousadministration before finaldisposition; no neweligiblebody claimed.

The JSON preserves existing named rows, IDs, eligibility, canonical national services and retained framework URLs. Retained URLs are not a claim of fresh website inspection.
