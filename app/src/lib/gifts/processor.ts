import { randomUUID } from "node:crypto";
import { generateGiftCode } from "./code.ts";
import { shopifyGid } from "./config.ts";
import { GiftConflict } from "./shopify.ts";
import type { Snapshot } from "./shopify.ts";
import type { DeliveryState, GiftConfig, GiftOrder, GiftUnit } from "./types.ts";

export type GiftMail = {
  to: string; buyerName: string; recipientName: string; message: string;
  orderId: string; unit: GiftUnit; state: DeliveryState; copy: boolean;
};
export type GiftDependencies = {
  loadState: (orderId: string) => Promise<Snapshot>;
  saveState: (orderId: string, state: DeliveryState, digest: string | null) => Promise<string>;
  ensureDiscount: (orderId: string, key: string, code: string, state: DeliveryState) => Promise<void>;
  sendMail: (mail: GiftMail) => Promise<void>;
};

export class GiftProcessingFailure extends Error {
  stage: string;
  constructor(stage: string) { super("Gift processing failed"); this.stage = stage; }
}

const email = (value = "") => {
  const normalized = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error("Invalid gift email");
  return normalized;
};

export async function processGiftOrder(order: GiftOrder, config: GiftConfig, deps: GiftDependencies) {
  const lines = order.line_items.filter((line) =>
    String(line.variant_id).replace("gid://shopify/ProductVariant/", "") === config.giftVariantId.split("/").pop() && !line.selling_plan_allocation,
  );
  if (!lines.length) return { status: "ignored" };
  const orderId = order.admin_graphql_api_id || shopifyGid("Order", String(order.id));
  let stage = "load_order";
  let state: DeliveryState | null = null;
  let digest: string | null = null;
  let leased = false;
  try {
    const snapshot = await deps.loadState(orderId);
    if (!snapshot.payable) return { status: "not_paid_or_cancelled" };
    if (snapshot.state?.complete || (snapshot.marker && !snapshot.state)) return { status: "already_processed" };
    if (snapshot.state && new Date(snapshot.state.leaseUntil) > new Date()) return { status: "already_running" };
    stage = "validate_recipient";
    const buyerEmail = email(order.email || order.contact_email || order.customer?.email);
    const buyerName = [order.customer?.first_name || order.billing_address?.first_name,
      order.customer?.last_name || order.billing_address?.last_name].filter(Boolean).join(" ").slice(0, 200) || "P.IN.E.A Kunde";
    const units = lines.flatMap((line) => {
      if (!Number.isSafeInteger(line.quantity) || line.quantity < 1) throw new Error("Invalid gift quantity");
      const property = (name: string) => line.properties?.find((entry) => entry.name.toLowerCase() === name.toLowerCase())?.value?.trim() || "";
      const recipientEmail = email(property("Recipient email") || buyerEmail);
      return Array.from({ length: line.quantity }, (_, index) => ({
        key: `${line.id}:${index + 1}`, recipientEmail,
        recipientName: property("Recipient name").slice(0, 200), message: property("Message").slice(0, 2000),
      }));
    });
    state = snapshot.state || {
      version: 1, startedAt: new Date().toISOString(), cycles: config.cycles,
      productId: config.membershipProductId, variantId: config.membershipVariantId, sellingPlanId: config.sellingPlanId,
      leaseUntil: "", leaseToken: "", units: units.map(({ key }) => ({ key, code: generateGiftCode() })),
    };
    if (state.units.some((unit) => !units.some((details) => details.key === unit.key))) throw new Error("Gift order lines changed");
    state.leaseUntil = new Date(Date.now() + 10 * 60_000).toISOString();
    state.leaseToken = randomUUID();
    stage = "reserve_codes";
    digest = await deps.saveState(orderId, state, snapshot.digest);
    leased = true;
    const checkpoint = async () => { digest = await deps.saveState(orderId, state!, digest); };
    for (const unit of state.units) {
      const details = units.find((entry) => entry.key === unit.key)!;
      if (!unit.created) {
        stage = "create_discount";
        await deps.ensureDiscount(orderId, unit.key, unit.code, state);
        unit.created = true;
        stage = "save_discount";
        await checkpoint();
      }
      const mail = { buyerName, recipientName: details.recipientName, message: details.message, orderId, unit, state };
      if (!unit.recipientSent) {
        stage = "email_recipient";
        await deps.sendMail({ ...mail, to: details.recipientEmail, copy: false });
        unit.recipientSent = true;
        stage = "save_recipient_delivery";
        await checkpoint();
      }
      if (!unit.buyerSent) {
        if (buyerEmail !== details.recipientEmail) {
          stage = "email_buyer";
          await deps.sendMail({ ...mail, to: buyerEmail, copy: true });
        }
        unit.buyerSent = true;
        stage = "save_buyer_delivery";
        await checkpoint();
      }
    }
    stage = "complete_order";
    state.complete = true;
    state.leaseUntil = new Date(0).toISOString();
    await checkpoint();
    leased = false;
    return { status: "completed", codes: state.units.length };
  } catch (error) {
    if (error instanceof GiftConflict) return { status: "already_running" };
    throw new GiftProcessingFailure(stage);
  } finally {
    if (leased && state) {
      // Keep generated codes and completed deliveries on failure, but allow manual replay immediately.
      state.leaseUntil = new Date(0).toISOString();
      try { await deps.saveState(orderId, state, digest); } catch { /* Lease expires if storage is unavailable. */ }
    }
  }
}
