import styles from "./Footer.module.css";

import Link from "next/link";
import Icon from "@/components/Icon";

const Credits = ({ site }) => (
  <div className={styles.credits}>
    <h3>{site.title}</h3>
    <div className={styles.contact}>
      <div style={{ display: "flex", gap: "5px" }}>
        <span>
          <Link href="/contact">Contact</Link>,
        </span>
        <ul>
          {site.socials.map((social, index) => (
            <li key={index}>
              <a href={social.link ? social.link : "#"} target="_blank">
                {social.platform}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: "flex", gap: "var(--margin)", alignItems: "end" }}>
        <div typo="h4">
          <h4>Supported by</h4>
          <div>Media Kit</div>
          <Link href="/imprint">Imprint, Datenschutz</Link>
        </div>
        <Icon className={styles.icon} path="/logos/bundesministerium.svg" alt="" />
      </div>
    </div>
  </div>
);

export default Credits;
