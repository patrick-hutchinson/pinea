import { useContext } from "react";

import { StateContext } from "@/context/StateContext";

import Icon from "@/components/Icon";

import styles from "./Footer.module.css";

const MiniFooter = () => {
  let { language } = useContext(StateContext);
  const ministeriumLink = language === "en" ? "/logos/bundesministerium_en.svg" : "/logos/bundesministerium_de.svg";

  return (
    <footer id={styles.footer} className={styles.mini} typo="h4">
      <div className={styles.logo}>
        <div>P.IN.E.A Periodical</div>
        <div>Photography Intermedia Et Al.</div>
      </div>

      <div className={styles.resources}>
        <div>Media Kit</div>
        <div>Imprint</div>
      </div>
      <div className={styles.social}>
        <div>{language === "en" ? "Contact" : "Kontakt"}</div>
        <div>Instagram</div>
      </div>
      <Icon className={styles.icon} path={ministeriumLink} alt="" />
    </footer>
  );
};

export default MiniFooter;
