# Taiwan programme API: hosted-runner access investigation

[Diagnostic observations](2026-10-27-taiwan-actions-access.json) · [Programme collector implementation](2026-10-26-webtv-programmes.md)

The production publication at **2026-10-27T22:23:20Z** reports four consecutive
HTTP 403 failures for `taiwan-parliamentary-tv-programmes`. The parser can read
successful local responses, but no fresh Taiwan programme coverage is claimed
from these failed runs.

## Reproduced findings

Three isolated `ubuntu-latest` diagnostic jobs reproduce **CloudFront 403
“Request blocked”** responses. The test workflow lives only on the
`codex/taiwan-api-diagnostics` branch, with read-only repository permissions and
no publication step. Each job makes a small fixed set of bounded public requests.

| Comparison | Hosted runner result |
| --- | --- |
| Homepage and published JavaScript | Same CloudFront 403 |
| Collector's exact dated API request | CloudFront 403 |
| Published AJAX Accept/Referer/X-Requested-With headers | CloudFront 403 |
| Ordinary browser-compatible and generic HTTP user agents | CloudFront 403 |
| Escaped versus literal date slashes | CloudFront 403 |
| Independent curl HTTPS client | CloudFront 403, same blocking classification |
| Officially linked CTS programme page | CloudFront 403 |
| Host without `www` | No usable alternate endpoint |

The matched local AJAX request returns an 11-row JSON array. Some other local
requests time out, so the source is not uniformly reliable locally either.
The response is an access denial, not JSON or an application/parser exception.
No ordinary request-profile change tested here fixes the hosted-runner result.

## What is known about the cause

The evidence points to an access rule affecting the runner environment. It does
**not** identify a particular country rule, IP reputation rule or WAF rule.
CloudFront can deliver 403 errors from several causes, and its public response
does not distinguish WAF rejection from an origin rejection. The publisher's
CloudFront/WAF/origin logs are needed for exact attribution. See
[AWS's 403 troubleshooting guidance](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/http-403-permission-denied.html).

A parser change, timezone adjustment, different JSON handling or retries cannot
repair an access denial with the same response across the tested clients.
The TLS failure on the separate legacy iVOD route remains a different hold.

## Supported remediation

1. Ask the operator for a supported machine-readable programme feed, or authorized
   access for this endpoint from the collection infrastructure. Provide the
   diagnostic UTC timestamps, requested paths, collector user agent and run URLs
   recorded in the JSON. No message has been sent.
2. If approved access requires a stable source address, evaluate a collector with
   stable egress. GitHub documents that ordinary hosted-runner address ranges
   vary and recommends stable-address runners for such requirements; avoid asking
   for broad security exceptions. See the
   [GitHub runner reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners).
3. Until supported access is established, retain the explicit collection error
   and genuine freshness timestamps. A saved local response must not be labelled
   as a fresh GitHub collection.

No supported code-only fix was demonstrated. No production request code, TLS
policy or publication workflow is changed by this investigation. No media,
credentials, cookies, challenge solving, proxy rotation or direct-origin bypass
was used. Diagnostic evidence retains status, safe headers, response hashes and
redacted denial summaries rather than raw challenge bodies.
