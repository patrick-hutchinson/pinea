import { getInterviews, getPortfolios, getVoices, getFeatures } from "@/lib/fetch";
import OverviewPage from "@/pages/OverviewPage";

export default async function Page() {
  const interviews = await getInterviews();
  const portfolios = await getPortfolios();
  const voices = await getVoices();
  const features = await getFeatures();

  const data = [...interviews, ...portfolios, ...voices, ...features];

  return <OverviewPage data={data} />;
}
