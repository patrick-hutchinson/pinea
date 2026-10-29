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
    quantity: number;
    selling_plan_allocation?: unknown;
    properties?: { name: string; value: string | null }[];
  }[];
};

export type GiftUnit = {
  key: string;
  code: string;
  created?: boolean;
  recipientSent?: boolean;
  buyerSent?: boolean;
};

export type DeliveryState = {
  version: 1;
  startedAt: string;
  cycles: number;
  productId: string;
  variantId: string;
  sellingPlanId: string;
  leaseUntil: string;
  leaseToken: string;
  units: GiftUnit[];
  complete?: boolean;
};

export type GiftConfig = {
  shop: string;
  giftVariantId: string;
  membershipProductId: string;
  membershipVariantId: string;
  sellingPlanId: string;
  cycles: number;
  redemptionBaseUrl: string;
  from: string;
  adminEmail: string;
};
