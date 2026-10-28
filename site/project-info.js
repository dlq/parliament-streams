(() => {
  const pageSignal = window.ParliamentStreamsNavigation?.signal;
  const shared = window.ParliamentStreamsI18n;
  const project = window.ParliamentStreamsProjectI18n;
  const selector = document.querySelector("#locale-select");

  function updateProjectNavigation() {
    const locale = shared.supportedLocale(selector?.value
      || new URLSearchParams(window.location.search).get("lang")
      || shared.readLocalePreference() || navigator.language);
    const text = (key) => project.message(locale, key);
    // Page controllers run first. Correct these names independently of older
    // translations that accidentally reused a page title or an About label.
    for (const navigation of document.querySelectorAll(".header-inner > nav")) {
      navigation.setAttribute("aria-label", text("navigation"));
      const dataLink = navigation.querySelector("[data-project-navigation]");
      if (dataLink) {
        const dataUrl = new URL("data.html", window.location.href);
        dataUrl.searchParams.set("lang", locale);
        dataLink.textContent = text("title");
        dataLink.href = dataUrl.href;
        dataLink.lang = locale;
      }
    }
    for (const home of document.querySelectorAll(".header-inner > a.brand")) {
      home.setAttribute("aria-label", text("home"));
    }
  }

  const scheduleUpdate = () => queueMicrotask(updateProjectNavigation);
  scheduleUpdate();
  selector?.addEventListener("change", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate, { signal: pageSignal });
  // Some controllers translate only after their data has loaded. Observe the
  // language signal so their older header names cannot win an async race.
  const languageObserver = new MutationObserver(scheduleUpdate);
  window.ParliamentStreamsNavigation?.cleanup(() => languageObserver.disconnect());
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
