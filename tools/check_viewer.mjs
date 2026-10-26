import assert from "node:assert/strict";

// Called with the existing muted, local HLS fixture: no live media is requested.
export async function assertPersistentViewer(page, baseUrl) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.evaluate(() => {
    window.__viewerContinuity = {
      root: document.querySelector("#detail-panel"),
      video: document.querySelector("#media-frame video"),
    };
  });
  const continuity = async () => {
    assert.equal(await page.evaluate(() => Boolean(
      window.__viewerContinuity
      && window.__viewerContinuity.root === document.querySelector("#detail-panel")
      && window.__viewerContinuity.video === document.querySelector("#media-frame video")
      && window.__viewerContinuity.video.isConnected
    )), true, "Navigation must retain the same attached player, not resume a replacement");
    assert.equal(await page.locator("#detail-panel").count(), 1);
  };
  const go = async (file, heading) => {
    await page.locator(`.site-header nav a[href*="${file}"]`).click();
    await page.locator(heading).waitFor();
    await page.waitForFunction(() => !document.documentElement.classList.contains("page-loading"));
    await continuity();
    assert.equal(await page.locator(heading).evaluate((node) => document.activeElement === node), true);
  };
  let releaseCss;
  let cssRequested;
  const cssGate = new Promise((resolve) => { releaseCss = resolve; });
  const requested = new Promise((resolve) => { cssRequested = resolve; });
  await page.route("**/map.css*", async (route) => { cssRequested(); await cssGate; await route.continue(); });
  const mapNavigation = go("map.html", "#map-title");
  await requested;
  assert.equal(await page.locator('#page-title').isVisible(), true, "Keep the styled current page until destination CSS is ready");
  await continuity();
  releaseCss();
  await mapNavigation;
  await page.unroute("**/map.css*");
  await page.route("**/schedule.css*", (route) => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.locator('#map-nav-schedule').click();
  await page.locator('.navigation-error').waitFor();
  assert.match(page.url(), /map.html/);
  assert.equal(await page.locator('#map-title').isVisible(), true);
  await continuity();
  await page.unroute("**/schedule.css*");
  await go("schedule.html", "#schedule-title");
  await go("institutions.html", "#institutions-title");
  await go("data.html", "#data-title");
  const dataCanonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  assert.match(dataCanonical, /\/data.html$/);
  await page.goBack();
  await page.locator("#institutions-title").waitFor();
  await page.waitForFunction(() => !document.documentElement.classList.contains("page-loading"));
  await continuity();
  await page.goForward();
  await page.locator("#data-title").waitFor();
  await page.waitForFunction(() => !document.documentElement.classList.contains("page-loading"));
  await continuity();
  // Ordinary links remain usable; a failed enhanced navigation keeps playback.
  await page.route("**/map.html*", (route) => route.fulfill({ status: 503, contentType: "text/html", body: "Temporarily unavailable" }));
  await page.locator('#data-nav-map').click();
  await page.locator(".navigation-error").waitFor();
  assert.match(page.url(), /data.html/);
  await continuity();
  await page.unroute("**/map.html*");
  await go("map.html", "#map-title");
  await page.locator("#locale-select").selectOption("fr");
  await page.waitForURL(/lang=fr/);
  await page.waitForFunction(() => !document.documentElement.classList.contains("page-loading"));
  await continuity();
  assert.equal(await page.locator("#detail-panel").getAttribute("lang"), "fr");
  await page.locator('.site-header nav a[href*="./"], .site-header nav a[href*="index.html"], #map-nav-catalogue').last().click();
  await page.locator("#search").waitFor();
  await page.waitForFunction(() => !document.documentElement.classList.contains("page-loading"));
  await continuity();
  const listWidth = (await page.locator(".channel-table").boundingBox()).width;
  await page.locator("#search").fill("no matching source in this fixture");
  assert.equal(await page.locator(".channel-button").count(), 0);
  await continuity();
  await page.locator("#search").fill("");
  await page.locator("#sort-source").click();
  await continuity();
  assert.equal((await page.locator(".channel-table").boundingBox()).width, listWidth);
  const panel = page.locator("#detail-panel");
  const before = await panel.boundingBox();
  await page.locator("[data-move-viewer]").press("ArrowLeft");
  assert.equal(Math.round((await panel.boundingBox()).x), Math.round(before.x - 10));
  await page.locator("[data-resize-viewer]").press("Shift+ArrowRight");
  assert.equal(Math.round((await panel.boundingBox()).width), Math.round(before.width + 40));
  await page.locator("[data-resize-viewer]").press("Home");
  const handle = await page.locator("[data-move-viewer]").boundingBox();
  const start = await panel.boundingBox();
  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
  await page.mouse.down();
  await page.mouse.move(handle.x + handle.width / 2 - 60, handle.y + handle.height / 2 - 50, { steps: 5 });
  await page.mouse.up();
  assert.equal(Math.round((await panel.boundingBox()).x), Math.round(start.x - 60));
  const grip = await page.locator("[data-resize-viewer]").boundingBox();
  const size = await panel.boundingBox();
  await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
  await page.mouse.down();
  await page.mouse.move(grip.x + grip.width / 2 - 40, grip.y + grip.height / 2 - 30, { steps: 5 });
  await page.mouse.up();
  assert.equal(Math.round((await panel.boundingBox()).width), Math.round(size.width + 40));
  await page.locator("[data-minimize-viewer]").click();
  assert.equal(await panel.evaluate((node) => node.classList.contains("is-minimized")), true);
  await continuity();
  await page.locator("[data-minimize-viewer]").click();
  await continuity();
  await page.setViewportSize({ width: 1160, height: 740 });
  await page.waitForFunction(() => {
    const box = document.querySelector('#detail-panel').getBoundingClientRect();
    return box.x >= 15 && box.y >= 15 && box.right <= 1145 && box.bottom <= 725;
  });
  const fitted = await panel.boundingBox();
  assert(fitted.x >= 15 && fitted.y >= 15 && fitted.x + fitted.width <= 1145 && fitted.y + fitted.height <= 725);
  await page.setViewportSize({ width: 390, height: 844 });
  await continuity();
  assert.equal(await page.locator(".detail-grabber").isVisible(), true);
  assert.equal(await page.locator("[data-move-viewer]").isVisible(), false);
  const mobile = await panel.boundingBox();
  assert.equal(Math.round(mobile.width), 390);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.locator(".detail-grabber").click();
  await continuity();
  await page.locator("#detail-title").press("Escape");
  assert.equal(await panel.isVisible(), false);
  assert.equal(await page.locator("#media-frame iframe").count(), 0);
  assert.equal(await page.evaluate(() => window.__hlsSmoke.destroyed), 1, "Closing must release the HLS instance exactly once");
  assert.deepEqual(errors, []);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator("#locale-select").selectOption("en");
}

