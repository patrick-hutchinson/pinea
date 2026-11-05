export type GiftOrder = {
  id: number | string;
  admin_graphql_api_id?: string;
  email?: string;
  contact_email?: string;
  customer?: { first_name?: string; last_name?: string; email?: string };
  billing_address?: { first_name?: string; last_name?: string };
  line_items: {
    id: number | string;
    variant_id: number | string;
    product_id?: number | string;
    variant_title?: string;
    quantity: number;
    selling_plan_allocation?: unknown;
    properties?: { name: string; value: string | null }[];
  }[];
};

export type GiftUnit = {
  key: string;
  code: string;
  productId: string;
  variantId: string;
  sellingPlanId: string;
  region?: "AT" | "EU" | "WORLD";
  language?: "de" | "en";
  created?: boolean;
  recipientSent?: boolean;
  buyerSent?: boolean;
};

export type DeliveryState = {
  version: 1;
  startedAt: string;
  cycles: number;
  // Retained only to hydrate incomplete states created by the original
  // single-membership implementation.
  productId?: string;
  sellingPlanId: string;
  leaseUntil: string;
  leaseToken: string;
  units: GiftUnit[];
  complete?: boolean;
};

export type GiftConfig = {
  shop: string;
  sellingPlanId: string;
  giftVariants: Record<string, GiftVariantMapping>;
  cycles: number;
  redemptionBaseUrl: string;
  from: string;
  adminEmail: string;
};

export type GiftVariantMapping = {
  membershipProductId: string;
  membershipVariantId: string;
  region?: "AT" | "EU" | "WORLD";
};
