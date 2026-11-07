# SEO audit and publishing checks

The source is static HTML with crawlable links, visible content without JavaScript, a permissive robots.txt and an XML sitemap. No source-level crawler block was found. Homepage sections are anchors, not separate indexable product pages. The current sitemap correctly contains the three real pages; do not add fragment URLs or speculative pages.

Changes: descriptive homepage title and summary, explicit development status in introductory copy, consistent canonical homepage links, connected Organization/WebSite/WebPage/software structured data without invented pricing or ratings, legal-page structured data, and large-image preview permission. These changes help interpretation and consistency; they do not guarantee indexing or rankings.

Run `python3 scripts/build.py` followed by `python3 scripts/check_seo.py` locally. Deployment runs this check before publishing. It validates sitemap URLs, canonical consistency, metadata, JSON syntax, crawl rules, local resources and internal anchors. It does not validate live HTTP responses or rich-result eligibility.

## Live verification after publishing

Initial restricted-environment fetches failed. Later approved network checks succeeded; see the final live verification below. Continue checking after deployment:

- The apex domain resolves, HTTPS has a valid certificate, and public pages return 200 without authentication or bot challenges.
- HTTP and www variants permanently redirect to the matching HTTPS apex URL. Configure this in hosting/DNS as supported; GitHub Pages does not process .htaccess or arbitrary redirect configuration.
- /robots.txt returns plain text and /sitemap.xml returns XML, both with 200 responses. No hosting-level X-Robots-Tag blocks indexing.
- Unknown URLs return an actual 404 rather than a homepage with status 200.
- Use Google Search Console and Bing Webmaster Tools to verify ownership, submit https://stromule.com/sitemap.xml, inspect the homepage and review crawl/indexing reports. Verification tokens must come from the owner; none were invented.

For broader non-brand visibility, publish substantive, distinct pages for inventory, billing and other workflows once product details can support them. Explain actual capabilities and development limits, link those pages from the homepage, and add their canonical URLs to the sitemap. Do not create near-duplicate keyword pages. Add a verified public contact channel when available.

References: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls and https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec.

## Implementation completed in this request

- `SEO_AUDIT.md`: baseline architecture, route inventory, problems and external limits, written before this implementation.
- `robots.txt`, `CRAWLER_POLICY.md`: open default policy and independently changeable search/training policy guidance. No bot-specific declarations or private-route names.
- `scripts/build.py`, `sitemap.xml`: canonical-driven discovery of all public HTML, automatic sitemap generation, no fabricated lastmod. Directory index routes support future language folders. No sitemap index needed for three pages. Existing small decorative illustrations do not warrant image sitemap entries.
- `.github/workflows/deploy.yml`, `.gitignore`: public artifact build and validation; `_site` is excluded from version control. Repository research/scripts are not uploaded. There is no dependency installation or JavaScript bundling step.
- `scripts/indexnow.py`, `indexnow-key.txt`: public ownership key (not a secret), dry-run default and post-deployment notification of sitemap URLs. Deployment checks the live key before submitting. Nonfatal notification failure leaves a visible Actions warning. All three URLs are submitted at the current small scale; introduce change-only batching as content grows. Removed/redirected URL notification can be added when real removals exist. No unsupported Google Indexing API.
- `index.html`, `privacy.html`, `terms.html`: unique metadata, complete explicit social cards, canonical links, structured data and llms discovery. Homepage retains the Business OS identity and adds three factual, self-contained FAQ answers. Empty alt values remain on decorative/redundant logos and illustrations; no keyword-stuffed alt text.
- `404.html`: noindex recovery page. GitHub Pages serves this at missing URLs with HTTP 404; no soft-404 homepage fallback. No existing routes removed, no speculative 301/410 mappings.
- `llms.txt`: concise identity, accurate development limitations and official content links, following the documented Markdown proposal. No invented ai.txt standard.
- `assets/logo-96.png`, `assets/pangeabuy-96.png`: resized logos for up to 48 CSS px at 2× density; original logos remain available to schema/other uses. PNG kept for compatibility and low payload; no unmeasured WebP/AVIF claim. Files decrease from roughly 20 KB and 36 KB to 6.6 KB and 4.3 KB. Existing SVGs are already tiny. Dimensions and below-fold lazy loading retained. Font display=swap retained. Compression/CDN caching are hosting-controlled and unverified. No field Core Web Vitals claims.
- `scripts/check_seo.py`, `scripts/check_http.py`: artifact validation and repeatable HTTP checks.

