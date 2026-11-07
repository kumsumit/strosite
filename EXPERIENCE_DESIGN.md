# Stromule: one sale, many movements

## Reference study — 7 November 2026

The research is a selective study of notable creative websites, not a claim to have surveyed or ranked every award winner. Award pages on awwwards.com timed out in this environment. Award information was cross-checked against available primary sources. Current live sites can differ from their awarded versions.

| Reference | Evidence and observation | Stromule adaptation |
| --- | --- | --- |
| [Lusion](https://lusion.co/), [studio approach and awards](https://lusion.co/about/) | The studio describes a combined design, motion, 3D and development practice and lists Awwwards/FWA Site of the Year recognition. Its readable page describes immersive work and a progression from hero to reel, projects and studio philosophy. Live browser inspection reached the WebGL loader; a full visual walkthrough was not verified. | A single product-specific visual idea, an editorial introduction and a deliberate progression into explanatory chapters. |
| [Igloo](https://www.igloo.inc/), [Awwwards' award announcement](https://www.linkedin.com/posts/awwwards_we-are-thrilled-to-announce-that-the-winners-activity-7307431367728861187-ED07) | Awwwards' own announcement identifies Igloo as Site of the Year and Developer Site of the Year for 2024. Browser inspection showed a monochrome dimensional igloo, technical annotations, restrained corner typography and a scroll invitation. A scroll input changed the visual composition; this inspection did not establish the complete site's choreography. | One persistent visual explanation changes state alongside reading; numbered annotations connect the object to its meaning. |
| [Bruno Simon](https://bruno-simon.com/) | The author's own site explains a driveable portfolio and documents keyboard, touch and gamepad controls, quality options and the Three.js implementation. Browser inspection reached the introductory scene. The current site's complete game was not played. | Give visitors agency through meaningful controls: explore stock/ledger/people/insight, change a sample Copilot question, and toggle an illustrative network connection. |

## Design decisions

The central object is a receipt, not a decorative abstract shape. It connects to stock, customer records, people and the next decision. The original HTML/CSS and SVG scene remains the fallback. A locally vendored Three.js enhancement now renders the receipt and its connected objects as real 3D geometry; no reference artwork is copied.

The hero uses an asymmetric editorial composition and contrasting serif emphasis. The existing operational dashboard remains supporting context. A separate scroll story uses a sticky explanation on larger screens and four readable chapters; smaller screens present the story in normal document flow. No scroll interception, forced horizontal scrolling or custom cursor is used.

## Interaction and motion

- Four native buttons change the receipt scene, selected node, descriptive text and pressed state. The description uses a polite live region.
- The active desktop story chapter is selected by its position relative to the viewport center. Its sample metric, label, explanation, marker and orbit update together. The chapter observer does not announce changing text while reading.
- The offline switch changes an explicitly illustrative connection state. Local activity remains emphasized while synchronization waits. It performs no actual transactions or network synchronization.
- Copilot prompt buttons change a sample question, response heading and relevant evidence emphasis. These are authored examples, not generated recommendations.
- Sections reveal once as they enter the viewport. Fine-pointer movement adds a small perspective response to the receipt scene; keyboard focus and pointer exit reset it.
- The circuit animation pauses when its scene leaves the viewport. The page visibility handler pauses CSS animations, cancels scheduled frames and resets tilt while hidden, then schedules a refresh on return.
- Scroll work is coalesced into a requested animation frame. The scroll interface has no permanent render loop. The Three.js scene runs a separate frame loop only while visible, unpaused and permitted by motion preferences.
- A visible pause/resume control disables motion. `prefers-reduced-motion` also removes animation, tilt and reveal transitions. Reveals are enabled only after observer setup; content is visible when JavaScript is unavailable.

## Verification

Build, SEO/local-link checks and JavaScript syntax validation passed. Browser checks covered 320×568, 390×844, 600×960, 768×1024, 844×390, 1024×768, 1440×1000, 1920×1080 and 2560×1080 without document horizontal overflow. A desktop story layout issue found during visual inspection was corrected and checked again.

Verified in the browser: flow button state and description changes; chapter 03 selection and metric; circuit paused off-screen; pause/resume via click and Space; offline/online switch via click and Space; Copilot dues prompt; mobile menu opening and closing after navigation. No browser errors were recorded. System reduced-motion and hidden-tab behavior are implemented but were not independently exercised by changing operating-system preferences or forcing lifecycle events. Browser emulation does not replace physical-device or cross-engine testing.

Changes remain local; no deployment or external submissions occurred.


## Interactive 3D shop

The current hero is a low-poly neighbourhood shop with a customer and basket, shopkeeper, checkout counter, inventory shelves with rice bags, bottles and cartons, plus a supplier, delivery boxes and van. These are original procedural meshes; no external models are loaded. A floating sample bill appears when the visitor creates the illustrated sale. Transaction particles follow curved paths between entities instead of orbiting an abstract object.

The customer, shopkeeper, counter, shelves, bill, supplier and van are selectable through real Three.js raycasting. The same steps have native HTML buttons for keyboard and touch access. Clicks use a movement threshold to avoid treating vertical scrolling as selection; solid scenery occludes objects behind it. The primary action advances through four authored states, and Start Again resets the scene. There is no timed autoplay or real transaction.

Sample accounting is consistent: two rice bags at ₹590 each create a ₹1,180 bill; stock changes from 42 to 40. A sample supplier delivery of eight bags brings stock to 48. Stock labels, bill visibility, customer position, shelf items, delivery boxes and van position reflect the selected state. All records remain explicitly illustrative.

`scene.js` imports local Three.js 0.180.0 as the scene approaches the viewport. Desktop initialization uses 120 transaction particles and caps pixel ratio at 1.5. Small screens/data-saving connections use 60 particles, a 1.25 pixel-ratio cap and a render rate capped near 30 fps. Pointer movement adds restrained perspective. The existing pause/reduced-motion controls stop the frame loop; selecting a state while paused updates to its static end state. The DOM illustration remains available without WebGL or after context loss.

`node scripts/check_scene.mjs` runs the actual Three.js geometry with a mocked renderer. Tests cover finite particle simulation, entity creation, bill appearance, stock deduction, supplier delivery, reset, raycasting against actual meshes, scrolling gesture rejection, off-screen/hidden-page suspension, pause/resume, context loss, no-WebGL fallback and reduced motion. Browser QA separately verified GPU rendering, direct supplier selection, step progression by click and Space, stock labels, reset and mobile layout. Responsive checks passed at 320×568, 390×844, 768×1024, 844×390, 1024×768, 1440×1000 and 2560×1080 with no horizontal overflow or browser warnings/errors. Physical-device battery usage and cross-engine GPU performance remain unmeasured.
