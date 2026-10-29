import { verifyRedemptionToken, giftLinkSecret } from "@/lib/gifts/redemption.ts";
import { createGiftCheckout } from "@/lib/gifts/checkout.ts";
import { escapeHtml } from "@/lib/gifts/mail.ts";

export const runtime = "nodejs";

const headers = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const gift = verifyRedemptionToken(token, giftLinkSecret());
  if (!gift) return new Response("Dieser Geschenk-Link ist ungueltig.", { status: 400, headers });
  // An explicit POST prevents email link scanners from creating carts.
  return new Response(`<!doctype html><html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>P.IN.E.A Membership einloesen</title></head>
    <body><main><h1>Deine P.IN.E.A Membership</h1><p>Code: <strong>${escapeHtml(gift.code)}</strong></p>
    <p>Die ersten ${gift.cycles} Abrechnungszyklen der Membership werden zu 100 % rabattiert. Im Shopify-Checkout hinterlegst du deine eigene Zahlungsmethode.
    Danach verlaengert sich das Abo zum regulaeren Preis. Das genaue Zahlungsdatum und etwaige Versandkosten werden im Checkout angezeigt.
    Du kannst vor der kostenpflichtigen Verlaengerung in deiner Abo-Verwaltung kuendigen.</p>
    <form method="post" action="/api/gifts/redeem"><input type="hidden" name="token" value="${escapeHtml(token)}"><button type="submit">Weiter zum Shopify-Checkout</button></form>
    </main></body></html>`, { headers: { ...headers, "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": "default-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'" } });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const gift = verifyRedemptionToken(String(form.get("token") || ""), giftLinkSecret());
  if (!gift) return new Response("Ungueltiger Geschenk-Link.", { status: 400, headers });
  try {
    const checkout = await createGiftCheckout(gift);
    return new Response(null, { status: 303, headers: { ...headers, Location: checkout } });
  } catch {
    return new Response("Der Code konnte nicht angewendet werden. Er wurde eventuell bereits eingeloest. Bitte kontaktiere P.IN.E.A.", { status: 400, headers });
  }
}
