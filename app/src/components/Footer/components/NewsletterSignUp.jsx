import { useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";

import styles from "../Footer.module.css";

const NewsletterSignUp = () => {
  const { language } = useContext(LanguageContext);

  return (
    <a className={styles.newsletter} href="https://newsletter.pinea-periodical.com/subscription/form" target="_blank">
      Lists
    </a>
  );
};

export default NewsletterSignUp;
