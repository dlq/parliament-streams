import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("viewer controls and navigation recovery cover every supported locale", async () => {
  const context = vm.createContext({ window: {} });
  for (const file of ["extra-locales.js", "i18n.js", "viewer-i18n.js"]) {
    vm.runInContext(await readFile(new URL(`../site/${file}`, import.meta.url), "utf8"), context);
  }
  const shared = context.window.ParliamentStreamsI18n;
  const viewer = context.window.ParliamentStreamsViewerI18n;
  for (const [locale] of shared.locales) {
    assert.equal(viewer.coverage(locale).length, 0, locale);
    for (const key of ["move", "resize", "keys", "minimize", "restore", "navigationError"]) {
      assert(viewer.message(locale, key).trim(), `${locale}: ${key}`);
    }
  }
  assert.equal(viewer.message("unknown", "move"), viewer.message("en", "move"));
});
