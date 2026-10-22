# Search visibility and link previews

The preferred public site is `https://dlq.ca/parliament-streams/`. Catalogue,
coverage map, and schedule pages publish self-referencing canonical URLs on that
domain. The old GitHub Pages address redirects there and must not be declared as
the canonical page.

Every page has a branded title, a description, Open Graph and Twitter Card
metadata, and conservative WebSite/WebPage or CollectionPage JSON-LD. Shared
`site/seo.js` keeps rendered titles, descriptions, and page structured data in
step with the selected interface language. The original HTML includes the
English metadata so link-preview crawlers do not need JavaScript. Structured
data describes the independent catalogue; it does not claim that the project is
an official parliamentary service or that rich results are guaranteed.

`site/sitemap.xml` lists the three canonical HTML pages. It intentionally omits
UI query-string variants, playlist feeds, JSON exports, and XMLTV. No artificial
last-modified dates or priority values are added. Every page links to the sitemap
in its footer.

## Search Console setup

The connected account had no `dlq.ca` property when checked on October 22, 2026.
No property, verification record, or ownership permissions were changed.

1. Add and verify the URL-prefix property
   `https://dlq.ca/parliament-streams/`, or use a verified `dlq.ca` domain property.
   URL-prefix HTML-file/meta-tag verification can be scoped to this project;
   domain verification requires access to the domain's DNS.
2. Submit `https://dlq.ca/parliament-streams/sitemap.xml` in **Sitemaps** after it
   is deployed.
3. Inspect the homepage, map, and schedule URLs. Check Google's selected
   canonical, crawl/indexing status, and rendered content; request indexing
   after meaningful changes.
4. Review project-URL performance for brand searches and legislature-specific
   queries. Compare impressions, clicks, click-through rate, and average
   position over time rather than treating one personalized results page as a
   ranking measurement.

A `site:dlq.ca/parliament-streams/` search returned the homepage on October 22;
this is a discovery observation, not a complete indexing audit. Google chose the
old unbranded rendered heading as its result title. Search Console is needed for
more reliable diagnosis.

A project-local `robots.txt` would not control crawling: robots rules belong at
`https://dlq.ca/robots.txt`, which this project does not manage. Its observed 404
was not an indexing prohibition. Do not add a misleading project-local robots
file or change other sites on the domain as part of this repository's deploy.

## Further work

- Generate useful, crawlable legislature/source pages with original source,
  playback, schedule, and evidence information. Avoid thin pages made only to
  repeat keywords; keep them tied to the canonical catalogue and link them from
  the UI and sitemap.
- Measure actual loading and interaction performance before choosing performance
  work. Retain the existing local vendor assets and lazy player loading.
- Seek relevant independent links when the project enters its outreach phase.
- Check how shared links render on target services. Their cached previews and
  Google's selected snippets may take time to refresh after deployment.

These changes improve discovery and consistent metadata; neither sitemap
submission nor structured data guarantees indexing or first-page rankings.

References: [Google title guidance](https://developers.google.com/search/docs/appearance/title-link),
[canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls),
[sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[requesting recrawls](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl),
[structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
