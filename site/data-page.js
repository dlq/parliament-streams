window.ParliamentStreamsPageReady = window.ParliamentStreamsI18n.startPage((pageSignal) => {

  const shared = window.ParliamentStreamsI18n;
  const project = window.ParliamentStreamsProjectI18n;
  let locale = window.ParliamentStreamsPageLocale.current();

  function localize() {

    document.querySelector(".data-contents").setAttribute("aria-label", project.message(locale, "contentsLabel"));
    for (const node of document.querySelectorAll("[data-project-text]")) {
      node.textContent = project.message(locale, node.dataset.projectText);
    }
    for (const node of document.querySelectorAll("[data-inventory-text]")) {
      node.textContent = window.ParliamentStreamsInstitutionsI18n.message(locale, node.dataset.inventoryText);
    }
    for (const node of document.querySelectorAll("[data-schedule-text]")) {
      node.textContent = window.ParliamentStreamsScheduleI18n.message(locale, node.dataset.scheduleText);
    }
    for (const link of document.querySelectorAll("[data-contribution-template]")) {
      const url = new URL(link.href);
      url.searchParams.set("page", window.location.href);
      if (link.dataset.contributionTemplate === "translation") url.searchParams.set("language", locale);
      link.href = url.href;
    }
    document.querySelector("#data-footer-copy").textContent = shared.message(locale, "footer");
    for (const link of document.querySelectorAll("[data-asset-key]")) {
      link.setAttribute("aria-label", `${link.textContent.trim()} — ${project.message(locale, link.dataset.assetKey)}`);
    }
    window.ParliamentStreamsSeo.update(`${project.message(locale, "title")} · Parliament Streams`, project.message(locale, "intro"), locale);
  }

  window.ParliamentStreamsPageLocale.bind((selected) => {
    locale = selected;
    localize();
  });
  localize();
});
