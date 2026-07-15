import { cartContainsSubscription, isSubscriptionCartLine } from "@/helpers/shopCart";
import { addToCart, getCart, updateCartLine } from "@/lib/shopify";
import { getAbsoluteRequestUrl, sendMethodNotAllowed } from "@/lib/pages/api";

const ONE_SUBSCRIPTION_ERROR = "You can only purchase one subscription.";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { searchParams } = getAbsoluteRequestUrl(req);
      const cartId = searchParams.get("cartId");

      if (!cartId) {
        res.status(200).json({ cart: null });
        return;
      }

      const cart = await getCart(cartId);
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch cart." });
    }
    return;
  }

  if (req.method === "POST") {
    try {
      const body = req.body;
      const requiresSellingPlan = Boolean(body?.requiresSellingPlan);

      if (requiresSellingPlan && Number(body?.quantity ?? 1) > 1) {
        res.status(400).json({ error: ONE_SUBSCRIPTION_ERROR });
        return;
      }

      if (requiresSellingPlan && body?.cartId) {
        const existingCart = await getCart(body.cartId);
        if (cartContainsSubscription(existingCart)) {
          res.status(400).json({ error: ONE_SUBSCRIPTION_ERROR });
          return;
        }
      }

      const cart = await addToCart({
        cartId: body?.cartId || null,
        merchandiseId: body?.merchandiseId,
        quantity: body?.quantity ?? 1,
        sellingPlanId: body?.sellingPlanId || null,
        requiresSellingPlan,
      });

      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to add cart line." });
    }
    return;
  }

  if (req.method === "PATCH") {
    try {
      const body = req.body;
      const requestedQuantity = Number(body?.quantity);

      if (body?.cartId && body?.lineId && requestedQuantity > 1) {
        const existingCart = await getCart(body.cartId);
        const existingLine = existingCart?.lines?.find((line) => line?.id === body.lineId);
        if (isSubscriptionCartLine(existingLine)) {
          res.status(400).json({ error: ONE_SUBSCRIPTION_ERROR });
          return;
        }
      }

      const cart = await updateCartLine({
        cartId: body?.cartId,
        lineId: body?.lineId,
        quantity: body?.quantity,
      });

      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update cart line." });
    }
    return;
  }

  sendMethodNotAllowed(res, ["GET", "POST", "PATCH"]);
}
