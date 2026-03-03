"use client";

import { useState, useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";
import { StateContext } from "@/context/StateContext";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import IndexItem from "./components/IndexItem";

import styles from "./IndexPage.module.css";

const CATEGORY_ORDER = {
  visit: 0,
  visits: 0,
  review: 1,
  reviews: 1,
  portfolio: 2,
  portfolios: 2,
  spotOn: 3,
  "spot-on": 3,
};

const collator = new Intl.Collator(undefined, { sensitivity: "base" });

const getReleaseTimestamp = (article) => {
  const time = new Date(article?.releaseDate).getTime();
  return Number.isNaN(time) ? -Infinity : time;
};

const getCategoryRank = (category) => {
  return CATEGORY_ORDER[category] ?? Number.MAX_SAFE_INTEGER;
};

const getAuthorName = (article) => {
  const { author } = article ?? {};

  if (Array.isArray(author) && author.length > 0) {
    const firstAuthor = author[0];
    if (typeof firstAuthor === "string") return firstAuthor;
    if (firstAuthor?.name) return firstAuthor.name;
  }

  if (typeof author === "string") return author;

  return "";
};

const getAuthorLastName = (article) => {
  const fullName = getAuthorName(article).trim();
  if (!fullName) return "";

  const parts = fullName.split(/\s+/);
  return parts[parts.length - 1];
};

const sortArchiveArticles = (a, b) => {
  // 1) Newest release date first
  const releaseDateDiff = getReleaseTimestamp(b) - getReleaseTimestamp(a);
  if (releaseDateDiff !== 0) return releaseDateDiff;

  // 2) Category order: visit -> review -> portfolio -> spotOn
  const categoryDiff = getCategoryRank(a?.category) - getCategoryRank(b?.category);
  if (categoryDiff !== 0) return categoryDiff;

  // 3) Contributor last name (alphabetical)
  const lastNameDiff = collator.compare(getAuthorLastName(a), getAuthorLastName(b));
  if (lastNameDiff !== 0) return lastNameDiff;

  // Keep ordering deterministic if all sort keys above match
  return collator.compare(getAuthorName(a), getAuthorName(b));
};

const IndexPage = ({ articles }) => {
  const { isMobile } = useContext(StateContext);
  const { language } = useContext(LanguageContext);

  const [activeMedia, setActiveMedia] = useState([]);

  const handleFilter = (filter) => {
    setActiveMedia((prev) => {
      if (prev.includes(filter)) {
        // already active → remove it
        return prev.filter((f) => f !== filter);
      } else {
        // not active → add it
        return [...prev, filter];
      }
    });
  };

  const filteredArticles = articles
    .filter((article) => {
      if (activeMedia.length === 0) return true; // no filters → show all

      const medium = article._type === "print" ? "Print" : "Online";
      return activeMedia.includes(medium); // ✅ check activeMedia, not articles
    })
    .sort(sortArchiveArticles);

  return (
    <main className={styles.main}>
      <FilterHeader array={["Online", "Print"]} handleFilter={handleFilter} currentlyActive={activeMedia} />

      <BlurContainer>
        <div className={styles.indexHeader} typo="h5">
          <>
            {isMobile ? (
              <>
                <div>{language === "en" ? "STORY, CONTRIBUTOR" : "STORY, AUTOR:IN"}</div>
                <div>{language === "en" ? "MEDIUM/DATE" : "MEDIUM/DATUM"}</div>
              </>
            ) : (
              <>
                <div>STORY</div>
                <div>{language === "en" ? "CONTRIBUTOR" : "AUTOR:IN"}</div>
                <div>{language === "en" ? "CATEGORY" : "KATEGORIE"}</div>
                <div>{language === "en" ? "MEDIUM/DATE" : "MEDIUM/DATUM"}</div>
              </>
            )}
          </>
        </div>
        <div className={styles.content}>
          <ul>
            {filteredArticles.map((article) => (
              <IndexItem key={article._id} article={article} />
            ))}
          </ul>
        </div>
      </BlurContainer>

      <PineaIcon className={styles.pineaIcon} />
    </main>
  );
};

export default IndexPage;
