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

const USER_AGENT =
  "parliament-streams-deep-validation/0.1 (+https://github.com/dlq/parliament-streams)";
const PAGE_TIMEOUT_MS = 20_000;
const SETTLE_MS = 5_000;
const MAX_PAGES_PER_COUNTRY = 4;
const MAX_CONCURRENT_PAGES = 4;
const MAX_PAGE_LINKS = 100;

function foldHint(value) {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replaceAll("ß", "ss").replaceAll("ς", "σ");
}

function pageLeadObservations(observations, { baseUrl, pageUrl, rules, limit = MAX_PAGE_LINKS }) {
  if (!Number.isInteger(limit) || limit < 0) throw new Error("Page-link limit must be a nonnegative integer.");
  const cap = Math.min(MAX_PAGE_LINKS, limit);
  const terms = [rules.media_terms, rules.archive_terms, rules.programme_terms].flat().map(foldHint);
  const providers = rules.provider_hosts.map((host) => host.toLowerCase());
  const candidates = new Map();
  for (const observation of observations) {
    const tag = typeof observation.tag === "string" ? observation.tag.toLowerCase() : "";
    if (!["a", "iframe", "video", "source", "link"].includes(tag)) continue;
    const rawUrl = typeof observation.url === "string" ? observation.url.trim() : "";
    if (rawUrl.startsWith("#") || (!rawUrl && tag !== "video")) continue;
    let url;
    try {
      url = new URL(rawUrl || pageUrl, baseUrl);
    } catch {
      continue;
    }
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) continue;
    const text = (value) => typeof value === "string" ? value.replace(/\s+/gu, " ").trim() : "";
    const label = text(observation.label).slice(0, 240);
    const type = text(observation.type);
    const rel = text(observation.rel);
    if (tag === "link" && !rel.toLowerCase().split(/\s+/).includes("alternate")) continue;
    let hintUrl = url.href;
    try {
      hintUrl = decodeURIComponent(hintUrl);
    } catch {
      // Malformed escapes should not discard an otherwise observable HTTP link.
    }
    const hint = foldHint(`${hintUrl} ${label} ${type} ${rel}`);
    const knownProvider = providers.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
    const recording = /\.(?:mp4|m4v|webm|mov|mp3|m4a|ogg|ogv|m3u8?|mpd)$/i.test(url.pathname);
    const programme = /\.(?:xml(?:\.gz)?|xmltv(?:\.gz)?|ics|rss|atom)$/i.test(url.pathname);
    const mediaType = /(?:video|audio)\/|mpegurl|dash\+xml|xmltv|rss\+xml|atom\+xml|text\/calendar/i.test(type);
    const alternateData = tag === "link" && /xml|rss|atom|calendar/i.test(type);
    if (!["video", "source"].includes(tag) && !knownProvider && !recording && !programme
      && !mediaType && !alternateData && !terms.some((term) => term && hint.includes(term))) continue;
    const candidate = { url: url.href, label, tag, type, rel };
    const key = JSON.stringify([candidate.url, tag, type, rel]);
    if (!candidates.has(key) || (!candidates.get(key).label && label)) candidates.set(key, candidate);
  }
  const rows = [...candidates.values()];
  return {
    page_links: rows.slice(0, cap),
    page_links_omitted_by_cap: Math.max(0, rows.length - cap),
  };
}

function parseArgs(argv) {
  const args = { inputs: [], output: null, maxPages: MAX_PAGES_PER_COUNTRY, budgetSeconds: 0 };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--input") {
      const input = argv[index + 1];
      if (!input) throw new Error("--input requires a report path.");
      args.inputs.push(...input.split(","));
      index += 1;
    } else if (arg === "--output") {
      const output = argv[index + 1];
      if (!output) throw new Error("--output requires a report path.");
      args.output = output;
      index += 1;
    } else if (arg === "--max-pages-per-country" || arg === "--budget-seconds") {
      const value = Number(argv[index + 1]);
      if (!Number.isInteger(value) || value < 0) throw new Error(`${arg} requires a nonnegative integer.`);
      args[arg === "--max-pages-per-country" ? "maxPages" : "budgetSeconds"] = value;
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.inputs.length || !args.output) {
    throw new Error("Usage: node tools/deep_validate_browser.mjs --input REPORT [--input REPORT] --output REPORT");
  }
  return args;
}

