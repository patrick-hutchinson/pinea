"use client";

import { useState } from "react";

import { translate } from "@/helpers/translate";

import FormatDate from "@/components/FormatDate/FormatDate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import styles from "./OpenCallsPage.module.css";
import TitleBlockExpand from "@/components/TitleBlock/TitleBlockExpand";

const OpenCallsPage = ({ openCalls }) => {
  const [activeYear, setActiveYear] = useState([]);

  const sortedCalls = [...openCalls].sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const years = Array.from(new Set(openCalls.map((item) => new Date(item.deadline).getFullYear().toString()))).sort();

  const handleFilter = (filter) => {
    setActiveYear(filter);
  };

  const filteredCalls = sortedCalls.filter((call) => {
    const deadline = new Date(call.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Skip expired calls
    if (deadline < today) return false;

    if (activeYear.length === 0) return true;

    const year = deadline.getFullYear().toString();
    return activeYear.includes(year);
  });

  return (
    <main className={styles.main}>
      <FilterHeader
        className={styles.filter_header}
        array={years}
        handleFilter={handleFilter}
        currentlyActive={activeYear}
      />
      <div className={styles.open_call_container}>
        {filteredCalls.map((openCall, index) => {
          return (
            <TitleBlockExpand
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
