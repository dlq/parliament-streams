window.ParliamentStreamsPageReady = window.ParliamentStreamsI18n.startPage((pageSignal) => {

const { countrySearchTerms, normalizeSearchText } = window.ParliamentStreamsMapI18n;

const heroImages = [
  {
    file: "assets/hero/house-of-commons-1890.jpg",
    position: "center 54%",
    credit: "House of Commons chamber, 1890 · Library of Congress · Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Interior_of_House_of_Commons_(Parliament_House),_London,_England)_-_F.F._%26_Co_LCCN89713510.jpg",
  },
  {
    file: "assets/hero/south-australia-parliament-1939.jpg",
    position: "center 65%",
    credit: "Parliament House, South Australia, 1939 · State Library of South Australia · CC0",
    source: "https://commons.wikimedia.org/wiki/File:Interior_of_Parliament_House(GN07496).jpg",
  },
  {
    file: "assets/hero/reichstag-berlin-1890s.jpg",
    position: "center 40%",
    credit: "Reichstag, Berlin, ca. 1890s · Library of Congress · Public domain",
    source: "https://commons.wikimedia.org/wiki/File:No_Known_Restrictions_The_Reichstag,_Berlin,_ca._1890s_(LOC)_(461040598).jpg",
  },
  {
    file: "assets/hero/hungary-parliament-interior.jpg",
    position: "center 42%",
    credit: "Hungarian Parliament interior, Budapest · Karelj · Public domain",
    source: "https://commons.wikimedia.org/wiki/File:Budapest_parlament_interior_13.jpg",
  },
  {
    file: "assets/hero/new-south-wales-assembly-1872.jpg",
    position: "center 65%",
    credit: "New South Wales Legislative Assembly chamber, 1872 · State Library of NSW · Public domain",
    source: "https://commons.wikimedia.org/wiki/File:SLNSW_479505_2_Legislative_Assembly_Chamber_Interior_SH_552.jpg",
  },
  {
    file: "assets/hero/austrian-parliament-interior.jpg",
    position: "center 58%",
    credit: "Austrian Parliament interior · Frederic Koberl · CC0",
    source: "https://commons.wikimedia.org/wiki/File:Classical_parliament_interior_(Unsplash).jpg",
  },
];

const state = { channels: [], generatedOn: "", locale: window.ParliamentStreamsPageLocale.current(), sort: { key: "source", direction: "ascending" } };
const elements = {};
const { t, label, slug, jurisdictionName, jurisdictionMark, isPlaybackEnabled, playbackMode, playbackModeLabel, playbackModeDescription, formatDate, sourceNameMarkup, languageMarkup, contentLanguageTag, languageAttribute, escapeHtml } = window.ParliamentStreamsSourceUI.create(() => state.locale, () => state.channels);
function bindElements() { Object.assign(elements, {
  stats: document.querySelector("#catalogue-stats"),
  list: document.querySelector("#channel-list"),
  filterDisclosure: document.querySelector(".filter-disclosure"),
  count: document.querySelector("#results-count"),
  search: document.querySelector("#search"),
  level: document.querySelector("#level-filter"),
  format: document.querySelector("#format-filter"),
  sortButtons: document.querySelectorAll("[data-sort]"),
  sortHeaders: document.querySelectorAll("[data-sort-header]"),
  sortStatus: document.querySelector("#sort-status"),
  intro: document.querySelector(".intro"),
  heroCredit: document.querySelector(".hero-credit"),
}); }
bindElements();

function renderDailyHero() {
  if (!elements.intro) return;
  const dayIndex = Math.floor(Date.now() / 86_400_000) % heroImages.length;
  const hero = heroImages[dayIndex];
  elements.intro.style.setProperty("--hero-image", `url("${hero.file}")`);
  elements.intro.style.setProperty("--hero-position", hero.position);
  elements.heroCredit.href = hero.source;
  elements.heroCredit.innerHTML = `${escapeHtml(hero.credit)} <span aria-hidden="true">↗</span>`;
}

function setText(id, value) { document.querySelector(`#${id}`).textContent = value; }
function setOptionLabel(element, key, values) {
  const selected = element.value;
  element.innerHTML = `<option value="">${t(key)}</option>${values.map((value) => `<option value="${value}">${label(value)}</option>`).join("")}`;
  element.value = selected;
}
function applyStaticTranslations() {

  window.ParliamentStreamsSeo.update(`Parliament Streams · ${t("title")}`,
    state.locale === "en"
      ? "Explore official parliamentary video worldwide. Watch supported streams, browse schedules, and use HLS playlists and a partial XMLTV programme guide."
      : t("lede"), state.locale);
  document.querySelector("#skip-link").textContent = t("skipCatalogue");
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
  setText("filters-label", t("filters"));
  setText("metric-sources-label", t("metricSources"));
  setText("metric-playable-label", t("metricPlayable"));
  setText("metric-schedules-label", t("metricSchedules"));
  setText("metric-updated-label", t("metricUpdated"));
  setText("catalogue-information-label", t("catalogueCoverage"));
  document.querySelector("#catalogue-results").setAttribute("aria-label", t("catalogueResults"));
  elements.sortStatus.setAttribute("lang", state.locale);
  ["source", "jurisdiction", "language", "mode"].forEach((key) => setText(`sort-${key}`, t(key === "language" ? "contentLanguage" : key === "mode" ? "playbackPolicy" : key)));
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
}
function setLocale(locale) {
  state.locale = locale;
  applyStaticTranslations();
  if (state.channels.length) {
    setOptionLabel(elements.level, "allJur", optionValues("jurisdiction_level"));
    setOptionLabel(elements.format, "allTypes", optionValues("source_type"));
    renderList();
    renderResearchSummary();
    elements.stats.textContent = t("documented", { count: state.channels.length, date: state.generatedOn });
  }
}
function playbackModeSortValue(channel) {
  const order = {
    playable: 0,
    fallback: 1,
    link_out: 2,
    research: 3,
  };
  const status = playbackMode(channel);
  return `${order[status] ?? 9}-${playbackModeLabel(status)}`;
}
function renderResearchSummary() {
  document.querySelector("#metric-sources").textContent = state.channels.length;
  document.querySelector("#metric-playable").textContent = state.channels.filter(isPlaybackEnabled).length;
  document.querySelector("#metric-schedules").textContent = state.channels.filter((channel) =>
    channel.epg_sources.some((source) => source.scraper_status === "implemented")
  ).length;
  document.querySelector("#metric-updated").textContent = formatDate(state.generatedOn);
}
function sortValue(channel, key) {
  switch (key) {
    case "source": return channel.name;
    case "jurisdiction": return jurisdictionName(channel.country_or_region);
    case "mode": return playbackModeSortValue(channel);
    case "language": return channel.language;
    default: return undefined;
  }
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
function filteredSources() {
  const search = normalizeSearchText(elements.search.value.trim());
  const collator = new Intl.Collator(state.locale, { numeric: true, sensitivity: "base" });
  return state.channels.filter((channel) => {
    const searchable = normalizeSearchText([channel.name, channel.legislature, channel.country_or_region, jurisdictionName(channel.country_or_region), countrySearchTerms(state.locale, channel), channel.language].join(" "));
    return (!search || searchable.includes(search))
      && (!elements.level.value || channel.jurisdiction_level === elements.level.value)
      && (!elements.format.value || channel.source_type === elements.format.value);
  }).sort((left, right) => {
    const result = collator.compare(sortValue(left, state.sort.key), sortValue(right, state.sort.key));
    return state.sort.direction === "ascending" ? result : -result;
  });
}
function renderList() {
  const channels = filteredSources();
  renderSortHeaders();
  elements.count.textContent = t("results", { shown: channels.length, total: state.channels.length });
  elements.list.innerHTML = channels.length ? channels.map((channel) => {
    const descriptionId = `${channel.id}-description`;
    const status = playbackMode(channel);
    const playable = isPlaybackEnabled(channel);
    const external = !playable && status !== "research";
    const actionLabel = playable ? t("watch") : external ? t("official") : playbackModeLabel(status);
    return `
    <li class="channel-row">
      <button class="channel-button" type="button" data-channel-id="${channel.id}" aria-pressed="${channel.id === window.ParliamentStreamsViewer.selectedId}" aria-describedby="${descriptionId}">
        <span><span class="channel-name">${jurisdictionMark(channel.country_or_region)}${sourceNameMarkup(channel.name)}</span><span class="legislature"${languageAttribute(contentLanguageTag(channel))}>${channel.legislature}</span></span>
        <span>${jurisdictionName(channel.country_or_region)}</span>
        <span class="language-list">${languageMarkup(channel.language)}</span>
        <span class="watch-action source-posture source-posture-${slug(status)}${external ? " row-link-placeholder" : ""}"${external ? ' aria-hidden="true"' : ""} lang="${state.locale}" title="${playbackModeDescription(status)}">${actionLabel} <span aria-hidden="true">${playable ? "→" : external ? "↗" : ""}</span></span>
      </button>
      ${external ? `<a class="row-direct-watch" href="${channel.official_url}" target="_blank" rel="noreferrer" aria-label="${t("official")}: ${escapeHtml(channel.name)}">${t("official")} <span aria-hidden="true">↗</span></a>` : ""}
      <span class="visually-hidden" id="${descriptionId}" lang="${state.locale}">${playbackModeDescription(status)}</span>
    </li>`;
  }).join("") : `<li><p class="detail-empty">${t("noResults")}</p></li>`;
  elements.list.querySelectorAll("[data-channel-id]").forEach((button) => button.addEventListener("click", () => {
    window.ParliamentStreamsViewer.open(button.dataset.channelId, { play: true, trigger: button });
  }));
}
function syncFilterDisclosure(mediaQuery) {
  if (elements.filterDisclosure?.isConnected) elements.filterDisclosure.open = !mediaQuery.matches;
}
function mountPage() {
  bindElements();
  state.locale = window.ParliamentStreamsPageLocale.current();
  renderDailyHero();
  syncFilterDisclosure(matchMedia("(max-width: 680px)"));
  window.ParliamentStreamsPageLocale.bind(setLocale);
  applyStaticTranslations();
  elements.stats.textContent = t("documented", { count: state.channels.length, date: state.generatedOn });
  setOptionLabel(elements.level, "allJur", optionValues("jurisdiction_level"));
  setOptionLabel(elements.format, "allTypes", optionValues("source_type"));
  renderResearchSummary();
  [elements.search, elements.level, elements.format].forEach((input) => input.addEventListener("input", renderList));
  elements.sortButtons.forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.sort;
    state.sort = key === state.sort.key
      ? { key, direction: state.sort.direction === "ascending" ? "descending" : "ascending" }
      : { key, direction: "ascending" };
    renderList();
  }));
  renderList();
  const parameters = new URLSearchParams(location.search);
  const requested = parameters.get("source");
  if (requested && requested !== window.ParliamentStreamsViewer.selectedId) window.ParliamentStreamsViewer.open(requested, { play: parameters.get("play") === "1" });
}
return (async () => {
  const catalogue = await window.ParliamentStreamsData.load("channels");
  if (pageSignal?.aborted) return;
  state.channels = catalogue.channels;
  state.generatedOn = catalogue.generated_on;
  mountPage();
  document.addEventListener("parliament:sourcechange", () => {
    elements.list.querySelectorAll("[data-channel-id]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.channelId === window.ParliamentStreamsViewer.selectedId)));
  }, pageSignal ? { signal: pageSignal } : {});
  matchMedia("(max-width: 680px)").addEventListener("change", syncFilterDisclosure, pageSignal ? { signal: pageSignal } : {});
})().catch(() => { if (!pageSignal?.aborted) elements.stats.textContent = t("sourceError"); });
});
