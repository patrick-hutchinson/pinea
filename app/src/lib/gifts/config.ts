import type { GiftConfig } from "./types.ts";

const DEFAULT_GIFT_VARIANTS = {
  // Gift product variant -> membership product and option redeemed by its code.
  "66150176620893": { product: "16024760451421", variant: "63971055567197", region: "AT" },
  "66346106421597": { product: "16024760451421", variant: "63971055599965", region: "EU" },
  "66150189302109": { product: "16024759468381", variant: "63963156873565", region: "AT" },
  "66346106487133": { product: "16024759468381", variant: "63971059597661", region: "EU" },
  "66346106519901": { product: "16024759468381", variant: "63971059630429", region: "WORLD" },
  "66346106585437": { product: "16024762712413", variant: "63963164475741", region: "WORLD" },
} as const;
const DEFAULT_SELLING_PLAN_ID = "690977046877";

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

  const builtInGiftVariants = Object.entries(DEFAULT_GIFT_VARIANTS).map(([giftVariant, membership]) => [
    shopifyGid("ProductVariant", giftVariant),
    {
      membershipProductId: shopifyGid("Product", membership.product),
      membershipVariantId: shopifyGid("ProductVariant", membership.variant),
      region: membership.region,
    },
  ] as const);

  // Keep the original single-variant configuration as an optional fallback
  // for any older gift product that has not migrated to the built-in options.
  const legacyGiftVariant = process.env.GIFT_VARIANT_ID?.trim();
  const legacyMembershipVariant = process.env.MEMBERSHIP_VARIANT_ID?.trim();
  if (Boolean(legacyGiftVariant) !== Boolean(legacyMembershipVariant)) {
    throw new Error("GIFT_VARIANT_ID and MEMBERSHIP_VARIANT_ID must be configured together");
  }

  return {
    shop,
    // All current memberships use this annual plan. Keep the environment
    // override so a future plan can be deployed without a code release.
    sellingPlanId: shopifyGid("SellingPlan", process.env.SELLING_PLAN_ID?.trim() || DEFAULT_SELLING_PLAN_ID),
    giftVariants: Object.fromEntries([
      ...(legacyGiftVariant && legacyMembershipVariant ? [[shopifyGid("ProductVariant", legacyGiftVariant), {
        membershipProductId: shopifyGid("Product", required("MEMBERSHIP_PRODUCT_ID")),
        membershipVariantId: shopifyGid("ProductVariant", legacyMembershipVariant),
      }]] : []),
      ...builtInGiftVariants,
    ]),
    cycles,
    redemptionBaseUrl: base.origin,
    from: required("GIFT_MEMBERSHIP_EMAIL_FROM"),
    adminEmail: required("ADMIN_EMAIL"),
  };
}
