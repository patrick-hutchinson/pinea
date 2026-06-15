import { redirect } from "next/navigation";
import {
  getCountries,
  getDownloadableArticlesCount,
  getMembersOnlyOpenCallsCount,
  getSiteData,
} from "@/lib/fetch";

import { isAuthEnabled } from "@/lib/runtimeFlags";

import { getMembershipSession } from "@/lib/auth/membershipSession";
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
    redirect("/");
  }
  const resolvedSession = await getMembershipSession();

  if (!resolvedSession?.email) {
    redirect("/api/auth/shopify/start?returnTo=/profile");
  }

  const manageAccountUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL || "";
  const manageSubscriptionUrl = process.env.SHOPIFY_SUBSCRIPTION_MANAGEMENT_URL || "";
  const [countries, membersOnlyOpenCallsCount, downloadableArticlesCount] = await Promise.all([
    getCountries(),
    getMembersOnlyOpenCallsCount(),
    getDownloadableArticlesCount(),
  ]);
  if (showSubscriptionDebug) {
    console.log("[profile] subscription status", {
      sessionEmail: resolvedSession?.email || null,
      sessionShopifyCustomerId: resolvedSession?.shopifyCustomerId || null,
      hasActiveSubscription: resolvedSession?.hasActiveSubscription || false,
      subscriptionName: resolvedSession?.subscriptionName || null,
      debug: resolvedSession?.debug || null,
    });
  }
  return (
    <ProfileClient
      session={resolvedSession}
      showSubscriptionDebug={showSubscriptionDebug}
      manageAccountUrl={manageAccountUrl}
      manageSubscriptionUrl={manageSubscriptionUrl}
      site={site}
      countries={countries}
      membersOnlyOpenCallsCount={membersOnlyOpenCallsCount}
      downloadableArticlesCount={downloadableArticlesCount}
    />
  );
}
