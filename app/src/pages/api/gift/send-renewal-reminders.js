import { runGiftMembershipMaintenance, timingSafeCompare } from "@/lib/membershipGifts";

export const config = { maxDuration: 300 };

const getBearerToken = (authorization = "") => {
  const match = String(authorization || "").match(/^Bearer\s+(.+)$/i);
  return match?.[1] || "";
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
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
    const result = await runGiftMembershipMaintenance({ dryRun: req.query.dryRun === "1" });
    return res.status(result.failed ? 500 : 200).json(result);
  } catch (error) {
    console.error("[gift-maintenance] Job failed.", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ error: "Gift membership maintenance failed. Check the server logs." });
  }
}
