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

import { countFootnotes } from "@/helpers/countFootnotes";

const LayoutC = ({ stories, story }) => {
  const text = translate(story.text);

  const midpoint = Math.ceil(text.length / 2);

  const { language } = useContext(LanguageContext);

  const firstHalf = text.slice(0, midpoint);
  const secondHalf = text.slice(midpoint);

  const allFootnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  const secondHalfOffset = countFootnotes(firstHalf, allFootnotes);

  return (
    <main className={styles.main}>
      <FilterHeader className={styles.filter_header} array={["Tabita Rezaire"]} />
      <div className={styles.title_container}>
        <h2 className={styles.title}>
          <Text text={translate(story.title)} />
        </h2>
        <h4 className={styles.author}>
          {language === "en" ? "by" : "von"}{" "}
          {story.author.map((author, index) => (
            <span key={index}>{author.name}</span>
          ))}
          ,{" "}
          <FormatDate
            date={story.releaseDate}
            format={{
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }}
          />
        </h4>
      </div>
      <BlurContainer>
        <div style={{ position: "relative" }}>
          <Label className={styles.label}>REVIEWS</Label>
          <CoverMedia item={story.cover} />
        </div>
        <MediaPair className={`${styles.mediaPair} ${styles.first}`}>
          <Longcopy text={firstHalf} allFootnotes={allFootnotes} offset={0} className={styles.longcopy} />

          {story.articleImageFirst && <ArticleImage item={story.articleImageFirst} className={styles.article_image} />}
        </MediaPair>

        {story.gallery && <Satellite className={styles.gallery} media={story.gallery} behaviour="expand" />}

        {story.quote && <TitleBlock className={styles.quote} title={translate(story.quote)} />}

        <MediaPair className={`${styles.mediaPair} ${styles.second}`}>
          {story.articleImageSecond && <ArticleImage item={story.articleImageSecond} className={styles.article_image} />}

          <div className={styles.text_wrapper}>
            <Longcopy allFootnotes={allFootnotes} offset={secondHalfOffset} text={secondHalf} />
            <Footnotes text={translate(story.text)} className={styles.footnotes} />
          </div>
        </MediaPair>

        {story.doubleFeature && <DoubleFeature item={story.doubleFeature} />}

        {story.showcase && <PersonInfo className={styles.showcase} person={story.showcase[0]} />}

        <MicroFooter />
      </BlurContainer>
    </main>
  );
};

export default LayoutC;
