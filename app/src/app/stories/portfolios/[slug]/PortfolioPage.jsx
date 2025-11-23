"use client";

import { useRouter } from "next/navigation";

import { translate } from "@/helpers/translate";

import Media from "@/components/Media/Media";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import MediaPair from "@/components/MediaPair/MediaPair";
import Text from "@/components/Text/Text";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";
import MicroFooter from "@/components/Footer/MicroFooter";
import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";
import Label from "@/components/Label/Label";
import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";

import DoubleFeature from "@/components/DoubleFeature/DoubleFeature";

import FormatDate from "@/components/FormatDate/FormatDate";

import PersonInfo from "@/components/People/PersonInfo";

import styles from "./PortfolioPage.module.css";

import { useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";

const Portfolio = ({ portfolios, portfolio }) => {
  let { language } = useContext(LanguageContext);

  console.log(portfolio, "portfolio");
  const router = useRouter();

  const handleFilter = (filter) => {
    const matchedPortfolio = portfolios.find((p) => p.name.toLowerCase() === filter.toLowerCase());
    router.push(`${matchedPortfolio.slug.current}`);
  };

  const names = portfolios.filter((portfolio) => portfolio.name).map((portfolio) => portfolio.name);
  return (
    <main className={styles.main}>
      <FilterHeader array={names} handleFilter={handleFilter} className={styles.filter_header} />
      <div className={styles.cover}>
        <Label className={styles.label}>Portfolio</Label>
        <HeadlineBlock title={portfolio.name} text={translate(portfolio.teaser)} className={styles.openCall} />
        <Media medium={portfolio.cover?.medium} className={styles.coverImage} objectFit="cover" showCrop={true} />
        <div typo="h4" className={styles.name}>
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
        <CopyrightHover copyright={translate(portfolio.articleImage.medium.copyrightInternational)} />
      </div>
      <BlurContainer className={styles.blurContainer}>
        <MediaPair className={styles.mediaPair}>
          <Text text={translate(portfolio.article)} typo="longcopy" className={styles.longcopy} />
          <CalendarExpandMedia
            medium={portfolio.articleImage.medium}
            objectFit="cover"
            className={styles.articleImage}
            copyright={<Text text={translate(portfolio.articleImage.medium.copyrightInternational)} />}
          />
        </MediaPair>
        <Satellite media={portfolio.gallery} className={styles.satellite} behaviour="expand" />

        {portfolio.doubleFeature && <DoubleFeature item={portfolio.doubleFeature} />}

        <PersonInfo person={portfolio} className={styles.voice} />
        <MicroFooter />
      </BlurContainer>
    </main>
  );
};

export default Portfolio;
