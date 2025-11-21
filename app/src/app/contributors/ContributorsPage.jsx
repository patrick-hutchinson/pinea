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
  ];

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

  const Articles = ({ contributor }) => {
    return (
      <ul typo="h4" className={styles.articles_container}>
        <PlainHead className={styles.article_head}>{language === "en" ? "ARTICLES" : "ARTIKEL"}</PlainHead>
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
                <Text text={translate(article.type)} className={styles.type} />

                <Link href={`/stories/${article.category}/${article.slug}`}>
                  <Text text={translate(article.title)} className={styles.article_title} />
                </Link>
              </div>
            );
          })}
        </div>
      </ul>
    );
  };

  return (
    <main className={styles.main}>
      <FilterHeader currentlyActive={selectedLetters} array={array} handleFilter={handleFilter} />
      <div>
        <PlainHead>{language === "en" ? "ABOUT" : "INFO"}</PlainHead>
        <PlainHead className={styles.article_head}>{language === "en" ? "ARTICLES" : "ARTIKEL"}</PlainHead>
      </div>

      <div className={styles.list}>
        {filteredContributors.map((contributor, index) => {
          return (
            <div className={styles.item} key={index}>
              <PersonInfo className={styles.info} person={contributor} />
              <Articles contributor={contributor} />
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default ContributorsPage;
