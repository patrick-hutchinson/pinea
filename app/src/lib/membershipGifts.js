import { createHash, randomBytes, timingSafeEqual } from "crypto";

import { draftClient } from "@/lib/draftClient";
import { getCustomerSubscriptionStatus, syncGiftMembershipToShopifyCustomer } from "@/lib/shopifySubscriptions";
import { isGiftReminderDue, reconcileGiftCustomers } from "./giftMembershipLifecycle";

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

const parseGiftMembershipMapping = () => {
  const mapping = {};
  for (const name of ["GIFT_MEMBERSHIP_PRODUCTS_JSON", "GIFT_MEMBERSHIP_VARIANTS_JSON"]) {
    const raw = process.env[name];
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) Object.assign(mapping, parsed);
    } catch {
      console.error(`[membershipGifts] Failed to parse ${name}.`);
    }
  }
  return mapping;
};

const getGiftMappingCandidates = (line) =>
  [
    line?.variant_id ? String(line.variant_id) : null,
    line?.variantId ? String(line.variantId) : null,
    line?.variant_admin_graphql_api_id ? String(line.variant_admin_graphql_api_id) : null,
    line?.variant_id ? `gid://shopify/ProductVariant/${line.variant_id}` : null,
    line?.product_id ? String(line.product_id) : null,
    line?.productId ? String(line.productId) : null,
    line?.product_admin_graphql_api_id ? String(line.product_admin_graphql_api_id) : null,
    line?.product_id ? `gid://shopify/Product/${line.product_id}` : null,
  ].filter(Boolean);

