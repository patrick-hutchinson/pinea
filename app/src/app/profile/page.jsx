import { notFound, redirect } from "next/navigation";
import { getSiteData } from "@/lib/fetch";

import { isAuthEnabled, isLocalDevelopment } from "@/lib/runtimeFlags";

import { getSessionFromCookies } from "@/lib/auth/session";
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
    redirect("/login");
  }

  const manageSubscriptionUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL || "";

  return <ProfileClient session={resolvedSession} manageSubscriptionUrl={manageSubscriptionUrl} site={site} />;
}
