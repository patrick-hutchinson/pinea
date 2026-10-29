import type { GiftConfig } from "./types.ts";

export function shopifyGid(type: string, value: string): string {
  const numeric = value.replace(`gid://shopify/${type}/`, "");
  if (!/^\d+$/.test(numeric)) throw new Error(`Invalid ${type} ID configuration`);
  return `gid://shopify/${type}/${numeric}`;
}

export function getGiftConfig(): GiftConfig {
  const required = (key: string) => {
    const value = process.env[key]?.trim();
    if (!value) throw new Error(`Missing ${key}`);
    return value;
  };
  const shop = required("SHOPIFY_STORE_DOMAIN").replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(shop)) throw new Error("Invalid Shopify domain");
  const cycles = Number(required("GIFT_CYCLES"));
  if (!Number.isSafeInteger(cycles) || cycles < 1) throw new Error("GIFT_CYCLES must be a positive billing-cycle count");
  const base = new URL(required("GIFT_MEMBERSHIP_CLAIM_BASE_URL"));
  if (base.protocol !== "https:" && base.hostname !== "localhost") throw new Error("Gift redemption URL must use HTTPS");
  return {
    shop,
    giftVariantId: shopifyGid("ProductVariant", required("GIFT_VARIANT_ID")),
    membershipProductId: shopifyGid("Product", required("MEMBERSHIP_PRODUCT_ID")),
    membershipVariantId: shopifyGid("ProductVariant", required("MEMBERSHIP_VARIANT_ID")),
    sellingPlanId: shopifyGid("SellingPlan", required("SELLING_PLAN_ID")),
    cycles,
    redemptionBaseUrl: base.origin,
    from: required("GIFT_MEMBERSHIP_EMAIL_FROM"),
    adminEmail: required("ADMIN_EMAIL"),
  };
}
