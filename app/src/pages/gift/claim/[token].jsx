import GiftClaimPage from "@/views/gift/GiftClaimPage";
import { getGiftByClaimToken } from "@/lib/membershipGifts";
import { getSessionFromRequest } from "@/lib/pages/api";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function GiftClaim({ error, gift, loginUrl, sessionEmail, token }) {
  return <GiftClaimPage error={error} gift={gift} loginUrl={loginUrl} sessionEmail={sessionEmail} token={token} />;
}

export const getServerSideProps = withPagesShellProps(async ({ params, req }) => {
  const token = typeof params?.token === "string" ? params.token : "";
  const gift = token ? await getGiftByClaimToken(token) : null;
  const session = getSessionFromRequest(req);
  const returnTo = `/gift/claim/${encodeURIComponent(token)}`;
  const loginHint = gift?.recipientEmail ? `&login_hint=${encodeURIComponent(gift.recipientEmail)}` : "";

  if (!gift) {
    return {
      props: {
        error: "This gift link is invalid.",
        gift: null,
        loginUrl: `/api/auth/shopify/start?returnTo=${encodeURIComponent(returnTo)}${loginHint}`,
        sessionEmail: session?.email || null,
        token,
      },
    };
  }

  return {
    props: {
      error:
        gift.status !== "pending"
          ? "This gift has already been claimed or is no longer available."
          : null,
      gift: {
        recipientEmail: gift.recipientEmail,
        tier: gift.tier,
        message: gift.message || "",
      },
      loginUrl: `/api/auth/shopify/start?returnTo=${encodeURIComponent(returnTo)}${loginHint}`,
      sessionEmail: session?.email || null,
      token,
    },
  };
});
