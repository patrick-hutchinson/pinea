import { createHash, randomBytes, timingSafeEqual } from "crypto";

import { draftClient } from "@/lib/draftClient";

const normalize = (value) => (typeof value === "string" ? value.trim() : "");
const normalizeEmail = (value) => normalize(value).toLowerCase();

const nowIso = () => new Date().toISOString();

const addMonths = (date, months) => {
  const next = new Date(date.getTime());
  next.setMonth(next.getMonth() + months);
  return next;
};

const hashClaimToken = (token) => createHash("sha256").update(token).digest("hex");

const sanitizeIdPart = (value) =>
  String(value || "")
    .replace(/^gid:\/\/shopify\//, "")
    .replace(/[^a-zA-Z0-9_.-]+/g, "-");

const getGiftDocumentId = ({ shop, orderId, lineItemId }) =>
  `membershipGift.${sanitizeIdPart(shop)}.${sanitizeIdPart(orderId)}.${sanitizeIdPart(lineItemId)}`;

const getEntitlementDocumentId = (giftId) => `membershipEntitlement.${sanitizeIdPart(giftId)}`;

const parseGiftVariantMapping = () => {
  const raw = process.env.GIFT_MEMBERSHIP_VARIANTS_JSON;
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    console.error("[membershipGifts] Failed to parse GIFT_MEMBERSHIP_VARIANTS_JSON.", error);
    return {};
  }
};

const getVariantMappingCandidates = (line) =>
  [
    line?.variant_id ? String(line.variant_id) : null,
    line?.variantId ? String(line.variantId) : null,
    line?.variant_admin_graphql_api_id ? String(line.variant_admin_graphql_api_id) : null,
    line?.variant_id ? `gid://shopify/ProductVariant/${line.variant_id}` : null,
  ].filter(Boolean);

const getGiftConfigForLine = (line) => {
  const mapping = parseGiftVariantMapping();
  const key = getVariantMappingCandidates(line).find((candidate) => mapping[candidate]);
  const config = key ? mapping[key] : null;

  if (!config?.tier) return null;

  return {
    tier: normalize(config.tier),
    durationMonths: Math.max(1, Number(config.durationMonths || 12) || 12),
    mappingKey: key,
  };
};

const getLineProperty = (line, key) => {
  const properties = Array.isArray(line?.properties) ? line.properties : [];
  const normalizedKey = key.toLowerCase();
  const property = properties.find((entry) => String(entry?.name || "").trim().toLowerCase() === normalizedKey);
  return normalize(property?.value);
};

export const getGiftLinesFromOrder = (order) => {
  const shop = normalize(order?.shop_domain || order?.shopDomain || order?.shop || process.env.SHOPIFY_STORE_DOMAIN);
  const orderId = normalize(order?.admin_graphql_api_id || order?.id);
  const orderName = normalize(order?.name || order?.order_number);
  const rawOrderId = normalize(order?.id);

  return (Array.isArray(order?.line_items) ? order.line_items : [])
    .map((line) => {
      const giftConfig = getGiftConfigForLine(line);
      if (!giftConfig) return null;

      const recipientEmail = normalizeEmail(getLineProperty(line, "gift_recipient_email"));
      const message = getLineProperty(line, "gift_message");
      const reference = getLineProperty(line, "gift_reference");
      const lineItemId = normalize(line?.admin_graphql_api_id || line?.id);
      const variantId = normalize(
        giftConfig.mappingKey || line?.variant_admin_graphql_api_id || line?.variant_id || line?.variantId,
      );

      if (!shop || !orderId || !lineItemId || !recipientEmail) return null;

      return {
        shop,
        orderId,
        orderName,
        rawOrderId,
        lineItemId,
        variantId,
        recipientEmail,
        message,
        reference,
        tier: giftConfig.tier,
        durationMonths: giftConfig.durationMonths,
      };
    })
    .filter(Boolean);
};

const getGiftClaimBaseUrl = () =>
  normalize(process.env.GIFT_MEMBERSHIP_CLAIM_BASE_URL) ||
  normalize(process.env.NEXT_PUBLIC_SITE_URL) ||
  "https://www.pinea-periodical.com";

