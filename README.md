# Stromule — Intelligent Business Operating System

Official introduction website for Stromule, a product of Kumpali Private Limited. Hosted destination: https://stromule.com. Repository: https://github.com/kumsumit/strosite.

## Local preview

Requires Python 3.10+ and Node 22+. Once: `npm ci` and `python -m pip install -r requirements.txt`. Then `npm run check` (tests, builds the blog and site, SEO checks), `npm run preview` and open http://localhost:8000. The blog is at /blog/ and the CMS at /admin/.

## Source structure

- `index.html`: homepage content, semantic structure and SEO metadata.
- `privacy.html`, `terms.html`, `404.html`: legal and error pages, sharing the same design system.
- `site.css`: the single design system (tokens, layout, animation, legal pages, responsive rules).
- `site.js`: all behaviour, dependency-free: scroll progress, reveals, the pinned "one sale" story, Copilot conversation, offline switch, sector tabs, dialogs and the Forminit contact form.
- `assets/`: logos, favicons and the social preview image.
- `blog.css`, `content/blog/`, `scripts/build_blog.py`: the blog (styles, Markdown posts, generator); see "Blog and CMS" below.
- `admin/`: the CMS at /admin/ (Sveltia CMS config and page).
- `region.js`: regional terms for visitors outside India.
- `scripts/`: build (`build.py`), SEO/crawl validation, HTTP smoke tests and IndexNow submission.
- `COMPETITIVE_POSITIONING.md`, `SEO.md`, `SEO_AUDIT.md`, `CRAWLER_POLICY.md`: research and policy notes (not published).

## Animation principles

Every animation explains something: a sale flowing through stock, the account and the report; a Copilot answer arriving; the offline-to-sync flow. Content is fully readable without JavaScript. `prefers-reduced-motion` removes motion and disables the pinned scroll story. Below 981px the story plays as a looping sequence instead of being pinned.

## Content rules

Stromule is in development. Do not add claims about availability, pricing, launch timing, integrations or compliance that are not confirmed.

## Blog and CMS — November 2026

**Writing posts.** Open **https://stromule.com/admin/** and sign in with a GitHub personal access token. The CMS (Sveltia CMS, MIT, pinned in `package.json` and self-hosted from `node_modules`) saves each post as `content/blog/<slug>.md` on `main`; every save is a commit, and the deploy workflow puts it live in about 1-2 minutes. Images uploaded in the CMS go to `assets/blog/`. The editor's fields and validation live in `admin/config.yml` and mirror the build's checks.

Create the token once: GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**. Repository access: only `kumsumit/strosite`. Permissions: **Contents: Read and write**. Paste it in the CMS sign-in screen; it stays in that browser only. Only people with write access to the repository can publish.

**Drafts and scheduling.** New posts start as drafts and are never published until **Draft** is turned off. A publish time in the past publishes on save; a future time schedules the post, and the daily 09:00 IST rebuild (the `schedule` trigger in `deploy.yml`) puts it live on that day.

**Build.** `scripts/build_blog.py` builds `blog/` (gitignored): the blog index with a featured post and pagination, a page per category that has posts, post pages with a table of contents, optional cover image, FAQ and related posts, `blog/feed.xml`, the homepage "From the blog" strip and the homepage FAQPage schema. Posts carry BlogPosting, BreadcrumbList and FAQPage structured data and are added to the sitemap. Images get their real width and height and lazy loading.

**Checks.** Every post needs a 20-70 character title, a 110-170 character summary, a publish time with a time zone, a category, at least 150 words, no Heading 1 in the body, and images uploaded to the site. A post that fails is skipped with a warning in the deploy log, so one bad post never blocks the site; pull-request validation (`BLOG_STRICT=1`) fails instead. Posts marked `ai: true` (the three starter guides) also get strict honesty checks: no unhedged product claims, availability wording, external links or tax rates. `npm test` runs `scripts/check_blog_lint.py`.

**Regional terms.** `region.js` swaps a few everyday terms (shop type, tax name, accounting tool, "khata") for visitors outside India, using the browser's own time zone and language, and lists blog posts for the visitor's country first. Crawlers keep the Indian default copy so one consistent version is indexed. Mark a term in HTML with `<span data-term="tax">GST</span>` (`shops`, `khata`, `acct`, `tax`).

Setup, once: in GitHub, **Settings → Pages → Source: GitHub Actions** (this also fixes the missing `assets/interactive/` bundle on the live site).
