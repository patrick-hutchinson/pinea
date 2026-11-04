# Contract-only membership access

The website no longer reads customer custom.subscription_status,
custom.subscription_tier or custom.subscription_start_date as membership signals.
custom.membership_paid_through was not used by access checks and remains unused.
Customer tags and membership snapshots saved in old login cookies cannot restore
access when the live lookup returns no active contract.

Profile membership, Member Plus status, member-only content and archive access use
the live contract's status and lines. Start date is the contract's createdAt,
not a historical date in a metafield or stale cookie. Migration dates still remain
in the migration CSV and checkout attributes; they are not an access entitlement.

The link preparation script now uses the tier already stored in member-discounts.csv,
not the old customer's subscription_tier metafield. Existing CSV records have not
been modified as part of this cleanup.

## Critical deployment limitation

The per-request resolver currently calls the Admin API using the custom backend
app's credentials. Shopify Subscriptions-owned contracts may be invisible to that
app. Removing metafields does NOT fix this ownership restriction. With no visible
active contract the app denies membership access, even if Shopify's own admin UI
shows an active subscriber. Debug reason no_visible_contract highlights the empty
response without claiming that the customer has no real subscription.

Do not describe this cleanup as a verified integration with Shopify Subscriptions.
Verify a real active subscriber AND a paused/cancelled subscriber after deployment.
If no_visible_contract is returned, a supported subscription-provider integration
or a contract-owner integration is still required. Do not use paid order history,
cached login flags or another metafield as a substitute for a live contract.

## Shopify cleanup after verification

1. Review and disable Shopify Flow actions that write the three obsolete customer
   metafields; those workflows exist outside this repository.
2. Back up values if historical data is still useful.
3. In Shopify Settings > Custom data > Customers, remove the definitions/values
   custom.membership_paid_through, custom.subscription_tier and
   custom.subscription_status once no external integration needs them.
4. Any old subscription_start_date field is also no longer read by this app; review
   its other consumers before removing it separately.

No live Shopify metafields or definitions have been deleted by these code changes.

Shopify confirms the app ownership boundary in its
[developer support explanation](https://community.shopify.dev/t/subscription-contacts/27694).
