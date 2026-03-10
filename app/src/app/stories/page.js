import { getVisits, getPortfolios, getPeople, getReviews, getSpotOns } from "@/lib/fetch";
import StoriesPage from "./StoriesPage";

export default async function Page() {
  const visits = await getVisits();
  const portfolios = await getPortfolios();
  const people = await getPeople();
  const reviews = await getReviews();
  const spotOn = await getSpotOns();

  const data = [...visits, ...portfolios, ...reviews, ...spotOn, ...people];

  return <StoriesPage data={data} />;
}
