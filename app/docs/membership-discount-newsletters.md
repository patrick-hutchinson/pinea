# Membership Rabattcodes: Sanity to Listmonk

This is for manually issued Shopify coupons for physically enrolled members. It is
separate from the purchased Gift a Membership webhook flow. It does not create
Shopify discounts or send an email automatically.

## Client workflow

1. Create the 100% coupon in Shopify first. Configure its subscription eligibility,
   applicable membership, discounted billing cycles, expiry and usage limit.
   Restrict it to the intended customer if it must not be transferable.
2. In Sanity, open Newsletter > Membership Rabattcodes > Neuer Rabattcode and
   click Neuen Rabattcode anlegen.
3. Enter an internal title, recipient email, coupon, membership tier, region,
   language and subject. Recipient name is optional. Plus has no region;
   Student supports AT/EU, Member supports AT/EU/WORLD.
   The app resolves the original membership start date and FREE status by exact
   email from the imported table, or you can enter them explicitly. Confirm the
   Shopify billing-follow-up process before synchronizing. See
   [migration dates](membership-migration-dates.md) for unresolved records and
   billing limitations. An email date does not update a Shopify contract.
4. Publish. The server generates the signed checkout link and creates or updates
   a Listmonk draft using the existing German/English physical-member template.
5. Wait for Listmonk Status = synced, then open Entwurf in Listmonk. Verify the
   recipient, sender, coupon and checkout link before manually sending.

There is one private Listmonk list per Sanity document, containing exactly one
recipient at sync time. No general newsletter list is used or modified. Do not
manually add other recipients to these lists: the message contains a personal link.
Do not rename the generated campaign/list or publish the campaign to an archive.
The sender defaults to Listmonk's configured sender, as with normal newsletters.

Republishing updates an existing draft, not an already started/sent campaign.
Create a new document for a new mailing. Failed syncs show a message in Sanity;
use the document action Listmonk erneut synchronisieren after fixing the cause.
This action requires a published document with no unpublished edits. If a server
execution was interrupted, allow its ten-minute lock to expire before retrying.

## Server configuration

Configure these on the Next.js deployment (Vercel environment variables), never
as NEXT_PUBLIC_* or SANITY_STUDIO_* variables:

| Variable | Purpose |
| --- | --- |
| LISTMONK_URL | HTTPS Listmonk origin, without /api |
| LISTMONK_USER | Listmonk API username |
| LISTMONK_TOKEN | Listmonk API token |
| MEMBERSHIP_NEWSLETTER_SYNC_SECRET | New random shared server-to-server secret |
| SANITY_MIGRATE_TOKEN | Existing Sanity token; must read/write these documents |
| MEMBERSHIP_REDEMPTION_BASE_URL | Existing HTTPS app origin used for checkout links |
| MEMBERSHIP_REDEMPTION_LINK_SECRET | Existing signing secret, also used by /api/membership/redeem |

LISTMONK_* may already exist in the Sanity Function environment, but this new flow
also needs them in the Next.js app. The Listmonk token needs read/create/update
permissions for campaigns, lists, subscribers and templates, including subscriber
SQL queries and access to all generated private lists. Sending/status-changing
permissions are not used by this integration.

Configure the existing Sanity newsletter-function environment with:

- SITE_URL: HTTPS origin of the deployed Next app. It must be reachable by the
  function, including through any deployment protection.
- MEMBERSHIP_NEWSLETTER_SYNC_SECRET: identical to the Next.js value.

Keep its existing LISTMONK_* settings for ordinary newsletters. Generate the new
shared secret locally with `openssl rand -hex 32`; do not commit it.

Deploy the Next app first, then the updated Studio and Sanity Blueprint/function:

```sh
cd studio
npx sanity blueprints deploy
npm run deploy
```

The API endpoint is POST /api/newsletter/membership-discount. The function sends
only the document ID with Bearer authentication; Next fetches the published
private document itself. The Blueprint ignores drafts and status-only writes, so
sync status updates do not trigger a loop. Existing newsletters keep their old flow.

## Privacy and templates

Documents are created with IDs `membershipDiscount.<uuid>`. Dotted IDs require
authentication even in a public dataset; this avoids exposing recipient addresses,
coupon codes and signed links through public Sanity reads. Always use the custom
creation button; duplicate and generic creation actions are disabled for this type.
See [Sanity document IDs](https://www.sanity.io/docs/content-lake/ids).

The renderer uses src/app/scripts/send-codes/mail.html and mail.en.html. Both the
original batch and Sanity flow now use a dynamic {{renewalDate}} placeholder, based
on the recorded start date. Actual billing is controlled by Shopify's contract,
selling plan and coupon configuration, not this email or its order attributes.

The six variant IDs and selling plan match the existing physical-member scripts;
if Shopify recreates those variants/plans, update the mapping in
src/lib/membership-newsletter/render.ts too. The original batch scripts and
purchased gift coupon flow remain unchanged.

API behavior follows the Listmonk documentation for
[campaigns](https://listmonk.app/docs/apis/campaigns/),
[subscribers](https://listmonk.app/docs/apis/subscribers/) and
[templates](https://listmonk.app/docs/apis/templates/).

## Verification

From app, using Node 22 or newer:

```sh
npm run test:membership-newsletter
npm run test:gifts
npm run build
```

Tests mock Listmonk and send nothing. After deployment, create a document addressed
to your own email, confirm that Listmonk shows one recipient and verify the signed
link reaches the intended discounted subscription checkout before using real data.

The Sanity trigger regression tests run from studio with
`node --test functions/newsletter-function/filter.test.mjs`.
