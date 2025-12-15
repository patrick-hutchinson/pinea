"use client";

import { useEffect, useState } from "react";

import NewsletterCover from "../components/NewsletterCover";
import Longcopy from "@/components/Longcopy/Longcopy";
import NewsletterFooter from "../components/NewsletterFooter";
import NewsletterHeader from "../components/NewsletterHeader";
import TitleBlock from "@/components/TitleBlock/TitleBlock";

import styles from "../Newsletter.module.css";

const NewsletterPage = ({ site, newsletter }) => {
  console.log(newsletter.language, "language");

  return (
    <div className={styles.main}>
      <TitleBlock key={newsletter.id} title={newsletter.title} />

      <div className="container body-text">
        <NewsletterHeader newsletter={newsletter} />
        <NewsletterCover src={newsletter.cover.url} />

        <div
          className="newsletter-running-text"
          style={{
            padding: "50px 30px",
            paddingBottom: "300px",
            lineHeight: "1.4",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Longcopy text={newsletter.text} />
        </div>

        <NewsletterFooter language={newsletter.language} site={site} />
      </div>
    </div>
  );
};

export default NewsletterPage;
