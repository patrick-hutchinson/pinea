import { use, useContext } from "react";
import styles from "./Footer.module.css";
import Link from "next/link";

import { LanguageContext } from "@/context/LanguageContext";

const MicroFooter = () => {
  const { language } = useContext(LanguageContext);
  return (
    <footer id={styles.footer} className={styles.micro} typo="h4">
      <div className={styles.logo}>
        <div>P.IN.E.A Periodical</div>
      </div>

      <Link href="/imprint" className={styles.imprint}>
        Imprint
      </Link>
      <a href="mailto:office@pinea-periodical.com" target="_blank" className={styles.contact}>
        {language === "en" ? "Contact" : "Kontakt"}
      </a>
    </footer>
  );
};

export default MicroFooter;
