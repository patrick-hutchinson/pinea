# Membership gift coupons

## Delivery troubleshooting

Both webhook URLs run the same signature-verified POST handler, without a redirect:
`/api/webhooks/shopify/orders-paid` and the legacy
`/api/shopify/webhooks/orders-paid`. Register only one subscription per event/host.
Both language templates are explicitly included in the serverless function bundle.

Search the receiving deployment's runtime logs for `[membership-gift]` and the
numeric order ID. `Webhook accepted` proves the request reached and passed the
handler; it logs variant IDs and quantities, not recipient details. A result of
`ignored` means none of the one-time line variants matched the configured gift
variants. `not_paid_or_cancelled` means the Admin order lookup was not eligible.
Failures log their processing stage plus allowlisted diagnostics (missing variable
name, upstream HTTP status, missing runtime file), never raw provider errors or
email/message content. Inspect Resend delivery events if processing completed but
the recipient has not received the message.

A 200 webhook response acknowledges receipt, not email delivery: processing happens
after the response. After fixing a failure, use the retry command below
instead of buying again. Persisted delivery state prevents re-creating codes and
skips recipient/buyer emails already recorded as sent. Do not clear that state.

## Retry an existing order

Requires Node 22.18+. Generate an independent secret with `openssl rand -hex 32`.
Set that same value as `GIFT_RETRY_SECRET` in the app's local `.env` and the target
Vercel deployment's environment (Preview while testing), then redeploy. Do not
prefix it with NEXT_PUBLIC or put it in a URL. The retry endpoint is disabled if
this secret is absent or shorter than 32 characters. It accepts only authenticated
POST requests and returns private/no-store JSON. No Shopify webhook settings change.

Run from the `app` directory:

```sh
# Read-only check: no discounts, writes, alerts or recipient emails.
npm run gifts:retry -- 17986702049629 --url https://preview.pinea-periodical.com

# Explicitly resume code creation and pending emails for that order.
npm run gifts:retry -- 17986702049629 --url https://preview.pinea-periodical.com --send
```

Use the numeric ID from the Shopify order URL, not its display name such as #1025.
The command also accepts a full Shopify Order GID. It loads all order lines with
cursor guards, keeping their original IDs and recipient/message/language properties.
It refuses changed/refunded line quantities, unpaid/cancelled orders and active
processing leases. The processor independently rechecks paid status and acquires
its existing compare-digest lease before any code/email work. Completed orders
return `already_processed`; this is not a force-resend tool. Other results include
`dry_run`, `completed`, `already_running`, `not_paid_or_cancelled`, and `ignored`.

Both modes require working Admin API credentials on the target app. The read-only
mode checks access and reports existing delivery flags, not the deliverability of
future emails. Errors return their safe reason and stage directly in the terminal;
runtime logs use `[membership-gift] Manual retry`. Codes and recipient details are
not returned. The POST waits for processing rather than acknowledging early.

On `shopify_access_denied`, the authenticated retry response also includes
`adminAccess`: the app ID/title, granted installation scopes, auth mode, and the
name (never value) of the credential environment variable actually selected.
This distinguishes configured-but-unapproved scopes from credentials belonging
to another app. Current precedence is SHOPIFY_ADMIN_TOKEN, then client credentials
(including the historical Customer Account credential fallback), then the legacy
static-token aliases. Setting a legacy token alias does not override an existing
client-credentials pair. Check diagnostics before changing credentials or scopes.

Do not repeatedly retry on a timeout without checking logs/state first. Existing
Resend idempotency keys remain unchanged. A network timeout can leave processing
running, and a hard termination may require waiting for the ten-minute lease.
Vercel deployment protection must permit the command; an HTML/auth response is not
a gift-processing error. Do not disable production protection just to run a retry.

## Implementation

The site uses the Pages Router. Two independent App Router handlers have been
added alongside it; there is no migration of existing pages:

- `src/app/api/webhooks/shopify/orders-paid/route.ts`: verifies the exact raw body,
  acknowledges with 200, then processes via Next.js `after()`.
