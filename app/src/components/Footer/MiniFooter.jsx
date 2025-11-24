import { useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";

import Link from "next/link";
import Icon from "@/components/Icon/Icon";
import { translate } from "@/helpers/translate";
import styles from "./Footer.module.css";
import MediaKitDownload from "../MediaKitDownload/MediaKitDownload";

const MiniFooter = ({ site }) => {
  let { language } = useContext(LanguageContext);
  // const ministeriumLink = language === "en" ? "/logos/bundesministerium_en.svg" : "/logos/bundesministerium_de.svg";

  return (
    <footer id={styles.footer} className={styles.mini} typo="h4">
      <div className={styles.logo} typo="h3">
        <div>P.IN.E.A Periodical</div>
        <div>Photography Intermedia Et Al.</div>
      </div>

      <div className={styles.resources}>
        <MediaKitDownload file={language === "de" ? site.media_kit_de : site.media_kit_en} />
        <Link href="/imprint">Imprint</Link>
      </div>
      <div className={styles.social}>
        <a href="mailto:office@pinea-periodical.com" target="_blank">
          {language === "en" ? "Contact" : "Kontakt"}
        </a>
        {site.socials.map((social, index) => (
          <li key={index}>
            <a href={social.link ? social.link : "#"} target="_blank">
              {translate(social.platform)}
            </a>
          </li>
        ))}
      </div>
      <Icon
        className={styles.icon}
        onClick={() => {
          window.open(language === "en" ? "https://www.bmwkms.gv.at/en.html" : "https://www.bmwkms.gv.at/", "_blank");
        }}
        path="/logos/bundesministerium_de.svg"
        alt=""
      />
    </footer>
  );
};

export default MiniFooter;
