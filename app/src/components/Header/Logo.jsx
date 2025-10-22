import { useEffect, useState } from "react";
import FadePresence from "@/components/Animation/FadePresence";

import Link from "next/link";

import styles from "./Header.module.css";

const Logo = () => {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      // When scrolling starts → set to short form
      setScrolling(true);

      // Clear existing timeout
      clearTimeout(scrollTimeout);

      // After user stops scrolling for 300ms → reset
      scrollTimeout = setTimeout(() => {
        setScrolling(false);
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className={styles.logo} style={{ position: "relative" }}>
      <Link href="/">
        {!scrolling ? (
          <FadePresence motionKey="logo-long" className={styles.logo_inner}>
            Photography Intermedia Et Al.
          </FadePresence>
        ) : (
          <FadePresence motionKey="logo-short" className={styles.logo_inner}>
            P.IN.E.A
          </FadePresence>
        )}
      </Link>
    </div>
  );
};

export default Logo;
