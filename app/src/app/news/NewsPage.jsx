"use client";

import { useState } from "react";

import { translate } from "@/helpers/translate";

import FormatDate from "@/components/FormatDate/FormatDate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import styles from "./NewsPage.module.css";
import TitleBlockExpand from "@/components/TitleBlock/TitleBlockExpand";

const NewsPage = ({ news }) => {
  const [activeYear, setActiveYear] = useState([]);

  const sortedNews = [...news].sort((a, b) => new Date(b.deadline) - new Date(a.deadline));

  const years = Array.from(new Set(news.map((item) => new Date(item.deadline).getFullYear().toString()))).sort();

  const handleFilter = (filter) => {
    setActiveYear(filter);
  };

  const filteredNews = sortedNews.filter((call) => {
    // if no filters selected → show all
    if (activeYear.length === 0) return true;

    const year = new Date(call.deadline).getFullYear().toString();
    return activeYear.includes(year);
  });

  return (
    <main className={styles.main}>
      <FilterHeader
        array={years}
        handleFilter={handleFilter}
        currentlyActive={activeYear}
        className={styles.filter_header}
      />
      <div className={styles.news_container}>
        {filteredNews.map((newsItem, index) => {
          return (
            <TitleBlockExpand
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
