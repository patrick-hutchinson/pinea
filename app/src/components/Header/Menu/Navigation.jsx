import Link from "next/link";
import styles from "../Header.module.css";

const Navigation = () => {
  return (
    <nav className={styles.nav} style={{ display: "flex", gap: "100px" }}>
      <ul style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <li>
          <Link href="/stories">Stories</Link>
        </li>

        <li>
          <Link href="/contributors">Contributors</Link>
        </li>
        <li>
          <Link href="/open-calls">Open Calls</Link>
        </li>
        <li>
          <Link href="/news">News</Link>
        </li>
        <li>
          <Link href="/calendar">Calendar</Link>
        </li>
        <li className="not-allowed">Index</li>
      </ul>

      <ul style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <li className="not-allowed">Print Periodical</li>
        <li className="not-allowed">Podcast</li>
        <li className="not-allowed">Editions</li>
        <li>
          <Link href="/members">Members</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li className="not-allowed">Shop</li>
      </ul>
    </nav>
  );
};

export default Navigation;
