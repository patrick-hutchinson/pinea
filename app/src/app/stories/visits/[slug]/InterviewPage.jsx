"use client";

import InterviewText from "@/components/InterviewText/InterviewText";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import { useState } from "react";

import Media from "@/components/Media/Media";
import MediaPair from "@/components/MediaPair/MediaPair";
import FormatDate from "@/components/FormatDate/FormatDate";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import Footnotes from "@/components/Footnotes/Footnotes";
import Slideshow from "@/components/Slideshow/Slideshow";
import Text from "@/components/Text/Text";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

import Label from "@/components/Label/Label";

import MiniFooter from "@/components/Footer/MiniFooter";
import MicroFooter from "@/components/Footer/MicroFooter";

import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";
import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";

import { translate } from "@/helpers/translate";

import styles from "./InterviewPage.module.css";

const InterviewPage = ({ interview }) => {
  const { language } = useContext(LanguageContext);
  const text = translate(interview.interview);

  const [current, setCurrent] = useState(0);
  // Ensure it's an array and non-empty

  const midpoint = Math.ceil(text.length / 2);

  const firstHalf = text.slice(0, midpoint);
  const secondHalf = text.slice(midpoint);

  const renderMedia = (block, useCopyrightOverlay) => {
    if (!block) return null;

    switch (block.type) {
      case "media":
        return <Media medium={block.medium} showCrop={true} />;
      case "slideshow":
        return (
          <div style={{ position: "relative" }}>
            <Slideshow media={block.medium.gallery} useCopyrightOverlay={useCopyrightOverlay} />
          </div>
        );
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
              {language === "en" ? "by" : "von"} {interviewer.name}, <FormatDate date={interview.releaseDate} />
            </h4>
          );
        })}
      </div>
    );
  };

  const useCopyrightOverlay = true;

  return (
    <main className={styles.main}>
      <FilterHeader className={styles.filterHeader} array={["Wolfgang Tillmans"]} />

      {/* <MediaPair className={`${styles.mediaPair} ${styles.start}`}> */}
      <div className={styles.cover_media}>
        {renderMedia(interview.cover, useCopyrightOverlay)}
        <Label className={styles.label}>Visit</Label>
      </div>
      <div className={styles.interview_text}>
        <InterviewTitle />
        <InterviewText text={firstHalf} typo="longcopy" className={styles.longcopy} />
      </div>
      {/* </MediaPair> */}

      <BlurContainer className={styles.blur_container}>
        <Satellite className={styles.gallery} media={interview.gallery} behaviour="expand" />
        <div className={styles.fullscreenMedia}>{renderMedia(interview.fullscreenMedia)}</div>

        <MediaPair className={`${styles.end} ${styles.mediaPair}`}>
          <div className={styles.articleImage}>
            <CalendarExpandMedia
              medium={interview.articleImage.medium}
              className={styles.articleImage}
              copyright={<Text text={translate(interview.articleImage.medium.copyrightInternational)} />}
              isActive={true}
            />
          </div>
          <div className={styles.interview_continuation}>
            <InterviewText text={secondHalf} typo="longcopy" className={`${styles.longcopy}`} />
            <Footnotes text={translate(interview.interview)} className={styles.footnotes} />
          </div>
        </MediaPair>
        <MicroFooter />
      </BlurContainer>
    </main>
  );
};

export default InterviewPage;
