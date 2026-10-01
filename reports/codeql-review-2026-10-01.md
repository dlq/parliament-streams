# New Zealand calendar CodeQL review

Reviewed [CodeQL alert #2](https://github.com/dlq/parliament-streams/security/code-scanning/2)
on 2026-10-01 against commit `af8a5aae590143f670da2870066e192df713e847`.
The rule is `py/incomplete-url-substring-sanitization`; GitHub labels its
security severity high.

The reported expression is `"perfdrive.com" in html.casefold()` in
`parliament_streams/scrapers/new_zealand_parliament.py`. Here `html` is the
downloaded calendar response body, or an offline input supplied to the parser.
It is not a URL. The collector fetches the configured source URL before calling
the parser. This expression identifies a bot-protection response that lacks
calendar content and raises `ValueError`; it does not allow a host, authorize
a request, redirect a browser, or choose a resource to execute.

The URL-sanitization rule therefore does not apply to this data flow. Resolve
the native alert as a false positive, preserving this rationale in its
dismissal comment. No parser change or URL allowlist is needed for this alert.

The existing parser tests confirm that a legitimate calendar containing a
Perfdrive script is accepted and that challenge-only HTML is rejected.
Validation: `python -m unittest tests.test_parsers_and_healthcheck` passed
all 29 tests on 2026-10-01. An independent code review confirmed the same
data-flow conclusion.

Bot-page classification remains heuristic: a substring is a signal in an HTML
document, not proof of a particular origin. This affects scraper classification
only and should continue to be checked against retained calendar fixtures when
the official page changes.
