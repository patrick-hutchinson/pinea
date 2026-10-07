import { claimMembershipGift } from "@/lib/membershipGifts";
import { getSessionFromRequest, sendMethodNotAllowed } from "@/lib/pages/api";

const normalize = (value) => (typeof value === "string" ? value.trim() : "");

const getDeliveryAddress = (payload = {}) => ({
  firstName: normalize(payload.firstName),
  lastName: normalize(payload.lastName),
  company: normalize(payload.company),
  address1: normalize(payload.address1),
  address2: normalize(payload.address2),
  zip: normalize(payload.zip),
  city: normalize(payload.city),
  country: normalize(payload.country),
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    sendMethodNotAllowed(res, ["POST"]);
    return;
  }

  const token = normalize(req.body?.token);
  if (!token) {
    res.status(400).json({ error: "Missing claim token." });
    return;
  }

  const session = getSessionFromRequest(req);
  if (!session?.email) {
    res.status(401).json({ error: "Please sign in to claim this gift." });
    return;
  }

  const deliveryAddress = getDeliveryAddress(req.body?.deliveryAddress);
  if (!deliveryAddress.firstName || !deliveryAddress.lastName || !deliveryAddress.address1 || !deliveryAddress.zip || !deliveryAddress.city || !deliveryAddress.country) {
    res.status(400).json({ error: "Please complete the delivery address." });
    return;
  }

  const result = await claimMembershipGift({ token, session, deliveryAddress });

  if (!result.ok) {
    res.status(result.status || 400).json({ error: result.error || "Could not claim gift." });
    return;
  }

  res.status(200).json(result);
}
