import styles from "../Header.module.css";

const DesktopMenu = () => {
  return (
    <div className={styles.menu}>
      <nav>
        <ul>
          <li>Stories</li>
          <li>Contributors</li>
          <li>Open Calls</li>
          <li>News</li>
          <li>Calendar</li>
          <li>Index</li>
        </ul>

        <ul>
          <li>Print Periodical</li>
          <li>Podcast</li>
          <li>Editions</li>
          <li>Members</li>
          <li>About</li>
          <li>Shop</li>
        </ul>
      </nav>

      <div className={styles.promo}>
        <img src="/images/cover.png" alt="" />
        <p>
          Become a member and gain access to Residencies and Open Calls in Vienna and beyond. 55 Euro a Year. Join the
          Photographers Community. Learn more...
        </p>
      </div>
    </div>
  );
};

export default DesktopMenu;
