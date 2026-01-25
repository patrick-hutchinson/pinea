import { use, useContext } from "react";
import styles from "./Footer.module.css";
import AnimationLink from "@/components/Animation/AnimationLink";

import { LanguageContext } from "@/context/LanguageContext";

const MicroFooter = () => {
  const { language } = useContext(LanguageContext);
  return (
    <footer id={styles.footer} className={styles.micro} typo="h4">
      <div className={styles.logo}>
        <div>P.IN.E.A Periodical</div>
      </div>

      <AnimationLink path="/imprint" className={styles.imprint}>
        {language === "en" ? "Imprint" : "Impressum"}
      </AnimationLink>
      <a href="mailto:office@pinea-periodical.com" target="_blank" className={styles.contact}>
        {language === "en" ? "Contact" : "Kontakt"}
      </a>
    </footer>
  );
};

export default MicroFooter;
