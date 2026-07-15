"use client";

import styles from "./NewsPage.module.css";

import BulletinList from "../../components/Bulletin/BulletinList";

const OpenCallsPage = ({ news }) => {
  return (
    <main className={styles.main}>
      <BulletinList bulletins={news} />
    </main>
  );
};

export default OpenCallsPage;
