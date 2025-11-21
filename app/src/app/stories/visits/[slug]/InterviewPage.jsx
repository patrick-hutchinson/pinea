"use client";

import InterviewText from "@/components/InterviewText/InterviewText";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import Media from "@/components/Media/Media";
import MediaPair from "@/components/MediaPair/MediaPair";
import FormatDate from "@/components/FormatDate/FormatDate";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import Footnotes from "@/components/Footnotes/Footnotes";
import Slideshow from "@/components/Slideshow/Slideshow";
import Text from "@/components/Text/Text";

import Label from "@/components/Label/Label";

import MiniFooter from "@/components/Footer/MiniFooter";
import MicroFooter from "@/components/Footer/MicroFooter";

import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";

import { translate } from "@/helpers/translate";

import styles from "./InterviewPage.module.css";

const InterviewPage = ({ interview }) => {
  const text = translate(interview.interview);

  // Ensure it's an array and non-empty

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

  const InterviewTitle = () => {
    return (
      <div className={styles.title}>
        <h4>
          <Text text={translate(interview.title)} />
        </h4>
        {interview.speakers.map((speaker, index) => {
          return (
            <h2 className={styles.speaker} key={index}>
              {speaker.name}
            </h2>
          );
        })}
        {interview.interviewers.map((interviewer, index) => {
          return (
            <h4 key={index}>
              By {interviewer.name}, <FormatDate date={interview.releaseDate} />
            </h4>
          );
        })}
      </div>
    );
  };

  return (
    <main className={styles.main}>
      <FilterHeader className={styles.filterHeader} array={["Wolfgang Tillmans"]} />

      {/* <MediaPair className={`${styles.mediaPair} ${styles.start}`}> */}
      <div className={styles.cover_media}>
        {renderMedia(interview.cover)}
        <Label className={styles.label}>Portfolio</Label>
      </div>
      <div className={styles.interview_text}>
        <InterviewTitle />
        <InterviewText text={firstHalf} typo="longcopy" className={styles.longcopy} />
      </div>
      {/* </MediaPair> */}

      <BlurContainer className={styles.blur_container}>
        <Satellite className={styles.gallery} media={interview.gallery} />
        <div className={styles.fullscreenMedia}>{renderMedia(interview.fullscreenMedia)}</div>

        <MediaPair className={`${styles.end} ${styles.mediaPair}`}>
          <div className={styles.articleImage}>
            <ExpandMedia medium={interview.articleImage.medium} className={styles.articleImage} />
          </div>
          <div className={styles.interview_continuation}>
            <InterviewText text={secondHalf} typo="longcopy" className={`${styles.longcopy} ${styles.text}`} />
            <Footnotes text={translate(interview.interview)} className={styles.footnotes} />
          </div>
        </MediaPair>
        <MicroFooter />
      </BlurContainer>
    </main>
  );
};

export default InterviewPage;
