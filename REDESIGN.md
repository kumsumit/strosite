# Positioning redesign — 6 November 2026

## Audit and editorial decisions

The existing source was inspected before changes: homepage, scripts, shared CSS, local assets, README, design notes, and both legal pages. The public URL could not be retrieved by the web tool; the computer/browser host was unavailable and Safari access timed out. This is a source-based audit, not a claim of complete live-site inspection.

Retained: supplied Stromule and Pangeabuy logos, six original business SVG illustrations, green/teal/blue identity, Poppins and Aref Ruqaa Ink, shared spacing and typography conventions, sticky header, accessible mobile menu, native FAQ disclosures, informational availability/contact dialogs, footer, and legal pages. Existing illustrative controls were not actual product functionality.

Removed/consolidated: “Organisation is for every business,” the scattered/organised record interaction, duplicate desktop/mobile record mockups, merchant journey tabs and steps, “A clearer working day,” “The life of a useful business record,” generic discovery/growth explanations, and the repetitive closing invitation. Their useful context is now in the problem, operating progression, business profiles, and ecosystem sections. `content.js` is retained as historical source but no longer loaded; its journeys and associated legacy CSS are unused. Shared CSS remains intact to protect legal layouts.

Rewritten: hero, business problem, product introduction, business profiles, Stromule/Pangeabuy relationship, trust/control, onboarding, all FAQs, footer and SEO metadata. New: Business Copilot concept, grouped operations catalogue, offline conditions, adoption alongside existing tools, and a human-centred experience section. The initial redesign reduced homepage text from approximately 2,242 to 1,840 whitespace-separated words including metadata/UI text; subsequent competitive-positioning additions are documented in [COMPETITIVE_POSITIONING.md](COMPETITIVE_POSITIONING.md).

Positioning: an Intelligent Business Operating System designed to connect operating, understanding, prioritizing and acting. Records support the operating experience. Pangeabuy is a separate Connected Commerce Network; authorized connection is a vision, not a live integration claim.

## Claim classification and evidence

No product feature is classified as **Available**: code presence and existing tests do not establish public release readiness. The available artifact is this informational website. No new backend, waitlist, contact address, registration, price, launch date, customer proof or supported-country claim was invented.

| Claim | Website classification | Repository evidence / limitation |
| --- | --- | --- |
| Catalogue, stock, movements, locations/warehouses, inventory CSV import | In development | `apps/stromule/lib/features/inventory/` contains screens, CSV parser/import flow and location/position models; corresponding tests exist under `apps/stromule/test/`. Tests were inspected as evidence, not run as part of this website change. |
| Billing, quotations, sales, purchases, purchase orders, returns | In development | Billing and purchases feature code; `server/src/commerce/trade.rs`, `procurement.rs`, `receipts.rs`, and commerce tests. No public product access verified. |
| Customers, suppliers, credit/outstanding and transaction records | In development | Customer/supplier feature code, commerce records, supplier synchronization, commerce trade code. No complete accounting claim. |
| Employee management, attendance, leave, roles/permissions, payment reminders | In development | Workforce/team/payment_reminders features; `server/src/commerce/workforce.rs`, `custom_roles.rs`, `authorization.rs`. No operational delivery guarantee for reminders. |
| Sales/inventory summaries and connected business activity | In development | `server/src/commerce/dashboard.rs` reads server-calculated snapshot totals. This is not evidence of profit analysis or predictive intelligence. |
| Offline billing, locally available data, offline transaction recording, secure sync, conflict handling, recovery | In development, requiring validation | Local stores and sync code exist; `commerce_repository.dart` handles snapshot revisions and pending state, `server/src/commerce/sync.rs` stages encrypted chunks. These do not establish durable offline transaction queues, complete offline billing, recovery guarantees or all-feature offline support. |
| Copilot questions, recommendations, replenishment insights, assisted drafts/tasks, generalized approvals | Vision | No verified working Copilot found in source search. Conversation is explicitly a concept; no working input or fake AI result. No accuracy claim. |
| Inventory intelligence, outstanding analysis, Business Pulse | Vision | Summary totals are not evidence of these broader capabilities. |
| Excel and broader data migration | Vision beyond inventory CSV work | CSV import source exists; no direct workbook/general migration claim. |
| Accounting coexistence | Intended adoption approach | Tally named only as an existing tool; no connector, automatic reconciliation or live data exchange claim. |
| Adaptive business-specific experiences, gradual adoption, wider integrations | Vision | Audience profiles are examples of fit, not shipped vertical products. |
| Pangeabuy discovery/commerce, connected orders, payments, fulfilment | Vision; availability unconfirmed | Product direction supplied by brief. No end-to-end integration or independently usable release verified. |
| Controlled sharing/integrations, auditability, transparent AI actions | Design principles / Vision | Permission code exists; that does not establish complete audit, AI transparency or all sharing controls. |
| Touch-first controls and adaptive panels | In development | `core/platform/platform_controls.dart` includes minimum 48×48 buttons; `adaptive_presentation.dart` adapts touch sheets and desktop dialogs. Full workflow/device validation is outstanding. |
| Stylus input, handwriting, voice assistance | Vision | No dedicated implementation found in targeted Dart/dependency searches. OS-level text input is not evidence of integrated product support. |
| Global ambition | Vision | Country, currency and timezone catalogue code does not establish country support, localization, compliance or launch coverage. |

Product team confirmation is needed for release readiness, registration/access URL, public contact and privacy contact, pricing, launch timing, countries, currencies, languages, offline device/recovery/conflict testing, Copilot implementation and action permissions, imports, Tally/integration scope, independent Pangeabuy access and its public URL, consent/sharing behavior, ordering, payments, fulfilment, audit trails, and business-specific workflows. Input-device support, handwriting/voice scope and privacy behavior also require confirmation. Until confirmed, retain the conservative wording and status labels. See [COMPETITIVE_POSITIONING.md](COMPETITIVE_POSITIONING.md) for official-source analysis and the four strategic distinctions.

## Validation

- Passed JavaScript syntax checks for homepage and shared navigation scripts. A Node VM with a minimal DOM harness also passed menu open/focus, Escape, navigation/outside-click dismissal, both informational notices, dialog close buttons/backdrop bounds, and copyright updates. This does not verify native browser focus trapping, rendering, or keyboard behavior.
- Passed static checks across homepage, privacy and terms: local links/assets exist, cross-page fragments resolve, IDs are unique, each page has one H1, and JSON-LD parses. Homepage has all 11 requested FAQs.
- Homepage script removes the old journey/record DOM dependencies; core content and FAQ remain usable without JavaScript. Dialogs only provide information.
- Responsive CSS reviewed at desktop, tablet and mobile breakpoints (1150, 940, 680, 360px): grid columns collapse, all flexible grid tracks use `minmax(0,1fr)`, preview/sidebar reduce, commerce flow stacks, and small-screen steps become a single column. Existing menu and reduced-motion behavior retained. This is source inspection, not rendered viewport verification.
- Browser QA, keyboard interaction in a real browser, overflow measurement, desktop/mobile screenshots, real-device tests and Lighthouse could not be completed because browser access was unavailable. Do not treat source review as a rendered responsiveness pass. Run those checks before publication.
- No dependencies introduced. No publishing, git commit, push, or production deployment performed. Existing GitHub Pages workflow retained.
