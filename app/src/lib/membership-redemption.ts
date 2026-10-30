import { createHmac, timingSafeEqual } from "node:crypto";

export type MembershipRedemption = {
  code: string;
  variantId: string;
  sellingPlanId: string;
};

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export const membershipRedemptionSecret = () => process.env.MEMBERSHIP_REDEMPTION_LINK_SECRET || "";

export function createMembershipRedemptionLink(base: string, value: MembershipRedemption, secret: string): string {
  if (!secret) throw new Error("Missing MEMBERSHIP_REDEMPTION_LINK_SECRET");

  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  const url = new URL("/api/membership/redeem", base);
  url.searchParams.set("token", `${payload}.${sign(payload, secret)}`);
  return url.toString();
}

export function verifyMembershipRedemptionToken(token: string, secret: string): MembershipRedemption | null {
  if (!secret || token.length > 2048) return null;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;

  const expected = Buffer.from(sign(payload, secret));
  const received = Buffer.from(signature);
  if (received.length !== expected.length || !timingSafeEqual(expected, received)) return null;

  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString()) as MembershipRedemption;
    return /^PINEA100-[A-Z0-9-]+$/.test(value.code) &&
      /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value.variantId) &&
      /^gid:\/\/shopify\/SellingPlan\/\d+$/.test(value.sellingPlanId)
      ? value
      : null;
  } catch {
    return null;
  }
}
