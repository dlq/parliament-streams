/* One owner for the language selector and shared header on every page. */
(() => {
  const shared = window.ParliamentStreamsI18n;
  const current = shared.currentLocale;
  function header(locale) {
    document.documentElement.lang = locale;
    const selector = document.querySelector("#locale-select");
    selector.value = locale;
    document.querySelector(".locale-control span").textContent = shared.message(locale, "language");
    document.querySelector(".site-header nav").setAttribute("aria-label", window.ParliamentStreamsProjectI18n.message(locale, "navigation"));
    document.querySelector(".site-header .brand").setAttribute("aria-label", window.ParliamentStreamsProjectI18n.message(locale, "home"));
    const labels = {
      catalogue: shared.message(locale, "nav"),
      institutions: window.ParliamentStreamsInstitutionsI18n.message(locale, "title"),
      map: window.ParliamentStreamsMapI18n.message(locale, "title"),
      schedule: window.ParliamentStreamsScheduleI18n.message(locale, "title"),
      data: window.ParliamentStreamsProjectI18n.message(locale, "title"),
    };
    for (const link of document.querySelectorAll("[data-navigation]")) {
      const page = link.dataset.navigation;
      const path = page === "catalogue" ? (location.protocol === "file:" ? "index.html" : "./") : `${page}.html`;
      const url = new URL(path, location.href);
      url.searchParams.set("lang", locale);
      link.href = url.href;
      link.textContent = labels[page];
      link.title = labels[page];
      link.lang = locale;
    }
    const home = document.querySelector(".site-header .brand");
    const url = new URL(location.protocol === "file:" ? "index.html" : "./", location.href);
    url.searchParams.set("lang", locale);
    home.href = url.href;
  }
  function bind(onChange) {
    const selector = document.querySelector("#locale-select");
    selector.replaceChildren(...shared.locales.map(([code, name]) => {
      const option = new Option(name, code);
      option.lang = code;
      return option;
    }));
    header(current());
    let revision = 0;
    const signal = window.ParliamentStreamsNavigation?.signal;
    selector.addEventListener("change", () => {
      const ticket = ++revision;
      const locale = shared.supportedLocale(selector.value);
      window.ParliamentStreamsLocaleReady = (async () => {
        await shared.load?.(locale);
        if (ticket !== revision || signal?.aborted) return;
        shared.writeLocalePreference(locale);
        const url = new URL(location.href);
        url.searchParams.set("lang", locale);
        try { history.replaceState({}, "", url); } catch { /* Direct-file preview. */ }
        await onChange(locale);
        header(locale);
        document.dispatchEvent(new CustomEvent("parliament:localechange", { detail: { locale } }));
      })().catch(() => { if (!signal?.aborted) selector.value = document.documentElement.lang; });
    }, signal ? { signal } : {});
  }
  window.ParliamentStreamsPageLocale = { current, bind, header };
})();
