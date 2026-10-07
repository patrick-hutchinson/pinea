import { createHmac, timingSafeEqual } from "crypto";

import { processPaidGiftOrder } from "@/lib/membershipGifts";
import { readRequestBuffer, sendMethodNotAllowed } from "@/lib/pages/api";

export const config = {
  api: {
    bodyParser: false,
  },
};

const verifyShopifyWebhook = (rawBody, hmacHeader) => {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret || !hmacHeader) return false;

  const digest = createHmac("sha256", secret).update(rawBody).digest("base64");
  const expected = Buffer.from(digest);
  const received = Buffer.from(hmacHeader);

  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    sendMethodNotAllowed(res, ["POST"]);
    return;
  }

  const rawBody = await readRequestBuffer(req);
  const hmac = req.headers["x-shopify-hmac-sha256"];

  if (!verifyShopifyWebhook(rawBody, Array.isArray(hmac) ? hmac[0] : hmac)) {
    res.status(401).json({ error: "Invalid webhook signature." });
    return;
  }

  let order;
  try {
    order = JSON.parse(rawBody.toString("utf8"));
  } catch {
    res.status(400).json({ error: "Invalid JSON payload." });
    return;
  }

  try {
    const result = await processPaidGiftOrder(order);
    res.status(200).json({ ok: true, ...result });
  } catch (error) {
    console.error("[membershipGifts] Failed to process orders/paid webhook.", error);
    res.status(500).json({ error: "Gift webhook processing failed." });
  }
}
