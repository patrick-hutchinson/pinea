import {verifyRedemptionToken, giftLinkSecret} from './redemption.ts';
import {createGiftCheckout} from './checkout.ts';

const headers = {'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow'};

export function createGiftRedemptionHandler(deps = {
  secret: giftLinkSecret,
  checkout: createGiftCheckout,
}) {
  return async (request: Request): Promise<Response> => {
    let token: string;
    try {
      token = request.method === 'POST' ? String((await request.formData()).get('token') || '')
        : new URL(request.url).searchParams.get('token') || '';
    } catch { return new Response('Invalid gift link.', {status: 400, headers}); }
    const gift = verifyRedemptionToken(token, deps.secret());
    if (!gift) return new Response('Invalid gift link / Ungueltiger Geschenk-Link.', {status: 400, headers});
    try {
      const checkout = new URL(await deps.checkout(gift));
      if (checkout.protocol !== 'https:') throw new Error('Invalid checkout URL');
      return new Response(null, {status: request.method === 'POST' ? 303 : 302,
        headers: {...headers, Location: checkout.toString()}});
    } catch {
      return new Response(gift.language === 'en'
        ? 'The gift code could not be applied. It may already have been redeemed. Please contact P.IN.E.A.'
        : 'Der Code konnte nicht angewendet werden. Er wurde eventuell bereits eingeloest. Bitte kontaktiere P.IN.E.A.',
      {status: 400, headers});
    }
  };
}

export const redeemGift = createGiftRedemptionHandler();
