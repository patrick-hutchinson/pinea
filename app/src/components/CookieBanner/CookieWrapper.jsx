"use client";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";
import { AnimationContext } from "@/context/AnimationContext";
import FadePresence from "@/components/Animation/FadePresence";
import CookieBanner from "@/components/CookieBanner/CookieBanner";

import { usePathname } from "next/navigation";

export default function CookieBannerWrapper() {
  const { isMobile, isTouch } = useContext(StateContext);
  const { transitionEnd } = useContext(AnimationContext);
  const pathname = usePathname();

  const [showOnScroll, setShowOnScroll] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return; // scroll logic only on homepage

    const handleScroll = () => {
      setShowOnScroll(window.scrollY > 50);
    };

    handleScroll(); // initial check
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  let shouldShowBanner = true;

  if (pathname === "/") {
    if (isTouch) {
      shouldShowBanner = transitionEnd && showOnScroll;
    } else {
      shouldShowBanner = showOnScroll;
    }
  }

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
