/* Progressive navigation: replace page content while the shared viewer stays attached. */
(() => {
  if (window.ParliamentStreamsNavigation || location.protocol === "file:") return;
  const base = new URL("./", document.currentScript.src);
  const pages = new Set(["", "index.html", "map.html", "schedule.html", "institutions.html", "data.html"]);
  const controllers = new Set(["catalogue.js", "map.js", "schedule.js", "institutions.js", "data-page.js", "iptv.js"]);
  const loaded = new Set([...document.scripts].filter((script) => script.src).map((script) => new URL(script.src).pathname));
  const styles = new Map([...document.querySelectorAll('link[rel="stylesheet"]')].map((node) => [node.href, { node, ready: Promise.resolve() }]));
  const positions = new Map();
  let lifecycle = new AbortController();
  let request;
  let revision = 0;
  let currentUrl = location.href;
  let commits = Promise.resolve();
  let mounting = false;
  let active = false;
  document.addEventListener("DOMContentLoaded", () => { active = true; }, { once: true });
  const status = document.createElement("p");
  status.className = "visually-hidden";
  status.setAttribute("role", "status");
  document.body.append(status);

  function isPage(url) {
    return url.origin === base.origin && url.pathname.startsWith(base.pathname)
      && pages.has(url.pathname.slice(base.pathname.length));
  }

  function loadScript(source) {
    const url = new URL(source, base);
    const name = url.pathname.split("/").at(-1);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return Promise.resolve();
    if (loaded.has(url.pathname) && !controllers.has(name)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url.href;
      script.onload = () => { loaded.add(url.pathname); script.remove(); resolve(); };
      script.onerror = () => { script.remove(); reject(new Error("Page script unavailable")); };
      document.body.append(script);
    });
  }

  async function prepareStyles(next) {
    const desired = [...next.querySelectorAll('link[rel="stylesheet"]')].map((link) => ({
      href: new URL(link.getAttribute("href"), base).href,
      media: link.getAttribute("media") ?? "all",
    }));
    await Promise.all(desired.map(({ href }) => {
      if (!styles.has(href)) {
        const node = document.createElement("link");
        node.rel = "stylesheet";
        node.href = href;
        // Fetch before replacing content, without styling the current page.
        node.media = "not all";
        const ready = new Promise((resolve, reject) => {
          node.onload = resolve;
          node.onerror = () => { styles.delete(href); node.remove(); reject(new Error("Page stylesheet unavailable")); };
        });
        styles.set(href, { node, ready });
        document.head.append(node);
      }
      return styles.get(href).ready;
    }));
    return () => {
      for (const { node } of styles.values()) node.media = "not all";
      for (const { href, media } of desired) {
        const { node } = styles.get(href);
        node.media = media;
        document.head.append(node);
      }
    };
  }

  function scrollToTarget(url, back) {
    const saved = positions.get(url.href);
    const target = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (back && saved) window.scrollTo(...saved);
    else if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
    const heading = target || document.querySelector("main h1");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
  }

  async function navigate(href, { back = false } = {}) {
    const url = new URL(href, location.href);
    if (!isPage(url)) return;
    const ticket = ++revision;
    if (mounting) lifecycle.abort();
    request?.abort();
    request = new AbortController();
    if (!back) positions.set(location.href, [scrollX, scrollY]);
    document.documentElement.classList.add("page-loading");
    status.className = "visually-hidden";
    status.textContent = "";
    let finishCommit;
    try {
      const response = await fetch(url, { signal: request.signal, headers: { Accept: "text/html" } });
      if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) throw new Error("Page unavailable");
      const next = new DOMParser().parseFromString(await response.text(), "text/html");
      const selectors = [".site-header", "main", ".site-footer", ".skip-link"];
      if (selectors.some((selector) => !next.querySelector(selector) || !document.querySelector(selector))) throw new Error("Page structure unavailable");
      const activateStyles = await prepareStyles(next);
      if (ticket !== revision) return;
      const previousCommit = commits;
      commits = new Promise((resolve) => { finishCommit = resolve; });
      await previousCommit;
      if (ticket !== revision) return;
      mounting = true;
      lifecycle.abort();
      lifecycle = new AbortController();
      if (!back) history.pushState({}, "", url);
      currentUrl = url.href;
      activateStyles();
      for (const selector of selectors) document.querySelector(selector).replaceWith(next.querySelector(selector));
      document.body.className = next.body.className;
      document.title = next.title;
      document.documentElement.lang = next.documentElement.lang;
      for (const selector of ['meta[name="description"]', 'meta[property^="og:"]', 'meta[name^="twitter:"]', 'link[rel="canonical"]', '#page-structured-data']) {
        document.head.querySelectorAll(selector).forEach((node) => node.remove());
        next.head.querySelectorAll(selector).forEach((node) => document.head.append(node.cloneNode(true)));
      }
      window.ParliamentStreamsPageReady = Promise.resolve();
      for (const script of next.querySelectorAll("script[src]")) {
        if (ticket !== revision) return;
        await loadScript(script.getAttribute("src"));
        await window.ParliamentStreamsPageReady;
      }
      await window.ParliamentStreamsPageReady;
      if (ticket !== revision) return;
      await window.ParliamentStreamsViewer?.mount();
      scrollToTarget(url, back);
      status.textContent = document.title;
      document.dispatchEvent(new CustomEvent("parliament:pagechange"));
    } catch (error) {
      if (ticket !== revision || error.name === "AbortError") return;
      // A transient navigation failure must not tear down a playing stream.
      status.textContent = window.ParliamentStreamsViewerI18n?.message(document.documentElement.lang, "navigationError") ?? "Unable to load this page. Please try the link again.";
      status.className = "navigation-error";
      if (back) history.replaceState({}, "", currentUrl);
    } finally {
      if (finishCommit) { mounting = false; finishCommit(); }
      if (ticket === revision) document.documentElement.classList.remove("page-loading");
    }
  }

  window.ParliamentStreamsNavigation = {
    get signal() { return lifecycle.signal; },
    cleanup(callback) { lifecycle.signal.addEventListener("abort", callback, { once: true }); },
    navigate,
  };
  document.addEventListener("click", (event) => {
    if (!active || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.target || link.hasAttribute("download")) return;
    const url = new URL(link.href, location.href);
    if (link.dataset.viewerSource && window.ParliamentStreamsViewer) {
      event.preventDefault();
      window.ParliamentStreamsViewer.open(link.dataset.viewerSource, { play: link.dataset.viewerPlay === "true", trigger: link });
      return;
    }
    if (!isPage(url)) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) {
      event.preventDefault();
      positions.set(location.href, [scrollX, scrollY]);
      history.pushState({}, "", url);
      currentUrl = url.href;
      scrollToTarget(url, false);
      return;
    }
    event.preventDefault();
    navigate(url.href);
  });
  window.addEventListener("popstate", () => {
    const next = new URL(location.href);
    const current = new URL(currentUrl);
    if (next.pathname === current.pathname && next.search === current.search) {
      currentUrl = next.href;
      scrollToTarget(next, true);
      return;
    }
    navigate(next.href, { back: true });
  });
})();
