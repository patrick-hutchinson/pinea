import { useContext } from "react";

import { StateContext } from "@/context/StateContext";

import Link from "next/link";
import Icon from "@/components/Icon/Icon";
import { translate } from "@/helpers/translate";
import styles from "./Footer.module.css";

const MiniFooter = ({ site }) => {
  let { language } = useContext(StateContext);
  // const ministeriumLink = language === "en" ? "/logos/bundesministerium_en.svg" : "/logos/bundesministerium_de.svg";

  return (
    <footer id={styles.footer} className={styles.mini} typo="h4">
      <div className={styles.logo} typo="h3">
        <div>P.IN.E.A Periodical</div>
        <div>Photography Intermedia Et Al.</div>
      </div>

      <div className={styles.resources}>
        <div>Media Kit</div>
        <Link href="/imprint">Imprint</Link>
      </div>
      <div className={styles.social}>
        <Link href="/contact">{language === "en" ? "Contact" : "Kontakt"}</Link>
        {site.socials.map((social, index) => (
          <li key={index}>
            <a href={social.link ? social.link : "#"} target="_blank">
              {translate(social.platform)}
            </a>
          </li>
        ))}
      </div>
      <Icon className={styles.icon} path="/logos/bundesministerium_de.svg" alt="" />
    </footer>
  );
};

export default MiniFooter;
