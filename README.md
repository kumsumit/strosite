# Stromule — Intelligent Business Operating System

Official introduction website for Stromule, a product of Kumpali Private Limited. Hosted destination: https://stromule.com. Repository: https://github.com/kumsumit/strosite.

## Local preview

Run `npm ci` and `npm run check`, then `python3 -m http.server 8000 --directory _site` and open http://localhost:8000. Node 22+ and Python 3 are required. The build pre-renders the React hero so its product content remains available without JavaScript. See `ANIMATION_ARCHITECTURE.md` for module ownership and build details.

## Source structure

- `index.html`: homepage content, semantic structure and SEO metadata.
- `styles.css`: existing shared brand tokens, navigation, legal pages and responsive styles.
- `positioning.css`: homepage operating-system narrative, product concepts and responsive layouts.
- `stitch.css`: current Stitch-inspired homepage design with emerald accents, slate surfaces, adaptive dashboard, cards and responsive layouts.
- `crafted.css` and `positioning.css`: retained earlier homepage treatments; no longer loaded by the homepage.
- `script.js`: informational access/contact dialogs and active navigation state.
- `common.js`: mobile navigation, sticky header and copyright year on all pages.
- `content.js`: legacy merchant-journey data retained but no longer loaded.
- `privacy.html` and `terms.html`: legal pages, retained with working cross-links.
- `assets/`: supplied logos, favicons, social preview and original SVG business illustrations.
- `COMPETITIVE_POSITIONING.md`: primary-source competitive research, positioning decisions and input-capability verification.
- `REDESIGN.md`: editorial audit, removed/rewritten/new sections, source-backed claim classifications, product-team questions and verification limits.

The homepage loads Inter and Plus Jakarta Sans through Google Fonts. Legal pages retain their existing typography. Three.js 0.180.0 is vendored locally under `assets/vendor/three/` with its MIT license. It loads on demand near the scene; no CDN is required.

## Product status

Stromule is in development. The website separates implementation under development from longer-term vision. No product capability is advertised as publicly available. Inventory/billing visuals are labeled concepts based on development workflows; the Business Copilot conversation is illustrative. Pangeabuy is presented as an independently usable product direction, with authorized connections subject to implementation.

Registration is not open, pricing and launch timing are unannounced, and this website has no submissions backend. Access/contact buttons open informational dialogs. A verified public contact address and Pangeabuy URL remain to be supplied. Do not replace them with invented destinations.

## Publishing

This directory is the repository root for `kumsumit/strosite`. The included GitHub Actions workflow builds and validates `_site`, publishes that public artifact from `main` to GitHub Pages, then notifies IndexNow. The existing `CNAME` retains stromule.com. This redesign is a local implementation and has not been pushed or deployed. Complete browser and real-device QA before publication; see `REDESIGN.md`.

## SEO maintenance

Run `python3 scripts/build.py`, `python3 scripts/check_seo.py`, and `python3 scripts/indexnow.py` (dry run). New indexable HTML pages must have self-referencing canonical URLs and unique metadata; the build discovers them automatically. See `SEO_AUDIT.md`, `CRAWLER_POLICY.md`, and `SEO.md` for implementation, verification results and external account steps. Never preview or deploy the parent application workspace.

## Release validation — 7 November 2026

The public crawler policy permits all user agents and public assets, including unknown crawlers. No provider-specific allowlist is needed. Crawl permission does not guarantee indexing; CDN/firewall and live hosting rules must also permit requests.

The homepage follows the supplied Stitch project: emerald accents, pale slate surfaces, centered typography, a detailed dashboard concept and connected capability cards. Browser checks covered 320, 390, 600, 768, 844, 1024, 1440, 1920 and 2560px widths, including portrait and landscape, without horizontal overflow. Mobile navigation, the availability dialog and native FAQ disclosure passed, with no browser errors or warnings. Build, SEO, JavaScript syntax and local HTTP checks passed. Pull requests now validate the build, crawler rules, metadata, links and HTTP responses in CI.

These changes are local and have not been pushed or deployed. Before public product launch, supply a verified contact channel and confirm product availability. The current website remains an informational introduction to a product in development.

## Product background refinement

The homepage now uses an original SVG operating map (`assets/operation-map.svg`): receipt, stock parcel, ledger and team drawings connected by transaction paths. Warm neutral surfaces, fine document rules and a compact workflow strip replace the previous lavender glow. Decorative side drawings disappear below 1100px, while mobile keeps a simplified flow. The drawings are hidden from assistive technology and do not intercept input. Visual references: https://linear.app/homepage (product-led composition) and https://stripe.com (graphic identity with structural rules). No external artwork was copied.

Checked seven viewports from 320px to 2560px, including landscape, with no horizontal overflow. Build and SEO/link checks pass. This refinement remains local.

## Interactive experience

`experience.css` and `experience.js` add the receipt scene, transaction story, visibility-aware motion, motion pause control, illustrative offline switch and Copilot prompt choices. See `EXPERIENCE_DESIGN.md` for the reference study, design rationale and verification limits. All demos use sample records and perform no business operations.


The hero now uses an interactive 3D shop: customer, shopkeeper, counter, bill, items, supplier and van. Click the models or use the four entity buttons; advance the sample sale with the primary action and reset with Start Again. Run `node scripts/check_scene.mjs` for the scene's geometry, transaction-state and lifecycle checks.

## React animation upgrade — 7 November 2026

The hero now presents an interactive business dashboard with inventory, billing, customer, purchase, payment, team and report previews. Record/reset a sample rice sale to see stock move from 42 to 40 bags. Motion controls UI transitions, shared section reveals and reading progress; lazy GSAP controls desktop scroll chapters. Lazy React Three Fiber and Drei provide a demand-rendered desktop depth layer. The old shop scene is no longer loaded. No approved Rive assets or customer stories were available, so no placeholder Rive runtime or fictional testimonials were added.

Initial JavaScript is approximately 114 KB gzip, with the optional 3D chunk approximately 233 KB gzip and scroll-story chunk approximately 45 KB gzip (plus small shared chunks). These are transfer-size estimates from the build, not measured performance scores. This upgrade is local and has not been deployed.

Browser checks for this upgrade covered 320, 390, 768 and 1440px widths without document overflow; sample sale updates, product tabs, Home/End keyboard navigation, mobile menu/Escape and scroll-story entry passed. No console warnings or errors appeared in these checks. Mobile rendered no WebGL canvas. TypeScript, production build, SEO and HTTP smoke checks passed. Reduced-motion fallbacks were inspected in source; OS-level reduced-motion emulation, real-device QA and production Lighthouse/axe scores were not measured.

## Hands-on animated shop

Use **Play a working day** in the hero to open the new interactive shop. Set 1–8 rice bags, choose paid or credit, then play or step through the sale. Rice travels from the shelf into the basket; an itemized bill prints; stock, the customer account and daily reporting update in sequence. Receive a supplier delivery to animate the van and stock receipt, toggle attendance, or prepare an unsent payment reminder. Reset returns the whole simulation to its initial state.

This is original SVG artwork animated with Motion and backed by a tested transaction state model. The static dashboard below the hero was replaced. The implementation adds no animation dependencies. `npm test` verifies inventory, paid/credit, purchase receipt, invoice count, quantity locking and reset behavior. `npm run preview` serves the last production build on port 8000.
