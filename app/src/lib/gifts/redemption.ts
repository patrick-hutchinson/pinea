import { createHmac, timingSafeEqual } from "node:crypto";

export type Redemption = { code: string; variantId: string; sellingPlanId: string; cycles: number };
const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function createRedemptionLink(base: string, value: Redemption, secret: string): string {
  if (!secret) throw new Error("Missing gift link secret");
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  const url = new URL("/api/gifts/redeem", base);
  url.searchParams.set("token", `${payload}.${sign(payload, secret)}`);
  return url.toString();
}

export function verifyRedemptionToken(token: string, secret: string): Redemption | null {
  if (!secret || token.length > 2048) return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  const expected = Buffer.from(sign(payload, secret));
  const received = Buffer.from(signature);
  if (received.length !== expected.length || !timingSafeEqual(expected, received)) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString()) as Redemption;
    return /^GIFT-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{10}$/.test(value.code) &&
      /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value.variantId) &&
      /^gid:\/\/shopify\/SellingPlan\/\d+$/.test(value.sellingPlanId) &&
      Number.isSafeInteger(value.cycles) && value.cycles > 0 ? value : null;
  } catch { return null; }
}

export const giftLinkSecret = () => process.env.GIFT_LINK_SECRET || process.env.SHOPIFY_WEBHOOK_SECRET || "";
