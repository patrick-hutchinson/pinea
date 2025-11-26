import { getInterviews, getPortfolios, getPeople, getReviews, getSpotOns } from "@/lib/fetch";
import OverviewPage from "./OverviewPage";

export default async function Page() {
  const interviews = await getInterviews();
  const portfolios = await getPortfolios();
  const people = await getPeople();
  const reviews = await getReviews();
  const spotOn = await getSpotOns();

  const data = [...interviews, ...portfolios, ...reviews, ...spotOn, , ...people];

  return <OverviewPage data={data} />;
}
