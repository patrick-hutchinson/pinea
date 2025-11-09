import {
  getPictureBrush,
  getPortfolios,
  getFeatures,
  getPeriodical,
  getAnnouncements,
  getOpenCalls,
  getEvents,
  getHomePage,
} from "@/lib/fetch";

import HomePage from "./HomePage";

export default async function Page() {
  const [pictureBrush] = await Promise.all([getPictureBrush()]);
  const [portfolios] = await Promise.all([getPortfolios()]);
  const [features] = await Promise.all([getFeatures()]);
  const [periodical] = await Promise.all([getPeriodical()]);
  const [announcements] = await Promise.all([getAnnouncements()]);
  const [openCalls] = await Promise.all([getOpenCalls()]);
  const [events] = await Promise.all([getEvents()]);
  const [homePage] = await Promise.all([getHomePage()]);

  return (
    <HomePage
      pictureBrush={pictureBrush}
      portfolios={portfolios}
      features={features}
      periodical={periodical}
      announcements={announcements}
      openCalls={openCalls}
      events={events}
      homePage={homePage}
    />
  );
}
