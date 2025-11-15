"use client";

import { useRouter } from "next/navigation";

import { translate } from "@/helpers/translate";

import Media from "@/components/Media/Media";
import Slideshow from "@/components/Slideshow/Slideshow";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import MediaPair from "@/components/MediaPair/MediaPair";
import Text from "@/components/Text/Text";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";

import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";
import PersonInfo from "@/components/People/PersonInfo";

import styles from "./PortfolioPage.module.css";

import { useEffect } from "react";

const Portfolio = ({ portfolios, portfolio }) => {
  const router = useRouter();

  const handleFilter = (filter) => {
    const matchedPortfolio = portfolios.find((p) => p.name.toLowerCase() === filter.toLowerCase());
    router.push(`${matchedPortfolio.slug.current}`);
  };

  const renderSide = (side) => {
    if (!side) return null;

    switch (side.type) {
      case "media":
        return <Media medium={side.medium} />;
      case "slideshow":
        return <Slideshow media={side.medium.gallery} />;
      default:
        return null;
    }
  };

  const names = portfolios.filter((portfolio) => portfolio.name).map((portfolio) => portfolio.name);
  return (
    <main className={styles.main}>
      <FilterHeader array={names} handleFilter={handleFilter} className={styles.filter_header} />
      <div className={styles.cover}>
        <HeadlineBlock
          title={portfolio.name}
          text={portfolio.teaser}
          label={translate(portfolio.label.title)}
          className={styles.openCall}
        />
        <Media medium={portfolio.cover?.medium} className={styles.coverImage} objectFit="cover" />
        <div typo="longcopy" className={styles.name}>
          {portfolio.name}
        </div>
        <div typo="h5" className={styles.copyright}>
          {portfolio.cover?.medium?.copyright}
        </div>
      </div>
      <BlurContainer className={styles.blurContainer}>
        <MediaPair className={styles.mediaPair}>
          <Text text={portfolio.article} typo="longcopy" />
          <ExpandMedia
            medium={portfolio.articleImage.medium}
            className={styles.articleImage}
            copyright={portfolio.articleImage.medium.copyright}
          />
        </MediaPair>
        <Satellite media={portfolio.gallery} className={styles.satellite} />

        {/* <Text text={portfolio.bio} typo="h4" className={styles.bio} /> */}

        {portfolio.doubleFeature && (
          <MediaPair className={styles.doubleFeature}>
            <div>{renderSide(portfolio.doubleFeature.left)}</div>
            <div>{renderSide(portfolio.doubleFeature.right)}</div>
          </MediaPair>
        )}

        <PersonInfo person={portfolio} className={styles.voice} />
      </BlurContainer>
    </main>
  );
};

export default Portfolio;
