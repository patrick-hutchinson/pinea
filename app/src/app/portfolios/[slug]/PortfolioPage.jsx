"use client";

import { useRouter } from "next/navigation";

import { translate } from "@/helpers/translate";

import Media from "@/components/Media/Media";
import Slideshow from "@/components/Slideshow/Slideshow";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import MediaPair from "@/components/MediaPair/MediaPair";
import Text from "@/components/Text";
import BlurContainer from "@/components/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";

import styles from "./PortfolioPage.module.css";

const Portfolio = ({ portfolios, portfolio }) => {
  console.log(portfolio, "portfolio");
  const router = useRouter();

  const handleFilter = (filter) => {
    const matchedPortfolio = portfolios.find((p) => p.name.toLowerCase() === filter.toLowerCase());
    router.push(`/portfolios/${matchedPortfolio.slug.current}`);
  };

  const renderSide = (side) => {
    if (!side) return null;

    switch (side.type) {
      case "media":
        return <Media medium={side.medium} />;
      case "slideshow":
        return <Slideshow images={side.medium.gallery} />;
      default:
        return null;
    }
  };

  const names = portfolios.filter((portfolio) => portfolio.name).map((portfolio) => portfolio.name);
  return (
    <main className={styles.main}>
      <FilterHeader array={names} handleFilter={handleFilter} />
      <div className={styles.cover}>
        <HeadlineBlock
          title={portfolio.name}
          text={portfolio.teaser}
          label={translate(portfolio.label.title)}
          color={portfolio.textColor}
          className={styles.openCall}
        />
        <Media medium={portfolio.cover?.medium} className={styles.coverImage} objectFit="cover" />
      </div>
      <BlurContainer className={styles.blurContainer}>
        <MediaPair className={styles.mediaPair}>
          <Text text={portfolio.article} typo="h4" />
          <Media medium={portfolio.articleImage.medium} className={styles.articleImage} objectFit="contain" />
        </MediaPair>
        <Satellite media={portfolio.gallery} className={styles.satellite} />

        <Text text={portfolio.bio} typo="h4" className={styles.bio} />
        <MediaPair className={styles.doubleFeature}>
          <div>{renderSide(portfolio.doubleFeature.left)}</div>
          <div>{renderSide(portfolio.doubleFeature.right)}</div>
        </MediaPair>
      </BlurContainer>
    </main>
  );
};

export default Portfolio;
