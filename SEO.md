# SEO audit and publishing checks

The source is static HTML with crawlable links, visible content without JavaScript, a permissive robots.txt and an XML sitemap. No source-level crawler block was found. Homepage sections are anchors, not separate indexable product pages. The current sitemap correctly contains the three real pages; do not add fragment URLs or speculative pages.

Changes: descriptive homepage title and summary, explicit development status in introductory copy, consistent canonical homepage links, connected Organization/WebSite/WebPage/software structured data without invented pricing or ratings, legal-page structured data, and large-image preview permission. These changes help interpretation and consistency; they do not guarantee indexing or rankings.

Run `python3 scripts/check_seo.py` locally. Deployment runs this check before publishing. It validates sitemap URLs, canonical consistency, metadata, JSON syntax, crawl rules, local resources and internal anchors. It does not validate live HTTP responses or rich-result eligibility.

## Live verification after publishing

Live fetches from the audit environment failed, including a local DNS resolution failure. This does not establish an outage for users or search engines. Verify from an independent network:

- The apex domain resolves, HTTPS has a valid certificate, and public pages return 200 without authentication or bot challenges.
- HTTP and www variants permanently redirect to the matching HTTPS apex URL. Configure this in hosting/DNS as supported; GitHub Pages does not process .htaccess or arbitrary redirect configuration.
- /robots.txt returns plain text and /sitemap.xml returns XML, both with 200 responses. No hosting-level X-Robots-Tag blocks indexing.
- Unknown URLs return an actual 404 rather than a homepage with status 200.
- Use Google Search Console and Bing Webmaster Tools to verify ownership, submit https://stromule.com/sitemap.xml, inspect the homepage and review crawl/indexing reports. Verification tokens must come from the owner; none were invented.

For broader non-brand visibility, publish substantive, distinct pages for inventory, billing and other workflows once product details can support them. Explain actual capabilities and development limits, link those pages from the homepage, and add their canonical URLs to the sitemap. Do not create near-duplicate keyword pages. Add a verified public contact channel when available.

References: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls and https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec.
