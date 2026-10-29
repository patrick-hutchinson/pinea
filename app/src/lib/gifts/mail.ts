import { createHash } from "node:crypto";
import { createRedemptionLink, giftLinkSecret } from "./redemption.ts";
import type { GiftConfig } from "./types.ts";
import type { GiftMail } from "./processor.ts";

export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

export function giftEmailContent(mail: GiftMail, config: GiftConfig) {
  const link = createRedemptionLink(config.redemptionBaseUrl, {
    code: mail.unit.code, variantId: mail.state.variantId, sellingPlanId: mail.state.sellingPlanId, cycles: mail.state.cycles,
  }, giftLinkSecret());
  const manage = process.env.SHOPIFY_SUBSCRIPTION_MANAGEMENT_URL || `https://${config.shop}/account`;
  const greeting = mail.recipientName ? `Hallo ${mail.recipientName},` : "Hallo,";
  const intro = mail.copy ? "Hier ist deine Kopie des versendeten Membership-Geschenks."
    : `${mail.buyerName} schenkt dir eine P.IN.E.A Membership.`;
  const terms = `Der Code gewaehrt 100 % Rabatt auf die Membership fuer die ersten ${mail.state.cycles} Abrechnungszyklen ab Einloesung. Du schliesst dabei ein automatisch verlaengertes Abonnement ab und hinterlegst deine eigene Zahlungsmethode. Ab der darauffolgenden Abrechnung gilt der regulaere Preis. Das konkrete Datum und die Konditionen siehst du im Checkout. Eventuelle Versandkosten sind nicht durch den Produkt-Rabatt abgedeckt.`;
  const cancellation = "Du kannst das Abo vor der naechsten kostenpflichtigen Verlaengerung in deiner Abo-Verwaltung kuendigen.";
  const subject = mail.copy ? "Deine Kopie: P.IN.E.A Membership-Geschenk" : "Du hast eine P.IN.E.A Membership geschenkt bekommen";
  const text = [greeting, intro, mail.message, `Dein Code: ${mail.unit.code}`, `Einloesen: ${link}`, terms, cancellation, `Abo verwalten: ${manage}`].filter(Boolean).join("\n\n");
  const paragraph = (value: string) => `<p>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`;
  const html = `<html lang="de"><body>${paragraph(greeting)}${paragraph(intro)}${mail.message ? paragraph(mail.message) : ""}
    <p><strong>${escapeHtml(mail.unit.code)}</strong></p><p><a href="${escapeHtml(link)}">Membership einloesen</a></p>
    ${paragraph(terms)}${paragraph(cancellation)}<p><a href="${escapeHtml(manage)}">Abo verwalten</a></p></body></html>`;
  return { subject, text, html };
}

async function sendEmail(from: string, to: string, key: string, content: { subject: string; text: string; html?: string }) {
  if (!process.env.RESEND_API_KEY) throw new Error("Missing Resend configuration");
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": key,
      },
      body: JSON.stringify({ from, to: [to], ...content }), signal: AbortSignal.timeout(20_000),
    });
    if (response.ok) return;
    if (attempt < 3 && (response.status === 429 || response.status >= 500)) {
      const seconds = Number(response.headers.get("retry-after")) || 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, Math.min(5000, seconds * 1000)));
      continue;
    }
    throw new Error(`Gift email request failed (${response.status})`);
  }
}

export async function sendGiftEmail(mail: GiftMail, config: GiftConfig) {
  const key = createHash("sha256").update(`${mail.orderId}/${mail.unit.key}/${mail.copy ? "buyer" : "recipient"}`).digest("hex");
  await sendEmail(config.from, mail.to, `membership-gift/${key}`, giftEmailContent(mail, config));
}

export async function sendGiftAlert(orderId: string, webhookId: string, stage: string) {
  const from = process.env.GIFT_MEMBERSHIP_EMAIL_FROM;
  const to = process.env.ADMIN_EMAIL;
  if (!from || !to) throw new Error("Missing gift alert configuration");
  const key = createHash("sha256").update(`${orderId}/${webhookId}/${stage}`).digest("hex");
  await sendEmail(from, to, `membership-gift-alert/${key}`, {
    subject: "P.IN.E.A: Membership-Geschenk braucht Aufmerksamkeit",
    text: `Bestellung: ${orderId}\nWebhook: ${webhookId}\nSchritt: ${stage}\n\nBitte in Shopify gift.discount_code und gift.delivery_state pruefen. Dort sind alle erzeugten Codes und Versandstaende gespeichert. Den Webhook nach Fehlerbehebung erneut zustellen oder fehlende Mails manuell nachsenden. Bei Zeitueberschreitung eine bestehende Sperre zehn Minuten ablaufen lassen.`,
  });
}