## International and content expansion

HTML uses `lang=en`; `og:locale=en_US` describes the current English sharing locale, not market restrictions. No localized URLs yet, so no hreflang/x-default placeholders. For real translations, publish substantive localized content under language folders, self-canonicalize each, add reciprocal language annotations and x-default to the actual language fallback, then test sitemap and internal links. Do not imply Ghana/Africa/South America availability or localized pricing without evidence.

Homepage owns broad Business OS / business management intent. Future feature pages should explain distinct verified workflows; industry pages need original examples; comparisons require current primary-source verification. Pricing/download/contact routes await actual published information. No manufactured GST/accounting, pricing, ratings, reviews, contacts, screenshots or competitor claims. Article/Breadcrumb/FAQ/Product schemas are omitted where the current pages do not warrant them; no commercial software rich-result eligibility is claimed without required genuine offers/ratings.

## Verification results — 7 November 2026

- Production static build passed: 3 indexable HTML pages plus a noindex custom 404, automatically generated sitemap and isolated assets.
- Artifact checks passed: canonical URLs, unique titles/descriptions, one H1, social fields, parseable JSON-LD, all local links/anchors, image alt/dimension attributes, crawler rules and absence of internal research/scripts in output.
- JavaScript syntax checks passed for shared navigation and homepage script.
- Browser inspected at 390×844 and 1440×900; measured no horizontal overflow. At 320×740, document width also matched viewport. Mobile menu expands, product availability dialog opens/closes, FAQ disclosure opens, custom error page displays. This is desktop browser responsive testing, not real-device certification. Lazy images outside the viewport are intentionally not loaded initially.
- JSON-LD parsing is not equivalent to Schema.org Validator or Google Rich Results Test. Run those hosted validators on the deployed URLs after publication. Social metadata is checked locally; actual Facebook/LinkedIn/WhatsApp/Telegram/X previews were not submitted or tested.
- Live-domain fetch failed again in the web tool. Genuine crawler access, field LCP/INP/CLS and CDN/firewall logs remain unverified. No external ownership tokens or accounts were invented.

## Monitoring and owner setup

After publishing, run `python3 scripts/check_http.py` against the live domain and inspect Actions IndexNow status. Verify domain ownership in Google Search Console, Bing Webmaster Tools and Yandex Webmaster with their real DNS/HTML tokens, then submit the canonical sitemap. Inspect canonical selection, crawl errors, redirects and robots response headers. No account setup/submission has been performed in this environment.

Weekly: track indexed/crawled-not-indexed/discovered-not-indexed URL counts, sitemap errors, canonical errors, 404s/redirect chains, impressions/clicks/CTR/positions/queries and available Core Web Vitals. Monitor AI referral traffic only when privacy-appropriate analytics exists; none was added here. Review hosting/WAF logs for verified crawler failures where accessible. AI citations require an explicit repeatable measurement method; referrals and sampled mentions do not establish total citation counts. Recheck bot documentation before changing controls.

## Final live verification (supersedes initial network limits)

Approved requests outside the restricted sandbox reached the deployed domain successfully on 7 November 2026:

- Homepage, privacy, terms and sitemap: HTTP 200, correct HTML/XML content types, no X-Robots-Tag noindex header.
- Deployed robots.txt: HTTP 200 and wildcard Allow: / with the canonical sitemap.
- HTTP apex redirects to HTTPS apex. HTTPS www failed DNS resolution; add the www DNS record and configure GitHub Pages to redirect it to the apex. DNS account access was not available and no DNS settings were modified.
- Unknown live route returns HTTP 404.
- Seven simulated agents (Googlebot, bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, facebookexternalhit and an unknown research agent) receive HTTP 200 and initial HTML containing H1 content.
- Local production artifact: 8 resource HTTP checks and the same 7 user agents passed, with missing URL HTTP 404.

These requests test public access, not genuine crawler origin or indexing. Actual provider crawler logs, CDN rules, external schema/social validators, webmaster ownership and field performance still require owner-side validation. The new files are local; the existing deployed site has not been replaced, and IndexNow has only been dry-run. No sitemap/account submission was claimed.
