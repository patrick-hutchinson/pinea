"use client";

import { useState } from "react";

import { translate } from "@/helpers/translate";

import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";
import FormatDate from "@/components/FormatDate/FormatDate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import styles from "./OpenCallsPage.module.css";

const OpenCallsPage = ({ openCalls }) => {
  const [activeYears, setActiveYears] = useState([]);

  const sortedCalls = [...openCalls].sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const handleFilter = (filter) => {
    setActiveYears((prev) => {
      // If year is already active → remove it
      if (prev.includes(filter)) {
        return prev.filter((y) => y !== filter);
      }

      // Else → add it
      return [...prev, filter];
    });
  };

  const filteredCalls = sortedCalls.filter((call) => {
    // if no filters selected → show all
    if (activeYears.length === 0) return true;

    const year = new Date(call.deadline).getFullYear().toString();
    return activeYears.includes(year);
  });

  return (
    <main className={styles.main}>
      <FilterHeader
        className={styles.filter_header}
        array={["2025", "2026"]}
        handleFilter={handleFilter}
        currentlyActive={activeYears}
      />
      <div className={styles.open_call_container}>
        {filteredCalls.map((openCall, index) => {
          return (
            <HeadlineBlock
              key={index}
              className={styles.open_call}
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
      </div>
    </main>
  );
};

export default OpenCallsPage;
