# Nobre Creators — deployment and production readiness

## Architecture

- **Vite + React**: public landing page, creator profiles, creator studio, digital product catalogue and checkout.
- **Cloudflare Workers**: same-origin API, account sessions, access rules, purchase flow, invoice references and payment callbacks.
- **D1**: accounts, creator profiles, content metadata, products, orders, invoices, payment events, job opportunities and newsletter consent.
- **R2**: private creator uploads, portfolio media and downloadable files. The API authorizes every download instead of exposing the bucket.
- **Multicaixa / MCX Express**: ProxyPay Reference Payment System (numeric Entity + Reference) and Online Payment Gateway (MCX Express request by registered mobile number).
- **Resend**: optional magazine and newsletter delivery.

## First-time Cloudflare setup

The repository's current `wrangler.jsonc` remains a fallback deployment configuration used while Cloudflare resources are not yet provisioned. The D1/R2 production template is `wrangler.d1-r2.template.jsonc`. Do not deploy that template with the placeholder database ID.

From a machine with Node.js and Wrangler installed and authenticated to the correct Cloudflare account:

```sh
npx wrangler d1 create nobre-creators-db
npx wrangler r2 bucket create nobre-creators-media
```

Copy the D1 UUID returned by Wrangler into `wrangler.d1-r2.template.jsonc` as `database_id`, then save that configuration as `wrangler.jsonc` (keep a backup of the current config). Apply the schema and deploy:

```sh
npx wrangler d1 migrations apply nobre-creators-db --remote
bun install
bun run build
npx wrangler deploy
```

Cloudflare Pages/Workers builds must run `bun run build` before `npx wrangler deploy`. The generated static output is `dist/`.

## Secrets and variables

Set secrets with Wrangler (never commit real values):

```sh
npx wrangler secret put PROXYPAY_API_KEY
npx wrangler secret put PROXYPAY_OPG_TOKEN
npx wrangler secret put PROXYPAY_POS_ID
npx wrangler secret put PAYMENT_CALLBACK_SECRET
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put NEWSLETTER_FROM
npx wrangler secret put MAGAZINE_URL
npx wrangler secret put NEWSLETTER_ADMIN_TOKEN
npx wrangler secret put PREMIUM_PRICE_AOA
```

Some of the values above are numeric/provider identifiers but should still be added as secrets or environment variables in Cloudflare. Start with `PROXYPAY_MODE=sandbox`. Only switch to production after the merchant's ProxyPay/EMIS account is approved and sandbox verification is complete. The Online Payment Gateway needs a POS_ID assigned to the merchant. The Reference Payment System needs the merchant's own ProxyPay API key/entity setup. Set `PREMIUM_PRICE_AOA` to the actual Premium price in whole Angolan Kwanzas; `0` disables Premium checkout. Never use sample credentials from public documentation.

For Resend, `NEWSLETTER_FROM` must be an authorised sender in the Resend account and `MAGAZINE_URL` must be the published edition URL. Magazine distribution is initiated through the admin-only endpoint `POST /api/magazine/send` with an Authorization bearer token and JSON such as `{"title":"Edição 01","url":"https://...","subject":"Nobre Creators — Edição 01"}`.

## Accounts and admin setup

Public registration only accepts creator and brand accounts. After you register the owner account, promote it manually in the D1 console with `UPDATE users SET role = 'admin' WHERE email = 'YOUR_OWNER_EMAIL';` after verifying the address. Do not add a public admin-registration route or expose D1 access. Admin accounts must be promoted deliberately by an authorised operator. Enable Cloudflare rate limiting / WAF rules for `/api/auth/login` and `/api/auth/register` before production. Enable Cloudflare rate limiting / WAF rules for `/api/auth/login` and `/api/auth/register` before production.

## Uploads and downloads

The creator studio supports image, video, audio, PDF and ZIP assets up to 50 MB per request in the initial version. Video uploads over this size should move to a presigned, resumable R2 upload flow; don't increase the limit blindly. R2 keys remain private. Public portfolio visibility is controlled by the Premium flag in D1; downloadable products require a paid order before the file route permits access.

## Payment and invoice notes

For Angola, the implementation uses ProxyPay's documented reference endpoint for a **Multicaixa Entity + Reference** code and ProxyPay OPG for a payment request through MCX Express. A Multicaixa Reference invoice/PDF is only populated with a real entity/reference after an approved merchant API call. MCX Express requires the merchant POS_ID and customer phone. Dynamic QR payment through the official EMIS GPO is a separate merchant integration and is not yet implemented. The RPS callback signature is verified, payment events are idempotent, and the order is only marked paid after a matching provider event confirms the amount and reference. Missing merchant credentials leave the invoice pending; the portal must not simulate payment success.

The downloadable PDF generated by the storefront is an **invoice/payment notice** for the order, showing the payment status and the Multicaixa details when issued. Do not present it as a legally certified fiscal invoice. Connect an Angolan certified invoicing solution/accountant-approved process before issuing fiscal invoices.

## Test checklist before production

1. Run `bun run build` and `npx wrangler deploy` in a configured account.
2. Register one creator and one brand account; confirm that account roles cannot be escalated through public registration.
3. Upload a test PDF/video, confirm the R2 object and D1 metadata exist, then try downloading as owner, as a different user and while signed out.
4. Publish a low-price test material in ProxyPay sandbox, download the generated PDF notice, run the sandbox payment event and verify that the invoice changes to paid only after the signed callback.
5. Test failed/duplicate callbacks, mismatched amounts, expired sessions, invalid uploads and rate limiting.
6. Subscribe a test email, send a magazine test issue, and confirm unsubscribed contacts are excluded.
7. Test on a narrow mobile viewport and a slow connection.
8. Set a deliberate Premium price, confirm privacy policy, consent text, refund rules, commission rules, POPIA/privacy obligations for South African operations if applicable, and Angola invoicing/tax requirements with the appropriate professionals.

## Known production dependencies

Resource creation and merchant onboarding are account-side steps: the D1 database ID, R2 bucket, approved ProxyPay/MCX credentials, authorised email sender and magazine URL cannot be invented or checked into source control. The repository contains the integration code and setup template, but production payment/email delivery must be configured and tested with the actual merchant accounts.


## Operational limits of this first deployment

- The current direct upload endpoint is limited to 50 MB. Larger video courses should use R2 presigned/resumable uploads and background transcoding before public launch.
- Email delivery uses Resend if the configured sender and keys are valid. Subscriber consent is recorded in D1; opt-out/unsubscribe management still needs a customer-facing endpoint and link before large-scale newsletter distribution.
- The PDF is deliberately labelled as an *Aviso de pagamento* and should not be used as a certified fiscal invoice.
- Do not accept production payments until an actual sandbox order, signed callback, invoice status change, and post-payment download have passed end-to-end testing.
