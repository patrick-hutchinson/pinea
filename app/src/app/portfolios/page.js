import { getPortfolios } from "@/lib/fetch";
import PortfoliosPage from "./PortfoliosPage";

export default async function Page() {
  const portfolios = await getPortfolios();

  return <PortfoliosPage portfolios={portfolios} />;
}
