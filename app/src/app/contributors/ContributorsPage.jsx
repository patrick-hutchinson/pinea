"use client";

import styles from "./ContributorsPage.module.css";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import { useEffect, useState } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { PlainHead } from "@/components/Calendar/Head";
import { useContext } from "react";

import { CSSContext } from "@/context/CSSContext";

import Contributor from "./Contributor";

const ContributorsPage = ({ contributors }) => {
  const [selectedLetter, setSelectedLetter] = useState();
  const [activeLetter, setActiveLetter] = useState("D"); // <-- NEW
  const { header_height, filter_height } = useContext(CSSContext);

  const { language } = useContext(LanguageContext);

  const array = [
    ...new Set(
      contributors.map((c) => {
        const parts = c.name.trim().split(" ");
        const lastName = parts[parts.length - 1];
        return lastName.charAt(0).toUpperCase();
      })
    ),
  ].sort();

  const handleFilter = (item) => {
    setSelectedLetter((prev) => (prev === item ? null : item));
    if (selectedLetter === item) {
      // Force effect to re-run by re-setting it
      setTimeout(() => setSelectedLetter(item), 0);
    }
  };

  useEffect(() => {
    if (selectedLetter) {
      const el = document.querySelector(`.contributor-${selectedLetter}`);
      console.log(el, "el");
      if (el) {
        const offset = filter_height + header_height;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, [selectedLetter]);

  const sortedContributors = [...contributors].sort((a, b) => {
    const lastA = a.name.trim().split(" ").slice(-1)[0].toUpperCase();
    const lastB = b.name.trim().split(" ").slice(-1)[0].toUpperCase();
    return lastA.localeCompare(lastB);
  });

  return (
    <main className={styles.main}>
      <FilterHeader currentlyActive={activeLetter} array={array} handleFilter={handleFilter} />
      <div className={styles.page_header}>
        <PlainHead>{language === "en" ? "ABOUT" : "INFO"}</PlainHead>
        <PlainHead className={styles.article_head}>STORIES</PlainHead>
      </div>

      <div className={styles.list}>
        {sortedContributors.map((contributor, index) => (
          <Contributor key={index} contributor={contributor} index={index} setActiveLetter={setActiveLetter} />
        ))}
      </div>
    </main>
  );
};

export default ContributorsPage;
