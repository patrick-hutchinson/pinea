import { adminRequest } from "../shopifySubscriptions.js";
import type { DeliveryState } from "./types.ts";

export class GiftConflict extends Error {}

const request = async (query: string, variables: Record<string, unknown>) => {
  const data = await adminRequest(query, variables, { apiVersion: process.env.GIFT_SHOPIFY_API_VERSION || "2026-10" });
  if (!data) throw new Error("Shopify Admin credentials unavailable");
  return data;
};

export type Snapshot = { marker: string | null; state: DeliveryState | null; digest: string | null; payable: boolean };

export async function loadGiftState(orderId: string): Promise<Snapshot> {
  const data = await request(`query GiftOrderState($id: ID!) {
    order(id: $id) {
      id cancelledAt displayFinancialStatus
      marker: metafield(namespace: "gift", key: "discount_code") { value }
      state: metafield(namespace: "gift", key: "delivery_state") { value compareDigest }
    }
  }`, { id: orderId });
  if (!data.order) throw new Error("Gift order not accessible");
  const state = data.order.state ? JSON.parse(data.order.state.value) as DeliveryState : null;
  if (state && (state.version !== 1 || !Array.isArray(state.units))) throw new Error("Unsupported gift delivery state");
  return {
    marker: data.order.marker?.value || null,
    state,
    digest: data.order.state?.compareDigest || null,
    payable: !data.order.cancelledAt && data.order.displayFinancialStatus === "PAID",
  };
}

export async function saveGiftState(orderId: string, state: DeliveryState, digest: string | null): Promise<string> {
  const metafields: Record<string, unknown>[] = [{
    ownerId: orderId, namespace: "gift", key: "delivery_state", type: "json",
    value: JSON.stringify(state), compareDigest: digest,
  }];
  const createdCodes = state.units.filter((unit) => unit.created).map((unit) => unit.code);
  if (createdCodes.length) metafields.push({
    ownerId: orderId, namespace: "gift", key: "discount_code", type: "single_line_text_field", value: createdCodes[0],
  });
  const data = await request(`mutation SaveGiftState($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { key compareDigest }
      userErrors { code field message }
    }
  }`, { metafields });
  const result = data.metafieldsSet;
  if (!result) throw new Error("Missing metafieldsSet result");
  const errors = result.userErrors || [];
  if (errors.some((error) => ["INVALID_COMPARE_DIGEST", "STALE_OBJECT"].includes(error.code))) {
    throw new GiftConflict("Gift order is being processed elsewhere");
  }
  if (errors.length) throw new Error("Gift order metafield write rejected");
  const nextDigest = result.metafields?.find((field) => field.key === "delivery_state")?.compareDigest;
  if (!nextDigest) throw new Error("Missing gift state revision");
  return nextDigest;
}

export function discountInput(orderId: string, key: string, code: string, state: DeliveryState) {
  return {
    title: `Membership Gift ${orderId.split("/").pop()} ${key}`,
    code, startsAt: state.startedAt, context: { all: "ALL" },
    customerGets: {
      value: { percentage: 1 }, items: { products: { productsToAdd: [state.productId] } },
      appliesOnSubscription: true, appliesOnOneTimePurchase: false,
    },
    recurringCycleLimit: state.cycles, usageLimit: 1, appliesOncePerCustomer: true,
    combinesWith: { orderDiscounts: false, productDiscounts: false, shippingDiscounts: false },
  };
}

export async function ensureGiftDiscount(orderId: string, key: string, code: string, state: DeliveryState): Promise<void> {
  const input = discountInput(orderId, key, code, state);
  // A persisted code also recovers a successful create followed by a lost API response.
  const existing = await request(`query ExistingGiftDiscount($code: String!) {
    codeDiscountNodeByCode(code: $code) { codeDiscount { ... on DiscountCodeBasic { title } } }
  }`, { code });
  if (existing.codeDiscountNodeByCode) {
    if (existing.codeDiscountNodeByCode.codeDiscount?.title !== input.title) throw new Error("Gift discount code collision");
    return;
  }
  const data = await request(`mutation CreateMembershipGift($input: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $input) {
      codeDiscountNode { id }
      userErrors { field code message }
    }
  }`, { input });
  if (!data.discountCodeBasicCreate?.codeDiscountNode || data.discountCodeBasicCreate.userErrors?.length) {
    throw new Error("Gift discount creation rejected");
  }
}
