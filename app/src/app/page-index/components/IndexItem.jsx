import { Fragment } from "react";

import FormatDate from "@/components/FormatDate/FormatDate";
import ArticleTitle from "@/components/Articles/ArticleTitle";
import ArticleCategory from "@/components/Articles/ArticleCategory";
import ArticleAuthor from "@/components/Articles/ArticleAuthor";

import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "../IndexPage.module.css";

const IndexItem = ({ article }) => {
  console.log(article, "article");
  const isPrint = article._type === "print";
  const medium = isPrint ? "Print" : "Online";

  const Wrapper = isPrint ? "div" : AnimationLink;
  const wrapperProps = isPrint ? {} : { path: `/stories/${article.category}/${article.slug?.current}` };

  return (
    <div className={`${styles.indexItem} ${!isPrint && styles.isLink}`} typo="h3">
      <Wrapper {...wrapperProps} className={styles.articleTitle}>
        <ArticleTitle article={article} />
      </Wrapper>

      <ArticleAuthor article={article} className={styles.articleAuthor} />

      <ArticleCategory articleCategory={article.category} className={styles.articleCategory} />

      <div className={styles.articleMedium}>{medium}</div>

      <FormatDate
        date={article.releaseDate}
        className={styles.articleReleaseDate}
        format={{
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }}
      />
    </div>
  );
};

export default IndexItem;
