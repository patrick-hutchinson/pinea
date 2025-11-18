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

import { useTheme } from "next-themes";

import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";
import PersonInfo from "@/components/People/PersonInfo";

import styles from "./PortfolioPage.module.css";

import { useEffect } from "react";

import { MediaPairImage } from "@/components/Media/Image";

const Portfolio = ({ portfolios, portfolio }) => {
  const { theme, setTheme } = useTheme();

  const router = useRouter();

  const handleFilter = (filter) => {
    const matchedPortfolio = portfolios.find((p) => p.name.toLowerCase() === filter.toLowerCase());
    router.push(`${matchedPortfolio.slug.current}`);
  };

  useEffect(() => {
    portfolio.darkmode ? setTheme("dark") : setTheme("light");
  }, [portfolio]);

  const renderSide = (side) => {
    if (!side) return null;
    const hasCopyright = side.medium.copyrightInternational;

    console.log(side.medium, "side");
    switch (side.type) {
      case "media":
        return (
          <Media
            medium={side.medium}
            // copyright={translate(side.medium.copyrightIntl)}
            copyright={<Text text={translate(side.medium.copyrightInternational)} />}
            mediaPairImage={hasCopyright && true}
          />
        );
      case "slideshow":
        return <Slideshow media={side.medium.gallery} mediaPairImage={hasCopyright && true} />;
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
          text={translate(portfolio.teaser)}
          label={translate(portfolio.label.title)}
          className={styles.openCall}
        />
        <Media medium={portfolio.cover?.medium} className={styles.coverImage} objectFit="cover" />
        <div typo="longcopy" className={styles.name}>
          by {portfolio.author}
        </div>
        <div typo="h5" className={styles.copyright}>
          {/* {translate(portfolio.cover?.medium?.copyrightIntl)} */}
          {<Text text={translate(portfolio.cover?.medium?.copyrightInternational)} />}
        </div>
      </div>
      <BlurContainer className={styles.blurContainer}>
        <MediaPair className={styles.mediaPair}>
          <Text text={translate(portfolio.article)} typo="longcopy" />
          <ExpandMedia
            medium={portfolio.articleImage.medium}
            className={styles.articleImage}
            // copyright={translate(portfolio.articleImage.medium.copyrightIntl)}
            copyright={<Text text={translate(portfolio.articleImage.medium.copyrightInternational)} />}
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
