# Browser library assets

`npm ci` generates the local browser libraries through `postinstall`. To rebuild
them after an install, run `npm run build:vendor`. The generated JavaScript,
asset metadata, and `LICENSES.txt` are ignored by Git and are included in the
published Pages artifact.

`package-lock.json` is the source of truth. D3 is bundled from its installed ESM
modules with esbuild, so updates to D3's transitive dependencies also reach the
browser. HLS.js uses its full upstream distribution, including subtitle and
alternate-audio support. Both libraries load from the site's own origin with
content hashes as cache keys.

Dependabot checks the npm dependencies weekly. Every CI install and Pages
deployment, including scheduled deployments, regenerates the assets. Dependency
updates should pass the existing map interactions and the local HLS browser
smoke check before merging.

The generator copies upstream license notices for every bundled runtime
package to `LICENSES.txt`. HLS.js uses Apache 2.0; the full upstream license text
is retained in `APACHE-2.0.txt`.

- D3: https://d3js.org/
- HLS.js: https://github.com/video-dev/hls.js
- esbuild: https://esbuild.github.io/
- Apache 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt
