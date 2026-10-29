/* JSON products are shared across page changes; failed requests can be retried. */
(() => {
  if (window.ParliamentStreamsData) return;
  const script = new URL(document.currentScript.src);
  const localRoot = document.querySelector('meta[name="parliament-data-root"]')?.content ?? "./data/";
  const root = location.protocol === "file:"
    ? new URL("https://dlq.ca/parliament-streams/data/")
    : new URL(localRoot, script);
  const products = new Set(["channels", "fallbacks", "supranational", "institutions", "schedules", "epg-quality"]);
  const requests = new Map();
  function load(name) {
    if (!products.has(name)) return Promise.reject(new Error(`Unknown data product: ${name}`));
    if (!requests.has(name)) {
      const request = fetch(new URL(`${name}.json`, root), { cache: "no-cache", headers: { Accept: "application/json" } })
        .then((response) => {
          if (!response.ok) throw new Error(`Data unavailable: ${name} (${response.status})`);
          return response.json();
        })
        .then((value) => {
          if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Invalid data product: ${name}`);
          return value;
        })
        .catch((error) => { requests.delete(name); throw error; });
      requests.set(name, request);
    }
    return requests.get(name);
  }
  window.ParliamentStreamsData = { load, optional: (name) => load(name).catch(() => null) };
})();
