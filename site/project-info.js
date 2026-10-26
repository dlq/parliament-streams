(() => {
  const shared = window.ParliamentStreamsI18n;
  const project = window.ParliamentStreamsProjectI18n;
  const selector = document.querySelector("#locale-select");
  const repository = "https://github.com/dlq/parliament-streams";
  const contributionGuide = `${repository}/blob/main/CONTRIBUTING.md`;

  function updateProjectLinks() {
    const locale = shared.supportedLocale(selector?.value
      || new URLSearchParams(window.location.search).get("lang")
      || shared.readLocalePreference() || navigator.language);
    const text = (key) => project.message(locale, key);
    for (const host of document.querySelectorAll("[data-project-links]")) {
      if (host.dataset.projectLocale === locale) continue;
      const links = document.createElement("div");
      links.className = "project-links";
      const dataUrl = new URL("data.html", window.location.href);
      dataUrl.searchParams.set("lang", locale);
      for (const [key, href, external] of [
        ["title", dataUrl.href, false],
        ["contribute", contributionGuide, true],
        ["code", repository, true],
      ]) {
        const link = document.createElement("a");
        link.textContent = text(key);
        link.href = href;
        link.lang = locale;
        if (external) {
          link.hreflang = "en";
          const icon = document.createElement("span");
          icon.textContent = " ↗";
          icon.setAttribute("aria-hidden", "true");
          link.append(icon);
        } else if (window.location.pathname.endsWith("/data.html")) {
          link.setAttribute("aria-current", "page");
        }
        links.append(link);
      }
      const children = [];
      if (host.dataset.projectLinks === "intro") {
        const summary = document.createElement("p");
        summary.className = "project-summary";
        summary.textContent = text("intro");
        children.push(summary);
      }
      host.replaceChildren(...children, links);
      host.dataset.projectLocale = locale;
    }
    // Page controllers run first. Correct these names independently of older
    // translations that accidentally reused a page title or an About label.
    for (const navigation of document.querySelectorAll(".header-inner > nav")) {
      navigation.setAttribute("aria-label", text("navigation"));
    }
    for (const home of document.querySelectorAll(".header-inner > a.brand")) {
      home.setAttribute("aria-label", text("home"));
    }
  }

  const scheduleUpdate = () => queueMicrotask(updateProjectLinks);
  scheduleUpdate();
  selector?.addEventListener("change", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);
  // Some controllers translate only after their data has loaded. Observe the
  // language signal so their older header names cannot win an async race.
  const languageObserver = new MutationObserver(scheduleUpdate);
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
