(() => {
// The deployed Pages artifact places its JSON beside this script; local server
// previews serve the repository's data directory one level above site/.
const { locales, localizedLabel, message, supportedLocale } = window.ParliamentStreamsI18n;

const appScriptUrl = document.currentScript?.src ?? window.location.href;
const catalogueUrl = new URL("./data/channels.json", appScriptUrl);
const localCatalogueUrl = new URL("../data/channels.json", appScriptUrl);
const blockedPlaybackRights = new Set(["no_third_party_reuse"]);

const initialLocale = supportedLocale(new URLSearchParams(window.location.search).get("lang") ?? localStorage.getItem("parliament-streams-locale") ?? navigator.language);
const state = { channels: [], selectedId: null, hls: null, generatedOn: "", locale: initialLocale, mobileDetailOpen: false, sort: { key: "source", direction: "ascending" } };
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
};

const jurisdictionFlagAssets = {
  Australia: "assets/flags/au.svg",
  Brazil: "assets/flags/br.svg",
  Canada: "assets/flags/ca.svg",
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
  Luxembourg: "assets/flags/lu.svg",
  Mongolia: "assets/flags/mn.svg",
  Netherlands: "assets/flags/nl.svg",
  "New Zealand": "assets/flags/nz.svg",
  Nunavut: "assets/flags/nunavut.svg",
  Ontario: "assets/flags/ontario.svg",
  OSCE: "assets/flags/osce.svg",
  Norway: "assets/flags/no.svg",
  Portugal: "assets/flags/pt.svg",
  Quebec: "assets/flags/quebec.svg",
  Scotland: "assets/flags/scotland.svg",
  Slovakia: "assets/flags/sk.svg",
  Spain: "assets/flags/es.svg",
  Taiwan: "assets/flags/tw.svg",
  Thailand: "assets/flags/th.svg",
  Wales: "assets/flags/wales.svg",
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
  const specialName = specialJurisdictionNames[state.locale]?.[name] ?? devolvedJurisdictionNames[state.locale]?.[name];
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
    return `<img class="jurisdiction-flag" src="${asset}" alt="${displayName} flag" title="${displayName}">`;
  }
  return `<span class="jurisdiction-mark" role="img" aria-label="${displayName}" title="${displayName}">🏛️</span>`;
}
function accessDescription(status) {
  return {
    validated: "A direct playback route was successfully checked.",
    needs_review: "A direct route is recorded but needs a fresh or successful check.",
    link_only: "The catalogue records an official watch page, not a direct playback route.",
  }[status];
}
function sourceTypeDescription(sourceType) {
  return {
    direct_hls: "A direct HTTP Live Streaming endpoint.",
    direct_dash: "A direct MPEG-DASH streaming endpoint.",
    official_page: "An official watch page; no direct stream endpoint is recorded.",
    youtube: "An official YouTube watch surface.",
  }[sourceType];
}
function setText(id, value) { document.querySelector(`#${id}`).textContent = value; }
function setOptionLabel(element, key, values) {
  const selected = element.value;
  element.innerHTML = `<option value="">${t(key)}</option>${values.map((value) => `<option value="${value}">${label(value)}</option>`).join("")}`;
  element.value = selected;
}
function applyStaticTranslations() {
  document.documentElement.lang = state.locale;
  document.querySelector("#skip-link").textContent = t("skipCatalogue");
  document.querySelector("#brand-home").setAttribute("aria-label", t("brandHome"));
  document.querySelector("#primary-navigation").setAttribute("aria-label", t("primaryNavigation"));
  setText("nav-catalogue", t("nav"));
  setText("locale-label", t("language"));
  elements.locale.setAttribute("aria-label", t("language"));
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
  document.querySelector("#catalogue-results").setAttribute("aria-label", t("catalogueResults"));
  document.querySelector("#channel-table").setAttribute("aria-label", t("catalogueTable"));
  ["source", "jurisdiction", "format", "language", "access", "use"].forEach((key) => setText(`sort-${key}`, t(key === "language" ? "contentLanguage" : key)));
  setText("method-label", t("care"));
  setText("method-title", t("methodTitle"));
  setText("method-copy", t("methodCopy"));
  document.querySelector("#rights-link").firstChild.textContent = `${t("rights")} `;
  setText("open-streams-title", t("openStreams"));
  document.querySelector("#open-streams-link").firstChild.textContent = `${t("openStreams")} `;
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
    elements.stats.textContent = t("documented", { count: state.channels.length, date: state.generatedOn });
  }
}
function permissionDescription(status) {
  return {
    personal_use_pending_review: "No affirmative third-party permission is recorded. Playback is available under the catalogue's opt-out policy unless terms expressly prohibit it.",
    noncommercial_pending_review: "The source records some non-commercial reuse support but does not clearly cover this use. Playback is available under the catalogue's opt-out policy unless terms expressly prohibit it.",
    explicit_reuse_with_conditions: "Reuse is documented, subject to the source's stated conditions and attribution requirements.",
    embed_only: "Use the source platform's official embed or outbound link; do not extract its stream endpoint.",
    no_third_party_reuse: "The source terms prohibit third-party reuse without separate written permission; use its official link only.",
  }[status];
}
function canPlay(channel) {
  return Boolean(channel.playback_url)
    && channel.technical_status === "validated"
    && !blockedPlaybackRights.has(channel.permission.status);
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
    header.setAttribute("aria-sort", active ? state.sort.direction : "none");
    const button = header.querySelector("button");
    button.classList.toggle("is-active", active);
    button.dataset.direction = active ? state.sort.direction : "none";
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
    const result = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" })
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
    state.mobileDetailOpen = false;
  }
  elements.list.innerHTML = channels.length ? channels.map((channel) => `
    <button class="channel-button" type="button" role="row" data-channel-id="${channel.id}" aria-pressed="${channel.id === state.selectedId}">
      <span role="cell"><span class="channel-name">${jurisdictionMark(channel.country_or_region)}${sourceNameMarkup(channel.name)}${canPlay(channel) ? '<span class="play-marker" aria-label="Embedded playback available" title="Embedded playback available">&#9654;</span>' : ""}</span><span class="legislature">${channel.legislature}</span></span>
      <span role="cell">${jurisdictionName(channel.country_or_region)}</span>
      <span class="format" role="cell" title="${sourceTypeDescription(channel.source_type)}">${label(channel.source_type)}</span>
      <span class="language-list" role="cell">${languageMarkup(channel.language)}</span>
      <span role="cell"><span class="status status-${slug(channel.technical_status)}" title="${accessDescription(channel.technical_status)}">${label(channel.technical_status)}</span></span>
      <span role="cell"><span class="status status-${slug(channel.permission.status)}" title="${permissionDescription(channel.permission.status)}">${label(channel.permission.status)}</span></span>
    </button>`).join("") : `<p class="detail-empty">${t("noResults")}</p>`;
  elements.list.querySelectorAll("[data-channel-id]").forEach((button) => button.addEventListener("click", () => {
    state.selectedId = button.dataset.channelId;
    state.mobileDetailOpen = window.matchMedia("(max-width: 680px)").matches;
    renderList();
    renderDetail({ startPlayer: true });
  }));
}
function closeMobileDetail() {
  state.mobileDetailOpen = false;
  elements.detail.classList.remove("is-open");
  elements.detail.style.removeProperty("--mobile-sheet-height");
}
function syncFilterDisclosure(mediaQuery) {
  elements.filterDisclosure.open = !mediaQuery.matches;
}
function setMobileSheetHeight(height) {
  const minimum = 150;
  const maximum = Math.round(window.innerHeight * 0.9);
  elements.detail.style.setProperty("--mobile-sheet-height", `${Math.min(maximum, Math.max(minimum, height))}px`);
}
function setupMobileSheetControls() {
  const grabber = elements.detail.querySelector("[data-resize-detail]");
  let startY = 0;
  let startHeight = 0;
  let moved = false;
  let suppressClick = false;
  const snapHeights = () => [150, Math.round(window.innerHeight * 0.54), Math.round(window.innerHeight * 0.9)];
  const snapToNearest = () => {
    const current = elements.detail.getBoundingClientRect().height;
    const nearest = snapHeights().reduce((best, height) => Math.abs(height - current) < Math.abs(best - current) ? height : best);
    setMobileSheetHeight(nearest);
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
    setMobileSheetHeight(startHeight + startY - event.clientY);
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
    setMobileSheetHeight(heights[(currentIndex + 1) % heights.length]);
  });
}
function epgMarkup(channel) {
  if (!channel.epg_sources.length) return `<span>${t("noSchedule")}</span>`;
  return `<ul class="epg-list">${channel.epg_sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${sentenceCase(source.kind)} ↗</a></li>`).join("")}</ul>`;
}
function evidenceLabel(channel, url) {
  const address = url.toLocaleLowerCase();
  if (url === channel.official_url) return "Official watch page";
  if (url === channel.playback_url) return "Recorded stream endpoint";
  if (channel.epg_sources.some((source) => source.url === url)) return "Schedule source";
  if (/terms|termo|condition/.test(address)) return "Terms and conditions";
  if (/copyright|droits|property|licen[cs]e|reuse/.test(address)) return "Copyright / reuse terms";
  if (/privacy|privacidade/.test(address)) return "Privacy policy";
  if (/embed/.test(address)) return "Embed guidance";
  if (/faq/.test(address)) return "FAQ";
  if (/transparen/.test(address)) return "Transparency policy";
  if (/press/.test(address)) return "Press / media information";
  if (/audiovisual|media|multimedia/.test(address)) return "Official media page";
  if (/live|webcast|video|television|\.tv\//.test(address)) return "Official live page";
  return "Supporting source";
}
function evidenceMarkup(channel) {
  const occurrences = new Map();
  return channel.permission.evidence.map((url) => {
    const label = evidenceLabel(channel, url);
    const occurrence = (occurrences.get(label) ?? 0) + 1;
    occurrences.set(label, occurrence);
    const suffix = occurrence > 1 ? ` ${occurrence}` : "";
    return `<a href="${url}" target="_blank" rel="noreferrer" title="${url}">${label}${suffix} ↗</a>`;
  }).join(" ");
}
function renderDetail({ startPlayer = false } = {}) {
  if (state.hls) { state.hls.destroy(); state.hls = null; }
  const channel = state.channels.find((item) => item.id === state.selectedId);
  if (!channel) { elements.detail.innerHTML = `<p class="detail-empty">Select a source to view its documentation.</p>`; closeMobileDetail(); return; }
  const allowed = canPlay(channel);
  const playbackMessage = allowed
    ? "This technically validated public endpoint is available under the catalogue's opt-out playback policy. This is not a statement that the catalogue has received a licence; review the source notes and report any concern for prompt removal."
    : channel.permission.recommendation;
  elements.detail.innerHTML = `
    <div class="mobile-sheet-controls">
      <button class="detail-grabber" data-resize-detail type="button" aria-label="Resize source details"><span></span></button>
    </div>
    <h3 class="detail-title">${channel.name}</h3>
    <p class="detail-subtitle">${jurisdictionMark(channel.country_or_region)}${jurisdictionName(channel.country_or_region)} · ${channel.legislature}</p>
    <div class="media-frame" id="media-frame">
      <div class="player-placeholder">${allowed ? `<button class="placeholder-play-button" data-start-playback type="button" aria-label="${t("watch")}">▶</button>` : '<span aria-hidden="true">▶</span>'}<p>${allowed ? t("ready") : t("disabled")}</p></div>
    </div>
    <div class="detail-actions">
      ${allowed ? `<button class="play-button" data-start-playback type="button">${t("watch")}</button>` : ""}
      <a class="official-button" href="${channel.official_url}" target="_blank" rel="noreferrer">${t("official")} ↗</a>
    </div>
    <dl class="detail-grid">
      <div title="${sourceTypeDescription(channel.source_type)}"><dt>${t("sourceType")}</dt><dd>${label(channel.source_type)}</dd></div>
      <div title="${accessDescription(channel.technical_status)}"><dt>${t("accessStatus")}</dt><dd><span class="status status-${slug(channel.technical_status)}">${label(channel.technical_status)}</span></dd></div>
      <div title="${permissionDescription(channel.permission.status)}"><dt>${t("useGuidance")}</dt><dd><span class="status status-${slug(channel.permission.status)}">${label(channel.permission.status)}</span></dd></div>
      <div title="The expected operating condition or time window for this source."><dt>${t("availability")}</dt><dd>${label(channel.availability)}</dd></div>
      <div class="full"><dt>${t("attribution")}</dt><dd>${channel.attribution_text}</dd></div>
      <div class="full"><dt>${t("programme")}</dt><dd>${channel.program.current_event_title}<br><span class="detail-subtitle">${channel.program.current_event_time}</span></dd></div>
      <div class="full"><dt>${t("schedule")}</dt><dd>${epgMarkup(channel)}</dd></div>
    </dl>
    <p class="detail-note"><strong>${t("reuse")}</strong> ${channel.permission.summary} ${evidenceMarkup(channel)}</p>
    <p class="detail-note"><strong>${t("recommendation")}</strong> ${playbackMessage}</p>`;
  elements.detail.classList.toggle("is-open", state.mobileDetailOpen);
  document.querySelectorAll("[data-start-playback]").forEach((button) => button.addEventListener("click", () => startPlayback(channel)));
  setupMobileSheetControls();
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
    frame.innerHTML = `<div class="player-placeholder"><p>Playback could not start in this browser. <a href="${channel.official_url}" target="_blank" rel="noreferrer">Open the official source ↗</a></p></div>`;
  }
}
async function init() {
  try {
    const mobileLayout = window.matchMedia("(max-width: 680px)");
    syncFilterDisclosure(mobileLayout);
    mobileLayout.addEventListener("change", () => syncFilterDisclosure(mobileLayout));
    elements.locale.innerHTML = locales.map(([code, name]) => `<option value="${code}">${name}</option>`).join("");
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
    state.generatedOn = catalogue.generated_on;
    state.selectedId = state.channels.find(canPlay)?.id ?? state.channels[0]?.id ?? null;
    elements.stats.textContent = t("documented", { count: state.channels.length, date: catalogue.generated_on });
    setOptionLabel(elements.level, "allJur", optionValues("jurisdiction_level"));
    setOptionLabel(elements.format, "allTypes", optionValues("source_type"));
    setOptionLabel(elements.rights, "allUse", [...new Set(state.channels.map((channel) => channel.permission.status))].sort());
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
