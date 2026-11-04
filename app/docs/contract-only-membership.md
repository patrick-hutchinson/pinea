# Customer Account API membership access

Profile and protected resources query customer.subscriptionContracts using the
signed-in customer's access token. They do not use the custom backend app's Admin
API contract lookup, customer metafields/tags, paid order history, or a membership
snapshot in a login cookie. No Flow or provider integration has been added.

## Required permissions

There are two distinct scope layers:

1. OAuth requests `openid email customer-account-api:full`. These belong in
   SHOPIFY_CUSTOMER_ACCOUNT_SCOPES. The code includes all three even if the old
   environment value only contains openid email.
2. In Shopify's Headless storefront Customer Account API permissions, configure
   customer_read_customers and customer_write_subscription_contracts. The latter
   grants access across subscription-contract owners and is only available to
   Hydrogen/Headless storefronts. Although called write, this implementation only
   executes read-only queries. Shopify's current table does not list a broader
   read-only subscription scope.

The *_own_subscription_contracts scopes are app-limited. They are not equivalent
to the Headless all-contract customer permission. Changing Admin scopes alone is
not enough. SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID must identify that Headless customer
client, not the backend/Admin API app. Sign in again after changing permissions.

Sources:
[Customer access scopes](https://shopify.dev/docs/api/usage/access-scopes#customer-access-scopes),
[Shopify's Headless exception explanation](https://community.shopify.dev/t/recommended-pattern-for-non-subscription-apps-to-detect-active-subscriptions-created-by-shopify-subscriptions/32590),
[OAuth and refresh](https://shopify.dev/docs/api/customer/latest).

## Credentials

The signed identity cookie stores identity only. Access/refresh tokens are kept
in a separate AES-256-GCM encrypted, HttpOnly, SameSite=Lax cookie, Secure in
production, using a context-specific key derived from AUTH_SESSION_SECRET.
They are never returned in React props, JavaScript-readable cookies, logs or
diagnostics. Token sets are bound to the customer ID and OAuth client ID. Logout
removes both cookies. Rotating AUTH_SESSION_SECRET invalidates old credentials.

The previous code discarded the token after login, so existing sessions must sign
in once more. Their old active/tier flags cannot grant access.

## Status and freshness

- ACTIVE grants access. Prefer an active Member Plus contract if several are active.
- PAUSED, CANCELLED, FAILED, EXPIRED, STALE and unknown statuses do not grant access.
- A payment retry does not revoke access while the contract itself remains ACTIVE.
- API, permission, network, identity or incomplete-pagination errors deny access,
  but display verification unavailable instead of claiming no active subscription.
- A successful empty response is reported as returned; no alternate source is used.

Each protected page load and protected API request performs a fresh no-store query.
There is no membership-status TTL or process-wide membership cache. Contract and
line connections are fully paginated, with repeated/missing-cursor guards. The
returned customer ID must match the authenticated identity.

An open profile rechecks every 60 seconds while visible, and on focus or return to
visibility. This refreshes the UI; upload/event APIs always independently query
Shopify before granting access. Already downloaded content cannot be revoked.

Expired/expiring tokens refresh on the server if Shopify issued a refresh token.
Rotated credentials are saved back to the encrypted cookie. A 401 can trigger one
refresh and retry. Missing/failed refresh requires sign-in again, with no stale
positive fallback. Parallel refreshes on separate server instances may require
reauthentication if Shopify rejects a rotated refresh token.

## Live verification

After deploying, log out and sign in again as a real subscriber, then visit:

https://preview.pinea-periodical.com/api/auth/shopify/subscription-status?debug=1

This authenticated endpoint only inspects that customer's own contracts. The
private/no-store JSON includes HTTP status, Shopify request ID, GraphQL errors
(message/path/code), and the actual queried data for each contract/line page.
No access or refresh token is included. Without debug=1, upstream diagnostics are
omitted; the profile uses this smaller response for periodic checks.

If nodes=[], report that exact result with the Headless permission configuration
and customer ID. If ACCESS_DENIED is returned, report the error path/code. Do not
claim a real subscriber test succeeded merely because mocked tests pass or because
Shopify's hosted account page can see the contract.

The current local OAuth redirect is configured to the preview callback. Testing
new code with a real customer therefore requires deployment plus a fresh sign-in,
or a registered local callback accepted by Shopify. Existing production auth flags
have not been changed; this site's current auth feature is enabled on preview/local.

## Historical fields and migration

custom.subscription_status, custom.subscription_tier, custom.subscription_start_date
and custom.membership_paid_through are not used to grant access. Tier and dates come
from the returned contract's lines, createdAt and nextBillingDate. Migration CSV
dates remain billing-follow-up metadata; this query path does not change billing.
For the profile's "member since" text, the first upcoming cycle's valid
billingAttemptExpectedDate (unless skipped) takes precedence over the contract's
nextBillingDate, which can remain unchanged after rescheduling a cycle. The
effective billing date minus one calendar year is displayed (February 29 clamps
to February 28); missing/invalid billing dates fall back to createdAt. This date
advances on renewal. Original contract dates and billing remain unchanged.
The separate, read-only upcoming-cycle lookup includes edited/skipped flags in
diagnostics. Failure of this display-only lookup falls back to nextBillingDate
and does not revoke access verified from the contract status. Diagnostics expose
both raw and effective billing dates and any cycle lookup error.
The checkout-link preparation script uses the tier in member-discounts.csv.

After a real subscriber lookup is verified, remove obsolete Flow writers and the
old customer fields after checking other consumers. No live fields or contracts
were deleted by this change.

## Tests

From app with Node 22:

```sh
npm run test:member-access
npm run test:membership-newsletter
npm run test:gifts
npm run build
```
