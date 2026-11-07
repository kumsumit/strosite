# Stromule — Intelligent Business Operating System

Official introduction website for Stromule, a product of Kumpali Private Limited. Hosted destination: https://stromule.com. Repository: https://github.com/kumsumit/strosite.

## Local preview

Run `python3 -m http.server 8000` in this directory, then open http://localhost:8000. No installation is required. For a production-equivalent preview, run `python3 scripts/build.py` then `python3 -m http.server 8000 --directory _site`.

## Source structure

- `index.html`: homepage content, semantic structure and SEO metadata.
- `styles.css`: existing shared brand tokens, navigation, legal pages and responsive styles.
- `positioning.css`: homepage operating-system narrative, product concepts and responsive layouts.
- `script.js`: informational access/contact dialogs and active navigation state.
- `common.js`: mobile navigation, sticky header and copyright year on all pages.
- `content.js`: legacy merchant-journey data retained but no longer loaded.
- `privacy.html` and `terms.html`: legal pages, retained with working cross-links.
- `assets/`: supplied logos, favicons, social preview and original SVG business illustrations.
- `COMPETITIVE_POSITIONING.md`: primary-source competitive research, positioning decisions and input-capability verification.
- `REDESIGN.md`: editorial audit, removed/rewritten/new sections, source-backed claim classifications, product-team questions and verification limits.

Poppins and Aref Ruqaa Ink load through Google Fonts. No new fonts or runtime dependencies were added.

## Product status

Stromule is in development. The website separates implementation under development from longer-term vision. No product capability is advertised as publicly available. Inventory/billing visuals are labeled concepts based on development workflows; the Business Copilot conversation is illustrative. Pangeabuy is presented as an independently usable product direction, with authorized connections subject to implementation.

Registration is not open, pricing and launch timing are unannounced, and this website has no submissions backend. Access/contact buttons open informational dialogs. A verified public contact address and Pangeabuy URL remain to be supplied. Do not replace them with invented destinations.

## Publishing

This directory is the repository root for `kumsumit/strosite`. The included GitHub Actions workflow builds and validates `_site`, publishes that public artifact from `main` to GitHub Pages, then notifies IndexNow. The existing `CNAME` retains stromule.com. This redesign is a local implementation and has not been pushed or deployed. Complete browser and real-device QA before publication; see `REDESIGN.md`.

## SEO maintenance

Run `python3 scripts/build.py`, `python3 scripts/check_seo.py`, and `python3 scripts/indexnow.py` (dry run). New indexable HTML pages must have self-referencing canonical URLs and unique metadata; the build discovers them automatically. See `SEO_AUDIT.md`, `CRAWLER_POLICY.md`, and `SEO.md` for implementation, verification results and external account steps. Never preview or deploy the parent application workspace.
