import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../site/data-loader.js", import.meta.url), "utf8");
function loader(fetch, { script = "https://example.org/site/data-loader.js", root = "../data/" } = {}) {
  const window = {};
  const environment = vm.createContext({
    window, URL, fetch, location: new URL(script),
    document: { currentScript: { src: script }, querySelector: () => ({ content: root }) },
  });
  vm.runInContext(source, environment);
  return { data: window.ParliamentStreamsData, environment };
}

test("pages share one pending and resolved JSON request", async () => {
  const urls = [];
  const payload = { channels: [] };
  const { data, environment } = loader(async (url) => {
    urls.push(url.href);
    return { ok: true, json: async () => payload };
  });
  const [first, second] = await Promise.all([data.load("channels"), data.load("channels")]);
  assert.equal(first, payload);
  assert.equal(second, first);
  vm.runInContext(source, environment); // Progressive navigation must retain the cache.
  assert.equal(await data.load("channels"), first);
  assert.deepEqual(urls, ["https://example.org/data/channels.json"]);
});

test("hosted release and direct-file previews resolve to the intended JSON roots", async () => {
  for (const [options, expected] of [
    [{ script: "https://dlq.ca/parliament-streams/data-loader.js?v=abc", root: "./data/" }, "https://dlq.ca/parliament-streams/data/institutions.json"],
    [{ script: "file:///checkout/site/data-loader.js" }, "https://dlq.ca/parliament-streams/data/institutions.json"],
  ]) {
    let requested;
    const { data } = loader(async (url) => {
      requested = url.href;
      return { ok: true, json: async () => ({ records: [] }) };
    }, options);
    await data.load("institutions");
    assert.equal(requested, expected);
  }
});

test("missing optional products and malformed responses can be retried", async () => {
  let attempts = 0;
  const { data } = loader(async () => {
    attempts++;
    if (attempts === 1) return { ok: false, status: 404 };
    if (attempts === 2) return { ok: true, json: async () => [] };
    if (attempts === 3) throw new Error("offline");
    return { ok: true, json: async () => ({ channels: {} }) };
  });
  assert.equal(await data.optional("schedules"), null);
  await assert.rejects(data.load("schedules"), /Invalid data product/);
  await assert.rejects(data.load("schedules"), /offline/);
  assert.deepEqual(await data.load("schedules"), { channels: {} });
  assert.equal(attempts, 4);
  await assert.rejects(data.load("../unknown"), /Unknown data product/);
  assert.equal(attempts, 4);
});
