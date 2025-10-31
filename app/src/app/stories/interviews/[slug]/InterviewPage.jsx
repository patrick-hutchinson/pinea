"use client";

import Text from "@/components/Text";
import Footnotes from "@/components/Footnotes/Footnotes";
import Interview from "@/components/Interview/Interview";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import Media from "@/components/Media/Media";
import MediaPair from "@/components/MediaPair/MediaPair";

import { translate } from "@/helpers/translate";

import styles from "./InterviewPage.module.css";

const InterviewPage = ({ interviews, interview }) => {
  console.log(interview.cover);

  return (
    <main className={styles.main}>
      <FilterHeader array={["Wolfgang Tillmans"]} />
      {interview.title}
      <MediaPair>
        <Media medium={interview.cover.medium} className={styles.cover} />
        <Interview text={translate(interview.interview)} typo="longcopy" />
      </MediaPair>
    </main>
  );
};

export default InterviewPage;
