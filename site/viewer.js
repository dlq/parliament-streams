/* The viewer facade is always available; player code and data load on demand. */
(() => {
  const entry = document.currentScript;
  const base = new URL(entry.src);
  const sources = [[entry.dataset.controlsSrc, "ParliamentStreamsViewerControls"], [entry.dataset.playerSrc, "ParliamentStreamsPlayer"]];
  let pending;
  let selectedId = null;
  let revision = 0;
  document.addEventListener("parliament:sourcechange", (event) => { selectedId = event.detail.id; });
  function player() {
    if (!pending) pending = (async () => {
      await window.ParliamentStreamsI18n.ready;
      for (const [source, globalName] of sources) {
        if (window[globalName]) continue;
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = new URL(source, base).href;
          script.onload = () => { script.remove(); resolve(); };
          script.onerror = () => { script.remove(); reject(new Error("Viewer unavailable")); };
          document.head.append(script);
        });
      }
      return window.ParliamentStreamsPlayer;
    })().catch((error) => { pending = null; throw error; });
    return pending;
  }
  window.ParliamentStreamsViewer = {
    ready: window.ParliamentStreamsI18n.ready,
    get selectedId() { return selectedId; },
    async open(id, options) {
      const ticket = ++revision;
      document.dispatchEvent(new CustomEvent("parliament:sourcechange", { detail: { id } }));
      try {
        const engine = await player();
        if (ticket === revision) await engine.open(id, options);
      }
      catch {
        document.dispatchEvent(new CustomEvent("parliament:sourcechange", { detail: { id: null } }));
        const panel = document.querySelector("#detail-panel");
        panel.hidden = false;
        panel.textContent = window.ParliamentStreamsI18n.message(document.documentElement.lang, "sourceError");
      }
    },
    mount() { window.ParliamentStreamsPlayer?.mount(); },
  };
})();
