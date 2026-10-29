import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../site/i18n.js", import.meta.url), "utf8");
async function runtime(locale = "en", fetchOverride) {
  const requests = [];
  const context = vm.createContext({
    window: {}, URL, URLSearchParams, navigator: { language: "en" },
    location: { protocol: "https:", search: `?lang=${locale}` },
    document: { currentScript: { src: "https://example.test/i18n.js" }, querySelector: () => ({ content: "release" }) },
    localStorage: { getItem: () => null },
    fetch: async (url) => {
      requests.push(url.href);
      const code = url.pathname.split("/").at(-1).replace(/\.json$/, "");
      if (fetchOverride) {
        const response = fetchOverride(code);
        if (response) return response;
      }
      return { ok: true, json: async () => JSON.parse(await readFile(new URL(`../site/locales/${code}.json`, import.meta.url), "utf8")) };
    },
  });
  vm.runInContext(source, context);
  await context.window.ParliamentStreamsI18n.ready;
  return { window: context.window, requests };
}

test("startup loads only English and the selected language, sharing cached requests", async () => {
  const { window, requests } = await runtime("fr");
  assert.equal(requests.length, 2);
  assert(requests.every((url) => /\/(en|fr)\.json\?v=release$/.test(url)));
  await Promise.all([window.ParliamentStreamsI18n.load("fr"), window.ParliamentStreamsI18n.load("fr")]);
  assert.equal(requests.length, 2);
  await window.ParliamentStreamsI18n.load("de");
  assert.equal(requests.length, 3);
  assert.equal(window.ParliamentStreamsI18n.supportedLocale("zh-HK"), "zh-Hant");
  assert.equal(window.ParliamentStreamsI18n.supportedLocale("fr-CA"), "fr");
});

test("all language packs cover the interface, viewer, IPTV and VLC copy", async () => {
  const { window } = await runtime();
  const shared = window.ParliamentStreamsI18n;
  const files = (await readdir(new URL("../site/locales/", import.meta.url))).filter((file) => file.endsWith(".json")).map((file) => file.replace(/\.json$/, "")).sort();
  assert.deepEqual(files, Array.from(shared.locales, ([code]) => code).sort(), "Every JSON locale must be registered in the picker");
  for (const [locale] of shared.locales) {
    await shared.load(locale);
    assert.equal(shared.translationCoverage(locale).messages.length, 0, locale);
    assert.equal(shared.translationCoverage(locale).labels.length, 0, locale);
    for (const domain of ["Map", "Schedule", "Viewer", "Iptv"]) assert.equal(window[`ParliamentStreams${domain}I18n`].coverage(locale).length, 0, `${locale}: ${domain}`);
    for (const domain of ["Institutions", "Project"]) assert.equal(window[`ParliamentStreams${domain}I18n`].coverage(locale).missing.length, 0, `${locale}: ${domain}`);
    for (const key of ["move", "resize", "keys", "minimize", "restore", "navigationError"]) assert(window.ParliamentStreamsViewerI18n.message(locale, key).trim());
  }
  assert.equal(window.ParliamentStreamsViewerI18n.message("unknown", "move"), window.ParliamentStreamsViewerI18n.message("en", "move"));
  assert.match(window.ParliamentStreamsMapI18n.sourceCount("cs", 2), /2/);
  assert.equal(window.ParliamentStreamsInstitutionsI18n.message("en", "reviewed", { date: "DATE" }).includes("DATE"), true);
});

test("failed or malformed language requests can be retried without losing English", async () => {
  let failures = 2;
  const { window } = await runtime("en", (locale) => {
    if (locale !== "fr" || failures-- <= 0) return null;
    return failures === 1 ? { ok: false } : { ok: true, json: async () => ({ schema_version: 99, locale: "fr" }) };
  });
  const shared = window.ParliamentStreamsI18n;
  await assert.rejects(shared.load("fr"), /Language unavailable/);
  await assert.rejects(shared.load("fr"), /Invalid language pack/);
  assert.equal(shared.message("en", "nav"), "Catalogue");
  await shared.load("fr");
  assert.equal(shared.translationCoverage("fr").messages.length, 0);
});


test("an unavailable selected pack falls back to English during startup", async () => {
  const { window, requests } = await runtime("fr", (locale) => locale === "fr" ? { ok: false } : null);
  assert.equal(window.ParliamentStreamsI18n.currentLocale(), "en");
  assert.equal(window.ParliamentStreamsI18n.message("en", "nav"), "Catalogue");
  assert.equal(requests.length, 2);
});
