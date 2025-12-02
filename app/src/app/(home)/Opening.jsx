import { useContext, useEffect, useState, useRef } from "react";

import FadePresence from "@/components/Animation/FadePresence";

import { motion } from "framer-motion";

import { animate, AnimatePresence } from "framer-motion";

import { enableScroll, disableScroll } from "@/helpers/blockScrolling";

import { StateContext } from "@/context/StateContext";
import { DimensionsContext } from "@/context/DimensionsContext";
import { AnimationContext } from "@/context/AnimationContext";
import { CSSContext } from "@/context/CSSContext";
import { LanguageContext } from "@/context/LanguageContext";

import Media from "@/components/Media/Media";

import TextCarousel from "@/components/Carousel/TextCarousel";

import styles from "./HomePage.module.css";
import { usePathname } from "next/navigation";

import PineaIcon from "@/components/PineaIcon/PineaIcon";
import PictureBrush from "@/components/PictureBrush/PictureBrush";

const Opening = ({ pictureBrush }) => {
  const [hasClicked, setHasClicked] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const isDraggingRef = useRef(false);

  const pathname = usePathname();

  const { isMobile, isTouch } = useContext(StateContext);
  const { deviceDimensions } = useContext(DimensionsContext);
  const { hasEntered, setHasEntered } = useContext(AnimationContext);
  const { margin } = useContext(CSSContext);

  const announcement = "Swipe to draw, tap to enter →";

  const ENTRY_DELAY = 0.4;
  const ENTRY_DURATION = 1.5;

  const [index, setIndex] = useState(0);

  // Show Opening when returning Home
  useEffect(() => {
    if (pathname === "/") {
      setHasEntered(false);
    }
  }, [pathname]);

  // Handle scroll lock / unlock
  useEffect(() => {
    if (isMobile === null || isTouch === null) return;

    if (isMobile && isTouch) {
      if (!hasEntered) {
        // Mobile, before pressing ENTER: block scroll
        disableScroll();
      } else {
        // Mobile, after pressing ENTER: allow scroll
        enableScroll();
      }
    }

    if (!isMobile || !isTouch) {
      // Desktop: treat as already “entered”
      setHasEntered(true);
      enableScroll();
      return;
    }
  }, [isMobile, hasEntered]);

  const handleEnter = () => {
    setHasClicked(true);

    if (!isMobile || !isTouch) return;

    setTimeout(() => {
      enableScroll();
    }, (ENTRY_DELAY + ENTRY_DURATION) * 1000);

    animate(window.scrollY, deviceDimensions.height, {
      delay: ENTRY_DELAY,
      duration: ENTRY_DURATION,
      ease: [0.33, 0, 0.1, 1],
      onUpdate: (y) => window.scrollTo(0, y),
    });

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

  return (
    <motion.div
      onPanStart={() => handleDragStart()}
      onPanEnd={() => (isDraggingRef.current = false)}
      onTap={() => {
        if (!isDraggingRef.current) handleEnter();
      }}
    >
      <motion.div className={styles.pineaIcon} style={{ bottom: hasEntered ? margin : margin * 2 + 18 }}>
        <PineaIcon />
      </motion.div>
      {isMobile && isTouch && !hasEntered && <TextCarousel className={styles.text_carousel} text={announcement} />}
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
              cursor: !isMobile ? "none" : "default",
            }}
          >
            {pictureBrush.images.map((img, i) => (
              <motion.div
                key={img._id || i}
                initial={{ opacity: 0 }}
                animate={{ opacity: i === index ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                }}
              >
                <Media medium={img} dimensions={{ width: 40, height: 50 }} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Opening;
