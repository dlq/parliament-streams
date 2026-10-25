import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { collectTargets, manifestKind, pageLeadObservations, parseArgs } from "../tools/deep_validate_browser.mjs";

const pageRules = JSON.parse(await fs.readFile(new URL("../parliament_streams/page_lead_rules.json", import.meta.url), "utf8"));
const pageOptions = { baseUrl: "https://assembly.test/media/", pageUrl: "https://assembly.test/original", rules: pageRules };

test("maintained monthly inputs can inspect every page without the old four-page truncation", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "parliament-discovery-"));
  try {
    const input = path.join(directory, "tier1.json");
    await fs.writeFile(input, JSON.stringify({ countries: [{ country: "Canada", results: Array.from({ length: 7 }, (_, i) => ({ kind: "official_page", url: `https://parl.ca/${i}` })) }] }));
    const all = await collectTargets([input], 0);
    assert.equal(all[0].official_pages.length, 7);
    assert.equal(all[0].pages_omitted_by_cap, 0);
    const limited = await collectTargets([input], 4);
    assert.equal(limited[0].official_pages.length, 4);
    assert.equal(limited[0].pages_omitted_by_cap, 3);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("network budgets and explicit unlimited page count are parsed without changing legacy defaults", () => {
  const args = parseArgs(["--input", "target.json", "--output", "out.json", "--max-pages-per-country", "0", "--budget-seconds", "1800"]);
  assert.equal(args.maxPages, 0);
  assert.equal(args.budgetSeconds, 1800);
  assert.equal(parseArgs(["--input", "a", "--output", "b"]).maxPages, 4);
  assert.throws(() => parseArgs(["--input", "a", "--output", "b", "--budget-seconds", "-1"]));
});

test("opaque manifest routes retain advertised HLS or DASH formats without assuming playback", () => {
  const url = "https://assembly.test/player/resource?id=42";
  assert.equal(manifestKind(url, "application/vnd.apple.mpegurl"), "hls");
  assert.equal(manifestKind(url, "application/x-mpegURL; charset=utf-8"), "hls");
  assert.equal(manifestKind(url, "application/dash+xml"), "dash");
  assert.equal(manifestKind(url, "application/json"), null);
  assert.equal(manifestKind(url), null);
  assert.equal(manifestKind("https://assembly.test/live.m3u8?session=42"), "hls");
  assert.equal(manifestKind("https://assembly.test/live.mpd?session=42"), "dash");
});

test("manifest body signatures take precedence over URL and MIME hints", () => {
  const hls = "\uFEFF  #EXTM3U\n#EXT-X-VERSION:3\n";
  const dash = '<?xml version="1.0"?>\n<MPD xmlns="urn:mpeg:dash:schema:mpd:2011"></MPD>';
  const opaqueUrl = "https://assembly.test/player/resource?id=42";
  assert.equal(manifestKind(opaqueUrl, "application/octet-stream", hls), "hls");
  assert.equal(manifestKind(opaqueUrl, "application/xml", dash), "dash");
  assert.equal(manifestKind("https://assembly.test/live.m3u8", "application/vnd.apple.mpegurl", dash), "dash");
  assert.equal(manifestKind("https://assembly.test/live.mpd", "application/dash+xml", hls), "hls");
  assert.equal(manifestKind(opaqueUrl, "application/json", '{"status":"ok"}'), null);
});

test("rendered provider channels, archives and programme links remain unverified observations", () => {
  const result = pageLeadObservations([
    { url: "https://www.youtube.com/@OfficialAssembly", label: "Our channel", tag: "a" },
    { url: "https://youtu.be/recorded123", label: "", tag: "iframe" },
    { url: "../documents/index", label: "ZÁZNAM zasedání", tag: "a" },
    { url: "../information", label: "PROGRAMACIÓN", tag: "a" },
    { url: "../feed", label: "", tag: "link", type: "application/rss+xml", rel: "alternate" },
    { url: "../guide.xml.gz", label: "Guide", tag: "a" },
    { url: "recorded.mp4?part=2", label: "Proceedings", tag: "a" },
    { url: "../z%C3%A1znam", tag: "a" },
  ], pageOptions);
  assert.equal(result.page_links.length, 8);
  assert.equal(result.page_links_omitted_by_cap, 0);
  assert.equal(result.page_links[2].url, "https://assembly.test/documents/index");
  assert.deepEqual(result.page_links[4], { url: "https://assembly.test/feed", label: "", tag: "link", type: "application/rss+xml", rel: "alternate" });
  for (const observation of result.page_links) {
    assert.deepEqual(Object.keys(observation).sort(), ["label", "rel", "tag", "type", "url"]);
    assert.equal(Object.hasOwn(observation, "validated"), false);
    assert.equal(Object.hasOwn(observation, "ok"), false);
    assert.equal(Object.hasOwn(observation, "kind"), false);
  }
});

test("DOM observations exclude unsafe or empty navigation without inventing media URLs", () => {
  const result = pageLeadObservations([
    { label: "Video archive", tag: "a" },
    { url: "", label: "Live", tag: "a" },
    { url: "  #video", label: "Video", tag: "a" },
    { url: "javascript:play()", label: "Watch", tag: "a" },
    { url: "mailto:video@assembly.test", tag: "a" },
    { url: "https://user:password@assembly.test/watch", tag: "a" },
    { url: "https://youtube.com.evil.test/channel", label: "Channel", tag: "iframe" },
    { url: "https://unrelated.test/widget", tag: "iframe" },
    { url: "blob:https://assembly.test/blob-id", tag: "video" },
    { url: "data:video/mp4;base64,AAA", tag: "source" },
    { url: "../feed", tag: "link", type: "application/rss+xml", rel: "stylesheet" },
    { url: "https://assembly.test/script.js", tag: "script" },
  ], pageOptions);
  assert.deepEqual(result, { page_links: [], page_links_omitted_by_cap: 0 });
});

test("empty video source records the original page while DOM links use document base URI", () => {
  const result = pageLeadObservations([
    { url: "", label: "Chamber player", tag: "video" },
    { url: "own-resource", tag: "source", type: "video/mp4" },
    { url: "/embedded-chamber", tag: "iframe", label: "Live parliamentary video" },
    { url: "https://redirect.test/final", tag: "a", label: "VÍDÉO en direct" },
  ], { ...pageOptions, baseUrl: "https://redirect.test/base/" });
  assert.equal(result.page_links[0].url, pageOptions.pageUrl);
  assert.equal(result.page_links[1].url, "https://redirect.test/base/own-resource");
  assert.equal(result.page_links[2].url, "https://redirect.test/embedded-chamber");
  assert.equal(result.page_links[3].url, "https://redirect.test/final");
});

test("page-link observations are bounded, deduplicated and counted without any fetching", () => {
  const observations = Array.from({ length: 105 }, (_, index) => ({ url: `/archive/${index}`, label: "  archive  "+"x".repeat(300), tag: "a" }));
  observations.push({ ...observations[0] });
  const result = pageLeadObservations(observations, pageOptions);
  assert.equal(result.page_links.length, 100);
  assert.equal(result.page_links_omitted_by_cap, 5);
  assert.equal(result.page_links[0].label.length, 240);
  assert.equal(result.page_links[0].label.startsWith("archive "), true);
  const limited = pageLeadObservations(observations, { ...pageOptions, limit: 2 });
  assert.equal(limited.page_links.length, 2);
  assert.equal(limited.page_links_omitted_by_cap, 103);
  assert.equal(pageLeadObservations(observations, { ...pageOptions, limit: 200 }).page_links.length, 100);
  assert.throws(() => pageLeadObservations(observations, { ...pageOptions, limit: -1 }));
});
