"use client";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";
import { AnimationContext } from "@/context/AnimationContext";
import FadePresence from "@/components/Animation/FadePresence";
import CookieBanner from "@/components/Cookies/CookieBanner/CookieBanner";
import { stripLocaleFromPathname } from "@/lib/i18n";

import { usePathname } from "next/navigation";

export default function CookieBannerWrapper() {
  const { isMobile, isTouch } = useContext(StateContext);
  const { transitionEnd } = useContext(AnimationContext);
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const isShopRoute = basePathname === "/shop" || basePathname?.startsWith("/shop/");

  const [showOnScroll, setShowOnScroll] = useState(false);

  useEffect(() => {
    if (basePathname !== "/") return; // scroll logic only on homepage

    const handleScroll = () => {
      setShowOnScroll(window.scrollY > 50);
    };

    handleScroll(); // initial check
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [basePathname]);

  let shouldShowBanner = true;

  if (basePathname === "/") {
    if (isTouch) {
      shouldShowBanner = transitionEnd && showOnScroll;
    } else {
      shouldShowBanner = showOnScroll;
    }
  }

  if (isShopRoute) {
    return null;
  }

  return (
    <>
      <div style={{ zIndex: 11, position: "relative" }}>
        <FadePresence motionKey={shouldShowBanner ? "visible" : "hidden"}>
          {shouldShowBanner && <CookieBanner />}
        </FadePresence>
      </div>
    </>
  );
}
