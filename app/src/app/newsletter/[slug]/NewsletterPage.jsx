"use client";

import { useEffect, useState } from "react";

import NewsletterCover from "../components/NewsletterCover";
import Longcopy from "@/components/Longcopy/Longcopy";
import NewsletterFooter from "../components/NewsletterFooter";
import TitleBlock from "@/components/TitleBlock/TitleBlock";

import styles from "../Newsletter.module.css";

const NewsletterPage = ({ site, newsletter }) => {
  const [language, setLanguage] = useState("en"); // default

  useEffect(() => {
    // Read hash from URL (#en or #de)
    const hash = window.location.hash.replace("#", "");

    if (hash === "en" || hash === "de") {
      setLanguage(hash);
    }
  }, []);

  function translateNewsletter(object) {
    if (typeof object === "string") return object;
    if (!object || !Array.isArray(object)) return "";

    const translation =
      object.find((item) => item._key === language) ||
      object.find((item) => item._key === "en") ||
      object.find((item) => item._key === "de");

    return translation?.value || "";
  }

  return (
    <div className={styles.main}>
      <TitleBlock key={newsletter.id} title={translateNewsletter(newsletter.title)} />

      <div className="container" style={{ paddingBottom: "300px" }}>
        <NewsletterCover src={newsletter.cover.url} />

        <div style={{ padding: "50px 0" }}>
          <Longcopy text={newsletter.text} />
        </div>

        <NewsletterFooter />
      </div>
    </div>
  );
};

export default NewsletterPage;
