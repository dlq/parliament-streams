(() => {
const locales = [
  ["en", "English"], ["fr", "Français"], ["es", "Español"], ["pt-BR", "Português (Brasil)"],
  ["da", "Dansk"], ["de", "Deutsch"], ["et", "Eesti"], ["el", "Ελληνικά"],
  ["hi", "हिन्दी"], ["ga", "Gaeilge"], ["it", "Italiano"], ["lb", "Lëtzebuergesch"], ["nl", "Nederlands"], ["nb", "Norsk bokmål"], ["sk", "Slovenčina"],
  ["th", "ไทย"], ["zh-Hans", "中文（简体）"], ["iu-Cans", "ᐃᓄᒃᑎᑐᑦ"], ["mi", "te reo Māori"],
];

const en = {
  skipCatalogue: "Skip to catalogue", brandHome: "Parliament Streams home", primaryNavigation: "Primary navigation",
  catalogueResults: "Catalogue results", catalogueTable: "Parliament stream catalogue",
  selectSource: "Select a source to view its documentation.", resizeDetails: "Resize source details",
  sortAscending: "ascending", sortDescending: "descending", playbackError: "Playback could not start in this browser.",
  nav: "Catalogue", language: "Language", research: "Public research catalogue",
  title: "Parliamentary video, documented.",
  lede: "Official stream endpoints, watch pages, schedule surfaces, and the evidence needed to judge how each source may be used.",
  browse: "Browse sources", catalogue: "Catalogue", json: "View source JSON", search: "Search country, legislature, or channel", filters: "Filters", close: "Close source details",
  catalogueCoverage: "Catalogue coverage",
  metricSources: "Sources", metricPlayable: "Playable here", metricSchedules: "Schedule sources", metricUpdated: "Catalogue updated",
  evidenceDates: "Evidence dates", notAvailable: "Not available",
  principlesLabel: "Open stream principles", principleDelivery: "Open delivery", principleAccess: "Open access", principleReuse: "Open reuse", principleSchedules: "Open schedules", principleAccessibility: "Open accessibility",
  allJur: "All jurisdictions", allTypes: "All source types",
  source: "Source", jurisdiction: "Jurisdiction", mode: "Mode", format: "Format", contentLanguage: "Language", access: "Access", use: "Use",
  care: "Use with care", methodTitle: "Technical access and provider terms are different questions.",
  methodCopy: "Technically validated public direct feeds play here unless recorded terms expressly prohibit third-party reuse. A play button is not a licence; source owners can request removal.",
  rights: "Read rights and permission notes", footer: "Parliament Streams is an independent research catalogue.", about: "About the project",
  openStreams: "Open stream principles",
  openVideoCopy: "Open parliamentary video requires direct, interoperable streams such as HLS, with clear terms that permit embedding, rebroadcasting, preservation, and independent monitoring.",
  openStreamsCopy: "Open parliamentary video also needs open schedule data. Legislatures should publish timely, machine-readable programme and event feeds at stable URLs, with clear reuse terms, persistent identifiers, time zones, and prompt corrections.",
  sourceType: "Source type", sourceKind: "Source kind", accessStatus: "Access status", stabilityRisk: "Stability risk", playbackPolicy: "Playback", useGuidance: "Use guidance", availability: "Availability",
  accessValidatedDescription: "Latest retained validation succeeded.",
  accessNeedsReviewDescription: "Technical access needs review or the latest check was not clean.",
  accessLinkOnlyDescription: "No native playback URL is recorded; use the official page.",
  useExplicitDescription: "Reuse appears permitted under recorded source conditions.",
  useEmbedOnlyDescription: "Use the official provider or institutional embed only.",
  useNoThirdPartyDescription: "Recorded terms require link-out or separate permission.",
  usePersonalPendingDescription: "Public terms do not yet clearly support third-party use.",
  useNoncommercialPendingDescription: "Some non-commercial use is documented, but full-stream playback still needs clarification.",
  attribution: "Required attribution", programme: "Current programme record", identity: "External identity", schedule: "Schedule / EPG sources",
  fallbackDirectoryLabel: "Fallback sources", fallbackDirectoryTitle: "Official pages for event-based coverage", noFallbacks: "No fallback sources recorded.",
  fallbacks: "Official fallbacks",
  fallbackEventPlatform: "Event platform", fallbackLivePage: "Official live page", fallbackYoutubeLive: "YouTube live", fallbackYoutubeUploads: "YouTube uploads",
  fallbackArchive: "Archive", fallbackBroadcaster: "Broadcaster", fallbackLinkOut: "Link out", fallbackProviderEmbed: "Provider embed",
  fallbackEventResolver: "Event resolver planned", fallbackScheduleSource: "Schedule source", fallbackNowNext: "Now/next possible", fallbackNoSchedule: "No schedule role",
  sourcePlayable: "Playable", sourceLinkOut: "Link-out", sourceFallback: "Fallback", sourceResearch: "Research",
  latestValidation: "Latest validation", validationNotRecorded: "No retained validation report yet.",
  validationChecked: "Checked {date}", validationMethod: "Method", validationReport: "Report",
  staticHttpValidation: "Static HTTP", browserPlayerValidation: "Browser/player", manifestSeedValidation: "Manifest seed", reviewFollowupValidation: "Review follow-up",
  mediaAccessibility: "Media accessibility", captions: "Captions", signLanguage: "Sign language", audioDescription: "Audio description",
  a11yAvailable: "Available", a11ySourceDependent: "Varies by source or event", a11yUnavailable: "Unavailable", a11yUnknown: "Not yet verified",
  scheduleApi: "Schedule API", openScheduleData: "Open schedule data", calendarAgenda: "Calendar / agenda", liveSchedulePage: "Live schedule page", schedulePage: "Schedule page",
  officialEvidence: "Official watch page", streamEvidence: "Recorded stream endpoint", rightsEvidence: "Rights / source terms", privacyEvidence: "Privacy policy", supportingEvidence: "Supporting source",
  evidenceSources: "Evidence sources.", englishResearchNotes: "Catalogue research notes",
  nowProgramme: "Now:", nextProgramme: "Next:", scheduleCollected: "Schedule collected {date}",
  reuse: "Catalogue rights summary.", recommendation: "Catalogue recommendation.", watch: "Watch here", official: "Open official source",
  ready: "Ready to load the official feed", disabled: "Playback is not enabled for this source",
  optOutPlaybackPolicy: "This public endpoint is playable under the catalogue’s opt-out policy. This is not a licence; review the source notes and report concerns for prompt removal.",
  youtubePlaybackPolicy: "Playback uses the provider’s official privacy-enhanced embed; no stream manifest is extracted.",
  noResults: "No catalogue entries match these filters.", noSchedule: "No schedule surface recorded.",
  sourceError: "The catalogue could not be loaded.", sourceErrorDetail: "The static site expects data/channels.json beside the page artifact.",
  results: "{shown} of {total} sources", documented: "{count} documented sources · catalogue generated {date}",
  labels: {
    direct_hls: "HLS", direct_dash: "DASH", official_page: "Official page", youtube: "YouTube",
    first_party_hls: "First-party HLS", official_vendor_hls: "Official vendor HLS",
    third_party_relay_hls: "Third-party relay HLS", direct_dash_research: "DASH research",
    official_youtube_embed: "Official YouTube embed",
    native_playback: "Native playback", provider_embed: "Provider embed", link_out: "Link-out", research_only: "Research only",
    validated: "Verified", needs_review: "Review", link_only: "Page only",
    low: "Low", medium: "Medium", high: "High", unknown: "Unknown",
    national: "National", subnational: "Subnational", supranational: "Supranational",
    personal_use_pending_review: "Unclear", noncommercial_pending_review: "Limited",
    explicit_reuse_with_conditions: "With conditions", embed_only: "Official embed", no_third_party_reuse: "No reuse",
    always_on: "Always on", sitting_only: "Sitting only", event_based: "Event based",
    ok: "OK", warning: "Warning", error: "Error", skipped: "Skipped",
  },
};

const shared = {
  fr: { nav: "Catalogue", language: "Langue", research: "Catalogue de recherche public", title: "La vidéo parlementaire, documentée.", lede: "Points d'accès officiels, pages de visionnement, sources d'horaire et éléments nécessaires pour comprendre l'usage de chaque source.", browse: "Parcourir les sources", json: "Voir le JSON source", search: "Rechercher un pays, un parlement ou une chaîne", allJur: "Toutes les juridictions", allTypes: "Tous les types de source", allUse: "Toutes les indications d'usage", source: "Source", jurisdiction: "Juridiction", format: "Format", contentLanguage: "Langue", access: "Accès", use: "Usage", care: "À utiliser avec prudence", methodTitle: "L'accès technique et les conditions du fournisseur sont deux questions distinctes.", methodCopy: "Les flux directs publics validés techniquement sont lisibles ici sauf si les conditions enregistrées interdisent expressément la réutilisation par un tiers. Un bouton de lecture n'est pas une licence; les titulaires peuvent demander un retrait.", rights: "Lire les notes sur les droits et autorisations", footer: "Parliament Streams est un catalogue de recherche indépendant.", about: "À propos du projet", sourceType: "Type de source", accessStatus: "État d'accès", useGuidance: "Indication d'usage", availability: "Disponibilité", attribution: "Attribution requise", programme: "Programme en cours", schedule: "Sources d'horaire / EPG", reuse: "Note de réutilisation.", recommendation: "Recommandation du catalogue.", watch: "Regarder ici", official: "Ouvrir la source officielle", ready: "Prêt à charger le flux officiel", disabled: "La lecture n'est pas activée pour cette source", noResults: "Aucune entrée du catalogue ne correspond à ces filtres.", noSchedule: "Aucune source d'horaire enregistrée.", sourceError: "Le catalogue n'a pas pu être chargé.", sourceErrorDetail: "Le site statique attend data/channels.json à côté de l'artefact de page.", results: "{shown} sources sur {total}", documented: "{count} sources documentées · catalogue généré le {date}", labels: { official_page: "Page officielle", validated: "Vérifié", needs_review: "À vérifier", link_only: "Page seulement", national: "National", subnational: "Infranational", supranational: "Supranational", personal_use_pending_review: "Incertain", noncommercial_pending_review: "Limité", explicit_reuse_with_conditions: "Avec conditions", embed_only: "Intégration officielle", no_third_party_reuse: "Aucune réutilisation", always_on: "En continu", sitting_only: "Séances seulement", event_based: "Selon l'événement" } },
  es: { nav: "Catálogo", language: "Idioma", research: "Catálogo público de investigación", title: "Vídeo parlamentario, documentado.", lede: "Puntos de acceso oficiales, páginas de visualización, fuentes de programación y la evidencia necesaria para valorar el uso de cada fuente.", browse: "Explorar fuentes", catalogue: "Catálogo", json: "Ver JSON de origen", search: "Buscar país, parlamento o canal", allJur: "Todas las jurisdicciones", allTypes: "Todos los tipos de fuente", allUse: "Todas las pautas de uso", source: "Fuente", jurisdiction: "Jurisdicción", format: "Formato", contentLanguage: "Idioma", access: "Acceso", use: "Uso", care: "Usar con cuidado", methodTitle: "El acceso técnico y las condiciones del proveedor son cuestiones distintas.", methodCopy: "Las fuentes directas públicas validadas técnicamente se reproducen aquí salvo que las condiciones registradas prohíban expresamente la reutilización por terceros. Un botón de reproducción no es una licencia; los titulares pueden solicitar su retirada.", rights: "Leer notas sobre derechos y permisos", footer: "Parliament Streams es un catálogo de investigación independiente.", about: "Acerca del proyecto", sourceType: "Tipo de fuente", accessStatus: "Estado de acceso", useGuidance: "Pauta de uso", availability: "Disponibilidad", attribution: "Atribución requerida", programme: "Programa actual", schedule: "Fuentes de programación / EPG", reuse: "Nota de reutilización.", recommendation: "Recomendación del catálogo.", watch: "Ver aquí", official: "Abrir fuente oficial", ready: "Listo para cargar la fuente oficial", disabled: "La reproducción no está activada para esta fuente", noResults: "Ninguna entrada del catálogo coincide con estos filtros.", noSchedule: "No se registró ninguna fuente de programación.", sourceError: "No se pudo cargar el catálogo.", sourceErrorDetail: "El sitio estático espera data/channels.json junto al artefacto de página.", results: "{shown} de {total} fuentes", documented: "{count} fuentes documentadas · catálogo generado el {date}", labels: { official_page: "Página oficial", validated: "Verificado", needs_review: "Revisión", link_only: "Solo página", national: "Nacional", subnational: "Subnacional", supranational: "Supranacional", personal_use_pending_review: "No claro", noncommercial_pending_review: "Limitado", explicit_reuse_with_conditions: "Con condiciones", embed_only: "Inserción oficial", no_third_party_reuse: "Sin reutilización", always_on: "Siempre activo", sitting_only: "Solo sesiones", event_based: "Por evento" } },
  "pt-BR": { nav: "Catálogo", language: "Idioma", research: "Catálogo público de pesquisa", title: "Vídeo parlamentar, documentado.", lede: "Endpoints oficiais, páginas de transmissão, fontes de programação e as evidências necessárias para avaliar o uso de cada fonte.", browse: "Explorar fontes", catalogue: "Catálogo", json: "Ver JSON de origem", search: "Pesquisar país, parlamento ou canal", allJur: "Todas as jurisdições", allTypes: "Todos os tipos de fonte", allUse: "Todas as orientações de uso", source: "Fonte", jurisdiction: "Jurisdição", format: "Formato", contentLanguage: "Idioma", access: "Acesso", use: "Uso", care: "Use com cuidado", methodTitle: "O acesso técnico e os termos do provedor são questões diferentes.", methodCopy: "Feeds públicos diretos validados tecnicamente são reproduzidos aqui, salvo quando os termos registrados proíbem expressamente a reutilização por terceiros. Um botão de reprodução não é uma licença; os responsáveis podem solicitar remoção.", rights: "Ler notas sobre direitos e permissões", footer: "Parliament Streams é um catálogo de pesquisa independente.", about: "Sobre o projeto", sourceType: "Tipo de fonte", accessStatus: "Status de acesso", useGuidance: "Orientação de uso", availability: "Disponibilidade", attribution: "Atribuição obrigatória", programme: "Programa atual", schedule: "Fontes de programação / EPG", reuse: "Nota de reutilização.", recommendation: "Recomendação do catálogo.", watch: "Assistir aqui", official: "Abrir fonte oficial", ready: "Pronto para carregar o feed oficial", disabled: "A reprodução não está ativada para esta fonte", noResults: "Nenhuma entrada do catálogo corresponde a estes filtros.", noSchedule: "Nenhuma fonte de programação registrada.", sourceError: "Não foi possível carregar o catálogo.", sourceErrorDetail: "O site estático espera data/channels.json ao lado do artefato da página.", results: "{shown} de {total} fontes", documented: "{count} fontes documentadas · catálogo gerado em {date}", labels: { official_page: "Página oficial", validated: "Verificado", needs_review: "Revisar", link_only: "Somente página", national: "Nacional", subnational: "Subnacional", supranational: "Supranacional", personal_use_pending_review: "Incerto", noncommercial_pending_review: "Limitado", explicit_reuse_with_conditions: "Com condições", embed_only: "Incorporação oficial", no_third_party_reuse: "Sem reutilização", always_on: "Sempre ativo", sitting_only: "Somente sessões", event_based: "Por evento" } },
  de: { nav: "Katalog", language: "Sprache", research: "Öffentlicher Forschungskatalog", title: "Parlamentsvideo, dokumentiert.", lede: "Offizielle Stream-Endpunkte, Wiedergabeseiten, Programmquellen und die Belege zur Bewertung der Nutzung jeder Quelle.", browse: "Quellen durchsuchen", catalogue: "Katalog", json: "Quell-JSON anzeigen", search: "Land, Parlament oder Kanal suchen", allJur: "Alle Zuständigkeiten", allTypes: "Alle Quelltypen", allUse: "Alle Nutzungshinweise", source: "Quelle", jurisdiction: "Zuständigkeit", format: "Format", contentLanguage: "Sprache", access: "Zugang", use: "Nutzung", care: "Mit Bedacht verwenden", methodTitle: "Technischer Zugang und Anbieterbedingungen sind unterschiedliche Fragen.", methodCopy: "Technisch validierte öffentliche Direktfeeds werden hier abgespielt, sofern die erfassten Bedingungen die Nutzung durch Dritte nicht ausdrücklich verbieten. Eine Wiedergabetaste ist keine Lizenz; Rechteinhaber können Entfernung verlangen.", rights: "Hinweise zu Rechten und Genehmigungen lesen", footer: "Parliament Streams ist ein unabhängiger Forschungskatalog.", about: "Über das Projekt", sourceType: "Quelltyp", accessStatus: "Zugangsstatus", useGuidance: "Nutzungshinweis", availability: "Verfügbarkeit", attribution: "Erforderliche Namensnennung", programme: "Aktuelles Programm", schedule: "Programmquellen / EPG", reuse: "Hinweis zur Wiederverwendung.", recommendation: "Katalogempfehlung.", watch: "Hier ansehen", official: "Offizielle Quelle öffnen", ready: "Bereit zum Laden des offiziellen Feeds", disabled: "Wiedergabe ist für diese Quelle nicht aktiviert", noResults: "Keine Katalogeinträge entsprechen diesen Filtern.", noSchedule: "Keine Programmquelle erfasst.", sourceError: "Der Katalog konnte nicht geladen werden.", sourceErrorDetail: "Die statische Seite erwartet data/channels.json neben dem Seitenartefakt.", results: "{shown} von {total} Quellen", documented: "{count} dokumentierte Quellen · Katalog erstellt am {date}", labels: { official_page: "Offizielle Seite", validated: "Bestätigt", needs_review: "Prüfung", link_only: "Nur Seite", national: "National", subnational: "Subnational", supranational: "Supranational", personal_use_pending_review: "Unklar", noncommercial_pending_review: "Eingeschränkt", explicit_reuse_with_conditions: "Mit Bedingungen", embed_only: "Offizielle Einbettung", no_third_party_reuse: "Keine Wiederverwendung", always_on: "Dauerhaft", sitting_only: "Nur Sitzungen", event_based: "Ereignisbasiert" } },
  it: { nav: "Catalogo", language: "Lingua", research: "Catalogo pubblico di ricerca", title: "Video parlamentare, documentato.", lede: "Endpoint ufficiali, pagine di visione, fonti di programmazione e prove per valutare l'uso di ogni fonte.", browse: "Esplora fonti", catalogue: "Catalogo", json: "Visualizza JSON sorgente", search: "Cerca paese, parlamento o canale", allJur: "Tutte le giurisdizioni", allTypes: "Tutti i tipi di fonte", allUse: "Tutte le indicazioni d'uso", source: "Fonte", jurisdiction: "Giurisdizione", format: "Formato", contentLanguage: "Lingua", access: "Accesso", use: "Uso", care: "Usare con cautela", methodTitle: "L'accesso tecnico e i termini del fornitore sono questioni diverse.", methodCopy: "I feed diretti pubblici convalidati tecnicamente sono riproducibili qui salvo che i termini registrati vietino espressamente il riuso da parte di terzi. Un pulsante di riproduzione non è una licenza; i titolari possono richiedere la rimozione.", rights: "Leggi le note su diritti e autorizzazioni", footer: "Parliament Streams è un catalogo di ricerca indipendente.", about: "Informazioni sul progetto", sourceType: "Tipo di fonte", accessStatus: "Stato di accesso", useGuidance: "Indicazione d'uso", availability: "Disponibilità", attribution: "Attribuzione richiesta", programme: "Programma attuale", schedule: "Fonti di programmazione / EPG", reuse: "Nota sul riuso.", recommendation: "Raccomandazione del catalogo.", watch: "Guarda qui", official: "Apri fonte ufficiale", ready: "Pronto a caricare il feed ufficiale", disabled: "La riproduzione non è abilitata per questa fonte", noResults: "Nessuna voce del catalogo corrisponde a questi filtri.", noSchedule: "Nessuna fonte di programmazione registrata.", sourceError: "Impossibile caricare il catalogo.", sourceErrorDetail: "Il sito statico richiede data/channels.json accanto all'artefatto della pagina.", results: "{shown} di {total} fonti", documented: "{count} fonti documentate · catalogo generato il {date}", labels: { official_page: "Pagina ufficiale", validated: "Verificato", needs_review: "Da rivedere", link_only: "Solo pagina", national: "Nazionale", subnational: "Subnazionale", supranational: "Sovranazionale", personal_use_pending_review: "Non chiaro", noncommercial_pending_review: "Limitato", explicit_reuse_with_conditions: "Con condizioni", embed_only: "Incorporamento ufficiale", no_third_party_reuse: "Nessun riuso", always_on: "Sempre attivo", sitting_only: "Solo sedute", event_based: "In base all'evento" } },
};

Object.assign(shared, {
  da: { nav: "Katalog", language: "Sprog", research: "Offentligt forskningskatalog", title: "Parlamentarisk video, dokumenteret.", lede: "Officielle streamendepunkter, afspilningssider, programkilder og dokumentationen der skal til for at vurdere brugen af hver kilde.", browse: "Gennemse kilder", catalogue: "Katalog", json: "Vis kilde-JSON", search: "Søg efter land, parlament eller kanal", jurisdiction: "Jurisdiktion", sourceType: "Kildetype", useGuidance: "Vejledning om brug", source: "Kilde", format: "Format", contentLanguage: "Sprog", access: "Adgang", use: "Brug", care: "Brug med omtanke", methodTitle: "Teknisk adgang og udbyderens vilkår er forskellige spørgsmål.", methodCopy: "Teknisk validerede offentlige direkte feeds afspilles her, medmindre de registrerede vilkår udtrykkeligt forbyder tredjepartsbrug. En afspilningsknap er ikke en licens; rettighedshavere kan anmode om fjernelse.", rights: "Læs noter om rettigheder og tilladelser", footer: "Parliament Streams er et uafhængigt forskningskatalog.", about: "Om projektet", watch: "Se her", official: "Åbn officiel kilde", noResults: "Ingen katalogposter matcher disse filtre.", results: "{shown} af {total} kilder", documented: "{count} dokumenterede kilder · katalog genereret {date}", labels: { official_page: "Officiel side", validated: "Bekræftet", needs_review: "Til gennemgang", link_only: "Kun side", national: "National", subnational: "Subnational", supranational: "Overnational", personal_use_pending_review: "Uklar", noncommercial_pending_review: "Begrænset", explicit_reuse_with_conditions: "Med vilkår", embed_only: "Officiel indlejring", no_third_party_reuse: "Ingen genbrug", always_on: "Altid aktiv", sitting_only: "Kun møder", event_based: "Begivenhedsbaseret" } },
  et: { nav: "Kataloog", language: "Keel", research: "Avalik uurimiskataloog", title: "Parlamendivideo, dokumenteeritud.", lede: "Ametlikud voogedastuslõpp-punktid, vaatamislehed, ajakavade allikad ja tõendid iga allika kasutamise hindamiseks.", browse: "Sirvi allikaid", catalogue: "Kataloog", json: "Vaata lähte-JSONi", search: "Otsi riiki, parlamenti või kanalit", jurisdiction: "Jurisdiktsioon", sourceType: "Allika tüüp", useGuidance: "Kasutusjuhis", source: "Allikas", format: "Vorming", contentLanguage: "Keel", access: "Juurdepääs", use: "Kasutus", care: "Kasuta ettevaatlikult", methodTitle: "Tehniline juurdepääs ja teenusepakkuja tingimused on eri küsimused.", methodCopy: "Tehniliselt kinnitatud avalikke otsevooge saab siin esitada, kui registreeritud tingimused ei keela sõnaselgelt kolmanda osapoole kasutust. Esitusnupp ei ole litsents; õiguste omanikud võivad paluda eemaldamist.", rights: "Loe õiguste ja lubade märkmeid", footer: "Parliament Streams on sõltumatu uurimiskataloog.", about: "Projektist", watch: "Vaata siin", official: "Ava ametlik allikas", noResults: "Ükski kataloogikirje ei vasta filtritele.", results: "{shown} / {total} allikat", documented: "{count} dokumenteeritud allikat · kataloog loodud {date}", labels: { official_page: "Ametlik leht", validated: "Kontrollitud", needs_review: "Ülevaatus", link_only: "Ainult leht", national: "Riiklik", subnational: "Allriiklik", supranational: "Üleriigiline", personal_use_pending_review: "Ebaselge", noncommercial_pending_review: "Piiratud", explicit_reuse_with_conditions: "Tingimustega", embed_only: "Ametlik manustamine", no_third_party_reuse: "Taaskasutus puudub", always_on: "Alati aktiivne", sitting_only: "Ainult istungid", event_based: "Sündmusepõhine" } },
  el: { nav: "Κατάλογος", language: "Γλώσσα", research: "Δημόσιος ερευνητικός κατάλογος", title: "Κοινοβουλευτικό βίντεο, τεκμηριωμένο.", lede: "Επίσημα σημεία ροής, σελίδες παρακολούθησης, πηγές προγράμματος και τα στοιχεία που απαιτούνται για την αξιολόγηση της χρήσης κάθε πηγής.", browse: "Περιήγηση στις πηγές", catalogue: "Κατάλογος", json: "Προβολή πηγαίου JSON", search: "Αναζήτηση χώρας, κοινοβουλίου ή καναλιού", jurisdiction: "Δικαιοδοσία", sourceType: "Τύπος πηγής", useGuidance: "Οδηγία χρήσης", source: "Πηγή", format: "Μορφή", contentLanguage: "Γλώσσα", access: "Πρόσβαση", use: "Χρήση", care: "Χρήση με προσοχή", methodTitle: "Η τεχνική πρόσβαση και οι όροι του παρόχου είναι διαφορετικά ζητήματα.", methodCopy: "Οι τεχνικά επαληθευμένες δημόσιες απευθείας ροές παίζουν εδώ, εκτός αν οι καταγεγραμμένοι όροι απαγορεύουν ρητά τη χρήση από τρίτους. Ένα κουμπί αναπαραγωγής δεν είναι άδεια· οι κάτοχοι δικαιωμάτων μπορούν να ζητήσουν αφαίρεση.", rights: "Διαβάστε σημειώσεις για δικαιώματα και άδειες", footer: "Το Parliament Streams είναι ανεξάρτητος ερευνητικός κατάλογος.", about: "Σχετικά με το έργο", watch: "Παρακολούθηση εδώ", official: "Άνοιγμα επίσημης πηγής", noResults: "Δεν υπάρχουν καταχωρίσεις που να ταιριάζουν με αυτά τα φίλτρα.", results: "{shown} από {total} πηγές", documented: "{count} τεκμηριωμένες πηγές · κατάλογος δημιουργήθηκε {date}", labels: { official_page: "Επίσημη σελίδα", validated: "Επαληθευμένο", needs_review: "Έλεγχος", link_only: "Μόνο σελίδα", national: "Εθνικό", subnational: "Υποεθνικό", supranational: "Υπερεθνικό", personal_use_pending_review: "Ασαφές", noncommercial_pending_review: "Περιορισμένο", explicit_reuse_with_conditions: "Με όρους", embed_only: "Επίσημη ενσωμάτωση", no_third_party_reuse: "Χωρίς επαναχρήση", always_on: "Πάντα ενεργό", sitting_only: "Μόνο συνεδριάσεις", event_based: "Βάσει εκδήλωσης" } },
  hi: { nav: "कैटलॉग", language: "भाषा", research: "सार्वजनिक शोध कैटलॉग", title: "संसदीय वीडियो, प्रलेखित।", lede: "आधिकारिक स्ट्रीम एंडपॉइंट, देखने के पृष्ठ, कार्यक्रम स्रोत और प्रत्येक स्रोत के उपयोग का आकलन करने के लिए आवश्यक प्रमाण।", browse: "स्रोत देखें", catalogue: "कैटलॉग", json: "स्रोत JSON देखें", search: "देश, विधायिका या चैनल खोजें", jurisdiction: "न्यायाधिकार", sourceType: "स्रोत प्रकार", useGuidance: "उपयोग मार्गदर्शन", source: "स्रोत", format: "प्रारूप", contentLanguage: "भाषा", access: "पहुंच", use: "उपयोग", care: "सावधानी से उपयोग करें", methodTitle: "तकनीकी पहुंच और प्रदाता की शर्तें अलग प्रश्न हैं।", methodCopy: "तकनीकी रूप से सत्यापित सार्वजनिक प्रत्यक्ष फ़ीड यहां चलती हैं, जब तक दर्ज शर्तें तृतीय-पक्ष उपयोग को स्पष्ट रूप से प्रतिबंधित न करें। प्ले बटन लाइसेंस नहीं है; अधिकार-धारक हटाने का अनुरोध कर सकते हैं।", rights: "अधिकार और अनुमति नोट पढ़ें", footer: "Parliament Streams एक स्वतंत्र शोध कैटलॉग है।", about: "परियोजना के बारे में", watch: "यहां देखें", official: "आधिकारिक स्रोत खोलें", noResults: "कोई कैटलॉग प्रविष्टि इन फ़िल्टरों से मेल नहीं खाती।", results: "{shown} / {total} स्रोत", documented: "{count} प्रलेखित स्रोत · कैटलॉग {date} को बनाया गया", labels: { official_page: "आधिकारिक पृष्ठ", validated: "सत्यापित", needs_review: "समीक्षा", link_only: "केवल पृष्ठ", national: "राष्ट्रीय", subnational: "उप-राष्ट्रीय", supranational: "अधिराष्ट्रीय", personal_use_pending_review: "अस्पष्ट", noncommercial_pending_review: "सीमित", explicit_reuse_with_conditions: "शर्तों सहित", embed_only: "आधिकारिक एम्बेड", no_third_party_reuse: "पुन: उपयोग नहीं", always_on: "हमेशा सक्रिय", sitting_only: "केवल बैठकें", event_based: "कार्यक्रम आधारित" } },
  nl: { nav: "Catalogus", language: "Taal", research: "Openbare onderzoekscatalogus", title: "Parlementaire video, gedocumenteerd.", lede: "Officiële streamendpoints, kijkpagina's, programmabronnen en het bewijs dat nodig is om het gebruik van elke bron te beoordelen.", browse: "Bronnen bekijken", catalogue: "Catalogus", json: "Bron-JSON bekijken", search: "Zoek land, parlement of kanaal", jurisdiction: "Jurisdictie", sourceType: "Brontype", useGuidance: "Gebruiksrichtlijn", source: "Bron", format: "Formaat", contentLanguage: "Taal", access: "Toegang", use: "Gebruik", care: "Voorzichtig gebruiken", methodTitle: "Technische toegang en voorwaarden van de aanbieder zijn verschillende vragen.", methodCopy: "Technisch gevalideerde openbare directe feeds spelen hier af, tenzij geregistreerde voorwaarden hergebruik door derden uitdrukkelijk verbieden. Een afspeelknop is geen licentie; rechthebbenden kunnen verwijdering verzoeken.", rights: "Lees notities over rechten en toestemming", footer: "Parliament Streams is een onafhankelijke onderzoekscatalogus.", about: "Over het project", watch: "Hier bekijken", official: "Officiële bron openen", noResults: "Geen catalogusitems komen overeen met deze filters.", results: "{shown} van {total} bronnen", documented: "{count} gedocumenteerde bronnen · catalogus gegenereerd {date}", labels: { official_page: "Officiële pagina", validated: "Geverifieerd", needs_review: "Beoordeling", link_only: "Alleen pagina", national: "Nationaal", subnational: "Subnationaal", supranational: "Supranationaal", personal_use_pending_review: "Onduidelijk", noncommercial_pending_review: "Beperkt", explicit_reuse_with_conditions: "Met voorwaarden", embed_only: "Officiële insluiting", no_third_party_reuse: "Geen hergebruik", always_on: "Altijd actief", sitting_only: "Alleen zittingen", event_based: "Gebeurtenisgebonden" } },
  nb: { nav: "Katalog", language: "Språk", research: "Offentlig forskningskatalog", title: "Parlamentarisk video, dokumentert.", lede: "Offisielle strømmeendepunkter, visningssider, programkilder og dokumentasjonen som trengs for å vurdere bruken av hver kilde.", browse: "Bla gjennom kilder", catalogue: "Katalog", json: "Vis kilde-JSON", search: "Søk etter land, parlament eller kanal", jurisdiction: "Jurisdiksjon", sourceType: "Kildetype", useGuidance: "Bruksveiledning", source: "Kilde", format: "Format", contentLanguage: "Språk", access: "Tilgang", use: "Bruk", care: "Bruk med omtanke", methodTitle: "Teknisk tilgang og leverandørvilkår er forskjellige spørsmål.", methodCopy: "Teknisk validerte offentlige direktefeeder spilles her med mindre registrerte vilkår uttrykkelig forbyr tredjepartsbruk. En avspillingsknapp er ikke en lisens; rettighetshavere kan be om fjerning.", rights: "Les merknader om rettigheter og tillatelser", footer: "Parliament Streams er en uavhengig forskningskatalog.", about: "Om prosjektet", watch: "Se her", official: "Åpne offisiell kilde", noResults: "Ingen katalogoppføringer samsvarer med disse filtrene.", results: "{shown} av {total} kilder", documented: "{count} dokumenterte kilder · katalog generert {date}", labels: { official_page: "Offisiell side", validated: "Bekreftet", needs_review: "Gjennomgang", link_only: "Bare side", national: "Nasjonal", subnational: "Subnasjonal", supranational: "Overnasjonal", personal_use_pending_review: "Uklart", noncommercial_pending_review: "Begrenset", explicit_reuse_with_conditions: "Med vilkår", embed_only: "Offisiell innebygging", no_third_party_reuse: "Ingen gjenbruk", always_on: "Alltid aktiv", sitting_only: "Bare møter", event_based: "Hendelsesbasert" } },
  th: { nav: "แคตตาล็อก", language: "ภาษา", research: "แคตตาล็อกการวิจัยสาธารณะ", title: "วิดีโอรัฐสภา พร้อมเอกสารประกอบ", lede: "จุดปลายทางสตรีมอย่างเป็นทางการ หน้ารับชม แหล่งตารางรายการ และหลักฐานสำหรับประเมินการใช้แต่ละแหล่ง", browse: "เรียกดูแหล่งข้อมูล", catalogue: "แคตตาล็อก", json: "ดู JSON ต้นทาง", search: "ค้นหาประเทศ สภานิติบัญญัติ หรือช่อง", jurisdiction: "เขตอำนาจ", sourceType: "ประเภทแหล่งข้อมูล", useGuidance: "แนวทางการใช้", source: "แหล่งข้อมูล", format: "รูปแบบ", contentLanguage: "ภาษา", access: "การเข้าถึง", use: "การใช้", care: "ใช้อย่างระมัดระวัง", methodTitle: "การเข้าถึงทางเทคนิคและเงื่อนไขของผู้ให้บริการเป็นคนละเรื่องกัน", methodCopy: "ฟีดสาธารณะโดยตรงที่ผ่านการตรวจสอบทางเทคนิคจะเล่นที่นี่ เว้นแต่เงื่อนไขที่บันทึกไว้ห้ามการใช้โดยบุคคลที่สามอย่างชัดแจ้ง ปุ่มเล่นไม่ใช่ใบอนุญาต และผู้ถือสิทธิ์สามารถขอให้นำออกได้", rights: "อ่านบันทึกสิทธิ์และการอนุญาต", footer: "Parliament Streams เป็นแคตตาล็อกการวิจัยอิสระ", about: "เกี่ยวกับโครงการ", watch: "รับชมที่นี่", official: "เปิดแหล่งข้อมูลทางการ", noResults: "ไม่มีรายการในแคตตาล็อกที่ตรงกับตัวกรองเหล่านี้", results: "{shown} จาก {total} แหล่งข้อมูล", documented: "{count} แหล่งข้อมูลที่มีเอกสาร · สร้างแคตตาล็อก {date}", labels: { official_page: "หน้าทางการ", validated: "ตรวจสอบแล้ว", needs_review: "ต้องตรวจสอบ", link_only: "เฉพาะหน้า", national: "ระดับชาติ", subnational: "ระดับย่อย", supranational: "เหนือรัฐ", personal_use_pending_review: "ไม่ชัดเจน", noncommercial_pending_review: "จำกัด", explicit_reuse_with_conditions: "มีเงื่อนไข", embed_only: "ฝังจากทางการ", no_third_party_reuse: "ห้ามใช้ซ้ำ", always_on: "พร้อมเสมอ", sitting_only: "เฉพาะช่วงประชุม", event_based: "ตามกิจกรรม" } },
  "zh-Hans": { nav: "目录", language: "语言", research: "公共研究目录", title: "议会视频，已记录。", lede: "官方流媒体端点、观看页面、节目表来源，以及评估每个来源使用方式所需的证据。", browse: "浏览来源", catalogue: "目录", json: "查看源 JSON", search: "搜索国家、议会或频道", jurisdiction: "管辖区", sourceType: "来源类型", useGuidance: "使用说明", source: "来源", format: "格式", contentLanguage: "语言", access: "访问", use: "使用", care: "请谨慎使用", methodTitle: "技术访问与提供方条款是不同的问题。", methodCopy: "技术上已验证的公共直接流可在此播放，除非已记录的条款明确禁止第三方使用。播放按钮并非许可；权利持有人可以要求删除。", rights: "阅读权利和许可说明", footer: "Parliament Streams 是独立研究目录。", about: "关于项目", watch: "在此观看", official: "打开官方来源", noResults: "没有目录条目符合这些筛选条件。", results: "{shown} / {total} 个来源", documented: "{count} 个已记录来源 · 目录生成于 {date}", labels: { official_page: "官方页面", validated: "已验证", needs_review: "待审核", link_only: "仅页面", national: "国家级", subnational: "次国家级", supranational: "超国家级", personal_use_pending_review: "不明确", noncommercial_pending_review: "有限", explicit_reuse_with_conditions: "附带条件", embed_only: "官方嵌入", no_third_party_reuse: "不可再利用", always_on: "始终可用", sitting_only: "仅限会议期间", event_based: "按活动" } },
});

Object.assign(shared, {
  mi: {
    skipCatalogue: "Peke ki te putumōhio",
    brandHome: "Kāinga o Parliament Streams",
    primaryNavigation: "Whakatere matua",
    catalogueResults: "Ngā hua putumōhio",
    catalogueTable: "Putumōhio rere pāremata",
    nav: "Putumōhio",
    language: "Reo",
    research: "Putumōhio rangahau tūmatanui",
    title: "Ataata pāremata, kua tuhia.",
    lede: "Ngā pito rere mana, ngā whārangi mātakitaki, ngā puna wātaka, me ngā taunakitanga e hiahiatia ana hei aromatawai i te whakamahinga o ia puna.",
    browse: "Tirotiro puna",
    catalogue: "Putumōhio",
    json: "Tirohia te JSON pūtake",
    search: "Rapua he whenua, he pāremata, he hongere rānei",
    allJur: "Ngā rohe mana katoa",
    allTypes: "Ngā momo puna katoa",
    allUse: "Ngā aratohu whakamahi katoa",
    source: "Puna",
    jurisdiction: "Rohe mana",
    format: "Hōputu",
    contentLanguage: "Reo",
    access: "Uru",
    use: "Whakamahi",
    care: "Kia tūpato te whakamahi",
    methodTitle: "He rerekē te urunga hangarau me ngā tikanga a te kaiwhakarato.",
    methodCopy: "Ka whakaatuhia ki konei ngā whāngai tūmatanui tika kua whakamanahia ā-hangarau, ki te kore e tino aukatihia te whakamahinga a tētahi atu e ngā tikanga kua tuhia. Ehara te pātene purei i te raihana; ka āhei ngā kaipupuri motika te tono kia tangohia.",
    rights: "Pānuihia ngā kōrero mō ngā motika me ngā whakaaetanga",
    footer: "He putumōhio rangahau motuhake a Parliament Streams.",
    about: "Mō te kaupapa",
    sourceType: "Momo puna",
    accessStatus: "Tūnga uru",
    useGuidance: "Aratohu whakamahi",
    availability: "Wātea",
    attribution: "Tohutoro e hiahiatia ana",
    programme: "Hōtaka o nāianei",
    schedule: "Ngā puna wātaka / EPG",
    reuse: "Kōrero whakamahi anō.",
    recommendation: "Tohutohu putumōhio.",
    watch: "Mātakitaki ki konei",
    official: "Whakatuwhera puna mana",
    ready: "Kua reri ki te uta i te whāngai mana",
    disabled: "Kāore te purei e whakahohea mō tēnei puna",
    noResults: "Kāore he urunga putumōhio e taurite ana ki ēnei tātari.",
    noSchedule: "Kāore he puna wātaka kua tuhia.",
    sourceError: "Kāore i taea te uta te putumōhio.",
    sourceErrorDetail: "Ko te tūmanako a te pae pateko ko data/channels.json i te taha o te putanga whārangi.",
    results: "{shown} o ngā puna {total}",
    documented: "{count} puna kua tuhia · i hangaia te putumōhio {date}",
    labels: {
      direct_hls: "HLS", direct_dash: "DASH", official_page: "Whārangi mana", youtube: "YouTube",
      validated: "Kua manatoko", needs_review: "Me arotake", link_only: "Whārangi anake",
      national: "Ā-motu", subnational: "Ā-rohe", supranational: "Ki tua o te motu",
      personal_use_pending_review: "Kāore i te mārama", noncommercial_pending_review: "He iti noa",
      explicit_reuse_with_conditions: "Me ngā here", embed_only: "Whakaurunga mana", no_third_party_reuse: "Kāore he whakamahi anō",
      always_on: "Kei te rere tonu", sitting_only: "I ngā nohoanga anake", event_based: "E ai ki te kaupapa",
    },
  },
  // Best-effort machine translation, pending review by an Inuktitut speaker.
  "iu-Cans": {
    skipCatalogue: "ᐊᓪᓗᕐᓗᒍ ᑎᑎᕋᖅᓯᒪᔪᑦ",
    brandHome: "ᒪᓕᒐᓕᐅᕐᕕᒡᔪᐊᕐᒥ ᑰᑦ ᐊᖏᕐᕋᒧᑦ",
    primaryNavigation: "ᑕᓯᐅᕈᑎᓪᓗᐊᑕᖅ",
    catalogueResults: "ᑎᑎᕋᖅᓯᒪᔪᑦ ᖃᐅᔨᔭᐅᔪᑦ",
    catalogueTable: "ᒪᓕᒐᓕᐅᕐᕕᒡᔪᐊᕐᒥ ᑎᑎᕋᖅᓯᒪᔪᑦ",
    nav: "ᑎᑎᕋᖅᓯᒪᔪᑦ",
    language: "ᐅᖃᐅᓯᖅᑕᖅ",
    research: "ᑭᒃᑯᑐᐃᓐᓇᕐᓄᑦ ᖃᐅᔨᓴᕈᑕᐅᓯᒪᔪᑦ ᑎᑎᕋᖅᓯᒪᔪᑦ",
    title: "ᒪᓕᒐᓕᐅᕐᕕᔾᔪᐊᕐᒥ ᑕᕐᕆᔭᓕᐊᖑᓯᒪᔪᖅ, ᑎᑎᕋᖅᑕᐅᓯᒪᔪᖅ.",
    lede: "ᑕᑯᒃᓴᐅᑎᑦᑎᓂᐅᔪᑦ ᐃᓱᓕᕝᕕᖏᑦ, ᑕᑯᓐᓇᒐᒃᓴᐃᑦ ᒪᒃᐱᒐᖏᑦ, ᐋᖅᑭᒃᓯᒪᓂᖏᑦ, ᐊᒻᒪᓗ ᓇᓗᓇᐃᖅᓯᔾᔪᑎᒃᓴᐃᑦ ᐱᑕᖃᕆᐊᖃᖅᑐᑦ ᖃᐅᔨᓇᓱᐊᕐᓂᕐᒧᑦ ᖃᓄᖅ ᐊᑐᓂ ᑐᑭᓯᒋᐊᕐᕕᒃᓴᐃᑦ ᐊᑐᖅᑕᐅᔪᓐᓇᕐᒪᖔᑕ.",
    browse: "ᕿᓂᕐᓗᑎᑦ ᑐᑭᓯᒋᐊᕐᕕᒃᓴᓂᒃ",
    catalogue: "ᑎᑎᕋᖅᓯᒪᔪᑦ",
    json: "ᑕᑯᓗᒍ ᓇᑭᙶᕐᓂᖓ JSON",
    search: "ᕿᓂᕐᓗᑎᑦ ᓄᓇᕐᔪᐊᕐᒥ, ᒪᓕᒐᓕᐅᕐᕕᖕᒥ, ᐅᕝᕙᓘᓐᓃᑦ ᑕᓚᕖᓴᒃᑯᑦ",
    allJur: "ᑕᒪᕐᒥᒃ ᒐᕙᒪᖃᕐᕕᐅᔪᑦ",
    allTypes: "ᑕᒪᕐᒥᒃ ᑐᖅᑯᖅᑕᐅᓯᒪᔪᑦ ᖃᓄᐃᑦᑑᓂᖏᑦ",
    allUse: "ᑕᒪᐃᓐᓂᒃ ᐊᑐᕐᓂᕐᒧᑦ ᑐᑭᒧᐊᒍᑏᑦ",
    source: "ᓇᑭᙶᕐᕕᒃ",
    jurisdiction: "ᐱᔪᓐᓇᕐᓂᖃᕐᕕᒃ",
    format: "ᐋᖅᑭᒃᓯᒪᓂᖓ",
    contentLanguage: "ᐅᖃᐅᓯᖅᑕᖅ",
    access: "ᐊᑐᐃᓐᓇᖃᕐᓂᖅ",
    use: "ᐊᑐᕐᓗᒍ",
    care: "ᐊᑐᕐᓗᒍ ᐅᔾᔨᖅᓱᑦᑎᐊᕐᓗᓂ",
    methodTitle: "ᖃᕋᓴᐅᔭᒃᑯᑦ ᐊᑐᐃᓐᓇᖃᕐᓂᖅ ᐊᒻᒪᓗ ᐱᔨᑦᑎᕋᖅᑎᐅᑉ ᐅᖃᐅᓯᖏᑦ ᐊᔾᔨᒌᙱᒻᒪᑎᒃ ᐊᐱᖅᑯᑏᑦ.",
    methodCopy: "ᓇᓗᓇᐃᖅᑕᐅᓯᒪᔪᑦ ᑭᒃᑯᑐᐃᓐᓇᕐᓄᑦ ᑐᕌᖓᔪᑦ ᑐᓴᒐᒃᓴᐃᑦ ᑕᕝᕙᓂ ᐱᓐᖑᐊᖅᑕᐅᕙᒃᑐᑦ ᑭᓯᐊᓂ ᑎᑎᕋᖅᑕᐅᓯᒪᔪᑦ ᒪᓕᒐᐃᑦ ᓇᓗᓇᐃᖅᓯᓯᒪᑦᑎᐊᖅᐸᑕ ᓯᓚᑖᓃᑦᑐᓄᑦ ᐊᑐᖅᑕᐅᒃᑲᓐᓂᕆᐊᖃᙱᓐᓂᖏᓐᓂᒃ. ᐱᙳᐊᕈᑎ ᓇᕿᑦᑕᒐᖅ ᓚᐃᓴᓐᓯᐅᙱᓚᖅ; ᓇᖕᒥᓂᖃᖅᑎᐅᔪᑦ ᑐᒃᓯᕋᕈᓐᓇᖅᑐᑦ ᐲᖅᑕᐅᖁᔨᓗᑎᒃ.",
    rights: "ᐅᖃᓕᒫᕐᓗᒋᑦ ᐱᔪᓐᓇᐅᑎᑦ ᐊᒻᒪ ᐱᔪᓐᓇᐅᑎᑦ ᑎᑎᕋᖅᓯᒪᔪᑦ",
    footer: "Parliament Streams ᐃᒻᒥᒃᑰᖅᑐᖅ ᖃᐅᔨᓴᕈᑎᓄᑦ ᑎᑎᕋᖅᓯᒪᔪᑦ.",
    about: "ᐱᓕᕆᐊᑉ ᒥᒃᓵᓄᑦ",
    sourceType: "ᑐᑭᓯᒋᐊᕐᕕᐅᑉ ᖃᓄᐃᑦᑑᓂᖓ",
    accessStatus: "ᐊᑐᐃᓐᓇᖃᕐᓂᕐᒧᑦ ᖃᓄᐃᓕᖓᓂᖓ",
    useGuidance: "ᐊᑐᕐᓗᒍ ᑐᑭᒧᐊᒍᑎ",
    availability: "ᐊᑐᐃᓐᓇᐅᓂᖏᑦ",
    attribution: "ᑐᓂᔭᐅᔭᕆᐊᖃᖅᑐᑦ",
    programme: "ᒫᓐᓇᐅᔪᖅ ᐱᓕᕆᐊᖑᔪᖅ ᑎᑎᕋᖅᑕᐅᓯᒪᔪᖅ",
    schedule: "ᐅᓪᓗᖅᓯᐅᑎ / EPG ᓇᑭᙶᕐᓂᖏᑦ",
    reuse: "ᐊᑐᒃᑲᓐᓂᕐᓗᒍ ᑎᑎᕋᖅᓯᒪᔪᖅ.",
    recommendation: "ᑎᑎᕋᖅᓯᒪᔪᑦ ᐊᑐᓕᖁᔭᐅᔪᑦ.",
    watch: "ᑕᑯᓐᓇᕐᓗᒍ ᐅᕙᓂ",
    official: "ᒪᑐᐃᖓᔪᖅ ᑐᑭᓯᒋᐊᕐᕕᒃ",
    ready: "ᐊᑐᐃᓐᓇᐅᓕᖅᑐᖅ ᖃᕆᑕᐅᔭᕐᒧᑦ ᐃᓕᓯᓂᕐᒧᑦ ᑐᓴᒐᒃᓴᓪᓚᑦᑖᓂᒃ",
    disabled: "ᐱᙳᐊᕐᓂᖅ ᐱᔪᓐᓇᖅᑎᑕᐅᙱᓚᖅ ᑖᔅᓱᒧᖓ ᑐᑭᓯᒋᐊᕐᕕᖕᒧᑦ",
    noResults: "ᑎᑎᕋᖅᓯᒪᔪᑦ ᓇᓕᒧᒌᙱᓚᑦ ᑖᒃᑯᓄᖓ ᓴᓗᒻᒪᖅᓴᐃᔾᔪᑎᓄᑦ.",
    noSchedule: "ᐋᖅᑭᒃᓯᒪᓂᖏᑦ ᑎᑎᕋᖅᑕᐅᓯᒪᙱᓚᑦ.",
    sourceError: "ᑎᑎᕋᖅᓯᒪᔪᑦ ᖃᕆᑕᐅᔭᕐᒨᖅᑕᐅᔪᓐᓇᓚᐅᙱᒻᒪᑕ.",
    sourceErrorDetail: "ᑕᐃᓐᓇ ᓂᕆᐅᒃᑐᖅ data/channels.json ᓴᓂᐊᓂ ᒪᒃᐱᒐᐅᑉ ᓴᓇᐅᒐᖓᑕ.",
    results: "{shown} ᐅᑯᓇᙵᑦ {total} ᑐᑭᓯᒋᐊᕐᕕᒃᓴᐃᑦ",
    documented: "{count} ᑎᑎᕋᖅᓯᒪᔪᑦ ᓇᑭᙶᕐᓂᖏᑦ · ᑎᑎᕋᖅᓯᒪᔪᑦ ᓴᖅᑭᑕᐅᓯᒪᔪᑦ {date}",
    labels: {
      direct_hls: "HLS", direct_dash: "DASH", official_page: "ᒪᒃᐱᒐᓪᓚᕆᒃ", youtube: "YouTube",
      validated: "ᓇᓗᓇᐃᖅᑕᐅᓯᒪᔪᖅ", needs_review: "ᕿᒥᕐᕈᐊᕐᓂᖅ", link_only: "ᒪᒃᐱᒐᖅ ᑭᓯᐊᓂ",
      national: "ᑲᓇᑕᓕᒫᒥ", subnational: "ᑲᓇᑕᐅᑉ ᐊᑖᓂ", supranational: "ᑲᓇᑕᐅᑉ ᐅᖓᑖᓂ",
      personal_use_pending_review: "ᑐᑭᓯᓇᙱᑦᑐᖅ", noncommercial_pending_review: "ᑭᒡᓕᖃᖅᑎᑕᐅᔪᖅ",
      explicit_reuse_with_conditions: "ᖃᓄᐃᓕᖓᓂᖃᕐᓗᓂ", embed_only: "ᐃᓕᓴᕆᔭᐅᓯᒪᔪᖅ ᐃᓕᔭᐅᓯᒪᔪᖅ", no_third_party_reuse: "ᐊᑐᒃᑲᓐᓂᕆᐊᖃᙱᑦᑐᖅ",
      always_on: "ᐃᑯᒪᐃᓐᓇᖅᑐᖅ", sitting_only: "ᐃᒃᓯᕚᕐᓂᖅ ᑭᓯᐊᓂ", event_based: "ᖃᓄᐃᓕᐅᕐᓂᐅᔪᓄᑦ ᑐᙵᕕᓕᒃ",
    },
  },
});

const openStreamLabels = {
  fr: "Principes pour des flux ouverts", es: "Principios de transmisiones abiertas", "pt-BR": "Princípios para transmissões abertas",
  da: "Principper for åbne streams", de: "Grundsätze für offene Streams", et: "Avatud voogude põhimõtted",
  el: "Αρχές ανοιχτών ροών", hi: "खुले स्ट्रीम के सिद्धांत", it: "Principi per flussi aperti",
  nl: "Beginselen voor open streams", nb: "Prinsipper for åpne strømmer", th: "หลักการสตรีมแบบเปิด",
  "zh-Hans": "开放流媒体原则", mi: "Ko ngā kaupapa o te awa tuwhera", "iu-Cans": "ᒪᑐᐃᖓᑦᑎᐊᕐᓂᕐᒧᑦ ᑐᙵᕕᐅᔪᑦ",
};
Object.entries(openStreamLabels).forEach(([locale, value]) => { shared[locale].openStreams = value; });

Object.assign(shared, {
  ga: { nav: "Catalóg", language: "Teanga", research: "Catalóg taighde poiblí", title: "Físeán parlaiminte, doiciméadaithe.", lede: "Críochphointí oifigiúla srutha, leathanaigh féachana, foinsí sceidil agus an fhianaise is gá chun úsáid gach foinse a mheas.", browse: "Brabhsáil foinsí", catalogue: "Catalóg", json: "Féach ar an JSON foinse", search: "Cuardaigh tír, reachtas nó cainéal", allJur: "Gach dlínse", allTypes: "Gach cineál foinse", allUse: "Gach treoir úsáide", source: "Foinse", jurisdiction: "Dlínse", format: "Formáid", contentLanguage: "Teanga", access: "Rochtain", use: "Úsáid", care: "Bain úsáid as go cúramach", methodTitle: "Is ceisteanna difriúla iad rochtain theicniúil agus téarmaí an tsoláthraí.", methodCopy: "Seinntear fothaí díreacha poiblí atá bailíochtaithe go teicniúil anseo mura dtoirmisceann na téarmaí taifeadta úsáid tríú páirtí go sainráite. Ní ceadúnas é cnaipe seinnte; is féidir le sealbhóirí cearta iarraidh go mbainfí é.", rights: "Léigh na nótaí cearta agus ceada", footer: "Is catalóg taighde neamhspleách é Parliament Streams.", about: "Maidir leis an tionscadal", sourceType: "Cineál foinse", accessStatus: "Stádas rochtana", useGuidance: "Treoir úsáide", availability: "Infhaighteacht", attribution: "Lua riachtanach", programme: "Taifead cláir reatha", schedule: "Foinsí sceidil / EPG", reuse: "Nóta athúsáide.", recommendation: "Moladh an chatalóige.", watch: "Féach anseo", official: "Oscail foinse oifigiúil", ready: "Réidh leis an bhfotha oifigiúil a luchtú", disabled: "Níl athsheinm cumasaithe don fhoinse seo", noResults: "Níl aon iontrálacha catalóige ann a oireann do na scagairí seo.", noSchedule: "Níl aon fhoinse sceidil taifeadta.", results: "{shown} de {total} fhoinse", documented: "{count} foinse doiciméadaithe · catalóg ginte {date}", labels: { official_page: "Leathanach oifigiúil", validated: "Fíoraithe", needs_review: "Athbhreithniú", link_only: "Leathanach amháin", national: "Náisiúnta", subnational: "Fonáisiúnta", supranational: "Fornáisiúnta", personal_use_pending_review: "Doiléir", noncommercial_pending_review: "Teoranta", explicit_reuse_with_conditions: "Le coinníollacha", embed_only: "Leabú oifigiúil", no_third_party_reuse: "Gan athúsáid", always_on: "Ar siúl i gcónaí", sitting_only: "Suí amháin", event_based: "Bunaithe ar imeacht" } },
  lb: { nav: "Katalog", language: "Sprooch", research: "Ëffentleche Fuerschungskatalog", title: "Parlamentaresche Video, dokumentéiert.", lede: "Offiziell Stream-Endpunkten, Säite fir ze kucken, Zäitplangquellen an d'Beweiser, fir d'Benotzung vun all Quell ze bewäerten.", browse: "Quelle duerchsichen", catalogue: "Katalog", json: "Quell-JSON weisen", search: "Land, Parlament oder Kanal sichen", allJur: "All Juridictiounen", allTypes: "All Quelltypen", allUse: "All Benotzungshinweiser", source: "Quell", jurisdiction: "Juridictioun", format: "Format", contentLanguage: "Sprooch", access: "Zougang", use: "Benotzung", care: "Mat Suergfalt benotzen", methodTitle: "Techneschen Zougang an d'Konditioune vum Ubidder si verschidde Froen.", methodCopy: "Technesch validéiert ëffentlech direkt Feeds ginn hei ofgespillt, ausser déi registréiert Konditioune verbidden d'Benotzung duerch Drëtt ausdrécklech. E Spillknäppchen ass keng Lizenz; Rechterhalter kënnen d'Ewechhuele verlaangen.", rights: "Notizen zu Rechter an Erlaabnesser liesen", footer: "Parliament Streams ass en onofhängege Fuerschungskatalog.", about: "Iwwer de Projet", sourceType: "Quelltyp", accessStatus: "Zougangsstatus", useGuidance: "Benotzungshinweis", availability: "Disponibilitéit", attribution: "Erfuerderlech Attributioun", programme: "Aktuellen Programmopzeechnung", schedule: "Zäitplang- / EPG-Quellen", reuse: "Notiz zur Wiederverwendung.", recommendation: "Katalogempfehlung.", watch: "Hei kucken", official: "Offiziell Quell opmaachen", ready: "Bereet den offizielle Feed ze lueden", disabled: "Ofspille fir dës Quell ass net aktivéiert", noResults: "Keng Katalogeinträg passen zu dëse Filteren.", noSchedule: "Keng Zäitplangquell opgeholl.", results: "{shown} vu {total} Quellen", documented: "{count} dokumentéiert Quellen · Katalog generéiert {date}", labels: { official_page: "Offiziell Säit", validated: "Verifizéiert", needs_review: "Iwwerpréiwung", link_only: "Nëmme Säit", national: "National", subnational: "Subnational", supranational: "Supranational", personal_use_pending_review: "Onkloer", noncommercial_pending_review: "Limitéiert", explicit_reuse_with_conditions: "Mat Konditiounen", embed_only: "Offiziell Abettung", no_third_party_reuse: "Keng Wiederverwendung", always_on: "Ëmmer aktiv", sitting_only: "Nëmme Sëtzungen", event_based: "Ereegnesbaséiert" } },
  sk: { nav: "Katalóg", language: "Jazyk", research: "Verejný výskumný katalóg", title: "Parlamentné video, zdokumentované.", lede: "Oficiálne koncové body streamov, stránky na sledovanie, zdroje programov a dôkazy potrebné na posúdenie použitia každého zdroja.", browse: "Prehľadávať zdroje", catalogue: "Katalóg", json: "Zobraziť zdrojový JSON", search: "Hľadať krajinu, zákonodarný zbor alebo kanál", allJur: "Všetky jurisdikcie", allTypes: "Všetky typy zdrojov", allUse: "Všetky pokyny na použitie", source: "Zdroj", jurisdiction: "Jurisdikcia", format: "Formát", contentLanguage: "Jazyk", access: "Prístup", use: "Použitie", care: "Používajte opatrne", methodTitle: "Technický prístup a podmienky poskytovateľa sú odlišné otázky.", methodCopy: "Technicky overené verejné priame prenosy sa tu prehrávajú, ak zaznamenané podmienky výslovne nezakazujú použitie treťou stranou. Tlačidlo prehrávania nie je licencia; držitelia práv môžu požiadať o odstránenie.", rights: "Prečítať poznámky o právach a povoleniach", footer: "Parliament Streams je nezávislý výskumný katalóg.", about: "O projekte", openStreams: "Zásady otvorených streamov", sourceType: "Typ zdroja", accessStatus: "Stav prístupu", useGuidance: "Pokyny na použitie", availability: "Dostupnosť", attribution: "Požadované uvedenie zdroja", programme: "Záznam aktuálneho programu", schedule: "Zdroje harmonogramu / EPG", reuse: "Poznámka k opätovnému použitiu.", recommendation: "Odporúčanie katalógu.", watch: "Sledovať tu", official: "Otvoriť oficiálny zdroj", ready: "Pripravené na načítanie oficiálneho prenosu", disabled: "Prehrávanie nie je pre tento zdroj povolené", noResults: "Žiadne položky katalógu nezodpovedajú týmto filtrom.", noSchedule: "Nie je zaznamenaný žiadny zdroj harmonogramu.", sourceError: "Katalóg sa nepodarilo načítať.", sourceErrorDetail: "Statická stránka očakáva data/channels.json vedľa artefaktu stránky.", results: "{shown} z {total} zdrojov", documented: "{count} zdokumentovaných zdrojov · katalóg vytvorený {date}", labels: { official_page: "Oficiálna stránka", validated: "Overené", needs_review: "Na kontrolu", link_only: "Len stránka", national: "Národný", subnational: "Subnárodný", supranational: "Nadnárodný", personal_use_pending_review: "Nejasné", noncommercial_pending_review: "Obmedzené", explicit_reuse_with_conditions: "S podmienkami", embed_only: "Oficiálne vloženie", no_third_party_reuse: "Bez opätovného použitia", always_on: "Vždy aktívne", sitting_only: "Len zasadnutia", event_based: "Podľa udalosti" } },
});

shared.ga.openStreams = "Prionsabail sruthanna oscailte";
shared.lb.openStreams = "Prinzipie fir oppe Streams";

const mobileLabels = {
  fr: { filters: "Filtres", close: "Fermer les détails de la source" },
  es: { filters: "Filtros", close: "Cerrar detalles de la fuente" },
  "pt-BR": { filters: "Filtros", close: "Fechar detalhes da fonte" },
  da: { filters: "Filtre", close: "Luk kildedetaljer" },
  de: { filters: "Filter", close: "Quelldetails schließen" },
  et: { filters: "Filtrid", close: "Sulge allika üksikasjad" },
  el: { filters: "Φίλτρα", close: "Κλείσιμο λεπτομερειών πηγής" },
  hi: { filters: "फ़िल्टर", close: "स्रोत विवरण बंद करें" },
  ga: { filters: "Scagairí", close: "Dún sonraí na foinse" },
  it: { filters: "Filtri", close: "Chiudi i dettagli della fonte" },
  lb: { filters: "Filter", close: "Quelldetailer zoumaachen" },
  nl: { filters: "Filters", close: "Brondetails sluiten" },
  nb: { filters: "Filtre", close: "Lukk kildedetaljer" },
  sk: { filters: "Filtre", close: "Zavrieť podrobnosti zdroja" },
  th: { filters: "ตัวกรอง", close: "ปิดรายละเอียดแหล่งที่มา" },
  "zh-Hans": { filters: "过滤器", close: "关闭来源详情" },
  "iu-Cans": { filters: "ᓴᓗᒻᒪᖅᓴᐃᔾᔪᑎᑦ", close: "ᒪᑐᓗᒋᑦ ᑐᑭᓯᒋᐊᕐᕕᐅᑉ ᓇᓗᓇᐃᖅᓯᓂᖏᑦ" },
  mi: { filters: "Ngā tātari", close: "Katia ngā taipitopito puna" },
};
Object.entries(mobileLabels).forEach(([locale, labels]) => Object.assign(shared[locale], labels));

const identityLabels = {
  fr: "Identité externe", es: "Identidad externa", "pt-BR": "Identidade externa",
  da: "Ekstern identitet", de: "Externe Identität", et: "Väline identiteet",
  el: "Εξωτερική ταυτότητα", hi: "बाहरी पहचान", ga: "Aitheantas seachtrach",
  it: "Identità esterna", lb: "Extern Identitéit", nl: "Externe identiteit",
  nb: "Ekstern identitet", sk: "Externá identita", th: "ข้อมูลระบุตัวตนภายนอก",
  "zh-Hans": "外部标识", "iu-Cans": "ᓯᓚᑖᓂ ᓇᓗᓇᐃᒃᑯᑕᖅ", mi: "Tuakiri ā-waho",
};
Object.entries(identityLabels).forEach(([locale, value]) => { shared[locale].identity = value; });

const scheduleLabels = {
  fr: { nowProgramme: "Maintenant :", nextProgramme: "À suivre :", scheduleCollected: "Horaire recueilli le {date}" },
  es: { nowProgramme: "Ahora:", nextProgramme: "A continuación:", scheduleCollected: "Programación recopilada el {date}" },
  "pt-BR": { nowProgramme: "Agora:", nextProgramme: "A seguir:", scheduleCollected: "Programação coletada em {date}" },
  da: { nowProgramme: "Nu:", nextProgramme: "Næste:", scheduleCollected: "Program indsamlet {date}" },
  de: { nowProgramme: "Jetzt:", nextProgramme: "Als Nächstes:", scheduleCollected: "Programm abgerufen am {date}" },
  et: { nowProgramme: "Praegu:", nextProgramme: "Järgmine:", scheduleCollected: "Ajakava kogutud {date}" },
  el: { nowProgramme: "Τώρα:", nextProgramme: "Επόμενο:", scheduleCollected: "Το πρόγραμμα συλλέχθηκε στις {date}" },
  hi: { nowProgramme: "अभी:", nextProgramme: "अगला:", scheduleCollected: "कार्यक्रम {date} को प्राप्त किया गया" },
  ga: { nowProgramme: "Anois:", nextProgramme: "Ar aghaidh:", scheduleCollected: "Sceideal bailithe {date}" },
  it: { nowProgramme: "Ora:", nextProgramme: "A seguire:", scheduleCollected: "Programma raccolto il {date}" },
  lb: { nowProgramme: "Elo:", nextProgramme: "Als nächst:", scheduleCollected: "Zäitplang ofgeruff den {date}" },
  nl: { nowProgramme: "Nu:", nextProgramme: "Hierna:", scheduleCollected: "Programma opgehaald op {date}" },
  nb: { nowProgramme: "Nå:", nextProgramme: "Neste:", scheduleCollected: "Program hentet {date}" },
  sk: { nowProgramme: "Teraz:", nextProgramme: "Nasleduje:", scheduleCollected: "Program získaný {date}" },
  th: { nowProgramme: "ขณะนี้:", nextProgramme: "ถัดไป:", scheduleCollected: "รวบรวมกำหนดการเมื่อ {date}" },
  "zh-Hans": { nowProgramme: "正在播出：", nextProgramme: "接下来：", scheduleCollected: "节目表采集于 {date}" },
  "iu-Cans": { nowProgramme: "ᒫᓐᓇ:", nextProgramme: "ᑭᖑᓪᓕᖅ:", scheduleCollected: "ᐅᓪᓗᖅᓯᐅᑎ ᐱᔭᐅᔪᖅ {date}" },
  mi: { nowProgramme: "Ināianei:", nextProgramme: "Whai muri:", scheduleCollected: "I kohia te hōtaka i te {date}" },
};
Object.entries(scheduleLabels).forEach(([locale, labels]) => Object.assign(shared[locale], labels));

const openScheduleCopy = {
  fr: "La vidéo parlementaire ouverte exige aussi des horaires ouverts. Les parlements devraient publier rapidement des flux de programmes et d'événements lisibles par machine à des URL stables, avec des conditions de réutilisation claires, des identifiants persistants, les fuseaux horaires et des corrections rapides.",
  es: "El vídeo parlamentario abierto también necesita datos de programación abiertos. Los parlamentos deberían publicar puntualmente fuentes de programas y eventos legibles por máquina en URL estables, con condiciones claras de reutilización, identificadores persistentes, zonas horarias y correcciones rápidas.",
  "pt-BR": "Vídeo parlamentar aberto também exige dados abertos de programação. Os parlamentos devem publicar, em tempo hábil, feeds de programas e eventos legíveis por máquina em URLs estáveis, com termos claros de reutilização, identificadores persistentes, fusos horários e correções rápidas.",
  da: "Åben parlamentarisk video kræver også åbne programdata. Parlamenter bør rettidigt offentliggøre maskinlæsbare program- og begivenhedsfeeds på stabile URL'er med klare vilkår for genbrug, vedvarende identifikatorer, tidszoner og hurtige rettelser.",
  de: "Offene Parlamentsvideos brauchen auch offene Programmdaten. Parlamente sollten zeitnah maschinenlesbare Programm- und Veranstaltungsfeeds unter stabilen URLs veröffentlichen, mit klaren Nachnutzungsbedingungen, dauerhaften Kennungen, Zeitzonen und schnellen Korrekturen.",
  et: "Avatud parlamendivideo vajab ka avatud ajakavaandmeid. Parlamendid peaksid avaldama õigeaegsed masinloetavad programmi- ja sündmustevood püsivatel URL-idel koos selgete taaskasutustingimuste, püsivate tunnuste, ajavööndite ja kiirete parandustega.",
  el: "Το ανοικτό κοινοβουλευτικό βίντεο χρειάζεται και ανοικτά δεδομένα προγράμματος. Τα κοινοβούλια πρέπει να δημοσιεύουν έγκαιρα μηχαναγνώσιμες ροές προγραμμάτων και εκδηλώσεων σε σταθερές διευθύνσεις URL, με σαφείς όρους επαναχρησιμοποίησης, μόνιμα αναγνωριστικά, ζώνες ώρας και άμεσες διορθώσεις.",
  hi: "खुले संसदीय वीडियो के लिए खुला कार्यक्रम डेटा भी आवश्यक है। विधानमंडलों को स्थायी URL पर समय पर, मशीन-पठनीय कार्यक्रम और आयोजन फ़ीड प्रकाशित करनी चाहिए, जिनमें स्पष्ट पुनः उपयोग शर्तें, स्थायी पहचानकर्ता, समय क्षेत्र और शीघ्र सुधार हों।",
  ga: "Teastaíonn sonraí sceidil oscailte ó fhíseán parlaiminte oscailte freisin. Ba cheart do reachtais fothaí clár agus imeachtaí atá tráthúil agus inléite ag meaisín a fhoilsiú ag URLanna cobhsaí, le téarmaí soiléire athúsáide, aitheantóirí buana, criosanna ama agus ceartúcháin thapa.",
  it: "Il video parlamentare aperto richiede anche dati di programmazione aperti. I parlamenti dovrebbero pubblicare tempestivamente feed di programmi ed eventi leggibili dalle macchine a URL stabili, con termini di riuso chiari, identificatori persistenti, fusi orari e correzioni rapide.",
  lb: "Oppe parlamentaresch Videoe brauchen och oppe Programmdate. Parlamenter solle rechtzäiteg maschinneliesbar Programm- an Evenementsfeeds op stabile URLen publizéieren, mat kloere Konditioune fir d'Wiederverwendung, bestännegen Identifikateuren, Zäitzonen a séiere Korrekturen.",
  nl: "Open parlementaire video vereist ook open programmagegevens. Parlementen moeten tijdig machineleesbare programma- en evenementfeeds op stabiele URL's publiceren, met duidelijke hergebruiksvoorwaarden, permanente identificatoren, tijdzones en snelle correcties.",
  nb: "Åpen parlamentarisk video trenger også åpne programdata. Parlamenter bør publisere oppdaterte, maskinlesbare program- og hendelsesstrømmer på stabile URL-er, med tydelige vilkår for gjenbruk, varige identifikatorer, tidssoner og raske rettelser.",
  sk: "Otvorené parlamentné video potrebuje aj otvorené údaje o programe. Parlamenty by mali včas zverejňovať strojovo čitateľné kanály programov a udalostí na stabilných adresách URL s jasnými podmienkami opätovného použitia, trvalými identifikátormi, časovými pásmami a rýchlymi opravami.",
  th: "วิดีโอรัฐสภาแบบเปิดต้องมีข้อมูลกำหนดการแบบเปิดด้วย สภานิติบัญญัติควรเผยแพร่ฟีดรายการและกิจกรรมที่เป็นปัจจุบันและอ่านได้ด้วยเครื่องผ่าน URL ที่คงที่ พร้อมเงื่อนไขการใช้ซ้ำที่ชัดเจน ตัวระบุถาวร เขตเวลา และการแก้ไขอย่างรวดเร็ว",
  "zh-Hans": "开放的议会视频也需要开放的节目表数据。立法机构应通过稳定的网址及时发布机器可读的节目和活动信息流，并提供明确的再利用条款、持久标识符、时区信息和及时更正。",
  "iu-Cans": "ᒪᑐᐃᖓᔪᖅ ᒪᓕᒐᓕᐅᕐᕕᐅᑉ ᑕᕐᕆᔭᒐᒃᓴᖓ ᒪᑐᐃᖓᔪᓂᒃ ᐅᓪᓗᖅᓯᐅᑎᓂᒃ ᑭᙵᕆᐊᖃᕐᒥᔪᖅ. ᒪᓕᒐᓕᐅᕐᕖᑦ ᓴᖅᑭᑎᑦᑎᒋᐊᖃᖅᑐᑦ ᖃᕋᓴᐅᔭᕐᒧᑦ ᐅᖃᓕᒫᒐᒃᓴᓂᒃ ᐱᓕᕆᐊᓄᑦ ᐊᒻᒪ ᖃᓄᐃᓕᐅᕐᓂᕐᓄᑦ ᐅᓪᓗᖅᓯᐅᑎᓂᒃ ᐊᓯᔾᔨᖏᑦᑐᓂ URL-ᓂ, ᑐᑭᓯᓇᖅᑐᓂᒃ ᐊᑐᒃᑲᓐᓂᕐᓂᐅᑉ ᒪᓕᒐᖏᓐᓂᒃ, ᐊᓯᔾᔨᖏᑦᑐᓂᒃ ᓇᓗᓇᐃᒃᑯᑕᓂᒃ, ᓯᕿᙳᔭᖅ ᖃᓄᐃᓕᖓᓂᖓᓂᒃ, ᐊᒻᒪ ᓱᒃᑲᔪᒥᒃ ᐋᖅᑭᒋᐊᕐᓂᕐᓂᒃ.",
  mi: "Me tuwhera hoki ngā raraunga hōtaka hei tautoko i te ataata pāremata tuwhera. Me whakaputa ngā pāremata i ngā whāngai hōtaka me ngā takahanga e taea ana e te mīhini te pānui, i ngā URL pūmau, me ngā tikanga whakamahi anō mārama, ngā tautohu pūmau, ngā rohe wā me ngā whakatikatika wawe.",
};
Object.entries(openScheduleCopy).forEach(([locale, value]) => { shared[locale].openStreamsCopy = value; });

const openVideoCopy = {
  fr: "La vidéo parlementaire ouverte exige des flux directs et interopérables comme le HLS, assortis de conditions claires autorisant l'intégration, la retransmission, la conservation et la surveillance indépendante.",
  es: "El vídeo parlamentario abierto requiere transmisiones directas e interoperables como HLS, con condiciones claras que permitan su inserción, retransmisión, conservación y supervisión independiente.",
  "pt-BR": "O vídeo parlamentar aberto exige transmissões diretas e interoperáveis, como HLS, com termos claros que permitam incorporação, retransmissão, preservação e monitoramento independente.",
  da: "Åben parlamentarisk video kræver direkte, interoperable streams som HLS med klare vilkår, der tillader indlejring, genudsendelse, bevaring og uafhængig overvågning.",
  de: "Offene Parlamentsvideos erfordern direkte, interoperable Streams wie HLS mit klaren Bedingungen, die Einbettung, Weiterverbreitung, Archivierung und unabhängige Überwachung erlauben.",
  et: "Avatud parlamendivideo vajab otseseid ja koostalitlusvõimelisi vooge, nagu HLS, ning selgeid tingimusi, mis lubavad manustamist, taasedastamist, säilitamist ja sõltumatut seiret.",
  el: "Το ανοικτό κοινοβουλευτικό βίντεο απαιτεί άμεσες, διαλειτουργικές ροές όπως HLS, με σαφείς όρους που επιτρέπουν την ενσωμάτωση, την αναμετάδοση, τη διατήρηση και την ανεξάρτητη παρακολούθηση.",
  hi: "खुले संसदीय वीडियो के लिए HLS जैसी प्रत्यक्ष और परस्पर-संचालनीय स्ट्रीम तथा ऐसी स्पष्ट शर्तें आवश्यक हैं जो एम्बेडिंग, पुनर्प्रसारण, संरक्षण और स्वतंत्र निगरानी की अनुमति दें।",
  ga: "Teastaíonn sruthanna díreacha idir-inoibritheacha ar nós HLS ó fhíseán parlaiminte oscailte, le téarmaí soiléire a cheadaíonn leabú, athchraoladh, caomhnú agus monatóireacht neamhspleách.",
  it: "Il video parlamentare aperto richiede flussi diretti e interoperabili come HLS, con condizioni chiare che consentano incorporamento, ritrasmissione, conservazione e monitoraggio indipendente.",
  lb: "Oppe parlamentaresch Videoe brauchen direkt, interoperabel Streams wéi HLS mat kloere Konditiounen, déi Abettung, Weideriwwerdroung, Erhalen an onofhängeg Iwwerwaachung erlaben.",
  nl: "Open parlementaire video vereist directe, interoperabele streams zoals HLS, met duidelijke voorwaarden die insluiten, heruitzenden, bewaren en onafhankelijke monitoring toestaan.",
  nb: "Åpen parlamentarisk video krever direkte, interoperable strømmer som HLS, med tydelige vilkår som tillater innbygging, videresending, bevaring og uavhengig overvåking.",
  sk: "Otvorené parlamentné video vyžaduje priame, interoperabilné streamy, ako je HLS, s jasnými podmienkami umožňujúcimi vkladanie, ďalšie vysielanie, uchovávanie a nezávislé monitorovanie.",
  th: "วิดีโอรัฐสภาแบบเปิดต้องใช้สตรีมโดยตรงที่ทำงานร่วมกันได้ เช่น HLS พร้อมเงื่อนไขที่ชัดเจนซึ่งอนุญาตให้ฝังวิดีโอ ถ่ายทอดซ้ำ เก็บรักษา และตรวจสอบอย่างอิสระ",
  "zh-Hans": "开放的议会视频需要采用 HLS 等直接、可互操作的流媒体，并通过明确条款允许嵌入、转播、保存和独立监测。",
  "iu-Cans": "ᒪᑐᐃᖓᔪᖅ ᒪᓕᒐᓕᐅᕐᕕᐅᑉ ᑕᕐᕆᔭᒐᒃᓴᖓ ᑐᕌᖓᔪᓂᒃ, ᐊᑐᖃᑎᒌᒍᓐᓇᖅᑐᓂᒃ HLS-ᑐᑦ ᑕᑯᒃᓴᐅᑎᑦᑎᔾᔪᑎᓂᒃ ᐱᔭᕆᐊᖃᖅᑐᖅ, ᑐᑭᓯᓇᖅᑐᓂᒃ ᐃᓕᓯᓂᕐᒧᑦ, ᑕᑯᒃᓴᐅᑎᑦᑎᒃᑲᓐᓂᕐᓂᕐᒧᑦ, ᑐᖅᑯᐃᓂᕐᒧᑦ ᐊᒻᒪ ᐃᒻᒥᒃᑰᖅᑐᒥᒃ ᖃᐅᔨᓴᕐᓂᕐᒧᑦ ᐱᔪᓐᓇᐅᑎᓂᒃ.",
  mi: "Me whai te ataata pāremata tuwhera i ngā roma tika, hototahi hoki pēnei i te HLS, me ngā tikanga mārama e whakaae ana ki te tāmau, te pāho anō, te tiaki me te aroturuki motuhake.",
};
Object.entries(openVideoCopy).forEach(([locale, value]) => { shared[locale].openVideoCopy = value; });

const researchUiLabels = {
  fr: ["Couverture du catalogue", "Sources", "Lisibles ici", "Sources d’horaire", "Catalogue mis à jour", "Dates des éléments", "Non disponible", "Principes des flux ouverts", "Diffusion ouverte", "Accès ouvert", "Réutilisation ouverte", "Horaires ouverts", "Accessibilité ouverte"],
  es: ["Cobertura del catálogo", "Fuentes", "Reproducibles aquí", "Fuentes de programación", "Catálogo actualizado", "Fechas de evidencia", "No disponible", "Principios de transmisión abierta", "Distribución abierta", "Acceso abierto", "Reutilización abierta", "Programación abierta", "Accesibilidad abierta"],
  "pt-BR": ["Cobertura do catálogo", "Fontes", "Reproduzíveis aqui", "Fontes de programação", "Catálogo atualizado", "Datas das evidências", "Não disponível", "Princípios de transmissão aberta", "Distribuição aberta", "Acesso aberto", "Reutilização aberta", "Programação aberta", "Acessibilidade aberta"],
  da: ["Katalogdækning", "Kilder", "Kan afspilles her", "Programkilder", "Katalog opdateret", "Dokumentationsdatoer", "Ikke tilgængelig", "Principper for åbne streams", "Åben levering", "Åben adgang", "Åben genbrug", "Åbne programmer", "Åben tilgængelighed"],
  de: ["Katalogabdeckung", "Quellen", "Hier abspielbar", "Programmquellen", "Katalog aktualisiert", "Nachweisstand", "Nicht verfügbar", "Prinzipien für offene Streams", "Offene Bereitstellung", "Offener Zugang", "Offene Nachnutzung", "Offene Programme", "Offene Barrierefreiheit"],
  et: ["Kataloogi katvus", "Allikad", "Siin esitatavad", "Ajakavaallikad", "Kataloog uuendatud", "Tõendite kuupäevad", "Pole saadaval", "Avatud voogude põhimõtted", "Avatud edastus", "Avatud juurdepääs", "Avatud taaskasutus", "Avatud ajakavad", "Avatud ligipääsetavus"],
  el: ["Κάλυψη καταλόγου", "Πηγές", "Αναπαράγονται εδώ", "Πηγές προγράμματος", "Ενημέρωση καταλόγου", "Ημερομηνίες τεκμηρίωσης", "Μη διαθέσιμο", "Αρχές ανοικτών ροών", "Ανοικτή διάθεση", "Ανοικτή πρόσβαση", "Ανοικτή επαναχρησιμοποίηση", "Ανοικτά προγράμματα", "Ανοικτή προσβασιμότητα"],
  hi: ["कैटलॉग कवरेज", "स्रोत", "यहाँ चलने योग्य", "कार्यक्रम स्रोत", "कैटलॉग अपडेट", "साक्ष्य तिथियाँ", "उपलब्ध नहीं", "खुले स्ट्रीम के सिद्धांत", "खुला वितरण", "खुली पहुँच", "खुला पुनः उपयोग", "खुले कार्यक्रम", "खुली सुगम्यता"],
  ga: ["Clúdach an chatalóige", "Foinsí", "Inseinnte anseo", "Foinsí sceidil", "Catalóg nuashonraithe", "Dátaí fianaise", "Níl ar fáil", "Prionsabail sruthanna oscailte", "Seachadadh oscailte", "Rochtain oscailte", "Athúsáid oscailte", "Sceidil oscailte", "Inrochtaineacht oscailte"],
  it: ["Copertura del catalogo", "Fonti", "Riproducibili qui", "Fonti di programmazione", "Catalogo aggiornato", "Date delle evidenze", "Non disponibile", "Principi dei flussi aperti", "Distribuzione aperta", "Accesso aperto", "Riuso aperto", "Programmi aperti", "Accessibilità aperta"],
  lb: ["Katalogofdeckung", "Quellen", "Hei ofspillbar", "Programmquellen", "Katalog aktualiséiert", "Noweisdatumen", "Net disponibel", "Prinzipie fir oppe Streams", "Oppen Zougang", "Oppen Accès", "Oppe Wiederverwendung", "Oppe Programmer", "Oppen Accessibilitéit"],
  nl: ["Catalogusdekking", "Bronnen", "Hier afspeelbaar", "Programmabronnen", "Catalogus bijgewerkt", "Bewijsdatums", "Niet beschikbaar", "Beginselen voor open streams", "Open levering", "Open toegang", "Open hergebruik", "Open programma’s", "Open toegankelijkheid"],
  nb: ["Katalogdekning", "Kilder", "Kan spilles her", "Programkilder", "Katalog oppdatert", "Dokumentasjonsdatoer", "Ikke tilgjengelig", "Prinsipper for åpne strømmer", "Åpen levering", "Åpen tilgang", "Åpen gjenbruk", "Åpne programmer", "Åpen tilgjengelighet"],
  sk: ["Pokrytie katalógu", "Zdroje", "Prehrateľné tu", "Zdroje programu", "Katalóg aktualizovaný", "Dátumy dôkazov", "Nedostupné", "Zásady otvorených streamov", "Otvorené poskytovanie", "Otvorený prístup", "Otvorené opätovné použitie", "Otvorené programy", "Otvorená prístupnosť"],
  th: ["ความครอบคลุมของแคตตาล็อก", "แหล่งข้อมูล", "เล่นได้ที่นี่", "แหล่งกำหนดการ", "อัปเดตแคตตาล็อก", "วันที่ของหลักฐาน", "ไม่มีข้อมูล", "หลักการสตรีมแบบเปิด", "การส่งแบบเปิด", "การเข้าถึงแบบเปิด", "การใช้ซ้ำแบบเปิด", "กำหนดการแบบเปิด", "การเข้าถึงสำหรับทุกคน"],
  "zh-Hans": ["目录覆盖范围", "来源", "可在此播放", "节目表来源", "目录更新时间", "证据日期", "暂无", "开放流媒体原则", "开放传输", "开放访问", "开放再利用", "开放节目表", "开放无障碍"],
  "iu-Cans": ["ᑎᑎᕋᖅᓯᒪᔪᑦ ᖃᓄᑎᒋ", "ᑐᑭᓯᒋᐊᕐᕖᑦ", "ᑕᕝᕙᓂ ᑕᑯᒃᓴᐅᔪᑦ", "ᐅᓪᓗᖅᓯᐅᑎᐅᑉ ᑐᑭᓯᒋᐊᕐᕕᖏᑦ", "ᓄᑖᙳᖅᑎᖅᑕᐅᔪᖅ", "ᓇᓗᓇᐃᒃᑯᑕᐃᑦ ᐅᓪᓗᖏᑦ", "ᐊᑐᐃᓐᓇᐅᙱᑦᑐᖅ", "ᒪᑐᐃᖓᑦᑎᐊᕐᓂᐅᑉ ᑐᙵᕕᖏᑦ", "ᒪᑐᐃᖓᔪᒥᒃ ᑐᓂᓯᓂᖅ", "ᒪᑐᐃᖓᔪᒥᒃ ᐊᑐᐃᓐᓇᖃᕐᓂᖅ", "ᒪᑐᐃᖓᔪᒥᒃ ᐊᑐᒃᑲᓐᓂᕐᓂᖅ", "ᒪᑐᐃᖓᔪᑦ ᐅᓪᓗᖅᓯᐅᑏᑦ", "ᒪᑐᐃᖓᔪᒥᒃ ᐊᑐᕈᓐᓇᕐᓂᖅ"],
  mi: ["Whānuitanga putumōhio", "Ngā puna", "Ka taea te mātaki i konei", "Ngā puna hōtaka", "Kua whakahōutia te putumōhio", "Ngā rā taunakitanga", "Kāore i te wātea", "Ngā kaupapa o ngā roma tuwhera", "Tukunga tuwhera", "Urunga tuwhera", "Whakamahi anō tuwhera", "Hōtaka tuwhera", "Urutanga tuwhera"],
};
const researchUiKeys = ["catalogueCoverage", "metricSources", "metricPlayable", "metricSchedules", "metricUpdated", "evidenceDates", "notAvailable", "principlesLabel", "principleDelivery", "principleAccess", "principleReuse", "principleSchedules", "principleAccessibility"];
Object.entries(researchUiLabels).forEach(([locale, values]) => {
  researchUiKeys.forEach((key, index) => { shared[locale][key] = values[index]; });
});

const detailUiLabels = {
  fr: ["État d’accès", "Disponibilité", "Attribution requise", "Programme en cours", "Sources d’horaire / EPG", "Note de réutilisation.", "Recommandation du catalogue.", "Accessibilité des médias", "Sous-titres", "Langue des signes", "Audiodescription", "Disponible", "Varie selon la source ou l’événement", "Indisponible", "Pas encore vérifié"],
  es: ["Estado de acceso", "Disponibilidad", "Atribución requerida", "Programa actual", "Fuentes de programación / EPG", "Nota de reutilización.", "Recomendación del catálogo.", "Accesibilidad multimedia", "Subtítulos", "Lengua de signos", "Audiodescripción", "Disponible", "Varía según la fuente o el evento", "No disponible", "Aún no verificado"],
  "pt-BR": ["Status de acesso", "Disponibilidade", "Atribuição obrigatória", "Programa atual", "Fontes de programação / EPG", "Nota de reutilização.", "Recomendação do catálogo.", "Acessibilidade da mídia", "Legendas", "Língua de sinais", "Audiodescrição", "Disponível", "Varia conforme a fonte ou o evento", "Indisponível", "Ainda não verificado"],
  da: ["Adgangsstatus", "Tilgængelighed", "Påkrævet kreditering", "Aktuelt program", "Program- / EPG-kilder", "Note om genbrug.", "Katalogets anbefaling.", "Medietilgængelighed", "Undertekster", "Tegnsprog", "Synstolkning", "Tilgængelig", "Varierer efter kilde eller begivenhed", "Ikke tilgængelig", "Endnu ikke kontrolleret"],
  de: ["Zugangsstatus", "Verfügbarkeit", "Erforderliche Namensnennung", "Aktuelles Programm", "Programmquellen / EPG", "Hinweis zur Wiederverwendung.", "Katalogempfehlung.", "Barrierefreiheit der Medien", "Untertitel", "Gebärdensprache", "Audiodeskription", "Verfügbar", "Je nach Quelle oder Veranstaltung unterschiedlich", "Nicht verfügbar", "Noch nicht überprüft"],
  et: ["Juurdepääsu olek", "Kättesaadavus", "Nõutav viide", "Praegune programm", "Ajakava- / EPG-allikad", "Taaskasutuse märkus.", "Kataloogi soovitus.", "Meedia ligipääsetavus", "Subtiitrid", "Viipekeel", "Kirjeldustõlge", "Saadaval", "Sõltub allikast või sündmusest", "Pole saadaval", "Pole veel kontrollitud"],
  el: ["Κατάσταση πρόσβασης", "Διαθεσιμότητα", "Απαιτούμενη αναφορά", "Τρέχον πρόγραμμα", "Πηγές προγράμματος / EPG", "Σημείωση επαναχρησιμοποίησης.", "Σύσταση καταλόγου.", "Προσβασιμότητα πολυμέσων", "Υπότιτλοι", "Νοηματική γλώσσα", "Ακουστική περιγραφή", "Διαθέσιμο", "Διαφέρει ανά πηγή ή εκδήλωση", "Μη διαθέσιμο", "Δεν έχει ακόμη επαληθευτεί"],
  hi: ["पहुँच स्थिति", "उपलब्धता", "आवश्यक श्रेय", "वर्तमान कार्यक्रम", "कार्यक्रम / EPG स्रोत", "पुनः उपयोग टिप्पणी।", "कैटलॉग अनुशंसा।", "मीडिया सुगम्यता", "कैप्शन", "सांकेतिक भाषा", "ऑडियो विवरण", "उपलब्ध", "स्रोत या आयोजन के अनुसार बदलता है", "अनुपलब्ध", "अभी सत्यापित नहीं"],
  ga: ["Stádas rochtana", "Infhaighteacht", "Lua riachtanach", "Taifead cláir reatha", "Foinsí sceidil / EPG", "Nóta athúsáide.", "Moladh an chatalóige.", "Inrochtaineacht na meán", "Fotheidil", "Teanga chomharthaíochta", "Clostuairisc", "Ar fáil", "Athraíonn de réir foinse nó imeachta", "Níl ar fáil", "Gan fíorú fós"],
  it: ["Stato di accesso", "Disponibilità", "Attribuzione richiesta", "Programma attuale", "Fonti di programmazione / EPG", "Nota sul riuso.", "Raccomandazione del catalogo.", "Accessibilità dei media", "Sottotitoli", "Lingua dei segni", "Audiodescrizione", "Disponibile", "Varia in base alla fonte o all’evento", "Non disponibile", "Non ancora verificato"],
  lb: ["Zougangsstatus", "Disponibilitéit", "Erfuerderlech Attributioun", "Aktuelle Programm", "Zäitplang- / EPG-Quellen", "Notiz zur Wiederverwendung.", "Katalogempfehlung.", "Medienaccessibilitéit", "Ënnertitelen", "Gebäerdesprooch", "Audiobeschreiwung", "Disponibel", "Variéiert no Quell oder Evenement", "Net disponibel", "Nach net iwwerpréift"],
  nl: ["Toegangsstatus", "Beschikbaarheid", "Vereiste bronvermelding", "Huidig programma", "Programma- / EPG-bronnen", "Notitie over hergebruik.", "Catalogusadvies.", "Mediatoegankelijkheid", "Ondertiteling", "Gebarentaal", "Audiodescriptie", "Beschikbaar", "Verschilt per bron of evenement", "Niet beschikbaar", "Nog niet geverifieerd"],
  nb: ["Tilgangsstatus", "Tilgjengelighet", "Påkrevd kreditering", "Gjeldende program", "Program- / EPG-kilder", "Merknad om gjenbruk.", "Kataloganbefaling.", "Medietilgjengelighet", "Teksting", "Tegnspråk", "Synstolking", "Tilgjengelig", "Varierer etter kilde eller arrangement", "Ikke tilgjengelig", "Ikke verifisert ennå"],
  sk: ["Stav prístupu", "Dostupnosť", "Požadované uvedenie zdroja", "Aktuálny program", "Zdroje programu / EPG", "Poznámka k opätovnému použitiu.", "Odporúčanie katalógu.", "Prístupnosť médií", "Titulky", "Posunkový jazyk", "Zvukový opis", "Dostupné", "Líši sa podľa zdroja alebo udalosti", "Nedostupné", "Zatiaľ neoverené"],
  th: ["สถานะการเข้าถึง", "ความพร้อมใช้งาน", "การระบุแหล่งที่มาที่จำเป็น", "รายการปัจจุบัน", "แหล่งกำหนดการ / EPG", "หมายเหตุการใช้ซ้ำ", "คำแนะนำของแคตตาล็อก", "การเข้าถึงสื่อ", "คำบรรยาย", "ภาษามือ", "คำบรรยายเสียง", "มี", "แตกต่างตามแหล่งข้อมูลหรือกิจกรรม", "ไม่มี", "ยังไม่ได้ตรวจสอบ"],
  "zh-Hans": ["访问状态", "可用时间", "所需署名", "当前节目记录", "节目表 / EPG 来源", "再利用说明。", "目录建议。", "媒体无障碍", "字幕", "手语", "音频描述", "可用", "因来源或活动而异", "不可用", "尚未验证"],
  "iu-Cans": ["ᐊᑐᐃᓐᓇᖃᕐᓂᕐᒧᑦ ᖃᓄᐃᓕᖓᓂᖓ", "ᐊᑐᐃᓐᓇᐅᓂᖓ", "ᑐᓂᔭᐅᔭᕆᐊᓕᒃ", "ᒫᓐᓇᐅᔪᖅ ᐱᓕᕆᐊᖑᔪᖅ", "ᐅᓪᓗᖅᓯᐅᑎ / EPG ᓇᑭᙶᕐᓂᖏᑦ", "ᐊᑐᒃᑲᓐᓂᕐᓂᕐᒧᑦ ᑎᑎᕋᖅᓯᒪᔪᖅ.", "ᑎᑎᕋᖅᓯᒪᔪᑦ ᐊᑐᓕᖁᔭᐅᔪᑦ.", "ᑕᕐᕆᔭᒐᒃᓴᐃᑦ ᐊᑐᕈᓐᓇᕐᓂᖏᑦ", "ᑎᑎᕋᖅᓯᒪᔪᑦ", "ᐅᖃᙱᖦᖢᓂ ᐅᖃᐅᓯᖅ", "ᓂᐱᒃᑯᑦ ᐅᓂᒃᑳᖅ", "ᐊᑐᐃᓐᓇᐅᔪᖅ", "ᓇᑭᙶᕐᓂᖓ ᒪᓕᒃᖢᒍ ᐊᔾᔨᒌᙱᑦᑐᖅ", "ᐊᑐᐃᓐᓇᐅᙱᑦᑐᖅ", "ᓱᓕ ᓇᓗᓇᐃᖅᑕᐅᙱᑦᑐᖅ"],
  mi: ["Tūnga uru", "Wātea", "Tohutoro e hiahiatia ana", "Hōtaka o nāianei", "Ngā puna wātaka / EPG", "Kōrero whakamahi anō.", "Tohutohu putumōhio.", "Urutanga pāpāho", "Kupu hauraro", "Reo rotarota", "Whakaahuatanga oro", "Kei te wātea", "Ka rerekē i te puna, i te takahanga rānei", "Kāore i te wātea", "Kāore anō kia manatoko"],
};
const detailUiKeys = ["accessStatus", "availability", "attribution", "programme", "schedule", "reuse", "recommendation", "mediaAccessibility", "captions", "signLanguage", "audioDescription", "a11yAvailable", "a11ySourceDependent", "a11yUnavailable", "a11yUnknown"];
Object.entries(detailUiLabels).forEach(([locale, values]) => {
  detailUiKeys.forEach((key, index) => { shared[locale][key] = values[index]; });
});

const sourceLinkLabels = {
  fr: ["API d’horaire", "Données d’horaire ouvertes", "Calendrier / ordre du jour", "Page d’horaire en direct", "Page d’horaire", "Page de visionnement officielle", "Point d’accès enregistré", "Droits / conditions de la source", "Politique de confidentialité", "Source à l’appui"],
  es: ["API de programación", "Datos abiertos de programación", "Calendario / agenda", "Página de programación en directo", "Página de programación", "Página oficial de visualización", "Punto de emisión registrado", "Derechos / condiciones de la fuente", "Política de privacidad", "Fuente de apoyo"],
  "pt-BR": ["API de programação", "Dados abertos de programação", "Calendário / agenda", "Página de programação ao vivo", "Página de programação", "Página oficial de transmissão", "Endpoint de transmissão registrado", "Direitos / termos da fonte", "Política de privacidade", "Fonte de apoio"],
  da: ["Program-API", "Åbne programdata", "Kalender / dagsorden", "Side med liveprogram", "Programside", "Officiel visningsside", "Registreret streamendepunkt", "Rettigheder / kildevilkår", "Privatlivspolitik", "Understøttende kilde"],
  de: ["Programm-API", "Offene Programmdaten", "Kalender / Tagesordnung", "Live-Programmseite", "Programmseite", "Offizielle Wiedergabeseite", "Erfasster Stream-Endpunkt", "Rechte / Quellenbedingungen", "Datenschutzrichtlinie", "Belegquelle"],
  et: ["Ajakava API", "Avatud ajakavaandmed", "Kalender / päevakord", "Otseprogrammi leht", "Ajakava leht", "Ametlik vaatamisleht", "Salvestatud voo lõpp-punkt", "Õigused / allika tingimused", "Privaatsuspoliitika", "Toetav allikas"],
  el: ["API προγράμματος", "Ανοικτά δεδομένα προγράμματος", "Ημερολόγιο / ημερήσια διάταξη", "Σελίδα ζωντανού προγράμματος", "Σελίδα προγράμματος", "Επίσημη σελίδα προβολής", "Καταγεγραμμένο σημείο ροής", "Δικαιώματα / όροι πηγής", "Πολιτική απορρήτου", "Υποστηρικτική πηγή"],
  hi: ["कार्यक्रम API", "खुला कार्यक्रम डेटा", "कैलेंडर / कार्यसूची", "लाइव कार्यक्रम पृष्ठ", "कार्यक्रम पृष्ठ", "आधिकारिक देखने का पृष्ठ", "दर्ज स्ट्रीम एंडपॉइंट", "अधिकार / स्रोत शर्तें", "गोपनीयता नीति", "सहायक स्रोत"],
  ga: ["API sceidil", "Sonraí sceidil oscailte", "Féilire / clár oibre", "Leathanach sceidil bheo", "Leathanach sceidil", "Leathanach oifigiúil féachana", "Críochphointe srutha taifeadta", "Cearta / téarmaí foinse", "Polasaí príobháideachais", "Foinse tacaíochta"],
  it: ["API di programmazione", "Dati aperti di programmazione", "Calendario / ordine del giorno", "Pagina del programma in diretta", "Pagina di programmazione", "Pagina ufficiale di visione", "Endpoint registrato", "Diritti / condizioni della fonte", "Informativa sulla privacy", "Fonte di supporto"],
  lb: ["Programm-API", "Oppe Programmdate", "Kalenner / Dagesuerdnung", "Live-Programmsäit", "Programmsäit", "Offiziell Ofspillsäit", "Registréierte Stream-Endpunkt", "Rechter / Quellkonditiounen", "Dateschutzrichtlinn", "Ënnerstëtzend Quell"],
  nl: ["Programma-API", "Open programmagegevens", "Kalender / agenda", "Live programmapagina", "Programmapagina", "Officiële kijkpagina", "Vastgelegd streamendpoint", "Rechten / bronvoorwaarden", "Privacybeleid", "Ondersteunende bron"],
  nb: ["Program-API", "Åpne programdata", "Kalender / dagsorden", "Side for direkteprogram", "Programside", "Offisiell visningsside", "Registrert strømendepunkt", "Rettigheter / kildevilkår", "Personvernregler", "Støttekilde"],
  sk: ["API programu", "Otvorené údaje programu", "Kalendár / program", "Stránka živého programu", "Stránka programu", "Oficiálna stránka sledovania", "Zaznamenaný koncový bod streamu", "Práva / podmienky zdroja", "Zásady ochrany súkromia", "Podporný zdroj"],
  th: ["API กำหนดการ", "ข้อมูลกำหนดการแบบเปิด", "ปฏิทิน / ระเบียบวาระ", "หน้ากำหนดการถ่ายทอดสด", "หน้ากำหนดการ", "หน้ารับชมอย่างเป็นทางการ", "จุดปลายทางสตรีมที่บันทึกไว้", "สิทธิ์ / เงื่อนไขของแหล่งข้อมูล", "นโยบายความเป็นส่วนตัว", "แหล่งข้อมูลสนับสนุน"],
  "zh-Hans": ["节目表 API", "开放节目表数据", "日历 / 议程", "直播节目表页面", "节目表页面", "官方观看页面", "已记录的流端点", "权利 / 来源条款", "隐私政策", "支持来源"],
  "iu-Cans": ["ᐅᓪᓗᖅᓯᐅᑎ API", "ᒪᑐᐃᖓᔪᑦ ᐅᓪᓗᖅᓯᐅᑎᐅᑉ ᑐᑭᓯᒋᐊᕈᑎᖏᑦ", "ᐅᓪᓗᖅᓯᐅᑎ / ᐱᓕᕆᐊᑦ", "ᐆᒪᔪᒥᒃ ᐅᓪᓗᖅᓯᐅᑎᐅᑉ ᒪᒃᐱᒐᖓ", "ᐅᓪᓗᖅᓯᐅᑎᐅᑉ ᒪᒃᐱᒐᖓ", "ᑕᑯᕝᕕᐅᑉ ᒪᒃᐱᒐᖓ", "ᑎᑎᕋᖅᑕᐅᓯᒪᔪᖅ ᑕᑯᒃᓴᐅᑎᑦᑎᔾᔪᑎ", "ᐱᔪᓐᓇᐅᑏᑦ / ᓇᑭᙶᕐᓂᖓᑕ ᒪᓕᒐᖏᑦ", "ᑲᙳᓇᖅᑐᓕᕆᓂᕐᒧᑦ ᒪᓕᒐᖅ", "ᐃᑲᔪᖅᑐᖅ ᑐᑭᓯᒋᐊᕐᕕᒃ"],
  mi: ["API hōtaka", "Raraunga hōtaka tuwhera", "Maramataka / rārangi kaupapa", "Whārangi hōtaka mataora", "Whārangi hōtaka", "Whārangi mātakitaki mana", "Pito roma kua tuhia", "Motika / tikanga puna", "Kaupapahere tūmataiti", "Puna tautoko"],
};
const sourceLinkKeys = ["scheduleApi", "openScheduleData", "calendarAgenda", "liveSchedulePage", "schedulePage", "officialEvidence", "streamEvidence", "rightsEvidence", "privacyEvidence", "supportingEvidence"];
Object.entries(sourceLinkLabels).forEach(([locale, values]) => {
  sourceLinkKeys.forEach((key, index) => { shared[locale][key] = values[index]; });
});

const researchNoteLabels = {
  fr: ["Sources documentaires.", "Notes de recherche du catalogue en anglais"],
  es: ["Fuentes documentales.", "Notas de investigación del catálogo en inglés"],
  "pt-BR": ["Fontes documentais.", "Notas de pesquisa do catálogo em inglês"],
  da: ["Dokumentationskilder.", "Katalogets forskningsnoter på engelsk"],
  de: ["Belegquellen.", "Forschungsnotizen des Katalogs auf Englisch"],
  et: ["Tõendusallikad.", "Kataloogi ingliskeelsed uurimismärkmed"],
  el: ["Πηγές τεκμηρίωσης.", "Ερευνητικές σημειώσεις του καταλόγου στα αγγλικά"],
  hi: ["साक्ष्य स्रोत।", "कैटलॉग के अंग्रेज़ी शोध नोट"],
  ga: ["Foinsí fianaise.", "Nótaí taighde an chatalóige i mBéarla"],
  it: ["Fonti documentali.", "Note di ricerca del catalogo in inglese"],
  lb: ["Noweisquellen.", "Fuerschungsnotize vum Katalog op Englesch"],
  nl: ["Bewijsbronnen.", "Engelstalige onderzoeksnotities van de catalogus"],
  nb: ["Dokumentasjonskilder.", "Katalogens forskningsnotater på engelsk"],
  sk: ["Zdroje dôkazov.", "Výskumné poznámky katalógu v angličtine"],
  th: ["แหล่งหลักฐาน", "บันทึกการวิจัยของแคตตาล็อกเป็นภาษาอังกฤษ"],
  "zh-Hans": ["证据来源。", "目录的英文研究说明"],
  "iu-Cans": ["ᓇᓗᓇᐃᒃᑯᑕᐃᑦ ᓇᑭᙶᕐᓂᖏᑦ.", "ᖃᓪᓗᓈᑎᑐᑦ ᑎᑎᕋᖅᓯᒪᔪᑦ ᖃᐅᔨᓴᕈᑏᑦ"],
  mi: ["Ngā puna taunakitanga.", "Ngā kōrero rangahau putumōhio i te reo Ingarihi"],
};
Object.entries(researchNoteLabels).forEach(([locale, values]) => {
  [shared[locale].evidenceSources, shared[locale].englishResearchNotes] = values;
});

const playerStateLabels = {
  fr: ["Prêt à charger le flux officiel", "La lecture n’est pas activée pour cette source", "Aucune source d’horaire enregistrée."],
  es: ["Listo para cargar la fuente oficial", "La reproducción no está activada para esta fuente", "No se registró ninguna fuente de programación."],
  "pt-BR": ["Pronto para carregar o feed oficial", "A reprodução não está ativada para esta fonte", "Nenhuma fonte de programação registrada."],
  da: ["Klar til at indlæse det officielle feed", "Afspilning er ikke aktiveret for denne kilde", "Ingen programkilde er registreret."],
  de: ["Bereit zum Laden des offiziellen Feeds", "Die Wiedergabe ist für diese Quelle nicht aktiviert", "Keine Programmquelle erfasst."],
  et: ["Ametliku voo laadimiseks valmis", "Selle allika esitamine pole lubatud", "Ajakavaallikat pole salvestatud."],
  el: ["Έτοιμο για φόρτωση της επίσημης ροής", "Η αναπαραγωγή δεν είναι ενεργοποιημένη για αυτή την πηγή", "Δεν έχει καταγραφεί πηγή προγράμματος."],
  hi: ["आधिकारिक फ़ीड लोड करने के लिए तैयार", "इस स्रोत के लिए प्लेबैक सक्षम नहीं है", "कोई कार्यक्रम स्रोत दर्ज नहीं है।"],
  ga: ["Réidh leis an bhfotha oifigiúil a luchtú", "Níl athsheinm cumasaithe don fhoinse seo", "Níl aon fhoinse sceidil taifeadta."],
  it: ["Pronto a caricare il flusso ufficiale", "La riproduzione non è attivata per questa fonte", "Nessuna fonte di programmazione registrata."],
  lb: ["Bereet den offizielle Feed ze lueden", "Ofspille fir dës Quell ass net aktivéiert", "Keng Programmquell ass erfaasst."],
  nl: ["Gereed om de officiële stream te laden", "Afspelen is niet ingeschakeld voor deze bron", "Geen programmabron vastgelegd."],
  nb: ["Klar til å laste den offisielle strømmen", "Avspilling er ikke aktivert for denne kilden", "Ingen programkilde er registrert."],
  sk: ["Pripravené na načítanie oficiálneho streamu", "Prehrávanie nie je pre tento zdroj povolené", "Nie je zaznamenaný žiadny zdroj programu."],
  th: ["พร้อมโหลดฟีดอย่างเป็นทางการ", "ไม่ได้เปิดใช้การเล่นสำหรับแหล่งข้อมูลนี้", "ไม่มีแหล่งกำหนดการที่บันทึกไว้"],
  "zh-Hans": ["准备加载官方流", "此来源未启用播放", "未记录节目表来源。"],
  "iu-Cans": ["ᐊᑐᐃᓐᓇᐅᔪᖅ ᐱᔭᕆᐊᖃᖅᑐᒥᒃ ᑕᑯᒃᓴᐅᑎᑦᑎᔾᔪᑎᒥᒃ ᐱᔪᒪᓗᓂ", "ᑕᑯᒃᓴᐅᑎᑦᑎᓂᖅ ᐊᑐᐃᓐᓇᐅᙱᑦᑐᖅ", "ᐅᓪᓗᖅᓯᐅᑎᐅᑉ ᑐᑭᓯᒋᐊᕐᕕᖓ ᑎᑎᕋᖅᑕᐅᓯᒪᙱᑦᑐᖅ."],
  mi: ["Kua reri ki te uta i te roma mana", "Kāore te purei e whakahohea mō tēnei puna", "Kāore he puna hōtaka kua tuhia."],
};
const playerStateKeys = ["ready", "disabled", "noSchedule"];
Object.entries(playerStateLabels).forEach(([locale, values]) => {
  playerStateKeys.forEach((key, index) => { shared[locale][key] = values[index]; });
});

const playbackPolicyLabels = {
  fr: ["Ce point d’accès public peut être lu selon la politique de retrait du catalogue. Il ne s’agit pas d’une licence; consultez les notes de la source et signalez toute préoccupation afin qu’elle soit rapidement retirée.", "La lecture utilise l’intégration officielle du fournisseur avec protection renforcée de la vie privée; aucun manifeste de diffusion n’est extrait."],
  es: ["Este punto de acceso público puede reproducirse conforme a la política de retirada del catálogo. Esto no constituye una licencia; consulte las notas de la fuente y comunique cualquier inquietud para su pronta retirada.", "La reproducción utiliza la inserción oficial del proveedor con privacidad mejorada; no se extrae ningún manifiesto de emisión."],
  "pt-BR": ["Este endpoint público pode ser reproduzido segundo a política de retirada do catálogo. Isto não constitui uma licença; consulte as notas da fonte e comunique qualquer preocupação para remoção imediata.", "A reprodução usa a incorporação oficial do provedor com privacidade aprimorada; nenhum manifesto de transmissão é extraído."],
  da: ["Dette offentlige endepunkt kan afspilles efter katalogets fjernelsespolitik. Det er ikke en licens; læs kildenoterne, og indberet bekymringer med henblik på hurtig fjernelse.", "Afspilning bruger udbyderens officielle privatlivsforbedrede indlejring; intet streammanifest udtrækkes."],
  de: ["Dieser öffentliche Endpunkt kann gemäß der Entfernungspolitik des Katalogs wiedergegeben werden. Dies ist keine Lizenz; prüfen Sie die Quellenhinweise und melden Sie Bedenken zur umgehenden Entfernung.", "Die Wiedergabe nutzt die offizielle datenschutzfreundliche Einbettung des Anbieters; es wird kein Stream-Manifest extrahiert."],
  et: ["Seda avalikku lõpp-punkti saab esitada kataloogi eemaldamispõhimõtte alusel. See ei ole litsents; vaadake allika märkusi ja teatage muredest kiireks eemaldamiseks.", "Esitamine kasutab teenusepakkuja ametlikku privaatsust suurendavat manust; voo manifesti ei eraldata."],
  el: ["Αυτό το δημόσιο σημείο πρόσβασης μπορεί να αναπαραχθεί σύμφωνα με την πολιτική αφαίρεσης του καταλόγου. Δεν αποτελεί άδεια· ελέγξτε τις σημειώσεις της πηγής και αναφέρετε τυχόν ανησυχίες για άμεση αφαίρεση.", "Η αναπαραγωγή χρησιμοποιεί την επίσημη ενσωμάτωση του παρόχου με ενισχυμένη προστασία απορρήτου· δεν εξάγεται μανιφέστο ροής."],
  hi: ["यह सार्वजनिक एंडपॉइंट कैटलॉग की अनुरोध-पर-हटाने की नीति के अंतर्गत चलाया जा सकता है। यह लाइसेंस नहीं है; स्रोत टिप्पणियाँ देखें और शीघ्र हटाने के लिए चिंताएँ दर्ज करें।", "प्लेबैक प्रदाता के आधिकारिक गोपनीयता-संवर्धित एम्बेड का उपयोग करता है; कोई स्ट्रीम मैनिफ़ेस्ट निकाला नहीं जाता।"],
  ga: ["Is féidir an críochphointe poiblí seo a sheinm faoi bheartas bainte an chatalóige. Ní ceadúnas é seo; léigh na nótaí foinse agus tuairiscigh aon ábhar imní lena bhaint go pras.", "Úsáideann an athsheinm leabú oifigiúil feabhsaithe príobháideachais an tsoláthraí; ní bhaintear aon mhaineafacht srutha."],
  it: ["Questo endpoint pubblico è riproducibile secondo la politica di rimozione del catalogo. Non costituisce una licenza; consultare le note della fonte e segnalare eventuali problemi per una rapida rimozione.", "La riproduzione usa l’incorporamento ufficiale del fornitore con protezione avanzata della privacy; non viene estratto alcun manifesto del flusso."],
  lb: ["Dësen ëffentlechen Endpunkt kann no der Ewechhuelungspolitik vum Katalog ofgespillt ginn. Dat ass keng Lizenz; liest d’Quellnotizen a mellt Bedenken, fir datt en direkt ewechgeholl ka ginn.", "D’Ofspille benotzt dem Ubidder seng offiziell dateschutzfrëndlech Abettung; kee Stream-Manifest gëtt extrahéiert."],
  nl: ["Dit openbare endpoint kan worden afgespeeld volgens het verwijderingsbeleid van de catalogus. Dit is geen licentie; raadpleeg de bronnotities en meld bezwaren voor snelle verwijdering.", "Het afspelen gebruikt de officiële privacyvriendelijke insluiting van de aanbieder; er wordt geen streammanifest uitgelezen."],
  nb: ["Dette offentlige endepunktet kan spilles av etter katalogens fjerningspolicy. Dette er ikke en lisens; les kildenotatene og meld bekymringer for rask fjerning.", "Avspillingen bruker leverandørens offisielle personvernforbedrede innebygging; ingen strømmanifest hentes ut."],
  sk: ["Tento verejný koncový bod možno prehrávať podľa zásad katalógu pre odstránenie. Nejde o licenciu; prečítajte si poznámky zdroja a nahláste obavy, aby mohol byť obsah rýchlo odstránený.", "Prehrávanie používa oficiálne vloženie poskytovateľa so zvýšenou ochranou súkromia; manifest streamu sa nezískava."],
  th: ["สามารถเล่นจุดปลายทางสาธารณะนี้ได้ตามนโยบายการนำออกของแคตตาล็อก ข้อความนี้ไม่ใช่ใบอนุญาต โปรดอ่านหมายเหตุของแหล่งข้อมูลและแจ้งข้อกังวลเพื่อให้นำออกโดยเร็ว", "การเล่นใช้การฝังอย่างเป็นทางการของผู้ให้บริการที่เพิ่มการคุ้มครองความเป็นส่วนตัว และไม่มีการดึงรายการสตรีมออกมา"],
  "zh-Hans": ["此公共端点可依据目录的应要求移除政策播放。这并非许可；请查阅来源说明，并报告疑虑以便及时移除。", "播放使用提供方官方的隐私增强型嵌入；不会提取任何流清单。"],
  "iu-Cans": ["ᑖᓐᓇ ᑭᒃᑯᑐᐃᓐᓇᕐᓄᑦ ᑐᕌᖓᔪᖅ ᑕᑯᒃᓴᐅᑎᑦᑎᔾᔪᑎ ᐊᑐᖅᑕᐅᒍᓐᓇᖅᑐᖅ ᑎᑎᕋᖅᓯᒪᔪᑦ ᐲᖅᑕᐅᓂᕐᒧᑦ ᒪᓕᒐᖓ ᒪᓕᒃᖢᒍ. ᓚᐃᓴᓐᓯᐅᙱᑦᑐᖅ; ᓇᑭᙶᕐᓂᖓᑕ ᑎᑎᕋᖅᓯᒪᔪᖏᑦ ᐅᖃᓕᒫᕐᓗᒋᑦ ᐊᒻᒪ ᐃᓱᒫᓘᑎᑦ ᐅᓂᒃᑳᕐᓗᒋᑦ.", "ᑕᑯᒃᓴᐅᑎᑦᑎᓂᖅ ᐊᑐᖅᑐᖅ ᐱᔨᑦᑎᕋᖅᑎᐅᑉ ᑲᙳᓇᖅᑐᓕᕆᓂᕐᒧᑦ ᓴᐳᔾᔨᔪᒥᒃ ᐃᓕᓯᒪᔪᖓ; ᑕᑯᒃᓴᐅᑎᑦᑎᔾᔪᑎᐅᑉ ᑎᑎᕋᖅᓯᒪᔪᖓ ᐲᖅᑕᐅᙱᑦᑐᖅ."],
  mi: ["Ka taea tēnei pito tūmatanui te purei i raro i te kaupapa here tango a te putumōhio. Ehara tēnei i te raihana; tirohia ngā kōrero puna, ā, pūrongotia ngā āwangawanga kia hohoro te tango.", "Ka whakamahi te purei i te tāmau mana a te kaiwhakarato e whakapiki ana i te tūmataiti; kāore he rārangi roma e tangohia."],
};
Object.entries(playbackPolicyLabels).forEach(([locale, values]) => {
  shared[locale].optOutPlaybackPolicy = values[0];
  shared[locale].youtubePlaybackPolicy = values[1];
});

const rightsSummaryLabels = {
  fr: "Résumé des droits du catalogue.", es: "Resumen de derechos del catálogo.", "pt-BR": "Resumo de direitos do catálogo.",
  da: "Katalogets rettighedsoversigt.", de: "Rechteübersicht des Katalogs.", et: "Kataloogi õiguste kokkuvõte.",
  el: "Σύνοψη δικαιωμάτων του καταλόγου.", hi: "कैटलॉग अधिकार सारांश।", ga: "Achoimre cearta an chatalóige.",
  it: "Sintesi dei diritti del catalogo.", lb: "Rechteresumé vum Katalog.", nl: "Rechtenoverzicht van de catalogus.",
  nb: "Katalogets rettighetssammendrag.", sk: "Súhrn práv v katalógu.", th: "สรุปสิทธิ์ของแคตตาล็อก",
  "zh-Hans": "目录权利摘要。", "iu-Cans": "ᑎᑎᕋᖅᓯᒪᔪᑦ ᐱᔪᓐᓇᐅᑎᖏᑕ ᓇᐃᓈᖅᓯᒪᔪᖓ.", mi: "Whakarāpopototanga motika a te putumōhio.",
};
Object.entries(rightsSummaryLabels).forEach(([locale, value]) => { shared[locale].reuse = value; });

const operationalUiLabels = {
  fr: ["Aller au catalogue", "Sélectionnez une source pour consulter sa documentation.", "Redimensionner les détails de la source", "croissant", "décroissant", "La lecture n’a pas pu démarrer dans ce navigateur."],
  es: ["Ir al catálogo", "Seleccione una fuente para consultar su documentación.", "Cambiar el tamaño de los detalles de la fuente", "ascendente", "descendente", "La reproducción no pudo iniciarse en este navegador."],
  "pt-BR": ["Ir para o catálogo", "Selecione uma fonte para ver sua documentação.", "Redimensionar detalhes da fonte", "crescente", "decrescente", "Não foi possível iniciar a reprodução neste navegador."],
  da: ["Gå til kataloget", "Vælg en kilde for at se dokumentationen.", "Tilpas størrelsen på kildedetaljerne", "stigende", "faldende", "Afspilningen kunne ikke startes i denne browser."],
  de: ["Zum Katalog springen", "Wählen Sie eine Quelle aus, um ihre Dokumentation anzuzeigen.", "Größe der Quelldetails ändern", "aufsteigend", "absteigend", "Die Wiedergabe konnte in diesem Browser nicht gestartet werden."],
  et: ["Liigu kataloogi", "Dokumentatsiooni vaatamiseks valige allikas.", "Muuda allika üksikasjade suurust", "kasvav", "kahanev", "Selles brauseris ei saanud esitust alustada."],
  el: ["Μετάβαση στον κατάλογο", "Επιλέξτε μια πηγή για να δείτε την τεκμηρίωσή της.", "Αλλαγή μεγέθους λεπτομερειών πηγής", "αύξουσα", "φθίνουσα", "Η αναπαραγωγή δεν μπόρεσε να ξεκινήσει σε αυτό το πρόγραμμα περιήγησης."],
  hi: ["कैटलॉग पर जाएँ", "दस्तावेज़ देखने के लिए कोई स्रोत चुनें।", "स्रोत विवरण का आकार बदलें", "आरोही", "अवरोही", "इस ब्राउज़र में प्लेबैक शुरू नहीं हो सका।"],
  ga: ["Téigh chuig an gcatalóg", "Roghnaigh foinse chun a doiciméadú a fheiceáil.", "Athraigh méid shonraí na foinse", "ardaitheach", "íslitheach", "Níorbh fhéidir athsheinm a thosú sa bhrabhsálaí seo."],
  it: ["Vai al catalogo", "Seleziona una fonte per consultarne la documentazione.", "Ridimensiona i dettagli della fonte", "crescente", "decrescente", "Impossibile avviare la riproduzione in questo browser."],
  lb: ["Bei de Katalog sprangen", "Wielt eng Quell, fir hir Dokumentatioun ze gesinn.", "Gréisst vun de Quelldetailer änneren", "opsteigend", "ofsteigend", "D’Ofspille konnt an dësem Browser net gestart ginn."],
  nl: ["Ga naar de catalogus", "Selecteer een bron om de documentatie te bekijken.", "Formaat van brondetails wijzigen", "oplopend", "aflopend", "Afspelen kon niet worden gestart in deze browser."],
  nb: ["Gå til katalogen", "Velg en kilde for å se dokumentasjonen.", "Endre størrelsen på kildedetaljene", "stigende", "synkende", "Avspillingen kunne ikke starte i denne nettleseren."],
  sk: ["Prejsť na katalóg", "Vyberte zdroj a zobrazte jeho dokumentáciu.", "Zmeniť veľkosť podrobností zdroja", "vzostupne", "zostupne", "Prehrávanie sa v tomto prehliadači nepodarilo spustiť."],
  th: ["ไปยังแคตตาล็อก", "เลือกแหล่งข้อมูลเพื่อดูเอกสารประกอบ", "ปรับขนาดรายละเอียดแหล่งข้อมูล", "จากน้อยไปมาก", "จากมากไปน้อย", "ไม่สามารถเริ่มเล่นในเบราว์เซอร์นี้ได้"],
  "zh-Hans": ["跳转到目录", "选择一个来源以查看其文档。", "调整来源详情大小", "升序", "降序", "无法在此浏览器中开始播放。"],
  "iu-Cans": ["ᑎᑎᕋᖅᓯᒪᔪᓄᐊᕐᓗᑎᑦ", "ᓇᑭᙶᕐᓂᖓ ᓂᕈᐊᕐᓗᒍ ᑎᑎᕋᖅᓯᒪᔪᖏᑦ ᑕᑯᓂᐊᕐᓗᒋᑦ.", "ᓇᑭᙶᕐᓂᖓᑕ ᓇᓗᓇᐃᖅᓯᓂᖏᑦ ᐊᖏᓂᖏᑦ ᐊᓯᔾᔨᕐᓗᒋᑦ", "ᒥᑭᓛᒥᑦ ᐊᖏᓛᒧᑦ", "ᐊᖏᓛᒥᑦ ᒥᑭᓛᒧᑦ", "ᑕᕝᕙᓂ ᕿᓂᕐᕕᖕᒥ ᑕᑯᒃᓴᐅᑎᑦᑎᓂᖅ ᐱᒋᐊᕈᓐᓇᓚᐅᙱᑦᑐᖅ."],
  mi: ["Peke ki te putumōhio", "Tīpakohia he puna hei tiro i ōna tuhinga.", "Hurihia te rahi o ngā taipitopito puna", "ake", "heke", "Kāore i taea te tīmata te purei i tēnei pūtirotiro."],
};
const operationalUiKeys = ["skipCatalogue", "selectSource", "resizeDetails", "sortAscending", "sortDescending", "playbackError"];
Object.entries(operationalUiLabels).forEach(([locale, values]) => {
  operationalUiKeys.forEach((key, index) => { shared[locale][key] = values[index]; });
});

const catalogueResultLabels = {
  fr: "Résultats du catalogue", es: "Resultados del catálogo", "pt-BR": "Resultados do catálogo",
  da: "Katalogresultater", de: "Katalogergebnisse", et: "Kataloogi tulemused",
  el: "Αποτελέσματα καταλόγου", hi: "कैटलॉग परिणाम", ga: "Torthaí an chatalóige",
  it: "Risultati del catalogo", lb: "Katalogresultater", nl: "Catalogusresultaten",
  nb: "Katalogresultater", sk: "Výsledky katalógu", th: "ผลลัพธ์แคตตาล็อก",
  "zh-Hans": "目录结果", "iu-Cans": "ᑎᑎᕋᖅᓯᒪᔪᑦ ᖃᐅᔨᔭᐅᔪᑦ", mi: "Ngā hua putumōhio",
};
Object.entries(catalogueResultLabels).forEach(([locale, value]) => {
  shared[locale].catalogueResults = value;
  shared[locale].catalogueTable = value;
});

const missingFilterLabels = {
  da: ["Alle jurisdiktioner", "Alle kildetyper"],
  et: ["Kõik jurisdiktsioonid", "Kõik allikatüübid"],
  el: ["Όλες οι δικαιοδοσίες", "Όλοι οι τύποι πηγών"],
  hi: ["सभी अधिकार-क्षेत्र", "सभी स्रोत प्रकार"],
  nl: ["Alle rechtsgebieden", "Alle brontypen"],
  nb: ["Alle jurisdiksjoner", "Alle kildetyper"],
  th: ["เขตอำนาจทั้งหมด", "ประเภทแหล่งข้อมูลทั้งหมด"],
  "zh-Hans": ["所有管辖区", "所有来源类型"],
};
Object.entries(missingFilterLabels).forEach(([locale, values]) => {
  [shared[locale].allJur, shared[locale].allTypes] = values;
});

const missingLoadErrorLabels = {
  da: ["Kataloget kunne ikke indlæses.", "Det statiske websted forventer data/channels.json ved siden af sideartefaktet."],
  et: ["Kataloogi ei saanud laadida.", "Staatiline sait eeldab faili data/channels.json lehe artefakti kõrval."],
  el: ["Δεν ήταν δυνατή η φόρτωση του καταλόγου.", "Ο στατικός ιστότοπος αναμένει το data/channels.json δίπλα στο τεχνούργημα της σελίδας."],
  hi: ["कैटलॉग लोड नहीं हो सका।", "स्थिर साइट पृष्ठ आर्टिफ़ैक्ट के पास data/channels.json की अपेक्षा करती है।"],
  ga: ["Níorbh fhéidir an chatalóg a luchtú.", "Tá an suíomh statach ag súil le data/channels.json in aice leis an déantán leathanaigh."],
  lb: ["De Katalog konnt net geluede ginn.", "De statesche Site erwaart data/channels.json nieft dem Säitenartefakt."],
  nl: ["De catalogus kon niet worden geladen.", "De statische site verwacht data/channels.json naast het pagina-artefact."],
  nb: ["Katalogen kunne ikke lastes.", "Det statiske nettstedet forventer data/channels.json ved siden av sideartefaktet."],
  th: ["ไม่สามารถโหลดแคตตาล็อกได้", "ไซต์แบบคงที่ต้องการ data/channels.json อยู่ข้างอาร์ติแฟกต์ของหน้า"],
  "zh-Hans": ["无法加载目录。", "静态站点要求 data/channels.json 与页面构件位于同一位置。"],
};
Object.entries(missingLoadErrorLabels).forEach(([locale, values]) => {
  [shared[locale].sourceError, shared[locale].sourceErrorDetail] = values;
});

const sourceCueLabels = {
  fr: ["Lisible", "Lien externe", "Solution de repli", "Recherche", "Dernière validation", "Aucun rapport de validation conservé pour l’instant.", "Vérifié le {date}", "Méthode", "Rapport", "HTTP statique", "Navigateur/lecteur", "Source de manifeste", "Suivi de revue"],
  es: ["Reproducible", "Enlace externo", "Alternativa", "Investigación", "Última validación", "Aún no hay informe de validación conservado.", "Verificado el {date}", "Método", "Informe", "HTTP estático", "Navegador/reproductor", "Semilla de manifiesto", "Seguimiento de revisión"],
  "pt-BR": ["Reproduzível", "Link externo", "Alternativa", "Pesquisa", "Validação mais recente", "Ainda não há relatório de validação retido.", "Verificado em {date}", "Método", "Relatório", "HTTP estático", "Navegador/player", "Semente de manifesto", "Acompanhamento da revisão"],
  da: ["Kan afspilles", "Eksternt link", "Reserve", "Research", "Seneste validering", "Ingen gemt valideringsrapport endnu.", "Kontrolleret {date}", "Metode", "Rapport", "Statisk HTTP", "Browser/afspiller", "Manifestgrundlag", "Opfølgning på gennemgang"],
  de: ["Abspielbar", "Externer Link", "Fallback", "Recherche", "Letzte Validierung", "Noch kein aufbewahrter Validierungsbericht.", "Geprüft am {date}", "Methode", "Bericht", "Statisches HTTP", "Browser/Player", "Manifest-Ausgangspunkt", "Review-Nachverfolgung"],
  et: ["Esitatav", "Välislink", "Varuvariant", "Uurimisel", "Viimane valideerimine", "Säilitatud valideerimisaruannet veel ei ole.", "Kontrollitud {date}", "Meetod", "Aruanne", "Staatiline HTTP", "Brauser/mängija", "Manifesti algandmed", "Ülevaatuse järelkontroll"],
  el: ["Αναπαραγωγή", "Εξωτερικός σύνδεσμος", "Εναλλακτική", "Έρευνα", "Τελευταία επικύρωση", "Δεν υπάρχει ακόμη διατηρημένη αναφορά επικύρωσης.", "Ελέγχθηκε {date}", "Μέθοδος", "Αναφορά", "Στατικό HTTP", "Πρόγραμμα περιήγησης/αναπαραγωγής", "Δείγμα manifest", "Παρακολούθηση ελέγχου"],
  hi: ["चलाने योग्य", "बाहरी लिंक", "वैकल्पिक", "शोध", "नवीनतम सत्यापन", "अभी कोई संरक्षित सत्यापन रिपोर्ट नहीं है।", "{date} को जांचा गया", "विधि", "रिपोर्ट", "स्थिर HTTP", "ब्राउज़र/प्लेयर", "मैनिफेस्ट स्रोत", "समीक्षा अनुवर्ती"],
  ga: ["Inseinnte", "Nasc amach", "Cúltaca", "Taighde", "Bailíochtú is déanaí", "Níl aon tuarascáil bhailíochtaithe coinnithe fós.", "Seiceáilte {date}", "Modh", "Tuarascáil", "HTTP statach", "Brabhsálaí/seinnteoir", "Síol manifest", "Obair leantach athbhreithnithe"],
  it: ["Riproducibile", "Link esterno", "Alternativa", "Ricerca", "Ultima convalida", "Nessun rapporto di convalida conservato finora.", "Verificato il {date}", "Metodo", "Rapporto", "HTTP statico", "Browser/player", "Seed del manifesto", "Follow-up della revisione"],
  lb: ["Ofspillbar", "Externe Link", "Auswee", "Fuerschung", "Lescht Validéierung", "Nach kee gespäicherte Validéierungsrapport.", "Gepréift den {date}", "Method", "Rapport", "Stateschen HTTP", "Browser/Player", "Manifest-Seed", "Nokontroll vun der Iwwerpréiwung"],
  nl: ["Afspeelbaar", "Externe link", "Terugval", "Onderzoek", "Laatste validatie", "Nog geen bewaard validatierapport.", "Gecontroleerd op {date}", "Methode", "Rapport", "Statische HTTP", "Browser/speler", "Manifestbron", "Opvolging van beoordeling"],
  nb: ["Kan spilles", "Ekstern lenke", "Reserve", "Research", "Siste validering", "Ingen lagret valideringsrapport ennå.", "Kontrollert {date}", "Metode", "Rapport", "Statisk HTTP", "Nettleser/avspiller", "Manifestgrunnlag", "Oppfølging av gjennomgang"],
  sk: ["Prehrateľné", "Externý odkaz", "Záložné riešenie", "Výskum", "Najnovšie overenie", "Zatiaľ nie je uložená žiadna validačná správa.", "Skontrolované {date}", "Metóda", "Správa", "Statické HTTP", "Prehliadač/prehrávač", "Zdroj manifestu", "Následná kontrola"],
  th: ["เล่นได้", "ลิงก์ออก", "ทางเลือกสำรอง", "วิจัย", "การตรวจสอบล่าสุด", "ยังไม่มีรายงานการตรวจสอบที่เก็บไว้", "ตรวจสอบเมื่อ {date}", "วิธี", "รายงาน", "HTTP แบบคงที่", "เบราว์เซอร์/เครื่องเล่น", "ชุดตั้งต้นของ manifest", "การติดตามผลการตรวจสอบ"],
  "zh-Hans": ["可播放", "外部链接", "备用来源", "研究中", "最新验证", "尚无保留的验证报告。", "检查于 {date}", "方法", "报告", "静态 HTTP", "浏览器/播放器", "清单种子", "复核跟进"],
  mi: ["Ka purei", "Hononga atu", "Kōwhiringa tāpiri", "Rangahau", "Whakamana hou rawa", "Kāore anō he pūrongo whakamana kua puritia.", "I tirohia {date}", "Tikanga", "Pūrongo", "HTTP pateko", "Pūtirotiro/pūwhakatangi", "Kākano manifest", "Arotake whai-muri"],
  "iu-Cans": ["ᐱᙳᐊᕈᓐᓇᖅᑐᖅ", "ᐊᓯᐊᓄᑦ ᑲᑎᙵᔪᖅ", "ᐊᓯᐊᒍᑦ ᐊᑐᕈᓐᓇᖅᑐᖅ", "ᖃᐅᔨᓴᕐᓂᖅ", "ᓄᑖᖑᓛᖅ ᓇᓗᓇᐃᕐᓂᖅ", "ᓱᓕ ᓇᓗᓇᐃᕐᓂᕐᒧᑦ ᐅᓂᒃᑳᖅ ᐱᑕᖃᙱᑦᑐᖅ.", "ᓇᓗᓇᐃᖅᑕᐅᔪᖅ {date}", "ᐊᑐᕐᓂᐅᔪᖅ", "ᐅᓂᒃᑳᖅ", "HTTP ᐊᓯᔾᔨᙱᑦᑐᖅ", "ᕿᓂᕈᑎ/ᐱᙳᐊᕈᑎ", "manifest ᐱᒋᐊᕐᕕᒃ", "ᕿᒥᕐᕈᓂᐅᑉ ᑭᖑᓂᐊᒍᑦ"],
};
Object.entries(sourceCueLabels).forEach(([locale, values]) => {
  [
    shared[locale].sourcePlayable,
    shared[locale].sourceLinkOut,
    shared[locale].sourceFallback,
    shared[locale].sourceResearch,
    shared[locale].latestValidation,
    shared[locale].validationNotRecorded,
    shared[locale].validationChecked,
    shared[locale].validationMethod,
    shared[locale].validationReport,
    shared[locale].staticHttpValidation,
    shared[locale].browserPlayerValidation,
    shared[locale].manifestSeedValidation,
    shared[locale].reviewFollowupValidation,
  ] = values;
});

const modeAndStatusDescriptionLabels = {
  fr: ["Mode", "La dernière validation conservée a réussi.", "L'accès technique doit être revu ou le dernier contrôle n'était pas net.", "Aucune URL de lecture native n'est enregistrée; utilisez la page officielle.", "La réutilisation semble permise selon les conditions enregistrées.", "Utilisez seulement l'intégration officielle du fournisseur ou de l'institution.", "Les conditions enregistrées exigent un lien externe ou une permission distincte.", "Les conditions publiques ne permettent pas encore clairement l'usage par un tiers.", "Un usage non commercial est documenté, mais la lecture complète du flux doit encore être clarifiée."],
  es: ["Modo", "La última validación conservada fue correcta.", "El acceso técnico necesita revisión o la última comprobación no fue limpia.", "No hay una URL de reproducción nativa registrada; usa la página oficial.", "La reutilización parece permitida según las condiciones registradas.", "Usa solo la inserción oficial del proveedor o de la institución.", "Las condiciones registradas exigen enlace externo o permiso separado.", "Las condiciones públicas aún no respaldan claramente el uso por terceros.", "Hay cierto uso no comercial documentado, pero la reproducción completa del flujo aún requiere aclaración."],
  "pt-BR": ["Modo", "A validação retida mais recente foi bem-sucedida.", "O acesso técnico precisa de revisão ou a última verificação não foi limpa.", "Nenhuma URL de reprodução nativa está registrada; use a página oficial.", "A reutilização parece permitida conforme as condições registradas.", "Use apenas a incorporação oficial do provedor ou da instituição.", "As condições registradas exigem link externo ou permissão separada.", "Os termos públicos ainda não apoiam claramente o uso por terceiros.", "Algum uso não comercial está documentado, mas a reprodução integral do fluxo ainda precisa de esclarecimento."],
  da: ["Tilstand", "Den senest gemte validering lykkedes.", "Den tekniske adgang skal gennemgås, eller den seneste kontrol var ikke ren.", "Der er ikke registreret en URL til indbygget afspilning; brug den officielle side.", "Genbrug ser ud til at være tilladt efter de registrerede vilkår.", "Brug kun den officielle indlejring fra udbyderen eller institutionen.", "De registrerede vilkår kræver eksternt link eller særskilt tilladelse.", "De offentlige vilkår understøtter endnu ikke tydeligt tredjepartsbrug.", "Noget ikke-kommercielt brug er dokumenteret, men fuld afspilning af streamen kræver stadig afklaring."],
  de: ["Modus", "Die letzte gespeicherte Validierung war erfolgreich.", "Der technische Zugang muss geprüft werden oder die letzte Prüfung war nicht sauber.", "Es ist keine native Wiedergabe-URL erfasst; verwenden Sie die offizielle Seite.", "Wiederverwendung scheint nach den erfassten Bedingungen erlaubt zu sein.", "Nur die offizielle Einbettung des Anbieters oder der Institution verwenden.", "Die erfassten Bedingungen verlangen einen externen Link oder eine gesonderte Erlaubnis.", "Die öffentlichen Bedingungen unterstützen Drittverwendung noch nicht eindeutig.", "Eine nicht-kommerzielle Nutzung ist teilweise dokumentiert, aber vollständige Stream-Wiedergabe muss noch geklärt werden."],
  et: ["Režiim", "Viimane säilitatud valideerimine õnnestus.", "Tehniline juurdepääs vajab ülevaatust või viimane kontroll ei olnud puhas.", "Natiivse esituse URL-i pole salvestatud; kasutage ametlikku lehte.", "Taaskasutus näib olevat salvestatud tingimuste järgi lubatud.", "Kasutage ainult pakkuja või asutuse ametlikku manustust.", "Salvestatud tingimused nõuavad välislinki või eraldi luba.", "Avalikud tingimused ei toeta veel selgelt kolmanda osapoole kasutust.", "Mõningane mitteäriline kasutus on dokumenteeritud, kuid kogu voo esitamine vajab veel täpsustamist."],
  el: ["Τρόπος", "Η τελευταία διατηρημένη επικύρωση ήταν επιτυχής.", "Η τεχνική πρόσβαση χρειάζεται έλεγχο ή ο τελευταίος έλεγχος δεν ήταν καθαρός.", "Δεν έχει καταγραφεί εγγενής URL αναπαραγωγής· χρησιμοποιήστε την επίσημη σελίδα.", "Η επαναχρησιμοποίηση φαίνεται να επιτρέπεται με βάση τους καταγεγραμμένους όρους.", "Χρησιμοποιήστε μόνο την επίσημη ενσωμάτωση του παρόχου ή του φορέα.", "Οι καταγεγραμμένοι όροι απαιτούν εξωτερικό σύνδεσμο ή ξεχωριστή άδεια.", "Οι δημόσιοι όροι δεν υποστηρίζουν ακόμη σαφώς χρήση από τρίτους.", "Κάποια μη εμπορική χρήση είναι τεκμηριωμένη, αλλά η πλήρης αναπαραγωγή της ροής χρειάζεται ακόμη διευκρίνιση."],
  hi: ["मोड", "नवीनतम संरक्षित सत्यापन सफल रहा।", "तकनीकी पहुंच की समीक्षा चाहिए या नवीनतम जांच साफ नहीं थी।", "कोई मूल प्लेबैक URL दर्ज नहीं है; आधिकारिक पृष्ठ का उपयोग करें।", "दर्ज स्रोत शर्तों के तहत पुन: उपयोग अनुमत लगता है।", "केवल आधिकारिक प्रदाता या संस्थागत एम्बेड का उपयोग करें।", "दर्ज शर्तों में बाहरी लिंक या अलग अनुमति आवश्यक है।", "सार्वजनिक शर्तें अभी तृतीय-पक्ष उपयोग को स्पष्ट रूप से समर्थन नहीं देतीं।", "कुछ गैर-व्यावसायिक उपयोग दर्ज है, लेकिन पूरे स्ट्रीम प्लेबैक पर अभी स्पष्टीकरण चाहिए।"],
  ga: ["Mód", "D'éirigh leis an mbailíochtú coinnithe is déanaí.", "Teastaíonn athbhreithniú ar an rochtain theicniúil nó ní raibh an tseiceáil is déanaí glan.", "Níl URL dúchasach athsheinm taifeadta; bain úsáid as an leathanach oifigiúil.", "Is cosúil go gceadaítear athúsáid faoi na coinníollacha taifeadta.", "Ná húsáid ach leabú oifigiúil an tsoláthraí nó na hinstitiúide.", "Éilíonn na coinníollacha taifeadta nasc amach nó cead ar leith.", "Ní thacaíonn na téarmaí poiblí go soiléir fós le húsáid tríú páirtí.", "Tá roinnt úsáide neamhthráchtála doiciméadaithe, ach tá soiléiriú fós de dhíth ar athsheinm iomlán an tsrutha."],
  it: ["Modalità", "L'ultima convalida conservata è riuscita.", "L'accesso tecnico richiede revisione oppure l'ultimo controllo non è stato pulito.", "Non è registrato alcun URL di riproduzione nativa; usa la pagina ufficiale.", "Il riuso sembra consentito secondo le condizioni registrate.", "Usa solo l'incorporamento ufficiale del fornitore o dell'istituzione.", "Le condizioni registrate richiedono un link esterno o un'autorizzazione separata.", "I termini pubblici non supportano ancora chiaramente l'uso da parte di terzi.", "È documentato qualche uso non commerciale, ma la riproduzione completa del flusso richiede ancora chiarimenti."],
  lb: ["Modus", "Déi lescht gespäichert Validéierung war erfollegräich.", "Den techneschen Zougang muss nogekuckt ginn oder déi lescht Kontroll war net propper.", "Et ass keng nativ Ofspill-URL registréiert; benotzt déi offiziell Säit.", "Wiederverwendung schéngt no de registréierte Konditiounen erlaabt ze sinn.", "Benotzt nëmmen déi offiziell Abettung vum Ubidder oder der Institutioun.", "Déi registréiert Konditioune verlaangen en externe Link oder eng getrennte Erlaabnis.", "Déi ëffentlech Konditioune ënnerstëtzen Drëttbenotzung nach net kloer.", "E puer net-kommerziell Benotzung ass dokumentéiert, mee voll Stream-Ofspillung muss nach gekläert ginn."],
  nl: ["Modus", "De laatst bewaarde validatie is geslaagd.", "Technische toegang moet worden beoordeeld of de laatste controle was niet schoon.", "Er is geen native afspeel-URL geregistreerd; gebruik de officiële pagina.", "Hergebruik lijkt toegestaan volgens de vastgelegde bronvoorwaarden.", "Gebruik alleen de officiële embed van de aanbieder of instelling.", "De vastgelegde voorwaarden vereisen een externe link of afzonderlijke toestemming.", "De openbare voorwaarden ondersteunen gebruik door derden nog niet duidelijk.", "Enig niet-commercieel gebruik is gedocumenteerd, maar volledige streamweergave vraagt nog om verduidelijking."],
  nb: ["Modus", "Siste lagrede validering lyktes.", "Teknisk tilgang må gjennomgås, eller siste kontroll var ikke ren.", "Ingen URL for innebygd avspilling er registrert; bruk den offisielle siden.", "Gjenbruk ser ut til å være tillatt etter registrerte kildevilkår.", "Bruk bare den offisielle innbyggingen fra leverandøren eller institusjonen.", "Registrerte vilkår krever ekstern lenke eller separat tillatelse.", "Offentlige vilkår støtter ennå ikke tydelig tredjepartsbruk.", "Noe ikke-kommersiell bruk er dokumentert, men full avspilling av strømmen må fortsatt avklares."],
  sk: ["Režim", "Najnovšie uložené overenie bolo úspešné.", "Technický prístup potrebuje kontrolu alebo posledná kontrola nebola čistá.", "Nie je zaznamenaná žiadna natívna URL na prehrávanie; použite oficiálnu stránku.", "Opätovné použitie sa podľa zaznamenaných podmienok javí ako povolené.", "Použite iba oficiálne vloženie poskytovateľa alebo inštitúcie.", "Zaznamenané podmienky vyžadujú externý odkaz alebo samostatné povolenie.", "Verejné podmienky ešte jasne nepodporujú použitie treťou stranou.", "Niektoré nekomerčné použitie je zdokumentované, ale úplné prehrávanie streamu stále vyžaduje objasnenie."],
  th: ["โหมด", "การตรวจสอบล่าสุดที่เก็บไว้สำเร็จแล้ว", "การเข้าถึงทางเทคนิคต้องตรวจสอบอีกครั้ง หรือการตรวจสอบล่าสุดยังไม่เรียบร้อย", "ยังไม่มี URL สำหรับเล่นแบบเนทีฟที่บันทึกไว้ โปรดใช้หน้าทางการ", "การใช้ซ้ำน่าจะได้รับอนุญาตตามเงื่อนไขแหล่งข้อมูลที่บันทึกไว้", "ใช้เฉพาะการฝังอย่างเป็นทางการจากผู้ให้บริการหรือหน่วยงาน", "เงื่อนไขที่บันทึกไว้กำหนดให้ลิงก์ออกหรือขออนุญาตแยกต่างหาก", "เงื่อนไขสาธารณะยังไม่รองรับการใช้โดยบุคคลที่สามอย่างชัดเจน", "มีการบันทึกการใช้แบบไม่เชิงพาณิชย์บางส่วน แต่การเล่นสตรีมเต็มยังต้องขอความชัดเจน"],
  "zh-Hans": ["模式", "最近保留的验证已成功。", "技术访问需要复核，或最近一次检查并不完全正常。", "未记录原生播放 URL；请使用官方页面。", "根据已记录的来源条件，似乎允许再利用。", "只能使用提供方或机构的官方嵌入。", "已记录的条件要求外链或单独许可。", "公开条款尚未明确支持第三方使用。", "已记录部分非商业使用，但完整流播放仍需进一步澄清。"],
  mi: ["Aratau", "I angitu te whakamana hou kua puritia.", "Me arotake te urunga hangarau, kāore rānei te tirohanga hou i tino pai.", "Kāore he URL purei taketake kua tuhia; whakamahia te whārangi mana.", "E ai ki ngā tikanga kua tuhia, ka āhei pea te whakamahi anō.", "Whakamahia anake te tāuru mana a te kaiwhakarato, a te rōpū rānei.", "E tono ana ngā tikanga kua tuhia kia hono atu, kia whiwhi whakaaetanga motuhake rānei.", "Kāore anō ngā tikanga tūmatanui kia tautoko mārama i te whakamahi a te hunga tuatoru.", "Kua tuhia ētahi whakamahi kore-arumoni, engari me whakamārama tonu te purei katoa o te roma."],
  "iu-Cans": ["ᐊᑐᕐᓂᐅᔪᖅ", "ᓄᑖᖑᓛᖅ ᓇᓗᓇᐃᖅᑕᐅᓯᒪᔪᖅ ᐊᔪᙱᓚᖅ.", "ᐱᓕᕆᐊᖑᔪᖅ ᐱᔭᐅᔪᓐᓇᕐᓂᖅ ᕿᒥᕐᕈᔭᐅᒋᐊᓕᒃ, ᓄᑖᖑᓛᕐᓘᓐᓃᑦ ᓇᓗᓇᐃᕐᓂᖅ ᓴᓗᒪᓚᐅᙱᑦᑐᖅ.", "ᐱᙳᐊᕈᑎᒧᑦ URL ᑎᑎᖅᑕᐅᓯᒪᙱᑦᑐᖅ; ᐊᑐᕐᓗᒍ ᑲᔪᓯᔪᖅ ᐅᑯᐊ ᒪᑉᐱᒐᖅ.", "ᐊᑐᕐᓂᖅ ᐊᒻᒪ ᐊᑐᕐᓂᖅ ᐊᔪᙱᔮᖅᑐᖅ ᑎᑎᖅᑕᐅᓯᒪᔪᑦ ᐊᑐᖅᑕᐅᓂᐊᖅᑐᑦ ᒪᓕᒃᖢᒋᑦ.", "ᐊᑐᕐᓗᒍ ᐱᓕᕆᕕᐅᑉ ᐅᕝᕙᓘᓐᓃᑦ ᑎᒥᐅᔫᑉ ᐊᖏᖅᑕᖓ ᐃᓕᔭᐅᔪᖅ ᑭᓯᐊᓂ.", "ᑎᑎᖅᑕᐅᓯᒪᔪᑦ ᒪᓕᒐᐃᑦ ᐊᓯᐊᓄᑦ ᑲᑎᙵᔪᒥᒃ ᐅᕝᕙᓘᓐᓃᑦ ᐊᔪᙱᑎᑕᐅᓂᕐᒥᒃ ᐱᔭᕆᐊᖃᖅᑐᑦ.", "ᑭᒃᑯᑐᐃᓐᓇᐃᑦ ᒪᓕᒐᖏᑦ ᐊᓯᐊᓂᑦ ᐊᑐᕐᓂᕐᒥᒃ ᓱᓕ ᑐᑭᓯᓇᖅᑐᒥᒃ ᐃᑲᔪᖅᓯᙱᑦᑐᑦ.", "ᐃᓚᖓ ᑮᓇᐅᔭᓕᐅᕐᓂᐅᙱᑦᑐᖅ ᐊᑐᕐᓂᖅ ᑎᑎᖅᑕᐅᓯᒪᔪᖅ, ᑭᓯᐊᓂ ᑕᒪᐅᓇ ᑰᒃᑐᖅ ᐱᙳᐊᕐᓂᖅ ᓱᓕ ᑐᑭᓯᓇᖅᑎᑕᐅᒋᐊᓕᒃ."],
};
Object.entries(modeAndStatusDescriptionLabels).forEach(([locale, values]) => {
  [
    shared[locale].mode,
    shared[locale].accessValidatedDescription,
    shared[locale].accessNeedsReviewDescription,
    shared[locale].accessLinkOnlyDescription,
    shared[locale].useExplicitDescription,
    shared[locale].useEmbedOnlyDescription,
    shared[locale].useNoThirdPartyDescription,
    shared[locale].usePersonalPendingDescription,
    shared[locale].useNoncommercialPendingDescription,
  ] = values;
});

const validationStatusLabels = {
  fr: ["OK", "Avertissement", "Erreur", "Ignoré"],
  es: ["Correcto", "Advertencia", "Error", "Omitido"],
  "pt-BR": ["OK", "Aviso", "Erro", "Ignorado"],
  da: ["OK", "Advarsel", "Fejl", "Sprunget over"],
  de: ["OK", "Warnung", "Fehler", "Übersprungen"],
  et: ["OK", "Hoiatus", "Viga", "Vahele jäetud"],
  el: ["OK", "Προειδοποίηση", "Σφάλμα", "Παραλείφθηκε"],
  hi: ["ठीक", "चेतावनी", "त्रुटि", "छोड़ा गया"],
  ga: ["OK", "Rabhadh", "Earráid", "Scipeáilte"],
  it: ["OK", "Avviso", "Errore", "Saltato"],
  lb: ["OK", "Warnung", "Feeler", "Iwwersprongen"],
  nl: ["OK", "Waarschuwing", "Fout", "Overgeslagen"],
  nb: ["OK", "Advarsel", "Feil", "Hoppet over"],
  sk: ["OK", "Upozornenie", "Chyba", "Preskočené"],
  th: ["ตกลง", "คำเตือน", "ข้อผิดพลาด", "ข้ามแล้ว"],
  "zh-Hans": ["正常", "警告", "错误", "已跳过"],
  mi: ["OK", "Whakatūpato", "Hapa", "Kua pekehia"],
  "iu-Cans": ["OK", "ᐅᔾᔨᖅᓱᖁᔨᓂᖅ", "ᑕᒻᒪᕐᓂᖅ", "ᐊᓪᓗᖅᑕᐅᔪᖅ"],
};
Object.entries(validationStatusLabels).forEach(([locale, values]) => {
  [shared[locale].labels.ok, shared[locale].labels.warning, shared[locale].labels.error, shared[locale].labels.skipped] = values;
});

for (const [locale] of locales) {
  if (locale === "en") continue;
  const messages = shared[locale];
  messages.catalogue ??= messages.nav;
  messages.brandHome ??= `Parliament Streams · ${messages.about}`;
  messages.primaryNavigation ??= messages.nav;
  for (const messageKey of [
    "sourceKind",
    "stabilityRisk",
    "playbackPolicy",
    "mode",
    "accessValidatedDescription",
    "accessNeedsReviewDescription",
    "accessLinkOnlyDescription",
    "useExplicitDescription",
    "useEmbedOnlyDescription",
    "useNoThirdPartyDescription",
    "usePersonalPendingDescription",
    "useNoncommercialPendingDescription",
    "fallbacks",
    "fallbackDirectoryLabel",
    "fallbackDirectoryTitle",
    "noFallbacks",
    "fallbackEventPlatform",
    "fallbackLivePage",
    "fallbackYoutubeLive",
    "fallbackYoutubeUploads",
    "fallbackArchive",
    "fallbackBroadcaster",
    "fallbackLinkOut",
    "fallbackProviderEmbed",
    "fallbackEventResolver",
    "fallbackScheduleSource",
    "fallbackNowNext",
    "fallbackNoSchedule",
    "sourcePlayable",
    "sourceLinkOut",
    "sourceFallback",
    "sourceResearch",
    "latestValidation",
    "validationNotRecorded",
    "validationChecked",
    "validationMethod",
    "validationReport",
    "staticHttpValidation",
    "browserPlayerValidation",
    "manifestSeedValidation",
    "reviewFollowupValidation",
  ]) {
    messages[messageKey] ??= en[messageKey];
  }
  for (const labelKey of [
    "direct_hls",
    "direct_dash",
    "youtube",
    "first_party_hls",
    "official_vendor_hls",
    "third_party_relay_hls",
    "direct_dash_research",
    "official_youtube_embed",
    "native_playback",
    "provider_embed",
    "link_out",
    "research_only",
    "low",
    "medium",
    "high",
    "unknown",
    "ok",
    "warning",
    "error",
    "skipped",
  ]) {
    messages.labels[labelKey] ??= en.labels[labelKey];
  }
}

function translationCoverage(locale) {
  const localeMessages = locale === "en" ? en : shared[locale];
  const messages = Object.keys(en).filter((key) => key !== "labels" && !Object.hasOwn(localeMessages, key));
  const labels = Object.keys(en.labels).filter((key) => !Object.hasOwn(localeMessages.labels, key));
  return { messages, labels };
}

function message(locale, key, values = {}) {
  const value = shared[locale]?.[key] ?? en[key] ?? key;
  if (typeof value !== "string") return value;
  return value.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}

function localizedLabel(locale, value) {
  return shared[locale]?.labels?.[value] ?? en.labels[value] ?? value.replaceAll("_", " ");
}

function supportedLocale(candidate) {
  if (!candidate) return "en";
  const exact = locales.find(([code]) => code.toLocaleLowerCase() === candidate.toLocaleLowerCase());
  if (exact) return exact[0];
  const language = candidate.split("-")[0].toLocaleLowerCase();
  return locales.find(([code]) => code.split("-")[0] === language)?.[0] ?? "en";
}

window.ParliamentStreamsI18n = { locales, localizedLabel, message, supportedLocale, translationCoverage };
})();
