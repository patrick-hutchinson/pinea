// Keep the original Shopify webhook URL working without a POST redirect.
export {POST} from '../../../webhooks/shopify/orders-paid/route';

export const runtime = 'nodejs';
export const maxDuration = 300;
