# Hosted versus local schedule endpoint access

[Recorded response summaries](2026-11-20-hosted-access-comparison.json)

Two bounded diagnostic runs used an isolated branch with read-only repository
permissions. They made public requests using the production collector user
agent and Accept header. No login or cookies were supplied. Python urllib and
curl over IPv4 with HTTP/1.1 and HTTP/2 were compared. TLS verification succeeded
for every completed curl probe. There were no redirects in those probes.

- [Initial Linux/macOS comparison, 15:59 UTC](https://github.com/dlq/parliament-streams/actions/runs/44768740612)
- [Fresh runners and complete Taiwan-window check, 16:00–16:01 UTC](https://github.com/dlq/parliament-streams/actions/runs/44769010032)

## Results

| Environment | Taiwan programme API | New York Senate ICS |
| --- | --- | --- |
| Local Mac, 15:59 UTC | 200 with Python and both curl protocols | Python and curl HTTP/1.1 returned 200; curl HTTP/2 was challenged with 403 |
| Initial hosted Linux | 200 with Python and both curl protocols | 403 with Cloudflare challenge |
| Initial hosted macOS | 403, CloudFront request blocked | 403 with Cloudflare challenge |
| Fresh hosted Linux | 403; complete six-request collection failed on its first request | 403 with Cloudflare challenge |
| Fresh hosted macOS | 403; complete six-request collection failed on its first request | 403 with Cloudflare challenge |

### New York

Every hosted Python response included **CF-Mitigated: challenge**, which
Cloudflare documents as an explicit challenge-page indicator. This applies to
the homepage and events page as well as the calendar. The calendar export's
Accept and Referer headers did not resolve it. Both tested curl protocol
versions were blocked on hosted runners. The local HTTP/2 failure also shows
that the decision can depend on client characteristics.

The demonstrated cause is Cloudflare's challenge response. The particular
security rule and the relative contributions of IP reputation, automation
detection, geography and client characteristics require the publisher's
Cloudflare security logs.

[Cloudflare response-header documentation](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/)
· [Cloudflare challenge troubleshooting](https://developers.cloudflare.com/cloudflare-challenges/troubleshooting/)

### Taiwan

The successful local responses came from the application server through
CloudFront. Blocked hosted responses carried **Server: CloudFront**,
**X-Cache: Error from cloudfront**, and the CloudFront request-blocked template.
The homepage and static JavaScript had the same disposition as the API.

The first Linux runner received 200 via HIO52-P5. Subsequent Linux and macOS
runners received 403 via DFW59-P1, ATL56-P2 and SFO53-P9. Local requests succeeded
via YUL62-P1. Edge identifiers describe the CDN location serving a request;
they do not establish the caller's country or the blocking rule.

The data establishes variation across hosted runs and CDN paths. It does not
establish a blanket GitHub, Linux, macOS or country restriction. A changed
header or protocol did not account for the difference in these comparisons.
No complete successful hosted three-day collection was verified.

CloudFront's public error response cannot distinguish all origin, WAF and
geographical causes. The operator's access/security logs are needed to
identify the exact rule.

[AWS 403 troubleshooting](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/http-403-permission-denied.html)

## Implications for collection

The same application code can succeed locally and be challenged or blocked
from Actions because the outbound network and client characteristics differ.
GitHub documents that its hosted runner addresses are dynamically assigned
from shared infrastructure, and that third-party security systems can assign
reputation to those addresses.

[GitHub runner IP and reputation documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-githubs-ip-addresses?apiversion=2022-11-28)

A supported remediation would be an operator-provided machine feed or access
rule for the collector. A stable-egress collector can be evaluated if the
operator requires a specific address. The runner comparisons do not establish
that changing the production operating system would reliably fix collection.
The requests above use no application credentials, so adding a GitHub token
would not grant access to these publishers.

The diagnostic workflow and script remain on
`codex/collector-access-20261120`. Production collectors and Pages networking
were not changed by these diagnostics.