function looksLikeManifestUrl(url) {
  const lower = url.toLowerCase();
  return lower.includes(".m3u8") || lower.includes(".mpd");
}

function manifestKind(url, contentType = "", body = "") {
  const prefix = body.trimStart().slice(0, 256).toLowerCase();
  if (prefix.startsWith("#extm3u")) return "hls";
  if (prefix.includes("<mpd")) return "dash";
  const type = contentType.toLowerCase();
  if (type.includes("dash+xml")) return "dash";
  if (type.includes("mpegurl")) return "hls";
  if (!looksLikeManifestUrl(url)) return null;
  return url.toLowerCase().includes(".mpd") ? "dash" : "hls";
}

async function readJson(path) {
  return JSON.parse(await fs.readFile(path, "utf8"));
}

async function collectTargets(reportInputs, maxPages) {
  const targets = [];
  for (const input of reportInputs) {
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
        official_pages: maxPages ? officialPages.slice(0, maxPages) : officialPages,
        pages_omitted_by_cap: maxPages ? Math.max(0, officialPages.length - maxPages) : 0,
      });
    }
  }
  return targets;
}

async function checkManifestFormat(url) {
  const started = Date.now();
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "*/*",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });
    const contentType = response.headers.get("content-type");
    const reader = response.body?.getReader();
    const chunks = [];
    let size = 0;
    if (reader) {
      while (size < 300_000) {
        const { value, done } = await reader.read();
        if (done) break;
        chunks.push(value.subarray(0, 300_000 - size));
        size += value.length;
      }
      await reader.cancel();
    }
    const text = Buffer.concat(chunks).toString("utf8");
    const trimmed = text.trimStart().slice(0, 256).toLowerCase();
    const kind = manifestKind(url, contentType ?? "", text) ?? "hls";
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
      note: ok ? "Manifest format detected; playback not checked." : "HTTP response or body did not pass the manifest format check.",
    };
  } catch (error) {
    return {
      url,
      kind: manifestKind(url) ?? "hls",
      ok: false,
      http_status: null,
      content_type: null,
      final_url: null,
      elapsed_ms: Date.now() - started,
      note: `${error.name}: ${error.message}`,
    };
  }
}

