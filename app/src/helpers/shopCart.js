export const cartContainsSubscription = (cart) =>
  Array.isArray(cart?.lines) &&
  cart.lines.some((line) => Boolean(line?.sellingPlanId || line?.product?.isSubscription));

export const isSubscriptionCartLine = (line) => Boolean(line?.sellingPlanId || line?.product?.isSubscription);
