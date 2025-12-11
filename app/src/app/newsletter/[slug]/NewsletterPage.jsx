"use client";

import { useEffect, useState } from "react";

import NewsletterCover from "../components/NewsletterCover";
import Longcopy from "@/components/Longcopy/Longcopy";
import NewsletterFooter from "../components/NewsletterFooter";
import TitleBlock from "@/components/TitleBlock/TitleBlock";

import styles from "../Newsletter.module.css";

const NewsletterPage = ({ site, newsletter }) => {
  console.log(newsletter.language, "language");

  return (
    <div className={styles.main}>
      <TitleBlock key={newsletter.id} title={newsletter.title} />

      <div className="container body-text" style={{ paddingBottom: "300px" }}>
        <style type="text/css">
          {`
     @font-face {
  font-family: "HBMarginM";
  src: url("/fonts/HBMarginMWebv0.45-450.woff2") format("woff2");
  font-weight: 450;
  font-style: normal;
  font-display: swap;
}
      .body-text {
        font-family: "HBMarginM", Arial, sans-serif !important;
      }
    `}
        </style>

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
