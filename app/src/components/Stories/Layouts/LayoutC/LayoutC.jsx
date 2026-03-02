"use client";

// REVIEWS LAYOUT

import { translate } from "@/helpers/translate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import BlurContainer from "@/components/BlurContainer/BlurContainer";

import MediaPair from "@/components/MediaPair/MediaPair";
import TitleBlock from "@/components/TitleBlock/TitleBlock";
import Footnotes from "@/components/Footnotes/Footnotes";

import Text from "@/components/Text/Text";
import { LanguageContext } from "@/context/LanguageContext";
import FormatDate from "@/components/FormatDate/FormatDate";
import Label from "@/components/Label/Label";
import CoverMedia from "@/components/CoverMedia/CoverMedia";
import Longcopy from "@/components/Longcopy/Longcopy";
import PersonInfo from "@/components/People/PersonInfo";

import MicroFooter from "@/components/Footer/MicroFooter";

import styles from "./LayoutC.module.css";
import { useContext } from "react";
import DoubleFeature from "@/components/DoubleFeature/DoubleFeature";
import ArticleImage from "@/components/ArticleImage/ArticleImage";
import Satellite from "@/components/Satellite/Satellite";

import { countFootnotes } from "@/helpers/countFootnotes";

const LayoutC = ({ stories, story }) => {
  const safeStory = story || {};
  const safeStories = Array.isArray(stories) ? stories : [];
  const text = Array.isArray(translate(safeStory.text)) ? translate(safeStory.text) : [];

  const midpoint = Math.ceil(text.length / 2);

  const { language } = useContext(LanguageContext);

  const firstHalf = text.slice(0, midpoint);
  const secondHalf = text.slice(midpoint);

  const allFootnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  const secondHalfOffset = countFootnotes(firstHalf, allFootnotes);

  const array = safeStories.map((p) => ({
    label: translate(p.selector),
    href: p.slug?.current ? `/stories/${p.category}/${p.slug.current}` : null,
  }));

  return (
    <main className={styles.main}>
      <FilterHeader className={styles.filter_header} array={array} />
      <div className={styles.title_container}>
        <h2 className={styles.title}>
          <Text text={translate(safeStory.title)} />
        </h2>
        <h4 className={styles.author}>
          {language === "en" ? "by" : "von"}{" "}
          {(Array.isArray(safeStory.author) ? safeStory.author : []).map((author, index) => (
            <span key={index}>{author.name}</span>
          ))}
          ,{" "}
          <FormatDate
            date={safeStory.releaseDate}
            format={{
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }}
          />
        </h4>
      </div>
      <BlurContainer>
        {safeStory.cover && (
          <div style={{ position: "relative" }}>
            <Label className={styles.label}>REVIEWS</Label>
            <CoverMedia item={safeStory.cover} />
          </div>
        )}
        <MediaPair className={`${styles.mediaPair} ${styles.first}`}>
          {firstHalf.length > 0 && <Longcopy text={firstHalf} allFootnotes={allFootnotes} offset={0} className={styles.longcopy} />}

          {safeStory.articleImageFirst && <ArticleImage item={safeStory.articleImageFirst} className={styles.article_image} />}
        </MediaPair>

        {Array.isArray(safeStory.gallery) && safeStory.gallery.length > 0 && (
          <Satellite className={styles.gallery} media={safeStory.gallery} behaviour="expand" />
        )}

        {Array.isArray(safeStory.quote) && safeStory.quote.length > 0 && (
          <TitleBlock className={styles.quote} title={translate(safeStory.quote)} />
        )}

        <MediaPair className={`${styles.mediaPair} ${styles.second}`}>
          {safeStory.articleImageSecond && <ArticleImage item={safeStory.articleImageSecond} className={styles.article_image} />}

          <div className={styles.text_wrapper}>
            {secondHalf.length > 0 && <Longcopy allFootnotes={allFootnotes} offset={secondHalfOffset} text={secondHalf} />}
            {allFootnotes.length > 0 && (
              <Footnotes
                text={translate(safeStory.text)}
                allFootnotes={allFootnotes}
                offset={secondHalfOffset}
                className={styles.footnotes}
              />
            )}
          </div>
        </MediaPair>

        {safeStory.doubleFeature && <DoubleFeature item={safeStory.doubleFeature} />}

        {Array.isArray(safeStory.showcase) && safeStory.showcase[0] && (
          <PersonInfo className={styles.showcase} person={safeStory.showcase[0]} />
        )}

        <MicroFooter />
      </BlurContainer>
    </main>
  );
};

export default LayoutC;
