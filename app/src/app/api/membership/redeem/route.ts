import { NextRequest, NextResponse } from "next/server";

import { createMembershipCheckout } from "@/lib/membership-checkout.ts";
import { membershipRedemptionSecret, verifyMembershipRedemptionToken } from "@/lib/membership-redemption.ts";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const redemption = verifyMembershipRedemptionToken(
    request.nextUrl.searchParams.get("token") || "",
    membershipRedemptionSecret(),
  );
  if (!redemption) return new Response("Dieser Membership-Link ist ungueltig.", { status: 400 });

  try {
    const checkoutUrl = await createMembershipCheckout(redemption);
    return NextResponse.redirect(checkoutUrl, 302);
  } catch {
    return new Response("Der Membership-Link konnte nicht zum Checkout weiterleiten.", { status: 400 });
  }
}
