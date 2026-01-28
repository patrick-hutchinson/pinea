import FormatDate from "@/components/FormatDate/FormatDate";
import ArticleTitle from "@/components/Articles/ArticleTitle";
import ArticleType from "@/components/Articles/ArticleType";
import ArticleAuthor from "@/components/Articles/ArticleAuthor";

import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "../IndexPage.module.css";

const IndexItem = ({ article }) => {
  return (
    <div className={styles.indexItem} typo="h3">
      <AnimationLink path={`/stories/${article.category}/${article.slug.current}`}>
        <ArticleTitle article={article} className={styles.articleTitle} />
      </AnimationLink>

      <ArticleAuthor article={article} />

      <ArticleType article={article} className={styles.type} />

      <div>Online</div>

      <FormatDate
        date={article.releaseDate}
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
