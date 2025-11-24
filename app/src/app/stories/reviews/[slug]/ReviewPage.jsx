"use client";

import { translate } from "@/helpers/translate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import BlurContainer from "@/components/BlurContainer/BlurContainer";
import InterviewText from "@/components/InterviewText/InterviewText";
import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";
import MediaPair from "@/components/MediaPair/MediaPair";
import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";
import Footnotes from "@/components/Footnotes/Footnotes";
import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";
import Text from "@/components/Text/Text";
import { LanguageContext } from "@/context/LanguageContext";
import FormatDate from "@/components/FormatDate/FormatDate";
import Label from "@/components/Label/Label";
import CoverMedia from "@/components/CoverMedia/CoverMedia";
import Longcopy from "@/components/Longcopy/Longcopy";

import MicroFooter from "@/components/Footer/MicroFooter";

import styles from "./ReviewPage.module.css";
import { useContext } from "react";
import DoubleFeature from "@/components/DoubleFeature/DoubleFeature";
import StickyArticleImage from "@/components/ArticleImage/StickyArticleImage";

const ReviewPage = ({ reviews, review }) => {
  const text = translate(review.text);

  const midpoint = Math.ceil(text.length / 2);

  const { language } = useContext(LanguageContext);

  const firstHalf = text.slice(0, midpoint);
  const secondHalf = text.slice(midpoint);

  return (
    <main className={styles.main}>
      <FilterHeader className={styles.filter_header} array={["Tabita Rezaire"]} />
      <div className={styles.title_container}>
        <h2 className={styles.title}>
          <Text text={translate(review.title)} />
        </h2>
        <h4 className={styles.author}>
          {language === "en" ? "by" : "von"}{" "}
          {review.author.map((author, index) => (
            <span key={index}>{author.name}</span>
          ))}
          ,{" "}
          <FormatDate
            date={review.releaseDate}
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
          <Label className={styles.label}>Review</Label>
          <CoverMedia item={review.cover} />
          {/* <CopyrightHover copyright={translate(review.cover.medium.copyrightInternational)} /> */}
        </div>
        <MediaPair className={`${styles.mediaPair} ${styles.first}`}>
          <Longcopy text={firstHalf} className={styles.longcopy} />

          <StickyArticleImage item={review.articleImageFirst} className={styles.article_image} />
        </MediaPair>

        {review.gallery && <Satellite className={styles.gallery} media={review.gallery} behaviour="expand" />}

        <HeadlineBlock className={styles.quote} title={translate(review.quote)} />

        <MediaPair className={`${styles.mediaPair} ${styles.second}`}>
          <StickyArticleImage item={review.articleImageSecond} className={styles.article_image} />

          <Longcopy text={secondHalf} />
        </MediaPair>

        {review.doubleFeature && <DoubleFeature item={review.doubleFeature} />}

        <Footnotes text={translate(review.text)} className={styles.footnotes} />
        <div className={styles.spacer} />
        <MicroFooter />
      </BlurContainer>
    </main>
  );
};

export default ReviewPage;
