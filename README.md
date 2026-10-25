# Stromule — Our Business OS

Official introduction website for Stromule, a product of Kumpali Private Limited. Hosted destination: https://stromule.com. Repository: https://github.com/kumsumit/strosite.

## Local preview

Run `python3 -m http.server 8000` in this directory, then open http://localhost:8000. No package installation or build step is required.

## Source structure

- `index.html`: complete homepage, with semantic content and SEO metadata.
- `styles.css`: shared brand tokens, responsive layouts, motion, and legal-page styling.
- `content.js`: six illustrative merchant journeys, separated from presentation.
- `script.js`: workspace comparison, record exploration, journeys, notices, and scroll effects.
- `common.js`: accessible navigation, sticky-header state, and copyright year for all pages.
- `privacy.html` and `terms.html`: website policies with working cross-links.
- `assets/`: supplied logos, brand-derived favicons, sharing image, and original SVG merchant illustrations.

Only Poppins and Aref Ruqaa Ink are requested. Fonts currently load through Google Fonts. This preserves the explicit two-font requirement from the project conversation over the brief's optional Manrope recommendation.

## Publishing

The contents of this directory are the repository root for `kumsumit/strosite`. The included GitHub Actions workflow publishes `main` to GitHub Pages. In repository Settings → Pages, select GitHub Actions as the source and `stromule.com` as the custom domain. The existing `CNAME` retains that domain.

Configure DNS following GitHub's instructions: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site. Enable HTTPS once GitHub verifies the domain and issues its certificate.

## Product status and configuration

Workspace layouts, merchant stories, and the information flow to Pangeabuy are illustrations of the product direction, not shipped-feature claims. No live stock, order processing, payments, automatic imports, or discovery integration are represented as available.

Registration is not open and this website does not store submissions. `#start` explains the status. Access and contact buttons show honest informational dialogs. When verified product access or contact destinations become available, update these controls and the FAQ rather than showing a fake success state. No public Pangeabuy URL has been supplied, so the ecosystem explanation stays on this website.

Legal pages describe this informational site's current implementation. Confirm a verified privacy contact and any jurisdiction-specific requirements before collecting registrations or changing data processing. Update the policy if providers or data-handling behaviour change.

See `DESIGN.md` for composition, accessibility, and validation notes.
