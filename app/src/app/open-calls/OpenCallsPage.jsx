"use client";

import styles from "./OpenCallsPage.module.css";

import BulletinList from "../../components/Bulletin/BulletinList";

const OpenCallsPage = ({ openCalls }) => {
  return (
    <main className={styles.main}>
      <BulletinList bulletins={openCalls} />
    </main>
  );
};

export default OpenCallsPage;
