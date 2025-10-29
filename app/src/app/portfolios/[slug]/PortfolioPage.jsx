"use client";

import { useRouter } from "next/navigation";

import Media from "@/components/Media/Media";
import FilterHeader from "@/components/FilterHeader/FilterHeader";
import MediaPair from "@/components/MediaPair/MediaPair";
import Text from "@/components/Text";
import BlurContainer from "@/components/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import OpenCall from "@/components/OpenCall/OpenCall";

import styles from "./PortfolioPage.module.css";

const Portfolio = ({ portfolios, portfolio }) => {
  const router = useRouter();

  console.log(portfolio, "cover");
  console.log(portfolio.cover, "cover");

  const handleFilter = (filter) => {
    const matchedPortfolio = portfolios.find((p) => p.name.toLowerCase() === filter.toLowerCase());
    router.push(`/portfolios/${matchedPortfolio.slug.current}`);
  };

  const names = portfolios.filter((portfolio) => portfolio.name).map((portfolio) => portfolio.name);
  return (
    <main className={styles.main}>
      <FilterHeader array={names} handleFilter={handleFilter} />
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

        <Text text={portfolio.bio} typo="h4" className={styles.bio} />
        <MediaPair className={styles.doubleFeature}>
          {portfolio.doubleFeature.map((feature, index) => (
            <Media key={index} medium={feature.medium} />
          ))}
        </MediaPair>
      </BlurContainer>
    </main>
  );
};

export default Portfolio;
