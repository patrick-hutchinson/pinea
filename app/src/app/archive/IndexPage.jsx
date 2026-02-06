"use client";

import { useState, useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";
import { StateContext } from "@/context/StateContext";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import BlurContainer from "@/components/BlurContainer/BlurContainer";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import IndexItem from "./components/IndexItem";

import styles from "./IndexPage.module.css";

const IndexPage = ({ articles }) => {
  const { isMobile } = useContext(StateContext);
  const { language } = useContext(LanguageContext);
  console.log("index page");
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

  const filteredArticles = articles.filter((article) => {
    if (activeMedia.length === 0) return true; // no filters → show all

    const medium = article._type === "print" ? "Print" : "Online";
    return activeMedia.includes(medium); // ✅ check activeMedia, not articles
  });

  return (
    <main className={styles.main}>
      <FilterHeader array={["Online", "Print"]} handleFilter={handleFilter} currentlyActive={activeMedia} />

      <BlurContainer>
        <div className={styles.indexHeader} typo="h5">
          <>
            {isMobile ? (
              <>
                <div>{language === "en" ? "STORIES, AUTHOR" : "STORIES, AUTOR"}</div>
                <div>{language === "en" ? "MEDIUM/DATE" : "MEDIUM/DATUM"}</div>
              </>
            ) : (
              <>
                <div>STORIES</div>
                <div>{language === "en" ? "AUTHOR" : "AUTOR"}</div>
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
