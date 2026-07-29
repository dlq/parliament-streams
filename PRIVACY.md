# Privacy

Parliaments is a documentation and data repository. It does not operate a
hosted service, user account system, analytics pipeline, telemetry SDK, push
notification system, or sync backend.

The tracked repository contains public source URLs, official page URLs,
schedule/EPG endpoint notes, and research documentation. It should not contain
private correspondence, credentials, secrets, API keys, or personal viewing
history.

Future fetch or validation scripts may make network requests to official
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
