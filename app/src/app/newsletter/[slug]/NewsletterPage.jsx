"use client";

import { useEffect, useState } from "react";

import NewsletterCover from "../components/NewsletterCover";
import Longcopy from "@/components/Longcopy/Longcopy";
import NewsletterFooter from "../components/NewsletterFooter";
import TitleBlock from "@/components/TitleBlock/TitleBlock";

import styles from "../Newsletter.module.css";

const NewsletterPage = ({ site, newsletter }) => {
  console.log(newsletter.language, "language");

  useEffect(() => {
    // Read hash from URL (#en or #de)
    const hash = window.location.hash.replace("#", "");

    if (hash === "en" || hash === "de") {
      setLanguage(hash);
    }
  }, []);

  return (
    <div className={styles.main}>
      <TitleBlock key={newsletter.id} title={newsletter.title} />

      <div className="container" style={{ paddingBottom: "300px" }}>
        <NewsletterCover src={newsletter.cover.url} />

        <div style={{ padding: "50px 0" }}>
          <Longcopy text={newsletter.text} />
        </div>

        <NewsletterFooter language={newsletter.language} site={site} />
      </div>
    </div>
  );
};

export default NewsletterPage;
