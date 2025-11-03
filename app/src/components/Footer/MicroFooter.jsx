import styles from "./Footer.module.css";

const MicroFooter = () => {
  return (
    <footer id={styles.footer} className={styles.micro} typo="h4">
      <div className={styles.logo}>
        <div>© P.IN.E.A Periodical</div>
      </div>

      <div className={styles.imprint}>Imprint</div>
      <div className={styles.instagram}>Instagram</div>
    </footer>
  );
};

export default MicroFooter;
