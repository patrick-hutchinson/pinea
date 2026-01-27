import { getInterviews, getPortfolios, getPeople, getReviews, getSpotOns } from "@/lib/fetch";
import IndexPage from "./IndexPage";

export default async function Page() {
  const interviews = await getInterviews();
  const portfolios = await getPortfolios();
  const reviews = await getReviews();
  const spotOn = await getSpotOns();

  const articles = [...interviews, ...portfolios, ...reviews, ...spotOn];

  return <IndexPage articles={articles} />;
}
