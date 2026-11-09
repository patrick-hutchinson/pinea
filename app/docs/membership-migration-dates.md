# Physically enrolled membership dates

## Import on 4 November 2026

Source: Memberships_Shopify_inklBeginndaten04112026.xlsx, Tabelle1.
The confirmed source is column P (Datum), NOT column L (ab Ausgabe).
Missing dates remain blocked. No original workbook values
were edited, and no live customer, contract, coupon or email was changed.

- 71 source memberships.
- 49 exact, case-insensitive email matches in the 51-row member-discounts.csv.
- Patrick Es and Helena Lang have no exact source email match. Patrick's test
  record was subsequently confirmed by the user as 18 July 2026, renewing
  18 July 2027, and marked manual_confirmed. Helena's dates remain blank and
  sending is blocked. No name-based/fuzzy match was used.
- 22 source memberships are not in the code table. They have not been assigned
  invented coupon codes or silently added to an email batch.
- Six memberships are explicitly Plus (FREE); four have no date in column P
  (spreadsheet rows 52, 53, 64, 68). No invoice/issue date was invented for them.
- Two other source memberships also lack P dates (rows 65 and 67).
- Existing recipient emails, coupons, variants, languages and names are unchanged.

The normalized source and review statuses are in
src/app/scripts/send-codes/membership-start-dates.csv. This is private member data;
do not put it in public/ or publish a public download route.

## Date rule

Normal: original start + exactly 365 days.
FREE: original start + three calendar years, confirmed by the client. For a
29 February start, the anniversary is 28 February in the non-leap target year.
The included days are calculated from the dates (1,095 or 1,096), not hardcoded.

Date arithmetic uses UTC midnight; display uses de-AT or en-GB with an explicit
UTC timezone. Redemption rejects dates already reached in Europe/Vienna. It never
resets the entitlement to another full term from the redemption date.

## What is and is NOT automated

The generated email replaces {{renewalDate}} per member. The signed redemption
link carries the original start, included days and first paid renewal date. The
cart carries these as order attributes with
Membership billing alignment = MANUAL_SHOPIFY_REVIEW_REQUIRED.

These attributes DO NOT change Shopify's contract billing engine, backdate
createdAt, or adjust the discount's recurring cycle limit. Shopify creates a new
contract at checkout. Its actual first paid renewal must be aligned separately.

Shopify's Admin mutation for a next billing date requires
write_own_subscription_contracts; this site's custom app cannot assume ownership
of contracts created by the Shopify Subscriptions app. The earlier contract-read
limitations must not be treated as resolved by passing attributes.

Before sending:

1. Review the imported column P dates. The CSV sendout supports fully missing
   dates using date-free wording and signed links without migration dates; do not
   invent a start date. Partial, inconsistent, duplicate-match and expired dates
   remain blocked. The Sanity newsletter workflow still requires a start date.
2. Review the coupon in Shopify: subscription only, correct membership/customer,
   and the correct number of discounted billing cycles. A one-cycle free coupon
   alone does not preserve the original renewal date; FREE members require special
   attention so there is no paid renewal before the three-year entitlement ends.
3. Arrange a Shopify-side contract/billing workflow. For manual follow-up, after
   redemption review the newly created contract in Apps > Subscriptions > Contracts
   against the order's migration attributes. Align upcoming dates and discount
   cycles and verify the first nonzero charge. Do not merely update a metafield.
4. Only then confirm the manual billing-follow-up field in the Sanity document.
   The confirmation acknowledges an operational process; it is NOT evidence that
   the app has changed a contract. Do not enable it without that process.

Shopify currently documents limitations on rescheduling (including a two-year
future limit for rescheduling all upcoming orders). Thus moving a next order
three years out is not a universal solution for FREE memberships. Review the
annual schedule and discounted cycles using Shopify's supported UI/provider.

References:
[Shopify contract management](https://help.shopify.com/en/manual/products/purchase-options/subscriptions/shopify-subscriptions/manage-subscriptions/manage-contracts),
[next billing mutation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/subscriptionContractSetNextBillingDate).

## Sanity and deployment

Deploy the website, Studio and updated Blueprint. No new environment variables
are required. New date fields and the billing-follow-up confirmation are included
in the function trigger; derived/read-only date fields are excluded to avoid loops.

The app looks up the normalized table by exact recipient email. You may supply an
explicit membershipStartDate and isFreeMembership in Sanity instead, for new or
corrected records. Missing/invalid dates block synchronization. On failure the
document shows the calculated dates when available, allowing review before the
billing-follow-up confirmation.

Re-synchronize unsent Listmonk drafts after reviewing dates. Existing sent emails
and previously issued signed links are not retroactively updated. Existing links
without dates remain valid for compatibility and still need manual contract review.

## Reimport safely

From app:

```sh
python3 src/app/scripts/send-codes/extract-membership-dates.py /path/to/source.xlsx > /tmp/membership-dates.json
node --experimental-strip-types src/app/scripts/send-codes/import-membership-dates.ts --source=/tmp/membership-dates.json
```

Review the dry-run counts before adding --write. The extractor validates headers
and dates and never modifies the workbook. The importer matches only exact email
addresses and preserves existing codes and checkout mappings. Missing/duplicate
matches remain blocked.

prepare-membership-links.ts now preserves imported date columns when rebuilding
variant mappings. It does not overwrite them from the old customer export.

The Resend batch script validates all selected recipients before sending.
Its dry run validates without sending. Rows marked missing_start_date or
no_source_match may use the date-free path only when all date fields are empty.
Regular date-free emails say billing begins after the first membership year;
FREE emails explicitly state the three-year subscription period. Known dates
continue to render the exact renewal date. Actual sends additionally require per-row
billing_alignment_confirmed=true or the explicit --confirm-manual-billing-alignment
flag. This safeguard also applies to date-free emails: wording and signed links
do not configure Shopify's billing schedule or discount duration.
