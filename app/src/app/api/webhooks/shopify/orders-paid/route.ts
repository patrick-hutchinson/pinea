import { after } from "next/server";
import { verifyShopifySignature } from "@/lib/gifts/verify.ts";
import { getGiftConfig } from "@/lib/gifts/config.ts";
import { GiftProcessingFailure, processGiftOrder } from "@/lib/gifts/processor.ts";
import { ensureGiftDiscount, loadGiftState, saveGiftState } from "@/lib/gifts/shopify.ts";
import { sendGiftAlert, sendGiftEmail } from "@/lib/gifts/mail.ts";
import type { GiftOrder } from "@/lib/gifts/types.ts";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook not configured", { status: 503 });
  const rawBody = await request.text();
  if (!verifyShopifySignature(rawBody, request.headers.get("x-shopify-hmac-sha256"), secret)) {
    return new Response("Invalid signature", { status: 401 });
  }
  if (request.headers.get("x-shopify-topic") !== "orders/paid") {
    return new Response("Unexpected topic", { status: 400 });
  }
  let order: GiftOrder;
  try {
    order = JSON.parse(rawBody);
    if (!order.id || !Array.isArray(order.line_items)) throw new Error("Invalid order");
  } catch { return new Response("Invalid order payload", { status: 400 }); }
  const webhookId = (request.headers.get("x-shopify-webhook-id") || "unknown").replace(/[^\w-]/g, "").slice(0, 100);
  const orderId = String(order.id).replace(/\D/g, "");
  console.log("[membership-gift] Webhook accepted", { webhookId, orderId });
  after(async () => {
    try {
      const config = getGiftConfig();
      const result = await processGiftOrder(order, config, {
        loadState: loadGiftState, saveState: saveGiftState, ensureDiscount: ensureGiftDiscount,
        sendMail: (mail) => sendGiftEmail(mail, config),
      });
      console.log("[membership-gift] Processing finished", { webhookId, orderId, ...result });
    } catch (error) {
      const stage = error instanceof GiftProcessingFailure ? error.stage : "configuration_or_payload";
      console.error("[membership-gift] Processing failed", { webhookId, orderId, stage });
      try { await sendGiftAlert(orderId, webhookId, stage); }
      catch { console.error("[membership-gift] Admin alert failed", { webhookId, orderId }); }
    }
  });
  return Response.json({ received: true });
}
