"use client";

import Interview from "@/components/Interview/Interview";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import Media from "@/components/Media/Media";
import MediaPair from "@/components/MediaPair/MediaPair";
import FormatDate from "@/components/FormatDate";
import BlurContainer from "@/components/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";
import Footnotes from "@/components/Footnotes/Footnotes";

import MicroFooter from "@/components/Footer/MicroFooter";

import { translate } from "@/helpers/translate";

import styles from "./InterviewPage.module.css";
import FullscreenMedia from "../../../../components/FullscreenMedia/FullscreenMedia";

const InterviewPage = ({ interview }) => {
  const text = translate(interview.interview);

  // Ensure it's an array and non-empty

  const midpoint = Math.ceil(text.length / 2);

  const firstHalf = text.slice(0, midpoint);
  const secondHalf = text.slice(midpoint);

  console.log("firstHalf:", firstHalf);
  console.log("secondHalf:", secondHalf);

  const InterviewTitle = () => {
    return (
      <div className={styles.title}>
        <h4>{translate(interview.title)}</h4>
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
      <FilterHeader array={["Wolfgang Tillmans"]} />

      <MediaPair className={`${styles.mediaPair} ${styles.lead}`}>
        <Media medium={interview.cover.medium} className={styles.cover_media} objectFit="contain" />
        <div className={styles.interview_text}>
          <InterviewTitle />
          <Interview text={firstHalf} typo="longcopy" />
        </div>
      </MediaPair>

      <BlurContainer className={styles.blur_container}>
        <Satellite className={styles.gallery} media={interview.gallery} />
        <FullscreenMedia medium={interview.fullscreenMedia.medium} />

        <MediaPair className={`${styles.trail} ${styles.mediaPair}`}>
          <div />
          <div>
            <Interview text={secondHalf} typo="longcopy" className={styles.interview_continuation} />
            <Footnotes text={translate(interview.interview)} className={styles.footnotes} />
          </div>
        </MediaPair>
        <MicroFooter />
      </BlurContainer>
    </main>
  );
};

export default InterviewPage;
