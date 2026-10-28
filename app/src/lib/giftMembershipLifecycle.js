export const getCurrentGiftEntitlement = (entitlements, now = new Date()) =>
  entitlements
    .filter((entry) =>
      entry.status === "active" && new Date(entry.startsAt) <= now && new Date(entry.endsAt) > now,
    )
    .sort((a, b) => new Date(b.endsAt) - new Date(a.endsAt))[0] || null;

export const isGiftReminderDue = (entitlement, customerEntitlements, now = new Date()) => {
  if (!entitlement.email || entitlement.renewalReminderSentAt) return false;
  if (getCurrentGiftEntitlement(customerEntitlements, now)?._id !== entitlement._id) return false;
  const end = new Date(entitlement.endsAt);
  if (end > new Date(now.getTime() + 7 * 86400000)) return false;
  // A queued gift continues access, so this term does not need a renewal email.
  return !customerEntitlements.some((entry) =>
    entry._id !== entitlement._id && entry.status === "active" &&
    new Date(entry.startsAt) <= end && new Date(entry.endsAt) > end,
  );
};

export const getGiftTagChanges = (existingTags, tier) => {
  const normalizedTier = String(tier || "").trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const desired = tier
    ? ["gift-membership-active", normalizedTier ? `gift-membership-tier:${normalizedTier}` : null].filter(Boolean)
    : [];
  const isGiftTag = (tag) => {
    const normalized = tag.toLowerCase();
    return normalized === "gift-membership-active" || normalized.startsWith("gift-membership-tier:");
  };
  return {
    add: desired.filter((tag) => !existingTags.includes(tag)),
    remove: existingTags.filter((tag) => isGiftTag(tag) && !desired.includes(tag)),
  };
};

export const reconcileGiftCustomers = async ({ customerIds, loadEntitlements, syncCustomer, recordSync, dryRun = false }) => {
  const results = [];
  for (const customerId of customerIds) {
    let entitlements = [];
    try {
      // Re-read per customer instead of using the job's initial snapshot for decisions.
      entitlements = await loadEntitlements(customerId);
      for (const entry of entitlements.filter((entry) => entry.status === "active")) {
        const start = new Date(entry.startsAt).getTime();
        const end = new Date(entry.endsAt).getTime();
        if (!entry.startsAt || !entry.endsAt || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
          throw new Error(`Invalid gift membership dates on ${entry._id}; Shopify state was left unchanged.`);
        }
      }
      const now = new Date();
      const current = getCurrentGiftEntitlement(entitlements, now);
      const expiredIds = entitlements.filter((entry) =>
        entry.status === "active" && new Date(entry.endsAt) <= now,
      ).map((entry) => entry._id);
      if (!dryRun) {
        await syncCustomer(customerId, current);
        await recordSync({ customerId, entitlements, expiredIds, status: "synced" });
      }
      results.push({ customerId, entitlementId: current?._id || null, expiredIds, status: dryRun ? "dry_run" : "synced" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown reconciliation error";
      if (!dryRun && entitlements.length) {
        try {
          await recordSync({ customerId, entitlements, expiredIds: [], status: "failed", error: message });
        } catch {
          // Preserve the original failure; the next run checks every gift customer again.
        }
      }
      results.push({ customerId, status: "failed", error: message });
    }
  }
  return { checked: results.length, failed: results.filter((entry) => entry.status === "failed").length, results };
};
