# Interactive website architecture

The existing website was buildless HTML/CSS, not React. This upgrade retains its routes, semantic sections, metadata, legal pages and informational dialogs. React 19 + TypeScript is a progressively enhanced hero island, bundled with esbuild. The Python public-artifact builder remains in use.

## Build and preview

Run `npm ci`, `npm run check`, then `python3 -m http.server 8000 --directory _site`. The build pre-renders `Dashboard` into the marked range in `index.html`, hydrates it in the browser and writes split bundles into `assets/interactive`. Keep the pre-rendered HTML in source control; generated bundles and `.build` remain ignored. Both GitHub workflows install from the lockfile and build the island before the existing Python build. Source-only Python builds require already-generated interactive assets.

## Ownership

- `src/animation/config.ts`: timing, easing, distances and stagger tokens.
- `primitives.tsx`: reveal, stagger, scroll progress, device detection and magnetic button. Motion owns these transforms.
- `SectionReveals.tsx`: one shared Motion observer implementation for section introductions, capabilities, categories, ecosystem and final CTA. Text remains visible before observation.
- `ScrollStory.tsx`: lazy GSAP + ScrollTrigger timelines with `useGSAP` cleanup. Uses existing CSS sticky layout; no extra pinning or scroll interception. Desktop only, with live reduced-motion media-query cleanup. Motion does not animate these chapter elements.
- `Dashboard.tsx`: keyboard-accessible tabs, sample sale/reset and progressive enhancement. All records are explicitly illustrative. No operations, messages or payments occur.
- `DashboardDepth.tsx`: lazy Three.js/R3F desktop layer and Drei rounded geometry, demand rendering, capped DPR, low-power GPU preference and no downloaded assets. Reduced motion, touch, small screens and Save Data retain the HTML preview. Error boundary preserves the preview on WebGL failure.
- `experience.js`: retains only offline and Copilot demo interactions; the old hero/progress/story handlers no longer run. `scene.js` remains archived in the repository but is no longer loaded.

Heavy code loads only near its section. Drei uses a direct helper import so unrelated video/vision chunks are not emitted. The 3D layer is optional decoration, not a source of product text. There are no idle frame loops. Controls for depth are hidden on smaller devices. Script-free HTML retains product content; JavaScript-specific controls appear only after enhancement.

## Content boundaries

Stromule remains in development. Availability, pricing and contact disclosures are preserved. No testimonials or adoption numbers were invented. No approved `.riv` asset is present, so a Rive runtime and placeholder illustrations were deliberately omitted; add a lazy scene only when an approved animation contributes to a workflow. No GLB/GLTF files are needed for the procedural scene.

## Verification

TypeScript, production build, metadata/schema, crawler rules, image attributes and local-link checks run through `npm run check`. Build logs print raw and gzip sizes; `.build/bundle-report.json` records the complete module graph. Browser verification and its limits are recorded in the README. Real-device testing and a production Lighthouse/axe audit remain release tasks; local browser checks are not substitutes for those measurements.

## Interactive shop simulation

`BusinessStudio.tsx` replaces the old static dashboard below the hero with original animated SVG artwork: a stockroom, moving rice bags, cashier and customer, printed itemized receipt, payment token, supplier delivery van and connected business records. Motion controls each SVG group and record transition. This is a custom vector/state-machine implementation, with no Rive runtime or binary asset requirement.

`businessModel.ts` defines a six-phase sale (setup, basket, bill, stock, account, report). Quantities are bounded and locked after starting. The stock, credit balance, report and invoice count derive from the same state; advancing beyond completion cannot duplicate the sale. Supplier receiving is idempotent. Paid and credit sales produce different account outcomes. Attendance affects the illustrated operator, and reminder creation produces an unsent reviewable draft. `npm test` checks these invariants and runs in CI.

Playback offers play/pause, next step, replay and reset. Automatic progression pauses when the scene is outside the viewport or the document is hidden. Reduced motion removes travel and transition effects; manual stepping remains available. The entire scene is pre-rendered; its small interactive chunk loads within 400px of the viewport. Controls appear only after the scene hydrates. No new dependencies were added for the simulation.

Verified in the browser: three-bag credit sale (42 → 39 bags, ₹14,200 → ₹15,970 balance, ₹26,620 sales, 33 invoices); supplier delivery (39 → 47 bags); reminder draft, attendance, automatic paid-sale completion, pause and reset. Narrow-screen overflow checks passed at 320px and 390px.
