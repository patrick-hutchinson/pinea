import {
  getPictureBrush,
  getPortfolios,
  getFeatures,
  getPeriodical,
  getOpenCalls,
  getEvents,
  getNews,
  getHomePage,
  getSiteData,
} from "@/lib/fetch";

import HomePage from "./(home)/HomePage";

export default async function Page() {
  const [pictureBrush] = await Promise.all([getPictureBrush()]);
  const [portfolios] = await Promise.all([getPortfolios()]);
  const [features] = await Promise.all([getFeatures()]);
  const [periodical] = await Promise.all([getPeriodical()]);
  const [openCalls] = await Promise.all([getOpenCalls()]);
  const [news] = await Promise.all([getNews()]);
  const [events] = await Promise.all([getEvents()]);
  const [homePage] = await Promise.all([getHomePage()]);
  const [site] = await Promise.all([getSiteData()]);

  return (
    <HomePage
      pictureBrush={pictureBrush}
      portfolios={portfolios}
      features={features}
      periodical={periodical}
      openCalls={openCalls}
      events={events}
      homePage={homePage}
      site={site}
      news={news}
    />
  );
}
