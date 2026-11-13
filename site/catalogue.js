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

const state = { channels: [], grouping: null, sortExplicit: false, generatedOn: "", locale: window.ParliamentStreamsPageLocale.current(), sort: { key: "source", direction: "ascending" } };
const elements = {};
const groupOpenState = new Map();
const { t, label, slug, jurisdictionName, jurisdictionMark, isPlaybackEnabled, playbackMode, playbackModeLabel, playbackModeDescription, formatDate, sourceNameMarkup, languageMarkup, contentLanguageTag, languageAttribute, escapeHtml } = window.ParliamentStreamsSourceUI.create(() => state.locale, () => state.channels);
function bindElements() { Object.assign(elements, {
  stats: document.querySelector("#catalogue-stats"),
  list: document.querySelector("#channel-list"),
  filterDisclosure: document.querySelector(".filter-disclosure"),
  groupReset: document.querySelector("#group-catalogue"),
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
  elements.groupReset.textContent = t("groupCatalogue");
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
  elements.sortStatus.textContent = state.grouping && !state.sortExplicit ? t("groupedCatalogue") : "";
  elements.sortHeaders.forEach((header) => {
    const active = (!state.grouping || state.sortExplicit) && header.dataset.sortHeader === state.sort.key;
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
function placementPath(records, id, parentField) {
  const path = [];
  while (id && Object.hasOwn(records, id) && !path.includes(id)) {
    path.unshift(id);
    id = records[id][parentField];
  }
  return path;
}
function groupPath(channel) {
  const grouping = state.grouping;
  const placement = grouping?.sources[channel.id]?.placement;
  if (!placement) return [];
  return [
    ...placementPath(grouping.jurisdictions, placement.jurisdiction_id, "parent_id")
      .map((id) => ({
        key: `jurisdiction:${id}`,
        label: jurisdictionName(grouping.jurisdictions[id].label),
        collapsedByDefault: grouping.jurisdictions[id].kind === "subnational",
      })),
    ...placementPath(grouping.institutions, placement.institution_id, "umbrella_id")
      .map((id) => ({ key: `institution:${id}`, label: grouping.institutions[id].label })),
    ...(placement.room_id ? [{ key: `room:${placement.room_id}`, label: grouping.rooms[placement.room_id].label }] : []),
  ];
}
function groupingSearchTerms(channel) {
  const grouping = state.grouping;
  const entry = grouping?.sources[channel.id];
  if (!entry) return countrySearchTerms(state.locale, channel);
  const jurisdictionIds = new Set();
  const institutions = new Set(entry.reviewed_institution_ids.flatMap(
    (id) => placementPath(grouping.institutions, id, "umbrella_id"),
  ));
  const matchedJurisdictions = [
    entry.placement?.jurisdiction_id,
    ...[...institutions].map((id) => grouping.institutions[id].jurisdiction_id),
  ];
  for (const id of matchedJurisdictions) {
    for (const ancestor of placementPath(grouping.jurisdictions, id, "parent_id")) {
      jurisdictionIds.add(ancestor);
      for (const associated of grouping.jurisdictions[ancestor].search_association_ids ?? []) {
        jurisdictionIds.add(associated);
      }
    }
  }
  return [
    ...[...jurisdictionIds].flatMap((id) => {
      const { label, region_code: code } = grouping.jurisdictions[id];
      return [label, jurisdictionName(label), ...(code ? ["en", state.locale].map((locale) =>
        new Intl.DisplayNames([locale], { type: "region" }).of(code)) : [])];
    }),
    ...[...institutions].flatMap((id) => {
      const { label, aliases } = grouping.institutions[id];
      return [label, ...aliases];
    }),
    entry.placement?.room_id ? grouping.rooms[entry.placement.room_id].label : "",
  ].join(" ");
}
function renderGroups(channels, revealMatches) {
  const root = { rows: [], groups: new Map(), count: 0 };
  for (const channel of channels) {
    let group = root;
    for (const node of groupPath(channel)) {
      const { key } = node;
      if (!group.groups.has(key)) group.groups.set(key, { ...node, rows: [], groups: new Map(), count: 0 });
      group = group.groups.get(key);
      group.count += 1;
    }
    group.rows.push(channel);
  }
  const collator = new Intl.Collator(state.locale, { numeric: true, sensitivity: "base" });
  function renderChildren(group, depth) {
    return [...group.groups.values()].sort((left, right) =>
      Number(left.key.startsWith("jurisdiction:")) - Number(right.key.startsWith("jurisdiction:"))
      || collator.compare(left.label, right.label)
    ).map((child) => {
      // The row already names its legislature when there is only one source.
      if (child.key.startsWith("institution:") && child.count === 1 && !child.groups.size) {
        return renderSource(child.rows[0]);
      }
      const headingLevel = Math.min(3 + depth, 6);
      const key = escapeHtml(child.key);
      const open = revealMatches || (groupOpenState.get(child.key) ?? !child.collapsedByDefault);
      return `<li class="catalogue-group" data-group="${key}">
        <details${open ? " open" : ""}>
          <summary class="catalogue-group-summary">
            <h${headingLevel} class="catalogue-group-heading">${escapeHtml(child.label)}</h${headingLevel}>
          </summary>
          <ul class="channel-list">${child.rows.map(renderSource).join("")}${renderChildren(child, depth + 1)}</ul>
        </details>
      </li>`;
    }).join("");
  }
  return renderChildren(root, 0) + root.rows.map(renderSource).join("");
}
function filteredSources() {
  const search = normalizeSearchText(elements.search.value.trim());
  const collator = new Intl.Collator(state.locale, { numeric: true, sensitivity: "base" });
  return state.channels.filter((channel) => {
    if (elements.level.value && channel.jurisdiction_level !== elements.level.value) return false;
    if (elements.format.value && channel.source_type !== elements.format.value) return false;
    if (!search) return true;
    const terms = [channel.name, channel.legislature, channel.country_or_region,
      jurisdictionName(channel.country_or_region), groupingSearchTerms(channel), channel.language];
    return normalizeSearchText(terms.join(" ")).includes(search);
  }).sort((left, right) => {
    const result = collator.compare(sortValue(left, state.sort.key), sortValue(right, state.sort.key));
    return state.sort.direction === "ascending" ? result : -result;
  });
}
function renderSource(channel) {
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
}
function renderList() {
  const channels = filteredSources();
  renderSortHeaders();
  elements.count.textContent = t("results", { shown: channels.length, total: state.channels.length });
  const grouped = state.grouping && !state.sortExplicit;
  elements.groupReset.hidden = !state.grouping || grouped;
  // Read the previous disclosure state before replacing the list. Search
  // temporarily opens matches and leaves the browse state intact.
  if (elements.list.dataset.searching === "false") {
    for (const details of elements.list.querySelectorAll(".catalogue-group > details")) {
      groupOpenState.set(details.parentElement.dataset.group, details.open);
    }
  }
  const searching = Boolean(elements.search.value.trim());
  elements.list.dataset.searching = String(searching);
  elements.list.innerHTML = channels.length
    ? grouped ? renderGroups(channels, searching) : channels.map(renderSource).join("")
    : `<li><p class="detail-empty">${t("noResults")}</p></li>`;
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
  elements.groupReset.addEventListener("click", () => {
    state.sort = { key: "source", direction: "ascending" };
    state.sortExplicit = false;
    renderList();
    document.querySelector("#catalogue-results").focus();
  });
  elements.sortButtons.forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.sort;
    state.sort = (!state.grouping || state.sortExplicit) && key === state.sort.key
      ? { key, direction: state.sort.direction === "ascending" ? "descending" : "ascending" }
      : { key, direction: "ascending" };
    state.sortExplicit = true;
    renderList();
  }));
  const parameters = new URLSearchParams(location.search);
  const requested = parameters.get("source");
  const linkedSource = state.channels.find((channel) => channel.id === requested);
  if (linkedSource) {
    for (const { key } of groupPath(linkedSource)) groupOpenState.set(key, true);
  }
  renderList();
  if (requested && requested !== window.ParliamentStreamsViewer.selectedId) window.ParliamentStreamsViewer.open(requested, { play: parameters.get("play") === "1" });
}
return (async () => {
  const data = window.ParliamentStreamsData;
  const [catalogue, grouping] = await Promise.all([
    data.load("channels"), data.optional("catalogue-grouping"),
  ]);
  if (pageSignal?.aborted) return;
  state.channels = catalogue.channels;
  if (grouping?.schema_version === 1 && grouping.sources && grouping.jurisdictions && grouping.institutions && grouping.rooms) {
    state.grouping = grouping;
  }
  state.generatedOn = catalogue.generated_on;
  mountPage();
  document.addEventListener("parliament:sourcechange", () => {
    elements.list.querySelectorAll("[data-channel-id]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.channelId === window.ParliamentStreamsViewer.selectedId)));
  }, pageSignal ? { signal: pageSignal } : {});
  matchMedia("(max-width: 680px)").addEventListener("change", syncFilterDisclosure, pageSignal ? { signal: pageSignal } : {});
})().catch(() => { if (!pageSignal?.aborted) elements.stats.textContent = t("sourceError"); });
});
