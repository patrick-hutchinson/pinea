import PortfolioPage from "@/views/stories/portfolios/[slug]/PortfolioPage";
import { getPortfolios } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Portfolio({ portfolio, portfolios }) {
  return <PortfolioPage portfolio={portfolio} portfolios={portfolios} />;
}

export const getServerSideProps = withPagesShellProps(async ({ params }) => {
  const portfolios = await getPortfolios();
  const portfolio = portfolios.find((item) => item.slug?.current === params?.slug);

  if (!portfolio) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      portfolio,
      portfolios,
    },
  };
});
