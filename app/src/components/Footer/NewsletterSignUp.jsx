import styles from "./Footer.module.css";
import { useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";

const NewsletterSignUp = () => {
  const { language } = useContext(LanguageContext);

  return (
    <div className={styles.newsletter}>
      <p>Stay Up to Date</p>
      <input
        type="email"
        name="email"
        placeholder={language === "en" ? "Subscribe to Our Newsletter" : "Aboniere unseren Newsletter"}
        autoComplete="email"
        required
      />
    </div>
  );
};

export default NewsletterSignUp;
