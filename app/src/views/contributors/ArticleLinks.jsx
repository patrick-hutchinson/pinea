import FormatDate from "@/components/FormatDate/FormatDate";

import AnimationLink from "@/components/Animation/AnimationLink";

import ArticleTitle from "@/components/Articles/ArticleTitle";
import ArticleCategory from "@/components/Articles/ArticleCategory";

import { PlainHead } from "@/components/Calendar/Head";

import styles from "./ContributorsPage.module.css";

const ArticleLinks = ({ contributor }) => {
  const safeArticles = (Array.isArray(contributor?.articles) ? contributor.articles : []).filter(
    (article) => article && (article.path || (article.slug?.current && article.category)),
  );

  return (
    <ul typo="h4" className={`${styles.articles_container} ${safeArticles.length > 0 ? styles.hasArticles : ""}`}>
      <PlainHead className={styles.article_head}></PlainHead>

      <div className={styles.articles}>
        {safeArticles.map((article) => {
          const date = article.releaseInfo?.releaseDate || article.releaseDate;

          return (
            <div className={styles.article} key={article._id || article.slug.current}>
              <AnimationLink path={article.path || `/stories/${article.category}/${article.slug.current}`}>
                <ArticleTitle article={article} className={styles.article_title} />
              </AnimationLink>

              <span className={styles.article_date}>
                <FormatDate
                  date={date}
                  format={{
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }}
                />
              </span>

              <ArticleCategory articleCategory={article.category} className={styles.type} />
            </div>
          );
        })}
      </div>
    </ul>
  );
};

export default ArticleLinks;
