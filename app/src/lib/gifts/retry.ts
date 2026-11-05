import {randomUUID, timingSafeEqual} from 'node:crypto';
import {getGiftConfig} from './config.ts';
import {GiftProcessingFailure, processGiftOrder} from './processor.ts';
import type {GiftDependencies} from './processor.ts';
import {ensureGiftDiscount, loadGiftState, saveGiftState} from './shopify.ts';
import {sendGiftEmail} from './mail.ts';
import {giftFailureDetails} from './diagnostics.ts';
import {loadGiftRetryOrder, normalizeGiftOrderId} from './retryOrder.ts';
import {getShopifyAdminAccessDiagnostics} from '../shopifySubscriptions.js';

export function createGiftRetryHandler(deps: {
  getSecret: () => string | undefined;
  getConfig: typeof getGiftConfig;
  loadOrder: typeof loadGiftRetryOrder;
  loadState: GiftDependencies['loadState'];
  saveState: GiftDependencies['saveState'];
  ensureDiscount: GiftDependencies['ensureDiscount'];
  sendMail: typeof sendGiftEmail;
  accessDiagnostics?: () => Promise<Record<string, unknown>>;
}) {
  return async (request: Request): Promise<Response> => {
    const reply = (body: unknown, status = 200) => Response.json(body, {status,
      headers: {'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff'}});
    if (request.method !== 'POST') return reply({error: 'POST required'}, 405);
    const secret = deps.getSecret();
    if (!secret || secret.length < 32) return reply({error: 'GIFT_RETRY_SECRET must be configured with at least 32 characters'}, 503);
    const expected = Buffer.from(`Bearer ${secret}`);
    const received = Buffer.from(request.headers.get('authorization') || '');
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return reply({error: 'Unauthorized'}, 401);
    let body;
    try {
      const raw = await request.text();
      if (raw.length > 2048) return reply({error: 'Request too large'}, 413);
      body = JSON.parse(raw);
    } catch { return reply({error: 'Invalid JSON'}, 400); }
    const orderId = normalizeGiftOrderId(body?.orderId);
    if (!orderId || (body.send !== undefined && typeof body.send !== 'boolean')) return reply({error: 'Invalid orderId or send flag'}, 400);
    const send = body.send === true;
    const retryId = randomUUID();
    let stage = 'configuration';
    try {
      const config = deps.getConfig();
      stage = 'load_order';
      const snapshot = await deps.loadState(orderId);
      if (!snapshot.payable) return reply({retryId, orderId, status: 'not_paid_or_cancelled'}, 409);
      if (snapshot.state?.complete || (snapshot.marker && !snapshot.state)) return reply({retryId, orderId, status: 'already_processed'});
      if (snapshot.state && Date.parse(snapshot.state.leaseUntil) > Date.now()) return reply({retryId, orderId, status: 'already_running'}, 409);
      stage = 'load_order_details';
      const order = await deps.loadOrder(orderId);
      const giftLines = order.line_items.filter((line) => !line.selling_plan_allocation &&
        Boolean(config.giftVariants[`gid://shopify/ProductVariant/${String(line.variant_id).split('/').pop()}`]));
      if (!giftLines.length) return reply({retryId, orderId, status: 'ignored', reason: 'no_matching_gift_variant'}, 422);
      if (!send) return reply({retryId, orderId, status: 'dry_run', giftLineCount: giftLines.length,
        giftQuantity: giftLines.reduce((sum, line) => sum + line.quantity, 0),
        hasDeliveryState: Boolean(snapshot.state),
        deliveries: snapshot.state?.units.map((unit) => ({key: unit.key, codeCreated: Boolean(unit.created),
          recipientSent: Boolean(unit.recipientSent), buyerSent: Boolean(unit.buyerSent)})) || [],
        note: 'No codes created and no emails sent. Use --send to process this order.',
      });
      stage = 'process_order';
      const result = await processGiftOrder(order, config, {loadState: deps.loadState, saveState: deps.saveState,
        ensureDiscount: deps.ensureDiscount, sendMail: (mail) => deps.sendMail(mail, config)});
      console.log('[membership-gift] Manual retry finished', {retryId, orderId, ...result});
      return reply({retryId, orderId, ...result}, result.status === 'already_running' || result.status === 'not_paid_or_cancelled' ? 409 : 200);
    } catch (error) {
      const details = error instanceof GiftProcessingFailure ? error.details : giftFailureDetails(error);
      let adminAccess;
      if (details.reason === 'shopify_access_denied' && deps.accessDiagnostics) {
        try { adminAccess = await deps.accessDiagnostics(); }
        catch (diagnosticError) { adminAccess = {diagnosticFailure: giftFailureDetails(diagnosticError)}; }
      }
      stage = error instanceof GiftProcessingFailure ? error.stage : stage;
      console.error('[membership-gift] Manual retry failed', {retryId, orderId, stage, ...details});
      return reply({error: 'Gift retry failed', retryId, orderId, stage, ...details, ...(adminAccess ? {adminAccess} : {})}, 500);
    }
  };
}

export const retryGiftOrder = createGiftRetryHandler({getSecret: () => process.env.GIFT_RETRY_SECRET,
  getConfig: getGiftConfig, loadOrder: loadGiftRetryOrder, loadState: loadGiftState,
  saveState: saveGiftState, ensureDiscount: ensureGiftDiscount, sendMail: sendGiftEmail,
  accessDiagnostics: getShopifyAdminAccessDiagnostics});
