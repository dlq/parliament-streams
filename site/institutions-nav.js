(() => {
  const links = document.querySelectorAll("#nav-institutions, #map-nav-institutions, #schedule-nav-institutions");
  if (!links.length) return;

  const { readLocalePreference, supportedLocale } = window.ParliamentStreamsI18n;
  const { message } = window.ParliamentStreamsInstitutionsI18n;
  const selector = document.querySelector("#locale-select");

  function updateInstitutionNavigationLinks() {
    const locale = supportedLocale(selector?.value || new URLSearchParams(window.location.search).get("lang") || readLocalePreference() || navigator.language);
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

  updateInstitutionNavigationLinks();
  selector?.addEventListener("change", () => queueMicrotask(updateInstitutionNavigationLinks));
  window.addEventListener("pageshow", updateInstitutionNavigationLinks);
})();
