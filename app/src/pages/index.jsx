import HomePage from "@/views/home/HomePage";
import { hasActiveMemberAccess } from "@/lib/auth/memberAccess";
import { getMembershipSessionFromRequest } from "@/lib/auth/membershipSession";
import {
  getEvents,
  getHomePage,
  getNewsWithAccess,
  getOpenCallsWithAccess,
  getPictureBrush,
  getPortfolios,
  getSiteData,
} from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Home({ events, homePage, news, openCalls, pictureBrush, portfolios, site }) {
  return (
    <HomePage
      events={events}
      homePage={homePage}
      news={news}
      openCalls={openCalls}
      pictureBrush={pictureBrush}
      portfolios={portfolios}
      site={site}
    />
  );
}

export const getServerSideProps = withPagesShellProps(async (context) => {
  const session = await getMembershipSessionFromRequest(context.req);
  const canViewMembersOnlyContent = hasActiveMemberAccess(session);

  const [pictureBrush, portfolios, openCalls, news, events, homePage, site] = await Promise.all([
    getPictureBrush(),
    getPortfolios(),
    getOpenCallsWithAccess(canViewMembersOnlyContent),
    getNewsWithAccess(canViewMembersOnlyContent),
    getEvents(),
    getHomePage(),
    getSiteData(),
  ]);

  return {
    props: {
      events,
      homePage,
      news,
      openCalls,
      pictureBrush,
      portfolios,
      site,
    },
  };
});
