import fs from "node:fs/promises";
import { createRequire } from "node:module";

const localRequire = createRequire(import.meta.url);

function loadPlaywright() {
  try {
    return localRequire("playwright");
  } catch (error) {
    const fallbackNodePath = process.env.NODE_PATH?.split(":").find(Boolean);
    if (!fallbackNodePath) {
      throw error;
    }
    return createRequire(`${fallbackNodePath}/playwright/index.js`)("playwright");
  }
}

const { chromium } = loadPlaywright();

const USER_AGENT =
  "parliament-streams-deep-validation/0.1 (+https://github.com/dlq/parliament-streams)";
const PAGE_TIMEOUT_MS = 20_000;
const SETTLE_MS = 5_000;
const MAX_PAGES_PER_COUNTRY = 4;

const REPORT_INPUTS = [
  "reports/health/2026-07-29-tier1-democracy-hls.json",
  "reports/health/2026-07-29-tier2-democracy-hls.json",
];

function isManifestUrl(url) {
  const lower = url.toLowerCase();
  return lower.includes(".m3u8") || lower.includes(".mpd");
}

function manifestKind(url) {
  return url.toLowerCase().includes(".mpd") ? "dash" : "hls";
}

async function readJson(path) {
  return JSON.parse(await fs.readFile(path, "utf8"));
}

async function collectTargets() {
  const targets = [];
  for (const input of REPORT_INPUTS) {
    const report = await readJson(input);
    for (const country of report.countries) {
      const officialPages = [];
      for (const result of country.results ?? []) {
        if (result.kind === "official_page" && result.url && !officialPages.includes(result.url)) {
          officialPages.push(result.url);
        }
      }
      targets.push({
        tier_report: input,
        country: country.country,
        official_pages: officialPages.slice(0, MAX_PAGES_PER_COUNTRY),
      });
    }
  }
  return targets;
}

async function validateManifest(url) {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "*/*",
      },
      redirect: "follow",
    });
    const contentType = response.headers.get("content-type");
    const text = await response.text();
    const trimmed = text.trimStart().slice(0, 256).toLowerCase();
    const kind = manifestKind(url);
    const ok =
      response.ok && ((kind === "hls" && trimmed.startsWith("#extm3u")) || (kind === "dash" && trimmed.includes("<mpd")));
    return {
      url,
      kind,
      ok,
      http_status: response.status,
      content_type: contentType,
      final_url: response.url,
      elapsed_ms: Date.now() - started,
      note: ok ? "Manifest validated" : "Fetched but body did not validate as manifest",
    };
  } catch (error) {
    return {
      url,
      kind: manifestKind(url),
      ok: false,
      http_status: null,
      content_type: null,
      final_url: null,
      elapsed_ms: Date.now() - started,
      note: `${error.name}: ${error.message}`,
    };
  }
}

async function inspectPage(browser, target, pageUrl) {
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const discovered = new Map();
  const responses = [];
  const errors = [];

  function record(url, source) {
    if (isManifestUrl(url)) {
      discovered.set(url, source);
    }
  }

  page.on("request", (request) => record(request.url(), "request"));
  page.on("response", async (response) => {
    const url = response.url();
    const contentType = response.headers()["content-type"] ?? "";
    if (isManifestUrl(url) || contentType.includes("mpegurl") || contentType.includes("dash+xml")) {
      record(url, "response");
      responses.push({
        url,
        status: response.status(),
        content_type: contentType,
      });
    }
  });
  page.on("pageerror", (error) => errors.push(`${error.name}: ${error.message}`));

  let pageStatus = null;
  let finalUrl = null;
  let loadNote = null;
  try {
    const response = await page.goto(pageUrl, {
      waitUntil: "domcontentloaded",
      timeout: PAGE_TIMEOUT_MS,
    });
    pageStatus = response?.status() ?? null;
    finalUrl = page.url();
    await page.waitForTimeout(SETTLE_MS);
    const html = await page.content();
    const staticMatches = html.match(/https?:\\?\/\\?\/[^"'<>\\s]+?\.(?:m3u8|mpd)(?:\?[^"'<>\\s]*)?|\/[^"'<>\\s]+?\.(?:m3u8|mpd)(?:\?[^"'<>\\s]*)?/gi) ?? [];
    for (const raw of staticMatches) {
      const cleaned = raw.replaceAll("\\/", "/");
      record(new URL(cleaned, finalUrl).toString(), "dom");
    }
  } catch (error) {
    loadNote = `${error.name}: ${error.message}`;
    finalUrl = page.url();
  }

  const validations = [];
  for (const [url, source] of discovered) {
    const validation = await validateManifest(url);
    validations.push({ ...validation, discovery_source: source });
  }

  await context.close();
  return {
    country: target.country,
    tier_report: target.tier_report,
    page_url: pageUrl,
    final_url: finalUrl,
    page_status: pageStatus,
    load_note: loadNote,
    discovered_manifest_count: discovered.size,
    validated_manifest_count: validations.filter((item) => item.ok).length,
    responses,
    validations,
    page_errors: errors.slice(0, 5),
  };
}

async function main() {
  const targets = await collectTargets();
  const browser = await chromium.launch({ headless: true });
  const pageResults = [];

  for (const target of targets) {
    for (const pageUrl of target.official_pages) {
      console.log(`INSPECT ${target.country} ${pageUrl}`);
      pageResults.push(await inspectPage(browser, target, pageUrl));
    }
  }

  await browser.close();

  const countries = new Map();
  for (const target of targets) {
    countries.set(`${target.tier_report}::${target.country}`, {
      country: target.country,
      tier_report: target.tier_report,
      pages_checked: 0,
      open_hls_count: 0,
      open_dash_count: 0,
      validated_manifests: [],
    });
  }

  for (const pageResult of pageResults) {
    const key = `${pageResult.tier_report}::${pageResult.country}`;
    const country = countries.get(key);
    country.pages_checked += 1;
    for (const validation of pageResult.validations) {
      if (!validation.ok) {
        continue;
      }
      if (validation.kind === "dash") {
        country.open_dash_count += 1;
      } else {
        country.open_hls_count += 1;
      }
      country.validated_manifests.push({
        url: validation.url,
        kind: validation.kind,
        page_url: pageResult.page_url,
        discovery_source: validation.discovery_source,
        content_type: validation.content_type,
      });
    }
  }

  const report = {
    checked_at: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    scope: "Deep browser validation of Tier 1 and Tier 2 official/discovery pages from the 2026-07-29 static reports.",
    method:
      "Headless Chromium loads official/discovery pages, waits for scripts/player requests, captures .m3u8/.mpd network and DOM references, then validates discovered manifests. This does not solve authenticated, geo-blocked, DRM, or interaction-gated players.",
    inputs: REPORT_INPUTS,
    countries: [...countries.values()],
    pages: pageResults,
  };

  const out = "reports/health/2026-07-29-tier1-tier2-deep-browser-validation.json";
  await fs.writeFile(out, `${JSON.stringify(report, null, 2)}\n`);

  for (const country of report.countries) {
    if (country.open_hls_count || country.open_dash_count) {
      console.log(
        `FOUND ${country.country} HLS=${country.open_hls_count} DASH=${country.open_dash_count}`,
      );
      for (const manifest of country.validated_manifests) {
        console.log(`  ${manifest.kind.toUpperCase()} ${manifest.url}`);
      }
    }
  }
  console.log(`REPORT ${out}`);
}

await main();
