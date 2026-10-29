/* Loaded only when a source is opened; its media node survives page changes. */
(() => {
const state = { channels: [], fallbacks: [], schedules: {}, selectedId: null, generatedOn: "", hls: null, locale: document.documentElement.lang, detailSheetOpen: false };
const elements = { detail: document.querySelector("#detail-panel") };
const { t, label, slug, jurisdictionName, jurisdictionMark, isPlaybackEnabled, playbackMode, formatDate, languageDisplayName, contentLanguageTag, languageAttribute, sentenceCase, escapeHtml, localEventTime } = window.ParliamentStreamsSourceUI.create(() => state.locale, () => state.channels);
const redundantAccessibilityNotes = new Set([
  "The official service provides accessible variants for some scheduled proceedings.",
  "The official service provides language and accessibility variants for some scheduled proceedings.",
]);
const repositoryBaseUrl = "https://github.com/dlq/parliament-streams/blob/main/";
function closeDetailSheet() {
  state.detailSheetOpen = false;
  elements.detail.querySelector("video")?.pause();
  elements.detail.querySelector("iframe")?.remove();
  if (state.hls) { state.hls.destroy(); state.hls = null; }
  elements.detail.classList.remove("is-open");
  elements.detail.hidden = true;
  state.playbackGeneration = (state.playbackGeneration || 0) + 1;
  elements.detail.style.removeProperty("--mobile-sheet-height");
}
let lastTrigger = null;
let selectionRevision = 0;
function dismissDetail() {
  selectionRevision++;
  const list = document.querySelector("#channel-list");
  const selectedId = state.selectedId;
  state.selectedId = null;
  closeDetailSheet();
  document.dispatchEvent(new CustomEvent("parliament:sourcechange", { detail: { id: state.selectedId } }));
  const target = lastTrigger?.isConnected ? lastTrigger
    : list?.isConnected ? list.querySelector(`[data-channel-id="${selectedId}"]`)
    : document.querySelector("main h1");
  if (target?.matches("h1")) target.setAttribute("tabindex", "-1");
  target?.focus({ preventScroll: true });
}
function openSource(id, { play = false, trigger = null, focus = false } = {}) {
  if (!state.channels.some((channel) => channel.id === id)) return;
  const same = state.selectedId === id;
  lastTrigger = trigger;
  state.selectedId = id;
  state.detailSheetOpen = true;
  elements.detail.classList.remove("is-minimized");
  document.dispatchEvent(new CustomEvent("parliament:sourcechange", { detail: { id: state.selectedId } }));
  renderDetail({ startPlayer: play, preservePlayer: same, focusDetail: focus || matchMedia("(max-width: 1100px)").matches });
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
    if (event.key !== "Escape") return;
    event.preventDefault();
    dismissDetail();
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
function programmeTitleMarkup(title, url, language = "") {
  const text = `<bdi dir="auto"${languageAttribute(language)}>${escapeHtml(title)}</bdi>`;
  return url
    ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${text} ↗</a>`
    : text;
}
function programmeMetadataMarkup(start, fallback, language, location) {
  const time = localEventTime(start, fallback);
  return [
    time ? `<bdi dir="ltr">${escapeHtml(time)}</bdi>` : "",
    escapeHtml(languageDisplayName(language)),
    location ? `<bdi dir="auto">${escapeHtml(location)}</bdi>` : "",
  ].filter(Boolean).join(" · ");
}
function programmeMarkup(channel) {
  const schedule = state.schedules[channel.id];
  if (!schedule) return "";
  const programmeLine = (labelKey, title, time, start, url, language, location) => {
    const titleMarkup = programmeTitleMarkup(title, url, language || contentLanguageTag(channel));
    const metadata = programmeMetadataMarkup(start, time, language, location);
    return `<span class="programme-line"><strong lang="${state.locale}">${t(labelKey)}</strong> ${titleMarkup}${metadata ? ` <span class="programme-time">· ${metadata}</span>` : ""}</span>`;
  };
  const current = schedule.current_event_title
    ? programmeLine(
      "nowProgramme",
      schedule.current_event_title,
      schedule.current_event_time,
      schedule.current_event_start,
      schedule.current_event_url,
      schedule.current_event_language,
      schedule.current_event_location,
    )
    : "";
  const next = schedule.next_event_title
    ? programmeLine(
      "nextProgramme",
      schedule.next_event_title,
      schedule.next_event_time,
      schedule.next_event_start,
      schedule.next_event_url,
      schedule.next_event_language,
      schedule.next_event_location,
    )
    : "";
  const freshness = `<span class="detail-subtitle programme-fetch-status">${t("scheduleCollected", { date: escapeHtml(new Date(schedule.fetched_at).toLocaleString(state.locale)) })}</span>`;
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
  const eventLine = (labelKey, title, url, time, start, language, location) => {
    const titleMarkup = programmeTitleMarkup(title, url, language);
    const metadata = programmeMetadataMarkup(start, time, language, location);
    return `<span><strong>${t(labelKey)}</strong> ${titleMarkup}${metadata ? ` <em>${metadata}</em>` : ""}</span>`;
  };
  const current = relatedSchedule.current_event_title
    ? eventLine(
      "nowProgramme",
      relatedSchedule.current_event_title,
      relatedSchedule.current_event_url,
      relatedSchedule.current_event_time,
      relatedSchedule.current_event_start,
      relatedSchedule.current_event_language,
      relatedSchedule.current_event_location,
    )
    : "";
  const next = relatedSchedule.next_event_title
    ? eventLine(
      "nextProgramme",
      relatedSchedule.next_event_title,
      relatedSchedule.next_event_url,
      relatedSchedule.next_event_time,
      relatedSchedule.next_event_start,
      relatedSchedule.next_event_language,
      relatedSchedule.next_event_location,
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
function researchNotesMarkup(channel, playbackMessage, usesLocalizedPlaybackGuidance) {
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
  const recommendation = usesLocalizedPlaybackGuidance
    ? ""
    : `<p><strong>Catalogue recommendation.</strong> ${channel.permission.recommendation}</p>`;
  const localizedPolicy = usesLocalizedPlaybackGuidance
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
      ${latest.method === "review_followup" ? `<span lang="en">${escapeHtml(latest.note)}</span>` : ""}
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
function renderDetail({ startPlayer = false, focusDetail = false, preservePlayer = false } = {}) {
  const frame = elements.detail.querySelector("#media-frame");
  const keepFrame = preservePlayer && frame?.querySelector("video, iframe") ? frame : null;
  if (!keepFrame) {
    state.playbackGeneration = (state.playbackGeneration || 0) + 1;
    if (state.hls) { state.hls.destroy(); state.hls = null; }
  }
  const channel = state.channels.find((item) => item.id === state.selectedId);
  elements.detail.hidden = !channel;
  elements.detail.lang = state.locale;
  if (!channel) { elements.detail.innerHTML = `<p class="detail-empty">${t("selectSource")}</p>`; closeDetailSheet(); return; }
  const allowed = isPlaybackEnabled(channel);
  const viewingReview = playbackMode(channel) === "research"
    ? channel.validation_history?.find((entry) => entry.method === "review_followup" && entry.note?.trim())
    : null;
  elements.detail.classList.toggle("is-link-only", !allowed);
  const usesLocalizedPlaybackGuidance = channel.embed?.provider === "youtube" || allowed;
  const playbackMessage = channel.embed?.provider === "youtube"
    ? state.locale === "en"
      ? `${channel.embed.notes} ${t("youtubePlaybackPolicy")}`
      : t("youtubePlaybackPolicy")
    : allowed
      ? t("optOutPlaybackPolicy")
      : channel.permission.recommendation;
  const programme = programmeMarkup(channel);
  const sourceType = label(channel.source_type);
  const sourceKind = label(channel.source_kind);
  elements.detail.setAttribute("aria-labelledby", "detail-title");
  elements.detail.removeAttribute("aria-label");
  const viewerText = (key) => window.ParliamentStreamsViewerI18n.message(state.locale, key);
  const content = document.createElement("template");
  content.innerHTML = `
    <div class="mobile-sheet-controls viewer-controls">
      <button class="viewer-resize" data-resize-viewer type="button" aria-label="${viewerText("resize")}" aria-describedby="viewer-keys">↖</button>
      <button class="viewer-move" data-move-viewer type="button" aria-label="${viewerText("move")}" aria-describedby="viewer-keys"></button>
      <button class="viewer-minimize" data-minimize-viewer type="button" aria-label="${viewerText("minimize")}">−</button>
      <button class="detail-grabber" data-resize-detail type="button" aria-label="${t("resizeDetails")}" lang="${state.locale}"><span></span></button>
      <button class="detail-close" data-close-detail type="button" aria-label="${t("close")}" title="${t("close")}"><span class="viewer-close-icon" aria-hidden="true">×</span><span class="detail-close-label">${t("close")}</span></button>
    </div>
    <p class="visually-hidden" id="viewer-keys">${viewerText("keys")}</p>
    <h3 class="detail-title" id="detail-title" tabindex="-1" aria-live="polite">${channel.name}</h3>
    <p class="detail-subtitle">${jurisdictionMark(channel.country_or_region)}${jurisdictionName(channel.country_or_region)} · <span${languageAttribute(contentLanguageTag(channel))}>${channel.legislature}</span></p>
    ${playbackMode(channel) === "research" ? `<p class="detail-subtitle research-playback-note">${t("sourceResearchDescription")}</p>` : ""}
    ${viewingReview ? `<p class="detail-subtitle research-playback-reason">${t(channel.technical_status === "needs_review" ? "viewingFeedUnverified" : "viewingSourceUnresolved")} ${t("validationChecked", { date: formatDate(viewingReview.checked_at) })}</p>` : ""}
    ${allowed ? `<div class="media-frame" id="media-frame">
      <div class="player-placeholder"><button class="placeholder-play-button" data-start-playback type="button" aria-label="${t("watch")}">▶</button><p>${t("ready")}</p></div>
    </div>` : ""}
    <div class="detail-actions">
      ${allowed ? `<button class="play-button" data-start-playback type="button">${t("watch")}</button>` : ""}
      <a class="official-button" href="${channel.official_url}" target="_blank" rel="noreferrer">${playbackMode(channel) === "research" ? t("officialEvidence") : t("official")} ↗</a>
    </div>
    ${programme ? `<dl class="detail-grid"><div class="full"><dt>${t("programme")}</dt><dd>${programme}</dd></div></dl>` : ""}
    <details class="source-documentation">
    <summary>${t("viewingChecks")}</summary>
    <dl class="detail-grid">
      <div title="${t("sourceType")}: ${sourceType}"><dt>${t("sourceType")}</dt><dd>${sourceType}</dd></div>
      ${sourceKind === sourceType ? "" : `<div title="${t("sourceKind")}: ${sourceKind}"><dt>${t("sourceKind")}</dt><dd>${sourceKind}</dd></div>`}
      <div title="${t("playbackPolicy")}: ${label(channel.playback_policy)}"><dt>${t("playbackPolicy")}</dt><dd><span class="status status-${slug(channel.playback_policy)}">${label(channel.playback_policy)}</span></dd></div>
      <div title="${t("accessStatus")}: ${label(channel.technical_status)}"><dt>${t("accessStatus")}</dt><dd><span class="status status-${slug(channel.technical_status)}">${label(channel.technical_status)}</span></dd></div>
      <div title="${t("stabilityRisk")}: ${label(channel.stability_risk)}"><dt>${t("stabilityRisk")}</dt><dd><span class="status status-${slug(channel.stability_risk)}">${label(channel.stability_risk)}</span></dd></div>
      <div title="${t("availability")}: ${label(channel.availability)}"><dt>${t("availability")}</dt><dd>${label(channel.availability)}</dd></div>
      ${accessibilityMarkup(channel)}
      ${identityMarkup(channel)}
      ${validationMarkup(channel)}
      <div class="full"><dt>${t("schedule")}</dt><dd>${epgMarkup(channel)}</dd></div>
      ${fallbackMarkup(channel)}
      ${freshnessMarkup(channel)}
    </dl>
    </details>
    <details class="source-documentation">
      <summary>${t("useGuidance")}</summary>
      <dl class="detail-grid permission-record">
        <div title="${t("permissionStatus")}: ${label(channel.permission.status)}"><dt>${t("permissionStatus")}</dt><dd><span class="status status-${slug(channel.permission.status)}">${label(channel.permission.status)}</span></dd></div>
      </dl>
      ${researchNotesMarkup(channel, playbackMessage, usesLocalizedPlaybackGuidance)}
    </details>`;
  if (keepFrame) {
    // Removing/reinserting an iframe can reload it. Keep the actual media node
    // attached while translating or changing the surrounding source details.
    for (const child of [...elements.detail.childNodes]) if (child !== keepFrame) child.remove();
    let beforeFrame = true;
    for (const child of [...content.content.childNodes]) {
      if (child.nodeType === 1 && child.id === "media-frame") { beforeFrame = false; continue; }
      elements.detail.insertBefore(child, beforeFrame ? keepFrame : null);
    }
  } else {
    elements.detail.replaceChildren(content.content);
  }
  window.ParliamentStreamsViewerControls.setup(elements.detail);
  elements.detail.classList.toggle("is-open", state.detailSheetOpen);
  elements.detail.querySelectorAll("[data-start-playback]").forEach((button) => button.addEventListener("click", () => startPlayback(channel)));
  elements.detail.querySelector("[data-close-detail]").addEventListener("click", dismissDetail);
  setupDetailSheetControls();
  if (focusDetail) elements.detail.querySelector("#detail-title").focus();
  if (startPlayer && allowed) startPlayback(channel);
}
function loadHlsLibrary() {
  return window.ParliamentStreamsVendor.load("hls");
}
async function startPlayback(channel) {
  const frame = elements.detail.querySelector("#media-frame");
  if (!frame || frame.querySelector("video, iframe")) return;
  const generation = state.playbackGeneration;
  frame.innerHTML = "";
  if (channel.embed?.provider === "youtube") {
    if (window.location.protocol === "file:") {
      frame.innerHTML = `<div class="player-placeholder youtube-file-notice" lang="${state.locale}">
        <p>${t("playbackError")} <a href="https://dlq.ca/parliament-streams/" target="_blank" rel="noreferrer">${t("official")} ↗</a></p>
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
      if (generation !== state.playbackGeneration || !frame.isConnected) return;
      if (!window.Hls?.isSupported()) throw new Error("This browser does not support HLS playback.");
      state.hls = new window.Hls();
      state.hls.loadSource(channel.playback_url);
      state.hls.attachMedia(video);
    }
    await video.play();
  } catch (error) {
    if (generation !== state.playbackGeneration || !frame.isConnected) return;
    frame.innerHTML = `<div class="player-placeholder"><p>${t("playbackError")} <a href="${channel.official_url}" target="_blank" rel="noreferrer">${t("official")} ↗</a></p></div>`;
  }
}
let dataReady;
function loadData() {
  if (!dataReady) dataReady = (async () => {
    const [catalogue, fallbacks, schedules] = await Promise.all([
      window.ParliamentStreamsData.load("channels"),
      window.ParliamentStreamsData.optional("fallbacks"),
      window.ParliamentStreamsData.optional("schedules"),
    ]);
    state.channels = catalogue.channels;
    state.generatedOn = catalogue.generated_on;
    state.fallbacks = fallbacks?.fallbacks ?? [];
    state.schedules = schedules?.channels ?? {};
  })().catch((error) => { dataReady = null; throw error; });
  return dataReady;
}
window.ParliamentStreamsPlayer = {
  get selectedId() { return state.selectedId; },
  async open(id, options) {
    const ticket = ++selectionRevision;
    await loadData();
    if (ticket !== selectionRevision) return;
    state.locale = document.documentElement.lang;
    openSource(id, options);
  },
  mount() {
    state.locale = document.documentElement.lang;
    if (state.selectedId) renderDetail({ preservePlayer: true });
  },
};
document.addEventListener("parliament:localechange", (event) => {
  state.locale = event.detail.locale;
  if (state.selectedId) renderDetail({ preservePlayer: true });
});
matchMedia("(max-width: 1100px)").addEventListener("change", () => {
  if (state.selectedId) { state.detailSheetOpen = true; elements.detail.classList.add("is-open"); }
});
})();
