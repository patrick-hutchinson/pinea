import styles from "./Footer.module.css";
import { useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";

const NewsletterSignUp = () => {
  const { language } = useContext(LanguageContext);

  return (
    <div className={styles.newsletter}>
      <a href="mailto:office@pinea-periodical.com">
        {language === "en" ? "Subscribe to Our Newsletter!" : "Newsletter Abonnieren"}
      </a>
    </div>
  );
};

export default NewsletterSignUp;
