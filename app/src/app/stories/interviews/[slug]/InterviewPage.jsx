"use client";

import Interview from "@/components/Interview/Interview";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import Media from "@/components/Media/Media";
import MediaPair from "@/components/MediaPair/MediaPair";
import FormatDate from "@/components/FormatDate";
import BlurContainer from "@/components/BlurContainer";
import Satellite from "@/components/Satellite/Satellite";

import { translate } from "@/helpers/translate";

import styles from "./InterviewPage.module.css";
import FullscreenMedia from "../../../../components/FullscreenMedia/FullscreenMedia";

const InterviewPage = ({ interviews, interview }) => {
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

      <MediaPair className={styles.mediaPair}>
        <Media medium={interview.cover.medium} className={styles.cover} objectFit="contain" />
        <div>
          <InterviewTitle />
          <Interview text={translate(interview.interview)} interviewers={interview.interviewers} typo="longcopy" />
        </div>
      </MediaPair>

      <BlurContainer>
        <Satellite className={styles.gallery} media={interview.gallery} />
        <FullscreenMedia medium={interview.fullscreenMedia} />
      </BlurContainer>
    </main>
  );
};

export default InterviewPage;
