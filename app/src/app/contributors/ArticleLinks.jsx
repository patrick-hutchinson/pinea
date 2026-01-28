import FormatDate from "@/components/FormatDate/FormatDate";

import AnimationLink from "@/components/Animation/AnimationLink";

import ArticleTitle from "@/components/Articles/ArticleTitle";
import ArticleType from "@/components/Articles/ArticleType";

import { PlainHead } from "@/components/Calendar/Head";

import styles from "./ContributorsPage.module.css";

const ArticleLinks = ({ contributor }) => {
  return (
    <ul typo="h4" className={styles.articles_container}>
      <PlainHead className={styles.article_head}></PlainHead>

      <div className={styles.articles}>
        {contributor.articles?.map((article) => {
          return (
            <div className={styles.article}>
              <FormatDate
                date={article.releaseDate}
                format={{
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }}
              />
              <ArticleType article={article} className={styles.type} />

              <AnimationLink path={`/stories/${article.category}/${article.slug.current}`}>
                <ArticleTitle article={article} className={styles.article_title} />
              </AnimationLink>
            </div>
          );
        })}
      </div>
    </ul>
  );
};

export default ArticleLinks;