export async function assertNavigationStyles(page, baseUrl) {
  await page.goto(`${baseUrl}index.html?lang=en`);
  await page.locator('.channel-button').first().waitFor();
  await page.locator('#locale-select').selectOption('en');
  const pages = [
    ["institutions.html", "#institutions-title", [".institutions-filters", "#institution-search", ".institution-country > summary"]],
    ["map.html", "#map-title", [".map-summary", ".map-toolbar", "#world-map"]],
    ["schedule.html", "#schedule-title", [".schedule-intro", ".schedule-filters", ".schedule-table"]],
    ["data.html", "#data-title", [".page-intro", "#data-title"]],
    ["index.html", "#page-title", [".channel-table", "#search"]],
  ];
  const layout = async (selectors) => page.evaluate((targets) => ({
    locale: document.documentElement.lang,
    stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')]
      .filter((node) => node.media !== "not all")
      .map((node) => new URL(node.href).pathname).sort(),
    layout: targets.map((selector) => {
      const style = getComputedStyle(document.querySelector(selector));
      return Object.fromEntries(["display", "gridTemplateColumns", "fontSize", "padding", "borderTopWidth", "width"].map((key) => [key, style[key]]));
    }),
    overflow: document.documentElement.scrollWidth > innerWidth,
  }), selectors);
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const expected = new Map();
    for (const [file, , selectors] of pages) {
      await page.goto(`${baseUrl}${file}?lang=en`);
      await page.waitForFunction(() => window.ParliamentStreamsViewer);
      await page.evaluate(async () => { await window.ParliamentStreamsPageReady; await window.ParliamentStreamsViewer.ready; });
      await page.locator(selectors.at(-1)).first().waitFor({ state: "attached" });
      expected.set(file, await layout(selectors));
    }
    for (const [file, heading, selectors] of pages) {
      const link = file === "index.html" ? '#data-nav-catalogue' : `.site-header nav a[href*="${file}"]`;
      await page.locator(link).click();
      await page.locator(heading).waitFor();
      await page.waitForFunction(() => !document.documentElement.classList.contains("page-loading"));
      assert.deepEqual(await layout(selectors), expected.get(file), `${file} at ${width}px must match a fresh load without refreshing`);
    }
  }
}

