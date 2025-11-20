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
import MicroFooter from "@/components/Footer/MicroFooter";
import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";

import { motion } from "framer-motion";
import FormatDate from "@/components/FormatDate/FormatDate";

import { useTheme } from "next-themes";

import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";
import PersonInfo from "@/components/People/PersonInfo";

import styles from "./PortfolioPage.module.css";

import { useCallback, useContext, useEffect } from "react";

import { LanguageContext } from "@/context/LanguageContext";

const Portfolio = ({ portfolios, portfolio }) => {
  let { language } = useContext(LanguageContext);
  const { theme, setTheme } = useTheme();

  console.log(portfolio, "portfolio");
  const router = useRouter();

  const handleFilter = (filter) => {
    const matchedPortfolio = portfolios.find((p) => p.name.toLowerCase() === filter.toLowerCase());
    router.push(`${matchedPortfolio.slug.current}`);
  };

  const renderSide = useCallback((side) => {
    if (!side) return null;

    const hasCopyright = side.medium.copyrightInternational;
    if (side.type === "slideshow") {
      console.log(side.medium.copyrightInternational, "slideshow copyright");
    }

    switch (side.type) {
      case "media":
        return (
          <Media
            medium={side.medium}
            copyright={<Text text={translate(side.medium.copyrightInternational)} />}
            mediaPairImage={hasCopyright && true}
          />
        );
      case "slideshow":
        return <Slideshow media={side.medium.gallery} />;
      default:
        return null;
    }
  }, []);

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
          {language === "en" ? "by" : "von"} {portfolio.author},{" "}
          <FormatDate
            date={portfolio.releaseDate}
            format={{
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }}
          />
        </div>
        {/* <div typo="h5" className={styles.copyright}>
          {<Text text={translate(portfolio.cover?.medium?.copyrightInternational)} />}
        </div> */}
        <CopyrightHover copyright={translate(portfolio.articleImage.medium.copyrightInternational)} />
      </div>
      <BlurContainer className={styles.blurContainer}>
        <MediaPair className={styles.mediaPair}>
          <Text text={translate(portfolio.article)} typo="longcopy" />
          <ExpandMedia
            medium={portfolio.articleImage.medium}
            objectFit="cover"
            className={styles.articleImage}
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
        <MicroFooter />
      </BlurContainer>
    </main>
  );
};

export default Portfolio;
