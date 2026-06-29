import { useMemo } from "react";
import Satellite from "@/components/Satellite/Satellite";

const PortfoliosPreview = ({ portfolios }) => {
  const portfolioItems = useMemo(
    () =>
      (portfolios || [])
        .map((portfolio) => ({
          medium: portfolio?.satelliteImage?.medium,
          slug: portfolio?.slug,
          caption: portfolio?.name?.toUpperCase(),
        }))
        .filter((item) => item.medium && item.slug?.current),
    [portfolios],
  );
  const portfolioImages = useMemo(() => portfolioItems.map((item) => ({ medium: item.medium })), [portfolioItems]);
  const portfolioSlugs = useMemo(() => portfolioItems.map((item) => item.slug), [portfolioItems]);
  const portfolioCaptions = useMemo(() => portfolioItems.map((item) => item.caption).filter(Boolean), [portfolioItems]);

  return <Satellite media={portfolioImages} slugs={portfolioSlugs} captions={portfolioCaptions} behaviour="shrink" />;
};

export default PortfoliosPreview;
