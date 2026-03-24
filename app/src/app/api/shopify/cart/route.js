import { NextResponse } from "next/server";

import { addToCart, getCart, updateCartLine } from "@/lib/shopify";

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
    const cart = await addToCart({
      cartId: body?.cartId || null,
      merchandiseId: body?.merchandiseId,
      quantity: body?.quantity ?? 1,
      sellingPlanId: body?.sellingPlanId || null,
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
