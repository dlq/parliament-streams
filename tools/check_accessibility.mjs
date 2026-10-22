import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const root = normalize(join(fileURLToPath(new URL("..", import.meta.url))));
const canonicalCatalogue = JSON.parse(await readFile(join(root, "data/channels.json"), "utf8"));
const canonicalFallbacks = JSON.parse(await readFile(join(root, "data/fallbacks.json"), "utf8"));
const [hlsPackage, d3Package] = await Promise.all(["hls.js", "d3"].map(async (name) =>
  JSON.parse(await readFile(join(root, "node_modules", name, "package.json"), "utf8"))
));
const documentedAdmin1 = JSON.parse(await readFile(join(root, "site/assets/maps/documented-admin1.geojson"), "utf8"));
assert.equal(documentedAdmin1.features.length, 34);
assert(documentedAdmin1.features.every((feature) => feature.geometry.type === "MultiPolygon"));
const expectedPlayableCount = canonicalCatalogue.channels.filter((channel) => {
  return ["native_playback", "provider_embed"].includes(channel.playback_policy);
}).length;
const expectedScheduleCount = canonicalCatalogue.channels.filter((channel) =>
  channel.epg_sources.some((source) => source.scraper_status === "implemented")
).length;
const expectedJurisdictionCount = new Set(canonicalCatalogue.channels.map(
  (channel) => `${channel.jurisdiction_level}:${channel.country_or_region}`,
)).size;
const expectedDocumentedCountryCodes = new Set(canonicalCatalogue.channels
  .filter((channel) => channel.jurisdiction_level === "national")
  .map((channel) => channel.country_or_region === "Taiwan" ? "TW" : channel.external_ids?.ipu_country_code)
  .filter(Boolean));
documentedAdmin1.features.forEach((feature) => {
  expectedDocumentedCountryCodes.add(feature.properties.parent_code);
});
const expectedUpdatedDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${canonicalCatalogue.generated_on}T00:00:00Z`));
const expectedHeroImages = [
  "house-of-commons-1890.jpg",
  "south-australia-parliament-1939.jpg",
  "reichstag-berlin-1890s.jpg",
  "hungary-parliament-interior.jpg",
  "new-south-wales-assembly-1872.jpg",
  "austrian-parliament-interior.jpg",
];
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const relativePath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    let path = normalize(join(root, relativePath));
    assert(path.startsWith(root));
    if ((await stat(path)).isDirectory()) path = join(path, "index.html");
    response.writeHead(200, { "Content-Type": contentTypes[extname(path)] ?? "application/octet-stream" });
    response.end(await readFile(path));
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

function contrastRatio(first, second) {
  const luminance = (colour) => colour
    .map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    })
    .reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0);
  const values = [luminance(first), luminance(second)].sort((left, right) => right - left);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function rgb(value) {
  const channels = value.match(/\d+/g)?.slice(0, 3).map(Number);
  assert.equal(channels?.length, 3, `Expected an RGB colour, received ${value}`);
  return channels;
}

async function assertNoAxeViolations(page, context) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    // YouTube's cross-origin player markup is outside this repository's control.
    .exclude("#media-frame iframe")
    .analyze();
  assert.deepEqual(
    results.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
    })),
    [],
    `${context} has Axe violations`,
  );
}

async function assertPlaybackAlignment(page) {
  const offsets = await page.locator('.channel-row').evaluateAll((rows) => {
    const headerX = document.querySelector('#sort-mode').getBoundingClientRect().x;
    const textTop = (element) => {
      const range = document.createRange();
      range.selectNodeContents(element.firstChild);
      return range.getBoundingClientRect().y;
    };
    return rows.map((row) => {
      const placeholder = row.querySelector('.watch-action');
      const action = row.querySelector('.row-direct-watch') ?? placeholder;
      return {
        name: row.querySelector('.channel-name').textContent,
        horizontal: Math.abs(action.getBoundingClientRect().x - headerX),
        vertical: Math.abs(textTop(action) - textTop(placeholder)),
      };
    });
  });
  for (const { name, horizontal, vertical } of offsets) {
    assert(horizontal < 1, `${name}: playback is ${horizontal}px away from its header`);
    assert(vertical < 1, `${name}: playback text is ${vertical}px away from the row baseline`);
  }
}

async function assertSearchMetadata(page, path = '') {
  const canonical = `https://dlq.ca/parliament-streams/${path}`;
  assert.match(await page.title(), /Parliament Streams/);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), canonical);
  assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), canonical);
  assert.equal(await page.locator('meta[property="og:site_name"]').getAttribute('content'), 'Parliament Streams');
  for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
    assert.equal(await page.locator(selector).getAttribute('content'), await page.title());
  }
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    assert.equal(await page.locator(selector).getAttribute('content'), description);
  }
  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    assert.equal(await page.locator(selector).getAttribute('content'), 'https://dlq.ca/parliament-streams/assets/brand/parliament-streams-social.png');
  }
  const graph = JSON.parse(await page.locator('#page-structured-data').textContent());
  assert.equal(graph['@context'], 'https://schema.org');
  const pageNode = graph['@graph'].find((node) => node['@type'] !== 'WebSite');
  assert.equal(pageNode.url, canonical);
  assert.equal(pageNode.name, await page.title());
  assert.equal(pageNode.description, description);
  assert.equal(pageNode.inLanguage, await page.locator('html').getAttribute('lang'));
}

