import { storefrontRequest } from "./shopify.js";
import type { MembershipRedemption } from "./membership-redemption.ts";
import {requireFutureRenewal, verifyMembershipDates} from './membership-dates.ts';

export async function createMembershipCheckout(redemption: MembershipRedemption): Promise<string> {
  if (!verifyMembershipDates(redemption)) throw new Error('Invalid membership migration dates');
  if (redemption.renewalDate) requireFutureRenewal(redemption.renewalDate);
  const data = await storefrontRequest(`mutation MembershipCheckout($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
        discountCodes { code applicable }
        lines(first: 1) { nodes { sellingPlanAllocation { sellingPlan { id } } } }
      }
      userErrors { field message code }
    }
  }`, {
    input: {
      lines: [{ merchandiseId: redemption.variantId, sellingPlanId: redemption.sellingPlanId, quantity: 1 }],
      discountCodes: [redemption.code],
      buyerIdentity: { email: redemption.email },
      // These are review metadata, not an instruction to Shopify's billing engine.
      ...(redemption.renewalDate ? {attributes: [
        {key: 'Membership original start', value: redemption.membershipStartDate!},
        {key: 'Membership first paid renewal', value: redemption.renewalDate},
        {key: 'Membership included days', value: String(redemption.membershipTermDays)},
        {key: 'Membership billing alignment', value: 'MANUAL_SHOPIFY_REVIEW_REQUIRED'},
      ]} : {}),
    },
  }, { cache: "no-store" });

  const result = data?.cartCreate;
  if (!result?.cart || result.userErrors?.length) throw new Error("Membership cart unavailable");

  const cart = result.cart;
  const discountApplied = cart.discountCodes?.some((entry: { code: string; applicable: boolean }) =>
    entry.code.toUpperCase() === redemption.code.toUpperCase() && entry.applicable,
  );
  const planApplied = cart.lines?.nodes?.[0]?.sellingPlanAllocation?.sellingPlan?.id === redemption.sellingPlanId;
  if (!discountApplied || !planApplied) throw new Error("Membership discount or selling plan is not applicable");

  const checkout = new URL(cart.checkoutUrl);
  if (checkout.protocol !== "https:") throw new Error("Invalid Shopify checkout URL");
  return checkout.toString();
}
