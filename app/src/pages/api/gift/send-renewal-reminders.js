import { sendGiftRenewalReminders, timingSafeCompare } from "@/lib/membershipGifts";

const getBearerToken = (authorization = "") => {
  const match = String(authorization || "").match(/^Bearer\s+(.+)$/i);
  return match?.[1] || "";
};

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const expectedSecrets = [process.env.GIFT_MEMBERSHIP_CRON_SECRET, process.env.CRON_SECRET].filter(Boolean);
  if (expectedSecrets.length === 0) {
    return res.status(500).json({ error: "Missing gift membership reminder secret." });
  }

  const providedSecret = getBearerToken(req.headers.authorization) || String(req.query.secret || "");
  if (!expectedSecrets.some((secret) => timingSafeCompare(providedSecret, secret))) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const result = await sendGiftRenewalReminders();
    return res.status(200).json(result);
  } catch (error) {
    console.error("[gift-renewal-reminders] Failed to send reminders.", error);
    return res.status(500).json({ error: "Failed to send reminders." });
  }
}
