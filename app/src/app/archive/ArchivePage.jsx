"use client";

import { useState, useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";
import { StateContext } from "@/context/StateContext";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import SitePineaIcon from "@/components/PineaIcon/SitePineaIcon";
import IndexItem from "./components/IndexItem";

import styles from "./ArchivePage.module.css";

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
  const date = article?.releaseInfo?.releaseDate || article?.releaseDate;
  const time = new Date(date).getTime();
  return Number.isNaN(time) ? -Infinity : time;
};

const getCategoryRank = (category) => {
  return CATEGORY_ORDER[category] ?? Number.MAX_SAFE_INTEGER;
};

const getContributorName = (article) => {
  const contributors = article?.releaseInfo?.contributor;

  if (Array.isArray(contributors) && contributors.length > 0) {
    const first = contributors[0];
    if (typeof first === "string") return first;
    if (first?.name) return first.name;
  }

  const { author } = article ?? {};
  if (Array.isArray(author) && author.length > 0) {
    const firstAuthor = author[0];
    if (typeof firstAuthor === "string") return firstAuthor;
    if (firstAuthor?.name) return firstAuthor.name;
  }

  if (typeof author === "string") return author;

  return "";
};

const getContributorLastName = (article) => {
  const fullName = getContributorName(article).trim();
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
  const lastNameDiff = collator.compare(getContributorLastName(a), getContributorLastName(b));
  if (lastNameDiff !== 0) return lastNameDiff;

  // Keep ordering deterministic if all sort keys above match
  return collator.compare(getContributorName(a), getContributorName(b));
};

const ArchivePage = ({ articles }) => {
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
            {filteredArticles.map((article, index) => {
              const key =
                article?._id ||
                article?.slug?.current ||
                `${article?.category || article?._type || article?.type || "archive"}-${index}`;

              return <IndexItem key={key} article={article} />;
            })}
          </ul>
        </div>
      </BlurContainer>

      <SitePineaIcon />
    </main>
  );
};

export default ArchivePage;
