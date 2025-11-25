"use client";

import styles from "./ContributorsPage.module.css";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import PersonInfo from "@/components/People/PersonInfo";
import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";
import { useState } from "react";
import FormatDate from "@/components/FormatDate/FormatDate";
import { PlainHead } from "@/components/Calendar/Head";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

import PersonInfoBody from "@/components/People/PersonInfoBody";

import Link from "next/link";

import { translate } from "@/helpers/translate";

const ContributorsPage = ({ contributors }) => {
  const [selectedLetters, setSelectedLetters] = useState([]);

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

  const handleFilter = (letter) => {
    setSelectedLetters((prev) => {
      // If already selected → remove it
      if (prev.includes(letter)) {
        return prev.filter((l) => l !== letter);
      }
      // Otherwise → add it
      return [...prev, letter];
    });
  };

  const filteredContributors =
    selectedLetters.length === 0
      ? contributors
      : contributors.filter((c) => {
          const parts = c.name.trim().split(" ");
          const lastName = parts[parts.length - 1];
          const firstLetter = lastName.charAt(0).toUpperCase();
          return selectedLetters.includes(firstLetter);
        });

  const sortedContributors = [...filteredContributors].sort((a, b) => {
    const lastA = a.name.trim().split(" ").slice(-1)[0].toUpperCase();
    const lastB = b.name.trim().split(" ").slice(-1)[0].toUpperCase();
    return lastA.localeCompare(lastB);
  });

  const formatType = (str) => {
    if (!str) return "";
    return str
      .replace(/-/g, " ") // replace hyphens with spaces
      .split(" ") // split into words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1)) // capitalize first letter
      .join(" "); // join back into string
  };

  const Articles = ({ contributor, index }) => {
    return (
      <ul typo="h4" className={styles.articles_container}>
        {index !== 0 && (
          <PlainHead className={styles.article_head}>{language === "en" ? "ARTICLES" : "ARTIKEL"}</PlainHead>
        )}
        {contributor.articles?.length > 0 && (
          <div className={styles.articles}>
            {contributor.articles.map((article) => {
              console.log(article.category, "categroy");
              return (
                <div className={styles.article}>
                  <FormatDate
                    date={article.releaseDate}
                    format={{
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }}
                  />
                  <Text text={formatType(article.category)} className={styles.type} />

                  <Link href={`/stories/${article.category}/${article.slug.current}`}>
                    <Text text={translate(article.title)} className={styles.article_title} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </ul>
    );
  };

  return (
    <main className={styles.main}>
      <FilterHeader currentlyActive={selectedLetters} array={array} handleFilter={handleFilter} />
      <div className={styles.page_header}>
        <PlainHead>{language === "en" ? "ABOUT" : "INFO"}</PlainHead>
        <PlainHead className={styles.article_head}>{language === "en" ? "ARTICLES" : "ARTIKEL"}</PlainHead>
      </div>

      <div className={styles.list}>
        {sortedContributors.map((contributor, index) => {
          return index === 0 ? (
            <div className={styles.item} key={index}>
              <PersonInfoBody className={styles.info} person={contributor} classNameCell={styles.cell} />
              <Articles contributor={contributor} index={index} />
            </div>
          ) : (
            <div className={styles.item} key={index}>
              <PersonInfo className={styles.info} person={contributor} classNameCell={styles.cell} />
              <Articles contributor={contributor} />
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default ContributorsPage;
