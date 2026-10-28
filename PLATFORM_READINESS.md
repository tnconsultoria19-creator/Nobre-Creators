# Nobre Creators — platform audit and production readiness

Last reviewed: 28 October 2026

## Current implementation

| Area | Current status | Notes |
|---|---|---|
| Public homepage | Implemented | Hero, compact 10-card creator grid, service cards, numbered opportunities, Premium portfolio, advertising, newsletter. |
| Creator profiles | Implemented in UI and D1 API | Public creator records load from D1 when configured; the public fallback uses sample profiles. The profile panel is wider and supports portfolio, bio, contact links and pricing information. |
| Account registration/login | API and UI implemented | Public roles are creator and brand. Admin role is never offered by public registration. Sessions are cookie-based and passwords are PBKDF2-hashed. Rate limiting still needs Cloudflare configuration. |
| Creator Studio | Implemented against API | Profile editor, avatar/cover selection, upload library, private assets, deletion, archive for listed products. |
| Uploads/storage | Code implemented; R2 provisioning required | Images, audio, video, PDF and ZIP are supported up to 50 MB per upload. R2 keys are private; access is checked by the Worker. Use presigned/resumable uploads for larger videos before a large public launch. |
| Digital catalogue | Implemented against D1/R2 | Creators can publish priced downloads, videos and lessons. Paid orders unlock the correct asset. |
| Cart and checkout | Implemented | Multi-item cart produces one order and payment notice. Supported options are Multicaixa Reference and MCX Express request. |
| Payment status | Implemented at API level; merchant onboarding required | Provider callbacks check the invoice amount/reference before marking an order paid. Never set an order to paid manually from the browser. |
| PDF | Implemented as payment notice | Customer can download a PDF with invoice/order number, amount, due date and Multicaixa details when issued. It is explicitly not a certified fiscal invoice. |
| Creator Premium | Implemented at API/UI level | Premium checkout is priced by the PREMIUM_PRICE_AOA setting. The public three-card portfolio only includes active Premium profiles that have a selected cover image. |
| Opportunities/jobs | Implemented against D1 | A logged-in brand can publish a job by category; authenticated network posts are stored centrally. When D1 is unconfigured, network posting returns an error rather than accepting unauthenticated submissions. |
| Newsletter/magazine | API/UI implemented | Subscribers are saved in D1. Resend can send a welcome issue and admin-triggered magazine issue after sender credentials and the magazine URL are configured. |
| Admin overview | Implemented against API | Top-line counts come from D1. Some legacy verification/dispute panels in the wider admin screen still use demo state and need to be connected to real review/payment tables before operational use. |

## Data and service architecture

- **Cloudflare Worker:** same-origin API, role checks, cookie sessions, uploads/downloads, checkout, invoice/payment callbacks, jobs, newsletter.
- **Cloudflare D1:** accounts, profile metadata, assets, products, orders, order items, invoices, payment events, opportunities and newsletter consent.
- **Cloudflare R2:** private object store for uploaded media and saleable files.
- **ProxyPay/Multicaixa:** entity/reference issue for Multicaixa Reference; MCX Express payment request through the merchant's OPG/POS integration.
- **Resend:** magazine and subscription email delivery when configured.

The frontend build and TypeScript check are run by the repository's GitHub Actions workflow. Passing CI verifies code compilation/typechecking; it does not provision Cloudflare resources, validate merchant credentials, or substitute for end-to-end payment tests.

## Steps still required in the real Cloudflare account

1. Create the D1 database and R2 bucket, replace the placeholder database_id in wrangler.d1-r2.template.jsonc, and deploy that configuration as wrangler.jsonc. The current active wrangler.jsonc is intentionally left on the fallback Durable Object configuration because no real D1 ID or Cloudflare resource access was provided.
2. Apply migrations/0001_init.sql to the remote D1 database and check /api/health to confirm d1Configured and r2Configured are true.
3. Set PROXYPAY_MODE=sandbox, the merchant ProxyPay RPS API key, OPG token, POS_ID and callback secret. Keep test transactions in sandbox until the merchant confirms a valid reference and signed callback end-to-end.
4. Choose the actual Premium price in AOA and set PREMIUM_PRICE_AOA. The system leaves Premium checkout disabled while the value is 0.
5. Configure an authorised Resend sender and MAGAZINE_URL. A subscription can be stored without these, but the page will truthfully indicate that automatic delivery is not yet configured.
6. Register the owner account as a brand/creator. After confirming ownership, promote that account in D1 using the controlled SQL instruction in DEPLOYMENT.md. Do not expose admin registration publicly.
7. Run the test checklist in DEPLOYMENT.md with real test accounts and a merchant sandbox.

## Angola payments: important distinctions

- **Multicaixa Reference** yields an entity and reference number that can be shown on the PDF notice and used in supported Multicaixa channels.
- **MCX Express OPG** initiates a payment request using the configured merchant POS and the buyer's registered mobile number.
- A dynamic **QR code via the official EMIS Online Payment Gateway** is a separate merchant integration and is not yet implemented here. Do not promise QR generation until the merchant has the relevant GPO access and integration details.
- The generated PDF is an order/payment notice, not a legally certified fiscal invoice. A compliant invoicing/tax process is required before representing it as a fiscal invoice.

## Remaining product work before a broad public launch

1. Connect the legacy verification/dispute sections to D1 and build an auditable moderator workflow, including role-gated approval/rejection and event history.
2. Add customer-facing unsubscribe/consent management and email bounce handling before sending magazines at scale.
3. Add a full course curriculum model (course → modules/lessons), playback progress, resume position, captions/subtitles and creator analytics. Current video/lesson uploads are saleable single assets and playable in the buyer library; this is an MVP, not a complete Udemy-style LMS.
4. Add refunds, chargeback/dispute handling, payouts/commission accounting and reconciliation. Payment status and orders are implemented; those finance operations are not yet complete.
5. Add presigned/resumable uploads, upload progress, thumbnails/transcoding and configurable storage/size limits for larger course videos.
6. Add rate limiting and abuse monitoring on login, registration, upload, checkout and payment routes; test privacy/consent, backups and D1 recovery.
7. Complete end-to-end tests in Cloudflare with actual resources and sandbox credentials, then verify the live domain and mobile layout.

## Deployment instructions

Follow DEPLOYMENT.md and the D1/R2 configuration template. Never commit live merchant tokens, database credentials or email-provider API keys.
