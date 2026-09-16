"use client";

import { useContext, useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

import { StateContext } from "@/context/StateContext";
import { LanguageContext } from "@/context/LanguageContext";

import { translate } from "@/helpers/translate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import MediaPair from "@/components/MediaPair/MediaPair";
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
import Footnotes from "@/components/Footnotes/Footnotes";

import styles from "./PortfolioPage.module.css";

const Portfolio = ({ portfolios, portfolio }) => {
  const mediaPairRef = useRef(null);
  const coverRef = useRef(null);
  const safePortfolio = portfolio || {};
  const safePortfolios = Array.isArray(portfolios) ? portfolios : [];
  const releaseInfo = safePortfolio?.releaseInfo || {};
  const contributors = Array.isArray(releaseInfo.contributor)
    ? releaseInfo.contributor.filter(Boolean)
    : releaseInfo.contributor
      ? [releaseInfo.contributor]
      : [];
  const contributorNames = contributors.map((contributor) => contributor?.name).filter(Boolean).join(", ");
  const articleText = Array.isArray(translate(safePortfolio.article)) ? translate(safePortfolio.article) : [];
  const hasArticle = articleText.length > 0;
  const allFootnotes = articleText.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  let { language } = useContext(LanguageContext);
  const { isMobile } = useContext(StateContext);

  const array = safePortfolios
    .filter((p) => p.name)
    .map((p) => {
      return {
        label: p.name,
        href: p.slug?.current ? `/stories/portfolios/${p.slug.current}` : null,
      };
    })
    .sort((a, b) => {
      const lastA = a.label.trim().split(" ").slice(-1)[0].toUpperCase();
      const lastB = b.label.trim().split(" ").slice(-1)[0].toUpperCase();
      return lastA.localeCompare(lastB);
    });

  useEffect(() => {
    if (!mediaPairRef.current) return;
  }, []);

  useEffect(() => {
    if (!coverRef.current) return;

    let frame = null;
    const coverElement = coverRef.current;

    const updateBlurProgress = () => {
      frame = null;
      const end = window.innerHeight * 0.5;
      const progress = end > 0 ? Math.min(Math.max(window.scrollY / end, 0), 1) : 0;
      coverElement.style.setProperty("--portfolio-cover-blur-progress", progress.toString());
    };

    const requestUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateBlurProgress);
    };

    updateBlurProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <main className={styles.main}>
      <FilterHeader array={array} currentlyActive={safePortfolio.name} className={styles.filter_header} />
      <motion.div ref={coverRef} className={styles.cover}>
        {(safePortfolio.name || safePortfolio.teaser) && (
          <TitleBlock title={safePortfolio.name} text={translate(safePortfolio.teaser)} className={styles.openCall} />
        )}
        {safePortfolio.cover && (
          <CoverMedia item={safePortfolio.cover} useCopyrightOverlay={isMobile ? false : true}>
            <Label className={styles.label}>Portfolios</Label>
            <div typo="h4" className={styles.name}>
              {language === "en" ? "by" : "von"} {contributorNames}
              {contributorNames ? "," : ""}{" "}
              <FormatDate
                date={releaseInfo.releaseDate}
                format={{
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }}
              />
            </div>
          </CoverMedia>
        )}
      </motion.div>
      <div className={styles.content}>
        <MediaPair className={styles.mediaPair}>
          <div className={styles.runningTextColumn}>
            {hasArticle && <Longcopy text={articleText} allFootnotes={allFootnotes} />}
            {allFootnotes.length > 0 && <Footnotes text={articleText} className={styles.footnotes} />}
          </div>

          {safePortfolio.articleImage && <ArticleImage item={safePortfolio.articleImage} className={styles.articleImage} />}
        </MediaPair>
        {Array.isArray(safePortfolio.gallery) && safePortfolio.gallery.length > 0 && (
          <Satellite media={safePortfolio.gallery} className={styles.satellite} behaviour="expand" />
        )}

        {safePortfolio.doubleFeature && <DoubleFeature item={safePortfolio.doubleFeature} />}

        {safePortfolio.name && safePortfolio.showcase && <PersonInfo person={safePortfolio.showcase} className={styles.person} />}
        <MicroFooter />
      </div>
    </main>
  );
};

export default Portfolio;