- `src/app/api/gifts/redeem/route.ts`: signed gift link that redirects directly on
  GET, matching offline-member redemption. Creates a Storefront cart with the subscription variant, selling plan,
  and discount, then redirects to Shopify checkout only if both are applied.

Shopify's documented legacy cart permalinks do not support selling plans, so the
email deliberately uses this redemption handler instead of `/cart/...?...selling_plan=...`.
Email scanners can now create unused carts by opening the link; no order,
subscription, payment, customer, or completed code redemption is created merely
by opening it. Old POST confirmation forms remain compatible.
The recipient completes Shopify checkout using their own customer/payment details.

The gift product itself must be a **one-time purchase**. Its configured gift variants
trigger the handler. Line item properties are `Recipient email`, `Recipient name`,
and `Message`, matched without case sensitivity. No recipient email means send to
the buyer. If buyer and recipient emails are identical, one email is sent.
The gift product page uses the restored membership/region selector and animated
recipient email/message form. It adds the selected gift variant as a one-time cart
line, with `Recipient email` and `Message` as line-item attributes. Shopify passes
these through checkout to the webhook. The message appears in the recipient's gift
email HTML template, preserving line breaks and escaping HTML. Orders from other
channels without a recipient email still fall back to the buyer.

The current gift-product variants are built into the application, so their checkout
targets do not require environment variables:

| Gift option | Gift variant ID | Redeemed membership option |
| --- | ---: | --- |
| Student / AT | `66150176620893` | Student / AT |
| Student / EU | `66346106421597` | Student / EU |
| Member / AT | `66150189302109` | Member / AT |
| Member / EU | `66346106487133` | Member / EU |
| Member / WORLD | `66346106519901` | Member / WORLD |
| Member Plus / WORLD | `66346106585437` | Member Plus / WORLD |

## Environment variables

Set in the deployed webhook host's server environment, never `NEXT_PUBLIC_*` for secrets:

| Variable | Value |
| --- | --- |
| `SHOPIFY_WEBHOOK_SECRET` | Signing secret for the actual webhook subscription. Admin-created webhook subscriptions can use a different secret from app-managed ones. |
| `SHOPIFY_ADMIN_TOKEN` | Admin API access token. Existing client credentials or legacy Admin token variables also work. This is not the client secret. |
| `SHOPIFY_STORE_DOMAIN` | The store's `name.myshopify.com` domain. |
| `GIFT_VARIANT_ID`, `MEMBERSHIP_PRODUCT_ID`, `MEMBERSHIP_VARIANT_ID` | Optional legacy mapping for an additional, older gift product. The six current Student, Member, and Member Plus gift options are built into the application and do not need these variables. |
| `SELLING_PLAN_ID` | Optional override for the current built-in annual selling plan (`690977046877`). Set this only when a future membership plan uses a different selling plan ID. |
| `GIFT_CYCLES` | Positive billing-cycle count. **For an annual subscription, 1 means one year; 12 means twelve annual billings.** Zero is rejected because Shopify interprets it as indefinite. |
| `RESEND_API_KEY` | Resend sending key. |
| `ADMIN_EMAIL` | Address for operational failure alerts. |
| `GIFT_MEMBERSHIP_EMAIL_FROM` | For example `P.IN.E.A <hello@mail.pinea-periodical.com>`, using a verified Resend sending domain. |
| `GIFT_MEMBERSHIP_CLAIM_BASE_URL` | Public HTTPS origin hosting the new redemption route, e.g. `https://preview.pinea-periodical.com` while testing. |
| `GIFT_LINK_SECRET` | Recommended independent stable secret for signing redemption links; falls back to `SHOPIFY_WEBHOOK_SECRET`. Rotating the signing secret invalidates old links. |
| `SHOPIFY_SUBSCRIPTION_MANAGEMENT_URL` | Existing direct subscription-management page URL. Otherwise email uses the Shopify account URL. Configure the direct page so recipients can find cancellation. |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Existing Storefront token, needed to create the redemption cart. |
| `GIFT_SHOPIFY_API_VERSION` | Optional; defaults to `2026-10`. Existing subscription lookups keep their own API version. |

