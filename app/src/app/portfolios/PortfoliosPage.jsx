import Link from "next/link";

const PortfoliosPage = ({ portfolios }) => {
  console.log(portfolios);
  return portfolios.map((portfolio, index) => {
    console.log(portfolio);
    return (
      <Link key={index} href={`/portfolios/${portfolio.slug.current}`}>
        {portfolio.name}
      </Link>
    );
  });
};

export default PortfoliosPage;
