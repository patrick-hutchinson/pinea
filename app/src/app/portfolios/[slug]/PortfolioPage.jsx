"use client";

import Media from "@/components/Media/Media";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import MediaPair from "@/components/MediaPair/MediaPair";
import Text from "@/components/Text";
import BlurContainer from "@/components/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import OpenCall from "@/components/OpenCall/OpenCall";

import styles from "./PortfolioPage.module.css";

const Portfolio = ({ portfolios, portfolio }) => {
  console.log(portfolio, "cover");
  console.log(portfolio.cover, "cover");

  const names = portfolios.filter((portfolio) => portfolio.name).map((portfolio) => portfolio.name);
  return (
    <main className={styles.main}>
      <FilterHeader array={names} />
      <div className={styles.cover}>
        <OpenCall title={portfolio.name} text={portfolio.teaser} label={portfolio.tag} className={styles.openCall} />
        <Media medium={portfolio.cover} className={styles.coverImage} objectFit="cover" />
      </div>
      <BlurContainer className={styles.blurContainer}>
        <MediaPair className={styles.mediaPair}>
          <Text text={portfolio.article} typo="h4" />
          <Media medium={portfolio.articleImage} className={styles.articleImage} objectFit="contain" />
        </MediaPair>
        <Satellite media={portfolio.gallery} className={styles.satellite} />

        <Text text={portfolio.bio} typo="h4" />
        <MediaPair>
          {portfolio.doubleFeature.map((feature, index) => (
            <Media key={index} medium={feature.medium} />
          ))}
        </MediaPair>
      </BlurContainer>
    </main>
  );
};

export default Portfolio;
