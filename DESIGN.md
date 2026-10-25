# Design direction

## Reference study

Reviewed on 25 October 2026:

- [Linear](https://linear.app/homepage): organizes the explanation around stages of product development and pairs descriptions with concrete examples. Applied here as a progressive request → context → handoff → clarity story.
- [Plane](https://plane.so/): names the kinds of work the product supports and places examples close to the explanation. Applied here through everyday business language and an interactive relationship map.
- [Attio](https://attio.com/): uses specific scenarios and a progression through related activities to explain the platform. Applied here as a single customer-request example rather than a generic feature grid.

These are editorial and interaction references. Stromule does not claim those products' capabilities, integrations, customer proof, or availability. Their layouts, assets, and copy are not reused.

## Identity

The supplied `app/logos/logo.png` is the source of the website logo and favicon family. It is trimmed only around transparent padding and resized with Lanczos sampling. Its colors and shape are preserved. No synthetic replacement logo is used.

Poppins is the reading and interface font. Aref Ruqaa Ink is used for selected headline phrases and margin annotations. These are the only requested font families; generic platform fallbacks apply if the external fonts cannot load.

Warm paper, deep green ink, and pale botanical green backgrounds reflect the supplied mark. Body text is darker than the original design to maintain readable contrast. Information and interaction states use labels, borders, and shapes as well as color.

## Content-driven interactions

- The hero compares scattered and connected relationships. Selecting a business area changes an explanatory caption and highlights its connection. Curves are calculated from actual element positions and follow moving nodes.
- The everyday-work example offers a shop order, a service booking, and a team job. Each follows the work, details, person, and next step. Changing examples resets the story. Previous/next controls, a progress bar, and tabs support self-paced exploration. Tabs support arrow keys, Home, and End. There is no timed advancement.
- Principle details expand using native accessible disclosures.
- Navigation follows the section in view; mobile navigation supports Escape.
- Scroll entrances are subtle and progressive. Reduced-motion preferences remove entrance movement, diagram transitions, and line animation. Content remains visible without animation.

All illustrations are labeled as concepts. No form or sign-up storage is implied. Contact remains an availability notice. Dedicated Privacy Policy and Terms & Conditions pages share the logo theme and the same two-font system; their wording covers the current informational site.

## Small-business language and international audience

The homepage uses everyday terms such as daily tasks, details, people, and next steps. It explains Business Operating System once in plain English. Examples avoid named software vendors, currencies, local date formats, region-specific regulations, and invented customer outcomes. Shops, service businesses, people working alone, and small teams can explore without entering data. Country coverage, languages, pricing, and availability remain explicitly unannounced. A practical FAQ answers those questions without suggesting the product is already available.

Scenario state was checked in a Node DOM harness: all 12 steps, selection resets, previous/next and restart actions, keyboard navigation, progress updates, and single-tab selection. Static checks cover links, assets, heading structure, ARIA references, and the two-font restriction. These checks do not replace rendered browser testing.
