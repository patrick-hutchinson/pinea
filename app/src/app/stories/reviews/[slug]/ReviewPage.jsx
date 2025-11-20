"use client";

import { translate } from "@/helpers/translate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import Media from "@/components/Media/Media";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import InterviewText from "@/components/InterviewText/InterviewText";
import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";
import MediaPair from "@/components/MediaPair/MediaPair";
import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";
import Footnotes from "@/components/Footnotes/Footnotes";
import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";
import Text from "@/components/Text/Text";

import MicroFooter from "@/components/Footer/MicroFooter";

import PersonInfo from "@/components/People/PersonInfo";

import styles from "./ReviewPage.module.css";

const ReviewPage = ({ reviews, review }) => {
  const text = translate(review.text);

  const midpoint = Math.ceil(text.length / 2);

  const firstHalf = text.slice(0, midpoint);
  const secondHalf = text.slice(midpoint);

  const renderMedia = (block) => {
    if (!block) return null;

    switch (block.type) {
      case "media":
        return <Media medium={block.medium} />;
      case "slideshow":
        return <Slideshow media={block.medium.gallery} />;
      default:
        return null;
    }
  };

  const renderSide = (side) => {
    if (!side) return null;

    switch (side.type) {
      case "media":
        return <Media medium={side.medium} />;
      case "slideshow":
        return <Slideshow media={side.medium.gallery} />;
      default:
        return null;
    }
  };

  return (
    <main className={styles.main}>
      <FilterHeader className={styles.filter_header} array={["Tabita Rezaire"]} />
      <div className={styles.title_container}>
        <h2 className={styles.title}>
          <Text text={translate(review.title)} />
        </h2>
        <h4 className={styles.author}>
          by{" "}
          {review.author.map((author, index) => (
            <span key={index}>{author.name}</span>
          ))}
        </h4>
      </div>
      <BlurContainer>
        <div style={{ position: "relative" }}>
          <div className={styles.cover_media}>{renderMedia(review.cover)}</div>
          <CopyrightHover copyright={translate(review.cover.medium.copyrightInternational)} />
        </div>
        <MediaPair className={`${styles.mediaPair} ${styles.first}`}>
          <div className={styles.longcopy}>
            <InterviewText text={firstHalf} typo="longcopy" />
          </div>
          <div className={styles.articleImage}>
            <ExpandMedia medium={review.articleImageFirst.medium} className={styles.articleImage} />
          </div>
        </MediaPair>

        <HeadlineBlock className={styles.quote} title={translate(review.quote)} label="Quote" />

        <MediaPair className={`${styles.mediaPair} ${styles.second}`}>
          <div className={styles.articleImage}>
            <ExpandMedia medium={review.articleImageSecond.medium} className={styles.articleImage} />
          </div>
          <div className={styles.longcopy}>
            <InterviewText text={secondHalf} typo="longcopy" />
            {/* <PersonInfo /> */}
          </div>
        </MediaPair>

        {review.doubleFeature && (
          <MediaPair className={styles.doubleFeature}>
            <div>{renderSide(review.doubleFeature.left)}</div>
            <div>{renderSide(review.doubleFeature.right)}</div>
          </MediaPair>
        )}

        <Footnotes text={translate(review.text)} className={styles.footnotes} />
        <div className={styles.spacer} />
      </BlurContainer>
      <MicroFooter />
    </main>
  );
};

export default ReviewPage;
