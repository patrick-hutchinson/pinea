"use client";

import InterviewText from "@/components/InterviewText/InterviewText";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import MediaPair from "@/components/MediaPair/MediaPair";
import FormatDate from "@/components/FormatDate/FormatDate";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import Footnotes from "@/components/Footnotes/Footnotes";

import Text from "@/components/Text/Text";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

import Label from "@/components/Label/Label";

import MicroFooter from "@/components/Footer/MicroFooter";

import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";

import { translate } from "@/helpers/translate";

import styles from "./InterviewPage.module.css";
import CoverMedia from "@/components/CoverMedia/CoverMedia";
import Longcopy from "@/components/Longcopy/Longcopy";
import StickyArticleImage from "@/components/ArticleImage/StickyArticleImage";

const InterviewPage = ({ interview }) => {
  const { language } = useContext(LanguageContext);
  const text = translate(interview.interview);

  const midpoint = Math.ceil(text.length / 2);

  const firstHalf = text.slice(0, midpoint);
  const secondHalf = text.slice(midpoint);

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

  return (
    <main className={styles.main}>
      <FilterHeader className={styles.filterHeader} array={["Wolfgang Tillmans"]} />

      <CoverMedia item={interview.cover} useCopyrightOverlay={true} className={styles.cover_media}>
        <Label className={styles.label}>VISIT</Label>
      </CoverMedia>
      <div className={styles.interview_start}>
        <InterviewTitle />
        <Longcopy text={firstHalf} className={styles.longcopy} />
      </div>

      <BlurContainer className={styles.blur_container}>
        <Satellite className={styles.gallery} media={interview.gallery} behaviour="expand" />

        <CoverMedia item={interview.fullscreen_media} className={styles.fullscreenMedia} />

        <MediaPair className={`${styles.end} ${styles.mediaPair}`}>
          <StickyArticleImage item={interview.articleImage} className={styles.article_image} />
          <div className={styles.interview_end}>
            <Longcopy text={secondHalf} className={styles.longcopy} />
            <Footnotes text={translate(interview.interview)} className={styles.footnotes} />
          </div>
        </MediaPair>
        <MicroFooter />
      </BlurContainer>
    </main>
  );
};

export default InterviewPage;
