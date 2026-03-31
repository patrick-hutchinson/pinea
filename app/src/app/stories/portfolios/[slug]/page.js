import { getPortfolios } from "@/lib/fetch";
import { notFound } from "next/navigation";
import PortfolioPage from "./PortfolioPage";

export default async function Page({ params }) {
  const { slug } = await params;

  const portfolios = await getPortfolios();

  const portfolio = portfolios.find((p) => p.slug.current === slug);
  if (!portfolio) notFound();

  return <PortfolioPage portfolios={portfolios} portfolio={portfolio} />;
}
