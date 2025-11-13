import { getPortfolios } from "@/lib/fetch";
import OverviewPage from "@/pages/OverviewPage";

export default async function Page() {
  const portfolios = await getPortfolios();

  const data = [...portfolios];

  return <OverviewPage data={data} />;
}
