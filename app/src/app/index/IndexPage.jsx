"use client";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import BlurContainer from "@/components/BlurContainer/BlurContainer";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import IndexItem from "./components/IndexItem";

import styles from "./IndexPage.module.css";

const IndexPage = ({ articles }) => {
  return (
    <main className={styles.main}>
      <FilterHeader array={["Online", "Print"]} />

      <BlurContainer>
        <div className={styles.content}>
          <ul>
            {articles.map((article) => (
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
