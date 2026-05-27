import { useContext, useEffect, useState } from "react";
import FadePresence from "@/components/Animation/FadePresence";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "../Header.module.css";
import { StateContext } from "@/context/StateContext";
import { stripLocaleFromPathname } from "@/lib/i18n";

const Logo = ({ showSearch }) => {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const { isMobile, isTablet } = useContext(StateContext);
  const [scrolling, setScrolling] = useState(false);
  const [showLongAfterSearchFade, setShowLongAfterSearchFade] = useState(!showSearch);
  const isHome = basePathname === "/";

  useEffect(() => {
    if (showSearch) {
      setShowLongAfterSearchFade(false);
      return;
    }

    const timeout = setTimeout(() => {
      setShowLongAfterSearchFade(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [showSearch]);

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
    <FadePresence motionKey="logo-long" className={styles.logo}>
      {!scrolling ? (
        <AnimationLink path="/">Photography Intermedia Et Al.</AnimationLink>
      ) : (
        <AnimationLink path="/">P.IN.E.A</AnimationLink>
      )}
    </FadePresence>
  );

  const StaticLogo = () => {
    const logoText = isHome && showLongAfterSearchFade ? "Photography Intermedia Et Al." : "P.IN.E.A";

    return (
      <AnimationLink className={styles.logo} path="/">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={logoText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ display: "inline-block" }}
          >
            {logoText}
          </motion.span>
        </AnimatePresence>
      </AnimationLink>
    );
  };

  return isMobile || isTablet ? <StaticLogo /> : <AnimatedLogo />;
};

export default Logo;
