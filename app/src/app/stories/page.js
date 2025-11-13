import { getInterviews, getPortfolios, getPeople, getFeatures } from "@/lib/fetch";
import OverviewPage from "@/pages/OverviewPage";

export default async function Page() {
  const interviews = await getInterviews();
  const portfolios = await getPortfolios();
  const people = await getPeople();
  const features = await getFeatures();

  const data = [...interviews, ...portfolios, ...people, ...features];

  return <OverviewPage data={data} />;
}
