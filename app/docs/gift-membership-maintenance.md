# Daily gift membership maintenance

The existing `/api/gift/send-renewal-reminders` route now reconciles gift membership
state with Shopify before sending expiry reminders. `vercel.json` schedules it at
09:00 UTC each day. Vercel schedules run on the production deployment.

## Deployment configuration

Set these environment variables in the Vercel project's **Production** environment:

- `CRON_SECRET`: a random secret (Vercel sends it as a Bearer authorization header).
- `SANITY_MIGRATE_TOKEN`: the existing Sanity token, with permission to read and
  update gift, entitlement, and maintenance job documents in the production dataset.
- `SHOPIFY_STORE_DOMAIN` and the existing Shopify Admin credentials: either
  `SHOPIFY_ADMIN_API_ACCESS_TOKEN` or the configured client ID/secret credentials.
  The installed app needs `read_customers` and `write_customers`, including access
  to the customer metafields used here.
- `RESEND_API_KEY` and `GIFT_MEMBERSHIP_EMAIL_FROM`: a working Resend key and a
  verified sender. The existing `PROFILE_EVENT_NOTIFICATION_FROM` fallback works too.
- `GIFT_MEMBERSHIP_CLAIM_BASE_URL` or `NEXT_PUBLIC_SITE_URL`: the public site URL,
  also used to build the reminder's `/memberships` link.

Deploy the app to activate the job. No subscription-contract write scope is needed.
Deploy the Studio schema changes to make the new diagnostic fields recognizable there.

## What it does

- Re-reads each gift customer's entitlements and selects the currently active term.
  Future queued gifts are not activated early.
- Corrects the six `custom.gift_membership_*` metafields and removes obsolete
  `gift-membership-tier:*` tags before adding the current tier's tag.
- When no gift term is active, sets `custom.gift_membership_status` to `inactive`,
  deletes the other gift metafields, and removes gift membership tags. Historical
  dates and tiers remain in Sanity. Recurring subscription fields and tags are untouched.
- Marks elapsed active Sanity terms `expired` after successful reconciliation.
- Re-checks every gift customer each day, including previous failures and already
  expired customers, so it repairs partial updates and later Shopify drift.
- Sends an English reminder when the current gift ends within seven days. It skips
  a reminder when a queued gift continues access immediately after the current one.
- Records successful sends in `renewalReminderSentAt` and sends a stable Resend
  idempotency key on retries. Resend retains those keys for 24 hours; a successful
  email followed by a prolonged Sanity write outage can still cause a later duplicate.
- Uses a ten-minute Sanity lease to prevent overlapping job runs. If the function
  terminates unexpectedly, the lease expires automatically. Runtime is capped at
  300 seconds; move to queued batches if the customer count outgrows that window.

Website access still checks entitlement dates when resolving membership, so access
expiry does not wait for the daily job. Shopify's administrative copy can lag by a day.

## Verify without sending or writing

From a terminal with `CRON_SECRET` loaded, substitute the deployed host:

```sh
curl --fail-with-body \
  --header "Authorization: Bearer $CRON_SECRET" \
  'https://YOUR-HOST/api/gift/send-renewal-reminders?dryRun=1'
```

Dry run reads Sanity and reports the selected term, expired document IDs, and due
reminders. It does not test Shopify credentials, send emails, acquire the lease,
or write records. Remove `?dryRun=1` to perform a real authenticated run.

In Vercel, open **Settings > Cron Jobs > View Logs** for the route. Successful runs
return 200; per-customer or reminder failures return 500 with a summary while other
customers continue processing. Vercel does not automatically retry failed cron
invocations; pending failures are attempted on the next scheduled or manual run.

Sanity's `membershipGiftJob.daily` document records the last run status. Gift and
entitlement documents store `shopifyMirrorStatus`, `shopifyMirrorAttemptedAt`, and
`shopifyMirrorError`. Failed reminders store `renewalReminderError` and
`renewalReminderAttemptedAt`.
