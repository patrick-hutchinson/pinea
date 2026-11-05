import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRedemptionLink, giftLinkSecret } from "./redemption.ts";
import type { GiftConfig } from "./types.ts";
import type { GiftMail } from "./processor.ts";
import {normalizeGiftLanguage} from '../../helpers/giftMembershipOptions.js';
import {GiftEmailDeliveryError} from './resendError.ts';

export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

export function giftEmailContent(mail: GiftMail, config: GiftConfig, sentAt = new Date()) {
  const language = normalizeGiftLanguage(mail.language || mail.unit.language);
  const link = createRedemptionLink(config.redemptionBaseUrl, {
    code: mail.unit.code, variantId: mail.unit.variantId, sellingPlanId: mail.unit.sellingPlanId, cycles: mail.state.cycles,
    language,
  }, giftLinkSecret());
  const manage = process.env.SHOPIFY_SUBSCRIPTION_MANAGEMENT_URL || `https://${config.shop}/account`;
  const english = language === "en";
  const greeting = english ? "Dear customer," : "Liebe:r Kund:in,";
  const intro = english
    ? mail.copy ? "Here is your copy of the membership gift email." : `${mail.buyerName} has gifted you a P.IN.E.A membership.`
    : mail.copy ? "Hier ist deine Kopie des versendeten Membership-Geschenks." : `${mail.buyerName} hat dir eine P.IN.E.A Membership geschenkt.`;
  const terms = english
    ? `The code gives you 100% off the membership for the first ${mail.state.cycles} billing cycles after redemption. You are starting an automatically renewing subscription and must provide your own payment method. The regular price applies from the following billing cycle. The exact date and terms are shown at checkout. Any shipping costs are not covered by the product discount.`
    : `Der Code gewaehrt 100 % Rabatt auf die Membership fuer die ersten ${mail.state.cycles} Abrechnungszyklen ab Einloesung. Du schliesst dabei ein automatisch verlaengertes Abonnement ab und hinterlegst deine eigene Zahlungsmethode. Ab der darauffolgenden Abrechnung gilt der regulaere Preis. Das konkrete Datum und die Konditionen siehst du im Checkout. Eventuelle Versandkosten sind nicht durch den Produkt-Rabatt abgedeckt.`;
  const cancellation = english ? "You can cancel before the next paid renewal through your subscription management page."
    : "Du kannst das Abo vor der naechsten kostenpflichtigen Verlaengerung in deiner Abo-Verwaltung kuendigen.";
  const subject = english ? mail.copy ? "Your copy: P.IN.E.A membership gift" : "You have been gifted a membership!"
    : mail.copy ? "Deine Kopie: P.IN.E.A Membership-Geschenk" : "Du hast eine P.IN.E.A Membership geschenkt bekommen";
  const messageTitle = english ? "You have been gifted a membership!" : "Du hast eine Membership geschenkt bekommen!";
  const message = mail.message.trim();
  const text = [greeting, intro, messageTitle, message ? `"${message}"` : "",
    `${english ? "Your code" : "Dein Code"}: ${mail.unit.code}`, `${english ? "Redeem" : "Einloesen"}: ${link}`,
    terms, cancellation, `${english ? "Manage subscription" : "Abo verwalten"}: ${manage}`].filter(Boolean).join("\n\n");
  const templatePath = path.join(process.cwd(), `src/app/scripts/send-codes/${english ? "gift-mail.en.html" : "gift-mail.html"}`);
  const template = fs.readFileSync(templatePath, "utf8");
  const values = {
    sendDate: new Intl.DateTimeFormat("en-GB", {month: "2-digit", year: "numeric", timeZone: "Europe/Zurich"}).format(sentAt),
    greeting: escapeHtml(greeting), intro: escapeHtml(intro),
    messageBlock: `<p style="margin:0 0 12px;font:inherit;line-height:inherit">${messageTitle}</p>` + (message
      ? `<p style="margin:0 0 24px;font:inherit;line-height:inherit"><em>${english ? '&ldquo;' : '&bdquo;'}${escapeHtml(message).replace(/\r\n?/g, "\n").replace(/\n/g, "<br />")}&rdquo;</em></p>` : ""),
    code: escapeHtml(mail.unit.code), checkoutUrl: escapeHtml(link),
    terms: escapeHtml(terms), cancellation: escapeHtml(cancellation), manageUrl: escapeHtml(manage),
  };
  for (const key of Object.keys(values)) {
    if (!template.includes(`{{${key}}}`)) throw new Error("Gift email template is missing a required placeholder");
  }
  // Substitute once so customer text containing dollar signs or template syntax stays literal.
  const html = template.replace(/\{\{(sendDate|greeting|intro|messageBlock|code|checkoutUrl|terms|cancellation|manageUrl)\}\}/g, (_, key) => values[key]);
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
    const payload = await response.json().catch(() => null);
    throw new GiftEmailDeliveryError(response.status, payload);
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
