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
  await page.goto(baseUrl);
  await page.waitForSelector(".channel-button");
  await assertNoAxeViolations(page, "Desktop catalogue");

  const rows = page.locator(".channel-button");
  assert.equal(await rows.count(), 82);
  const youtubeRow = page.locator('[data-channel-id="australia-parliament-youtube"]');
  await youtubeRow.click();
  assert.equal(await youtubeRow.evaluate((element) => document.activeElement === element), true);
  assert.equal(await youtubeRow.getAttribute("role"), null);
  assert.equal(await youtubeRow.getAttribute("aria-pressed"), "true");
  const youtubeFrame = page.locator("#media-frame iframe");
  assert.equal(await youtubeFrame.count(), 1);
  assert.match(await youtubeFrame.getAttribute("src"), /youtube-nocookie\.com\/embed/);
  assert.match(await youtubeFrame.getAttribute("title"), /official YouTube player/);

  const search = page.locator("#search");
  await search.focus();
  const colours = await search.evaluate((element) => {
    const style = getComputedStyle(element);
    return { border: style.borderTopColor, outline: style.outlineColor };
  });
  assert(contrastRatio(rgb(colours.border), [255, 255, 255]) >= 3);
  assert(contrastRatio(rgb(colours.outline), [255, 255, 255]) >= 3);

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
  assert.equal(await page.locator(".detail-note span[lang='en']").count(), 2);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const transitionDuration = await page.locator("#detail-panel").evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).transitionDuration),
  );
  assert(transitionDuration <= 0.001);

  const filePage = await context.newPage();
  await filePage.goto(new URL("../site/index.html", import.meta.url).href);
  await filePage.waitForSelector(".channel-button");
  await filePage.locator('[data-channel-id="australia-parliament-youtube"]').click();
  assert.equal(await filePage.locator("#media-frame iframe").count(), 0);
  assert.match(await filePage.locator(".youtube-file-notice").innerText(), /HTTP page origin/);
  await assertNoAxeViolations(filePage, "Direct-file YouTube fallback");
  await filePage.close();
} finally {
  await browser.close();
  server.close();
}

console.log("Accessibility checks passed.");
