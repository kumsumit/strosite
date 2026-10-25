# Stromule official website

## Brief and scope

Implemented in `stromule_website`, the existing GitHub Pages checkout. The supplied official-website brief drives the structure, product positioning, exact hero headline, parent-company attribution, and distinction between Stromule and Pangeabuy. Prior explicit requests to use only Poppins and Aref Ruqaa Ink remain in force; the new brief's preferred Manrope is not introduced.

## Identity and composition

The existing supplied Stromule mark is preserved. Its green, teal, and blue identity supplies the accent palette; deep business ink, white, pale green, and pale teal provide readable surfaces. The separately supplied P-shaped teal mark is used for Pangeabuy without recolouring. Brand-derived favicon and touch-icon assets are retained. Social previews use a 1200×630 PNG.

The hero pairs the exact requested message with an illustrative working area. A restrained flowing ribbon sits behind a real grid of records so text does not depend on overlapping cards. Original, local SVG illustrations distinguish retail, wholesale, workshops, services, vendors, and growing businesses without pretending to depict real customers. The page progresses through the problem, better habits, product direction, intended audiences, everyday journeys, record lifecycle, discovery, ecosystem, adoption, trust, FAQ, and a closing invitation.

Poppins is used for all reading and interface text. Aref Ruqaa Ink is used selectively for editorial phrases and the tagline. No other named font family is loaded or declared.

## Interactive storytelling

- Hero: switch between everyday pieces and an organised view; select each sample record for an explanation.
- Merchant journeys: each of the six business profiles selects its own three-step story. Selecting a merchant resets the example and moves focus to the reading panel. Tabs support Left/Right arrows, Home, and End; the next control loops through the story.
- Timeline: an Intersection Observer reveals a once-only progress line, with a vertical sequence on mobile.
- Ecosystem: sequential entrance treatment distinguishes the business product, authorised connection, and customer-facing product.
- FAQ: native keyboard-accessible disclosures.
- Navigation: visible focus states, mobile menu with Escape and outside-click handling, focus movement on opening, and an observed sticky-header state.
- Access/contact: honest availability notices, with native modal dismissal and focus restoration. No fake form, persistence, registration, or success state.

Reduced-motion settings remove movement and continuous animation while keeping controls functional. Important content remains in semantic HTML and readable without animation JavaScript. Illustrative records and journeys are explicitly distinguished from available product features. There is no automatic-import, inventory-sync, payment, delivery, or universally live integration claim.

## Validation

Checked in Chromium headless on 25 October 2026:

- Desktop, tablet, and mobile widths: 320, 390, 768, 1024, and 1440 CSS pixels; no horizontal overflow.
- Four hero records and both workspace views.
- Six merchant journeys and all 18 steps, reset/restart behaviour, and keyboard tab navigation.
- Access dialog, Escape dismissal, mobile menu, FAQ, and both legal pages.
- Reduced-motion transition removal.
- Both requested fonts loaded; no page JavaScript errors in the completed browser check.
- Visual inspection of desktop hero, mobile workspace, desktop/mobile product illustrations, and mobile journey.
- Static link, local-asset, document-ID, ARIA-reference, single-H1, JavaScript syntax, JSON-LD, sitemap, and font-family checks.

Lighthouse and real-device testing were not run. Registration, product access, a verified contact channel, and an official Pangeabuy destination still require real supplied endpoints. No deployment or repository push is part of this local implementation.
