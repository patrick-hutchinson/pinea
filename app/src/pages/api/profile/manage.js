import { getCustomerProfile, updateCustomerProfile, ProfileUpdateError } from "@/lib/shopifyCustomerProfile";
import { getAbsoluteRequestUrl, getSessionFromRequest, setResponseCookie } from "@/lib/pages/api";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth/sessionCore";
import { isAuthEnabled } from "@/lib/runtimeFlags";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  if (!isAuthEnabled) return res.status(404).end();
  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const session = getSessionFromRequest(req);
  if (!session?.email || !session?.shopifyCustomerId) return res.status(401).json({ error: "Please sign in again." });
  if (req.method === "POST" && (
    req.headers.origin !== getAbsoluteRequestUrl(req).origin ||
    !req.headers["content-type"]?.startsWith("application/json")
  )) return res.status(403).json({ error: "Invalid request origin or content type." });

  try {
    const profile = req.method === "POST"
      ? await updateCustomerProfile(session.shopifyCustomerId, req.body)
      : await getCustomerProfile(session.shopifyCustomerId);
    if (req.method === "POST" && req.body.action === "details") {
      const name = `${profile.firstName} ${profile.lastName}`.trim();
      setResponseCookie(res, SESSION_COOKIE_NAME, createSessionToken({ ...session, id: session.sub || session.shopifyCustomerId, name }), SESSION_COOKIE_OPTIONS);
    }
    return res.status(200).json({ profile });
  } catch (error) {
    if (error instanceof ProfileUpdateError) return res.status(error.status).json({ error: error.message });
    console.error("[profile/manage] Shopify profile request failed.", error);
    return res.status(502).json({ error: "Could not connect to Shopify. Please try again." });
  }
}
