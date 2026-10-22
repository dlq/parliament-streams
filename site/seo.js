(() => {
  // Keep rendered search/social metadata aligned with the selected UI language.
  // Canonical URLs deliberately stay on the published page without UI parameters.
  function update(title, description, locale) {
    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute('content', description);
    for (const [attribute, prefix] of [['property', 'og'], ['name', 'twitter']]) {
      document.querySelector(`meta[${attribute}="${prefix}:title"]`).setAttribute('content', title);
      document.querySelector(`meta[${attribute}="${prefix}:description"]`).setAttribute('content', description);
    }
    const element = document.querySelector('#page-structured-data');
    const graph = JSON.parse(element.textContent);
    const page = graph['@graph'].find((node) => node['@type'] !== 'WebSite');
    Object.assign(page, { name: title, description, inLanguage: locale });
    element.textContent = JSON.stringify(graph);
  }
  window.ParliamentStreamsSeo = { update };
})();