const sendGiftClaimEmail = async ({ gift, claimToken }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = normalize(process.env.GIFT_MEMBERSHIP_EMAIL_FROM || process.env.PROFILE_EVENT_NOTIFICATION_FROM);

  if (!apiKey || !from) {
    console.warn("[membershipGifts] Claim email skipped. Missing RESEND_API_KEY or GIFT_MEMBERSHIP_EMAIL_FROM.");
    return false;
  }

  const claimUrl = `${getGiftClaimBaseUrl().replace(/\/$/, "")}/gift/claim/${claimToken}`;
  const subject = "You've received a P.IN.E.A membership";
  const text = [
    "You've received a P.IN.E.A membership.",
    "",
    gift.message ? `Message: ${gift.message}` : null,
    "",
    `Claim your membership here: ${claimUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [gift.recipientEmail],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[membershipGifts] Claim email failed.", {
      status: response.status,
      response: errorText,
      giftId: gift._id,
    });
    return false;
  }

  return true;
};

export const processPaidGiftOrder = async (order) => {
  const giftLines = getGiftLinesFromOrder(order);
  const processed = [];

  for (const giftLine of giftLines) {
    const giftId = getGiftDocumentId(giftLine);
    const existing = await draftClient.fetch(`*[_id == $id][0]`, { id: giftId });

    if (existing?.claimEmailSentAt || existing?.status === "claimed") {
      processed.push({ id: giftId, status: "already_processed" });
      continue;
    }

    const claimToken = randomBytes(32).toString("base64url");
    const claimTokenHash = hashClaimToken(claimToken);
    const gift = {
      _id: giftId,
      _type: "membershipGift",
      ...giftLine,
      status: "pending",
      claimTokenHash,
      createdAt: existing?.createdAt || nowIso(),
    };

    await draftClient.createIfNotExists(gift);

    const emailSent = await sendGiftClaimEmail({ gift: { ...gift, _id: giftId }, claimToken });
    if (emailSent) {
      await draftClient.patch(giftId).set({ claimEmailSentAt: nowIso() }).commit();
    }

    processed.push({ id: giftId, status: emailSent ? "email_sent" : "pending_email" });
  }

  return {
    giftLinesFound: giftLines.length,
    processed,
  };
};

export const getGiftByClaimToken = async (token) => {
  const claimTokenHash = hashClaimToken(token);
  return draftClient.fetch(`*[_type == "membershipGift" && claimTokenHash == $claimTokenHash][0]`, {
    claimTokenHash,
  });
};

export const claimMembershipGift = async ({ token, session, deliveryAddress }) => {
  const gift = await getGiftByClaimToken(token);
  if (!gift) {
    return { ok: false, status: 404, error: "Gift not found." };
  }

  if (gift.status !== "pending") {
    return { ok: false, status: 409, error: "This gift has already been claimed or is no longer available." };
  }

  const sessionEmail = normalizeEmail(session?.email);
  const recipientEmail = normalizeEmail(gift.recipientEmail);

  if (!sessionEmail || sessionEmail !== recipientEmail) {
    return { ok: false, status: 403, error: "Please sign in with the recipient email address to claim this gift." };
  }

  if (!session?.shopifyCustomerId) {
    return { ok: false, status: 401, error: "Missing Shopify customer account." };
  }

  const claimedAt = nowIso();
  const endsAt = addMonths(new Date(claimedAt), Number(gift.durationMonths || 12)).toISOString();
  const entitlementId = getEntitlementDocumentId(gift._id);

  const entitlement = {
    _id: entitlementId,
    _type: "membershipEntitlement",
    source: "gift",
    sourceGiftId: gift._id,
    shopifyCustomerId: session.shopifyCustomerId,
    email: sessionEmail,
    tier: gift.tier,
    status: "active",
    startsAt: claimedAt,
    endsAt,
    createdFromOrderId: gift.orderId,
    createdFromLineItemId: gift.lineItemId,
  };

  const transaction = draftClient.transaction();
  transaction.createIfNotExists(entitlement);
  transaction.patch(gift._id, (patch) =>
    patch.set({
      status: "claimed",
      claimedAt,
      claimedByEmail: sessionEmail,
      claimedByShopifyCustomerId: session.shopifyCustomerId,
      entitlementId,
      deliveryAddress,
    }),
  );

  await transaction.commit();

  return {
    ok: true,
    gift: {
      id: gift._id,
      tier: gift.tier,
      endsAt,
    },
  };
};

export const getActiveGiftEntitlementForCustomer = async (shopifyCustomerId) => {
  if (!shopifyCustomerId) return null;

  return draftClient.fetch(
    `*[
      _type == "membershipEntitlement" &&
      shopifyCustomerId == $shopifyCustomerId &&
      status == "active" &&
      dateTime(startsAt) <= dateTime(now()) &&
      dateTime(endsAt) > dateTime(now())
    ] | order(dateTime(endsAt) desc)[0]`,
    { shopifyCustomerId },
  );
};

export const timingSafeCompare = (a, b) => {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
};
