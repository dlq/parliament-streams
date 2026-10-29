/* Locale-aware source presentation shared by the catalogue and viewer. */
(() => {
const jurisdictionFlagAssets = window.ParliamentStreamsFlags;

const jurisdictionCodes = {
  Serbia: "RS",
  "United States Virgin Islands": "VI",
  Montenegro: "ME", "Åland": "AX",
  Poland: "PL",
  "Slovenia": "SI",
  "Cape Verde": "CV",
  "Lithuania": "LT",
  "Malaysia": "MY",
  "Suriname": "SR",
  "Dominican Republic": "DO",
  "Argentina": "AR",
  "Namibia": "NA",
  "North Macedonia": "MK",
  "Ghana": "GH",
  "Colombia": "CO",
  "Guyana": "GY",
  "Timor-Leste": "TL",
  "Jamaica": "JM",
  "Sri Lanka": "LK",
  "Panama": "PA",
  "Croatia": "HR",
  "Botswana": "BW",
  "Indonesia": "ID",
  "South Korea": "KR",
  "British Virgin Islands": "VG",
  "Montserrat": "MS",

  "Cook Islands": "CK", Guernsey: "GG",
  Bermuda: "BM",
  "Cayman Islands": "KY", "Turks and Caicos Islands": "TC",
  Guam: "GU", "Puerto Rico": "PR", Gibraltar: "GI",
  Jersey: "JE", "Isle of Man": "IM", "French Polynesia": "PF", "New Caledonia": "NC", "Sint Maarten": "SX",
  Australia: "AU", Brazil: "BR", Canada: "CA", Chile: "CL", "Costa Rica": "CR",
  "Czech Republic": "CZ", Finland: "FI", Sweden: "SE", Denmark: "DK", "El Salvador": "SV", Estonia: "EE", France: "FR", Germany: "DE",
  Greece: "GR", India: "IN", Ireland: "IE", Israel: "IL", Italy: "IT", Luxembourg: "LU",
  Mongolia: "MN", Netherlands: "NL", "New Zealand": "NZ", Norway: "NO", Portugal: "PT",
  Slovakia: "SK", Spain: "ES", Taiwan: "TW", Thailand: "TH", "United Kingdom": "GB",
  "United States": "US",
  "European Union": "EU",
};




const languageCodes = {
  Serbian: "sr",
  Montenegrin: "cnr",
  "Slovenian": "sl",
  "Lithuanian": "lt",
  "Malay": "ms",
  "Macedonian": "mk",
  "Albanian": "sq",
  "Tetum": "tet",
  "Sinhala": "si",
  "Tamil": "ta",
  "Indonesian": "id",
  "Korean": "ko",
  "Croatian": "hr",
  "Setswana": "tn",
  "Cape Verdean Creole": "kea",
  "Czech": "cs",
  "Finnish": "fi",
  "Swedish": "sv",
  "Japanese": "ja",
  "Catalan": "ca",
  "Valencian": "ca-valencia",
  "Basque": "eu",
  "Tahitian": "ty",

  Danish: "da", Dutch: "nl", English: "en", Estonian: "et", French: "fr", Gaelic: "gd", German: "de",
  Greek: "el", Hebrew: "he", Hindi: "hi", Inuktitut: "iu", Irish: "ga", Italian: "it",
  Luxembourgish: "lb", Mandarin: "zh", Mongolian: "mn", Norwegian: "no", Portuguese: "pt",
  Slovak: "sk", Spanish: "es", Thai: "th", Welsh: "cy",
};

// Chromium does not currently ship te reo Maori language-display data. These
// CLDR names keep the catalogue metadata localized when that locale is chosen.


function create(getLocale, getChannels = () => []) {
const state = { get locale() { return getLocale(); }, get channels() { return getChannels(); } };
const { localizedLabel, message, data } = window.ParliamentStreamsI18n;
const names = (kind) => data(state.locale, "source")[kind] ?? {};
function t(key, values) { return message(state.locale, key, values); }
function label(value) { return localizedLabel(state.locale, value); }
function slug(value) { return value.replaceAll("_", "-"); }
function jurisdictionName(name) {
  const specialName = names("specialJurisdictions")[name]
    ?? names("devolvedJurisdictions")[name]
    ?? names("subnationalJurisdictions")[name];
  if (specialName) return specialName;
  const sharedName = window.ParliamentStreamsMapI18n?.jurisdictionName(state.locale, name);
  if (sharedName && sharedName !== name) return sharedName;
  const code = jurisdictionCodes[name] ?? state.channels.find((channel) =>
    channel.jurisdiction_level === "national" && channel.country_or_region === name
  )?.external_ids?.ipu_country_code;
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
function isPlaybackEnabled(channel) {
  const mixedContentBlocked = window.location.protocol === "https:"
    && channel.playback_url?.startsWith("http:");
  return ["native_playback", "provider_embed"].includes(channel.playback_policy)
    && !mixedContentBlocked;
}
function playbackMode(channel) {
  return {
    native_playback: "playable",
    provider_embed: "fallback",
    link_out: "link_out",
    research_only: "research",
  }[channel.playback_policy] ?? "research";
}
function playbackModeLabel(value) {
  return {
    playable: t("sourcePlayable"),
    link_out: t("sourceLinkOut"),
    fallback: t("sourceFallback"),
    research: t("sourceResearch"),
  }[value] ?? value;
}
function playbackModeDescription(value) {
  return {
    playable: t("sourcePlayableDescription"),
    link_out: t("sourceLinkOutDescription"),
    fallback: t("sourceFallbackDescription"),
    research: t("sourceResearchDescription"),
  }[value] ?? "";
}
function formatDate(value) {
  if (!value) return t("notAvailable");
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  return new Intl.DateTimeFormat(state.locale, { dateStyle: "medium" }).format(date);
}
function sourceNameMarkup(name) { return name.replaceAll(" - ", "<br>"); }
function languageMarkup(language) {
  const displayNames = new Intl.DisplayNames([state.locale], { type: "language", fallback: "code" });
  return language.split(" / ").map((name) => {
    if (name === "Unknown") return t("a11yUnknown");
    const code = name === "Multilingual" ? "mul" : languageCodes[name];
    if (!code) return name;
    const displayName = names("languageNames")[code] ?? displayNames.of(code);
    return displayName && displayName !== code ? displayName : name;
  }).join("<br>");
}
function languageDisplayName(language) {
  if (!language) return "";
  const displayNames = new Intl.DisplayNames([state.locale], { type: "language", fallback: "code" });
  return names("languageNames")[language] ?? displayNames.of(language) ?? language;
}
function contentLanguageTag(channel) {
  const firstLanguage = channel.language.split(" / ")[0];
  return firstLanguage === "Multilingual" ? "" : languageCodes[firstLanguage] ?? "";
}
function languageAttribute(language) { return language ? ` lang="${escapeHtml(language)}"` : ""; }
function sentenceCase(value) {
  const phrase = value.replaceAll("_", " ");
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
function localEventTime(start, fallback) {
  if (!start) return fallback;
  const date = new Date(start);
  if (Number.isNaN(date.valueOf())) return fallback;
  const today = new Date();
  const sameDay = date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate();
  const options = { hour: "numeric", minute: "2-digit", timeZoneName: "short" };
  if (!sameDay) Object.assign(options, { weekday: "short", month: "short", day: "numeric" });
  return new Intl.DateTimeFormat(state.locale, options).format(date);
}
return { t, label, slug, jurisdictionName, jurisdictionMark, isPlaybackEnabled, playbackMode, playbackModeLabel, playbackModeDescription, formatDate, sourceNameMarkup, languageMarkup, languageDisplayName, contentLanguageTag, languageAttribute, sentenceCase, escapeHtml, localEventTime };
}
window.ParliamentStreamsSourceUI = { create };
})();
