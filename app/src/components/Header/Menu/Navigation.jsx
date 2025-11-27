import Link from "next/link";
import styles from "../Header.module.css";

const Navigation = ({ onLinkClick }) => {
  return (
    <nav className={styles.nav} style={{ userSelect: "none" }}>
      <ul style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <li>
          <Link href="/stories" onClick={onLinkClick}>
            Stories
          </Link>
        </li>

        <li>
          <Link href="/contributors" onClick={onLinkClick}>
            Contributors
          </Link>
        </li>
        <li>
          <Link href="/open-calls" onClick={onLinkClick}>
            Open Calls
          </Link>
        </li>
        <li>
          <Link href="/news" onClick={onLinkClick}>
            News
          </Link>
        </li>
        <li>
          <Link href="/calendar" onClick={onLinkClick}>
            Calendar
          </Link>
        </li>
        <li className="not-allowed" onClick={onLinkClick}>
          Index
        </li>
      </ul>

      <ul style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <li className="not-allowed">Print Periodical</li>
        {/* <li className="not-allowed">Podcast</li> */}
        <li className="not-allowed">Editions</li>
        <li>
          <Link href="/members" onClick={onLinkClick}>
            Members
          </Link>
        </li>
        <li>
          <Link href="/about" onClick={onLinkClick}>
            About
          </Link>
        </li>
        <li style={{ top: "calc(var(--line-height-3) + 3px)", position: "relative" }} className="not-allowed">
          Shop
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