async function assertIptvDisclosure(page) {
  const disclosure = page.locator('.iptv-disclosure');
  assert.equal(await disclosure.getAttribute('open'), null);
  await disclosure.locator(':scope > summary').click();
  const paths = ['stable-hls.m3u8', 'validated-hls.m3u8', 'epg.xml'];
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text) => { window.__iptvCopied = text; } },
    });
  });
  for (const [index, path] of paths.entries()) {
    const url = `https://dlq.ca/parliament-streams/data/${path}`;
    assert.equal(await disclosure.locator('.iptv-resource a').nth(index).getAttribute('href'), url);
    assert.equal(await disclosure.locator('input').nth(index).inputValue(), url);
    await disclosure.locator('[data-copy]').nth(index).click();
    assert.equal(await page.evaluate(() => window.__iptvCopied), url);
    assert.match(await disclosure.locator('[role="status"]').innerText(), /URL copied/);
  }
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => { throw new Error('Clipboard denied'); };
  });
  await disclosure.locator('[data-copy]').first().click();
  const input = disclosure.locator('input').first();
  assert.equal(await input.evaluate((element) => document.activeElement === element
    && element.selectionStart === 0 && element.selectionEnd === element.value.length), true);
  assert.match(await disclosure.locator('[role="status"]').innerText(), /copy manually/);
  await disclosure.locator('.iptv-vlc > summary').click();
  assert.match(await disclosure.locator('.iptv-vlc').innerText(), /Media → Open Network Stream/);
  assert.match(await disclosure.locator('.iptv-vlc').innerText(), /File → Open Network/);
  assert.equal(await disclosure.locator('.iptv-vlc a').getAttribute('href'), 'https://docs.videolan.me/vlc-user/desktop/3.0/en/basic/media.html');
  await assertNoAxeViolations(page, 'Expanded IPTV and VLC instructions');
  await disclosure.locator(':scope > summary').click();
}

