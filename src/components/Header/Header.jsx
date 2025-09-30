import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div>Photography Intermedia Et Al.</div>
      <nav className={styles.nav}>
        <div className={styles.search}></div>
        <div>En</div>
        <div>De</div>
        <div>Subscribe</div>
        <div className={styles.menu} />
      </nav>
    </header>
  );
};

export default Header;
