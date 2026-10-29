import { storefrontRequest } from "../shopify.js";
import type { Redemption } from "./redemption.ts";

export async function createGiftCheckout(gift: Redemption): Promise<string> {
  const data = await storefrontRequest(`mutation GiftSubscriptionCheckout($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
        discountCodes { code applicable }
        lines(first: 1) { nodes { sellingPlanAllocation { sellingPlan { id } } } }
      }
      userErrors { field message code }
    }
  }`, { input: {
    lines: [{ merchandiseId: gift.variantId, sellingPlanId: gift.sellingPlanId, quantity: 1 }],
    discountCodes: [gift.code],
  } }, { cache: "no-store" });
  const result = data?.cartCreate;
  if (!result?.cart || result.userErrors?.length) throw new Error("Gift subscription cart unavailable");
  const cart = result.cart;
  if (!cart.discountCodes?.some((entry) => entry.code.toUpperCase() === gift.code && entry.applicable) ||
    cart.lines?.nodes?.[0]?.sellingPlanAllocation?.sellingPlan?.id !== gift.sellingPlanId) {
    throw new Error("Gift code or selling plan is not applicable");
  }
  const checkout = new URL(cart.checkoutUrl);
  if (checkout.protocol !== "https:") throw new Error("Invalid Shopify checkout URL");
  return checkout.toString();
}
