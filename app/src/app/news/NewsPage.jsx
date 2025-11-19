"use client";

import { useState } from "react";

import { translate } from "@/helpers/translate";

import HeadlineBlock from "@/components/HeadlineBlock/HeadlineBlock";
import FormatDate from "@/components/FormatDate/FormatDate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import styles from "./NewsPage.module.css";

const NewsPage = ({ news }) => {
  const [activeYears, setActiveYears] = useState([]);

  const sortedNews = [...news].sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const handleFilter = (filter) => {
    setActiveYears((prev) => {
      const isActive = prev.includes(filter);

      // Case 1: Filter was active → remove it
      if (isActive) {
        const next = prev.filter((y) => y !== filter);
        // If removing leaves no active filters → activate all
        return next.length === 0 ? allYears : next;
      }

      // Case 2: Filter was inactive → make it the ONLY active one
      return [filter];
    });
  };

  const filteredNews = sortedNews.filter((call) => {
    // if no filters selected → show all
    if (activeYears.length === 0) return true;

    const year = new Date(call.deadline).getFullYear().toString();
    return activeYears.includes(year);
  });

  return (
    <main className={styles.main}>
      <FilterHeader
        array={["2025", "2026"]}
        handleFilter={handleFilter}
        currentlyActive={activeYears}
        className={styles.filter_header}
      />
      <div className={styles.news_container}>
        {filteredNews.map((newsItem, index) => {
          return (
            <HeadlineBlock
              key={index}
              className={styles.news_item}
              openCall={newsItem}
              title={translate(newsItem.title)}
              text={translate(newsItem.teaser)}
              link={newsItem.link}
              runningText={translate(newsItem.text)}
              isExpandable={true}
              label={<FormatDate date={newsItem.deadline} format={{ month: "short", day: "numeric" }} />}
            />
          );
        })}
      </div>
    </main>
  );
};

export default NewsPage;
