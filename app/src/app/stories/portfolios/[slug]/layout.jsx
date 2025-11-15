import { getPortfolios } from "@/lib/fetch";
import { ThemeSetter } from "@/controllers/ThemeSetter";

export default async function Layout({ children, params }) {
  const { slug } = params;

  const portfolios = await getPortfolios();
  const portfolio = portfolios.find((p) => p.slug.current === slug);

  return (
    <>
      <ThemeSetter mode={portfolio.darkmode ? "dark" : "light"} />
      {children}
    </>
  );
}
