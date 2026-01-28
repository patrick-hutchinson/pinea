import Label from "@/components/Label/Label";

import ArticleTitle from "@/components/Articles/ArticleTitle";
import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "./Search.module.css";

const SearchResult = ({ searchResult }) => {
  console.log(searchResult, "search Reult!");
  return (
    <AnimationLink path={`${searchResult.route}${searchResult.slug?.current}`} className={styles.searchResult}>
      <div style={{ display: "flex", gap: "var(--margin)" }} typo="h2">
        {searchResult.type && (
          <div style={{ position: "relative", top: "5px" }}>
            <Label>{searchResult?.type}</Label>
          </div>
        )}
        <ArticleTitle className={styles.searchResultTitle} article={searchResult} />
      </div>
    </AnimationLink>
  );
};

export default SearchResult;
