import countries from "world-countries";
import ManageProfilePage from "@/views/profile/ManageProfilePage";
import { getMembershipSessionFromRequest } from "@/lib/auth/membershipSession";
import { getSessionFromRequest } from "@/lib/pages/api";
import { getCustomerProfile } from "@/lib/shopifyCustomerProfile";
import { withPagesShellProps } from "@/lib/pages/shellData";
import { isAuthEnabled } from "@/lib/runtimeFlags";

export default ManageProfilePage;

export const getServerSideProps = withPagesShellProps(async ({ req, res }) => {
  res.setHeader("Cache-Control", "private, no-store");
  if (!isAuthEnabled) return { redirect: { destination: "/", permanent: false } };
  const identity = getSessionFromRequest(req);
  if (!identity?.email || !identity?.shopifyCustomerId) {
    return { redirect: { destination: "/api/auth/shopify/start?returnTo=/profile/manage", permanent: false } };
  }

  let profile = null;
  let loadError = "";
  try {
    profile = await getCustomerProfile(identity.shopifyCustomerId);
  } catch (error) {
    console.error("[profile/manage] Could not load Shopify customer.", error);
    loadError = "Could not load your profile. Please try again.";
  }
  const membership = await getMembershipSessionFromRequest(req);
  const recurring = ["ACTIVE", "PAUSED"].includes(profile?.subscriberStatus);
  return { props: {
    initialProfile: profile,
    loadError,
    countries: countries.map(country => ({ code: country.cca2, name: country.name.common }))
      .sort((a, b) => a.name.localeCompare(b.name, "en")),
    membership: {
      active: membership.hasActiveSubscription === true,
      tier: membership.subscriptionName || membership.giftMembership?.tier || null,
      startsAt: membership.subscriptionStartDate || membership.giftMembership?.startsAt || null,
      endsAt: membership.giftMembership?.endsAt || null,
      nextBillingDate: recurring ? membership.nextBillingDate || identity.nextBillingDate || null : null,
      gift: Boolean(membership.giftMembership),
    },
    paymentUrl: process.env.SHOPIFY_SUBSCRIPTION_MANAGEMENT_URL || process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL || "",
  } };
});
