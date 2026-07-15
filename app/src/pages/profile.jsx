import ProfileClient from "@/views/profile/ProfileClient";
import { getMembershipSessionFromRequest } from "@/lib/auth/membershipSession";
import {
  getCountries,
  getDownloadableArticlesCount,
  getMembersOnlyOpenCallsCount,
  getSiteData,
} from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";
import { isAuthEnabled } from "@/lib/runtimeFlags";

export default function Profile({
  countries,
  downloadableArticlesCount,
  manageAccountUrl,
  manageSubscriptionUrl,
  membersOnlyOpenCallsCount,
  session,
  showSubscriptionDebug,
  site,
}) {
  return (
    <ProfileClient
      countries={countries}
      downloadableArticlesCount={downloadableArticlesCount}
      manageAccountUrl={manageAccountUrl}
      manageSubscriptionUrl={manageSubscriptionUrl}
      membersOnlyOpenCallsCount={membersOnlyOpenCallsCount}
      session={session}
      showSubscriptionDebug={showSubscriptionDebug}
      site={site}
    />
  );
}

export const getServerSideProps = withPagesShellProps(async ({ query, req }) => {
  const showSubscriptionDebug =
    query?.debug_sub === "1" ||
    process.env.DEBUG_SHOPIFY_SUBSCRIPTIONS === "1" ||
    process.env.NODE_ENV !== "production";

  if (!isAuthEnabled) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const resolvedSession = await getMembershipSessionFromRequest(req);

  if (!resolvedSession?.email) {
    return {
      redirect: {
        destination: "/api/auth/shopify/start?returnTo=/profile",
        permanent: false,
      },
    };
  }

  const manageAccountUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL || "";
  const manageSubscriptionUrl = process.env.SHOPIFY_SUBSCRIPTION_MANAGEMENT_URL || "";
  const [site, countries, membersOnlyOpenCallsCount, downloadableArticlesCount] = await Promise.all([
    getSiteData(),
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
      subscriptionStartDate: resolvedSession?.subscriptionStartDate || null,
      isMemberPlus: resolvedSession?.isMemberPlus || false,
      subscriptionLines: resolvedSession?.subscriptionLines || [],
      debug: resolvedSession?.debug || null,
    });
  }

  return {
    props: {
      countries,
      downloadableArticlesCount,
      manageAccountUrl,
      manageSubscriptionUrl,
      membersOnlyOpenCallsCount,
      session: resolvedSession,
      showSubscriptionDebug,
      site,
    },
  };
});
