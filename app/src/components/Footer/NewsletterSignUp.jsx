import styles from "./Footer.module.css";
import { useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";

const NewsletterSignUp = () => {
  const { language } = useContext(LanguageContext);

  return (
    <div className={styles.newsletter}>
      <p className="not-allowed">
        {language === "en" ? "Subscribe to Our Newsletter!" : "Abonniere unseren Newsletter!"}
      </p>
    </div>
  );
};

export default NewsletterSignUp;
