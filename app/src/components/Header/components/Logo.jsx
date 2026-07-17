import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { usePathname } from "@/context/RouteContext";
import { AnimatePresence, motion } from "framer-motion";

import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "../Header.module.css";
import { StateContext } from "@/context/StateContext";
import { stripLocaleFromPathname } from "@/lib/i18n";

const Logo = ({ showMenu, showSearch }) => {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const { isMobile, isTablet } = useContext(StateContext);
  const [scrolling, setScrolling] = useState(false);
  const [showLongAfterSearchFade, setShowLongAfterSearchFade] = useState(!showSearch);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);
  const isHome = basePathname === "/";
  const previousPathnameRef = useRef(pathname);

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
      if (isRouteTransitioning) return;

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
  }, [isRouteTransitioning]);

  useEffect(() => {
    const handleTransitionStart = () => setIsRouteTransitioning(true);
    const handleTransitionComplete = () => setIsRouteTransitioning(false);

    window.addEventListener("pinea-page-transition-start", handleTransitionStart);
    window.addEventListener("pinea-page-transition-complete", handleTransitionComplete);

    return () => {
      window.removeEventListener("pinea-page-transition-start", handleTransitionStart);
      window.removeEventListener("pinea-page-transition-complete", handleTransitionComplete);
    };
  }, []);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;

    setIsRouteTransitioning(true);
    previousPathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!isRouteTransitioning) return undefined;

    const timeout = setTimeout(() => setIsRouteTransitioning(false), 900);
    return () => clearTimeout(timeout);
  }, [isRouteTransitioning]);

  const preferredLogoText = useMemo(() => {
    const useStaticLogo = isMobile === true || isTablet === true;

    if (useStaticLogo) {
      return showMenu || !(isHome && showLongAfterSearchFade) ? "P.IN.E.A" : "Photography Intermedia Et Al.";
    }

    return scrolling ? "P.IN.E.A" : "Photography Intermedia Et Al.";
  }, [isMobile, isTablet, showMenu, isHome, showLongAfterSearchFade, scrolling]);

  const [logoText, setLogoText] = useState(preferredLogoText);

  useEffect(() => {
    if (isRouteTransitioning) return;
    setLogoText(preferredLogoText);
  }, [preferredLogoText, isRouteTransitioning]);

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
          typo="h3"
        >
          {logoText}
        </motion.span>
      </AnimatePresence>
    </AnimationLink>
  );
};

export default Logo;
