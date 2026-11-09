import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { hasActiveMemberAccess } from "./memberAccess.js";

const normalizeEmail = (value) => typeof value === "string" ? value.trim().toLowerCase() : "";
const utcDay = (value) => {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : null;
};

export const isMembershipDateSyncPending = (session, recipients) => {
  if (!hasActiveMemberAccess(session) || session.subscriptionStatus !== "ACTIVE" || !session.contractId) return false;
  const email = normalizeEmail(session.email);
  const matches = recipients.filter((row) => normalizeEmail(row.email) === email);
  if (matches.length !== 1) return false;
  const recipient = matches[0];
  if (recipient.billing_alignment_confirmed === "true") return false;

  const billingDate = utcDay(session.effectiveNextBillingDate || session.nextBillingDate);
  const expectedDate = utcDay(recipient.renewal_date);
  if (expectedDate && billingDate === expectedDate) return false;
  if (!billingDate) return true;

  const createdAt = utcDay(session.subscriptionStartDate);
  if (!createdAt) return false;
  const initialRenewal = new Date(`${createdAt}T00:00:00Z`);
  const year = initialRenewal.getUTCFullYear() + 1;
  const month = initialRenewal.getUTCMonth();
  const day = Math.min(initialRenewal.getUTCDate(), new Date(Date.UTC(year, month + 1, 0)).getUTCDate());
  // Only the unadjusted first annual cycle needs this notice, not later renewals.
  return billingDate === utcDay(new Date(Date.UTC(year, month, day)));
};

let recipientsPromise;
const getRecipients = () => {
  if (!recipientsPromise) {
    recipientsPromise = readFile(path.join(process.cwd(), "src/app/scripts/send-codes/member-discounts.csv"), "utf8")
      .then((csv) => parse(csv, { columns: true, skip_empty_lines: true, bom: true }))
      .catch((error) => {
        recipientsPromise = null;
        throw error;
      });
  }
  return recipientsPromise;
};

export async function withMembershipDateSyncState(session) {
  let subscriptionDateSyncPending = false;
  if (hasActiveMemberAccess(session)) {
    try {
      subscriptionDateSyncPending = isMembershipDateSyncPending(session, await getRecipients());
    } catch {
      console.warn("[profile] Membership date-sync notice could not be checked.");
    }
  }
  // The recipient list and its dates never leave the server or grant membership access.
  return { ...session, subscriptionDateSyncPending };
}
