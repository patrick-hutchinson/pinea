"use client";

import { translate } from "@/helpers/translate";

import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";
import FormatDate from "@/components/FormatDate/FormatDate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import styles from "./NewsPage.module.css";

const NewsPage = ({ openCalls }) => {
  return (
    <main className={styles.main}>
      <FilterHeader array={["2025", "2026"]} />
      {openCalls.map((openCall, index) => {
        return (
          <HeadlineBlock
            key={index}
            openCall={openCall}
            title={translate(openCall.title)}
            text={translate(openCall.teaser)}
            runningText={translate(openCall.text)}
            isExpandable={true}
            label={<FormatDate date={openCall.deadline} format={{ month: "short", day: "numeric" }} />}
          />
        );
      })}
    </main>
  );
};

export default NewsPage;
