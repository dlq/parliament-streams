import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

// Version the assembled HTML from the exact assets being deployed, including
// generated vendor manifests. Editing an asset must change its browser cache key.
const directory = resolve(process.argv[2] ?? "_site");
const pages = (await readdir(directory)).filter((name) => name.endsWith(".html"));

// Embed per-file map keys before hashing map.js for the HTML script URL.
if (pages.includes("map.html")) {
  const mapDirectory = join(directory, "assets", "maps");
  const versions = {};
  for (const folder of ["", "countries/"]) {
    const entries = await readdir(join(mapDirectory, folder), { withFileTypes: true });
    const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".geojson"))
      .map((entry) => entry.name).sort();
    for (const name of files) {
      const file = folder + name;
      const content = await readFile(join(mapDirectory, file));
      versions[file] = createHash("sha256").update(content).digest("hex").slice(0, 16);
    }
  }
  const scriptPath = join(directory, "map.js");
  const script = await readFile(scriptPath, "utf8");
  const declaration = /^const mapAssetVersions = \{[^\n]*\};/m;
  if (!declaration.test(script)) throw new Error("Map script lacks its asset version declaration");
  await writeFile(scriptPath, script.replace(declaration, `const mapAssetVersions = ${JSON.stringify(versions)};`));
}

const localeDirectory = join(directory, "locales");
const localeFiles = await readdir(localeDirectory).catch((error) => {
  if (error.code === "ENOENT") return [];
  throw error;
});
const localeHash = createHash("sha256");
for (const file of localeFiles.filter((name) => name.endsWith(".json")).sort()) {
  localeHash.update(file).update(await readFile(join(localeDirectory, file)));
}
const localeVersion = localeFiles.length ? localeHash.digest("hex").slice(0, 16) : null;
for (const page of pages) {
  const path = join(directory, page);
  let html = await readFile(path, "utf8");
  html = html.replace('name="parliament-data-root" content="../data/"', 'name="parliament-data-root" content="./data/"');
  if (html.includes('name="parliament-locale-version"')) {
    if (!localeVersion) throw new Error("Language packs are missing from the publication artifact");
    html = html.replace(/name="parliament-locale-version" content="[^"]*"/, `name="parliament-locale-version" content="${localeVersion}"`);
  }
  const attributes = [...html.matchAll(/\b(?:src|href|data-player-src|data-controls-src)="([^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)];
  for (const [, asset] of attributes) {
    if (/^(?:[a-z]+:|\/\/|\/)/i.test(asset)) continue;
    const [file] = asset.split("?");
    const content = await readFile(join(directory, file));
    const hash = createHash("sha256").update(content).digest("hex").slice(0, 16);
    html = html.replace(`"${asset}"`, `"${file}?v=${hash}"`);
  }
  await writeFile(path, html);
}
console.log(`Versioned script and stylesheet URLs in ${pages.length} HTML pages.`);
