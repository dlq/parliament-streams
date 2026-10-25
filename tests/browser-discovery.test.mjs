import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { collectTargets, parseArgs } from "../tools/deep_validate_browser.mjs";

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
