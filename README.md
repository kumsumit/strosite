# Stromule — Intelligent Business Operating System

Official introduction website for Stromule, a product of Kumpali Private Limited. Hosted destination: https://stromule.com. Repository: https://github.com/kumsumit/strosite.

## Local preview

Requires Python 3 and Node 22+ (Node is only used for a syntax check). Run `npm run check`, then `npm run preview` and open http://localhost:8000.

## Source structure

- `index.html`: homepage content, semantic structure and SEO metadata.
- `privacy.html`, `terms.html`, `404.html`: legal and error pages, sharing the same design system.
- `site.css`: the single design system (tokens, layout, animation, legal pages, responsive rules).
- `site.js`: all behaviour, dependency-free: scroll progress, reveals, the pinned "one sale" story, Copilot conversation, offline switch, sector tabs, dialogs and the Forminit contact form.
- `assets/`: logos, favicons and the social preview image.
- `scripts/`: build (`build.py`), SEO/crawl validation, HTTP smoke tests and IndexNow submission.
- `COMPETITIVE_POSITIONING.md`, `SEO.md`, `SEO_AUDIT.md`, `CRAWLER_POLICY.md`: research and policy notes (not published).

## Animation principles

Every animation explains something: a sale flowing through stock, the account and the report; a Copilot answer arriving; the offline-to-sync flow. Content is fully readable without JavaScript. `prefers-reduced-motion` removes motion and disables the pinned scroll story. Below 981px the story plays as a looping sequence instead of being pinned.

## Content rules

Stromule is in development. Do not add claims about availability, pricing, launch timing, integrations or compliance that are not confirmed.
