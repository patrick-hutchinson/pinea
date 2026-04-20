import {
  getPictureBrush,
  getPortfolios,
  getOpenCallsWithAccess,
  getEvents,
  getNewsWithAccess,
  getHomePage,
  getSiteData,
} from "@/lib/fetch";
import { getSessionFromCookies } from "@/lib/auth/session";
import { hasActiveMemberAccess } from "@/lib/auth/memberAccess";

import HomePage from "./(home)/HomePage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSessionFromCookies();
  const canViewMembersOnlyContent = hasActiveMemberAccess(session);

  const [pictureBrush] = await Promise.all([getPictureBrush()]);
  const [portfolios] = await Promise.all([getPortfolios()]);

  const [openCalls] = await Promise.all([getOpenCallsWithAccess(canViewMembersOnlyContent)]);
  const [news] = await Promise.all([getNewsWithAccess(canViewMembersOnlyContent)]);
  const [events] = await Promise.all([getEvents()]);
  const [homePage] = await Promise.all([getHomePage()]);
  const [site] = await Promise.all([getSiteData()]);

  return (
    <HomePage
      pictureBrush={pictureBrush}
      portfolios={portfolios}
      openCalls={openCalls}
      events={events}
      homePage={homePage}
      site={site}
      news={news}
    />
  );
}
