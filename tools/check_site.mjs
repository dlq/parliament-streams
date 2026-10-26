import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { assertPersistentViewer, assertProviderViewer } from "./check_viewer.mjs";

const root = normalize(join(fileURLToPath(new URL("..", import.meta.url))));
const canonicalCatalogue = JSON.parse(await readFile(join(root, "data/channels.json"), "utf8"));
const canonicalFallbacks = JSON.parse(await readFile(join(root, "data/fallbacks.json"), "utf8"));
const [hlsPackage, d3Package] = await Promise.all(["hls.js", "d3"].map(async (name) =>
  JSON.parse(await readFile(join(root, "node_modules", name, "package.json"), "utf8"))
));
const [primarySubnationalGeometry, lienchiangGeometry] = await Promise.all([
  "documented-admin1.geojson", "lienchiang-odbl.geojson",
].map(async (name) => JSON.parse(await readFile(join(root, "site/assets/maps", name), "utf8"))));
const documentedSubnationalGeometry = {
  type: "FeatureCollection",
  features: [...primarySubnationalGeometry.features, ...lienchiangGeometry.features],
};
const expectedSubnationalJurisdictions = new Set(canonicalCatalogue.channels
  .filter((channel) => channel.jurisdiction_level === "subnational")
  .map((channel) => channel.country_or_region));
assert.equal(documentedSubnationalGeometry.features.length, expectedSubnationalJurisdictions.size);
assert.deepEqual(new Set(documentedSubnationalGeometry.features.map((feature) => feature.properties.name)), expectedSubnationalJurisdictions);
const institutionLocationFeatures = documentedSubnationalGeometry.features.filter((feature) => feature.geometry.type === "Point");
for (const feature of documentedSubnationalGeometry.features) {
  if (feature.geometry.type === "MultiPolygon") continue;
  assert.equal(feature.geometry.type, "Point", "Map geometry must be a territorial outline or an explicit institution location");
  assert.equal(feature.properties.geometry_scope, "institution_location");
  assert(feature.properties.scope_note?.trim(), "Institution locations need an explanation of their limited scope");
  assert.match(feature.properties.source_url ?? "", /^https?:\/\//);
  assert.equal(feature.geometry.coordinates.length, 2);
  assert(feature.geometry.coordinates.every(Number.isFinite));
  assert(Math.abs(feature.geometry.coordinates[0]) <= 180);
  assert(Math.abs(feature.geometry.coordinates[1]) <= 90);
}
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
  .map((channel) => ({ Taiwan: "TW", "Cook Islands": "CK", Panama: "PA" }[channel.country_or_region] ?? channel.external_ids?.ipu_country_code))
  .filter(Boolean));
documentedSubnationalGeometry.features.forEach((feature) => {
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

async function assertPlaybackColumnAlignment(page) {
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

async function selectMapSearchResult(page, query) {
  await page.locator("#map-search").fill(query);
  const results = page.locator("#jurisdiction-list button");
  assert.equal(await results.count(), 1, `${query}: expected an explicit unique map result`);
  await results.first().click();
}

async function assertPageMetadata(page, path = '') {
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
  const navigation = page.locator('.header-inner > nav');
  assert.equal(await navigation.locator('a:visible').count(), 5);
  const dataLink = navigation.locator('[data-project-navigation]');
  const locale = await page.locator('html').getAttribute('lang');
  assert.equal(await dataLink.innerText(), await page.evaluate((code) => window.ParliamentStreamsProjectI18n.message(code, 'title'), locale));
  const destination = new URL(await dataLink.getAttribute('href'));
  assert(destination.pathname.endsWith('/data.html'));
  assert.equal(destination.searchParams.get('lang'), locale);
  assert.equal(await dataLink.getAttribute('target'), null);
  assert.equal(await dataLink.getAttribute('aria-current'), path === 'data.html' ? 'page' : null);
  assert.equal(await navigation.locator('a[href*="github.com"]').count(), 0);
}

async function assertIptvDisclosure(page) {
  const disclosure = page.locator('.iptv-disclosure');
  assert.equal(await disclosure.getAttribute('open'), null);
  await disclosure.locator(':scope > summary').click();
  const paths = ['stable-hls.m3u', 'validated-hls.m3u', 'epg.xml'];
  assert.match(await disclosure.locator('.iptv-scope').innerText(), /global.*filters do not change/);
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
    assert((await disclosure.locator('.iptv-scope').innerText()).trim());
    if (locale !== 'en') assert.doesNotMatch(await disclosure.locator('.iptv-scope').innerText(), /These playlists are global/);
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (url) => { window.__iptvCopied = url; } } });
    });
    await disclosure.locator('[data-copy]').first().click();
    assert.equal(await page.evaluate(() => window.__iptvCopied), 'https://dlq.ca/parliament-streams/data/stable-hls.m3u');
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

async function newLocalContext(browser, options = {}) {
  const context = await browser.newContext({ serviceWorkers: "block", ...options });
  // Install before the first page/navigation, including child frames. The launch
  // mute flag also suppresses audio paths outside HTMLMediaElement playback.
  await context.addInitScript(() => {
    for (const [name, value] of [["muted", true], ["defaultMuted", true], ["volume", 0]]) {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, name);
      if (descriptor?.configurable === false) {
        // Remain compatible with the optional external silent-run preload.
        if (descriptor.get?.call(document.createElement("video")) !== value) {
          throw new Error("Browser media guard could not guarantee silence");
        }
        continue;
      }
      Object.defineProperty(HTMLMediaElement.prototype, name, {
        configurable: false,
        enumerable: true,
        get() { return value; },
        set() {},
      });
    }
    const silence = () => document.querySelectorAll("video,audio").forEach((media) => {
      media.muted = true;
      media.defaultMuted = true;
      media.volume = 0;
    });
    new MutationObserver(silence).observe(document, { childList: true, subtree: true });
    document.addEventListener("play", silence, true);
  });
  await context.route("**/*", (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const external = ["http:", "https:"].includes(url.protocol)
      && !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
    return external || request.resourceType() === "media" ? route.abort() : route.continue();
  });
  return context;
}

