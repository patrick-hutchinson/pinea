import { NextResponse } from "next/server";

import { addToCart, getCart, updateCartLine } from "@/lib/shopify";
import { cartContainsSubscription, isSubscriptionCartLine } from "@/helpers/shopCart";

const ONE_SUBSCRIPTION_ERROR = "You can only purchase one subscription.";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get("cartId");

    if (!cartId) {
      return NextResponse.json({ cart: null });
    }

    const cart = await getCart(cartId);
    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch cart." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const requiresSellingPlan = Boolean(body?.requiresSellingPlan);

    if (requiresSellingPlan && Number(body?.quantity ?? 1) > 1) {
      return NextResponse.json({ error: ONE_SUBSCRIPTION_ERROR }, { status: 400 });
    }

    if (requiresSellingPlan && body?.cartId) {
      const existingCart = await getCart(body.cartId);
      if (cartContainsSubscription(existingCart)) {
        return NextResponse.json({ error: ONE_SUBSCRIPTION_ERROR }, { status: 400 });
      }
    }

    const cart = await addToCart({
      cartId: body?.cartId || null,
      merchandiseId: body?.merchandiseId,
      quantity: body?.quantity ?? 1,
      sellingPlanId: body?.sellingPlanId || null,
      requiresSellingPlan,
    });

    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add cart line." },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const requestedQuantity = Number(body?.quantity);

    if (body?.cartId && body?.lineId && requestedQuantity > 1) {
      const existingCart = await getCart(body.cartId);
      const existingLine = existingCart?.lines?.find((line) => line?.id === body.lineId);
      if (isSubscriptionCartLine(existingLine)) {
        return NextResponse.json({ error: ONE_SUBSCRIPTION_ERROR }, { status: 400 });
      }
    }

    const cart = await updateCartLine({
      cartId: body?.cartId,
      lineId: body?.lineId,
      quantity: body?.quantity,
    });

    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update cart line." },
      { status: 500 },
    );
  }
}
