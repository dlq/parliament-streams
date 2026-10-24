(() => {
  const links = document.querySelectorAll("#nav-institutions, #map-nav-institutions, #schedule-nav-institutions");
  if (!links.length) return;

  const { supportedLocale } = window.ParliamentStreamsI18n;
  const { message } = window.ParliamentStreamsInstitutionsI18n;
  const selector = document.querySelector("#locale-select");

  function storedLocale() {
    try {
      return localStorage.getItem("parliament-streams-locale");
    } catch {
      return null;
    }
  }

  function render() {
    const locale = supportedLocale(selector?.value || new URLSearchParams(window.location.search).get("lang") || storedLocale() || navigator.language);
    links.forEach((link) => {
      const label = message(locale, "title");
      link.textContent = label;
      link.title = label;
      link.lang = locale;
      const url = new URL(link.getAttribute("href"), window.location.href);
      url.searchParams.set("lang", locale);
      link.href = url.href;
    });
  }

  render();
  selector?.addEventListener("change", () => queueMicrotask(render));
  window.addEventListener("pageshow", render);
})();
