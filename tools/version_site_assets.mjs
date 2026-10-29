import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

// Version the assembled HTML from the exact assets being deployed, including
// generated vendor manifests. Editing an asset must change its browser cache key.
const directory = resolve(process.argv[2] ?? "_site");
const pages = (await readdir(directory)).filter((name) => name.endsWith(".html"));
for (const page of pages) {
  const path = join(directory, page);
  let html = await readFile(path, "utf8");
  html = html.replace('name="parliament-data-root" content="../data/"', 'name="parliament-data-root" content="./data/"');
  const attributes = [...html.matchAll(/<(?:script\b[^>]*\bsrc|link\b[^>]*\bhref)="([^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)];
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
