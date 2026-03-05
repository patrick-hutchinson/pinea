import FormatDate from "@/components/FormatDate/FormatDate";

import AnimationLink from "@/components/Animation/AnimationLink";

import ArticleTitle from "@/components/Articles/ArticleTitle";
import ArticleCategory from "@/components/Articles/ArticleCategory";

import { PlainHead } from "@/components/Calendar/Head";

import styles from "./ContributorsPage.module.css";

const ArticleLinks = ({ contributor }) => {
  const safeArticles = (Array.isArray(contributor?.articles) ? contributor.articles : []).filter(
    (article) => article && article.slug?.current && article.category,
  );

  return (
    <ul typo="h4" className={styles.articles_container}>
      <PlainHead className={styles.article_head}></PlainHead>

      <div className={styles.articles}>
        {safeArticles.map((article) => {
          return (
            <div className={styles.article} key={article._id || article.slug.current}>
              <FormatDate
                date={article.releaseInfo?.releaseDate || article.releaseDate}
                format={{
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }}
              />
              <ArticleCategory articleCategory={article.category} className={styles.type} />

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
