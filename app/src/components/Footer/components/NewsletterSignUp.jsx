import { useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";

import styles from "../Footer.module.css";

const NewsletterSignUp = () => {
  const { language } = useContext(LanguageContext);

  return (
    <a className={styles.newsletter} href="https://newsletter.pinea-periodical.com/subscription/form" target="_blank">
      {language === "en" ? "Subscribe to Our Newsletter" : "Newsletter abonnieren"}
    </a>
  );
};

export default NewsletterSignUp;
