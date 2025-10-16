const MobileMenu = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>P.IN.E.A</div>
      <div className={styles.controls}>
        <div>Log In</div>
        <div className={styles.menuButton} />
      </div>

      {showMenu && <MobileMenu />}
    </header>
  );
};

export default MobileMenu;