export async function assertProviderViewer(page, baseUrl) {
  await page.route("https://www.youtube-nocookie.com/embed/**", (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><html lang='en'><title>Local provider fixture</title><body>Silent local provider fixture</body></html>" }));
  await page.goto(`${baseUrl}index.html?lang=en`);
  await page.locator('[data-channel-id="australia-parliament-youtube"]').click();
  await page.locator("#media-frame iframe").waitFor();
  await page.frameLocator("#media-frame iframe").locator("body").waitFor();
  await page.evaluate(() => {
    window.__providerViewer = { frame: document.querySelector("#media-frame iframe"), loads: 0 };
    window.__providerViewer.frame.addEventListener("load", () => window.__providerViewer.loads++);
  });
  const originalLoads = await page.evaluate(() => window.__providerViewer.loads);
  for (const [link, heading] of [["#nav-schedule", "#schedule-title"], ["#schedule-nav-map", "#map-title"]]) {
    await page.locator(link).click();
    await page.locator(heading).waitFor();
    await page.waitForFunction(() => !document.documentElement.classList.contains("page-loading"));
    assert.equal(await page.evaluate(() => window.__providerViewer.frame === document.querySelector("#media-frame iframe")), true);
  }
  await page.locator("#locale-select").selectOption("fr");
  await page.waitForURL(/lang=fr/);
  await page.waitForFunction(() => !document.documentElement.classList.contains("page-loading"));
  assert.equal(await page.evaluate(() => window.__providerViewer.frame === document.querySelector("#media-frame iframe")), true);
  assert.equal(await page.evaluate(() => window.__providerViewer.loads), originalLoads, "Provider iframe must not reload on navigation or translation");
  // Open a different source from the map in-place, without another catalogue route.
  await page.locator('[data-minimize-viewer]').click();
  await page.locator('#map-search').fill('Alberta');
  await page.locator('#jurisdiction-list button').first().click();
  const source = page.locator('#map-detail [data-viewer-source="alberta-assembly-online"]');
  await source.click();
  assert.match(page.url(), /map.html/);
  assert.match(await page.locator("#detail-title").innerText(), /Alberta/);
  assert.equal(await page.locator("#media-frame iframe").count(), 0);
  await page.locator("[data-close-detail]").click();
  await page.locator('#map-nav-schedule').click();
  await page.locator('#schedule-title').waitFor();
  await page.waitForFunction(() => !document.documentElement.classList.contains("page-loading"));
  const details = page.locator('.schedule-details').first();
  const id = await details.getAttribute('data-viewer-source');
  await details.click();
  assert.match(page.url(), /schedule.html/);
  assert.equal(await page.locator('#detail-title').innerText(), await page.evaluate((key) => window.PARLIAMENT_STREAMS_CATALOGUE.channels.find((channel) => channel.id === key).name, id));
  await page.locator('[data-close-detail]').click();
  await page.locator('#schedule-nav-institutions').click();
  await page.waitForFunction(() => !document.documentElement.classList.contains("page-loading"));
  await page.locator('#institution-search').fill('Alberta');
  await page.locator('#canada--alberta .institution-viewing a').first().click();
  assert.match(page.url(), /institutions.html/);
  assert.match(await page.locator('#detail-title').innerText(), /Alberta/);
  await page.locator('[data-close-detail]').click();
}
