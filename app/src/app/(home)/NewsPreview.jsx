import { useState, useEffect } from "react";

import Link from "next/link";
import TitleBlockExpand from "@/components/TitleBlock/TitleBlockExpand";
import FormatDate from "@/components/FormatDate/FormatDate";

import { translate } from "@/helpers/translate";

import styles from "./HomePage.module.css";

const NewsPreview = ({ news }) => {
  const [shuffledNews, setShuffledNews] = useState([]);

  useEffect(() => {
    const sorted = [...news].sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    setShuffledNews(sorted.slice(0, 2));
  }, [news]);

  return (
    <Link href="/news">
      <ul className={styles.open_calls_wrapper}>
        {shuffledNews.map((news, index) => {
          return (
            <TitleBlockExpand
              key={index}
              openCall={news}
              title={translate(news.title)}
              text={translate(news.teaser)}
              label={<FormatDate date={news.deadline} format={{ month: "short", day: "numeric" }} />}
            />
          );
        })}
      </ul>
    </Link>
  );
};

export default NewsPreview;
