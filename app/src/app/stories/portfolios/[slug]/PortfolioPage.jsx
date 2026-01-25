"use client";

import { useRouter } from "next/navigation";

import { translate } from "@/helpers/translate";

import Media from "@/components/Media/Media";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import MediaPair from "@/components/MediaPair/MediaPair";
import Text from "@/components/Text/Text";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import TitleBlock from "@/components/TitleBlock/TitleBlock";
import MicroFooter from "@/components/Footer/MicroFooter";
import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";
import Label from "@/components/Label/Label";
import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";
import Longcopy from "@/components/Longcopy/Longcopy";
import StickyArticleImage from "@/components/ArticleImage/StickyArticleImage";

import CoverMedia from "@/components/CoverMedia/CoverMedia";

import DoubleFeature from "@/components/DoubleFeature/DoubleFeature";

import FormatDate from "@/components/FormatDate/FormatDate";

import PersonInfo from "@/components/People/PersonInfo";

import styles from "./PortfolioPage.module.css";

import { useContext, useState } from "react";

import { StateContext } from "@/context/StateContext";

import { LanguageContext } from "@/context/LanguageContext";

import { sortAlphabetically } from "@/helpers/sort";

import { motion } from "framer-motion";

const Portfolio = ({ portfolios, portfolio }) => {
  let { language } = useContext(LanguageContext);
  const { isMobile } = useContext(StateContext);

  const router = useRouter();

  const [isTapped, setIsTapped] = useState(false);

  const handleFilter = (filter) => {
    const matchedPortfolio = portfolios.find((p) => p.name.toLowerCase() === filter.toLowerCase());
    router.push(`${matchedPortfolio.slug.current}`);
  };

  const handleTap = () => {
    console.log("tapped image");
    setIsTapped((prev) => !prev);
  };

  const array = portfolios
    .filter((p) => p.name)
    .map((p) => p.name)
    .sort((a, b) => {
      // Get last names
      const lastA = a.trim().split(" ").slice(-1)[0].toUpperCase();
      const lastB = b.trim().split(" ").slice(-1)[0].toUpperCase();

      // Compare
      return lastA.localeCompare(lastB);
    });

  return (
    <main className={styles.main}>
      <FilterHeader array={array} handleFilter={handleFilter} className={styles.filter_header} />
      <motion.div className={styles.cover} onTap={() => handleTap()}>
        <TitleBlock title={portfolio.name} text={translate(portfolio.teaser)} className={styles.openCall} />
        <CoverMedia item={portfolio.cover} useCopyrightOverlay={isMobile ? false : true}>
          <Label className={styles.label}>Portfolios</Label>
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
        </CoverMedia>

        {/* <CopyrightHover copyright={translate(portfolio.cover.medium.copyrightInternational)} isTapped={isTapped} /> */}
      </motion.div>
      <BlurContainer className={styles.blurContainer}>
        <MediaPair className={styles.mediaPair}>
          <Longcopy text={translate(portfolio.article)} />

          <StickyArticleImage item={portfolio.articleImage} className={styles.articleImage} />
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
