# Privacy

Parliaments is a documentation and data repository with a static GitHub Pages
catalogue. It does not operate user accounts, analytics, telemetry, push
notifications, a server-side stream proxy, or a sync backend.

The static page is served by GitHub Pages. It loads the catalogue JSON from the
same published repository and, when a visitor chooses playback, may load
`hls.js` from jsDelivr and request a selected source's public stream directly.
GitHub, jsDelivr, and the selected source may apply their own logging, cookies,
geolocation rules, and terms; they are not controlled by this project.

The tracked repository contains public source URLs, official page URLs,
schedule/EPG endpoint notes, and research documentation. It should not contain
private correspondence, credentials, secrets, API keys, or personal viewing
history.

Fetch or validation scripts may make network requests to official
source pages, schedule pages, stream endpoints, YouTube pages, or streaming
vendor infrastructure. Those services may have their own logging, cookies,
tracking, geolocation rules, account prompts, or terms. They are not controlled
by this project.

Browser validation tools may load official pages in Chromium to observe public
player behavior and media-manifest requests. Do not run these tools while
logged in to third-party services, and do not commit cookies, local storage,
screenshots with personal account state, or raw browser profiles. Validation
reports should record technical request metadata, not personal browsing data.

Permission requests and responses should be summarized as evidence in the
rights matrix. Do not commit raw private emails unless all parties have agreed
that publication is appropriate.
