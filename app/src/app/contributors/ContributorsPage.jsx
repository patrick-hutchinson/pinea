"use client";

import styles from "./ContributorsPage.module.css";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import PersonInfo from "@/components/People/PersonInfo";
import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";

import Link from "next/link";

import { translate } from "@/helpers/translate";

const ContributorsPage = ({ contributors }) => {
  const array = contributors.map((contributor) => {
    const parts = contributor.name.trim().split(" ");
    const lastName = parts[parts.length - 1];
    return lastName.charAt(0).toUpperCase();
  });

  const Articles = ({ contributor }) => {
    return (
      <ul typo="h4">
        {contributor.articles.map((article) => {
          return (
            <Link href={`/stories/${article.type}/${article.slug}`}>
              <Text text={translate(article.title)} />
            </Link>
          );
        })}
      </ul>
    );
  };

  return (
    <main className={styles.main}>
      <FilterHeader array={array} />
      <div className={styles.list}>
        {contributors.map((contributor, index) => {
          return (
            <div className={styles.item} key={index}>
              <Media className={styles.portrait} medium={contributor.portrait.medium} />
              <PersonInfo
                className={styles.info}
                person={contributor}
                articles={<Articles contributor={contributor} />}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default ContributorsPage;
