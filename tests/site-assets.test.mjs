import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execute = promisify(execFile);
test("publication uses its own data directory and refreshes changed script cache keys", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "parliament-assets-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, "index.html"), '<meta name="parliament-data-root" content="../data/"><script src="data-loader.js"></script>');
  await writeFile(join(directory, "data-loader.js"), "/* first revision */");
  const command = fileURLToPath(new URL("../tools/version_site_assets.mjs", import.meta.url));
  await execute(process.execPath, [command, directory]);
  const first = await readFile(join(directory, "index.html"), "utf8");
  assert.match(first, /name="parliament-data-root" content="\.\/data\/"/);
  assert.match(first, /data-loader\.js\?v=[a-f0-9]{16}/);
  await writeFile(join(directory, "data-loader.js"), "/* second revision */");
  await execute(process.execPath, [command, directory]);
  const second = await readFile(join(directory, "index.html"), "utf8");
  assert.notEqual(second, first);
  assert.match(second, /name="parliament-data-root" content="\.\/data\/"/);
});


test("lazy player code and locale changes invalidate their publication URLs", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "parliament-lazy-assets-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, "locales"));
  await writeFile(join(directory, "index.html"), '<meta name="parliament-locale-version" content="local"><script src="viewer.js" data-player-src="viewer-player.js" data-controls-src="viewer-controls.js"></script>');
  for (const file of ["viewer.js", "viewer-player.js", "viewer-controls.js"]) await writeFile(join(directory, file), "/* first revision */");
  await writeFile(join(directory, "locales/en.json"), '{"title":"First"}');
  const command = fileURLToPath(new URL("../tools/version_site_assets.mjs", import.meta.url));
  await execute(process.execPath, [command, directory]);
  const first = await readFile(join(directory, "index.html"), "utf8");
  assert.match(first, /data-player-src="viewer-player\.js\?v=[a-f0-9]{16}"/);
  assert.match(first, /data-controls-src="viewer-controls\.js\?v=[a-f0-9]{16}"/);
  const version = (html) => html.match(/parliament-locale-version" content="([^"]+)"/)[1];
  const player = (html) => html.match(/data-player-src="([^"]+)"/)[1];
  await writeFile(join(directory, "locales/en.json"), '{"title":"Second"}');
  await writeFile(join(directory, "viewer-player.js"), "/* second revision */");
  await execute(process.execPath, [command, directory]);
  const second = await readFile(join(directory, "index.html"), "utf8");
  assert.notEqual(version(first), version(second));
  assert.notEqual(player(first), player(second));
});
