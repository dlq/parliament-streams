window.ParliamentStreamsPageReady = window.ParliamentStreamsI18n.startPage((pageSignal) => {
  "use strict";

  const shared = window.ParliamentStreamsI18n;
  const translations = window.ParliamentStreamsInstitutionsI18n;
  let data;
  const query = new URLSearchParams(window.location.search);
  const byId = (id) => document.getElementById(id);
  const statuses = {
    eligible_legislature: "eligible",
    specific_authority_evidence_hold: "unresolved",
    outside_default_scope: "excluded",
    historical_institution_superseded: "historical",
  };
  const state = {
    locale: window.ParliamentStreamsPageLocale.current(),
    search: query.get("q") ?? "",
    country: query.get("country") ?? "",
    status: Object.hasOwn(statuses, query.get("status")) || query.get("status") === "all" ? query.get("status") : "default",
  };
  const message = (key, values = {}) => translations.message(state.locale, key, values);
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase(state.locale);
  const link = (text, href) => {
    const node = element("a", "", text);
    node.href = href;
    return node;
  };
  const issueUrl = (template, values) => {
    const url = new URL("https://github.com/dlq/parliament-streams/issues/new");
    url.searchParams.set("template", template);
    for (const [key, value] of Object.entries(values)) url.searchParams.set(key, value);
    return url.href;
  };
  const pageUrl = (id) => `https://dlq.ca/parliament-streams/institutions.html${id ? `?q=${encodeURIComponent(id)}&status=all` : ""}`;
  let countries = [];
  let records = new Map();
  let openCountries = new Set();
  const countryLabels = new Map();
  const countryName = (country) => {
    if (countryLabels.has(country)) return countryLabels.get(country);
    const code = countries.find((item) => item.name === country)?.code;
    let name = country;
    try { if (code) name = new Intl.DisplayNames([state.locale], { type: "region" }).of(code); } catch { /* Keep the source name. */ }
    countryLabels.set(country, name);
    return name;
  };
  const localizedDate = (date) => new Intl.DateTimeFormat(state.locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

  function localize() {
    countryLabels.clear();

    const texts = {
      "institutions-title": "title", "institutions-lede": "lede", "institutions-skip": "skip",
      "institution-search-label": "search",
      "institution-country-label": "country", "institution-status-label": "status",
      "institution-search-hint": "searchHint", "institution-clear": "clear",
    };
    for (const [id, key] of Object.entries(texts)) byId(id).textContent = message(key);
    for (const [id, key] of [["institutions-language", "language"], ["institutions-footer", "footer"], ["institutions-nav-catalogue", "nav"]]) byId(id).textContent = shared.message(state.locale, key);
    byId("institution-search").placeholder = message("search");
    byId("locale-select").value = state.locale;
    if (data) byId("institutions-reviewed").textContent = message("reviewed", { date: localizedDate(data.reviewed_on) });
    window.ParliamentStreamsSeo?.update(`${message("title")} · Parliament Streams`, message("lede"), state.locale);
    const countrySelect = byId("institution-country");
    countrySelect.replaceChildren(new Option(message("allCountries"), ""));
    const collator = new Intl.Collator(state.locale);
    for (const country of [...countries].sort((a, b) => collator.compare(countryName(a.name), countryName(b.name)))) countrySelect.add(new Option(countryName(country.name), country.name));
    countrySelect.value = state.country;
    const statusSelect = byId("institution-status");
    statusSelect.replaceChildren(new Option(message("defaultView"), "default"));
    for (const [status, key] of Object.entries(statuses)) statusSelect.add(new Option(message(key), status));
    statusSelect.add(new Option(message("allStatuses"), "all"));
    statusSelect.value = state.status;
  }

  function updateUrl() {
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries({ lang: state.locale, q: state.search, country: state.country, status: state.status === "default" ? "" : state.status })) {
      if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    }
    try { history.replaceState(null, "", url); } catch { /* file previews may disallow history changes. */ }
  }

  function reviewScopeNote(scope) {
    const structured = scope !== null && typeof scope === "object" && !Array.isArray(scope);
    const note = element(structured ? "dl" : "p", "institution-service-scope");
    note.lang = "en";
    if (!structured) {
      note.textContent = String(scope);
      return note;
    }
    for (const [key, value] of Object.entries(scope)) {
      const label = key.replaceAll("_", " ");
      note.append(
        element("dt", "", label.charAt(0).toUpperCase() + label.slice(1)),
        element("dd", "", typeof value === "string" ? value : JSON.stringify(value)),
      );
    }
    return note;
  }

  function evidence(row) {
    const disclosure = element("details", "institution-evidence");
    disclosure.append(element("summary", "", message("details")));
    // Populate potentially long research notes only when the reader requests them.
    disclosure.addEventListener("toggle", () => {
      if (!disclosure.open || disclosure.children.length > 1) return;
      const body = element("div", "institution-evidence-content");
      body.append(element("p", "institution-note-language", message("sourceNotes")));
      const note = element("p", "", row.decision_basis);
      note.lang = "en";
      body.append(note);
      if (row.remaining_authority_instruments.length) {
        body.append(element("h4", "", message("missingEvidence")));
        const missing = element("ul");
        missing.lang = "en";
        for (const item of row.remaining_authority_instruments) missing.append(element("li", "", item));
        body.append(missing);
      }
      const service = row.service_review;
      if (service && service.stage !== "not_recorded") {
        body.append(element("h4", "", shared.message(state.locale, "sourceDetails")));
        if (service.reviewed_on) body.append(element("p", "", message("reviewed", { date: localizedDate(service.reviewed_on) })));
        const stage = element("p", "institution-service-stage", service.stage === "partial_source_followup"
          ? "Individual source follow-up recorded. This is a partial review; current live access, guide data and reuse permissions remain separate findings."
          : "Earlier service checks retained. A fresh playback check or complete rights validation is not implied.");
        stage.lang = "en";
        body.append(stage);
        for (const followup of service.followups ?? []) {
          if (followup.scope) body.append(reviewScopeNote(followup.scope));
          if (followup.unresolved?.length) {
            body.append(element("h4", "", message("missingEvidence")));
            const gaps = element("ul", "institution-service-gaps");
            gaps.lang = "en";
            for (const item of followup.unresolved) gaps.append(element("li", "", item));
            body.append(gaps);
          }
          if (followup.report_url) body.append(link(shared.message(state.locale, "validationReport"), followup.report_url));
        }
      }
      const related = row.relationships.map((relation) => records.get(relation.institution_id)).filter(Boolean);
      if (related.length) {
        body.append(element("h4", "", message("relationships")));
        const list = element("ul");
        for (const target of related) {
          const item = element("li");
          item.append(link(target.name, `?lang=${encodeURIComponent(state.locale)}&q=${encodeURIComponent(target.id)}&status=all`));
          list.append(item);
        }
        body.append(list);
      }
      for (const [key, urls] of [["sources", row.primary_urls], ["reports", row.report_urls]]) {
        if (!urls.length) continue;
        body.append(element("h4", "", message(key)));
        const list = element("ul");
        for (const href of urls) {
          const url = new URL(href);
          const text = key === "reports" ? decodeURIComponent(url.pathname.split("/").at(-1)) : `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`;
          const item = element("li");
          const anchor = link(text, href);
          if (key === "reports") anchor.lang = "en";
          item.append(anchor);
          list.append(item);
        }
        body.append(list);
      }
      const actions = element("div", "institutions-links");
      actions.append(link(message("rowContribute"), issueUrl("contribution.yml", {
        title: `[Institution]: ${row.name}`,
        page: pageUrl(row.id),
        context: `${row.name} · ${row.jurisdiction_label} · ${row.country}\nInventory ID: ${row.id}`,
      })));
      body.append(actions);
      disclosure.append(body);
    });
    return disclosure;
  }

  function institutionRow(row, children) {
    const item = element("li", "institution-row");
    item.id = row.id;
    item.dataset.status = row.status;
    const heading = element("div", "institution-row-heading");
    const identity = element("div");
    const name = element("h3", "institution-name");
    const isolatedName = element("bdi", "", row.name);
    name.append(isolatedName);
    identity.append(name);
    const parent = row.relationships.find((relation) => relation.type === "chamber_of_existing_umbrella_legislature");
    const parentName = parent && !children.has(parent.institution_id) ? records.get(parent.institution_id)?.name : "";
    identity.append(element("span", "institution-jurisdiction", [row.jurisdiction_label, parentName].filter(Boolean).join(" · ")));
    const status = element("span", "institution-status", message(statuses[row.status]));
    status.dataset.status = row.status;
    const viewing = element("div", "institution-viewing");
    if (row.catalogue_ids.length) {
      for (const [index, id] of row.catalogue_ids.entries()) {
        const source = link(`${shared.message(state.locale, "sourceDetails")}${row.catalogue_ids.length > 1 ? ` ${index + 1}` : ""}`, `./?lang=${encodeURIComponent(state.locale)}&source=${encodeURIComponent(id)}#catalogue`);
        source.dataset.viewerSource = id;
        viewing.append(source);
      }
    } else {
      viewing.textContent = message("noService");
    }
    heading.append(identity, status, viewing);
    item.append(heading, evidence(row));
    if (children.get(row.id)?.length) {
      const nested = element("ul", "institution-children");
      nested.setAttribute("aria-label", message("chambers"));
      for (const child of children.get(row.id)) nested.append(institutionRow(child, children));
      item.append(nested);
    }
    return item;
  }

  function render() {
    if (!data) {
      byId("institution-results").textContent = message("loadError");
      return;
    }
    const search = normalize(state.search.trim());
    const filtered = data.records.filter((row) => {
      if (state.country && row.country !== state.country) return false;
      if (state.status === "default" && !data.scope.default_statuses.includes(row.status)) return false;
      if (!["all", "default"].includes(state.status) && row.status !== state.status) return false;
      const parentNames = row.relationships.map((relation) => records.get(relation.institution_id)?.name ?? "");
      const text = [row.id, row.name, ...row.aliases, row.country, countryName(row.country), row.jurisdiction_label, ...parentNames].join(" ");
      return !search || normalize(text).includes(search);
    });
    const grouped = new Map();
    for (const row of filtered) {
      if (!grouped.has(row.country)) grouped.set(row.country, []);
      grouped.get(row.country).push(row);
    }
    byId("institution-results").textContent = message("results", { count: new Intl.NumberFormat(state.locale).format(filtered.length), countries: new Intl.NumberFormat(state.locale).format(grouped.size) });
    byId("institution-clear").hidden = !state.search && !state.country && state.status === "default";
    const container = byId("institution-list");
    container.replaceChildren();
    if (!filtered.length) container.append(element("p", "institution-empty", message("empty")));
    const collator = new Intl.Collator(state.locale);
    for (const [country, rows] of [...grouped].sort(([a], [b]) => collator.compare(countryName(a), countryName(b)))) {
      const group = element("details", "institution-country");
      const summary = element("summary");
      const countryHeading = element("span", "institution-country-name", countryName(country));
      countryHeading.setAttribute("role", "heading");
      countryHeading.setAttribute("aria-level", "2");
      summary.append(countryHeading, element("span", "institution-country-count", new Intl.NumberFormat(state.locale).format(rows.length)));
      group.append(summary);
      const populate = () => {
        if (group.children.length > 1) return;
        const children = new Map();
        const rowIds = new Set(rows.map((row) => row.id));
        const nestedIds = new Set();
        for (const row of rows) {
          const parent = row.relationships.find((relation) => relation.type === "chamber_of_existing_umbrella_legislature" && rowIds.has(relation.institution_id));
          if (!parent) continue;
          if (!children.has(parent.institution_id)) children.set(parent.institution_id, []);
          children.get(parent.institution_id).push(row);
          nestedIds.add(row.id);
        }
        const list = element("ul", "institution-rows");
        for (const row of rows.filter((row) => !nestedIds.has(row.id)).sort((a, b) => collator.compare(a.name, b.name))) list.append(institutionRow(row, children));
        group.append(list);
      };
      group.addEventListener("toggle", () => {
        if (group.open) { openCountries.add(country); populate(); } else openCountries.delete(country);
      });
      group.open = Boolean(search || state.country || filtered.length < 20 || openCountries.has(country));
      if (group.open) populate();
      container.append(group);
    }
  }

  async function init() {
    data = await window.ParliamentStreamsData.load("institutions");
    if (pageSignal?.aborted) return;
    if (data) {
      countries = data.countries;
      records = new Map(data.records.map((row) => [row.id, row]));
      if (!countries.some((country) => country.name === state.country)) state.country = "";
    }
    byId("institution-search").value = state.search;
    byId("institution-search").addEventListener("input", (event) => { state.search = event.target.value; updateUrl(); render(); });
    byId("institution-country").addEventListener("change", (event) => { state.country = event.target.value; openCountries = new Set(); updateUrl(); render(); });
    byId("institution-status").addEventListener("change", (event) => { state.status = event.target.value; openCountries = new Set(); updateUrl(); render(); });
    window.ParliamentStreamsPageLocale.bind((locale) => {
      state.locale = locale;
      localize(); render();
    });
    byId("institution-clear").addEventListener("click", () => {
      Object.assign(state, { search: "", country: "", status: "default" });
      byId("institution-search").value = "";
      openCountries = new Set();
      updateUrl(); localize(); render();
      byId("institution-search").focus();
    });
    localize();
    render();
  }
  return init().catch(() => {
    if (!pageSignal?.aborted) byId("institution-results").textContent = shared.message(state.locale, "sourceError");
  });
});
