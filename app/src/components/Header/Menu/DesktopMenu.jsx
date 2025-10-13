import Link from "next/link";
import styles from "../Header.module.css";

const DesktopMenu = () => {
  return (
    <div className={styles.menu}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: "30vw",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <nav style={{ display: "flex", gap: "100px" }}>
          <ul style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <li>Stories</li>
            <li>Contributors</li>
            <li>Open Calls</li>
            <li>
              <Link href="/voices">Voices</Link>
            </li>
            <li>
              <Link href="/calendar">Calendar</Link>
            </li>
            <li>Index</li>
          </ul>

          <ul style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <li>Print Periodical</li>
            <li>Podcast</li>
            <li>Editions</li>
            <li>Members</li>
            <li>About</li>
            <li>Shop</li>
          </ul>
        </nav>

        <img className={styles.cover} src="/images/cover.png" alt="" />
      </div>

      <div className={styles.promo}>
        <p>
          Become a member and gain access to Residencies and Open Calls in Vienna and beyond. 55 Euro a Year. Join the
          Photographers Community. Learn more...
        </p>
      </div>
    </div>
  );
};

export default DesktopMenu;
