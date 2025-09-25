import { getPictureBrush, getPortfolios, getFeatures } from "@/lib/fetch";

import Home from "./Home";

export default async function Page() {
  const [pictureBrush] = await Promise.all([getPictureBrush()]);
  const [portfolios] = await Promise.all([getPortfolios()]);
  const [features] = await Promise.all([getFeatures()]);

  return <Home pictureBrush={pictureBrush} portfolios={portfolios} features={features} />;
}
