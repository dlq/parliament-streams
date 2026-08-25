(() => {
const { locales, localizedLabel, message, supportedLocale } = window.ParliamentStreamsI18n;
const { jurisdictionName: localizedJurisdictionName, message: mapMessage, sourceCount } = window.ParliamentStreamsMapI18n;
const { message: scheduleMessage } = window.ParliamentStreamsScheduleI18n;

const appScriptUrl = document.currentScript?.src ?? window.location.href;
const catalogueUrl = new URL("./data/channels.json", appScriptUrl);
const localCatalogueUrl = new URL("../data/channels.json", appScriptUrl);
const geometryUrl = new URL("./assets/maps/countries-110m.geojson", appScriptUrl);
const admin1GeometryUrl = new URL("./assets/maps/documented-admin1.geojson?v=20260824-us", appScriptUrl);
const supranationalUrl = new URL("./data/supranational.json", appScriptUrl);
const localSupranationalUrl = new URL("../data/supranational.json", appScriptUrl);

const subnationalParents = {
  Alberta: "CA", "British Columbia": "CA", Manitoba: "CA", "Newfoundland and Labrador": "CA",
  "Northwest Territories": "CA", Nunavut: "CA", Ontario: "CA", "Prince Edward Island": "CA",
  Quebec: "CA", Saskatchewan: "CA",
  "New South Wales": "AU", Queensland: "AU", Victoria: "AU", "Western Australia": "AU",
  "Baden-Wurttemberg": "DE", Bavaria: "DE", "North Rhine-Westphalia": "DE",
  Andalusia: "ES", Catalonia: "ES", Navarre: "ES", Valencia: "ES",
  "Northern Ireland": "GB", Scotland: "GB", Wales: "GB",
  Jalisco: "MX",
  California: "US", Florida: "US", Minnesota: "US", "New York": "US", Oregon: "US",
  "Rhode Island": "US", Texas: "US", Utah: "US", Washington: "US",
};

const fallbackCountryNames = {
  AU: "Australia", BR: "Brazil", CA: "Canada", CL: "Chile", CR: "Costa Rica", DE: "Germany",
  DK: "Denmark", EE: "Estonia", ES: "Spain", FR: "France", GB: "United Kingdom", GR: "Greece",
  IE: "Ireland", IL: "Israel", IN: "India", IT: "Italy", LU: "Luxembourg", MN: "Mongolia",
  MX: "Mexico", NL: "Netherlands", NO: "Norway", NZ: "New Zealand", PT: "Portugal", SK: "Slovakia",
  SV: "El Salvador", TH: "Thailand", TW: "Taiwan", US: "United States",
};

const query = new URLSearchParams(window.location.search);
const locale = supportedLocale(query.get("lang") ?? localStorage.getItem("parliament-streams-locale") ?? navigator.language);
const state = { channels: [], supranational: [], geometry: null, admin1Geometry: null, mode: "all", selectedCode: "CA", selectedRegion: null, selectedOrganizationId: "eu", selectedSupranationalCountry: null, search: "", locale, mapPath: null, zoom: null };
const elements = {
  map: document.querySelector("#world-map"),
  detail: document.querySelector("#map-detail"),
  list: document.querySelector("#jurisdiction-list"),
  visibleCount: document.querySelector("#jurisdiction-visible-count"),
  search: document.querySelector("#map-search"),
  legendDocumented: document.querySelector("#legend-documented-label"),
  legendSelected: document.querySelector("#legend-selected-label"),
  legendUndocumented: document.querySelector("#legend-undocumented-label"),
  workspace: document.querySelector(".map-workspace"),
  locale: document.querySelector("#locale-select"),
  modes: document.querySelectorAll("[data-mode]"),
};

function t(key, values) {
  return message(state.locale, key, values);
}

function mt(key, values) {
  return mapMessage(state.locale, key, values);
}

function formatNumber(value) {
  return new Intl.NumberFormat(state.locale).format(value);
}

function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat(state.locale, { dateStyle: "medium" }).format(date);
}

function levelLabel(level) {
  return level === "supranational" ? mt("international") : localizedLabel(state.locale, level);
}

function jurisdictionName(name) {
  return localizedJurisdictionName(state.locale, name);
}

function organizationName(organization) {
  if (organization.id === "eu") return countryName("EU");
  if (organization.id === "coe") return mt("orgCoe");
  if (organization.id === "osce") return mt("orgOsce");
  if (organization.id === "un") return mt("orgUn");
  return organization.name;
}

function relationshipLabel(organization, plural = false) {
  if (organization.id === "osce") return mt(plural ? "participatingStates" : "participatingState");
  return mt(plural ? "memberStates" : "memberState");
}

function applyStaticTranslations() {
  document.documentElement.lang = state.locale;
  document.title = `${mt("title")} · Parliament Streams`;
  document.querySelector('meta[name="description"]').setAttribute("content", mt("lede"));
  document.querySelector("#map-skip-link").textContent = mt("skip");
  document.querySelector("#map-brand-home").setAttribute("aria-label", t("brandHome"));
  document.querySelector("#map-primary-navigation").setAttribute("aria-label", t("primaryNavigation"));
  document.querySelector("#map-nav-catalogue").textContent = t("nav");
  document.querySelector("#map-nav-map").textContent = mt("title");
  document.querySelector("#map-nav-schedule").textContent = scheduleMessage(state.locale, "title");
  document.querySelector("#map-locale-label").textContent = t("language");
  document.querySelector("#map-section-label").textContent = mt("section");
  document.querySelector("#map-title").textContent = mt("title");
  document.querySelector("#map-lede").textContent = mt("lede");
  document.querySelector("#map-jurisdictions-metric").textContent = mt("jurisdictions");
  document.querySelector("#map-sources-metric").textContent = t("metricSources");
  document.querySelector("#map-playable-metric").textContent = t("metricPlayable");
  document.querySelector(".coverage-modes").setAttribute("aria-label", mt("coverageLevel"));
  const modeLabels = { all: mt("allCoverage"), national: localizedLabel(state.locale, "national"), subnational: localizedLabel(state.locale, "subnational"), supranational: mt("international") };
  elements.modes.forEach((button) => { button.textContent = modeLabels[button.dataset.mode]; });
  document.querySelector("#map-search-label").textContent = mt("find");
  elements.search.placeholder = mt("find");
  elements.workspace.setAttribute("aria-label", mt("mapLabel"));
  document.querySelector("#world-map-title").textContent = mt("mapLabel");
  document.querySelector("#world-map-description").textContent = mt("mapDescription");
  document.querySelector(".map-zoom").setAttribute("aria-label", mt("zoomControls"));
  document.querySelector("#zoom-in").setAttribute("aria-label", mt("zoomIn"));
  document.querySelector("#zoom-out").setAttribute("aria-label", mt("zoomOut"));
  document.querySelector("#zoom-reset").setAttribute("aria-label", mt("resetMap"));
  document.querySelector("#map-boundary-note").textContent = mt("boundary");
  document.querySelector("#jurisdiction-index-title").textContent = mt("jurisdictions");
  document.querySelector("#map-footer-copy").textContent = t("footer");
  document.querySelector("#map-data-link").textContent = mt("mapData");
}

function canonicalFeatureCode(feature) {
  return feature.properties.iso_a2 === "CN-TW" ? "TW" : feature.properties.iso_a2;
}

function nationalCode(channel) {
  if (channel.country_or_region === "Taiwan") return "TW";
  return channel.external_ids?.ipu_country_code ?? null;
}

function canPlay(channel) {
  return channel.playback_policy === "native_playback" || channel.playback_policy === "provider_embed";
}

function countryName(code) {
  try {
    return new Intl.DisplayNames([state.locale], { type: "region" }).of(code) ?? fallbackCountryNames[code] ?? code;
  } catch {
    return fallbackCountryNames[code] ?? code;
  }
}

function catalogueLink(channel) {
  const params = new URLSearchParams({ source: channel.id });
  if (state.locale !== "en") params.set("lang", state.locale);
  return `index.html?${params.toString()}#catalogue`;
}

function groupedJurisdictions() {
  const groups = new Map();
  for (const channel of state.channels) {
    const key = `${channel.jurisdiction_level}:${channel.country_or_region}`;
    if (!groups.has(key)) groups.set(key, { name: channel.country_or_region, level: channel.jurisdiction_level, channels: [] });
    groups.get(key).channels.push(channel);
  }
  return [...groups.values()];
}

function coverageCodes(mode = state.mode) {
  const codes = new Set();
  if (mode === "all" || mode === "national") {
    state.channels.filter((channel) => channel.jurisdiction_level === "national").forEach((channel) => {
      const code = nationalCode(channel);
      if (code) codes.add(code);
    });
  }
  if (mode === "all" || mode === "subnational") {
    state.channels.filter((channel) => channel.jurisdiction_level === "subnational").forEach((channel) => {
      const code = subnationalParents[channel.country_or_region];
      if (code) codes.add(code);
    });
  }
  return codes;
}

function selectedOrganization() {
  return state.supranational.find((organization) => organization.id === state.selectedOrganizationId) ?? state.supranational[0];
}

function organizationChannels(organization) {
  return state.channels.filter((channel) => channel.jurisdiction_level === "supranational" && channel.country_or_region === organization.catalogue_jurisdiction);
}

function allCatalogueCoverageCodes() {
  return new Set([...coverageCodes("national"), ...coverageCodes("subnational")]);
}

function renderLegend() {
  elements.workspace.classList.toggle("is-supranational", state.mode === "supranational");
  if (state.mode === "supranational") {
    elements.legendDocumented.textContent = mt("memberCovered");
    elements.legendSelected.textContent = mt("selectedMember");
    elements.legendUndocumented.textContent = mt("memberUndocumented");
    return;
  }
  elements.legendDocumented.textContent = mt("documented");
  elements.legendSelected.textContent = mt("selected");
  elements.legendUndocumented.textContent = mt("notDocumented");
}

function channelsForCountry(code, level) {
  return state.channels.filter((channel) => {
    if (level === "national") return channel.jurisdiction_level === "national" && nationalCode(channel) === code;
    return channel.jurisdiction_level === "subnational" && subnationalParents[channel.country_or_region] === code;
  });
}

function channelsForRegion(name) {
  return state.channels.filter((channel) => channel.jurisdiction_level === "subnational" && channel.country_or_region === name);
}

function sourcePosture(channel) {
  if (canPlay(channel)) return [t("sourcePlayable"), "is-playable"];
  if (channel.playback_policy === "link_out") return [t("sourceLinkOut"), ""];
  return [t("sourceResearch"), ""];
}

function renderSourceList(channels) {
  return `<ul class="map-source-list">${channels.map((channel) => {
    const [posture, className] = sourcePosture(channel);
    return `<li><a href="${catalogueLink(channel)}"><span>${escapeHtml(channel.name)}</span><span class="map-source-posture ${className}">${posture} →</span></a></li>`;
  }).join("")}</ul>`;
}

function renderDetail() {
  if (state.mode === "supranational") {
    const organization = selectedOrganization();
    const members = new Set(organization.member_country_codes);
    const covered = allCatalogueCoverageCodes();
    const documentedMembers = organization.member_country_codes.filter((code) => covered.has(code));
    const channels = organizationChannels(organization);
    if (state.selectedSupranationalCountry && members.has(state.selectedSupranationalCountry)) {
      const code = state.selectedSupranationalCountry;
      const national = channelsForCountry(code, "national");
      const subnational = channelsForCountry(code, "subnational");
      const countryChannels = [...national, ...subnational];
      elements.detail.innerHTML = `<p class="map-detail-summary">${escapeHtml(organization.short_name)} · ${escapeHtml(relationshipLabel(organization))}</p>
        <h2>${escapeHtml(countryName(code))}</h2>
        <p class="map-detail-summary">${countryChannels.length ? sourceCount(state.locale, countryChannels.length) : mt("noParliamentary")}</p>
        ${countryChannels.length ? `<h3>${escapeHtml(t("catalogueCoverage"))}</h3>${renderSourceList(countryChannels)}` : `<p class="map-detail-empty">${escapeHtml(mt("researchOpportunity"))}</p>`}
        <button class="map-parent-button" type="button" data-organization-back>← ${escapeHtml(mt("backOverview", { name: organization.short_name }))}</button>`;
      elements.detail.querySelector("[data-organization-back]").addEventListener("click", () => {
        state.selectedSupranationalCountry = null;
        renderMap();
        renderDetail();
      });
      return;
    }
    elements.detail.innerHTML = `<div class="supranational-heading"><img src="${organization.flag}" alt=""><div><p class="map-detail-summary">${escapeHtml(mt("internationalCoverage"))}</p><h2>${escapeHtml(organizationName(organization))}</h2></div></div>
      <p class="map-detail-summary">${escapeHtml(mt("membershipContext"))}</p>
      <div class="supranational-metric"><div><strong>${formatNumber(organization.member_country_codes.length)}</strong><span>${escapeHtml(relationshipLabel(organization, true))}</span></div><div><strong>${formatNumber(documentedMembers.length)}</strong><span>${escapeHtml(mt("withCoverage"))}</span></div></div>
      <h3>${escapeHtml(mt("institutionalSources"))}</h3>
      ${channels.length ? renderSourceList(channels) : `<p class="map-detail-summary">${escapeHtml(mt("noInstitutional"))}</p>`}
      <p class="membership-evidence">${escapeHtml(mt("membershipChecked", { date: formatDate(organization.checked_on) }))} · <a href="${organization.source_url}" target="_blank" rel="noreferrer">${escapeHtml(mt("officialMembership"))} ↗</a></p>`;
    return;
  }

  if (state.selectedRegion && (state.mode === "all" || state.mode === "subnational")) {
    const regionalChannels = channelsForRegion(state.selectedRegion);
    const parentCode = subnationalParents[state.selectedRegion];
    elements.detail.innerHTML = `<p class="map-detail-summary">${escapeHtml(countryName(parentCode))} · ${escapeHtml(levelLabel("subnational"))}</p>
      <h2>${escapeHtml(jurisdictionName(state.selectedRegion))}</h2>
      <p class="map-detail-summary">${escapeHtml(sourceCount(state.locale, regionalChannels.length))}</p>
      <h3>${escapeHtml(mt("parliamentarySources"))}</h3>
      ${renderSourceList(regionalChannels)}
      <button class="map-parent-button" type="button" data-parent-code="${parentCode}">${escapeHtml(mt("viewAll", { name: countryName(parentCode) }))} →</button>`;
    elements.detail.querySelector("[data-parent-code]").addEventListener("click", () => {
      state.selectedRegion = null;
      render();
    });
    return;
  }

  const national = channelsForCountry(state.selectedCode, "national");
  const subnational = channelsForCountry(state.selectedCode, "subnational");
  if (!national.length && !subnational.length) {
    elements.detail.innerHTML = `<h2>${escapeHtml(mt("coverageDetails"))}</h2><p class="map-detail-empty">${escapeHtml(mt("selectDocumented"))}</p>`;
    return;
  }

  const regions = [...new Map(subnational.map((channel) => [channel.country_or_region, []])).entries()];
  for (const [name, channels] of regions) channels.push(...subnational.filter((channel) => channel.country_or_region === name));
  const totalSources = national.length + subnational.length;
  elements.detail.innerHTML = `<h2>${escapeHtml(countryName(state.selectedCode))}</h2>
    <p class="map-detail-summary">${escapeHtml(sourceCount(state.locale, totalSources))}</p>
    ${national.length ? `<h3>${escapeHtml(mt("nationalSources"))}</h3>${renderSourceList(national)}` : `<h3>${escapeHtml(mt("nationalSources"))}</h3><p class="map-detail-summary">${escapeHtml(mt("noNational"))}</p>`}
    ${regions.length ? `<h3>${escapeHtml(mt("subnationalCoverage"))}</h3><ul class="map-region-list">${regions.sort(([a], [b]) => jurisdictionName(a).localeCompare(jurisdictionName(b), state.locale)).map(([name, channels]) => `<li><a href="${catalogueLink(channels[0])}"><span>${escapeHtml(jurisdictionName(name))}</span><small>${escapeHtml(sourceCount(state.locale, channels.length))} →</small></a></li>`).join("")}</ul>` : ""}
    <a class="text-link" href="index.html#catalogue">${escapeHtml(mt("browseComplete"))} →</a>`;
}

function modeIncludes(group) {
  return state.mode === "all" || group.level === state.mode;
}

function visibleJurisdictions() {
  const needle = state.search.trim().toLocaleLowerCase();
  return groupedJurisdictions()
    .filter(modeIncludes)
    .filter((group) => {
      const organization = group.level === "supranational" ? state.supranational.find((candidate) => candidate.catalogue_jurisdiction === group.name) : null;
      const displayName = organization ? organizationName(organization) : group.level === "national" ? countryName(nationalCode(group.channels[0])) : jurisdictionName(group.name);
      return !needle || `${displayName} ${group.name} ${group.channels.map((channel) => `${channel.name} ${channel.legislature}`).join(" ")}`.toLocaleLowerCase().includes(needle);
    })
    .sort((a, b) => jurisdictionName(a.name).localeCompare(jurisdictionName(b.name), state.locale));
}

function selectJurisdiction(group) {
  state.selectedRegion = null;
  if (group.level === "national") state.selectedCode = nationalCode(group.channels[0]);
  if (group.level === "subnational") {
    state.selectedCode = subnationalParents[group.name];
    state.selectedRegion = group.name;
  }
  if (group.level === "supranational") {
    state.mode = "supranational";
    const organization = state.supranational.find((candidate) => candidate.catalogue_jurisdiction === group.name);
    if (organization) state.selectedOrganizationId = organization.id;
    state.selectedSupranationalCountry = null;
  }
  render();
  focusSelectedArea();
  document.querySelector("#map-detail").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderJurisdictionList() {
  const groups = visibleJurisdictions();
  elements.visibleCount.textContent = `${formatNumber(groups.length)} / ${formatNumber(groupedJurisdictions().length)}`;
  elements.list.innerHTML = groups.map((group) => {
    const selected = groupIsSelected(group);
    const organization = group.level === "supranational" ? state.supranational.find((candidate) => candidate.catalogue_jurisdiction === group.name) : null;
    const displayName = organization ? organizationName(organization) : group.level === "national" ? countryName(nationalCode(group.channels[0])) : jurisdictionName(group.name);
    return `<li><button type="button" data-jurisdiction="${escapeHtml(group.level)}:${escapeHtml(group.name)}" class="${selected ? "is-selected" : ""}" aria-pressed="${selected}"><strong>${escapeHtml(displayName)}</strong><small>${escapeHtml(levelLabel(group.level))} · ${escapeHtml(sourceCount(state.locale, group.channels.length))}</small></button></li>`;
  }).join("");
  elements.list.querySelectorAll("[data-jurisdiction]").forEach((button) => button.addEventListener("click", () => {
    const group = groups.find((candidate) => `${candidate.level}:${candidate.name}` === button.dataset.jurisdiction);
    if (group) selectJurisdiction(group);
  }));
}

function groupIsSelected(group) {
  if (group.level === "national") {
    return !state.selectedRegion && nationalCode(group.channels[0]) === state.selectedCode;
  }
  if (group.level === "subnational") return group.name === state.selectedRegion;
  const organization = selectedOrganization();
  return state.mode === "supranational" && organization?.catalogue_jurisdiction === group.name;
}

function renderMap() {
  const width = Math.max(elements.map.clientWidth, 320);
  const height = width < 680 ? 330 : 520;
  const projection = d3.geoNaturalEarth1().fitExtent([[10, 14], [width - 10, height - 14]], state.geometry);
  const path = d3.geoPath(projection);
  state.mapPath = path;
  const covered = coverageCodes();
  const organization = state.mode === "supranational" ? selectedOrganization() : null;
  const members = new Set(organization?.member_country_codes ?? []);
  const allCovered = allCatalogueCoverageCodes();
  const svg = d3.select(elements.map).attr("viewBox", `0 0 ${width} ${height}`);
  let viewport = svg.select("g.map-viewport");
  if (viewport.empty()) viewport = svg.append("g").attr("class", "map-viewport");
  let layer = viewport.select("g.map-countries");
  if (layer.empty()) layer = viewport.append("g").attr("class", "map-countries");
  const countries = layer.selectAll("path").data(state.geometry.features, (feature) => canonicalFeatureCode(feature));
  countries.join("path")
    .attr("class", (feature) => {
      const code = canonicalFeatureCode(feature);
      const subnationalContext = state.mode === "subnational" && covered.has(code);
      const isMember = state.mode === "supranational" && members.has(code);
      const isDocumentedMember = isMember && allCovered.has(code);
      const isSelectedMember = isMember && code === state.selectedSupranationalCountry;
      return ["map-country", state.mode !== "supranational" && covered.has(code) && "is-documented", subnationalContext && "is-context", state.mode !== "supranational" && code === state.selectedCode && covered.has(code) && !state.selectedRegion && "is-selected", state.mode === "supranational" && !isMember && "is-muted", isMember && "is-member", isDocumentedMember && "is-documented", isSelectedMember && "is-selected"].filter(Boolean).join(" ");
    })
    .attr("d", path)
    .attr("role", (feature) => (state.mode === "supranational" ? members : covered).has(canonicalFeatureCode(feature)) ? "button" : null)
    .attr("tabindex", (feature) => (state.mode === "supranational" ? members : covered).has(canonicalFeatureCode(feature)) ? 0 : null)
    .attr("aria-label", (feature) => {
      const code = canonicalFeatureCode(feature);
      if (state.mode === "supranational" && members.has(code)) return `${countryName(code)}, ${relationshipLabel(organization)}`;
      return covered.has(code) ? `${countryName(code)}, ${mt("documented")}` : null;
    })
    .on("click", (_, feature) => selectCountry(feature, state.mode === "supranational" ? members : covered))
    .on("keydown", (event, feature) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCountry(feature, state.mode === "supranational" ? members : covered);
      }
    });

  let regionLayer = viewport.select("g.map-regions");
  if (regionLayer.empty()) regionLayer = viewport.append("g").attr("class", "map-regions");
  const showRegions = state.mode === "all" || state.mode === "subnational";
  const regions = regionLayer.selectAll("path").data(showRegions ? state.admin1Geometry.features : [], (feature) => feature.properties.name);
  regions.exit().remove();
  regions.enter().append("path").merge(regions)
    .attr("class", (feature) => [
      "map-region",
      state.mode === "all" && !state.selectedRegion && feature.properties.parent_code === state.selectedCode && "is-parent-selected",
      feature.properties.name === state.selectedRegion && "is-selected",
    ].filter(Boolean).join(" "))
    .attr("d", path)
    .attr("role", "button")
    .attr("tabindex", 0)
    .attr("aria-label", (feature) => `${jurisdictionName(feature.properties.name)}, ${mt("documented")}, ${levelLabel("subnational")}`)
    .on("click", (_, feature) => selectRegion(feature))
    .on("keydown", (event, feature) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectRegion(feature); }
    });
}