async function assertViewerTimezones(browser, baseUrl) {
  // These are fixed UTC instants, rather than source wall-clock labels or the
  // test runner's timezone. Each pair crosses one viewer's DST transition.
  const fixtures = [
    ["spain-canal-parlamento", "Europe DST", "2026-10-25T00:30:00Z", "2026-10-25T01:30:00Z", "Europe/Madrid"],
    ["cpac-ca", "Toronto DST", "2026-11-01T05:30:00Z", "2026-11-01T06:30:00Z", "America/Toronto"],
    ["new-zealand-parliament", "Auckland DST", "2026-09-26T13:30:00Z", "2026-09-26T14:30:00Z", "Pacific/Auckland"],
  ];
  const hebrew = {
    id: "israel-knesset-channel",
    titles: ["דיון בתקציב 2027 (Finance)", "ועדת הכנסת – <b>תקציב</b> & חקיקה"],
    rooms: ["חדר ועדה 2 (קומה 1)", "אולם המליאה – <עדכון>"],
  };
  const snapshot = {
    generated_at: "2026-09-01T12:00:00Z",
    channels: Object.fromEntries(fixtures.map(([id, title, start, next, sourceTimezone]) => [id, {
      current_event_title: `${title} before`,
      current_event_time: "SOURCE CLOCK MUST NOT BE DISPLAYED",
      current_event_start: start,
      next_event_title: `${title} after`,
      next_event_time: "SOURCE CLOCK MUST NOT BE DISPLAYED",
      next_event_start: next,
      fetched_at: "2026-09-01T12:00:00Z",
      events: [{ start, source_timezone: sourceTimezone }, { start: next, source_timezone: sourceTimezone }],
    }])),
  };
  snapshot.channels[hebrew.id] = {
    current_event_title: hebrew.titles[0],
    current_event_language: "he",
    current_event_location: hebrew.rooms[0],
    current_event_url: "https://www.knesset.tv/",
    current_event_start: fixtures[0][2],
    next_event_title: hebrew.titles[1],
    next_event_language: "he",
    next_event_location: hebrew.rooms[1],
    next_event_start: fixtures[0][3],
    fetched_at: snapshot.generated_at,
  };
  // Independently specified civil days, clocks and offset names. Computing the
  // expected values with the same Intl formatter would hide timezone mistakes.
  const cases = [
    {
      timezoneId: "America/Toronto",
      expected: [
        [["Oct 24", "8:30 PM", "EDT", "GMT-4"], ["Oct 24", "9:30 PM", "EDT", "GMT-4"]],
        [["Nov 1", "1:30 AM", "EDT", "GMT-4"], ["Nov 1", "1:30 AM", "EST", "GMT-5"]],
        [["Sep 26", "9:30 AM", "EDT", "GMT-4"], ["Sep 26", "10:30 AM", "EDT", "GMT-4"]],
      ],
      dutchClocks: ["9:30", "10:30"],
      hebrewDutchClocks: ["20:30", "21:30"],
    },
    {
      timezoneId: "Europe/Amsterdam",
      expected: [
        [[null, "2:30 AM", "GMT+2", "CEST"], [null, "2:30 AM", "GMT+1", "CET"]],
        [["Nov 1", "6:30 AM", "GMT+1", "CET"], ["Nov 1", "7:30 AM", "GMT+1", "CET"]],
        [["Sep 26", "3:30 PM", "GMT+2", "CEST"], ["Sep 26", "4:30 PM", "GMT+2", "CEST"]],
      ],
      dutchClocks: ["15:30", "16:30"],
      hebrewDutchClocks: ["2:30", "2:30"],
    },
    {
      timezoneId: "Pacific/Auckland",
      expected: [
        [[null, "1:30 PM", "GMT+13", "NZDT"], [null, "2:30 PM", "GMT+13", "NZDT"]],
        [["Nov 1", "6:30 PM", "GMT+13", "NZDT"], ["Nov 1", "7:30 PM", "GMT+13", "NZDT"]],
        [["Sep 27", "1:30 AM", "GMT+12", "NZST"], ["Sep 27", "3:30 AM", "GMT+13", "NZDT"]],
      ],
      dutchClocks: ["1:30", "3:30"],
      hebrewDutchClocks: ["13:30", "14:30"],
    },
  ];
  const token = (value) => new RegExp(`(?:^|\\W)${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:$|\\W)`);
  const checkTimes = async (locator, expected, label) => {
    const times = (await locator.allInnerTexts()).map((text) => text.replace(/\s+/g, " ").trim());
    assert.equal(times.length, 2, `${label}: both programme instants must render`);
    times.forEach((text, index) => {
      const [day, clock, ...zones] = expected[index];
      if (day) assert.match(text, token(day), `${label}: incorrect local calendar day`);
      else assert.doesNotMatch(text, /\b(?:Sep|Oct|Nov)\b/, `${label}: today's local times should not repeat a calendar date`);
      assert.match(text, token(clock), `${label}: incorrect local clock`);
      assert(zones.some((zone) => text.endsWith(zone)), `${label}: incorrect UTC offset: ${text}`);
      assert(!text.includes("SOURCE CLOCK"), `${label}: source fallback must not replace UTC conversion`);
    });
  };
  const checkBidi = async (page, container) => {
    assert.equal(await page.locator("html").evaluate((node) => getComputedStyle(node).direction), "ltr");
    for (const text of [...hebrew.titles, ...hebrew.rooms]) {
      const isolated = container.locator('bdi[dir="auto"]').filter({ hasText: text });
      assert.equal(await isolated.count(), 1, "Each source title/room needs independent direction isolation");
      assert.equal(await isolated.innerText(), text, "Source markup must remain escaped literal text");
      const style = await isolated.evaluate((node) => ({
        direction: getComputedStyle(node).direction,
        unicodeBidi: getComputedStyle(node).unicodeBidi,
        language: node.closest("[lang]")?.getAttribute("lang"),
      }));
      assert.equal(style.direction, "rtl");
      assert.match(style.unicodeBidi, /isolate/);
      if (hebrew.titles.includes(text)) assert.equal(style.language, "he");
    }
    for (const time of await container.locator('bdi[dir="ltr"]').all()) {
      assert.equal(await time.evaluate((node) => getComputedStyle(node).direction), "ltr");
    }
    assert.equal(await container.locator("bdi b, bdi img, bdi script").count(), 0);
  };
  for (const { timezoneId, expected, dutchClocks, hebrewDutchClocks } of cases) {
    const context = await newLocalContext(browser, { timezoneId, locale: "en", viewport: { width: 1280, height: 900 } });
    try {
      await context.route("**/data/schedules.json", (route) => route.fulfill({
        contentType: "application/json", body: JSON.stringify(snapshot),
      }));
      const errors = [];
      const catalogue = await context.newPage();
      const schedule = await context.newPage();
      for (const page of [catalogue, schedule]) {
        page.on("pageerror", (error) => errors.push(error.message));
        // The first pair is today in Amsterdam/Auckland but the previous local
        // date in Toronto, despite sharing today's UTC date. Timers stay real.
        await page.clock.setFixedTime(new Date("2026-10-25T10:00:00Z"));
      }
      await catalogue.goto(`${baseUrl}index.html?lang=en&source=${fixtures[0][0]}`);
      await catalogue.locator(".programme-record .programme-time").first().waitFor();
      await assertPageMetadata(catalogue);
      await schedule.goto(`${baseUrl}schedule.html?lang=en`);
      await schedule.locator("#schedule-list tr").first().waitFor();
      await assertPageMetadata(schedule, "schedule.html");
      for (const [index, [id, title]] of fixtures.entries()) {
        await catalogue.locator(`[data-channel-id="${id}"]`).click();
        await checkTimes(catalogue.locator(".programme-record .programme-time"), expected[index], `${timezoneId} catalogue ${title}`);
        const row = schedule.locator("#schedule-list tr").filter({ hasText: `${title} before` });
        await checkTimes(row.locator(".programme-time"), expected[index], `${timezoneId} schedule ${title}`);
      }
      await schedule.screenshot({ path: join(tmpdir(), `parliament-timezone-${timezoneId.replaceAll("/", "-")}.png`), fullPage: true });
      for (const page of [catalogue, schedule]) {
        await page.locator("#locale-select").selectOption("nl");
        assert.equal(await page.locator("html").getAttribute("lang"), "nl");
        assert.equal(await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone), timezoneId);
        const times = page === catalogue
          ? page.locator(".programme-record .programme-time")
          : page.locator("#schedule-list tr").filter({ hasText: "Auckland DST before" }).locator(".programme-time");
        for (const [index, clock] of dutchClocks.entries()) {
          const text = (await times.nth(index).innerText()).replace(/\s+/g, " ");
          assert.match(text, new RegExp(`\\b0?${clock}\\b`), `${timezoneId}: language change must retain viewer local time`);
        }
      }
      await catalogue.locator("#locale-select").selectOption("en");
      await catalogue.locator(`[data-channel-id="${hebrew.id}"]`).click();
      await schedule.locator("#locale-select").selectOption("en");
      for (const locale of ["en", "nl"]) {
        for (const page of [catalogue, schedule]) {
          await page.locator("#locale-select").selectOption(locale);
          const container = page === catalogue
            ? page.locator(".programme-record")
            : page.locator("#schedule-list tr").filter({ hasText: hebrew.titles[0] });
          await checkBidi(page, container);
          const times = container.locator('.programme-time bdi[dir="ltr"]');
          if (locale === "en") await checkTimes(times, expected[0], `${timezoneId} Hebrew ${page === catalogue ? "catalogue" : "schedule"}`);
          else for (const [index, clock] of hebrewDutchClocks.entries()) {
            assert.match(await times.nth(index).innerText(), new RegExp(`\\b0?${clock}\\b`));
          }
          if (timezoneId === "America/Toronto" && locale === "en") {
            await page.screenshot({ path: join(tmpdir(), `parliament-rtl-${page === catalogue ? "catalogue" : "schedule"}-desktop.png`), fullPage: page === schedule });
          }
        }
      }
      if (timezoneId === "America/Toronto") {
        for (const page of [catalogue, schedule]) {
          await page.setViewportSize({ width: 390, height: 844 });
          if (page === catalogue) await page.locator(`[data-channel-id="${hebrew.id}"]`).click();
          const container = page === catalogue
            ? page.locator(".programme-record")
            : page.locator("#schedule-list tr").filter({ hasText: hebrew.titles[0] });
          await checkBidi(page, container);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
          await page.screenshot({ path: join(tmpdir(), `parliament-rtl-${page === catalogue ? "catalogue" : "schedule"}-mobile.png`), fullPage: page === schedule });
        }
      }
      assert.deepEqual(errors, [], `${timezoneId}: timezone rendering must not raise page errors`);
    } finally {
      await context.close();
    }
  }
}

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
assert(address && typeof address === "object");
const baseUrl = `http://127.0.0.1:${address.port}/site/`;
const browser = await chromium.launch({ args: ["--mute-audio"] });

