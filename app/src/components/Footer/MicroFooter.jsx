import styles from "./Footer.module.css";
import Link from "next/link";

const MicroFooter = () => {
  return (
    <footer id={styles.footer} className={styles.micro} typo="h4">
      <div className={styles.logo}>
        <div>© P.IN.E.A Periodical</div>
      </div>

      <Link href="/imprint" className={styles.imprint}>
        Imprint
      </Link>
      <Link href="/contact" className={styles.contact}>
        Contact
      </Link>
    </footer>
  );
};

export default MicroFooter;
