import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { geoArea, geoContains } from "d3";

const features = JSON.parse(await readFile(new URL("../site/assets/maps/documented-admin1.geojson", import.meta.url), "utf8")).features;
const regions = new Map(features.map((feature) => [feature.properties.name, feature]));

test("detailed country context preserves navigation identity and spherical polygon interiors", async () => {
  const index = JSON.parse(await readFile(new URL("../site/assets/maps/country-detail-index.json", import.meta.url), "utf8"));
  const parents = new Set(features.map((feature) => feature.properties.parent_code));
  assert.deepEqual(new Set(index.countries.map((entry) => entry.code)), parents);
  for (const entry of index.countries) {
    const country = JSON.parse(await readFile(new URL(`../site/assets/maps/${entry.file}`, import.meta.url), "utf8"));
    assert.equal(country.properties.iso_a2 === "CN-TW" ? "TW" : country.properties.iso_a2, entry.code);
    const mainlandChecks = { AU: [149.13, -35.28], BR: [-47.88, -15.79], FR: [2.35, 48.86] };
    if (mainlandChecks[entry.code]) {
      assert(geoContains(country, mainlandChecks[entry.code]), `${entry.code}: mainland must not be replaced by an offshore territory sharing its ISO fallback`);
    }
    for (const coordinates of country.geometry.coordinates) {
      const area = geoArea({ type: "Polygon", coordinates });
      assert(area > 0 && area < 2 * Math.PI, `${entry.code}: reversed or empty country component`);
    }
  }
});

test("regional outlines use the small spherical interior for every polygon component", () => {
  for (const feature of features) {
    if (feature.geometry.type !== "MultiPolygon") continue;
    for (const coordinates of feature.geometry.coordinates) {
      const area = geoArea({ type: "Polygon", coordinates });
      assert(area > 0 && area < 2 * Math.PI, `${feature.properties.name}: reversed or empty component`);
    }
  }
});

test("regional outlines retain corrected territorial membership", () => {
  assert(geoContains(regions.get("Victoria"), [144.9631, -37.8136]), "Melbourne belongs to Victoria");
  assert(!geoContains(regions.get("Victoria"), [14.24, 36.04]), "Victoria in Malta is not Victoria, Australia");
  assert(geoContains(regions.get("Jura"), [7.3697, 47.2797]), "Moutier belongs to Jura after its 2026 transfer");
  assert(!geoContains(regions.get("Bern"), [7.3697, 47.2797]), "Moutier no longer belongs to Bern");
  assert(geoContains(regions.get("Åland"), [20.1167, 60.25]), "Northern main-island land near Sund must be retained");
  for (const point of [[13.36, 38.11], [15.08, 37.50], [15.55, 38.19], [14.28, 37.57], [12.54, 38.01], [13.58, 37.31], [14.06, 37.49], [14.73, 36.93], [15.28, 37.07]]) {
    assert(geoContains(regions.get("Sicily"), point), `Sicily lost a provincial-capital location: ${point}`);
  }
});
