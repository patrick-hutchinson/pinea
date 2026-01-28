import ArticleTitle from "@/components/Articles/ArticleTitle";
import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "./Search.module.css";

const SearchResult = ({ searchResult }) => {
  return (
    <AnimationLink path={`${searchResult.route}${searchResult.slug?.current}`} className={styles.searchResult}>
      <div style={{ display: "flex", gap: "var(--margin)" }} typo="h2">
        <ArticleTitle className={styles.searchResultTitle} article={searchResult} />
      </div>
    </AnimationLink>
  );
};

export default SearchResult;