async function assertIptvLocales(page, localeSelect) {
  const locales = await page.evaluate(() => window.ParliamentStreamsI18n.locales.map(([code]) => code));
  const disclosure = page.locator('.iptv-disclosure');
  await page.evaluate(() => { window.__localeNavigationSentinel = true; });
  if (!(await disclosure.evaluate((element) => element.open))) await disclosure.locator(':scope > summary').click();
  if (!(await disclosure.locator('.iptv-vlc').evaluate((element) => element.open))) await disclosure.locator('.iptv-vlc > summary').click();
  for (const locale of locales) {
    await page.locator(localeSelect).selectOption(locale);
    assert.equal(await page.evaluate(() => window.__localeNavigationSentinel), true, 'Changing language updates the page without reloading');
    assert.deepEqual(await page.evaluate((code) => window.ParliamentStreamsIptvI18n.coverage(code), locale), [], `Missing IPTV/VLC translations for ${locale}`);
    assert.equal(await disclosure.getAttribute('lang'), locale);
    assert.equal(await disclosure.locator('.iptv-vlc').getAttribute('lang'), locale);
    assert.equal(await disclosure.locator('.iptv-vlc').evaluate((element) => element.open), true, 'Language changes preserve expanded VLC help');
    assert.equal(await disclosure.locator('.iptv-vlc li').count(), 3);
    assert.equal(await disclosure.locator('.iptv-vlc a').getAttribute('hreflang'), 'en');
    if (locale !== 'en') assert.doesNotMatch(await disclosure.locator('.iptv-vlc > summary').innerText(), /VLC desktop instructions/);
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (url) => { window.__iptvCopied = url; } } });
    });
    await disclosure.locator('[data-copy]').first().click();
    assert.equal(await page.evaluate(() => window.__iptvCopied), 'https://dlq.ca/parliament-streams/data/stable-hls.m3u8');
    assert((await disclosure.locator('[role="status"]').innerText()).trim());
    if (locale !== 'en') assert.doesNotMatch(await disclosure.locator('[role="status"]').innerText(), /URL copied/);
    await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Clipboard denied'); }; });
    await disclosure.locator('[data-copy]').first().click();
    assert.equal(await disclosure.locator('input').first().evaluate((element) => document.activeElement === element && element.selectionStart === 0 && element.selectionEnd === element.value.length), true);
    if (locale !== 'en') assert.doesNotMatch(await disclosure.locator('[role="status"]').innerText(), /copy manually/);
    const overflow = await disclosure.evaluate((element) => element.scrollWidth > element.clientWidth + 1);
    assert.equal(overflow, false, `IPTV help overflows in ${locale}`);
  }
  await page.locator(localeSelect).selectOption('en');
  await disclosure.locator(':scope > summary').click();
}

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
assert(address && typeof address === "object");
const baseUrl = `http://127.0.0.1:${address.port}/site/`;
const browser = await chromium.launch();

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  // Exercise the actual local HLS library without depending on a live broadcaster.
  const hlsPage = await context.newPage();
  const hlsChannel = canonicalCatalogue.channels.find((channel) =>
    channel.playback_policy === "native_playback" && channel.playback_url?.includes(".m3u8")
  );
  assert(hlsChannel, "The catalogue must contain a direct HLS source");
  const hlsPlaylistUrl = new URL("test-fixtures/vendor-smoke.m3u8", baseUrl).href;
  const hlsLibraryRequests = [];
  const externalHlsRequests = [];
  hlsPage.on("request", (request) => {
    if (new URL(request.url()).pathname.endsWith("/assets/vendor/hls.min.js")) {
      hlsLibraryRequests.push(request.url());
    }
  });
  await hlsPage.route("**/*", (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.origin !== new URL(baseUrl).origin) {
      externalHlsRequests.push(requestUrl.href);
      return route.abort();
    }
    if (requestUrl.pathname.endsWith("/data/channels.json")) {
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          ...canonicalCatalogue,
          channels: canonicalCatalogue.channels.map((channel) => channel.id === hlsChannel.id
            ? { ...channel, playback_url: hlsPlaylistUrl } : channel),
        }),
      });
    }
    if (requestUrl.href === hlsPlaylistUrl) {
      return route.fulfill({
        contentType: "application/vnd.apple.mpegurl",
        body: "#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:6\n#EXT-X-MEDIA-SEQUENCE:0\n#EXTINF:6.0,\nsegment.ts\n#EXT-X-ENDLIST\n",
      });
    }
    if (requestUrl.pathname.endsWith("/test-fixtures/segment.ts")) return route.abort();
    return route.continue();
  });
  await hlsPage.addInitScript(() => {
    const observation = window.__hlsSmoke = {};
    const canPlayType = HTMLMediaElement.prototype.canPlayType;
    HTMLMediaElement.prototype.canPlayType = function (type) {
      return /mpegurl/i.test(type) ? "" : canPlayType.call(this, type);
    };
    // The finite fixture deliberately has no video bytes, so autoplay cannot complete.
    HTMLMediaElement.prototype.play = function () {
      observation.playedVideo = this === document.querySelector("#media-frame video");
      return Promise.resolve();
    };
    let library;
    Object.defineProperty(window, "Hls", {
      configurable: true,
      get: () => library,
      set: (value) => {
        library = value;
        const loadSource = value.prototype.loadSource;
        value.prototype.loadSource = function (url) {
          observation.source = url;
          return loadSource.call(this, url);
        };
        const attachMedia = value.prototype.attachMedia;
        value.prototype.attachMedia = function (media) {
          observation.attachedVideo = media === document.querySelector("#media-frame video");
          this.on(value.Events.MEDIA_ATTACHED, () => { observation.mediaAttached = true; });
          this.on(value.Events.MANIFEST_PARSED, () => { observation.manifestParsed = true; });
          return attachMedia.call(this, media);
        };
      },
    });
  });
  await hlsPage.goto(`${baseUrl}index.html?lang=en&source=${hlsChannel.id}`);
  await hlsPage.waitForSelector("[data-start-playback]");
  assert.equal(await hlsPage.evaluate(() => Boolean(window.Hls)), false, "HLS must load lazily");
  await hlsPage.locator(".play-button[data-start-playback]").click();
  await hlsPage.waitForFunction(() => window.__hlsSmoke.mediaAttached && window.__hlsSmoke.manifestParsed);
  const hlsRuntime = await hlsPage.evaluate(() => ({
    ...window.__hlsSmoke,
    version: window.Hls.version,
    vendor: window.PARLIAMENT_STREAMS_VENDOR.hls,
  }));
  assert.equal(hlsRuntime.version, hlsPackage.version);
  assert.equal(hlsRuntime.vendor.version, hlsPackage.version);
  assert.equal(hlsRuntime.source, hlsPlaylistUrl);
  assert.equal(hlsRuntime.attachedVideo, true);
  assert.equal(hlsRuntime.playedVideo, true);
  assert.equal(hlsLibraryRequests.length, 1, "Playback must use the local HLS asset");
  assert.equal(new URL(hlsLibraryRequests[0]).origin, new URL(baseUrl).origin);
  assert.equal(new URL(hlsLibraryRequests[0]).searchParams.get("v"), hlsRuntime.vendor.sha256);
  assert.deepEqual(externalHlsRequests, [], "HLS playback must not request a CDN or live broadcaster");
  await hlsPage.close();
  const page = await context.newPage();
  await page.route("**/data/schedules.json", (route) => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({
      channels: {
        "european-parliament-multimedia-centre": {
          current_event_title: "Committee on the Environment",
          current_event_time: "Live now",
          current_event_start: "2026-08-17T12:00:00Z",
          next_event_title: "Plenary sitting",
          next_event_time: "4:00 PM",
          next_event_start: "2026-08-17T16:00:00Z",
          fetched_at: "2026-08-17T12:00:00Z",
        },
        "canada-house-of-commons-parlvu": {
          current_event_title: "House of Commons sitting",
          current_event_time: "Live now",
          current_event_url: "https://parlvu.parl.gc.ca/Harmony/en/PowerBrowser/PowerBrowserV2/20260819/-1/15441",
          current_event_id: "15441",
          current_event_status: "In Progress",
          current_event_location: "House of Commons",
          current_event_language: "en",
          next_event_title: "Finance committee",
          next_event_time: "2:00 PM",
          next_event_url: "https://parlvu.parl.gc.ca/Harmony/en/PowerBrowser/PowerBrowserV2/20260819/-1/15442",
          next_event_id: "15442",
          next_event_status: "Not Started",
          next_event_location: "Room 253-D",
          next_event_language: "en",
          fetched_at: "2026-08-17T12:00:00Z",
        },
        "australia-parliament-youtube": {
          current_event_title: "Australia Parliament live",
          current_event_time: "Live now",
          current_event_url: "https://www.youtube.com/watch?v=abcDEF12345",
          current_event_id: "abcDEF12345",
          current_event_status: "Live now",
          next_event_title: null,
          next_event_time: null,
          fetched_at: "2026-08-17T12:00:00Z",
        },
      },
    }),
  }));
  await page.goto(baseUrl);
  await page.waitForSelector(".channel-button");
  assert.equal(await page.locator('meta[property="og:image:width"]').getAttribute("content"), "1200");
  assert.equal(await page.locator('meta[property="og:image:height"]').getAttribute("content"), "630");
  assert.match(await page.locator('meta[property="og:image"]').getAttribute("content"), /parliament-streams-social\.png$/);
  assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute("content"), "summary_large_image");
  const heroBackground = await page.locator(".intro").evaluate((element) => getComputedStyle(element).backgroundImage);
  assert.ok(expectedHeroImages.some((image) => heroBackground.includes(image)), `Unexpected hero background: ${heroBackground}`);
  assert.match(await page.locator(".hero-credit").innerText(), /(Public domain|CC0)/);
  assert.match(await page.locator("#open-video-copy").innerText(), /streams such as HLS/);
  assert.match(await page.locator("#open-streams-copy").innerText(), /machine-readable programme and event feeds/);
  assert.equal(await page.locator("#detail-panel").isVisible(), false);
  assert((await page.locator(".channel-button").first().boundingBox()).y < 720);
  await page.locator(".catalogue-information > summary").click();
  assert.equal(await page.locator("#metric-sources").innerText(), String(canonicalCatalogue.channels.length));
  assert.equal(await page.locator("#metric-playable").innerText(), String(expectedPlayableCount));
  assert.equal(await page.locator("#metric-schedules").innerText(), String(expectedScheduleCount));
  assert.equal(await page.locator("#metric-updated").innerText(), expectedUpdatedDate);
  assert.equal(await page.locator(".principles-index li").count(), 5);
  assert.equal(await page.locator("#nav-map").innerText(), "Coverage map");
  assert.equal(await page.locator("#nav-schedule").innerText(), "Schedule");
  assert.equal(await page.locator("#level-filter").count(), 1);
  assert.equal(await page.locator("#format-filter").count(), 1);
  assert.equal(await page.locator("#playback-filter").count(), 0);
  assert.equal(await page.locator("#rights-filter").count(), 0);
  assert(canonicalFallbacks.fallbacks.length >= 6);
  await assertPlaybackAlignment(page);
  await assertSearchMetadata(page);
  await assertIptvDisclosure(page);
  await assertIptvLocales(page, '#locale-select');
  await page.setViewportSize({ width: 320, height: 740 });
  await assertIptvLocales(page, '#locale-select');
  await page.setViewportSize({ width: 1280, height: 900 });
  await assertNoAxeViolations(page, "Desktop catalogue");

  const localeCoverage = await page.evaluate(() => window.ParliamentStreamsI18n.locales.map(([locale]) => ({
    locale,
    coverage: window.ParliamentStreamsI18n.translationCoverage(locale),
  })));
  assert.deepEqual(
    localeCoverage.filter(({ coverage }) => coverage.messages.length || coverage.labels.length),
    [],
    "Every locale must explicitly cover every interface message and label",
  );
  for (const { locale } of localeCoverage) {
    await page.locator("#locale-select").selectOption(locale);
    assert.equal(await page.locator("html").getAttribute("lang"), locale);
    await assertSearchMetadata(page);
    assert((await page.locator("#catalogue-title").innerText()).trim());
    assert((await page.locator("#level-filter option").first().innerText()).trim());
    assert.equal(await page.locator("#detail-panel").isVisible(), false);
    assert.equal(await page.locator("#sort-status").getAttribute("lang"), locale);
  }
  await page.locator("#locale-select").selectOption("en");

  assert.deepEqual(await page.evaluate(() => ['zh-TW', 'zh-HK', 'zh-MO', 'zh-Hant-TW', 'zh-Hans-TW', 'cs-CZ', 'fi-FI', 'sv-FI'].map(window.ParliamentStreamsI18n.supportedLocale)), ['zh-Hant', 'zh-Hant', 'zh-Hant', 'zh-Hant', 'zh-Hans', 'cs', 'fi', 'sv']);
  assert.deepEqual(await page.evaluate(() => [1, 2, 5].map((count) => window.ParliamentStreamsMapI18n.sourceCount('cs', count))), ['1 zdroj', '2 zdroje', '5 zdrojů']);

  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator("#search").fill("Canada");
    for (const region of ["Alberta", "Ontario", "Quebec"]) {
      const expected = canonicalCatalogue.channels.filter((channel) => channel.country_or_region === region);
      assert(expected.length > 0);
      for (const channel of expected) {
        assert.equal(await page.locator(`[data-channel-id="${channel.id}"]`).count(), 1, `Canada search must include ${region}`);
      }
    }
    assert.equal(await page.locator('[data-channel-id="cpac-ca"]').count(), 1);
    assert.equal(await page.locator('[data-channel-id="scottish-parliament-tv"]').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator("#locale-select").selectOption("fr");
  await page.locator("#search").fill("Allemagne");
  assert.equal(await page.locator('[data-channel-id="bavaria-landtag-plenum-online"]').count(), 1);
  await page.locator("#locale-select").selectOption("en");
  await page.locator("#search").fill("");

  const rows = page.locator(".channel-button");
  assert.equal(await rows.count(), canonicalCatalogue.channels.length);
  assert.deepEqual(await page.locator(".channel-header .sort-button").allInnerTexts(), [
    "SOURCE",
    "JURISDICTION",
    "LANGUAGE",
    "PLAYBACK",
  ]);
  assert.equal(await page.locator("#sort-mode").innerText(), "PLAYBACK");
  await page.locator("#sort-mode").click();
  assert.match(await page.locator("#sort-status").innerText(), /Playback: ascending/);
  assert.match(await page.locator(".channel-button").first().locator(".source-posture").innerText(), /Watch here/);
  await page.locator("#sort-mode").click();
  assert.match(await page.locator("#sort-status").innerText(), /Playback: descending/);
  assert.match(await page.locator(".channel-button").first().locator(".source-posture").innerText(), /Needs review/);
  await page.locator("#sort-source").click();
  const navarreFlag = page.locator('[data-channel-id="navarre-parliament-live"] .jurisdiction-flag');
  assert.equal(await navarreFlag.count(), 1);
  assert.match(await navarreFlag.getAttribute("src"), /assets\/flags\/navarre\.svg$/);
  const youtubeRow = page.locator('[data-channel-id="australia-parliament-youtube"]');
  await youtubeRow.click();
  assert.equal(await youtubeRow.evaluate((element) => document.activeElement === element), true);
  assert.equal(await youtubeRow.getAttribute("role"), null);
  await assertPlaybackAlignment(page);
  assert.equal(await youtubeRow.getAttribute("aria-pressed"), "true");
  assert.notEqual(await youtubeRow.evaluate((element) => getComputedStyle(element).boxShadow), "none");
  const youtubeFrame = page.locator("#media-frame iframe");
  assert.equal(await youtubeFrame.count(), 1);
  assert.match(await youtubeFrame.getAttribute("src"), /youtube-nocookie\.com\/embed\/abcDEF12345/);
  assert.equal(await youtubeFrame.getAttribute("title"), "Australia Parliament Live · YouTube");
  assert.match(await youtubeRow.locator(".source-posture").getAttribute("title"), /official provider embed or fallback surface/);
  const albertaWatch = page.locator('[data-channel-id="alberta-assembly-online"]').locator('..').locator('.row-direct-watch');
  assert.equal(await albertaWatch.count(), 1);
  assert.match(await albertaWatch.getAttribute('href'), /assembly\.ab\.ca/);
  assert.equal(await albertaWatch.getAttribute('target'), '_blank');
  assert.equal(await youtubeRow.locator(".row-tag").count(), 0);
  assert.equal(await page.locator(".source-documentation[open]").count(), 0);
  await page.locator(".source-documentation").first().locator("summary").click();
  assert.match(await page.locator(".source-documentation .detail-grid").innerText(), /PLAYBACK\s+Provider embed/);

  await page.locator('[data-channel-id="canada-house-of-commons-parlvu"]').click();
  await page.locator(".source-documentation > summary").first().click();
  await page.locator(".source-documentation > summary").nth(1).click();
  assert.match(await page.locator('[data-channel-id="canada-house-of-commons-parlvu"] .source-posture').innerText(), /Watch on official site/);
  assert.match(await page.locator(".fallback-record").innerText(), /Canada House of Commons ParlVU events/);
  assert.match(await page.locator(".fallback-record").innerText(), /Event platform · Event resolver planned · Schedule source/);
  assert.match(await page.locator(".fallback-record").innerText(), /Now: House of Commons sitting/);
  assert.match(await page.locator(".fallback-record").innerText(), /Live now · English · House of Commons/);
  assert.match(await page.locator(".fallback-record").innerText(), /Next: Finance committee/);
  assert.match(await page.locator(".fallback-record").innerText(), /2:00 PM · English · Room 253-D/);
  assert.match(await page.locator(".fallback-record > dd > .fallback-list > li > a").first().getAttribute("href"), /parlvu\.parl\.gc\.ca\/Harmony\/en/);
  assert.match(await page.locator(".fallback-schedule a").first().getAttribute("href"), /PowerBrowserV2\/20260819\/-1\/15441/);
  assert.match(await page.locator(".validation-record").innerText(), /LATEST VALIDATION/);
  assert.match(await page.locator(".validation-record").innerText(), /Access status OK/);

  const europarlRow = page.locator('[data-channel-id="european-parliament-multimedia-centre"]');
  await europarlRow.click();
  await page.locator(".source-documentation > summary").first().click();
  await page.locator(".source-documentation > summary").nth(1).click();
  assert.match(await europarlRow.locator(".source-posture").innerText(), /Watch on official site/);
  assert.match(await page.locator(".validation-record").innerText(), /LATEST VALIDATION/);
  assert.match(await page.locator(".validation-record").innerText(), /Report/);
  assert.match(await page.locator(".validation-record a").getAttribute("href"), /github\.com\/dlq\/parliament-streams\/blob\/main\/reports\/health\//);
  assert.match(await page.locator(".programme-fetch-status").innerText(), /Schedule collected/);
  assert.match(await page.locator(".programme-line").first().innerText(), /^Now: Committee on the Environment/);
  assert.match(await page.locator(".programme-line").nth(1).innerText(), /^Next: Plenary sitting/);
  assert.equal(await page.locator(".evidence-dates dd span").count(), 3);
  assert.match(await page.locator(".evidence-dates").innerText(), /Catalogue updated/i);
  assert.match(await page.locator(".evidence-dates").innerText(), /Aug 16, 2026/);

  await page.locator("#locale-select").selectOption("fr");
  await page.locator(".source-documentation > summary").first().click();
  assert.equal(await page.locator("#nav-map").innerText(), "Carte de couverture");
  assert.equal(await page.locator("#nav-schedule").innerText(), "Horaire");
  assert.match(await page.locator('meta[name="description"]').getAttribute("content"), /Points d'accès officiels/);
  assert.match(await page.locator(".programme-fetch-status").innerText(), /Horaire recueilli le/);
  assert.match(await page.locator(".programme-line").first().innerText(), /^Maintenant :/);
  assert.match(await page.locator(".programme-line").nth(1).innerText(), /^À suivre :/);
  assert.match(await page.locator("#open-video-copy").innerText(), /flux directs et interopérables comme le HLS/);
  assert.match(await page.locator("#open-streams-copy").innerText(), /horaires ouverts/);
  assert.equal(await page.locator("#metric-playable-label").textContent(), "Lisibles ici");
  assert.equal(await page.locator("#metric-schedules").textContent(), String(expectedScheduleCount));
  assert.equal(await page.locator("#principle-accessibility").textContent(), "Accessibilité ouverte");
  await page.locator('[data-channel-id="australia-parliament-youtube"]').click();
  await page.locator(".source-documentation > summary").first().click();
  await page.locator(".source-documentation > summary").nth(1).click();
  assert.match(await page.locator('[data-channel-id="australia-parliament-youtube"] .source-posture').getAttribute("title"), /intégration officielle/);
  assert.equal(
    await page.locator('[data-channel-id="british-columbia-legislature-webcasts"] > span').nth(1).innerText(),
    "Colombie-Britannique",
  );

  await page.locator('[data-channel-id="new-zealand-parliament"]').click();
  await page.locator(".source-documentation > summary").first().click();
  await page.locator(".source-documentation > summary").nth(1).click();
  const newZealandTerms = await page.locator(".detail-grid dt").allTextContents();
  assert.equal(newZealandTerms.includes("Attribution requise"), false);
  assert.equal(newZealandTerms.includes("Programme en cours"), false);
  assert.equal(await page.locator(".accessibility-record .detail-subtitle").count(), 0);
  assert.match(await page.locator(".detail-note").last().innerText(), /Ce point d’accès public peut être lu/);
  assert.equal(await page.locator(".research-note-disclosure").getAttribute("open"), null);

  await page.locator('[data-channel-id="quebec-canal01"]').click();
  await page.locator(".source-documentation > summary").first().click();
  await page.locator(".source-documentation > summary").nth(1).click();
  const quebecSummary = page.getByText(/Quebec National Assembly terms authorize free reproduction/);
  assert.equal(await page.locator(".evidence-note a").count(), 2);
  assert.equal(await page.locator(".research-note-disclosure summary").innerText(), "Notes de recherche du catalogue en anglais");
  assert.equal(await quebecSummary.isVisible(), false);
  assert.equal(await page.locator(".epg-list a").count(), 1);
  assert.match(await page.locator(".epg-list a").innerText(), /Page d’horaire en direct/);
  assert.equal((await page.locator(".epg-list a").getAttribute("href")).includes("ObtenirListe"), false);
  await page.locator(".research-note-disclosure summary").click();
  assert.equal(await quebecSummary.isVisible(), true);

  await page.locator('[data-channel-id="scottish-parliament-tv"]').click();
  await page.locator(".source-documentation > summary").first().click();
  await page.locator(".source-documentation > summary").nth(1).click();
  assert.match(await page.locator(".accessibility-record").innerText(), /Varie selon la source ou l’événement/);
  assert.equal(await page.locator(".accessibility-record .detail-subtitle").count(), 0);

  await page.locator("#locale-select").selectOption("zh-Hans");
  await page.locator('[data-channel-id="spain-congreso-directo-3"]').click();
  await page.locator(".source-documentation > summary").first().click();
  await page.locator(".source-documentation > summary").nth(1).click();
  const detailTerms = await page.locator(".detail-grid dt").allTextContents();
  assert(detailTerms.includes("访问状态"));
  assert.equal(detailTerms.includes("所需署名"), false);
  assert.equal(detailTerms.includes("当前节目记录"), false);
  assert(detailTerms.includes("媒体无障碍"));
  assert.equal(await page.locator("#media-frame").count(), 0);
  assert.equal(await page.locator(".official-button").isVisible(), true);
  assert.match(await page.locator(".accessibility-record").innerText(), /字幕: 尚未验证/);
  assert.match(await page.locator(".accessibility-record").innerText(), /手语: 尚未验证/);
  assert.equal(await page.locator(".accessibility-record .detail-subtitle").count(), 0);
  assert.match(await page.locator(".epg-list").innerText(), /直播节目表页面/);
  assert.match(await page.locator(".evidence-note").innerText(), /^证据来源。/);
  assert.match(await page.locator(".evidence-note a").first().innerText(), /官方观看页面|支持来源/);
  assert.equal(await page.locator(".research-note-disclosure summary").innerText(), "目录的英文研究说明");
  assert.match(await page.locator('[data-channel-id="spain-congreso-directo-3"] + .visually-hidden').innerText(), /研究资料/);

  const search = page.locator("#search");
  await search.focus();
  const colours = await search.evaluate((element) => {
    const style = getComputedStyle(element);
    return { border: style.borderTopColor, outline: style.outlineColor };
  });
  assert(contrastRatio(rgb(colours.border), [255, 255, 255]) >= 3);
  assert(contrastRatio(rgb(colours.outline), [255, 255, 255]) >= 3);

  await page.locator("#locale-select").selectOption("en");
  await page.setViewportSize({ width: 900, height: 800 });
  await page.reload();
  await page.waitForSelector(".channel-button");
  assert.equal(await page.locator("#detail-panel").isVisible(), false);
  await page.locator(".channel-button").first().click();
  assert.equal(await page.locator("#detail-panel").isVisible(), true);
  assert.equal(await page.locator("#detail-panel").evaluate((element) => getComputedStyle(element).position), "fixed");
  assert.equal(await page.locator(".detail-grabber").isVisible(), true);
  assert.equal(await page.locator("#detail-title").evaluate((element) => document.activeElement === element), true);
  assert.equal(await page.locator(".media-frame").count(), 0);
  assert.equal(await page.locator(".official-button").isVisible(), true);
  await page.locator(".source-documentation > summary").first().click();
  const intermediatePanel = await page.locator("#detail-panel").boundingBox();
  const intermediateGrid = await page.locator(".detail-grid").boundingBox();
  assert(intermediateGrid.width <= intermediatePanel.width);
  await assertNoAxeViolations(page, "Open intermediate-width source details");
  await page.locator("#detail-title").press("Escape");
  assert.equal(await page.locator("#detail-panel").isVisible(), false);

  await page.setViewportSize({ width: 320, height: 800 });
  await page.reload();
  await page.waitForSelector(".channel-button");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  assert.equal(await page.locator("#primary-navigation > a:visible").count(), 3);
  assert.equal(await page.locator("#primary-navigation .github-link").isVisible(), false);
  assert((await page.locator("#primary-navigation > a:visible").first().boundingBox()).height >= 40);
  assert((await page.locator("#search").boundingBox()).y < 800);
  await page.locator(".channel-button").first().click();
  assert.equal(await page.locator("#detail-title").evaluate((element) => document.activeElement === element), true);
  assert.equal(await page.locator("#detail-panel").getAttribute("aria-labelledby"), "detail-title");
  await assertNoAxeViolations(page, "Open mobile source details");
  await page.locator("[data-close-detail]").click();
  assert.equal(await page.locator("#detail-panel").isVisible(), false);
  assert.equal(await page.locator(".channel-button").first().evaluate((element) => document.activeElement === element), true);

  await page.locator("#locale-select").selectOption("fr");
  assert.equal(await page.locator("html").getAttribute("lang"), "fr");
  assert.equal(await page.locator("#detail-panel").isVisible(), false);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const transitionDuration = await page.locator("#detail-panel").evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).transitionDuration),
  );
  assert(transitionDuration <= 0.001);

  const schedulePage = await context.newPage();
  await schedulePage.route("**/data/schedules.json", (route) => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({
      generated_at: "2026-08-17T12:00:00Z",
      channels: {
        "european-parliament-multimedia-centre": {
          current_event_title: "Committee on the Environment",
          current_event_time: "Live now",
          current_event_start: "2026-08-17T12:00:00Z",
          next_event_title: "Plenary sitting",
          next_event_time: "4:00 PM",
          next_event_start: "2026-08-17T16:00:00Z",
          fetched_at: "2026-08-17T12:00:00Z",
        },
        "canada-house-of-commons-parlvu": {
          current_event_title: "House of Commons sitting",
          current_event_time: "Live now",
          current_event_status: "In Progress",
          next_event_title: "Finance committee",
          next_event_time: "2:00 PM",
          fetched_at: "2026-08-17T12:00:00Z",
        },
        "australia-parliament-youtube": {
          current_event_title: "Australia Parliament live",
          current_event_time: "Live now",
          current_event_status: "Live now",
          next_event_title: null,
          next_event_time: null,
          fetched_at: "2026-08-17T12:00:00Z",
        },
      },
    }),
  }));
  await schedulePage.goto(`${baseUrl}schedule.html?lang=en`);
  await schedulePage.waitForSelector("#schedule-list tr");
  assert.equal(await schedulePage.locator("#schedule-list tr").count(), 3);
  assert.match(await schedulePage.locator("#schedule-updated").innerText(), /Schedule updated/);
  assert.equal(await schedulePage.locator(".programme-live").count(), 3);
  assert.match(await schedulePage.locator("#schedule-list").innerText(), /Committee on the Environment/);
  const expectedLocalTime = await schedulePage.evaluate(() => new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date("2026-08-17T12:00:00Z")));
  const europeanRow = schedulePage.locator("#schedule-list tr").filter({ hasText: "Committee on the Environment" });
  assert.equal(await europeanRow.locator(".programme-time").first().innerText(), expectedLocalTime);
  await schedulePage.locator("#schedule-status").selectOption("next");
  assert.equal(await schedulePage.locator("#schedule-list tr").count(), 2);
  await schedulePage.locator("#schedule-status").selectOption("playable");
  assert.equal(await schedulePage.locator("#schedule-list tr").count(), 1);
  assert.match(await schedulePage.locator(".schedule-watch").getAttribute("href"), /play=1/);
  await assertSearchMetadata(schedulePage, "schedule.html");
  await assertIptvDisclosure(schedulePage);
  await assertIptvLocales(schedulePage, '#locale-select');
  await assertNoAxeViolations(schedulePage, "Desktop programme guide");
  await schedulePage.goto(`${baseUrl}schedule.html?lang=fr`);
  await schedulePage.waitForSelector("#schedule-list tr");
  assert.equal(await schedulePage.locator("#schedule-title").innerText(), "Horaire");
  await assertSearchMetadata(schedulePage, "schedule.html");
  assert.equal(await schedulePage.locator("#schedule-now-heading").textContent(), "Maintenant");
  assert.deepEqual(
    await schedulePage.evaluate(() => window.ParliamentStreamsI18n.locales.flatMap(([code]) => window.ParliamentStreamsScheduleI18n.coverage(code).map((key) => `${code}:${key}`))),
    [],
  );
  await schedulePage.setViewportSize({ width: 320, height: 800 });
  assert.equal(await schedulePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  assert.equal(await schedulePage.locator("#schedule-primary-navigation > a:visible").count(), 3);
  await schedulePage.locator('.iptv-disclosure > summary').click();
  assert.equal(await schedulePage.locator('.iptv-disclosure').getAttribute('lang'), 'fr');
  assert.equal(await schedulePage.locator('.iptv-disclosure > summary').innerText(), 'Utiliser dans une application IPTV');
  assert.equal(await schedulePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  await assertNoAxeViolations(schedulePage, 'Mobile IPTV disclosure');
  await schedulePage.locator('.iptv-disclosure > summary').click();
  await assertIptvLocales(schedulePage, '#locale-select');
  await schedulePage.locator('#locale-select').selectOption('fr');
  const firstScheduleRow = schedulePage.locator("#schedule-list tr").first();
  const nowCell = await firstScheduleRow.locator("td").nth(1).boundingBox();
  const nextCell = await firstScheduleRow.locator("td").nth(2).boundingBox();
  assert(nextCell.y > nowCell.y + nowCell.height - 1);
  assert.equal(await firstScheduleRow.locator("td").nth(1).getAttribute("data-label"), "Maintenant");
  assert.equal(await firstScheduleRow.locator("td").nth(2).getAttribute("data-label"), "À suivre");
  await assertNoAxeViolations(schedulePage, "Mobile programme guide");
  await schedulePage.close();

  const mapPage = await context.newPage();
  await mapPage.goto(`${baseUrl}map.html?lang=en`);
  await mapPage.waitForSelector(".map-country.is-documented");
  await assertSearchMetadata(mapPage, "map.html");
  const d3Runtime = await mapPage.evaluate(() => ({
    version: window.d3.version,
    vendor: window.PARLIAMENT_STREAMS_VENDOR.d3.version,
  }));
  assert.equal(d3Runtime.version, d3Package.version);
  assert.equal(d3Runtime.vendor, d3Package.version);
  assert.equal(
    await mapPage.locator("#jurisdiction-count").innerText(),
    String(expectedJurisdictionCount),
  );
  assert.equal(await mapPage.locator("#source-count").innerText(), String(canonicalCatalogue.channels.length));
  assert.equal(await mapPage.locator("#playable-count").innerText(), String(expectedPlayableCount));
  assert.equal(await mapPage.locator("#jurisdiction-list button").count(), expectedJurisdictionCount);
  assert.equal(
    await mapPage.locator(".map-country.is-documented").count(),
    expectedDocumentedCountryCodes.size,
  );
  assert.equal(await mapPage.locator(".map-region").count(), 34);
  assert.match(await mapPage.locator("#map-detail").innerText(), /Canada.*31 sources/s);
  assert.equal(
    await mapPage
      .getByRole("button", { name: "Alberta, Documented, Subnational", exact: true })
      .evaluate((element) => getComputedStyle(element).fill),
    "rgb(182, 41, 58)",
  );
  await mapPage.getByRole("button", { name: "National", exact: true }).click();
  await mapPage.getByRole("button", { name: "Brazil, Documented", exact: true }).click();
  assert.equal(
    await mapPage
      .getByRole("button", { name: "Brazil, Documented", exact: true })
      .evaluate((element) => getComputedStyle(element).fill),
    "rgb(182, 41, 58)",
  );
  assert.equal(
    await mapPage.getByRole("button", { name: /Brazil National · 1 source/ }).getAttribute("aria-pressed"),
    "true",
  );
  await mapPage.getByRole("button", { name: "International", exact: true }).click();
  assert.equal(await mapPage.locator("#supranational-picker").count(), 0);
  assert.equal(await mapPage.locator("#jurisdiction-list button").count(), 4);
  assert.equal(
    await mapPage.getByRole("button", { name: /European Union International/ }).getAttribute("aria-pressed"),
    "true",
  );
  assert.match(await mapPage.locator("#map-detail").innerText(), /European Union.*27.*Member States/si);
  assert.equal(await mapPage.locator(".map-country.is-member").count(), 26);
  await mapPage.getByRole("button", { name: "Germany, Member State", exact: true }).click();
  assert.match(await mapPage.locator("#map-detail").innerText(), /EU · Member State.*Germany.*4 sources/s);
  await mapPage.getByRole("button", { name: "Zoom in", exact: true }).click();
  await mapPage.waitForTimeout(300);
  const transformBeforeSubnational = await mapPage.locator(".map-viewport").getAttribute("transform");
  await mapPage.getByRole("button", { name: "Subnational", exact: true }).click();
  assert.equal(
    await mapPage.locator(".map-viewport").getAttribute("transform"),
    transformBeforeSubnational,
  );
  await mapPage.locator("#map-search").fill("Scotland");
  await mapPage.locator("#map-search").press("Enter");
  await mapPage.waitForTimeout(300);
  assert.match(await mapPage.locator("#map-detail").innerText(), /United Kingdom.*Scotland/s);
  assert.equal(
    await mapPage.locator("#jurisdiction-visible-count").innerText(),
    `1 / ${expectedJurisdictionCount}`,
  );
  assert.equal(await mapPage.locator(".map-region.is-selected").count(), 1);
  assert.notEqual(await mapPage.locator(".map-viewport").getAttribute("transform"), null);
  assert.match(await mapPage.locator("#map-detail .map-source-list a").first().getAttribute("href"), /source=scottish-parliament-tv/);
  await assertNoAxeViolations(mapPage, "Desktop coverage map");
  for (const [country, region, sourceId, code] of [
    ["Canada", "Alberta", "alberta-assembly-online", "CA"],
    ["Argentina", "Córdoba", "argentina-cordoba-legislature-live", "AR"],
    ["Japan", "Nagasaki", "japan-nagasaki-assembly-committees", "JP"],
    ["Brazil", "Santa Catarina", "brazil-santa-catarina-tv-alesc", "BR"],
  ]) {
    await mapPage.locator("#map-search").fill(country);
    const regionalResult = mapPage.locator("#jurisdiction-list button").filter({ hasText: region });
    assert.equal(await regionalResult.count(), 1, `${country} search must find ${region}`);
    await regionalResult.click();
    assert.equal(await mapPage.locator(`#map-detail [data-parent-code="${code}"]`).count(), 1);
    await mapPage.locator(`#map-detail [data-parent-code="${code}"]`).click();
    assert.equal(await mapPage.locator(`#map-detail a[href*="${sourceId}"]`).count(), 1);
  }
  const mapLocales = await mapPage.evaluate(() => window.ParliamentStreamsI18n.locales.map(([code]) => code));
  for (const locale of mapLocales) {
    assert.deepEqual(
      await mapPage.evaluate((code) => window.ParliamentStreamsMapI18n.coverage(code), locale),
      [],
      `Missing map translations for ${locale}`,
    );
  }
  await mapPage.goto(`${baseUrl}map.html?lang=fr`);
  await mapPage.waitForSelector(".map-country.is-documented");
  assert.equal(await mapPage.locator("html").getAttribute("lang"), "fr");
  assert.equal(await mapPage.locator("#map-title").innerText(), "Carte de couverture");
  assert.equal(await mapPage.getByRole("button", { name: "International", exact: true }).count(), 1);
  await mapPage.getByRole("button", { name: "Infranational", exact: true }).click();
  await mapPage.locator("#map-search").fill("Écosse");
  await mapPage.locator("#map-search").press("Enter");
  assert.match(await mapPage.locator("#map-detail").innerText(), /Royaume-Uni.*Écosse/s);
  assert.equal(await mapPage.getByRole("button", { name: "Zoom avant", exact: true }).count(), 1);
  await assertNoAxeViolations(mapPage, "Localized coverage map");
  const mapDeepLinkPage = await context.newPage();
  await mapDeepLinkPage.goto(`${baseUrl}index.html?source=scottish-parliament-tv#catalogue`);
  await mapDeepLinkPage.waitForSelector('[data-channel-id="scottish-parliament-tv"][aria-pressed="true"]');
  assert.match(await mapDeepLinkPage.locator("#detail-title").innerText(), /Scottish Parliament TV/);
  await mapDeepLinkPage.close();
  await mapPage.setViewportSize({ width: 320, height: 800 });
  await mapPage.reload();
  await mapPage.waitForSelector(".map-country.is-documented");
  assert.equal(await mapPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  assert.equal(await mapPage.locator("#map-primary-navigation > a:visible").count(), 3);
  assert((await mapPage.locator("#world-map").boundingBox()).height <= 220);
  await assertNoAxeViolations(mapPage, "Mobile coverage map");
  await mapPage.close();

  const filePage = await context.newPage();
  const fileUrl = new URL("../site/index.html", import.meta.url);
  fileUrl.searchParams.set("lang", "fr");
  await filePage.goto(fileUrl.href);
  await filePage.waitForSelector(".channel-button");
  await filePage.locator('[data-channel-id="australia-parliament-youtube"]').click();
  assert.equal(await filePage.locator("#media-frame iframe").count(), 0);
  assert.match(await filePage.locator(".youtube-file-notice").innerText(), /La lecture n’a pas pu démarrer/);
  await assertNoAxeViolations(filePage, "Direct-file YouTube fallback");
  await filePage.close();
} finally {
  await browser.close();
  server.close();
}

console.log("Accessibility checks passed.");
