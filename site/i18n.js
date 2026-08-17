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
  nav: "Catalogue", language: "Language", research: "Public research catalogue",
  title: "Parliamentary video, documented.",
  lede: "Official stream endpoints, watch pages, schedule surfaces, and the evidence needed to judge how each source may be used.",
  browse: "Browse sources", catalogue: "Catalogue", json: "View source JSON", search: "Search country, legislature, or channel", filters: "Filters", close: "Close source details",
  allJur: "All jurisdictions", allTypes: "All source types", allUse: "All use guidance",
  source: "Source", jurisdiction: "Jurisdiction", format: "Format", contentLanguage: "Language", access: "Access", use: "Use",
  care: "Use with care", methodTitle: "Technical access and provider terms are different questions.",
  methodCopy: "Technically validated public direct feeds play here unless recorded terms expressly prohibit third-party reuse. A play button is not a licence; source owners can request removal.",
  rights: "Read rights and permission notes", footer: "Parliament Streams is an independent research catalogue.", about: "About the project",
  openStreams: "Open stream principles",
  openStreamsCopy: "Open parliamentary video also needs open schedule data. Legislatures should publish timely, machine-readable programme and event feeds at stable URLs, with clear reuse terms, persistent identifiers, time zones, and prompt corrections.",
  sourceType: "Source type", accessStatus: "Access status", useGuidance: "Use guidance", availability: "Availability",
  attribution: "Required attribution", programme: "Current programme record", identity: "External identity", schedule: "Schedule / EPG sources",
  nowProgramme: "Now:", nextProgramme: "Next:", scheduleCollected: "Schedule collected {date}",
  reuse: "Reuse note.", recommendation: "Catalogue recommendation.", watch: "Watch here", official: "Open official source",
  ready: "Ready to load the official feed", disabled: "Playback is not enabled for this source",
  noResults: "No catalogue entries match these filters.", noSchedule: "No schedule surface recorded.",
  sourceError: "The catalogue could not be loaded.", sourceErrorDetail: "The static site expects data/channels.json beside the page artifact.",
  results: "{shown} of {total} sources", documented: "{count} documented sources · catalogue generated {date}",
  labels: {
    direct_hls: "HLS", direct_dash: "DASH", official_page: "Official page", youtube: "YouTube",
    validated: "Verified", needs_review: "Review", link_only: "Page only",
    national: "National", subnational: "Subnational", supranational: "Supranational",
    personal_use_pending_review: "Unclear", noncommercial_pending_review: "Limited",
    explicit_reuse_with_conditions: "With conditions", embed_only: "Official embed", no_third_party_reuse: "No reuse",
    always_on: "Always on", sitting_only: "Sitting only", event_based: "Event based",
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

window.ParliamentStreamsI18n = { locales, localizedLabel, message, supportedLocale };
})();
