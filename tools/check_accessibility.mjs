import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const root = normalize(join(fileURLToPath(new URL("..", import.meta.url))));
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
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

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
assert(address && typeof address === "object");
const baseUrl = `http://127.0.0.1:${address.port}/site/`;
const browser = await chromium.launch();

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.route("**/data/schedules.json", (route) => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({
      channels: {
        "european-parliament-multimedia-centre": {
          current_event_title: "Committee on the Environment",
          current_event_time: "Live now",
          next_event_title: "Plenary sitting",
          next_event_time: "4:00 PM",
          fetched_at: "2026-08-17T12:00:00Z",
        },
      },
    }),
  }));
  await page.goto(baseUrl);
  await page.waitForSelector(".channel-button");
  assert.match(await page.locator(".intro").evaluate((element) => getComputedStyle(element).backgroundImage), /house-of-commons-1890\.jpg/);
  assert.match(await page.locator(".hero-credit").innerText(), /Library of Congress · Public domain/);
  assert.match(await page.locator("#open-video-copy").innerText(), /streams such as HLS/);
  assert.match(await page.locator("#open-streams-copy").innerText(), /machine-readable programme and event feeds/);
  assert.equal(await page.locator("#metric-sources").innerText(), "82");
  assert.equal(await page.locator("#metric-playable").innerText(), "43");
  assert.equal(await page.locator("#metric-schedules").innerText(), "27");
  assert.match(await page.locator("#metric-updated").innerText(), /Aug 17, 2026/);
  await page.locator(".catalogue-key summary").click();
  assert.match(await page.locator("#key-format-values").innerText(), /HLS · DASH · YouTube · Official page/);
  assert.match(await page.locator("#key-access-values").innerText(), /Verified · Review · Page only/);
  assert.equal(await page.locator(".principles-index li").count(), 5);
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
    assert((await page.locator("#catalogue-title").innerText()).trim());
    assert((await page.locator("#level-filter option").first().innerText()).trim());
    assert((await page.locator("#detail-panel").innerText()).trim());
    assert.equal(await page.locator("#sort-status").getAttribute("lang"), locale);
  }
  await page.locator("#locale-select").selectOption("en");

  const rows = page.locator(".channel-button");
  assert.equal(await rows.count(), 82);
  const navarreFlag = page.locator('[data-channel-id="navarre-parliament-live"] .jurisdiction-flag');
  assert.equal(await navarreFlag.count(), 1);
  assert.match(await navarreFlag.getAttribute("src"), /assets\/flags\/navarre\.svg$/);
  const youtubeRow = page.locator('[data-channel-id="australia-parliament-youtube"]');
  await youtubeRow.click();
  assert.equal(await youtubeRow.evaluate((element) => document.activeElement === element), true);
  assert.equal(await youtubeRow.getAttribute("role"), null);
  assert.equal(await youtubeRow.getAttribute("aria-pressed"), "true");
  assert.notEqual(await youtubeRow.evaluate((element) => getComputedStyle(element).boxShadow), "none");
  const youtubeFrame = page.locator("#media-frame iframe");
  assert.equal(await youtubeFrame.count(), 1);
  assert.match(await youtubeFrame.getAttribute("src"), /youtube-nocookie\.com\/embed/);
  assert.equal(await youtubeFrame.getAttribute("title"), "Australia Parliament Live · YouTube");

  const europarlRow = page.locator('[data-channel-id="european-parliament-multimedia-centre"]');
  await europarlRow.click();
  assert.match(await page.locator(".programme-fetch-status").innerText(), /Schedule collected/);
  assert.match(await page.locator(".programme-line").first().innerText(), /^Now: Committee on the Environment/);
  assert.match(await page.locator(".programme-line").nth(1).innerText(), /^Next: Plenary sitting/);
  assert.equal(await page.locator(".evidence-dates dd span").count(), 3);
  assert.match(await page.locator(".evidence-dates").innerText(), /Catalogue updated/i);
  assert.match(await page.locator(".evidence-dates").innerText(), /Aug 16, 2026/);

  await page.locator("#locale-select").selectOption("fr");
  assert.match(await page.locator('meta[name="description"]').getAttribute("content"), /Points d'accès officiels/);
  assert.match(await page.locator(".programme-fetch-status").innerText(), /Horaire recueilli le/);
  assert.match(await page.locator(".programme-line").first().innerText(), /^Maintenant :/);
  assert.match(await page.locator(".programme-line").nth(1).innerText(), /^À suivre :/);
  assert.match(await page.locator("#open-video-copy").innerText(), /flux directs et interopérables comme le HLS/);
  assert.match(await page.locator("#open-streams-copy").innerText(), /horaires ouverts/);
  assert.equal(await page.locator("#catalogue-key-title").innerText(), "Comment lire ce catalogue");
  assert.equal(await page.locator("#metric-playable-label").textContent(), "Lisibles ici");
  assert.equal(await page.locator("#metric-schedules").textContent(), "27");
  assert.equal(await page.locator("#principle-accessibility").textContent(), "Accessibilité ouverte");
  assert.equal(
    await page.locator('[data-channel-id="british-columbia-legislature-webcasts"] > span').nth(1).innerText(),
    "Colombie-Britannique",
  );

  await page.locator('[data-channel-id="new-zealand-parliament"]').click();
  const newZealandTerms = await page.locator(".detail-grid dt").allTextContents();
  assert.equal(newZealandTerms.includes("Attribution requise"), false);
  assert.equal(newZealandTerms.includes("Programme en cours"), false);
  assert.equal(await page.locator(".accessibility-record .detail-subtitle").count(), 0);
  assert.match(await page.locator(".detail-note").last().innerText(), /Ce point d’accès public peut être lu/);
  assert.equal(await page.locator(".research-note-disclosure").getAttribute("open"), null);

  await page.locator('[data-channel-id="quebec-canal01"]').click();
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
  assert.match(await page.locator(".accessibility-record").innerText(), /Varie selon la source ou l’événement/);
  assert.equal(await page.locator(".accessibility-record .detail-subtitle").count(), 0);

  await page.locator("#locale-select").selectOption("zh-Hans");
  await page.locator('[data-channel-id="spain-congreso-directo-3"]').click();
  const detailTerms = await page.locator(".detail-grid dt").allTextContents();
  assert(detailTerms.includes("访问状态"));
  assert.equal(detailTerms.includes("所需署名"), false);
  assert.equal(detailTerms.includes("当前节目记录"), false);
  assert(detailTerms.includes("媒体无障碍"));
  assert.equal(await page.locator(".player-placeholder p").innerText(), "此来源未启用播放");
  assert.match(await page.locator(".accessibility-record").innerText(), /字幕: 尚未验证/);
  assert.match(await page.locator(".accessibility-record").innerText(), /手语: 尚未验证/);
  assert.equal(await page.locator(".accessibility-record .detail-subtitle").count(), 0);
  assert.match(await page.locator(".epg-list").innerText(), /直播节目表页面/);
  assert.match(await page.locator(".evidence-note").innerText(), /^证据来源。/);
  assert.match(await page.locator(".evidence-note a").first().innerText(), /官方观看页面|支持来源/);
  assert.equal(await page.locator(".research-note-disclosure summary").innerText(), "目录的英文研究说明");
  assert.match(await page.locator('[data-channel-id="spain-congreso-directo-3"] + .visually-hidden').innerText(), /格式: HLS.*访问: 待审核.*使用: 附带条件/);

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
  await assertNoAxeViolations(page, "Open intermediate-width source details");
  await page.locator("#detail-title").press("Escape");
  assert.equal(await page.locator("#detail-panel").isVisible(), false);

  await page.setViewportSize({ width: 320, height: 800 });
  await page.reload();
  await page.waitForSelector(".channel-button");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  await page.locator(".channel-button").first().click();
  assert.equal(await page.locator("#detail-title").evaluate((element) => document.activeElement === element), true);
  assert.equal(await page.locator("#detail-panel").getAttribute("aria-labelledby"), "detail-title");
  await assertNoAxeViolations(page, "Open mobile source details");
  await page.locator("#detail-title").press("Escape");
  assert.equal(await page.locator("#detail-panel").isVisible(), false);
  assert.equal(await page.locator(".channel-button").first().evaluate((element) => document.activeElement === element), true);

  await page.locator("#locale-select").selectOption("fr");
  assert.equal(await page.locator("html").getAttribute("lang"), "fr");
  assert.equal(await page.locator(".research-note-disclosure div[lang='en']").count(), 1);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const transitionDuration = await page.locator("#detail-panel").evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).transitionDuration),
  );
  assert(transitionDuration <= 0.001);

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
