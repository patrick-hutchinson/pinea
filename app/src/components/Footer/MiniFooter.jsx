import Icon from "@/components/Icon";

import styles from "./Footer.module.css";

const MiniFooter = () => {
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
        <div>Contact</div>
        <div>Instagram</div>
      </div>
      <Icon className={styles.icon} path="/logos/bundesministerium.svg" alt="" />
    </footer>
  );
};

export default MiniFooter;