const getGiftConfigForLine = (line) => {
  const mapping = parseGiftMembershipMapping();
  const key = getGiftMappingCandidates(line).find((candidate) => mapping[candidate]);
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
      const productId = normalize(
        line?.product_admin_graphql_api_id ||
          (line?.product_id ? `gid://shopify/Product/${line.product_id}` : null) ||
          line?.productId ||
          line?.product_id,
      );
      const variantId = normalize(
        line?.variant_admin_graphql_api_id ||
          (line?.variant_id ? `gid://shopify/ProductVariant/${line.variant_id}` : null) ||
          line?.variantId ||
          line?.variant_id,
      );

      if (!shop || !orderId || !lineItemId || !recipientEmail) return null;

      return {
        shop,
        orderId,
        orderName,
        rawOrderId,
        lineItemId,
        productId,
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

const sendRenewalReminderEmail = async ({ entitlement }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = normalize(process.env.GIFT_MEMBERSHIP_EMAIL_FROM || process.env.PROFILE_EVENT_NOTIFICATION_FROM);

  if (!apiKey || !from) {
    throw new Error("Missing RESEND_API_KEY or GIFT_MEMBERSHIP_EMAIL_FROM for gift reminders.");
  }

  const renewUrl = `${getGiftClaimBaseUrl().replace(/\/$/, "")}/memberships`;
  const endsAt = entitlement?.endsAt ? new Date(entitlement.endsAt) : null;
  const formattedEnd = endsAt && !Number.isNaN(endsAt.getTime()) ? endsAt.toLocaleDateString("de-DE") : "soon";
  const subject = "Your P.IN.E.A gift membership ends soon";
  const text = [
    `Your gifted P.IN.E.A membership is active until ${formattedEnd}.`,
    "",
    "To continue your membership after this gifted term, please choose a recurring membership here:",
    renewUrl,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `gift-renewal/${entitlement._id}/${entitlement.endsAt}`,
    },
    body: JSON.stringify({
      from,
      to: [entitlement.email],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Gift reminder email request failed (${response.status}).`);
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

  const [subscriptionStatus, activeGiftEntitlement] = await Promise.all([
    getCustomerSubscriptionStatus(session.shopifyCustomerId),
    getActiveGiftEntitlementForCustomer(session.shopifyCustomerId),
  ]);

  if (subscriptionStatus?.hasActiveSubscription === true) {
    return {
      ok: false,
      status: 409,
      error:
        "This account already has an active recurring membership. Please contact us and we will help apply this gift correctly.",
    };
  }

  const claimedAt = nowIso();
  const giftDurationMonths = Number(gift.durationMonths || 12);
  const activeGiftEndsAt = activeGiftEntitlement?.endsAt ? new Date(activeGiftEntitlement.endsAt) : null;
  const claimDate = new Date(claimedAt);
  const startsAt =
    activeGiftEndsAt && !Number.isNaN(activeGiftEndsAt.getTime()) && activeGiftEndsAt > claimDate
      ? activeGiftEndsAt.toISOString()
      : claimedAt;
  const endsAt = addMonths(new Date(startsAt), giftDurationMonths).toISOString();
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
    startsAt,
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

  try {
    await syncGiftMembershipToShopifyCustomer({
      shopifyCustomerId: session.shopifyCustomerId,
      entitlement: await getActiveGiftEntitlementForCustomer(session.shopifyCustomerId),
    });
    await draftClient.patch(gift._id).set({ shopifyMirrorStatus: "synced", shopifyMirroredAt: nowIso() })
      .unset(["shopifyMirrorError"]).commit();
  } catch (error) {
    console.error("[membershipGifts] Failed to mirror gift membership to Shopify.", error);
    await draftClient
      .patch(gift._id)
      .set({
        shopifyMirrorStatus: "failed",
        shopifyMirrorError: error instanceof Error ? error.message : "unknown_error",
      })
      .commit();
  }

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

const loadCustomerGiftEntitlements = (customerId) => draftClient.fetch(
  `*[_type == "membershipEntitlement" && source == "gift" && shopifyCustomerId == $customerId]`,
  { customerId },
);

const recordGiftSync = async ({ entitlements, expiredIds, status, error }) => {
  const timestamp = nowIso();
  const transaction = draftClient.transaction();
  const giftIds = new Set();
  for (const entry of entitlements) {
    const fields = { shopifyMirrorStatus: status, shopifyMirrorAttemptedAt: timestamp };
    if (status === "synced") fields.shopifyMirroredAt = timestamp;
    if (error) fields.shopifyMirrorError = error;
    if (expiredIds.includes(entry._id)) fields.status = "expired";
    transaction.patch(entry._id, (patch) => {
      const next = patch.set(fields);
      return status === "synced" ? next.unset(["shopifyMirrorError"]) : next;
    });
    if (entry.sourceGiftId) giftIds.add(entry.sourceGiftId);
  }
  for (const giftId of giftIds) {
    transaction.patch(giftId, (patch) => {
      const next = patch.set({
        shopifyMirrorStatus: status, shopifyMirrorAttemptedAt: timestamp,
        ...(status === "synced" ? { shopifyMirroredAt: timestamp } : {}),
        ...(error ? { shopifyMirrorError: error } : {}),
      });
      return status === "synced" ? next.unset(["shopifyMirrorError"]) : next;
    });
  }
  if (entitlements.length) await transaction.commit();
};

export const sendGiftRenewalReminders = async ({ dryRun = false } = {}) => {
  const entitlements = await draftClient.fetch(
    `*[_type == "membershipEntitlement" && source == "gift" && status == "active"]`,
  );
  const now = new Date();
  const results = [];
  for (const entitlement of entitlements) {
    const customerEntitlements = entitlements.filter((entry) => entry.shopifyCustomerId === entitlement.shopifyCustomerId);
    if (!isGiftReminderDue(entitlement, customerEntitlements, now)) continue;
    if (dryRun) {
      results.push({ id: entitlement._id, status: "dry_run" });
      continue;
    }
    try {
      await sendRenewalReminderEmail({ entitlement });
      await draftClient.patch(entitlement._id)
        .set({ renewalReminderSentAt: nowIso() }).unset(["renewalReminderError"]).commit();
      results.push({ id: entitlement._id, status: "sent" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown reminder error";
      try {
        await draftClient.patch(entitlement._id)
          .set({ renewalReminderError: message, renewalReminderAttemptedAt: nowIso() }).commit();
      } catch {
        // Return the failure even if its diagnostic could not be saved.
      }
      results.push({ id: entitlement._id, status: "failed", error: message });
    }
  }
  return { checked: results.length, failed: results.filter((entry) => entry.status === "failed").length, results };
};

const GIFT_JOB_ID = "membershipGiftJob.daily";

const acquireGiftJobLock = async () => {
  const now = new Date();
  await draftClient.createIfNotExists({ _id: GIFT_JOB_ID, _type: "membershipGiftJob", lockedUntil: new Date(0).toISOString() });
  const job = await draftClient.getDocument(GIFT_JOB_ID);
  if (new Date(job.lockedUntil) > now) return null;
  const lockToken = randomBytes(16).toString("hex");
  try {
    await draftClient.patch(GIFT_JOB_ID).ifRevisionId(job._rev).set({
      lockToken, lockedUntil: new Date(now.getTime() + 10 * 60000).toISOString(),
      lastStartedAt: now.toISOString(), lastStatus: "running",
    }).commit();
    return lockToken;
  } catch (error) {
    if (error.statusCode === 409) return null;
    throw error;
  }
};

export const runGiftMembershipMaintenance = async ({ dryRun = false } = {}) => {
  const lockToken = dryRun ? null : await acquireGiftJobLock();
  if (!dryRun && !lockToken) return { skipped: true, reason: "already_running" };
  let result;
  try {
    const customerIds = await draftClient.fetch(
      `array::unique(*[_type == "membershipEntitlement" && source == "gift" && defined(shopifyCustomerId)].shopifyCustomerId)`,
    );
    const reconciliation = await reconcileGiftCustomers({
      customerIds,
      loadEntitlements: loadCustomerGiftEntitlements,
      syncCustomer: (shopifyCustomerId, entitlement) => syncGiftMembershipToShopifyCustomer({ shopifyCustomerId, entitlement }),
      recordSync: recordGiftSync,
      dryRun,
    });
    const reminders = await sendGiftRenewalReminders({ dryRun });
    result = { dryRun, reconciliation, reminders, failed: reconciliation.failed + reminders.failed };
    console.log("[gift-maintenance] Completed", {
      dryRun, customersChecked: reconciliation.checked, remindersChecked: reminders.checked, failed: result.failed,
    });
    if (result.failed) {
      console.error("[gift-maintenance] Failures", {
        customers: reconciliation.results.filter((entry) => entry.status === "failed"),
        reminders: reminders.results.filter((entry) => entry.status === "failed"),
      });
    }
    return result;
  } finally {
    if (lockToken) {
      const job = await draftClient.getDocument(GIFT_JOB_ID);
      if (job?.lockToken === lockToken) {
        await draftClient.patch(GIFT_JOB_ID).ifRevisionId(job._rev).set({
          lockedUntil: new Date(0).toISOString(), lastCompletedAt: nowIso(),
          lastStatus: result ? (result.failed ? "partial_failure" : "succeeded") : "failed",
          ...(result ? { customersChecked: result.reconciliation.checked, failures: result.failed } : {}),
        }).unset(["lockToken"]).commit();
      }
    }
  }
};

export const timingSafeCompare = (a, b) => {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
};
