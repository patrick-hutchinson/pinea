import { useContext, useEffect, useState } from "react";
import FadePresence from "@/components/Animation/FadePresence";

import { usePathname } from "next/navigation";

import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "./Header.module.css";
import { StateContext } from "@/context/StateContext";

const Logo = ({ showMenu, showSearch }) => {
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
      {!scrolling ? (
        <AnimationLink path="/">Photography Intermedia Et Al.</AnimationLink>
      ) : (
        <AnimationLink path="/"> P.IN.E.A</AnimationLink>
      )}
    </FadePresence>
  );

  const StaticLogo = () => <AnimationLink path="/">P.IN.E.A</AnimationLink>;

  return isMobile || (isTablet && showMenu) ? <StaticLogo /> : <AnimatedLogo />;
};

export default Logo;