The email explains the number of free billing cycles and automatic renewal. It does
not invent a first-charge calendar date before the recipient redeems: that date
depends on their checkout and selling plan. The 100% product discount does not cover
shipping. Checkout must be tested to confirm the plan's payment-method collection
and renewal terms, especially for prepaid plans.

## Shopify webhook and scopes

Create one **Order payment / `orders/paid`** webhook with JSON payload and URL:

```text
https://YOUR-APP-HOST/api/webhooks/shopify/orders-paid
```

For app-managed webhook configuration, the topic enum is `ORDERS_PAID`; subscribe
using API version `2026-10`. Configure the corresponding signing secret in the app.
Do not subscribe the same handler twice using both Admin and app-managed settings.

The Admin app needs:

- `read_orders`: read the order and gift metadata.
- `write_orders`: save the order's gift metadata and processing lease.
- `read_discounts`: recover an already-created code after an interrupted request.
- `write_discounts`: create the subscription discount.

No subscription contract write scopes are required. Recurring membership lifecycle
is owned by Shopify after redemption. Existing customer-reading scopes for profile
access remain as before. The Storefront token needs its existing product and cart
permissions (`unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`)
and access to the product/selling plan through its sales channel.
Orders older than Shopify's normal 60-day access window require approved
`read_all_orders` for manual webhook reprocessing. Redemption itself does not read
the original order, so a still-valid coupon link remains usable after that window.

## Idempotency and failures

- `gift.discount_code` contains the first created code for easy Admin lookup.
- `gift.delivery_state` is JSON with **all** codes, one per line-item unit, the frozen
  subscription IDs/cycles, and individual recipient/buyer email send statuses.
- Random codes are persisted before discount creation. A replay reuses them.
  A discount lookup recovers a successful create whose response was lost.
- Shopify metafield compare-and-set (`compareDigest`) reserves a ten-minute lease
  atomically. Concurrent webhook deliveries cannot reserve different codes.
- A completed state, or a legacy `gift.discount_code` with no delivery state, stops
  processing. An incomplete state resumes unsent emails even if a code already exists.
  Blindly stopping whenever a code exists would lose emails after a mail failure.
- Resend idempotency keys include the order ID, line-item unit, and recipient/buyer
  role. Its 24-hour retention plus saved delivery markers reduces duplicates, but
  a send followed by a prolonged storage outage cannot guarantee exactly-once email.
- Failures log only order/webhook IDs and processing stage, then send an admin alert.
  Review both metafields and replay the signed Shopify webhook after fixing the issue.
  Partial successes are preserved; a failed lease release expires after ten minutes.
- `after()` uses the platform invocation lifetime, capped here at 300 seconds.
  Returning 200 means Shopify considers delivery successful: **there are no automatic
  Shopify retries for a later processing failure**. Admin alerts and manual replay
  are the recovery mechanism requested here. A hard process termination can prevent
  even the alert; monitor Vercel function failures. For higher volume or stronger
  delivery guarantees, replace the background callback with a durable queue.

The code creates discounts and sends emails only. It supports separate AT, EU, and
WORLD gift variants, including mixed regional gift lines in one paid order.
Refund-driven code revocation and coupon storefront input UI are not included.

## Testing

Use Node.js 22.18+ to run the TypeScript tests without installing a test runner:

```sh
npm run test:gifts
```

Tests use in-memory persistence/mocked adapters and do not create Shopify discounts
or send emails. Deploy with test credentials and use a Shopify Payments test order
for the full end-to-end check. Verify the discount is subscription-only, finite, and
single-use; test quantity > 1, replay, recipient fallback, buyer copy, and cancellation.

References:
- https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks
- https://shopify.dev/docs/api/admin-graphql/latest/mutations/discountCodeBasicCreate
- https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsSet
- https://nextjs.org/docs/app/api-reference/functions/after
- https://resend.com/docs/dashboard/emails/idempotency-keys
