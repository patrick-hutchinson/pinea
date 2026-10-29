# Membership gift coupons

## Implementation

The site uses the Pages Router. Two independent App Router handlers have been
added alongside it; there is no migration of existing pages:

- `src/app/api/webhooks/shopify/orders-paid/route.ts`: verifies the exact raw body,
  acknowledges with 200, then processes via Next.js `after()`.
- `src/app/api/gifts/redeem/route.ts`: signed gift link with an explicit confirmation
  button. Creates a Storefront cart with the subscription variant, selling plan,
  and discount, then redirects to Shopify checkout only if both are applied.

Shopify's documented legacy cart permalinks do not support selling plans, so the
email deliberately uses this redemption handler instead of `/cart/...?...selling_plan=...`.
No order, subscription, payment, or customer is created by opening the email link.
The recipient completes Shopify checkout using their own customer/payment details.

The gift product itself must be a **one-time purchase**. Only `GIFT_VARIANT_ID`
triggers the handler. Line item properties are `Recipient email`, `Recipient name`,
and `Message`, matched without case sensitivity. No recipient email means send to
the buyer. If buyer and recipient emails are identical, one email is sent.
The webhook is backend-only: it does not add recipient input fields to the shop UI.
Until these properties are collected by the storefront, delivery falls back to the buyer.

## Environment variables

Set in the deployed webhook host's server environment, never `NEXT_PUBLIC_*` for secrets:

| Variable | Value |
| --- | --- |
| `SHOPIFY_WEBHOOK_SECRET` | Signing secret for the actual webhook subscription. Admin-created webhook subscriptions can use a different secret from app-managed ones. |
| `SHOPIFY_ADMIN_TOKEN` | Admin API access token. Existing client credentials or legacy Admin token variables also work. This is not the client secret. |
| `SHOPIFY_STORE_DOMAIN` | The store's `name.myshopify.com` domain. |
| `GIFT_VARIANT_ID` | Numeric gift variant ID or full ProductVariant GID. This version maps one gift variant to one membership. |
| `MEMBERSHIP_PRODUCT_ID` | The subscription product to discount, numeric ID or Product GID. |
| `MEMBERSHIP_VARIANT_ID` | Membership variant for redemption, numeric ID or ProductVariant GID. |
| `SELLING_PLAN_ID` | Its selling plan ID, numeric or SellingPlan GID. |
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

The code creates discounts and sends emails only. Refund-driven code revocation,
multiple gift-to-membership mappings, and coupon storefront input UI are not included.

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
