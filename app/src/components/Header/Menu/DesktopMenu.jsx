import Link from "next/link";
import styles from "../Header.module.css";
import { motion, AnimatePresence } from "framer-motion";

import FadePresence from "@/components/Animation/FadePresence";

const DesktopMenu = () => {
  return (
    <FadePresence className={styles.menu} motionKey="desktop-menu">
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
            <li>
              <Link href="/stories">Stories</Link>
            </li>
            <li>
              <ul style={{ textIndent: "calc(var(--margin) * 2)" }}>
                <li>Visits</li>
                <li>
                  <Link href="/portfolios">Portfolios</Link>
                </li>
                <li>Reviews</li>
                <li>
                  <Link href="/people">People</Link>
                </li>
                <li>
                  <Link href="/stories/people">People</Link>
                </li>
                <li>Spot On</li>
              </ul>
            </li>
            <li>Contributors</li>
            <li>Open Calls</li>

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
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>Shop</li>
          </ul>
        </nav>

        <video className={styles.cover} alt="" autoPlay loop muted playsInline>
          <source src="/images/cover.mp4"></source>
        </video>
      </div>

      <div className={styles.promo}>
        <p>
          Become a member and gain access to Residencies and Open Calls in Vienna and beyond. 55 Euro a Year. Join the
          Photographers Community. Learn more...
        </p>
      </div>
    </FadePresence>
  );
};

export default DesktopMenu;
