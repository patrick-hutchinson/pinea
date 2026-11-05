import { cartContainsSubscription, isSubscriptionCartLine } from "@/helpers/shopCart";
import { addToCart, getCart, updateCartLine } from "@/lib/shopify";
import { getAbsoluteRequestUrl, sendMethodNotAllowed } from "@/lib/pages/api";

const ONE_SUBSCRIPTION_ERROR = "You can only purchase one subscription.";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  const language = req.query?.language || req.body?.language || "de";
  if (req.method === "GET") {
    try {
      const { searchParams } = getAbsoluteRequestUrl(req);
      const cartId = searchParams.get("cartId");

      if (!cartId) {
        res.status(200).json({ cart: null });
        return;
      }

      const cart = await getCart(cartId, language);
      if (searchParams.get("checkout") === "1") {
        if (!cart?.checkoutUrl) return res.status(404).json({error: "Cart unavailable."});
        const checkout = new URL(cart.checkoutUrl);
        if (checkout.protocol !== "https:") throw new Error("Invalid Shopify checkout URL.");
        return res.redirect(302, checkout.toString());
      }
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
        const existingCart = await getCart(body.cartId, language);
        if (cartContainsSubscription(existingCart)) {
          res.status(400).json({ error: ONE_SUBSCRIPTION_ERROR });
          return;
        }
      }

      const cart = await addToCart({
        language,
        cartId: body?.cartId || null,
        merchandiseId: body?.merchandiseId,
        quantity: body?.quantity ?? 1,
        sellingPlanId: body?.sellingPlanId || null,
        requiresSellingPlan,
        attributes: Array.isArray(body?.attributes) ? body.attributes : [],
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
        const existingCart = await getCart(body.cartId, language);
        const existingLine = existingCart?.lines?.find((line) => line?.id === body.lineId);
        if (isSubscriptionCartLine(existingLine)) {
          res.status(400).json({ error: ONE_SUBSCRIPTION_ERROR });
          return;
        }
      }

      const cart = await updateCartLine({
        language,
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
