import { useContext, useEffect, useState, useRef, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import { enableScroll, disableScroll } from "@/helpers/blockScrolling";

import { StateContext } from "@/context/StateContext";
import { DimensionsContext } from "@/context/DimensionsContext";
import { AnimationContext } from "@/context/AnimationContext";
import { CSSContext } from "@/context/CSSContext";
import { useLenisContext } from "@/context/LenisContext";

import Media from "@/components/Media/Media";
import TextCarousel from "@/components/Carousel/TextCarousel";
import PineaIcon from "@/components/PineaIcon/PineaIcon";
import PictureBrush from "@/components/PictureBrush/PictureBrush";
import { stripLocaleFromPathname } from "@/lib/i18n";

import styles from "../HomePage.module.css";

const Opening = ({ pictureBrush }) => {
  const [mounted, setMounted] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const isDraggingRef = useRef(false);

  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");

  const { isMobile, isTouch, isDesktop } = useContext(StateContext);
  const { deviceDimensions } = useContext(DimensionsContext);
  const { hasEntered, setHasEntered, transitionEnd, setTransitionEnd } = useContext(AnimationContext);
  const { margin } = useContext(CSSContext);
  const lenis = useLenisContext();

  const announcement = "Swipe to draw, tap to enter →";

  const ENTRY_DELAY = 0.4;
  const ENTRY_DURATION = 1.5;

  const [index, setIndex] = useState(0);

  // Show Opening when returning Home
  useEffect(() => {
    if (basePathname === "/") {
      setHasEntered(false);
    }
  }, [basePathname, setHasEntered]);

  // Handle scroll lock / unlock
  useEffect(() => {
    if (isTouch === null) return;

    if (isTouch) {
      if (!hasEntered) {
        disableScroll(); // Mobile, before pressing ENTER: block scroll
      } else {
        enableScroll(); // Mobile, after pressing ENTER: allow scroll
      }
    } else {
      // Desktop: treat as already “entered”
      setHasEntered(true);
      enableScroll();
      return;
    }
  }, [isTouch, hasEntered]);

  const handleEntryAnimation = () => {
    setHasClicked(true);

    if (isDesktop) return;

    setTimeout(
      () => {
        enableScroll();
        setTransitionEnd(true);
      },
      (ENTRY_DELAY + ENTRY_DURATION) * 1000,
    );

    const scrollTarget = deviceDimensions.height || window.innerHeight;
    window.setTimeout(() => {
      if (lenis?.scrollTo) {
        lenis.scrollTo(scrollTarget, {
          duration: ENTRY_DURATION,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          force: true,
        });
        return;
      }

      window.scrollTo({ top: scrollTarget, behavior: "smooth" });
    }, ENTRY_DELAY * 1000);

    setHasEntered(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % pictureBrush.images.length);
    }, 200);

    return () => clearInterval(interval);
  }, [pictureBrush.images.length]);

  const handleDragStart = () => {
    setHasDragged(true);

    isDraggingRef.current = true;
  };

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(true);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return;

  return (
    <motion.div
      onPanStart={() => handleDragStart()}
      onPanEnd={() => (isDraggingRef.current = false)}
      onTap={() => {
        if (!isDraggingRef.current) handleEntryAnimation();
      }}
    >
      <motion.div
        className={styles.pineaIcon}
        initial={{ bottom: !isTouch ? margin : margin * 2 + 18 }}
        animate={{ bottom: !isTouch ? margin : hasEntered ? margin : margin * 2 + 18 }}
      >
        <PineaIcon />
      </motion.div>
      {isTouch && !hasEntered && <TextCarousel className={styles.text_carousel} text={announcement} />}
      <PictureBrush images={pictureBrush.images} hasEntered={hasEntered} />
      <AnimatePresence initial={false}>
        {isMobile && isTouch && !hasDragged && !hasClicked && !hasScrolled && (
          <motion.div
            style={{
              position: "fixed",
              top: "calc(50dvh - 25px)",
              left: "calc(50vw - 20px)",
              width: "40px",
              height: "50px",
              pointerEvents: "none",
              zIndex: 10,
              cursor: !isTouch ? "none" : "default",
            }}
          ></motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Opening;
