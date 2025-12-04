import { useContext, useEffect, useState } from "react";
import FadePresence from "@/components/Animation/FadePresence";

import { usePathname } from "next/navigation";

import Link from "next/link";

import styles from "./Header.module.css";
import { StateContext } from "@/context/StateContext";

const Logo = ({ showMenu }) => {
  const pathname = usePathname();
  const { isMobile, isTablet } = useContext(StateContext);
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
    <FadePresence motionKey="logo-long" className={styles.logo_inner}>
      {!scrolling ? <Link href="/">Photography Intermedia Et Al.</Link> : <Link href="/"> P.IN.E.A</Link>}
    </FadePresence>
  );

  const StaticLogo = () => <Link href="/">P.IN.E.A</Link>;

  return (
    <div className={styles.logo} style={{ position: "relative" }}>
      {(isMobile && pathname !== "/") || (isMobile && showMenu) || (isTablet && showMenu) ? (
        <StaticLogo />
      ) : (
        <AnimatedLogo />
      )}
    </div>
  );
};

export default Logo;
