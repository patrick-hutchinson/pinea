import { useContext, useEffect, useState } from "react";
import FadePresence from "@/components/Animation/FadePresence";

import { usePathname } from "next/navigation";

import Link from "next/link";

import styles from "./Header.module.css";
import { StateContext } from "@/context/StateContext";

const Logo = ({ showMenu }) => {
  const pathname = usePathname();
  const { isMobile } = useContext(StateContext);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setScrolling(false); // only reset after user stops
      }, 300);

      setScrolling(true); // we could also check if it's already true
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const AnimatedLogo = () => (
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
  );

  const StaticLogo = () => <Link href="/">P.IN.E.A</Link>;

  return (
    <div className={styles.logo} style={{ position: "relative" }}>
      {(isMobile && pathname !== "/") || (isMobile && showMenu) ? <StaticLogo /> : <AnimatedLogo />}
    </div>
  );
};

export default Logo;
