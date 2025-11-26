import Satellite from "@/components/Satellite/Satellite";

const PortfoliosPreview = ({ portfolios }) => {
  const portfolioImages = portfolios.map((p) => p.satelliteImage).filter(Boolean);
  const portfolioSlugs = portfolios.map((p) => p.slug).filter(Boolean);
  const portfolioCaptions = portfolios.map((p) => p.caption).filter(Boolean);

  return <Satellite media={portfolioImages} slugs={portfolioSlugs} captions={portfolioCaptions} behaviour="shrink" />;
};

export default PortfoliosPreview;
