import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";
import { translate } from "@/helpers/translate";

import FadePresence from "@/components/Animation/FadePresence";
import TextMarquee from "@/components/TextMarquee/TextMarquee";
import Text from "@/components/Text/Text";

import styles from "../Header.module.css";

const DesktopMenu = ({ site }) => {
  console.log(site, "site");

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

        <video className={styles.cover} alt="" autoPlay loop muted playsInline>
          <source src="/images/cover.mp4"></source>
        </video>
      </div>

      <div className={styles.promo}>
        <TextMarquee text={<Text text={translate(site.menu_teaser)} className={styles.marquee} />} isActive={true} />
      </div>
    </FadePresence>
  );
};

export default DesktopMenu;
