"use client";

import styles from "./ContributorsPage.module.css";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import { useEffect, useState } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { PlainHead } from "@/components/Calendar/Head";
import { useContext } from "react";

import Contributor from "./Contributor";

const ContributorsPage = ({ contributors }) => {
  const [selectedLetter, setSelectedLetter] = useState();

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
    setSelectedLetter(item);
  };

  useEffect(() => {
    if (selectedLetter) {
      const el = document.getElementById(`country-${selectedCountry}`);
      if (el) {
        const offset = 150;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, [selectedLetter]);

  // const filteredContributors =
  //   selectedLetters.length === 0
  //     ? contributors
  //     : contributors.filter((c) => {
  //         const parts = c.name.trim().split(" ");
  //         const lastName = parts[parts.length - 1];
  //         const firstLetter = lastName.charAt(0).toUpperCase();
  //         return selectedLetters.includes(firstLetter);
  //       });

  const sortedContributors = [...contributors].sort((a, b) => {
    const lastA = a.name.trim().split(" ").slice(-1)[0].toUpperCase();
    const lastB = b.name.trim().split(" ").slice(-1)[0].toUpperCase();
    return lastA.localeCompare(lastB);
  });

  return (
    <main className={styles.main}>
      <FilterHeader currentlyActive={selectedLetter} array={array} handleFilter={handleFilter} />
      <div className={styles.page_header}>
        <PlainHead>{language === "en" ? "ABOUT" : "INFO"}</PlainHead>
        <PlainHead className={styles.article_head}>{language === "en" ? "ARTICLES" : "ARTIKEL"}</PlainHead>
      </div>

      <div className={styles.list}>
        {sortedContributors.map((contributor, index) => (
          <Contributor contributor={contributor} index={index} />
        ))}
      </div>
    </main>
  );
};

export default ContributorsPage;
