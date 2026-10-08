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
      site={site}
    />
  );
}

export const getServerSideProps = withPagesShellProps(async ({ req }) => {
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

  return {
    props: {
      countries,
      downloadableArticlesCount,
      manageAccountUrl,
      manageSubscriptionUrl,
      membersOnlyOpenCallsCount,
      session: resolvedSession,
      site,
    },
  };
});
