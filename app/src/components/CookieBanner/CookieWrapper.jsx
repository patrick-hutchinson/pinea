"use client";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";
import { AnimationContext } from "@/context/AnimationContext";
import FadePresence from "@/components/Animation/FadePresence";
import CookieBanner from "@/components/CookieBanner/CookieBanner";

import { usePathname } from "next/navigation";

export default function CookieBannerWrapper() {
  const { isMobile } = useContext(StateContext);
  const pathname = usePathname();

  const { transitionEnd } = useContext(AnimationContext);
  const [showCookieOnScroll, setShowCookieOnScroll] = useState(true);

  useEffect(() => {
    if (!isMobile) return;
    if (pathname !== "/") return; // ⬅ only run scrolling logic on home page

    const handleScroll = () => {
      setShowCookieOnScroll(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, pathname]);

  const shouldShowBanner = !isMobile ? true : pathname === "/" ? transitionEnd && showCookieOnScroll : true;

  return (
    <>
      {shouldShowBanner && (
        <FadePresence motionKey={shouldShowBanner ? "visible" : "hidden"}>
          <CookieBanner />
        </FadePresence>
      )}
    </>
  );
}
