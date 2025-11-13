import { getPortfolios } from "@/lib/fetch";
import PortfolioPage from "./PortfolioPage";

export default async function Page({ params }) {
  const { slug } = params;

  const portfolios = await getPortfolios();

  const portfolio = portfolios.find((p) => p.slug.current === slug);

  return <PortfolioPage portfolios={portfolios} portfolio={portfolio} />;
}
