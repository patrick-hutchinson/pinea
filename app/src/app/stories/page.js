import { getInterviews, getPortfolios, getPeople, getReviews } from "@/lib/fetch";
import OverviewPage from "@/pages/OverviewPage/OverviewPage";

export default async function Page() {
  const interviews = await getInterviews();
  const portfolios = await getPortfolios();
  const people = await getPeople();
  const reviews = await getReviews();

  const data = [...interviews, ...portfolios, ...reviews, ...people];

  return <OverviewPage data={data} />;
}
