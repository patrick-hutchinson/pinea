import { notFound, redirect } from "next/navigation";
import { getCountries, getOpenCallsWithAccess, getSiteData } from "@/lib/fetch";

import { isAuthEnabled } from "@/lib/runtimeFlags";

import { getSessionFromCookies } from "@/lib/auth/session";
import { getCustomerSubscriptionStatus } from "@/lib/shopifySubscriptions";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";
const [site] = await Promise.all([getSiteData()]);

export default async function ProfilePage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const showSubscriptionDebug =
    resolvedSearchParams?.debug_sub === "1" ||
    process.env.DEBUG_SHOPIFY_SUBSCRIPTIONS === "1" ||
    process.env.NODE_ENV !== "production";

  if (!isAuthEnabled) {
    notFound();
  }
  const session = await getSessionFromCookies();
  const resolvedSession = session?.email ? session : null;

  if (!resolvedSession?.email) {
    redirect("/api/auth/shopify/start?returnTo=/profile");
  }

  const manageSubscriptionUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL || "";
  const [countries, openCalls, subscriptionStatus] = await Promise.all([
    getCountries(),
    getOpenCallsWithAccess(true),
    getCustomerSubscriptionStatus(resolvedSession?.shopifyCustomerId || null),
  ]);
  if (showSubscriptionDebug) {
    console.log("[profile] subscription status", {
      sessionEmail: resolvedSession?.email || null,
      sessionShopifyCustomerId: resolvedSession?.shopifyCustomerId || null,
      hasActiveSubscription: subscriptionStatus?.hasActiveSubscription || false,
      subscriptionName: subscriptionStatus?.subscriptionName || null,
      debug: subscriptionStatus?.debug || null,
    });
  }
  const sessionWithSubscription =
    subscriptionStatus && typeof subscriptionStatus === "object"
      ? {
          ...resolvedSession,
          ...subscriptionStatus,
        }
      : resolvedSession;
  const todayIsoDate = new Date().toISOString().slice(0, 10);
  const membersOnlyOpenCallsCount = (openCalls || []).filter((openCall) => {
    if (!openCall?.membersOnlyContent) return false;
    if (!openCall?.deadline) return false;
    return openCall.deadline >= todayIsoDate;
  }).length;

  return (
    <ProfileClient
      session={sessionWithSubscription}
      showSubscriptionDebug={showSubscriptionDebug}
      manageSubscriptionUrl={manageSubscriptionUrl}
      site={site}
      countries={countries}
      membersOnlyOpenCallsCount={membersOnlyOpenCallsCount}
    />
  );
}
