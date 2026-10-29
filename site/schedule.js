(() => {
  const pageSignal = window.ParliamentStreamsNavigation?.signal;
const { locales, message, readLocalePreference, supportedLocale, writeLocalePreference } = window.ParliamentStreamsI18n;
const { jurisdictionName: localizedJurisdictionName, message: mapMessage, sourceCount } = window.ParliamentStreamsMapI18n;
const { message: scheduleMessage } = window.ParliamentStreamsScheduleI18n;

const query = new URLSearchParams(window.location.search);
const locale = supportedLocale(query.get("lang") ?? readLocalePreference() ?? navigator.language);
const state = { channels: [], schedules: {}, sources: {}, quality: {}, hasSnapshot: false, generatedAt: null, locale, jurisdiction: query.get("jurisdiction") ?? "", listingFilter: query.get("listings") ?? "" };

const flagAssets = window.ParliamentStreamsFlags;

const elements = {
  jurisdiction: document.querySelector("#schedule-jurisdiction"),
  listingFilter: document.querySelector("#schedule-status"),
  list: document.querySelector("#schedule-list"),
  results: document.querySelector("#schedule-results"),
  empty: document.querySelector("#schedule-empty"),
  updated: document.querySelector("#schedule-updated"),
  locale: document.querySelector("#locale-select"),
  coverage: document.querySelector("#schedule-coverage"),
  clear: document.querySelector("#schedule-clear"),
};

function t(key, values) { return message(state.locale, key, values); }
function mt(key, values) { return mapMessage(state.locale, key, values); }
function st(key, values) { return scheduleMessage(state.locale, key, values); }
function setText(id, value) { document.querySelector(`#${id}`).textContent = value; }
function escapeHtml(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }

function isPlaybackEnabled(channel) {
  return ["native_playback", "provider_embed"].includes(channel.playback_policy);
}

function jurisdictionName(channel) {
  if (channel.jurisdiction_level === "subnational") return localizedJurisdictionName(state.locale, channel.country_or_region);
  const code = channel.country_or_region === "Taiwan" ? "TW" : channel.external_ids?.ipu_country_code;
  if (code) {
    try { return new Intl.DisplayNames([state.locale], { type: "region" }).of(code) ?? channel.country_or_region; } catch { /* use recorded name */ }
  }
  if (channel.country_or_region === "European Union") {
    try { return new Intl.DisplayNames([state.locale], { type: "region" }).of("EU") ?? channel.country_or_region; } catch { /* use recorded name */ }
  }
  return localizedJurisdictionName(state.locale, channel.country_or_region);
}

function isUnavailableTitle(title) {
  return !title || /^(no |none\b|not available|unavailable)/i.test(title) || /no .* (listed|live|available)/i.test(title);
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

function hasCurrent(schedule) { return !isUnavailableTitle(schedule.current_event_title); }
function hasNext(schedule) { return !isUnavailableTitle(schedule.next_event_title); }
function isScheduleMarkedLive(schedule) {
  return /\b(in progress|live)\b/i.test(schedule.current_event_status ?? "")
    || /\b(live now|ao vivo)\b/i.test(schedule.current_event_title ?? "")
    || /\b(live now|en direct|ao vivo)\b/i.test(schedule.current_event_time ?? "");
}

function detailsUrl(channel, play = false) {
  const params = new URLSearchParams({ source: channel.id });
  if (play) params.set("play", "1");
  if (state.locale !== "en") params.set("lang", state.locale);
  return `index.html?${params.toString()}#catalogue`;
}

function officialLink(channel) {
  if (channel.playback_policy !== "link_out" || !/^https?:\/\//i.test(channel.official_url ?? "")) return "";
  return `<a class="schedule-official" href="${escapeHtml(channel.official_url)}" target="_blank" rel="noreferrer">${escapeHtml(t("official"))} ↗</a>`;
}

function eventMarkup(schedule, position) {
  const current = position === "current";
  const title = schedule[`${position}_event_title`];
  const available = current ? hasCurrent(schedule) : hasNext(schedule);
  if (!available) return `<span class="programme-unavailable">${escapeHtml(st(current ? "noCurrent" : "noNext"))}</span>`;
  const time = localEventTime(
    schedule[`${position}_event_start`],
    schedule[`${position}_event_time`],
  );
  const location = schedule[`${position}_event_location`];
  const language = schedule[`${position}_event_language`];
  const metadata = location ? `<bdi dir="auto">${escapeHtml(location)}</bdi>` : "";
  const languageAttribute = language ? ` lang="${escapeHtml(language)}"` : "";
  return `${current && isScheduleMarkedLive(schedule) ? `<span class="programme-live">${escapeHtml(st("now"))}</span>` : ""}
    ${time ? `<span class="programme-time"><bdi dir="ltr">${escapeHtml(time)}</bdi></span>` : ""}
    <strong class="programme-title"${languageAttribute}><bdi dir="auto">${escapeHtml(title)}</bdi></strong>
    ${metadata ? `<span class="programme-meta">${metadata}</span>` : ""}`;
}

function visibleRows(applyListingFilter = true) {
  return Object.entries(state.schedules)
    .map(([id, schedule]) => ({ channel: state.channels.find((item) => item.id === id), schedule }))
    .filter(({ channel }) => channel)
    .filter(({ channel }) => !state.jurisdiction || channel.country_or_region === state.jurisdiction)
    .filter(({ channel, schedule }) => {
      if (!applyListingFilter) return true;
      if (state.listingFilter === "current") return hasCurrent(schedule);
      if (state.listingFilter === "next") return hasNext(schedule);
      if (state.listingFilter === "playable") return isPlaybackEnabled(channel);
      return true;
    })
    .sort((left, right) => {
      const liveDifference = Number(isScheduleMarkedLive(right.schedule)) - Number(isScheduleMarkedLive(left.schedule));
      if (liveDifference) return liveDifference;
      return jurisdictionName(left.channel).localeCompare(jurisdictionName(right.channel), state.locale)
        || left.channel.name.localeCompare(right.channel.name, state.locale);
    });
}

function render() {
  const rows = visibleRows();
  elements.results.textContent = st("results", { count: new Intl.NumberFormat(state.locale).format(rows.length) });
  elements.empty.hidden = rows.length !== 0;
  document.querySelector(".schedule-table-wrap").hidden = rows.length === 0;
  elements.clear.hidden = !state.jurisdiction && !state.listingFilter;
  renderCoverage(rows, visibleRows(false));
  elements.list.innerHTML = rows.map(({ channel, schedule }) => {
    const flag = flagAssets[channel.country_or_region];
    const quality = state.quality[channel.id];
    const kind = quality?.state === "mapping_unverified" ? "eventListings" : quality?.state === "quality_hold" ? "notInGuide" : null;
    const retainedAt = schedule.last_success_at ?? schedule.fetched_at;
    const retained = schedule.stale && retainedAt
      ? st("retained", { date: new Date(retainedAt).toLocaleString(state.locale) }) : "";
    return `<tr>
      <td><div class="schedule-channel${flag ? "" : " schedule-channel--no-flag"}">${flag ? `<img class="schedule-flag" src="${flag}" alt="">` : ""}<div><strong>${escapeHtml(channel.name)}</strong><span>${escapeHtml(jurisdictionName(channel))} · ${escapeHtml(channel.legislature)}</span>${kind ? `<span class="schedule-kind">${escapeHtml(st(kind))}</span>` : ""}${retained ? `<span class="schedule-channel-stale">${escapeHtml(retained)}</span>` : ""}</div></div></td>
      <td data-label="${escapeHtml(st("now"))}">${eventMarkup(schedule, "current")}</td>
      <td data-label="${escapeHtml(st("next"))}">${eventMarkup(schedule, "next")}</td>
      <td><div class="schedule-actions">${isPlaybackEnabled(channel) ? `<a class="schedule-watch" data-viewer-source="${channel.id}" data-viewer-play="true" href="${detailsUrl(channel, true)}">${escapeHtml(t("watch"))}</a>` : officialLink(channel)}<a class="schedule-details" data-viewer-source="${channel.id}" href="${detailsUrl(channel)}">${escapeHtml(t("sourceDetails"))} →</a></div></td>
    </tr>`;
  }).join("");
  renderUnparsedScheduleLinks();
}

function renderCoverage(rows, unfilteredRows) {
  const channels = state.channels.filter((channel) => !state.jurisdiction || channel.country_or_region === state.jurisdiction);
  const parsers = [...new Set(channels.flatMap((channel) => channel.epg_sources
    .filter((source) => source.scraper_status === "implemented").map((source) => source.scraper)))];
  const statuses = parsers.map((id) => state.sources[id]?.status);
  let key = "summary";
  if (!state.hasSnapshot) key = "dataUnavailable";
  else if (!unfilteredRows.length) {
    if (!parsers.length) key = "noParser";
    else if (statuses.includes("error")) key = "collectionError";
    else if (statuses.length && statuses.every((status) => status === "empty")) key = "emptyWindow";
    else key = "coverageUnknown";
  }
  elements.coverage.textContent = st(key);
  // A coverage gap is not a filter mismatch. Keep the specific explanation
  // beside the filters, without a second contradictory empty-table message.
  elements.empty.hidden = rows.length !== 0 || key !== "summary";
}

function unparsedScheduleSources(channel) {
  return channel.epg_sources.filter((source) => source.method === "GET"
    && source.scraper_status === "planned" && !/api|json|zip/i.test(source.kind)
    && /^https?:\/\//i.test(source.url));
}

function renderUnparsedScheduleLinks() {
  // Calendars and dated-event indexes remain useful before an automated guide
  // parser exists. Keep these links separate from programme/now-next rows.
  const links = new Map();
  for (const channel of state.channels) {
    if (state.jurisdiction && channel.country_or_region !== state.jurisdiction) continue;
    const missing = !state.hasSnapshot || !Object.hasOwn(state.schedules, channel.id);
    const sources = missing && state.jurisdiction
      ? channel.epg_sources.filter((source) => source.method === "GET" && !/api|json|zip/i.test(source.kind) && /^https?:\/\//i.test(source.url))
      : unparsedScheduleSources(channel);
    for (const source of sources) {
      if (!links.has(source.url)) links.set(source.url, { channel, url: source.url });
    }
    if (missing && state.jurisdiction && !sources.length && /^https?:\/\//i.test(channel.official_url ?? "")) {
      if (!links.has(channel.official_url)) links.set(channel.official_url, { channel, url: channel.official_url });
    }
  }
  const entries = [...links.values()].sort((a, b) => jurisdictionName(a.channel).localeCompare(jurisdictionName(b.channel), state.locale)
    || a.channel.name.localeCompare(b.channel.name, state.locale));
  const disclosure = document.querySelector("#official-schedules");
  disclosure.hidden = !entries.length;
  if (disclosure.dataset.selection !== state.jurisdiction) {
    disclosure.open = Boolean(state.jurisdiction && !visibleRows(false).length && entries.length);
    disclosure.dataset.selection = state.jurisdiction;
  }
  setText("official-schedules-label", `${t("calendarAgenda")} · ${sourceCount(state.locale, entries.length)}`);
  document.querySelector("#official-schedules-list").innerHTML = entries.map(({ channel, url }) =>
    `<li><a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(channel.name)} ↗</a> · <a href="${detailsUrl(channel)}">${escapeHtml(t("catalogue"))} →</a></li>`
  ).join("");
}

function renderFilters() {
  const jurisdictions = [...new Set(state.channels
    .filter((channel) => Object.hasOwn(state.schedules, channel.id) || channel.epg_sources.length)
    .map((channel) => channel.country_or_region))]
    .sort((a, b) => localizedJurisdictionName(state.locale, a).localeCompare(localizedJurisdictionName(state.locale, b), state.locale));
  elements.jurisdiction.innerHTML = `<option value="">${escapeHtml(t("allJur"))}</option>${jurisdictions.map((name) => {
    const channel = state.channels.find((item) => item.country_or_region === name);
    return `<option value="${escapeHtml(name)}">${escapeHtml(jurisdictionName(channel))}</option>`;
  }).join("")}`;
  if (!jurisdictions.includes(state.jurisdiction)) state.jurisdiction = "";
  elements.jurisdiction.value = state.jurisdiction;
  elements.listingFilter.innerHTML = `<option value="">${escapeHtml(st("allChannels"))}</option><option value="current">${escapeHtml(st("current"))}</option><option value="next">${escapeHtml(st("upcoming"))}</option><option value="playable">${escapeHtml(t("metricPlayable"))}</option>`;
}

function applyTranslations() {
  document.documentElement.lang = state.locale;
  window.ParliamentStreamsSeo.update(`${st("title")} · Parliament Streams`, st("lede"), state.locale);
  setText("schedule-skip-link", st("skip"));
  document.querySelector("#schedule-brand-home").setAttribute("aria-label", t("brandHome"));
  document.querySelector("#schedule-primary-navigation").setAttribute("aria-label", t("primaryNavigation"));
  setText("schedule-nav-catalogue", t("nav"));
  setText("schedule-nav-map", mt("title"));
  setText("schedule-nav-schedule", st("title"));
  setText("schedule-locale-label", t("language"));
  setText("schedule-title", st("title"));
  setText("schedule-lede", st("lede"));
  setText("schedule-time-note", st("timeNote"));
  setText("guide-title", st("guide"));
  document.querySelector("#schedule-data-link").firstChild.textContent = `${st("data")} `;
  setText("schedule-jurisdiction-label", t("jurisdiction"));
  setText("schedule-status-label", st("guide"));
  document.querySelector(".schedule-filters").setAttribute("aria-label", st("filters"));
  setText("schedule-channel-heading", st("channel"));
  setText("schedule-now-heading", st("now"));
  setText("schedule-next-heading", st("next"));
  setText("schedule-actions-heading", st("actions"));
  setText("schedule-empty", st("noResults"));
  elements.clear.textContent = st("clearFilters");
  setText("schedule-footer-copy", t("footer"));
  setText("schedule-data-footer-link", st("data"));
}

function renderFreshness() {
  if (!state.generatedAt) { elements.updated.textContent = `${st("guide")} · ${t("notAvailable")}`; elements.updated.classList.add("is-stale"); return; }
  const date = new Date(state.generatedAt);
  elements.updated.textContent = st("updated", { date: new Intl.DateTimeFormat(state.locale, { dateStyle: "medium", timeStyle: "short" }).format(date) });
  elements.updated.classList.toggle("is-stale", Date.now() - date.valueOf() > 12 * 60 * 60 * 1000);
  if (elements.updated.classList.contains("is-stale")) elements.updated.textContent += ` · ${st("stale")}`;
}

function updateFilterUrl() {
  const url = new URL(window.location.href);
  for (const [key, value] of [["jurisdiction", state.jurisdiction], ["listings", state.listingFilter]]) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  history.replaceState({}, "", url);
}

async function init() {
  applyTranslations();
  elements.locale.innerHTML = locales.map(([code, name]) => `<option value="${code}" lang="${code}">${name}</option>`).join("");
  elements.locale.value = state.locale;
  elements.locale.addEventListener("change", () => {
    state.locale = supportedLocale(elements.locale.value);
    writeLocalePreference(state.locale);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", state.locale);
    history.replaceState({}, "", url);
    applyTranslations();
    renderFilters();
    elements.jurisdiction.value = state.jurisdiction;
    elements.listingFilter.value = state.listingFilter;
    renderFreshness();
    render();
  });

  const [catalogue, scheduleSnapshot] = await Promise.all([
    window.ParliamentStreamsData.load("channels"),
    window.ParliamentStreamsData.optional("schedules"),
  ]);
  let snapshot = scheduleSnapshot;
  if (!catalogue) throw new Error(t("sourceError"));
  // Official calendars remain usable if generated programme data is unavailable.
  state.hasSnapshot = Boolean(snapshot && typeof snapshot.channels === "object" && snapshot.channels !== null);
  snapshot ??= {};
  state.channels = catalogue.channels;
  state.schedules = snapshot.channels ?? {};
  state.sources = snapshot.sources ?? {};
  state.generatedAt = snapshot.generated_at ?? Object.values(state.schedules).map((item) => item.fetched_at).filter(Boolean).sort().at(-1) ?? null;
  if (snapshot.schema_version === 3) {
    const quality = await window.ParliamentStreamsData.optional("epg-quality");
    // Do not combine coverage from a different scheduled publication window.
    if (quality?.schema_version === 1 && quality.generated_at === state.generatedAt) {
      state.quality = quality.coverage?.channels ?? {};
    }
  }
  if (pageSignal?.aborted) return;
  renderFilters();
  if (!["", "current", "next", "playable"].includes(state.listingFilter)) state.listingFilter = "";
  elements.listingFilter.value = state.listingFilter;
  renderFreshness();
  render();
  elements.jurisdiction.addEventListener("change", () => {
    state.jurisdiction = elements.jurisdiction.value;
    updateFilterUrl();
    render();
  });
  elements.listingFilter.addEventListener("change", () => { state.listingFilter = elements.listingFilter.value; updateFilterUrl(); render(); });
  elements.clear.addEventListener("click", () => {
    state.jurisdiction = "";
    state.listingFilter = "";
    elements.jurisdiction.value = "";
    elements.listingFilter.value = "";
    updateFilterUrl();
    render();
    elements.jurisdiction.focus();
  });
}

window.ParliamentStreamsPageReady = init().catch((error) => {
  if (pageSignal?.aborted) return;
  elements.updated.textContent = error.message;
  elements.updated.classList.add("is-stale");
  elements.empty.hidden = false;
});
})();
