"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { StateContext } from "@/context/StateContext";
import { LanguageContext } from "@/context/LanguageContext";

import { translate } from "@/helpers/translate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import MediaPair from "@/components/MediaPair/MediaPair";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import TitleBlock from "@/components/TitleBlock/TitleBlock";
import Satellite from "@/components/Satellite/Satellite";
import Label from "@/components/Label/Label";
import Longcopy from "@/components/Longcopy/Longcopy";
import ArticleImage from "@/components/ArticleImage/ArticleImage";
import CoverMedia from "@/components/CoverMedia/CoverMedia";
import DoubleFeature from "@/components/DoubleFeature/DoubleFeature";
import FormatDate from "@/components/FormatDate/FormatDate";
import PersonInfo from "@/components/People/PersonInfo";
import MicroFooter from "@/components/Footer/MicroFooter";

import styles from "./PortfolioPage.module.css";

const Portfolio = ({ portfolios, portfolio }) => {
  const mediaPairRef = useRef(null);
  const [mediaPairHeight, setMediaPairHeight] = useState(null);

  let { language } = useContext(LanguageContext);
  const { isMobile } = useContext(StateContext);

  const router = useRouter();

  const handleFilter = (filter) => {
    const matchedPortfolio = portfolios.find((p) => p.name.toLowerCase() === filter.toLowerCase());
    router.push(`${matchedPortfolio.slug.current}`);
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

  useEffect(() => {
    if (!mediaPairRef.current) return;

    setMediaPairHeight(med);
  }, []);

  return (
    <main className={styles.main}>
      <FilterHeader array={array} handleFilter={handleFilter} className={styles.filter_header} />
      <motion.div className={styles.cover}>
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
      </motion.div>
      <BlurContainer className={styles.blurContainer}>
        <MediaPair className={styles.mediaPair}>
          <Longcopy text={translate(portfolio.article)} />

          <ArticleImage item={portfolio.articleImage} className={styles.articleImage} />
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