try {
  const context = await newLocalContext(browser, { viewport: { width: 1280, height: 900 } });
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
        const destroy = value.prototype.destroy;
        value.prototype.destroy = function () {
          observation.destroyed = (observation.destroyed || 0) + 1;
          return destroy.call(this);
        };
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
  await assertPersistentViewer(hlsPage, baseUrl);
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
  const catalogueSearch = await page.locator("#search").boundingBox();
  assert(catalogueSearch.y + catalogueSearch.height < page.viewportSize().height, "Catalogue search remains available in the first desktop viewport");
  assert.equal(await page.locator(".catalogue-information summary").count(), 0);
  assert.equal(await page.locator("#catalogue-overview").isVisible(), true);
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
  await assertPlaybackColumnAlignment(page);
  await assertPageMetadata(page);
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
    await assertPageMetadata(page);
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
    for (const search of ["Neuquen", "Neuquén", "Neuque\u0301n"]) {
      await page.locator("#search").fill(search);
      assert.equal(await page.locator('[data-channel-id="argentina-neuquen-legislature-webcasts"]').count(), 1);
    }
    await page.locator("#search").fill("Canada");
    for (const region of ["Alberta", "Ontario", "Quebec", "New Brunswick"]) {
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
    "VIEWING METHOD",
  ]);
  assert.equal(await page.locator("#sort-mode").innerText(), "VIEWING METHOD");
  await page.locator("#sort-mode").click();
  assert.match(await page.locator("#sort-status").innerText(), /Viewing method: ascending/);
  assert.match(await page.locator(".channel-button").first().locator(".source-posture").innerText(), /Watch here/);
  await page.locator("#sort-mode").click();
  assert.match(await page.locator("#sort-status").innerText(), /Viewing method: descending/);
  assert.match(await page.locator(".channel-button").first().locator(".source-posture").innerText(), /Watch on official site/);
  assert.equal(canonicalCatalogue.channels.some((channel) => channel.playback_policy === "research_only"), false);
  assert.equal(await page.locator(".source-posture-research").count(), 0);
  /* Removed research candidates must not reappear through the embedded fallback. */
  for (const id of ["spain-congreso-directo-3", "mongolia-parliament-tv", "ontario-house-en-cc", "el-salvador-legislative-assembly"]) {
    assert.equal(await page.locator(`[data-channel-id="${id}"]`).count(), 0);
  }
  await page.locator("#sort-source").click();
  const navarreFlag = page.locator('[data-channel-id="navarre-parliament-live"] .jurisdiction-flag');
  assert.equal(await navarreFlag.count(), 1);
  assert.match(await navarreFlag.getAttribute("src"), /assets\/flags\/navarre\.svg$/);
  const youtubeRow = page.locator('[data-channel-id="australia-parliament-youtube"]');
  await youtubeRow.click();
  assert.equal(await youtubeRow.evaluate((element) => document.activeElement === element), true);
  assert.equal(await youtubeRow.getAttribute("role"), null);
  await assertPlaybackColumnAlignment(page);
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
  assert.match(await page.locator(".source-documentation").first().locator(".detail-grid").first().innerText(), /VIEWING METHOD\s+Provider embed/);
  assert.equal(await page.locator(".source-documentation > summary").first().innerText(), "Viewing and checks");
  assert.equal(await page.locator(".source-documentation > summary").nth(1).innerText(), "Reuse and permissions");
  assert.equal(await page.locator(".source-documentation").first().locator(".permission-record").count(), 0);
  assert.equal(await page.locator(".source-documentation").nth(1).locator(".permission-record").count(), 1);

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
  assert.match(await page.locator(".validation-record").innerText(), /Technical checks OK/);

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
  await page.locator('[data-channel-id="norway-stortinget"]').click();
  await page.locator(".source-documentation > summary").first().click();
  await page.locator(".source-documentation > summary").nth(1).click();
  const detailTerms = await page.locator(".detail-grid dt").allTextContents();
  assert(detailTerms.includes("技术检查"));
  assert.equal(detailTerms.includes("所需署名"), false);
  assert.equal(detailTerms.includes("当前节目记录"), false);
  assert(detailTerms.includes("媒体无障碍"));
  assert.equal(await page.locator("#media-frame").count(), 0);
  assert.equal(await page.locator(".official-button").isVisible(), true);
  assert.match(await page.locator(".accessibility-record").innerText(), /字幕: 尚未验证/);
  assert.match(await page.locator(".accessibility-record").innerText(), /手语: 尚未验证/);
  assert.equal(await page.locator(".accessibility-record .detail-subtitle").count(), 0);
  assert.match(await page.locator(".epg-list").innerText(), /节目表页面/);
  assert.match(await page.locator(".evidence-note").innerText(), /^证据来源。/);
  assert.match(await page.locator(".evidence-note a").first().innerText(), /官方观看页面|支持来源/);
  assert.equal(await page.locator(".research-note-disclosure summary").innerText(), "目录的英文研究说明");
  assert.match(await page.locator('#norway-stortinget-description').innerText(), /请使用官方网站，因为这里未嵌入播放。/);

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
  const intermediateGrid = await page.locator(".source-documentation").first().locator(".detail-grid").boundingBox();
  assert(intermediateGrid.width <= intermediatePanel.width);
  await assertNoAxeViolations(page, "Open intermediate-width source details");
  await page.locator("#detail-title").press("Escape");
  assert.equal(await page.locator("#detail-panel").isVisible(), false);

  await page.setViewportSize({ width: 320, height: 800 });
  await page.reload();
  await page.waitForSelector(".channel-button");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  assert.equal(await page.locator("#primary-navigation > a:visible").count(), 5);
  assert.equal(await page.locator("#primary-navigation [data-project-navigation]").isVisible(), true);
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
        "italy-senate": {
          current_event_title: "No programme listed",
          next_event_title: "Senate sitting",
          next_event_start: "2026-08-17T16:00:00Z",
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
  assert.equal(await schedulePage.locator("#schedule-list tr").count(), 4);
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
  assert.equal(await schedulePage.locator("#schedule-list tr").count(), 3);
  await schedulePage.locator("#schedule-status").selectOption("playable");
  assert.equal(await schedulePage.locator("#schedule-list tr").count(), 2);
  assert((await schedulePage.locator(".schedule-watch").evaluateAll((links) => links.map((link) => link.href))).every((href) => href.includes("play=1")));
  await schedulePage.locator("#schedule-status").selectOption("");
  await schedulePage.locator("#schedule-jurisdiction").selectOption("Italy");
  assert.equal(await schedulePage.locator("#schedule-list tr").count(), 1);
  assert.match(await schedulePage.locator(".schedule-flag").getAttribute("src"), /assets\/flags\/it\.svg$/);
  await schedulePage.locator("#schedule-jurisdiction").selectOption("Fukushima");
  assert.equal(await schedulePage.locator("#schedule-list tr").count(), 0);
  assert.equal(await schedulePage.locator("#official-schedules").isVisible(), true);
  assert.equal(await schedulePage.locator("#official-schedules").evaluate((element) => element.open), true);
  assert.equal(await schedulePage.locator("#official-schedules-list > li").count(), 1);
  assert.match(await schedulePage.locator("#official-schedules-list").innerText(), /Fukushima/);
  assert.equal(new URL(schedulePage.url()).searchParams.get("jurisdiction"), "Fukushima");
  await schedulePage.locator("#locale-select").selectOption("fr");
  assert.equal(await schedulePage.locator("#schedule-jurisdiction").inputValue(), "Fukushima");
  await schedulePage.locator("#locale-select").selectOption("en");
  await schedulePage.reload();
  await schedulePage.waitForSelector("#official-schedules-list > li", { state: "attached" });
  assert.equal(await schedulePage.locator("#schedule-jurisdiction").inputValue(), "Fukushima");
  await schedulePage.locator("#schedule-jurisdiction").selectOption("");
  await assertPageMetadata(schedulePage, "schedule.html");
  await assertIptvDisclosure(schedulePage);
  await assertIptvLocales(schedulePage, '#locale-select');
  await assertNoAxeViolations(schedulePage, "Desktop programme guide");
  await schedulePage.goto(`${baseUrl}schedule.html?lang=fr`);
  await schedulePage.waitForSelector("#schedule-list tr");
  assert.equal(await schedulePage.locator("#schedule-title").innerText(), "Horaire");
  await assertPageMetadata(schedulePage, "schedule.html");
  assert.equal(await schedulePage.locator("#schedule-now-heading").textContent(), "Maintenant");
  assert.deepEqual(
    await schedulePage.evaluate(() => window.ParliamentStreamsI18n.locales.flatMap(([code]) => window.ParliamentStreamsScheduleI18n.coverage(code).map((key) => `${code}:${key}`))),
    [],
  );
  await schedulePage.setViewportSize({ width: 320, height: 800 });
  assert.equal(await schedulePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  assert.equal(await schedulePage.locator("#schedule-primary-navigation > a:visible").count(), 5);
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
  await schedulePage.unroute("**/data/schedules.json");
  await schedulePage.route("**/data/schedules.json", (route) => route.fulfill({ status: 404, body: "Not found" }));
  await schedulePage.goto(`${baseUrl}schedule.html?lang=en&jurisdiction=Fukushima`);
  await schedulePage.waitForSelector("#official-schedules-list > li", { state: "attached" });
  assert.equal(await schedulePage.locator("#schedule-jurisdiction").inputValue(), "Fukushima");
  assert.equal(await schedulePage.locator("#schedule-list tr").count(), 0);
  assert.equal(await schedulePage.locator("#official-schedules").isVisible(), true);
  assert.match(await schedulePage.locator("#schedule-updated").innerText(), /Not available/);
  assert.match(await schedulePage.locator("#schedule-coverage").innerText(), /Programme data is unavailable/);

  // Publication outcomes must remain distinct from filter mismatches. Quality
  // labels are used only for the exact same generated schedule window.
  const coverageDate = "2026-10-25T21:04:12Z";
  const coverageSnapshot = {
    schema_version: 3,
    generated_at: coverageDate,
    sources: {
      "new-zealand-parliament": { status: "error" },
      "czech-chamber-plenary": { status: "empty" },
    },
    channels: {
      "cpac-ca": { current_event_title: "Current programme", current_event_start: coverageDate, fetched_at: coverageDate },
      "estonia-riigikogu-live-1": { next_event_title: "Plenary sitting", next_event_start: "2026-10-26T13:00:00Z", fetched_at: coverageDate },
      "canada-house-of-commons-parlvu": { next_event_title: "Committee meeting", next_event_start: "2026-10-26T15:00:00Z", fetched_at: coverageDate, last_success_at: "2026-10-25T15:00:00Z", stale: true },
    },
  };
  let qualityDate = coverageDate;
  await schedulePage.unroute("**/data/schedules.json");
  await schedulePage.route("**/data/schedules.json", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify(coverageSnapshot) }));
  await schedulePage.route("**/data/epg-quality.json", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({
    schema_version: 1, generated_at: qualityDate, coverage: { channels: {
      "cpac-ca": { state: "guide_available" },
      "estonia-riigikogu-live-1": { state: "quality_hold" },
      "canada-house-of-commons-parlvu": { state: "mapping_unverified" },
    } },
  }) }));
  await schedulePage.goto(`${baseUrl}schedule.html?lang=en&jurisdiction=New+Zealand&listings=current`);
  await schedulePage.locator("#schedule-coverage").filter({ hasText: "could not be collected" }).waitFor();
  assert.equal(await schedulePage.locator("#schedule-empty").isVisible(), false);
  assert.equal(await schedulePage.locator("#official-schedules").isVisible(), true);
  assert.equal(await schedulePage.locator("#official-schedules").evaluate((element) => element.open), true);
  assert.equal(await schedulePage.locator(".schedule-table-wrap").isVisible(), false);
  await schedulePage.locator("#schedule-jurisdiction").selectOption("Alberta");
  assert.match(await schedulePage.locator("#schedule-coverage").innerText(), /No automated listings yet/);
  await schedulePage.locator("#schedule-jurisdiction").selectOption("Czechia");
  assert.match(await schedulePage.locator("#schedule-coverage").innerText(), /checked window/);
  await schedulePage.locator("#schedule-clear").click();
  assert.equal(await schedulePage.locator("#schedule-jurisdiction").evaluate((element) => document.activeElement === element), true);
  assert.equal(new URL(schedulePage.url()).searchParams.has("listings"), false);
  assert.equal(new URL(schedulePage.url()).searchParams.has("jurisdiction"), false);
  assert.equal(await schedulePage.locator("#schedule-list tr").count(), 3);
  assert.match(await schedulePage.locator("#schedule-list").innerText(), /Event listings/);
  assert.match(await schedulePage.locator("#schedule-list").innerText(), /Not included in XMLTV/);
  assert.match(await schedulePage.locator(".schedule-channel-stale").innerText(), /last successful collection/);
  assert(await schedulePage.locator(".schedule-official").count() > 0, "External viewing sources need a direct official link");
  qualityDate = "2026-10-25T15:00:00Z";
  await schedulePage.reload();
  await schedulePage.locator("#schedule-list tr").first().waitFor();
  assert.equal(await schedulePage.locator(".schedule-kind").count(), 0, "Mismatched quality snapshots cannot describe the current guide");
  await schedulePage.close();

  const mapPage = await context.newPage();
  await mapPage.goto(`${baseUrl}map.html?lang=en`);
  await mapPage.waitForSelector(".map-country.is-documented");
  await assertPageMetadata(mapPage, "map.html");
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
  assert.equal(await mapPage.locator(".map-region").count(), expectedSubnationalJurisdictions.size - institutionLocationFeatures.length);
  assert.equal(await mapPage.locator(".map-location-marker").count(), institutionLocationFeatures.length);
  const canadianRegionalNames = new Set(documentedSubnationalGeometry.features
    .filter((feature) => feature.properties.parent_code === "CA")
    .map((feature) => feature.properties.name));
  const canadianSourceCount = canonicalCatalogue.channels.filter((channel) =>
    channel.country_or_region === "Canada" || canadianRegionalNames.has(channel.country_or_region)
  ).length;
  assert.match(await mapPage.locator("#map-detail").innerText(), new RegExp(`Canada.*${canadianSourceCount} sources`, "s"));
  assert.equal(
    await mapPage
      .getByRole("button", { name: "Alberta, Documented, Subnational", exact: true })
      .evaluate((element) => getComputedStyle(element).fill),
    "rgb(182, 41, 58)",
  );
  // Search feedback stays beside the field. Enter moves to explicit results
  // rather than silently selecting the first match, and activation keeps focus.
  const previousDetail = await mapPage.locator("#map-detail h2").innerText();
  await mapPage.locator("#map-search").fill("Alberta");
  assert.equal(await mapPage.locator("#jurisdiction-index").evaluate((element) =>
    Boolean(element.compareDocumentPosition(document.querySelector(".map-layout")) & Node.DOCUMENT_POSITION_FOLLOWING)), true);
  assert.equal(await mapPage.locator("#jurisdiction-visible-count").getAttribute("role"), "status");
  await mapPage.locator("#map-search").press("Enter");
  assert.equal(await mapPage.locator('#jurisdiction-list button[data-jurisdiction="subnational:Alberta"]').evaluate((element) => document.activeElement === element), true);
  assert.equal(await mapPage.locator("#map-detail h2").innerText(), previousDetail);
  await mapPage.locator('#jurisdiction-list button[data-jurisdiction="subnational:Alberta"]').press("Enter");
  assert.equal(await mapPage.locator("#map-detail-title").evaluate((element) => document.activeElement === element), true);
  assert.equal(await mapPage.locator('#world-map [role="button"][tabindex="0"]').count(), 1);
  const selectedShape = mapPage.getByRole("button", { name: "Alberta, Documented, Subnational", exact: true });
  assert.equal(await selectedShape.getAttribute("aria-pressed"), "true");
  await selectedShape.press("ArrowRight");
  assert.equal(await selectedShape.evaluate((element) => document.activeElement === element), false);
  const focusedShape = mapPage.locator('#world-map [role="button"][tabindex="0"]');
  assert.equal(await focusedShape.evaluate((element) => document.activeElement === element), true);
  assert.notEqual(await focusedShape.evaluate((element) => getComputedStyle(element).outlineStyle), "none");
  assert.equal(await mapPage.locator("#map-detail h2").innerText(), "Alberta", "Arrow browsing must not change the selection");
  await focusedShape.press("Home");
  assert.equal(await mapPage.locator('#world-map [role="button"][tabindex="0"]').evaluate((element) => document.activeElement === element), true);
  await mapPage.locator("#map-search").fill("no-such-jurisdiction-xyz");
  assert.equal(await mapPage.locator("#jurisdiction-list button").count(), 0);
  assert(await mapPage.locator(".map-search-empty").isVisible());
  await mapPage.locator("#map-search").fill("");
  assert.equal(await mapPage.locator("#jurisdiction-list button").count(), expectedJurisdictionCount);
  assert.equal(await mapPage.locator("#jurisdiction-index").evaluate((element) =>
    Boolean(element.compareDocumentPosition(document.querySelector(".map-layout")) & Node.DOCUMENT_POSITION_PRECEDING)), true);
  await mapPage.locator("#map-search").fill("Japan");
  await mapPage.locator('#jurisdiction-list button[data-jurisdiction="national:Japan"]').click();
  await mapPage.waitForTimeout(300);
  assert.equal(await mapPage.locator("#map-detail h2").innerText(), "Japan");
  assert.match(await mapPage.locator(".map-viewport").getAttribute("transform"), /scale\(1\)/, "Country selection resets the former regional zoom");
  await selectMapSearchResult(mapPage, "European Union");
  await mapPage.waitForTimeout(300);
  assert.match(await mapPage.locator("#map-detail").innerText(), /Member States/i);
  assert.match(await mapPage.locator(".map-viewport").getAttribute("transform"), /scale\(1\)/);
  await mapPage.getByRole("button", { name: "All coverage", exact: true }).click();
  // Nearby institution seats must remain distinct pointer targets while zooming.
  for (const feature of institutionLocationFeatures) {
    const name = feature.properties.name;
    // A preceding seat may be on another continent; return to the overview
    // before exercising its pointer target rather than clicking off-screen.
    await mapPage.locator("#zoom-reset").click();
    await mapPage.waitForTimeout(300);
    const marker = mapPage.locator(`.map-location-marker[data-jurisdiction="${name}"]`);
    await marker.click();
    await mapPage.waitForTimeout(300);
    assert.equal(await mapPage.locator("#map-detail h2").innerText(), name);
    assert.equal(await mapPage.locator('.map-location-note p[lang="en"]').innerText(), feature.properties.scope_note);
    assert.equal(await mapPage.locator(`path.map-region[data-jurisdiction="${name}"]`).count(), 0);
  }
  if (institutionLocationFeatures.some((feature) => feature.properties.name === "Chakma Autonomous District")
      && institutionLocationFeatures.some((feature) => feature.properties.name === "Lai Autonomous District")) {
    // The two Mizoram seats must also remain separately clickable at shared zoom.
    await selectMapSearchResult(mapPage, "Chakma Autonomous District");
    await mapPage.waitForTimeout(300);
    for (const name of ["Chakma Autonomous District", "Lai Autonomous District"]) {
      await mapPage.locator(`.map-location-marker[data-jurisdiction="${name}"]`).click();
      await mapPage.waitForTimeout(300);
      assert.equal(await mapPage.locator("#map-detail h2").innerText(), name);
    }
  }
  await mapPage.getByRole("button", { name: "National", exact: true }).click();
  await mapPage.getByRole("button", { name: "Brazil, Documented", exact: true }).click();
  assert.equal(
    await mapPage
      .getByRole("button", { name: "Brazil, Documented", exact: true })
      .evaluate((element) => getComputedStyle(element).fill),
    "rgb(182, 41, 58)",
  );
  assert.equal(
    await mapPage.locator('#jurisdiction-list button[data-jurisdiction="national:Brazil"]').getAttribute("aria-pressed"),
    "true",
  );
  const expectedBrazilNationalSources = canonicalCatalogue.channels.filter((channel) =>
    channel.jurisdiction_level === "national" && channel.country_or_region === "Brazil"
  ).length;
  assert.match(
    await mapPage.locator('#jurisdiction-list button[data-jurisdiction="national:Brazil"]').innerText(),
    new RegExp(`Brazil.*National.*${expectedBrazilNationalSources} sources?`, "si"),
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
  const germanRegionalNames = new Set(documentedSubnationalGeometry.features
    .filter((feature) => feature.properties.parent_code === "DE")
    .map((feature) => feature.properties.name));
  const germanSourceCount = canonicalCatalogue.channels.filter((channel) =>
    channel.country_or_region === "Germany" || germanRegionalNames.has(channel.country_or_region)
  ).length;
  assert.match(await mapPage.locator("#map-detail").innerText(), new RegExp(`EU · Member State.*Germany.*${germanSourceCount} sources`, "s"));
  await mapPage.getByRole("button", { name: "Zoom in", exact: true }).click();
  await mapPage.waitForTimeout(300);
  const transformBeforeSubnational = await mapPage.locator(".map-viewport").getAttribute("transform");
  await mapPage.getByRole("button", { name: "Subnational", exact: true }).click();
  assert.equal(
    await mapPage.locator(".map-viewport").getAttribute("transform"),
    transformBeforeSubnational,
  );
  await selectMapSearchResult(mapPage, "Scotland");
  await mapPage.waitForTimeout(300);
  assert.match(await mapPage.locator("#map-detail").innerText(), /United Kingdom.*Scotland/s);
  assert.equal(
    await mapPage.locator("#jurisdiction-visible-count").evaluate((element) => element.dataset.count),
    `1 / ${expectedJurisdictionCount}`,
  );
  assert.equal(await mapPage.locator(".map-region.is-selected").count(), 1);
  assert.notEqual(await mapPage.locator(".map-viewport").getAttribute("transform"), null);
  assert.match(await mapPage.locator("#map-detail .map-source-list a").first().getAttribute("href"), /source=scottish-parliament-tv/);
  await assertNoAxeViolations(mapPage, "Desktop coverage map");
  for (const search of ["Neuquen", "Neuquén", "Neuque\u0301n"]) {
    await mapPage.locator("#map-search").fill(search);
    assert.equal(await mapPage.locator('#jurisdiction-list button[data-jurisdiction="subnational:Neuquén"]').count(), 1);
  }
  for (const [country, region, sourceId, code] of [
    ["Canada", "Alberta", "alberta-assembly-online", "CA"],
    ["Argentina", "Córdoba", "argentina-cordoba-legislature-live", "AR"],
    ["Japan", "Nagasaki", "japan-nagasaki-assembly-committees", "JP"],
    ["Brazil", "Santa Catarina", "brazil-santa-catarina-tv-alesc", "BR"],
    ["France", "French Polynesia", "french-polynesia-assembly-webcasts", "FR"],
    ["France", "New Caledonia", "new-caledonia-congress-webtv", "FR"],
    ["Jersey", "Jersey", "jersey-states-assembly-webcasts", "JE"],
    ["Netherlands", "Sint Maarten", "sint-maarten-parliament-live", "SX"],
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
  await selectMapSearchResult(mapPage, "Écosse");
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
  assert.equal(await mapPage.locator("#map-primary-navigation > a:visible").count(), 5);
  assert((await mapPage.locator("#world-map").boundingBox()).height <= 220);
  assert((await mapPage.locator("#map-detail .text-link").boundingBox()).height >= 24, "The complete-catalogue link must retain a full mobile pointer target");
  await assertNoAxeViolations(mapPage, "Mobile coverage map");
  await mapPage.close();

  // A controlled location fixture exercises the distinction even when the
  // catalogue has no location-only geometry. It must never become an area.
  const locationMapPage = await context.newPage();
  const locationScopeNote = "Test fixture: institution marker, not a territorial outline.";
  await locationMapPage.route("**/assets/maps/documented-admin1.geojson*", async (route) => {
    const fixture = structuredClone(primarySubnationalGeometry);
    const alberta = fixture.features.find((feature) => feature.properties.name === "Alberta");
    assert(alberta);
    alberta.geometry = { type: "Point", coordinates: [-113.4938, 53.5402] };
    Object.assign(alberta.properties, {
      geometry_scope: "institution_location",
      scope_note: locationScopeNote,
      source_url: "https://www.assembly.ab.ca/",
    });
    await route.fulfill({ json: fixture });
  });
  await locationMapPage.goto(`${baseUrl}map.html?lang=en`);
  const locationMarker = locationMapPage.locator('.map-location-marker[data-jurisdiction="Alberta"]');
  await locationMarker.waitFor();
  assert.equal(await locationMapPage.locator('path.map-region[data-jurisdiction="Alberta"]').count(), 0);
  assert.equal(await locationMapPage.locator("#legend-location").isVisible(), true);
  assert.equal(await locationMapPage.locator("#legend-location-label").innerText(), "Institution location");
  assert.equal(await locationMarker.getAttribute("aria-label"), "Alberta, Institution location, Documented");
  const markerGeometrySize = (element) => {
    const bounds = element.getBBox();
    const matrix = element.getScreenCTM();
    return { width: bounds.width * Math.hypot(matrix.a, matrix.b), height: bounds.height * Math.hypot(matrix.c, matrix.d) };
  };
  await locationMarker.focus();
  // Compare geometry, excluding the deliberately different focus/selection
  // outlines. Those paint cues must be allowed to change when focus moves.
  const initialMarkerBounds = await locationMarker.evaluate(markerGeometrySize);
  assert(initialMarkerBounds);
  await locationMarker.press("Enter");
  await locationMapPage.waitForTimeout(300);
  assert.match(await locationMapPage.locator("#map-detail").innerText(), /Alberta/);
  assert.match(await locationMapPage.locator(".map-location-note").innerText(), /This marker locates the institution/);
  assert.equal(await locationMapPage.locator('.map-location-note p[lang="en"]').innerText(), locationScopeNote);
  assert.equal(await locationMapPage.locator(".map-location-note a").getAttribute("href"), "https://www.assembly.ab.ca/");
  const selectedMarkerBounds = await locationMarker.evaluate(markerGeometrySize);
  assert(selectedMarkerBounds);
  assert(Math.abs(selectedMarkerBounds.width - initialMarkerBounds.width) < .1, "Location marker width must stay constant while zooming");
  assert(Math.abs(selectedMarkerBounds.height - initialMarkerBounds.height) < .1, "Location marker height must stay constant while zooming");
  await locationMapPage.getByRole("button", { name: "National", exact: true }).click();
  assert.equal(await locationMapPage.locator(".map-location-marker").count(), 0);
  assert.equal(await locationMapPage.locator("#legend-location").isVisible(), false);
  await locationMapPage.getByRole("button", { name: "Subnational", exact: true }).click();
  await selectMapSearchResult(locationMapPage, "Alberta");
  assert.equal(await locationMapPage.locator(".map-location-marker.is-selected").count(), 1);
  assert.equal(await locationMapPage.locator('#jurisdiction-list button[data-jurisdiction="subnational:Alberta"]').getAttribute("aria-pressed"), "true");
  await assertNoAxeViolations(locationMapPage, "Institution location coverage map");
  await locationMapPage.goto(`${baseUrl}map.html?lang=fr`);
  await locationMapPage.locator('.map-location-marker[data-jurisdiction="Alberta"]').waitFor();
  await locationMapPage.locator('.map-location-marker[data-jurisdiction="Alberta"]').focus();
  await locationMapPage.locator('.map-location-marker[data-jurisdiction="Alberta"]').press(" ");
  assert.equal(await locationMapPage.locator("#legend-location-label").innerText(), "Siège de l’institution");
  assert.match(await locationMapPage.locator(".map-location-note").innerText(), /Ce repère situe l’institution/);
  assert.equal(await locationMapPage.locator('.map-location-note p[lang="en"]').innerText(), locationScopeNote);
  await locationMapPage.setViewportSize({ width: 320, height: 800 });
  await locationMapPage.reload();
  await locationMapPage.locator('.map-location-marker[data-jurisdiction="Alberta"]').waitFor();
  await locationMapPage.locator('.map-location-marker[data-jurisdiction="Alberta"]').focus();
  await locationMapPage.locator('.map-location-marker[data-jurisdiction="Alberta"]').press("Enter");
  await locationMapPage.waitForTimeout(300);
  assert.equal(await locationMapPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  await assertNoAxeViolations(locationMapPage, "Mobile localized institution location map");
  await locationMapPage.close();

  const institutionsPage = await context.newPage();
  const institutionErrors = [];
  institutionsPage.on("pageerror", (error) => institutionErrors.push(error.message));
  await institutionsPage.goto(`${baseUrl}institutions.html?lang=en`);
  await institutionsPage.waitForSelector(".institution-country");
  await assertPageMetadata(institutionsPage, "institutions.html");
  assert.equal(await institutionsPage.locator(".institution-country").count(), 71);
  assert.equal(await institutionsPage.locator(".institution-country[open]").count(), 0);
  assert.match(await institutionsPage.locator("#institution-results").innerText(), /Entries: 948 · Country groups: 71/);
  assert.equal(await institutionsPage.locator("#locale-select option").count(), 23);
  await assertNoAxeViolations(institutionsPage, "Desktop legislature inventory");
  await institutionsPage.locator("#institution-country").selectOption("Argentina");
  const legislatureHeading = institutionsPage.locator("#argentina--buenos-aires > .institution-row-heading");
  const chamberHeading = institutionsPage.locator("#argentina--buenos-aires--organ--camara-de-diputados > .institution-row-heading");
  for (const width of [1280, 801]) {
    await institutionsPage.setViewportSize({ width, height: 900 });
    for (const column of [".institution-status", ".institution-viewing"]) {
      const legislatureColumn = await legislatureHeading.locator(column).boundingBox();
      const chamberColumn = await chamberHeading.locator(column).boundingBox();
      assert(Math.abs(legislatureColumn.x - chamberColumn.x) < 1, `Nested chamber ${column} must align at ${width}px`);
    }
  }
  await institutionsPage.setViewportSize({ width: 1280, height: 900 });
  await institutionsPage.locator("#institution-clear").click();
  await institutionsPage.locator("#institution-search").fill("Canada");
  await institutionsPage.locator("#canada--alberta").waitFor();
  assert.equal(await institutionsPage.locator(".institution-country").count(), 1);
  await institutionsPage.locator("#institution-search").fill("Alberta");
  assert.match(await institutionsPage.locator("#canada--alberta .institution-name").innerText(), /Alberta/);
  const albertaSource = institutionsPage.locator("#canada--alberta .institution-viewing a").first();
  assert.match(await albertaSource.getAttribute("href"), /source=alberta/);
  await institutionsPage.locator("#canada--alberta .institution-evidence > summary").click();
  const correction = new URL(await institutionsPage.locator("#canada--alberta .institutions-links a").getAttribute("href"));
  assert.equal(correction.searchParams.get("template"), "contribution.yml");
  assert.equal(new URL(correction.searchParams.get("page")).searchParams.get("status"), "all");
  assert.match(correction.searchParams.get("context"), /canada--alberta/);
  await assertNoAxeViolations(institutionsPage, "Expanded institution evidence");
  const structuredScopeRecord = await institutionsPage.evaluate(() => {
    const record = window.PARLIAMENT_STREAMS_INSTITUTIONS.records.find((row) =>
      row.service_review?.followups?.some((followup) => followup.scope && typeof followup.scope === "object"));
    return {
      id: record.id,
      scopes: record.service_review.followups.filter((followup) => followup.scope && typeof followup.scope === "object").map((followup) => followup.scope),
    };
  });
  await institutionsPage.locator("#institution-search").fill(structuredScopeRecord.id);
  const structuredScopeRow = institutionsPage.locator(`[id="${structuredScopeRecord.id}"]`);
  await structuredScopeRow.locator(".institution-evidence > summary").click();
  await structuredScopeRow.locator("dl.institution-service-scope").first().waitFor();
  const renderedScopes = await structuredScopeRow.locator("dl.institution-service-scope").evaluateAll((notes) => notes.map((note) => ({
    lang: note.lang,
    labels: [...note.querySelectorAll("dt")].map((node) => node.textContent),
    values: [...note.querySelectorAll("dd")].map((node) => node.textContent),
  })));
  assert.deepEqual(renderedScopes, structuredScopeRecord.scopes.map((scope) => ({
    lang: "en",
    labels: Object.keys(scope).map((key) => {
      const label = key.replaceAll("_", " ");
      return label.charAt(0).toUpperCase() + label.slice(1);
    }),
    values: Object.values(scope).map((value) => typeof value === "string" ? value : JSON.stringify(value)),
  })));
  assert.doesNotMatch(await structuredScopeRow.innerText(), /\[object Object\]/);
  await assertNoAxeViolations(institutionsPage, "Structured institution review scope");
  await institutionsPage.locator("#institution-clear").click();
  await institutionsPage.locator("#institution-status").selectOption("specific_authority_evidence_hold");
  assert.equal(await institutionsPage.locator(".institution-row").count(), 8);
  assert.equal(await institutionsPage.locator('.institution-row[data-status="eligible_legislature"]').count(), 0);
  await institutionsPage.locator("#institution-status").selectOption("outside_default_scope");
  assert.match(await institutionsPage.locator("#institution-results").innerText(), /Entries: 462/);
  await institutionsPage.locator("#institution-search").fill("unfindable-institution-xyz");
  assert.equal(await institutionsPage.locator(".institution-country").count(), 0);
  assert.match(await institutionsPage.locator(".institution-empty").innerText(), /No matching institutions/);
  await institutionsPage.locator("#institution-clear").click();
  await institutionsPage.locator("#locale-select").selectOption("fr");
  assert.equal(await institutionsPage.locator("html").getAttribute("lang"), "fr");
  assert.equal(await institutionsPage.locator("#institutions-title").innerText(), await institutionsPage.evaluate(() => window.ParliamentStreamsInstitutionsI18n.message("fr", "title")));
  assert.match(await institutionsPage.locator("#institutions-nav-catalogue").getAttribute("href"), /lang=fr/);
  await assertPageMetadata(institutionsPage, "institutions.html");
  assert.deepEqual(await institutionsPage.evaluate(() => window.ParliamentStreamsI18n.locales.filter(([locale]) => window.ParliamentStreamsInstitutionsI18n.coverage(locale).missing.length).map(([locale]) => locale)), []);
  await institutionsPage.setViewportSize({ width: 320, height: 800 });
  await institutionsPage.locator("#institution-country").selectOption("Canada");
  assert.equal(await institutionsPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  assert.equal(await institutionsPage.locator("#institutions-navigation > a:visible").count(), 5);
  await assertNoAxeViolations(institutionsPage, "Mobile localized legislature inventory");
  const inventoryFileUrl = new URL("../site/institutions.html", import.meta.url);
  inventoryFileUrl.search = "?lang=en&q=Alberta";
  await institutionsPage.goto(inventoryFileUrl.href);
  await institutionsPage.locator("#canada--alberta").waitFor();
  assert.deepEqual(institutionErrors, []);
  await institutionsPage.close();

  const dataPage = await context.newPage();
  const dataErrors = [];
  dataPage.on("pageerror", (error) => dataErrors.push(error.message));
  await dataPage.goto(`${baseUrl}data.html?lang=en`);
  await dataPage.locator("#data-title").waitFor();
  await assertPageMetadata(dataPage, "data.html");
  assert.equal(await dataPage.locator(".data-stage").count(), 4);
  assert.equal(await dataPage.locator(".data-assets > div").count(), 7);
  assert.equal(await dataPage.locator(".data-asset-links a").count(), 9);
  assert.match(await dataPage.locator(".data-limits").innerText(), /parser.*not populated guides/i);
  assert.match(await dataPage.locator(".data-limits").innerText(), /rights.*separate|licensing is separate/i);
  const dataLocales = await dataPage.evaluate(() => window.ParliamentStreamsI18n.locales.map(([code]) => code));
  for (const code of dataLocales) {
    await dataPage.locator("#locale-select").selectOption(code);
    assert.deepEqual(await dataPage.evaluate((locale) => window.ParliamentStreamsProjectI18n.coverage(locale).missing, code), []);
    assert.equal(await dataPage.locator("html").getAttribute("lang"), code);
    assert.equal(new URL(dataPage.url()).searchParams.get("lang"), code);
    assert.equal(new URL(await dataPage.locator("#data-nav-catalogue").getAttribute("href")).searchParams.get("lang"), code);
    assert.equal(new URL(await dataPage.locator('[data-project-links="intro"] a').first().getAttribute("href")).searchParams.get("lang"), code);
    if (code !== "en") assert.notEqual(await dataPage.locator("#data-title").innerText(), "Data and method");
    await assertPageMetadata(dataPage, "data.html");
    await dataPage.setViewportSize({ width: 320, height: 800 });
    assert.equal(await dataPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${code}: translated data page fits a narrow screen`);
  }
  for (const code of ["en", "de", "fr"]) {
    await dataPage.locator("#locale-select").selectOption(code);
    for (const width of [1280, 390, 320]) {
      await dataPage.setViewportSize({ width, height: 900 });
      assert.equal(await dataPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${code}: data page reflows at ${width}px`);
      const navigation = await dataPage.locator("#data-primary-navigation > a:visible").evaluateAll((links) => links.map((link) => {
        const bounds = link.getBoundingClientRect();
        return { text: link.textContent.trim(), width: bounds.width, height: bounds.height };
      }));
      assert(navigation.every((link) => width <= 420 ? link.height >= 40 && link.width >= 60 : link.width > 0 && link.height > 0), `${code}: navigation remains usable at ${width}px`);
    }
    await assertNoAxeViolations(dataPage, `${code}: Data and method`);
  }
  assert.deepEqual(dataErrors, []);
  const dataFileUrl = new URL("../site/data.html", import.meta.url);
  dataFileUrl.search = "?lang=fr";
  await dataPage.goto(dataFileUrl.href);
  await dataPage.locator("#data-title").waitFor();
  const localHome = new URL(await dataPage.locator("#data-brand-home").getAttribute("href"));
  assert.equal(localHome.protocol, "file:");
  assert(localHome.pathname.endsWith("/site/index.html"));
  assert.equal(localHome.searchParams.get("lang"), "fr");
  await dataPage.close();

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

  const storageContext = await newLocalContext(browser, { viewport: { width: 1280, height: 900 }, locale: "en-CA" });
  await storageContext.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() { throw new DOMException("Storage is unavailable in this preview", "SecurityError"); },
    });
  });
  await storageContext.route("**/*", (route) => {
    const request = route.request();
    return request.resourceType() === "media" || new URL(request.url()).origin !== new URL(baseUrl).origin
      ? route.abort() : route.continue();
  });
  const storagePage = await storageContext.newPage();
  const storageErrors = [];
  storagePage.on("pageerror", (error) => storageErrors.push(error.message));
  await storagePage.goto(baseUrl);
  await storagePage.locator(".channel-button").first().waitFor();
  assert.equal(await storagePage.locator("html").getAttribute("lang"), "en");
  assert.equal(await storagePage.evaluate(() => window.ParliamentStreamsI18n.readLocalePreference()), null);
  await storagePage.locator("#search").fill("Canada");
  await storagePage.locator("#locale-select").selectOption("fr");
  assert.equal(await storagePage.locator("#search").inputValue(), "Canada");
  await storagePage.locator('[data-channel-id="alberta-assembly-online"]').waitFor();
  assert.equal(await storagePage.locator("html").getAttribute("lang"), "fr");
  assert.equal(await storagePage.locator(".iptv-disclosure").getAttribute("lang"), "fr");
  assert.match(await storagePage.locator("#nav-institutions").getAttribute("href"), /lang=fr/);

  await storagePage.goto(`${baseUrl}schedule.html`);
  const scheduleOption = storagePage.locator('#schedule-jurisdiction option:not([value=""])').first();
  await scheduleOption.waitFor({ state: "attached" });
  const scheduleJurisdiction = await scheduleOption.getAttribute("value");
  await storagePage.locator("#schedule-jurisdiction").selectOption(scheduleJurisdiction);
  await storagePage.locator("#locale-select").selectOption("fr");
  assert.equal(await storagePage.locator("html").getAttribute("lang"), "fr");
  assert.equal(await storagePage.locator("#schedule-jurisdiction").inputValue(), scheduleJurisdiction);
  assert.equal(await storagePage.locator(".iptv-disclosure").getAttribute("lang"), "fr");

  await storagePage.goto(`${baseUrl}institutions.html`);
  await storagePage.locator(".institution-country").first().waitFor();
  await storagePage.locator("#institution-search").fill("Alberta");
  await storagePage.locator("#locale-select").selectOption("fr");
  await storagePage.locator("#canada--alberta").waitFor();
  assert.equal(await storagePage.locator("html").getAttribute("lang"), "fr");
  assert.equal(await storagePage.locator("#institution-search").inputValue(), "Alberta");

  await storagePage.goto(`${baseUrl}map.html`);
  await storagePage.locator(".map-country.is-documented").first().waitFor();
  await storagePage.locator("#locale-select").selectOption("fr");
  await storagePage.waitForURL(/lang=fr/);
  await storagePage.locator(".map-country.is-documented").first().waitFor();
  await selectMapSearchResult(storagePage, "Alberta");
  assert.equal(await storagePage.locator("html").getAttribute("lang"), "fr");
  assert.match(await storagePage.locator("#map-detail").innerText(), /Alberta/);
  assert.deepEqual(storageErrors, []);
  await storageContext.close();
  const providerContext = await newLocalContext(browser, { viewport: { width: 1280, height: 900 } });
  const providerPage = await providerContext.newPage();
  await providerPage.route("**/data/schedules.json", (route) => route.fulfill({ json: { channels: { "new-zealand-parliament": { next_event_title: "House sitting", next_event_start: "2026-11-03T12:00:00Z" } } } }));
  await assertProviderViewer(providerPage, baseUrl);
  await providerContext.close();
  await assertViewerTimezones(browser, baseUrl);
} finally {
  await browser.close();
  server.close();
}

console.log("Site rendering, interaction and accessibility checks passed.");
