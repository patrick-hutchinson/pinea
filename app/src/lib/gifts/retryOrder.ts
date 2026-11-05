import {giftAdminRequest} from './shopify.ts';
import type {GiftOrder} from './types.ts';

export const normalizeGiftOrderId = (value: unknown): string | null => {
  if (typeof value !== 'string' || !/^(?:gid:\/\/shopify\/Order\/)?[1-9]\d*$/.test(value)) return null;
  return `gid://shopify/Order/${value.split('/').pop()}`;
};

const RETRY_ORDER_QUERY = `query GiftRetryOrder($id: ID!, $after: String) {
  order(id: $id) {
    id email
    customer { firstName lastName }
    billingAddress { firstName lastName }
    lineItems(first: 100, after: $after) {
      nodes {
        id quantity currentQuantity
        variant { id }
        sellingPlan { name }
        customAttributes { key value }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}`;

export async function loadGiftRetryOrder(orderId: string, request = giftAdminRequest): Promise<GiftOrder> {
  const id = normalizeGiftOrderId(orderId);
  if (!id) throw new Error('Invalid gift retry order ID');
  const lines: GiftOrder['line_items'] = [];
  const seen = new Set<string>();
  let after: string | null = null;
  let order: any;
  for (let page = 0; page < 100; page++) {
    const data = await request(RETRY_ORDER_QUERY, {id, after});
    const current = data?.order;
    if (!current || current.id !== id) throw new Error('Gift order not accessible');
    order ||= current;
    const connection = current.lineItems;
    if (!Array.isArray(connection?.nodes) || typeof connection?.pageInfo?.hasNextPage !== 'boolean') {
      throw new Error('Incomplete gift retry order');
    }
    for (const line of connection.nodes) {
      if (!/^gid:\/\/shopify\/LineItem\/\d+$/.test(line.id) || !Number.isSafeInteger(line.quantity) || line.quantity < 1) {
        throw new Error('Invalid gift retry line');
      }
      // An edited/refunded order needs manual review rather than issuing excess gifts.
      if (line.currentQuantity !== line.quantity) throw new Error('Gift retry order quantities changed');
      lines.push({id: line.id.split('/').pop(), variant_id: line.variant?.id || '', quantity: line.quantity,
        selling_plan_allocation: line.sellingPlan || undefined,
        properties: (line.customAttributes || []).map((attribute: {key: string; value: string}) => ({name: attribute.key, value: attribute.value})),
      });
    }
    if (!connection.pageInfo.hasNextPage) return {
      id: id.split('/').pop()!, admin_graphql_api_id: id, email: order.email || undefined,
      customer: order.customer ? {first_name: order.customer.firstName, last_name: order.customer.lastName} : undefined,
      billing_address: order.billingAddress ? {first_name: order.billingAddress.firstName, last_name: order.billingAddress.lastName} : undefined,
      line_items: lines,
    };
    const cursor = connection.pageInfo.endCursor;
    if (typeof cursor !== 'string' || !cursor || seen.has(cursor)) throw new Error('Incomplete gift retry order');
    seen.add(cursor);
    after = cursor;
  }
  throw new Error('Incomplete gift retry order');
}