async function inspectPage(browser, target, pageUrl, rules) {
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 1000 },
  });
  // Silence startup/autoplay before navigation; the process flag also covers
  // provider scripts that change media volume or use Web Audio.
  await context.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      this.muted = true;
      this.volume = 0;
      return play.apply(this, args);
    };
  });
  const page = await context.newPage();
  const discovered = new Map();
  const responses = [];
  const errors = [];

  function record(url, source, contentType = "") {
    const kind = manifestKind(url, contentType);
    if (kind) discovered.set(url, source);
    return kind;
  }

  page.on("request", (request) => record(request.url(), "request"));
  page.on("response", (response) => {
    const url = response.url();
    const contentType = response.headers()["content-type"] ?? "";
    if (record(url, "response", contentType)) {
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
  let pageLinks = { page_links: [], page_links_omitted_by_cap: 0 };
  try {
    const response = await page.goto(pageUrl, {
      waitUntil: "domcontentloaded",
      timeout: PAGE_TIMEOUT_MS,
    });
    pageStatus = response?.status() ?? null;
    finalUrl = page.url();
    await page.waitForTimeout(SETTLE_MS);
    const dom = await page.evaluate(() => ({
      baseUrl: document.baseURI,
      observations: [...document.querySelectorAll('a[href], iframe[src], video, video source[src], audio source[src], link[rel]')].map((element) => {
        const tag = element.tagName.toLowerCase();
        return {
          url: element.getAttribute(tag === "a" || tag === "link" ? "href" : "src"),
          label: (tag === "a" ? element.innerText || element.textContent : "")
            || element.getAttribute("aria-label") || element.getAttribute("title") || "",
          tag,
          type: element.getAttribute("type") || "",
          rel: element.getAttribute("rel") || "",
        };
      }),
    }));
    // These are source-page observations only. Do not navigate or validate them.
    pageLinks = pageLeadObservations(dom.observations, { baseUrl: dom.baseUrl, pageUrl, rules });
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
  for (const [url, source] of [...discovered].slice(0, 10)) {
    const validation = await checkManifestFormat(url);
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
    manifests_omitted_by_cap: Math.max(0, discovered.size - 10),
    validated_manifest_count: validations.filter((item) => item.ok).length,
    responses,
    validations,
    page_errors: errors.slice(0, 5),
    ...pageLinks,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rules = await readJson(new URL("../parliament_streams/page_lead_rules.json", import.meta.url));
  const { chromium } = loadPlaywright();
  const targets = await collectTargets(args.inputs, args.maxPages);
  const deadline = args.budgetSeconds ? Date.now() + args.budgetSeconds * 1000 : Infinity;
  const browser = await chromium.launch({ headless: true, args: ["--mute-audio"] });
  const pageTasks = [];
  for (const target of targets) {
    for (const pageUrl of target.official_pages) {
      pageTasks.push({ target, pageUrl });
    }
  }
  const pageResults = new Array(pageTasks.length);
  let nextTask = 0;
  async function inspectNextPage() {
    while (nextTask < pageTasks.length) {
      const taskIndex = nextTask;
      nextTask += 1;
      const { target, pageUrl } = pageTasks[taskIndex];
      if (Date.now() >= deadline) {
        pageResults[taskIndex] = {
          country: target.country, tier_report: target.tier_report, page_url: pageUrl,
          status: "unattempted", load_note: "Network budget exhausted", validations: [],
          page_links: [], page_links_omitted_by_cap: 0,
        };
        continue;
      }
      console.log(`INSPECT ${target.country} page ${taskIndex + 1}/${pageTasks.length}`);
      pageResults[taskIndex] = await inspectPage(browser, target, pageUrl, rules);
    }
  }
  const workerCount = Math.min(MAX_CONCURRENT_PAGES, pageTasks.length);
  await Promise.all(Array.from({ length: workerCount }, () => inspectNextPage()));

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
    if (pageResult.status !== "unattempted") country.pages_checked += 1;
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
    scope: "Browser manifest checks and unverified page-link observations for maintained institutional and catalogue routes.",
    method:
      "Muted Chromium loads maintained pages, records bounded DOM link/media observations separately, captures manifest network references by URL or response MIME, and checks discovered manifest formats. Observed links are not followed to establish ownership, legislative content, programme mapping or rights. Authenticated, geo-blocked, DRM and interaction-gated players remain unresolved.",
    inputs: args.inputs,
    countries: [...countries.values()],
    pages: pageResults,
    coverage: {
      planned_pages: pageTasks.length,
      pages_omitted_by_cap: targets.reduce((sum, target) => sum + target.pages_omitted_by_cap, 0),
      unattempted_pages: pageResults.filter((page) => page.status === "unattempted").length,
      budget_seconds: args.budgetSeconds,
    },
  };

  await fs.writeFile(args.output, `${JSON.stringify(report, null, 2)}\n`);

  for (const country of report.countries) {
    if (country.open_hls_count || country.open_dash_count) {
      console.log(
        `FOUND ${country.country} HLS=${country.open_hls_count} DASH=${country.open_dash_count}`,
      );
    }
  }
  console.log(`REPORT ${args.output}`);
}

export { collectTargets, manifestKind, pageLeadObservations, parseArgs };
if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) await main();
