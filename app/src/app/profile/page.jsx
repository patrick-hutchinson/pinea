import { notFound, redirect } from "next/navigation";
import { getCountries, getOpenCallsWithAccess, getSiteData } from "@/lib/fetch";

import { isAuthEnabled, isLocalDevelopment } from "@/lib/runtimeFlags";

import { getSessionFromCookies } from "@/lib/auth/session";
import { getCustomerSubscriptionStatus } from "@/lib/shopifySubscriptions";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";
const [site] = await Promise.all([getSiteData()]);

export default async function ProfilePage() {
  if (!isAuthEnabled) {
    notFound();
  }
  const session = await getSessionFromCookies();
  const fallbackSession = isLocalDevelopment
    ? {
        name: "Verena Panholzer",
        email: "vp@studio-es.at",
        address: ["Siebenbrunnengasse 3", "1050 Vienna, Austria"],
        isMock: true,
      }
    : null;
  const resolvedSession = session?.email ? session : fallbackSession;

  if (!resolvedSession?.email) {
    redirect("/api/auth/shopify/start?returnTo=/profile");
  }

  const manageSubscriptionUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL || "";
  const [countries, openCalls, subscriptionStatus] = await Promise.all([
    getCountries(),
    getOpenCallsWithAccess(true),
    getCustomerSubscriptionStatus(resolvedSession?.shopifyCustomerId || null),
  ]);
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
      manageSubscriptionUrl={manageSubscriptionUrl}
      site={site}
      countries={countries}
      membersOnlyOpenCallsCount={membersOnlyOpenCallsCount}
    />
  );
}
