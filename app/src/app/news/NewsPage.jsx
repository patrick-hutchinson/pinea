"use client";

import { translate } from "@/helpers/translate";

import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";
import FormatDate from "@/components/FormatDate/FormatDate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import styles from "./NewsPage.module.css";

const NewsPage = ({ openCalls }) => {
  const sortedCalls = [...openCalls].sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  return (
    <main className={styles.main}>
      <FilterHeader array={["2025", "2026"]} />
      {sortedCalls.map((openCall, index) => {
        return (
          <HeadlineBlock
            key={index}
            openCall={openCall}
            title={translate(openCall.title)}
            text={translate(openCall.teaser)}
            link={openCall.link}
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
