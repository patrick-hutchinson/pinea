import { getInterviews, getPortfolios, getPrintArticles, getReviews, getSpotOns } from "@/lib/fetch";
import IndexPage from "./IndexPage";

export default async function Page() {
  const interviews = await getInterviews();
  const portfolios = await getPortfolios();
  const reviews = await getReviews();
  const spotOn = await getSpotOns();
  const print = await getPrintArticles();

  const articles = [...interviews, ...portfolios, ...reviews, ...spotOn, ...print];

  return <IndexPage articles={articles} />;
}
