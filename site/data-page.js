(() => {
  const pageSignal = window.ParliamentStreamsNavigation?.signal;
  const shared = window.ParliamentStreamsI18n;
  const project = window.ParliamentStreamsProjectI18n;
  const selector = document.querySelector("#locale-select");
  let locale = shared.supportedLocale(new URLSearchParams(window.location.search).get("lang")
    ?? shared.readLocalePreference() ?? navigator.language);

  function localize() {
    document.documentElement.lang = locale;
    for (const node of document.querySelectorAll("[data-project-text]")) {
      node.textContent = project.message(locale, node.dataset.projectText);
    }
    document.querySelector("#data-language-label").textContent = shared.message(locale, "language");
    document.querySelector("#data-footer-copy").textContent = shared.message(locale, "footer");
    document.querySelector("#data-nav-catalogue").textContent = shared.message(locale, "nav");
    document.querySelector("#data-nav-institutions").textContent = window.ParliamentStreamsInstitutionsI18n.message(locale, "title");
    document.querySelector("#data-nav-map").textContent = window.ParliamentStreamsMapI18n.message(locale, "title");
    document.querySelector("#data-nav-schedule").textContent = window.ParliamentStreamsScheduleI18n.message(locale, "title");
    document.querySelector("#data-primary-navigation").setAttribute("aria-label", project.message(locale, "navigation"));
    document.querySelector("#data-brand-home").setAttribute("aria-label", project.message(locale, "home"));
    for (const link of document.querySelectorAll("[data-page-link]")) {
      const path = window.location.protocol === "file:" && link.dataset.pageLink === "./" ? "index.html" : link.dataset.pageLink;
      const url = new URL(path, window.location.href);
      url.searchParams.set("lang", locale);
      link.href = url.href;
    }
    for (const link of document.querySelectorAll("[data-asset-key]")) {
      link.setAttribute("aria-label", `${project.message(locale, link.dataset.assetKey)} (${link.textContent.trim()})`);
    }
    selector.value = locale;
    window.ParliamentStreamsSeo.update(`${project.message(locale, "title")} · Parliament Streams`, project.message(locale, "intro"), locale);
  }

  selector.replaceChildren(...shared.locales.map(([code, name]) => {
    const option = new Option(name, code);
    option.lang = code;
    return option;
  }));
  selector.addEventListener("change", () => {
    locale = shared.supportedLocale(selector.value);
    shared.writeLocalePreference(locale);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", locale);
    try { history.replaceState(null, "", url); } catch { /* Keep local-file previews usable. */ }
    localize();
  });
  localize();
})();