function selectCountry(feature, covered) {
  const code = canonicalFeatureCode(feature);
  if (!covered.has(code)) return;
  if (state.mode === "supranational") {
    state.selectedSupranationalCountry = code;
    renderMap();
    renderDetail();
    renderJurisdictionList();
    return;
  }
  state.selectedCode = code;
  state.selectedRegion = null;
  renderMap();
  renderDetail();
  renderJurisdictionList();
  if (state.mode === "subnational") zoomToFeature(feature, 5);
}

function selectRegion(feature) {
  state.selectedCode = feature.properties.parent_code;
  state.selectedRegion = feature.properties.name;
  renderMap();
  renderDetail();
  renderJurisdictionList();
  zoomToFeature(feature, 8);
}

function zoomToFeature(feature, maximumScale) {
  if (!state.zoom || !state.mapPath) return;
  const [[x0, y0], [x1, y1]] = state.mapPath.bounds(feature);
  const width = Math.max(elements.map.clientWidth, 320);
  const height = width < 680 ? 330 : 520;
  const scale = Math.min(maximumScale, .82 / Math.max((x1 - x0) / width, (y1 - y0) / height));
  const x = width / 2 - scale * (x0 + x1) / 2;
  const y = height / 2 - scale * (y0 + y1) / 2;
  d3.select(elements.map).transition().duration(260).call(state.zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
}

function focusSelectedArea() {
  if (state.selectedRegion) {
    const region = state.admin1Geometry.features.find((feature) => feature.properties.name === state.selectedRegion);
    if (region) zoomToFeature(region, 8);
    return;
  }
  if (state.mode === "subnational") {
    const country = state.geometry.features.find((feature) => canonicalFeatureCode(feature) === state.selectedCode);
    if (country) zoomToFeature(country, 5);
  }
}

function resetMapView() {
  if (state.zoom) d3.select(elements.map).transition().duration(220).call(state.zoom.transform, d3.zoomIdentity);
}

function render() {
  elements.modes.forEach((button) => {
    const active = button.dataset.mode === state.mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderLegend();
  const covered = coverageCodes();
  if (covered.size && !covered.has(state.selectedCode)) {
    state.selectedCode = covered.has("CA") ? "CA" : [...covered].sort()[0];
    state.selectedRegion = null;
  }
  renderMap();
  renderDetail();
  renderJurisdictionList();
}

function setupZoom() {
  const svg = d3.select(elements.map);
  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", (event) => svg.select("g.map-viewport").attr("transform", event.transform));
  state.zoom = zoom;
  svg.call(zoom);
  document.querySelector("#zoom-in").addEventListener("click", () => svg.transition().call(zoom.scaleBy, 1.5));
  document.querySelector("#zoom-out").addEventListener("click", () => svg.transition().call(zoom.scaleBy, 1 / 1.5));
  document.querySelector("#zoom-reset").addEventListener("click", () => svg.transition().call(zoom.transform, d3.zoomIdentity));
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

async function init() {
  applyStaticTranslations();
  elements.locale.innerHTML = locales.map(([code, name]) => `<option value="${code}" lang="${code}">${name}</option>`).join("");
  elements.locale.value = state.locale;
  elements.locale.addEventListener("change", () => {
    localStorage.setItem("parliament-streams-locale", elements.locale.value);
    const params = new URLSearchParams(window.location.search);
    params.set("lang", elements.locale.value);
    window.location.search = params.toString();
  });

  let catalogue = window.PARLIAMENT_STREAMS_CATALOGUE;
  let supranational = window.PARLIAMENT_STREAMS_SUPRANATIONAL;
  if (window.location.protocol !== "file:") {
    let response = await fetch(catalogueUrl, { cache: "no-store" });
    if (!response.ok) response = await fetch(localCatalogueUrl, { cache: "no-store" });
    if (response.ok) catalogue = await response.json();
    let supranationalResponse = await fetch(supranationalUrl, { cache: "no-store" });
    if (!supranationalResponse.ok) supranationalResponse = await fetch(localSupranationalUrl, { cache: "no-store" });
    if (supranationalResponse.ok) supranational = await supranationalResponse.json();
  }
  if (!catalogue || !supranational) throw new Error(mt("mapUnavailable"));
  state.channels = catalogue.channels;
  state.supranational = supranational.organizations;
  [state.geometry, state.admin1Geometry] = await Promise.all([d3.json(geometryUrl), d3.json(admin1GeometryUrl)]);

  document.querySelector("#jurisdiction-count").textContent = formatNumber(groupedJurisdictions().length);
  document.querySelector("#source-count").textContent = formatNumber(state.channels.length);
  document.querySelector("#playable-count").textContent = formatNumber(state.channels.filter(canPlay).length);

  elements.modes.forEach((button) => button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    state.selectedRegion = null;
    state.selectedSupranationalCountry = null;
    state.search = "";
    elements.search.value = "";
    render();
    if (state.mode !== "subnational") resetMapView();
  }));
  elements.search.addEventListener("input", () => { state.search = elements.search.value; renderJurisdictionList(); });
  elements.search.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const first = visibleJurisdictions()[0];
    if (first) selectJurisdiction(first);
  });
  setupZoom();
  render();
  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(renderMap, 100);
  });
}

init().catch((error) => {
  elements.detail.innerHTML = `<h2>${escapeHtml(mt("mapUnavailable"))}</h2><p class="map-detail-empty">${escapeHtml(error.message)}</p>`;
});
})();
