import { getCustomerSubscriptionStatusByEmail } from "@/lib/shopifySubscriptions";
import { sendMethodNotAllowed } from "@/lib/pages/api";

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
const isValidEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

export default async function handler(req, res) {
  if (req.method !== "POST") {
    sendMethodNotAllowed(res, ["POST"]);
    return;
  }

  const email = normalizeEmail(req.body?.email);
  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }

  try {
    const subscriptionStatus = await getCustomerSubscriptionStatusByEmail(email);
    const hasActiveSubscription = subscriptionStatus?.hasActiveSubscription === true;

    res.status(200).json({
      canReceiveGift: !hasActiveSubscription,
      hasActiveSubscription,
    });
  } catch (error) {
    console.error("[gift-recipient-check] Failed to check recipient.", error);
    res.status(500).json({ error: "Could not check recipient membership status." });
  }
}
