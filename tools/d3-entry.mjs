// Keep the map's runtime surface explicit so esbuild can omit unused D3 modules.
export { geoCentroid, geoNaturalEarth1, geoPath, json, select, zoom, zoomIdentity, zoomTransform } from "d3";
