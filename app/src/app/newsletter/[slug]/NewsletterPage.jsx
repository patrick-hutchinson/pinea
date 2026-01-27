"use client";

import NewsletterFooter from "../components/NewsletterFooter";
import NewsletterHeader from "../components/NewsletterHeader";

import { renderNewsletter } from "../helpers/renderNewsletter";
import NewsletterPineaIcon from "../components/NewsletterPineaIcon";

import styles from "../Newsletter.module.css";

const NewsletterPage = ({ site, newsletter }) => {
  console.log(newsletter, "newsletter content");

  return (
    <div className={styles.main}>
      <div className="container body-text">
        <NewsletterHeader newsletter={newsletter} />

        <div style={{ padding: "12px" }}>
          <NewsletterPineaIcon />
          {newsletter.pageBuilder.map((block) => renderNewsletter(block, newsletter.language))}
        </div>
        <NewsletterFooter language={newsletter.language} site={site} />
      </div>
    </div>
  );
};

export default NewsletterPage;
