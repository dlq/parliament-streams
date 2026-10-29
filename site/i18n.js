/* Locale packs contain copy; this module only loads and looks up messages. */
(() => {
const locales = [["en", "English"], ["fr", "Français"], ["es", "Español"], ["pt-BR", "Português (Brasil)"], ["da", "Dansk"], ["de", "Deutsch"], ["et", "Eesti"], ["el", "Ελληνικά"], ["hi", "हिन्दी"], ["ga", "Gaeilge"], ["it", "Italiano"], ["lb", "Lëtzebuergesch"], ["nl", "Nederlands"], ["nb", "Norsk bokmål"], ["sk", "Slovenčina"], ["th", "ไทย"], ["zh-Hans", "中文（简体）"], ["iu-Cans", "ᐃᓄᒃᑎᑐᑦ"], ["mi", "te reo Māori"], ["cs", "Čeština"], ["fi", "Suomi"], ["sv", "Svenska"], ["zh-Hant", "中文（繁體）"], ["ko", "한국어"], ["ja", "日本語"], ["id", "Bahasa Indonesia"]];
const territorialCodes = {"British Virgin Islands":"VG","Montserrat":"MS","Cook Islands":"CK","Guernsey":"GG","Bermuda":"BM","Cayman Islands":"KY","Turks and Caicos Islands":"TC","Guam":"GU","Puerto Rico":"PR","Gibraltar":"GI","Jersey":"JE","Isle of Man":"IM","French Polynesia":"PF","New Caledonia":"NC","Sint Maarten":"SX"};
const subnationalParents = {"Zug":"CH","French Community":"BE","Liberec Region":"CZ","Zlín Region":"CZ","Madeira":"PT","San Luis":"AR","Kepulauan Riau":"ID","Chakma Autonomous District":"IN","Lai Autonomous District":"IN","Álava":"ES","Bizkaia":"ES","Gipuzkoa":"ES","Moravian-Silesian Region":"CZ","Geneva":"CH","St Gallen":"CH","Mecklenburg-Vorpommern":"DE","South Tyrol":"IT","Campania":"IT","Eastern Cape":"ZA","Kinmen":"TW","Lienchiang":"TW","Thuringia":"DE","Fukui":"JP","Fukushima":"JP","Iwate":"JP","Hsinchu City":"TW","Central Kalimantan":"ID","Central Java":"ID","Yogyakarta":"ID","Free State":"ZA","Thurgau":"CH","Zurich":"CH","Vaud":"CH","Glarus":"CH","Jura":"CH","Castile and León":"ES","Canary Islands":"ES","United States Virgin Islands":"VI","Bolívar":"CO","Cesar":"CO","Guaviare":"CO","Magdalena":"CO","Quindío":"CO","Tolima":"CO","Hesse":"DE","Saxony":"DE","Aceh":"ID","Hyogo":"JP","Tokushima":"JP","Northern Cape":"ZA","Western Cape":"ZA","Cantabria":"ES","La Rioja, Spain":"ES","Penghu":"TW","Tainan":"TW","District of Columbia":"US","Kansas":"US","Mississippi":"US","Wyoming":"US","Canelones":"UY","Montevideo":"UY","New Brunswick":"CA","Åland":"FI","Caldas":"CO","Mato Grosso do Sul":"BR","Paraíba":"BR","Goiás":"BR","Mato Grosso":"BR","Pernambuco":"BR","Rondônia":"BR","Ceará":"BR","Paraná":"BR","Rio de Janeiro":"BR","Buenos Aires Province":"AR","Catamarca":"AR","Buenos Aires City":"AR","La Rioja, Argentina":"AR","Mendoza":"AR","Río Negro":"AR","Salta":"AR","San Juan":"AR","Santa Cruz, Argentina":"AR","Tierra del Fuego":"AR","Tucumán":"AR","Gyeongsangnam-do":"KR","Sejong":"KR","Jeonnam–Gwangju Integrated Special City":"KR","Busan":"KR","Chungcheongnam-do":"KR","Jeonbuk State":"KR","Daegu":"KR","Gyeongsangbuk-do":"KR","Incheon":"KR","Silesian Voivodeship":"PL","Łódź Voivodeship":"PL","Chubut":"AR","North Kalimantan":"ID","Arauca":"CO","Caquetá":"CO","Risaralda":"CO","Corrientes":"AR","Neuquén":"AR","Sicily":"IT","West Virginia":"US","Tyrol":"AT","Appenzell Ausserrhoden":"CH","Wallonia":"BE","Brussels-Capital Region":"BE","British Virgin Islands":"VG","Montserrat":"MS","Guernsey":"GG","Bermuda":"BM","Cayman Islands":"KY","Turks and Caicos Islands":"TC","Guam":"GU","Puerto Rico":"PR","Gibraltar":"GI","Drenthe":"NL","Limburg":"NL","Noord-Brabant":"NL","Bern":"CH","Alberta":"CA","British Columbia":"CA","Manitoba":"CA","Newfoundland and Labrador":"CA","Northwest Territories":"CA","Nunavut":"CA","Ontario":"CA","Prince Edward Island":"CA","Quebec":"CA","Saskatchewan":"CA","New South Wales":"AU","Queensland":"AU","Victoria":"AU","Western Australia":"AU","Baden-Wurttemberg":"DE","Bavaria":"DE","North Rhine-Westphalia":"DE","Andalusia":"ES","Catalonia":"ES","Navarre":"ES","Valencia":"ES","Northern Ireland":"GB","Scotland":"GB","Wales":"GB","Jalisco":"MX","Córdoba":"AR","Nagasaki":"JP","Santa Catarina":"BR","Jersey":"JE","Isle of Man":"IM","French Polynesia":"FR","New Caledonia":"FR","Sint Maarten":"SX","California":"US","Florida":"US","Minnesota":"US","New York":"US","Oregon":"US","Rhode Island":"US","Texas":"US","Utah":"US","Washington":"US"};
const script = new URL(document.currentScript.src);
const root = location.protocol === "file:" ? new URL("https://dlq.ca/parliament-streams/locales/") : new URL("locales/", script);
const version = document.querySelector('meta[name="parliament-locale-version"]')?.content;
const packs = new Map();
const requests = new Map();
const domains = ["common", "map", "schedule", "institutions", "viewer", "project", "iptv", "jurisdictions", "sourceCount", "source"];
function load(candidate) {
  const locale = supportedLocale(candidate);
  if (!requests.has(locale)) {
    const url = new URL(locale + ".json", root);
    if (version && version !== "local") url.searchParams.set("v", version);
    const promise = fetch(url, { cache: "no-cache", headers: { Accept: "application/json" } })
      .then((response) => { if (!response.ok) throw new Error("Language unavailable: " + locale); return response.json(); })
      .then((pack) => {
        if (pack.schema_version !== 1 || pack.locale !== locale || domains.some((name) => !pack[name] || typeof pack[name] !== "object" || Array.isArray(pack[name]))) throw new Error("Invalid language pack: " + locale);
        packs.set(locale, pack);
        return pack;
      }).catch((error) => { requests.delete(locale); throw error; });
    requests.set(locale, promise);
  }
  return requests.get(locale);
}
const data = (locale, domain) => packs.get(locale)?.[domain] ?? packs.get("en")?.[domain] ?? {};
function messageFor(domain, locale, key, values = {}) {
  const text = data(locale, domain)[key] ?? data("en", domain)[key] ?? key;
  return typeof text === "string" ? text.replace(/\{(\w+)\}/g, (token, name) => values[name] ?? (domain === "institutions" ? token : "")) : text;
}
function missing(domain, locale) {
  const pack = packs.get(locale)?.[domain] ?? {};
  return Object.keys(data("en", domain)).filter((key) => !Object.hasOwn(pack, key) || typeof pack[key] === "string" && !pack[key].trim());
}
function family(domain, detailed = false) {
  return {
    message: (locale, key, values) => messageFor(domain, locale, key, values),
    coverage(locale) {
      const absent = missing(domain, locale);
      const total = Object.keys(data("en", domain)).length;
      return detailed ? { total, translated: total - absent.length, missing: absent } : absent;
    },
  };
}
function supportedLocale(candidate) {
  if (!candidate) return "en";
  const exact = locales.find(([code]) => code.toLocaleLowerCase() === candidate.toLocaleLowerCase());
  if (exact) return exact[0];
  // Explicit script wins over region; Taiwan, Hong Kong and Macao default to Traditional Chinese.
  let language;
  try {
    const parsed = new Intl.Locale(candidate);
    language = parsed.language;
    if (parsed.language === "zh") {
      if (parsed.script === "Hant" || (!parsed.script && ["TW", "HK", "MO"].includes(parsed.region))) return "zh-Hant";
      return "zh-Hans";
    }
  } catch { return "en"; }
  return locales.find(([code]) => code.split("-")[0] === language)?.[0] ?? "en";
}

function readLocalePreference() {
  try {
    return localStorage.getItem("parliament-streams-locale");
  } catch {
    // Storage can be unavailable in private or local-file previews.
    return null;
  }
}

function writeLocalePreference(locale) {
  try {
    localStorage.setItem("parliament-streams-locale", locale);
  } catch {
    // The selected language still works for the current page and its links.
  }
}


const message = (locale, key, values) => messageFor("common", locale, key, values);
function localizedLabel(locale, value) {
  return data(locale, "common").labels?.[value] ?? data("en", "common").labels?.[value] ?? value.replaceAll("_", " ");
}
function translationCoverage(locale) {
  return { messages: missing("common", locale).filter((key) => key !== "labels"), labels: Object.keys(data("en", "common").labels ?? {}).filter((key) => !Object.hasOwn(packs.get(locale)?.common?.labels ?? {}, key)) };
}
function requestedLocale() {
  return supportedLocale(new URLSearchParams(location.search).get("lang") ?? readLocalePreference() ?? navigator.language);
}
function currentLocale() {
  const locale = requestedLocale();
  return packs.has(locale) ? locale : "en";
}
function prepare() {
  const locale = requestedLocale();
  return Promise.all([load("en"), locale === "en" ? null : load(locale).catch(() => null)]);
}
function startPage(callback) {
  const signal = window.ParliamentStreamsNavigation?.signal;
  return prepare().then(() => { if (!signal?.aborted) return callback(signal); });
}
const ready = prepare();
window.ParliamentStreamsI18n = { locales, message, localizedLabel, readLocalePreference, supportedLocale, translationCoverage, writeLocalePreference, load, ready, data, prepare, startPage, currentLocale };
window.ParliamentStreamsMapI18n = {
  ...family("map"), subnationalParents,
  jurisdictionName(locale, name) { return data(locale, "jurisdictions")[name] ?? (territorialCodes[name] ? new Intl.DisplayNames([locale], { type: "region" }).of(territorialCodes[name]) : null) ?? name; },
  sourceCount(locale, count) { const forms = data(locale, "sourceCount"); return (forms[new Intl.PluralRules(locale).select(count)] ?? forms.other).replace("{count}", new Intl.NumberFormat(locale).format(count)); },
countrySearchTerms(locale, channel) {
  const code = channel.jurisdiction_level === "subnational"
    ? subnationalParents[channel.country_or_region]
    : channel.jurisdiction_level === "national"
      ? ({ Taiwan: "TW", "Cook Islands": "CK", Panama: "PA" }[channel.country_or_region] ?? channel.external_ids?.ipu_country_code)
      : null;
  if (!code) return "";
  // Search associations are separate from geographical map parents: Crown
  // Dependencies are not part of the UK, and Sint Maarten is a constituent
  // country of the Kingdom, not a province of the Netherlands.
  const associations = { "United States Virgin Islands": ["US"], "British Virgin Islands": ["GB"], Montserrat: ["GB"], "Cook Islands": ["NZ"], Guernsey: ["GB"], Bermuda: ["GB"], "Cayman Islands": ["GB"], "Turks and Caicos Islands": ["GB"], Guam: ["US"], "Puerto Rico": ["US"], Gibraltar: ["GB"], Jersey: ["GB"], "Isle of Man": ["GB"], "Sint Maarten": ["NL"], "French Polynesia": ["PF"], "New Caledonia": ["NC"] };
  return [...new Set([code, ...(associations[channel.country_or_region] ?? [])])].flatMap((regionCode) => [...new Set(["en", locale])].map((language) => {
    try { return new Intl.DisplayNames([language], { type: "region" }).of(regionCode) ?? ""; }
    catch { return ""; }
  })).join(" ");
},
normalizeSearchText(value) {
  // Fold common accents without stripping marks in other combining blocks.
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
},

};
window.ParliamentStreamsScheduleI18n = family("schedule");
window.ParliamentStreamsInstitutionsI18n = family("institutions", true);
window.ParliamentStreamsViewerI18n = family("viewer");
window.ParliamentStreamsProjectI18n = family("project", true);
window.ParliamentStreamsIptvI18n = { coverage: (locale) => missing("iptv", locale) };
})();
