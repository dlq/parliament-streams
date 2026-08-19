(() => {
// The deployed Pages artifact places its JSON beside this script; local server
// previews serve the repository's data directory one level above site/.
const { locales, localizedLabel, message, supportedLocale } = window.ParliamentStreamsI18n;

const appScriptUrl = document.currentScript?.src ?? window.location.href;
const catalogueUrl = new URL("./data/channels.json", appScriptUrl);
const localCatalogueUrl = new URL("../data/channels.json", appScriptUrl);
const fallbacksUrl = new URL("./data/fallbacks.json", appScriptUrl);
const localFallbacksUrl = new URL("../data/fallbacks.json", appScriptUrl);
const schedulesUrl = new URL("./data/schedules.json", appScriptUrl);
const localSchedulesUrl = new URL("../data/schedules.json", appScriptUrl);
const blockedPlaybackRights = new Set(["no_third_party_reuse"]);
const redundantAccessibilityNotes = new Set([
  "The official service provides accessible variants for some scheduled proceedings.",
  "The official service provides language and accessibility variants for some scheduled proceedings.",
]);
const repositoryBaseUrl = "https://github.com/dlq/parliament-streams/blob/main/";

const initialLocale = supportedLocale(new URLSearchParams(window.location.search).get("lang") ?? localStorage.getItem("parliament-streams-locale") ?? navigator.language);
const state = { channels: [], fallbacks: [], schedules: {}, selectedId: null, hls: null, generatedOn: "", locale: initialLocale, detailSheetOpen: false, sort: { key: "source", direction: "ascending" } };
const elements = {
  stats: document.querySelector("#catalogue-stats"),
  list: document.querySelector("#channel-list"),
  detail: document.querySelector("#detail-panel"),
  filterDisclosure: document.querySelector(".filter-disclosure"),
  count: document.querySelector("#results-count"),
  search: document.querySelector("#search"),
  level: document.querySelector("#level-filter"),
  format: document.querySelector("#format-filter"),
  rights: document.querySelector("#rights-filter"),
  locale: document.querySelector("#locale-select"),
  sortButtons: document.querySelectorAll("[data-sort]"),
  sortHeaders: document.querySelectorAll("[data-sort-header]"),
  sortStatus: document.querySelector("#sort-status"),
  fallbackDirectoryLabel: document.querySelector("#fallback-directory-label"),
  fallbackDirectoryTitle: document.querySelector("#fallback-directory-title"),
  fallbackDirectoryList: document.querySelector("#fallback-directory-list"),
};

const jurisdictionFlagAssets = {
  Alberta: "assets/flags/alberta.svg",
  Andalusia: "assets/flags/andalusia.svg",
  Australia: "assets/flags/au.svg",
  "Baden-Wurttemberg": "assets/flags/baden-wurttemberg.svg",
  Bavaria: "assets/flags/bavaria.svg",
  Brazil: "assets/flags/br.svg",
  "British Columbia": "assets/flags/british-columbia.svg",
  Canada: "assets/flags/ca.svg",
  Catalonia: "assets/flags/catalonia.svg",
  Chile: "assets/flags/cl.svg",
  "Costa Rica": "assets/flags/cr.svg",
  "Council of Europe": "assets/flags/eu.svg",
  Denmark: "assets/flags/dk.svg",
  "El Salvador": "assets/flags/sv.svg",
  Estonia: "assets/flags/ee.svg",
  "European Union": "assets/flags/eu.svg",
  France: "assets/flags/fr.svg",
  Germany: "assets/flags/de.svg",
  Greece: "assets/flags/gr.svg",
  India: "assets/flags/in.svg",
  Ireland: "assets/flags/ie.svg",
  Israel: "assets/flags/il.svg",
  Italy: "assets/flags/it.svg",
  Jalisco: "assets/flags/jalisco.svg",
  Luxembourg: "assets/flags/lu.svg",
  Manitoba: "assets/flags/manitoba.svg",
  Mongolia: "assets/flags/mn.svg",
  Navarre: "assets/flags/navarre.svg",
  Netherlands: "assets/flags/nl.svg",
  "New Zealand": "assets/flags/nz.svg",
  "New South Wales": "assets/flags/new-south-wales.svg",
  "Newfoundland and Labrador": "assets/flags/newfoundland-and-labrador.svg",
  "North Rhine-Westphalia": "assets/flags/north-rhine-westphalia.svg",
  "Northwest Territories": "assets/flags/northwest-territories.svg",
  Nunavut: "assets/flags/nunavut.svg",
  Ontario: "assets/flags/ontario.svg",
  OSCE: "assets/flags/osce.svg",
  Norway: "assets/flags/no.svg",
  Portugal: "assets/flags/pt.svg",
  "Prince Edward Island": "assets/flags/prince-edward-island.svg",
  Queensland: "assets/flags/queensland.svg",
  Quebec: "assets/flags/quebec.svg",
  Saskatchewan: "assets/flags/saskatchewan.svg",
  Scotland: "assets/flags/scotland.svg",
  Slovakia: "assets/flags/sk.svg",
  Spain: "assets/flags/es.svg",
  Taiwan: "assets/flags/tw.svg",
  Thailand: "assets/flags/th.svg",
  Valencia: "assets/flags/valencia.svg",
  Victoria: "assets/flags/victoria.svg",
  Wales: "assets/flags/wales.svg",
  "Western Australia": "assets/flags/western-australia.svg",
  "Northern Ireland": "assets/flags/northern-ireland.svg",
  "United Kingdom": "assets/flags/gb.svg",
  "United Nations": "assets/flags/un.svg",
};

const jurisdictionCodes = {
  Australia: "AU", Brazil: "BR", Canada: "CA", Chile: "CL", "Costa Rica": "CR",
  Denmark: "DK", "El Salvador": "SV", Estonia: "EE", France: "FR", Germany: "DE",
  Greece: "GR", India: "IN", Ireland: "IE", Israel: "IL", Italy: "IT", Luxembourg: "LU",
  Mongolia: "MN", Netherlands: "NL", "New Zealand": "NZ", Norway: "NO", Portugal: "PT",
  Slovakia: "SK", Spain: "ES", Taiwan: "TW", Thailand: "TH", "United Kingdom": "GB",
  "European Union": "EU",
};

const specialJurisdictionNames = {
  // Best-effort machine translations, pending review by an Inuktitut speaker.
  "iu-Cans": {
    Australia: "ᐋᔅᑐᕇᓕᐊᒥ", Brazil: "ᐳᕋᓯᐅᓪ", Canada: "ᑲᓇᑕ", Chile: "ᓯᓕ", "Costa Rica": "ᑯᔅᑕ ᕆᑲ",
    "Council of Europe": "ᑕᕆᐅᑉ ᐊᑭᐊᓂ ᑲᑎᒪᔨᑦ", Denmark: "ᑎᐊᓐᒫᒃ", "El Salvador": "ᐃᐅᓪ ᓵᓪᕙᑐᐊ", Estonia: "ᐃᔅᑑᓂᐊ",
    "European Union": "ᑕᕆᐅᑉ ᐊᑭᐊᓂ ᑲᑐᔾᔨᖃᑎᒌᑦ", France: "ᕗᕌᓐᔅ", Germany: "ᔮᒪᓂ", Greece: "ᒍᕇᔅ", India: "ᐃᓐᑎᐊ",
    Ireland: "ᐊᐃᓚᓐ", Israel: "ᐄᓴᕅᓕ", Italy: "ᐃᑕᓕ", Luxembourg: "ᓛᒃᓵᒻᐴᒡ", Mongolia: "ᒪᓐᒍᓕᐊ",
    Netherlands: "ᓂᑕᕐᓚᓐᑦ", "New Zealand": "ᓂᐅ ᓯᐊᓚᓐ", Nunavut: "ᓄᓇᕗᑦ", Ontario: "ᐋᓐᑎᐅᕆᐅᒥ",
    OSCE: "ᑲᑐᔾᔨᖃᑎᒌᑦ ᐊᑦᑕᓇᔾᔭᐃᖅᓯᒪᓂᕐᒧᑦ ᐊᒻᒪ ᐱᓕᕆᖃᑎᒌᖕᓂᕐᒧᑦ ᑕᕆᐅᑉ ᐊᑭᐊᓂ", Norway: "ᓄᐊᕙᐃ", Portugal: "ᐳᑐᒍᐊᓪ",
    Quebec: "ᑯᐸᐃᒃ", Slovakia: "ᓯᓗᕚᑭᐊ", Spain: "ᓯᐸᐃᓐ", Taiwan: "ᑕᐃᕙᓐ", Thailand: "ᑕᐃᓚᓐ",
    "United Kingdom": "ᑯᐃᓐ ᓄᓇᖓᓐᓂ", "United Nations": "ᓄᓇᕐᔪᐊᕐᒥ ᑲᑐᔾᔨᖃᑎᒌᑦ",
  },
  ga: { Australia: "An Astráil", Brazil: "an Bhrasaíl", Canada: "Ceanada", Chile: "an tSile", "Costa Rica": "Cósta Ríce", "Council of Europe": "Comhairle na hEorpa", Denmark: "an Danmhairg", "El Salvador": "an tSalvadóir", Estonia: "an Eastóin", "European Union": "an tAontas Eorpach", France: "an Fhrainc", Germany: "an Ghearmáin", Greece: "an Ghréig", India: "an India", Ireland: "Éire", Israel: "Iosrael", Italy: "an Iodáil", Luxembourg: "Lucsamburg", Mongolia: "an Mhongóil", Netherlands: "an Ísiltír", "New Zealand": "an Nua-Shéalainn", Nunavut: "Nunavut", Ontario: "Ontario", OSCE: "ECSE", Norway: "an Iorua", Portugal: "an Phortaingéil", Quebec: "Québec", Slovakia: "an tSlóvaic", Spain: "an Spáinn", Taiwan: "an Téaváin", Thailand: "an Téalainn", "United Kingdom": "an Ríocht Aontaithe", "United Nations": "Na Náisiúin Aontaithe" },
  lb: { Australia: "Australien", Brazil: "Brasilien", Canada: "Kanada", Chile: "Chile", "Costa Rica": "Costa Rica", "Council of Europe": "Europarot", Denmark: "Dänemark", "El Salvador": "El Salvador", Estonia: "Estland", "European Union": "Europäesch Unioun", France: "Frankräich", Germany: "Däitschland", Greece: "Griicheland", India: "Indien", Ireland: "Irland", Israel: "Israel", Italy: "Italien", Luxembourg: "Lëtzebuerg", Mongolia: "Mongolei", Netherlands: "Nidderlanden", "New Zealand": "Neiséiland", Nunavut: "Nunavut", Ontario: "Ontario", OSCE: "OSZE", Norway: "Norwegen", Portugal: "Portugal", Quebec: "Québec", Slovakia: "Slowakei", Spain: "Spuenien", Taiwan: "Taiwan", Thailand: "Thailand", "United Kingdom": "Vereenegt Kinnekräich", "United Nations": "Vereenten Natiounen" },
  sk: { "Council of Europe": "Rada Európy", "United Nations": "Organizácia Spojených národov", OSCE: "OBSE", Quebec: "Quebec", Ontario: "Ontário", Nunavut: "Nunavut" },
  fr: { "Council of Europe": "Conseil de l'Europe", "United Nations": "Nations Unies", OSCE: "OSCE", Quebec: "Québec", Ontario: "Ontario", Nunavut: "Nunavut" },
  es: { "Council of Europe": "Consejo de Europa", "United Nations": "Naciones Unidas", OSCE: "OSCE", Quebec: "Quebec", Ontario: "Ontario", Nunavut: "Nunavut" },
  "pt-BR": { "Council of Europe": "Conselho da Europa", "United Nations": "Nações Unidas", OSCE: "OSCE", Quebec: "Quebec", Ontario: "Ontário", Nunavut: "Nunavut" },
  da: { "Council of Europe": "Europarådet", "United Nations": "De Forenede Nationer", OSCE: "OSCE", Quebec: "Quebec", Ontario: "Ontario", Nunavut: "Nunavut" },
  de: { "Council of Europe": "Europarat", "United Nations": "Vereinte Nationen", OSCE: "OSZE", Quebec: "Quebec", Ontario: "Ontario", Nunavut: "Nunavut" },
  et: { "Council of Europe": "Euroopa Nõukogu", "United Nations": "Ühinenud Rahvaste Organisatsioon", OSCE: "OSCE", Quebec: "Quebec", Ontario: "Ontario", Nunavut: "Nunavut" },
  el: { "Council of Europe": "Συμβούλιο της Ευρώπης", "United Nations": "Ηνωμένα Έθνη", OSCE: "ΟΑΣΕ", Quebec: "Κεμπέκ", Ontario: "Οντάριο", Nunavut: "Νούναβουτ" },
  hi: { "Council of Europe": "यूरोप परिषद", "United Nations": "संयुक्त राष्ट्र", OSCE: "ओएससीई", Quebec: "क्यूबेक", Ontario: "ओंटारियो", Nunavut: "नुनावुत" },
  it: { "Council of Europe": "Consiglio d'Europa", "United Nations": "Nazioni Unite", OSCE: "OSCE", Quebec: "Québec", Ontario: "Ontario", Nunavut: "Nunavut" },
  nl: { "Council of Europe": "Raad van Europa", "United Nations": "Verenigde Naties", OSCE: "OVSE", Quebec: "Quebec", Ontario: "Ontario", Nunavut: "Nunavut" },
  nb: { "Council of Europe": "Europarådet", "United Nations": "De forente nasjoner", OSCE: "OSSE", Quebec: "Quebec", Ontario: "Ontario", Nunavut: "Nunavut" },
  th: { "Council of Europe": "สภายุโรป", "United Nations": "สหประชาชาติ", OSCE: "องค์การเพื่อความมั่นคงและความร่วมมือในยุโรป", Quebec: "ควิเบก", Ontario: "ออนแทรีโอ", Nunavut: "นูนาวุต" },
  "zh-Hans": { "Council of Europe": "欧洲委员会", "United Nations": "联合国", OSCE: "欧洲安全与合作组织", Quebec: "魁北克", Ontario: "安大略", Nunavut: "努纳武特" },
};

const devolvedJurisdictionNames = {
  da: { Scotland: "Skotland", Wales: "Wales", "Northern Ireland": "Nordirland" },
  de: { Scotland: "Schottland", Wales: "Wales", "Northern Ireland": "Nordirland" },
  el: { Scotland: "Σκωτία", Wales: "Ουαλία", "Northern Ireland": "Βόρεια Ιρλανδία" },
  es: { Scotland: "Escocia", Wales: "Gales", "Northern Ireland": "Irlanda del Norte" },
  et: { Scotland: "Šotimaa", Wales: "Wales", "Northern Ireland": "Põhja-Iirimaa" },
  fr: { Scotland: "Écosse", Wales: "pays de Galles", "Northern Ireland": "Irlande du Nord" },
  ga: { Scotland: "Albain", Wales: "an Bhreatain Bheag", "Northern Ireland": "Tuaisceart Éireann" },
  hi: { Scotland: "स्कॉटलैंड", Wales: "वेल्स", "Northern Ireland": "उत्तरी आयरलैंड" },
  it: { Scotland: "Scozia", Wales: "Galles", "Northern Ireland": "Irlanda del Nord" },
  lb: { Scotland: "Schottland", Wales: "Wales", "Northern Ireland": "Nordirland" },
  mi: { Scotland: "Koterana", Wales: "Wēra", "Northern Ireland": "Airani ki te Raki" },
  nb: { Scotland: "Skottland", Wales: "Wales", "Northern Ireland": "Nord-Irland" },
  nl: { Scotland: "Schotland", Wales: "Wales", "Northern Ireland": "Noord-Ierland" },
  "pt-BR": { Scotland: "Escócia", Wales: "País de Gales", "Northern Ireland": "Irlanda do Norte" },
  sk: { Scotland: "Škótsko", Wales: "Wales", "Northern Ireland": "Severné Írsko" },
  th: { Scotland: "สกอตแลนด์", Wales: "เวลส์", "Northern Ireland": "ไอร์แลนด์เหนือ" },
  "zh-Hans": { Scotland: "苏格兰", Wales: "威尔士", "Northern Ireland": "北爱尔兰" },
};

const subnationalJurisdictionNames = {
  fr: {
    Alberta: "Alberta", Andalusia: "Andalousie", "Baden-Wurttemberg": "Bade-Wurtemberg", Bavaria: "Bavière",
    "British Columbia": "Colombie-Britannique", Catalonia: "Catalogne", Jalisco: "Jalisco", Manitoba: "Manitoba",
    Navarre: "Navarre", "New South Wales": "Nouvelle-Galles du Sud", "Newfoundland and Labrador": "Terre-Neuve-et-Labrador",
    "North Rhine-Westphalia": "Rhénanie-du-Nord-Westphalie", "Northwest Territories": "Territoires du Nord-Ouest",
    "Prince Edward Island": "Île-du-Prince-Édouard", Queensland: "Queensland", Saskatchewan: "Saskatchewan",
    Valencia: "Valence", Victoria: "Victoria", "Western Australia": "Australie-Occidentale",
  },
  es: {
    Alberta: "Alberta", Andalusia: "Andalucía", "Baden-Wurttemberg": "Baden-Wurtemberg", Bavaria: "Baviera",
    "British Columbia": "Columbia Británica", Catalonia: "Cataluña", Jalisco: "Jalisco", Manitoba: "Manitoba",
    Navarre: "Navarra", "New South Wales": "Nueva Gales del Sur", "Newfoundland and Labrador": "Terranova y Labrador",
    "North Rhine-Westphalia": "Renania del Norte-Westfalia", "Northwest Territories": "Territorios del Noroeste",
    "Prince Edward Island": "Isla del Príncipe Eduardo", Queensland: "Queensland", Saskatchewan: "Saskatchewan",
    Valencia: "Valencia", Victoria: "Victoria", "Western Australia": "Australia Occidental",
  },
  "pt-BR": {
    Alberta: "Alberta", Andalusia: "Andaluzia", "Baden-Wurttemberg": "Baden-Württemberg", Bavaria: "Baviera",
    "British Columbia": "Colúmbia Britânica", Catalonia: "Catalunha", Jalisco: "Jalisco", Manitoba: "Manitoba",
    Navarre: "Navarra", "New South Wales": "Nova Gales do Sul", "Newfoundland and Labrador": "Terra Nova e Labrador",
    "North Rhine-Westphalia": "Renânia do Norte-Vestfália", "Northwest Territories": "Territórios do Noroeste",
    "Prince Edward Island": "Ilha do Príncipe Eduardo", Queensland: "Queensland", Saskatchewan: "Saskatchewan",
    Valencia: "Valência", Victoria: "Vitória", "Western Australia": "Austrália Ocidental",
  },
  de: {
    Alberta: "Alberta", Andalusia: "Andalusien", "Baden-Wurttemberg": "Baden-Württemberg", Bavaria: "Bayern",
    "British Columbia": "Britisch-Kolumbien", Catalonia: "Katalonien", Jalisco: "Jalisco", Manitoba: "Manitoba",
    Navarre: "Navarra", "New South Wales": "Neusüdwales", "Newfoundland and Labrador": "Neufundland und Labrador",
    "North Rhine-Westphalia": "Nordrhein-Westfalen", "Northwest Territories": "Nordwest-Territorien",
    "Prince Edward Island": "Prinz-Edward-Insel", Queensland: "Queensland", Saskatchewan: "Saskatchewan",
    Valencia: "Valencia", Victoria: "Victoria", "Western Australia": "Westaustralien",
  },
  it: {
    Alberta: "Alberta", Andalusia: "Andalusia", "Baden-Wurttemberg": "Baden-Württemberg", Bavaria: "Baviera",
    "British Columbia": "Columbia Britannica", Catalonia: "Catalogna", Jalisco: "Jalisco", Manitoba: "Manitoba",
    Navarre: "Navarra", "New South Wales": "Nuovo Galles del Sud", "Newfoundland and Labrador": "Terranova e Labrador",
    "North Rhine-Westphalia": "Renania Settentrionale-Vestfalia", "Northwest Territories": "Territori del Nord-Ovest",
    "Prince Edward Island": "Isola del Principe Edoardo", Queensland: "Queensland", Saskatchewan: "Saskatchewan",
    Valencia: "Valencia", Victoria: "Victoria", "Western Australia": "Australia Occidentale",
  },
  nl: {
    Alberta: "Alberta", Andalusia: "Andalusië", "Baden-Wurttemberg": "Baden-Württemberg", Bavaria: "Beieren",
    "British Columbia": "Brits-Columbia", Catalonia: "Catalonië", Jalisco: "Jalisco", Manitoba: "Manitoba",
    Navarre: "Navarra", "New South Wales": "Nieuw-Zuid-Wales", "Newfoundland and Labrador": "Newfoundland en Labrador",
    "North Rhine-Westphalia": "Noordrijn-Westfalen", "Northwest Territories": "Northwest Territories",
    "Prince Edward Island": "Prins Edwardeiland", Queensland: "Queensland", Saskatchewan: "Saskatchewan",
    Valencia: "Valencia", Victoria: "Victoria", "Western Australia": "West-Australië",
  },
  da: {
    Andalusia: "Andalusien", "Baden-Wurttemberg": "Baden-Württemberg", Bavaria: "Bayern", Catalonia: "Catalonien",
    Navarre: "Navarra", "New South Wales": "New South Wales", "North Rhine-Westphalia": "Nordrhein-Westfalen",
    "Northwest Territories": "Nordvestterritorierne", "Prince Edward Island": "Prince Edward Island",
    "Western Australia": "Western Australia",
  },
  nb: {
    Andalusia: "Andalusia", "Baden-Wurttemberg": "Baden-Württemberg", Bavaria: "Bayern", Catalonia: "Catalonia",
    Navarre: "Navarra", "New South Wales": "New South Wales", "North Rhine-Westphalia": "Nordrhein-Westfalen",
    "Northwest Territories": "Nordvestterritoriene", "Prince Edward Island": "Prince Edward Island",
    "Western Australia": "Vest-Australia",
  },
  "zh-Hans": {
    Alberta: "艾伯塔", Andalusia: "安达卢西亚", "Baden-Wurttemberg": "巴登-符腾堡", Bavaria: "巴伐利亚",
    "British Columbia": "不列颠哥伦比亚", Catalonia: "加泰罗尼亚", Jalisco: "哈利斯科", Manitoba: "马尼托巴",
    Navarre: "纳瓦拉", "New South Wales": "新南威尔士", "Newfoundland and Labrador": "纽芬兰与拉布拉多",
    "North Rhine-Westphalia": "北莱茵-威斯特法伦", "Northwest Territories": "西北地区",
    "Prince Edward Island": "爱德华王子岛", Queensland: "昆士兰", Saskatchewan: "萨斯喀彻温",
    Valencia: "巴伦西亚", Victoria: "维多利亚", "Western Australia": "西澳大利亚",
  },
};

const languageCodes = {
  Danish: "da", Dutch: "nl", English: "en", Estonian: "et", French: "fr", Gaelic: "gd", German: "de",
  Greek: "el", Hebrew: "he", Hindi: "hi", Inuktitut: "iu", Irish: "ga", Italian: "it",
  Luxembourgish: "lb", Mandarin: "zh", Mongolian: "mn", Norwegian: "no", Portuguese: "pt",
  Slovak: "sk", Spanish: "es", Thai: "th", Welsh: "cy",
};

// Chromium does not currently ship te reo Maori language-display data. These
// CLDR names keep the catalogue metadata localized when that locale is chosen.
const localeLanguageNames = {
  "iu-Cans": {
    da: "ᑕᐃᓂᔅ", de: "ᔮᒪᓂᒥᐅᑕᖅ", el: "ᒍᕇᒃᑎᑐᑦ", en: "ᖃᓪᓗᓈᖅ", es: "ᓯᐹᓂᔅ",
    et: "ᐃᔅᑑᓂᐊᓐ", fr: "ᐅᐃᕖᑎᑐᑦ", ga: "ᐊᐃᕆᔅ", he: "ᕼᐃᐳᕈ", hi: "ᕼᐃᓐᑎ",
    iu: "ᐃᓄᒃᑎᑐᑦ", it: "ᐃᑕᓕᒥᐅᑕᖅ", lb: "ᓛᒃᓵᒻᐴᒡ", mn: "ᒪᓐᒍᓕᐊᓐ",
    mul: "ᐊᒥᓱᓄᑦ ᐅᖃᐅᓯᕐᓄᑦ", nl: "ᓂᐅᕙᓐᓛᓐᒥᐅᑦ", no: "ᓄᐊᕖᔭᓐ", pt: "ᐳᑐᒍᐃᑦ",
    sk: "ᓯᓗᕚᒃ", th: "ᑕᐃ", zh: "ᒫᓐᑕᕆᓐ",
  },
  mi: {
    da: "Teina", de: "Tiamana", el: "Kariki", en: "Ingarihi", es: "Pāniora",
    et: "Etōniana", fr: "Wīwī", ga: "Airihi", he: "Hīperu", hi: "Hīni",
    iu: "Inukitetūta", it: "Itāriana", lb: "Rakapuō", mn: "Mongōria",
    mul: "Ngā reo maha", nl: "Tati", no: "Nōwei", pt: "Pōtukīhi",
    sk: "Horowākia", th: "Tai", zh: "Hainamana",
  },
};

function t(key, values) { return message(state.locale, key, values); }
function label(value) { return localizedLabel(state.locale, value); }
function slug(value) { return value.replaceAll("_", "-"); }
function jurisdictionName(name) {
  const specialName = specialJurisdictionNames[state.locale]?.[name]
    ?? devolvedJurisdictionNames[state.locale]?.[name]
    ?? subnationalJurisdictionNames[state.locale]?.[name];
  if (specialName) return specialName;
  const code = jurisdictionCodes[name];
  if (!code) return name;
  const displayName = new Intl.DisplayNames([state.locale], { type: "region", fallback: "code" }).of(code);
  return displayName && displayName !== code ? displayName : name;
}
function jurisdictionMark(countryOrRegion) {
  const displayName = jurisdictionName(countryOrRegion);
  const asset = jurisdictionFlagAssets[countryOrRegion];
  if (asset) {
    return `<img class="jurisdiction-flag" src="${asset}" alt="${displayName}" title="${displayName}" lang="${state.locale}">`;
  }
  return `<span class="jurisdiction-mark" role="img" aria-label="${displayName}" title="${displayName}" lang="${state.locale}">🏛️</span>`;
}
function setText(id, value) { document.querySelector(`#${id}`).textContent = value; }
function setOptionLabel(element, key, values) {
  const selected = element.value;
  element.innerHTML = `<option value="">${t(key)}</option>${values.map((value) => `<option value="${value}">${label(value)}</option>`).join("")}`;
  element.value = selected;
}
function applyStaticTranslations() {
  document.documentElement.lang = state.locale;
  document.title = t("title");
  document.querySelector('meta[name="description"]').setAttribute("content", t("lede"));
  document.querySelector("#skip-link").textContent = t("skipCatalogue");
  document.querySelector("#brand-home").setAttribute("aria-label", t("brandHome"));
  document.querySelector("#primary-navigation").setAttribute("aria-label", t("primaryNavigation"));
  setText("nav-catalogue", t("nav"));
  setText("locale-label", t("language"));
  setText("intro-label", t("research"));
  setText("page-title", t("title"));
  setText("intro-lede", t("lede"));
  setText("browse-label", t("browse"));
  setText("catalogue-title", t("catalogue"));
  document.querySelector("#source-json-link").firstChild.textContent = `${t("json")} `;
  setText("search-label", t("search"));
  elements.search.placeholder = t("search");
  setText("jurisdiction-label", t("jurisdiction"));
  setText("source-type-label", t("sourceType"));
  setText("use-guidance-label", t("useGuidance"));
  setText("filters-label", t("filters"));
  setText("metric-sources-label", t("metricSources"));
  setText("metric-playable-label", t("metricPlayable"));
  setText("metric-schedules-label", t("metricSchedules"));
  setText("metric-updated-label", t("metricUpdated"));
  setText("catalogue-overview-title", t("catalogueCoverage"));
  document.querySelector("#catalogue-results").setAttribute("aria-label", t("catalogueResults"));
  setText("fallback-directory-label", t("fallbackDirectoryLabel"));
  setText("fallback-directory-title", t("fallbackDirectoryTitle"));
  elements.sortStatus.setAttribute("lang", state.locale);
  ["source", "jurisdiction", "format", "language", "access", "use"].forEach((key) => setText(`sort-${key}`, t(key === "language" ? "contentLanguage" : key)));
  setText("method-label", t("care"));
  setText("method-title", t("methodTitle"));
  setText("method-copy", t("methodCopy"));
  document.querySelector("#rights-link").firstChild.textContent = `${t("rights")} `;
  setText("open-streams-title", t("openStreams"));
  setText("open-video-copy", t("openVideoCopy"));
  setText("open-streams-copy", t("openStreamsCopy"));
  setText("principle-delivery", t("principleDelivery"));
  setText("principle-access", t("principleAccess"));
  setText("principle-reuse", t("principleReuse"));
  setText("principle-schedules", t("principleSchedules"));
  setText("principle-accessibility", t("principleAccessibility"));
  document.querySelector(".principles-index").setAttribute("aria-label", t("principlesLabel"));
  document.querySelector(".open-streams-links").setAttribute("aria-label", t("openStreams"));
  document.querySelector("#open-streams-link").firstChild.textContent = `${t("openStreams")} `;
  document.querySelector("#open-streams-link").setAttribute("lang", state.locale);
  setText("footer-copy", t("footer"));
  setText("about-link", t("about"));
}
function setLocale(locale) {
  state.locale = supportedLocale(locale);
  localStorage.setItem("parliament-streams-locale", state.locale);
  const url = new URL(window.location.href);
  url.searchParams.set("lang", state.locale);
  history.replaceState({}, "", url);
  applyStaticTranslations();
  if (state.channels.length) {
    setOptionLabel(elements.level, "allJur", optionValues("jurisdiction_level"));
    setOptionLabel(elements.format, "allTypes", optionValues("source_type"));
    setOptionLabel(elements.rights, "allUse", [...new Set(state.channels.map((channel) => channel.permission.status))].sort());
    renderList();
    renderDetail();
    renderResearchSummary();
    renderFallbackDirectory();
    elements.stats.textContent = t("documented", { count: state.channels.length, date: state.generatedOn });
  }
}
function canPlay(channel) {
  const supportedSource = Boolean(channel.playback_url) || channel.embed?.provider === "youtube";
  const mixedContentBlocked = window.location.protocol === "https:"
    && channel.playback_url?.startsWith("http:");
  return supportedSource
    && !mixedContentBlocked
    && channel.technical_status === "validated"
    && !blockedPlaybackRights.has(channel.permission.status);
}
function sourceStatus(channel) {
  if (canPlay(channel)) return "playable";
  if (channel.source_type === "official_page" || channel.permission.status === "no_third_party_reuse") return "link_out";
  if (channel.source_type === "youtube" || channel.embed) return "fallback";
  return "research";
}
function sourceStatusLabel(value) {
  return {
    playable: t("sourcePlayable"),
    link_out: t("sourceLinkOut"),
    fallback: t("sourceFallback"),
    research: t("sourceResearch"),
  }[value] ?? value;
}
function formatDate(value) {
  if (!value) return t("notAvailable");
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  return new Intl.DateTimeFormat(state.locale, { dateStyle: "medium" }).format(date);
}
function renderResearchSummary() {
  document.querySelector("#metric-sources").textContent = state.channels.length;
  document.querySelector("#metric-playable").textContent = state.channels.filter(canPlay).length;
  document.querySelector("#metric-schedules").textContent = state.channels.filter((channel) =>
    channel.epg_sources.some((source) => source.scraper_status === "implemented")
  ).length;
  document.querySelector("#metric-updated").textContent = formatDate(state.generatedOn);
}
function sourceNameMarkup(name) { return name.replaceAll(" - ", "<br>"); }
function languageMarkup(language) {
  const displayNames = new Intl.DisplayNames([state.locale], { type: "language", fallback: "code" });
  return language.split(" / ").map((name) => {
    const code = name === "Multilingual" ? "mul" : languageCodes[name];
    if (!code) return name;
    const displayName = localeLanguageNames[state.locale]?.[code] ?? displayNames.of(code);
    return displayName && displayName !== code ? displayName : name;
  }).join("<br>");
}
function languageDisplayName(language) {
  if (!language) return "";
  const displayNames = new Intl.DisplayNames([state.locale], { type: "language", fallback: "code" });
  return localeLanguageNames[state.locale]?.[language] ?? displayNames.of(language) ?? language;
}
function contentLanguageTag(channel) {
  const firstLanguage = channel.language.split(" / ")[0];
  return firstLanguage === "Multilingual" ? "" : languageCodes[firstLanguage] ?? "";
}
function languageAttribute(language) { return language ? ` lang="${language}"` : ""; }
function sentenceCase(value) {
  const phrase = value.replaceAll("_", " ");
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}
function sortValue(channel, key) {
  return {
    source: channel.name,
    jurisdiction: jurisdictionName(channel.country_or_region),
    format: label(channel.source_type),
    language: channel.language,
    access: label(channel.technical_status),
    use: label(channel.permission.status),
  }[key];
}
function renderSortHeaders() {
  elements.sortHeaders.forEach((header) => {
    const active = header.dataset.sortHeader === state.sort.key;
    const button = header.querySelector("button");
    button.classList.toggle("is-active", active);
    button.dataset.direction = active ? state.sort.direction : "none";
    button.setAttribute("aria-pressed", String(active));
    if (active) {
      const direction = state.sort.direction === "ascending" ? t("sortAscending") : t("sortDescending");
      elements.sortStatus.textContent = `${button.textContent}: ${direction}.`;
    }
  });
}
function optionValues(key) { return [...new Set(state.channels.map((channel) => channel[key]))].sort(); }
function filteredChannels() {
  const search = elements.search.value.trim().toLocaleLowerCase();
  return state.channels.filter((channel) => {
    const searchable = [channel.name, channel.legislature, channel.country_or_region, jurisdictionName(channel.country_or_region), channel.language].join(" ").toLocaleLowerCase();
    return (!search || searchable.includes(search))
      && (!elements.level.value || channel.jurisdiction_level === elements.level.value)
      && (!elements.format.value || channel.source_type === elements.format.value)
      && (!elements.rights.value || channel.permission.status === elements.rights.value);
  }).sort((left, right) => {
    const result = new Intl.Collator(state.locale, { numeric: true, sensitivity: "base" })
      .compare(sortValue(left, state.sort.key), sortValue(right, state.sort.key));
    return state.sort.direction === "ascending" ? result : -result;
  });
}
function renderList() {
  const channels = filteredChannels();
  renderSortHeaders();
  elements.count.textContent = t("results", { shown: channels.length, total: state.channels.length });
  if (!channels.some((channel) => channel.id === state.selectedId)) {
    state.selectedId = channels[0]?.id ?? null;
    state.detailSheetOpen = false;
  }
  elements.list.innerHTML = channels.length ? channels.map((channel) => {
    const descriptionId = `${channel.id}-description`;
    const status = sourceStatus(channel);
    return `
    <li>
      <button class="channel-button" type="button" data-channel-id="${channel.id}" aria-pressed="${channel.id === state.selectedId}" aria-describedby="${descriptionId}">
        <span><span class="channel-name">${jurisdictionMark(channel.country_or_region)}${sourceNameMarkup(channel.name)}${canPlay(channel) ? '<span class="play-marker" aria-hidden="true">&#9654;</span>' : ""}</span><span class="legislature"${languageAttribute(contentLanguageTag(channel))}>${channel.legislature}</span><span class="source-posture source-posture-${slug(status)}">${sourceStatusLabel(status)}</span></span>
        <span>${jurisdictionName(channel.country_or_region)}</span>
        <span class="format" lang="${state.locale}" title="${t("format")}: ${label(channel.source_type)}">${label(channel.source_type)}</span>
        <span class="language-list">${languageMarkup(channel.language)}</span>
        <span><span class="status status-${slug(channel.technical_status)}" lang="${state.locale}" title="${t("access")}: ${label(channel.technical_status)}">${label(channel.technical_status)}</span></span>
        <span><span class="status status-${slug(channel.permission.status)}" lang="${state.locale}" title="${t("use")}: ${label(channel.permission.status)}">${label(channel.permission.status)}</span></span>
      </button>
      <span class="visually-hidden" id="${descriptionId}" lang="${state.locale}">${sourceStatusLabel(status)}. ${t("format")}: ${label(channel.source_type)}. ${t("access")}: ${label(channel.technical_status)}. ${t("use")}: ${label(channel.permission.status)}.</span>
    </li>`;
  }).join("") : `<li><p class="detail-empty">${t("noResults")}</p></li>`;
  elements.list.querySelectorAll("[data-channel-id]").forEach((button) => button.addEventListener("click", () => {
    state.selectedId = button.dataset.channelId;
    state.detailSheetOpen = window.matchMedia("(max-width: 1100px)").matches;
    elements.list.querySelectorAll("[data-channel-id]").forEach((candidate) => {
      candidate.setAttribute("aria-pressed", String(candidate.dataset.channelId === state.selectedId));
    });
    renderDetail({ startPlayer: true, focusDetail: state.detailSheetOpen });
  }));
}
function closeDetailSheet() {
  state.detailSheetOpen = false;
  elements.detail.querySelector("video")?.pause();
  if (state.hls) { state.hls.destroy(); state.hls = null; }
  elements.detail.classList.remove("is-open");
  elements.detail.style.removeProperty("--mobile-sheet-height");
}
function syncFilterDisclosure(mediaQuery) {
  elements.filterDisclosure.open = !mediaQuery.matches;
}
function setDetailSheetHeight(height) {
  const minimum = 150;
  const maximum = Math.round(window.innerHeight * 0.9);
  elements.detail.style.setProperty("--mobile-sheet-height", `${Math.min(maximum, Math.max(minimum, height))}px`);
}
function setupDetailSheetControls() {
  const grabber = elements.detail.querySelector("[data-resize-detail]");
  let startY = 0;
  let startHeight = 0;
  let moved = false;
  let suppressClick = false;
  const snapHeights = () => [150, Math.round(window.innerHeight * 0.54), Math.round(window.innerHeight * 0.9)];
  const snapToNearest = () => {
    const current = elements.detail.getBoundingClientRect().height;
    const nearest = snapHeights().reduce((best, height) => Math.abs(height - current) < Math.abs(best - current) ? height : best);
    setDetailSheetHeight(nearest);
  };

  grabber.addEventListener("pointerdown", (event) => {
    startY = event.clientY;
    startHeight = elements.detail.getBoundingClientRect().height;
    moved = false;
    grabber.setPointerCapture(event.pointerId);
  });
  grabber.addEventListener("pointermove", (event) => {
    if (!grabber.hasPointerCapture(event.pointerId)) return;
    moved ||= Math.abs(event.clientY - startY) > 4;
    setDetailSheetHeight(startHeight + startY - event.clientY);
  });
  grabber.addEventListener("pointerup", (event) => {
    if (!grabber.hasPointerCapture(event.pointerId)) return;
    grabber.releasePointerCapture(event.pointerId);
    suppressClick = moved;
    snapToNearest();
  });
  grabber.addEventListener("pointercancel", snapToNearest);
  grabber.addEventListener("click", () => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    const heights = snapHeights();
    const current = elements.detail.getBoundingClientRect().height;
    const currentIndex = heights.reduce((bestIndex, height, index) => Math.abs(height - current) < Math.abs(heights[bestIndex] - current) ? index : bestIndex, 0);
    setDetailSheetHeight(heights[(currentIndex + 1) % heights.length]);
  });
  elements.detail.onkeydown = (event) => {
    if (event.key !== "Escape" || !state.detailSheetOpen) return;
    event.preventDefault();
    closeDetailSheet();
    elements.list.querySelector(`[data-channel-id="${state.selectedId}"]`)?.focus();
  };
}
function epgMarkup(channel) {
  if (!channel.epg_sources.length) return `<span>${t("noSchedule")}</span>`;
  const occurrences = new Map();
  const sourceLabel = (kind) => {
    if (kind.includes("api")) return t("scheduleApi");
    if (kind.includes("open_data")) return t("openScheduleData");
    if (/calendar|agenda|sitting_dates|meetings/.test(kind)) return t("calendarAgenda");
    if (/live|webcast|television|tv_|webstreaming|webtv|mediathek/.test(kind)) return t("liveSchedulePage");
    return t("schedulePage");
  };
  const browserSources = channel.epg_sources.filter((source) => source.method === "GET");
  const machineOnlySources = channel.epg_sources.filter((source) => source.method !== "GET");
  const links = browserSources.map((source) => {
    const sourceType = sourceLabel(source.kind);
    const occurrence = (occurrences.get(sourceType) ?? 0) + 1;
    occurrences.set(sourceType, occurrence);
    return `<li><a href="${source.url}" target="_blank" rel="noreferrer" title="${sentenceCase(source.kind)}" lang="${state.locale}">${sourceType}${occurrence > 1 ? ` ${occurrence}` : ""} ↗</a></li>`;
  });
  if (machineOnlySources.length) {
    links.push(`<li><a href="${channel.official_url}" target="_blank" rel="noreferrer" title="${t("liveSchedulePage")}" lang="${state.locale}">${t("liveSchedulePage")} ↗</a></li>`);
  }
  return `<ul class="epg-list">${links.join("")}</ul>`;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
function programmeMarkup(channel) {
  const schedule = state.schedules[channel.id];
  if (!schedule) return "";
  const record = schedule;
  const programmeLine = (labelKey, title, time, url, language, location, status) => {
    const titleMarkup = url
      ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer"${languageAttribute(contentLanguageTag(channel))}>${escapeHtml(title)} ↗</a>`
      : `<span${languageAttribute(contentLanguageTag(channel))}>${escapeHtml(title)}</span>`;
    const metadata = [time, languageDisplayName(language), location, status].filter(Boolean).map(escapeHtml).join(" · ");
    return `<span class="programme-line"><strong lang="${state.locale}">${t(labelKey)}</strong> ${titleMarkup}${metadata ? ` <span class="programme-time">· ${metadata}</span>` : ""}</span>`;
  };
  const current = programmeLine(
    "nowProgramme",
    record.current_event_title,
    record.current_event_time,
    record.current_event_url,
    record.current_event_language,
    record.current_event_location,
    record.current_event_status,
  );
  const next = record.next_event_title
    ? programmeLine(
      "nextProgramme",
      record.next_event_title,
      record.next_event_time,
      record.next_event_url,
      record.next_event_language,
      record.next_event_location,
      record.next_event_status,
    )
    : "";
  const freshness = schedule
    ? `<span class="detail-subtitle programme-fetch-status">${t("scheduleCollected", { date: escapeHtml(new Date(schedule.fetched_at).toLocaleString(state.locale)) })}</span>`
    : "";
  return `<div class="programme-record" aria-live="polite">
    ${current}
    ${next}${freshness}
  </div>`;
}
function fallbackScheduleMarkup(fallback) {
  const relatedSchedule = fallback.related_channel_ids
    .map((channelId) => state.schedules[channelId])
    .find(Boolean);
  if (!relatedSchedule) return "";
  const eventLine = (labelKey, title, url, time, language, location, status) => {
    const titleMarkup = url
      ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(title)} ↗</a>`
      : escapeHtml(title);
    const metadata = [time, languageDisplayName(language), location, status].filter(Boolean).map(escapeHtml).join(" · ");
    return `<span><strong>${t(labelKey)}</strong> ${titleMarkup}${metadata ? ` <em>${metadata}</em>` : ""}</span>`;
  };
  const current = relatedSchedule.current_event_title
    ? eventLine(
      "nowProgramme",
      relatedSchedule.current_event_title,
      relatedSchedule.current_event_url,
      relatedSchedule.current_event_time,
      relatedSchedule.current_event_language,
      relatedSchedule.current_event_location,
      relatedSchedule.current_event_status,
    )
    : "";
  const next = relatedSchedule.next_event_title
    ? eventLine(
      "nextProgramme",
      relatedSchedule.next_event_title,
      relatedSchedule.next_event_url,
      relatedSchedule.next_event_time,
      relatedSchedule.next_event_language,
      relatedSchedule.next_event_location,
      relatedSchedule.next_event_status,
    )
    : "";
  return current || next ? `<small class="fallback-schedule">${current}${next}</small>` : "";
}
function evidenceLabel(channel, url) {
  const address = url.toLocaleLowerCase();
  if (url === channel.official_url) return t("officialEvidence");
  if (url === channel.playback_url) return t("streamEvidence");
  if (channel.epg_sources.some((source) => source.url === url)) return t("schedule");
  if (/terms|termo|condition|copyright|droits|property|licen[cs]e|reuse|embed/.test(address)) return t("rightsEvidence");
  if (/privacy|privacidade/.test(address)) return t("privacyEvidence");
  if (/faq/.test(address)) return "FAQ";
  return t("supportingEvidence");
}
function evidenceMarkup(channel) {
  const occurrences = new Map();
  return channel.permission.evidence.map((url) => {
    const label = evidenceLabel(channel, url);
    const occurrence = (occurrences.get(label) ?? 0) + 1;
    occurrences.set(label, occurrence);
    const suffix = occurrence > 1 ? ` ${occurrence}` : "";
    return `<a href="${url}" target="_blank" rel="noreferrer" title="${url}" lang="${state.locale}">${label}${suffix} ↗</a>`;
  }).join(" ");
}
function accessibilityStatusLabel(status) {
  return {
    available: t("a11yAvailable"),
    source_dependent: t("a11ySourceDependent"),
    unavailable: t("a11yUnavailable"),
    unknown: t("a11yUnknown"),
  }[status] ?? status;
}
function meaningfulAccessibilityNote(channel) {
  const note = channel.accessibility.notes;
  return redundantAccessibilityNotes.has(note) ? "" : note;
}
function accessibilityMarkup(channel) {
  const accessibility = channel.accessibility;
  const languageNames = new Intl.DisplayNames([state.locale], { type: "language", fallback: "code" });
  const captionLanguages = accessibility.caption_languages.length
    ? ` (${accessibility.caption_languages.map((language) => languageNames.of(language)).join(", ")})`
    : "";
  const accessibilityNote = meaningfulAccessibilityNote(channel);
  const note = state.locale === "en" && accessibilityNote
    ? `<span class="detail-subtitle" lang="en">${accessibilityNote}</span>`
    : "";
  return `<div class="full accessibility-record">
    <dt>${t("mediaAccessibility")}</dt>
    <dd>
      <span><strong>${t("captions")}:</strong> ${accessibilityStatusLabel(accessibility.captions)}${captionLanguages}</span>
      <span><strong>${t("signLanguage")}:</strong> ${accessibilityStatusLabel(accessibility.sign_language)}</span>
      <span><strong>${t("audioDescription")}:</strong> ${accessibilityStatusLabel(accessibility.audio_description)}</span>
      ${note}
    </dd>
  </div>`;
}
function fallbackLabel(value) {
  return {
    official_event_platform: t("fallbackEventPlatform"),
    official_live_page: t("fallbackLivePage"),
    official_youtube_live: t("fallbackYoutubeLive"),
    official_youtube_uploads: t("fallbackYoutubeUploads"),
    official_archive: t("fallbackArchive"),
    official_broadcaster: t("fallbackBroadcaster"),
    link_out: t("fallbackLinkOut"),
    provider_embed: t("fallbackProviderEmbed"),
    planned_event_resolver: t("fallbackEventResolver"),
    schedule_source: t("fallbackScheduleSource"),
    now_next_possible: t("fallbackNowNext"),
    none: t("fallbackNoSchedule"),
  }[value] ?? label(value);
}
function fallbackMarkup(channel) {
  const related = state.fallbacks.filter((fallback) => fallback.related_channel_ids.includes(channel.id));
  if (!related.length) return "";
  return `<div class="full fallback-record">
    <dt>${t("fallbacks")}</dt>
    <dd>
      <ul class="fallback-list">
        ${related.map((fallback) => `
          <li>
            <a href="${fallback.official_url}" target="_blank" rel="noreferrer">${escapeHtml(fallback.label)} ↗</a>
            <span>${fallbackLabel(fallback.fallback_type)} · ${fallbackLabel(fallback.integration_mode)} · ${fallbackLabel(fallback.schedule_role)}</span>
            ${fallbackScheduleMarkup(fallback)}
            ${state.locale === "en" ? `<small lang="en">${escapeHtml(fallback.notes)}</small>` : ""}
          </li>`).join("")}
      </ul>
    </dd>
  </div>`;
}
function renderFallbackDirectory() {
  elements.fallbackDirectoryList.innerHTML = state.fallbacks.length
    ? state.fallbacks.map((fallback) => `
      <li>
        <a href="${fallback.official_url}" target="_blank" rel="noreferrer">${escapeHtml(fallback.label)} ↗</a>
        <span>${jurisdictionName(fallback.country_or_region)} · ${fallbackLabel(fallback.fallback_type)} · ${fallbackLabel(fallback.integration_mode)}</span>
        ${fallbackScheduleMarkup(fallback)}
      </li>`).join("")
    : `<li>${t("noFallbacks")}</li>`;
}
function researchNotesMarkup(channel, playbackMessage, generatedPlaybackPolicy) {
  if (state.locale === "en") {
    return `<p class="detail-note"><strong>${t("reuse")}</strong> <span lang="en">${channel.permission.summary} ${evidenceMarkup(channel)}</span></p>
      <p class="detail-note"><strong>${t("recommendation")}</strong> <span lang="en">${playbackMessage}</span></p>`;
  }

  const embedNote = channel.embed?.provider === "youtube" && channel.embed.notes
    ? `<p><strong>Embed record.</strong> ${channel.embed.notes}</p>`
    : "";
  const accessibilityNote = meaningfulAccessibilityNote(channel)
    ? `<p><strong>Accessibility note.</strong> ${meaningfulAccessibilityNote(channel)}</p>`
    : "";
  const recommendation = generatedPlaybackPolicy
    ? ""
    : `<p><strong>Catalogue recommendation.</strong> ${channel.permission.recommendation}</p>`;
  const localizedPolicy = generatedPlaybackPolicy
    ? `<p class="detail-note"><strong>${t("recommendation")}</strong> ${playbackMessage}</p>`
    : "";

  return `<p class="detail-note evidence-note"><strong>${t("evidenceSources")}</strong> ${evidenceMarkup(channel)}</p>
    <details class="detail-note research-note-disclosure">
      <summary>${t("englishResearchNotes")}</summary>
      <div lang="en">
        <p><strong>Catalogue rights summary.</strong> ${channel.permission.summary}</p>
        ${accessibilityNote}
        ${embedNote}
        ${recommendation}
      </div>
    </details>
    ${localizedPolicy}`;
}
function identityMarkup(channel) {
  const links = channel.identity_sources.map((source) => {
    const code = source.source === "wikidata"
      ? channel.external_ids.wikidata_qid
      : channel.external_ids.ipu_chamber_code ?? channel.external_ids.ipu_parliament_code;
    const sourceName = source.source === "wikidata" ? "Wikidata" : "IPU Parline";
    return `<li><a href="${source.url}" target="_blank" rel="noreferrer">${sourceName} <span class="identity-code">${code}</span> ↗</a></li>`;
  }).join("");
  return `<div class="full identity-record">
    <dt>${t("identity")}</dt>
    <dd><ul class="identity-list">${links}</ul></dd>
  </div>`;
}
function validationMethodLabel(method) {
  return {
    static_http: t("staticHttpValidation"),
    browser_player: t("browserPlayerValidation"),
    manifest_seed: t("manifestSeedValidation"),
    review_followup: t("reviewFollowupValidation"),
  }[method] ?? label(method);
}
function validationMarkup(channel) {
  const latest = channel.validation_history?.[0];
  if (!latest) {
    return `<div class="full validation-record">
      <dt>${t("latestValidation")}</dt>
      <dd><span class="detail-subtitle">${t("validationNotRecorded")}</span></dd>
    </div>`;
  }
  const reportUrl = `${repositoryBaseUrl}${encodeURI(latest.report_path)}`;
  return `<div class="full validation-record">
    <dt>${t("latestValidation")}</dt>
    <dd>
      <span><strong>${t("validationChecked", { date: formatDate(latest.checked_at) })}</strong></span>
      <span><strong>${t("validationMethod")}</strong> ${validationMethodLabel(latest.method)}</span>
      <span><strong>${t("accessStatus")}</strong> <span class="status status-${slug(latest.status)}">${label(latest.status)}</span></span>
      <a href="${reportUrl}" target="_blank" rel="noreferrer">${t("validationReport")} ↗</a>
    </dd>
  </div>`;
}
function freshnessMarkup(channel) {
  const identityDate = channel.identity_sources
    .map((source) => source.checked_on)
    .filter(Boolean)
    .sort()
    .at(-1);
  const scheduleDate = state.schedules[channel.id]?.fetched_at;
  const scheduleFreshness = scheduleDate
    ? `<span><strong>${t("programme")}</strong> ${formatDate(scheduleDate)}</span>`
    : "";
  return `<div class="full evidence-dates">
    <dt>${t("evidenceDates")}</dt>
    <dd>
      <span><strong>${t("metricUpdated")}</strong> ${formatDate(state.generatedOn)}</span>
      <span><strong>${t("identity")}</strong> ${formatDate(identityDate)}</span>
      ${scheduleFreshness}
    </dd>
  </div>`;
}
function youtubeEmbedUrl(channel) {
  const videoId = state.schedules[channel.id]?.current_event_id;
  if (channel.embed?.provider === "youtube" && /^[A-Za-z0-9_-]{11}$/.test(videoId || "")) {
    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  }
  return channel.embed?.url || "";
}
function renderDetail({ startPlayer = false, focusDetail = false } = {}) {
  if (state.hls) { state.hls.destroy(); state.hls = null; }
  const channel = state.channels.find((item) => item.id === state.selectedId);
  if (!channel) { elements.detail.innerHTML = `<p class="detail-empty">${t("selectSource")}</p>`; closeDetailSheet(); return; }
  const allowed = canPlay(channel);
  const generatedPlaybackPolicy = channel.embed?.provider === "youtube" || allowed;
  const playbackMessage = channel.embed?.provider === "youtube"
    ? state.locale === "en"
      ? `${channel.embed.notes} ${t("youtubePlaybackPolicy")}`
      : t("youtubePlaybackPolicy")
    : allowed
      ? t("optOutPlaybackPolicy")
      : channel.permission.recommendation;
  const programme = programmeMarkup(channel);
  elements.detail.setAttribute("aria-labelledby", "detail-title");
  elements.detail.innerHTML = `
    <div class="mobile-sheet-controls">
      <button class="detail-grabber" data-resize-detail type="button" aria-label="${t("resizeDetails")}" lang="${state.locale}"><span></span></button>
    </div>
    <h3 class="detail-title" id="detail-title" tabindex="-1" aria-live="polite">${channel.name}</h3>
    <p class="detail-subtitle">${jurisdictionMark(channel.country_or_region)}${jurisdictionName(channel.country_or_region)} · <span${languageAttribute(contentLanguageTag(channel))}>${channel.legislature}</span></p>
    <div class="media-frame" id="media-frame">
      <div class="player-placeholder">${allowed ? `<button class="placeholder-play-button" data-start-playback type="button" aria-label="${t("watch")}">▶</button>` : '<span aria-hidden="true">▶</span>'}<p>${allowed ? t("ready") : t("disabled")}</p></div>
    </div>
    <div class="detail-actions">
      ${allowed ? `<button class="play-button" data-start-playback type="button">${t("watch")}</button>` : ""}
      <a class="official-button" href="${channel.official_url}" target="_blank" rel="noreferrer">${t("official")} ↗</a>
    </div>
    <dl class="detail-grid">
      <div title="${t("sourceType")}: ${label(channel.source_type)}"><dt>${t("sourceType")}</dt><dd>${label(channel.source_type)}</dd></div>
      <div title="${t("sourceKind")}: ${label(channel.source_kind)}"><dt>${t("sourceKind")}</dt><dd>${label(channel.source_kind)}</dd></div>
      <div title="${t("accessStatus")}: ${label(channel.technical_status)}"><dt>${t("accessStatus")}</dt><dd><span class="status status-${slug(channel.technical_status)}">${label(channel.technical_status)}</span></dd></div>
      <div title="${t("stabilityRisk")}: ${label(channel.stability_risk)}"><dt>${t("stabilityRisk")}</dt><dd><span class="status status-${slug(channel.stability_risk)}">${label(channel.stability_risk)}</span></dd></div>
      <div title="${t("useGuidance")}: ${label(channel.permission.status)}"><dt>${t("useGuidance")}</dt><dd><span class="status status-${slug(channel.permission.status)}">${label(channel.permission.status)}</span></dd></div>
      <div title="${t("availability")}: ${label(channel.availability)}"><dt>${t("availability")}</dt><dd>${label(channel.availability)}</dd></div>
      ${programme ? `<div class="full"><dt>${t("programme")}</dt><dd>${programme}</dd></div>` : ""}
      ${accessibilityMarkup(channel)}
      ${identityMarkup(channel)}
      ${validationMarkup(channel)}
      <div class="full"><dt>${t("schedule")}</dt><dd>${epgMarkup(channel)}</dd></div>
      ${fallbackMarkup(channel)}
      ${freshnessMarkup(channel)}
    </dl>
    ${researchNotesMarkup(channel, playbackMessage, generatedPlaybackPolicy)}`;
  elements.detail.classList.toggle("is-open", state.detailSheetOpen);
  document.querySelectorAll("[data-start-playback]").forEach((button) => button.addEventListener("click", () => startPlayback(channel)));
  setupDetailSheetControls();
  if (focusDetail) elements.detail.querySelector("#detail-title").focus();
  if (startPlayer && allowed) startPlayback(channel);
}
function loadHlsLibrary() {
  if (window.Hls) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Unable to load the HLS playback library."));
    document.head.append(script);
  });
}
async function startPlayback(channel) {
  const frame = document.querySelector("#media-frame");
  frame.innerHTML = "";
  if (channel.embed?.provider === "youtube") {
    if (window.location.protocol === "file:") {
      frame.innerHTML = `<div class="player-placeholder youtube-file-notice" lang="${state.locale}">
        <p>${t("playbackError")} <a href="https://dlq.github.io/parliament-streams/" target="_blank" rel="noreferrer">${t("official")} ↗</a></p>
      </div>`;
      return;
    }
    const iframe = document.createElement("iframe");
    const embedUrl = youtubeEmbedUrl(channel);
    const separator = embedUrl.includes("?") ? "&" : "?";
    iframe.src = `${embedUrl}${separator}autoplay=1&playsinline=1&rel=0&hl=${encodeURIComponent(state.locale)}`;
    iframe.title = `${channel.name} · YouTube`;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    frame.append(iframe);
    return;
  }
  const video = document.createElement("video");
  video.controls = true;
  video.autoplay = true;
  video.playsInline = true;
  frame.append(video);
  try {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = channel.playback_url;
    } else {
      await loadHlsLibrary();
      if (!window.Hls?.isSupported()) throw new Error("This browser does not support HLS playback.");
      state.hls = new window.Hls();
      state.hls.loadSource(channel.playback_url);
      state.hls.attachMedia(video);
    }
    await video.play();
  } catch (error) {
    frame.innerHTML = `<div class="player-placeholder"><p>${t("playbackError")} <a href="${channel.official_url}" target="_blank" rel="noreferrer">${t("official")} ↗</a></p></div>`;
  }
}
async function init() {
  try {
    const mobileLayout = window.matchMedia("(max-width: 680px)");
    const detailSheetLayout = window.matchMedia("(max-width: 1100px)");
    syncFilterDisclosure(mobileLayout);
    mobileLayout.addEventListener("change", () => syncFilterDisclosure(mobileLayout));
    detailSheetLayout.addEventListener("change", () => {
      if (detailSheetLayout.matches) return;
      closeDetailSheet();
      renderDetail();
    });
    elements.locale.innerHTML = locales.map(([code, name]) => `<option value="${code}" lang="${code}">${name}</option>`).join("");
    elements.locale.value = state.locale;
    applyStaticTranslations();
    elements.locale.addEventListener("change", () => setLocale(elements.locale.value));
    let catalogue = window.PARLIAMENT_STREAMS_CATALOGUE;
    if (window.location.protocol !== "file:") {
      let response = await fetch(catalogueUrl, { cache: "no-store" });
      if (!response.ok && catalogueUrl.href !== localCatalogueUrl.href) {
        response = await fetch(localCatalogueUrl, { cache: "no-store" });
      }
      if (response.ok) catalogue = await response.json();
    }
    if (!catalogue) throw new Error("Catalogue data is unavailable.");
    state.channels = catalogue.channels;
    let fallbackCatalogue = window.PARLIAMENT_STREAMS_FALLBACKS;
    if (window.location.protocol !== "file:") {
      try {
        let fallbackResponse = await fetch(fallbacksUrl, { cache: "no-store" });
        if (!fallbackResponse.ok && fallbacksUrl.href !== localFallbacksUrl.href) {
          fallbackResponse = await fetch(localFallbacksUrl, { cache: "no-store" });
        }
        if (fallbackResponse.ok) fallbackCatalogue = await fallbackResponse.json();
      } catch {
        fallbackCatalogue = null;
      }
    }
    state.fallbacks = fallbackCatalogue?.fallbacks ?? [];
    if (window.location.protocol !== "file:") {
      try {
        let scheduleResponse = await fetch(schedulesUrl, { cache: "no-store" });
        if (!scheduleResponse.ok && schedulesUrl.href !== localSchedulesUrl.href) {
          scheduleResponse = await fetch(localSchedulesUrl, { cache: "no-store" });
        }
        if (scheduleResponse.ok) {
          const scheduleSnapshot = await scheduleResponse.json();
          state.schedules = scheduleSnapshot.channels ?? {};
        }
      } catch {
        state.schedules = {};
      }
    }
    state.generatedOn = catalogue.generated_on;
    state.selectedId = state.channels.find(canPlay)?.id ?? state.channels[0]?.id ?? null;
    elements.stats.textContent = t("documented", { count: state.channels.length, date: catalogue.generated_on });
    setOptionLabel(elements.level, "allJur", optionValues("jurisdiction_level"));
    setOptionLabel(elements.format, "allTypes", optionValues("source_type"));
    setOptionLabel(elements.rights, "allUse", [...new Set(state.channels.map((channel) => channel.permission.status))].sort());
    renderResearchSummary();
    renderFallbackDirectory();
    [elements.search, elements.level, elements.format, elements.rights].forEach((input) => input.addEventListener("input", () => { renderList(); renderDetail(); }));
    elements.sortButtons.forEach((button) => button.addEventListener("click", () => {
      const key = button.dataset.sort;
      state.sort = key === state.sort.key
        ? { key, direction: state.sort.direction === "ascending" ? "descending" : "ascending" }
        : { key, direction: "ascending" };
      renderList();
      renderDetail();
    }));
    renderList();
    renderDetail();
  } catch (error) {
    elements.stats.textContent = t("sourceError");
    elements.detail.innerHTML = `<p class="detail-empty">${t("sourceErrorDetail")}</p>`;
  }
}

init();
})();
