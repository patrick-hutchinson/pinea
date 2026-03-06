import { useMemo } from "react";
import Satellite from "@/components/Satellite/Satellite";

const PortfoliosPreview = ({ portfolios }) => {
  const portfolioImages = useMemo(() => (portfolios || []).map((p) => p.satelliteImage).filter(Boolean), [portfolios]);
  const portfolioSlugs = useMemo(() => (portfolios || []).map((p) => p.slug).filter(Boolean), [portfolios]);
  const portfolioCaptions = useMemo(() => (portfolios || []).map((p) => p.name?.toUpperCase()).filter(Boolean), [portfolios]);

  return <Satellite media={portfolioImages} slugs={portfolioSlugs} captions={portfolioCaptions} behaviour="shrink" />;
};

export default PortfoliosPreview;
