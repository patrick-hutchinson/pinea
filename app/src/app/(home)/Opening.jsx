import { useContext, useEffect, useState, useRef } from "react";

import FadePresence from "@/components/Animation/FadePresence";

import { motion } from "framer-motion";

import { animate, AnimatePresence } from "framer-motion";

import { enableScroll, disableScroll } from "@/helpers/blockScrolling";

import { StateContext } from "@/context/StateContext";
import { DimensionsContext } from "@/context/DimensionsContext";
import { GlobalVariablesContext } from "@/context/GlobalVariablesContext";
import { LanguageContext } from "@/context/LanguageContext";

import Media from "@/components/Media/Media";

import TextCarousel from "@/components/Carousel/TextCarousel";

import styles from "./HomePage.module.css";
import { usePathname } from "next/navigation";

import PineaIcon from "@/components/PineaIcon/PineaIcon";
import PictureBrush from "@/components/PictureBrush/PictureBrush";

const Opening = ({ pictureBrush }) => {
  const [hasEntered, setHasEntered] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  const isDraggingRef = useRef(false);

  const pathname = usePathname();

  const { language } = useContext(LanguageContext);
  const { isMobile } = useContext(StateContext);
  const { deviceDimensions } = useContext(DimensionsContext);
  const { margin } = useContext(GlobalVariablesContext);

  const OPENING_DURATION = 0.5;
  const OPENING_DELAY = 1;

  const announcement = language === "en" ? "Swipe to draw, tap to enter" : "Wische, um zu malen. Tippe, um zu starten.";

  const [index, setIndex] = useState(0);

  // Show Opening when returning Home
  useEffect(() => {
    if (pathname === "/") {
      setHasEntered(false);
    }
  }, [pathname]);

  // Handle scroll lock / unlock
  useEffect(() => {
    if (isMobile === null) return;
    if (isMobile) {
      console.log("is mobile");

      if (hasEntered) {
        console.log("has entered true");
        // Mobile, before pressing ENTER: block scroll
        enableScroll();
      } else {
        console.log("has entered false");
        // Mobile, after pressing ENTER: allow scroll
        disableScroll();
      }
    }

    if (!isMobile) {
      console.log("is desktop");
      // Desktop: treat as already “entered”
      setHasEntered(true);
      enableScroll();
      return;
    }
  }, [isMobile, hasEntered]);

  const handleEnter = () => {
    setHasClicked(true);

    console.log("clicked logo!");
    if (!isMobile) return;

    enableScroll();

    animate(window.scrollY, deviceDimensions.height, {
      delay: OPENING_DURATION + OPENING_DELAY,
      duration: 2,
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
  return (
    <motion.div
      onPanStart={() => handleDragStart()}
      onPanEnd={() => (isDraggingRef.current = false)}
      onTap={() => {
        if (!isDraggingRef.current) handleEnter();
      }}
    >
      <motion.div
        className={styles.pineaIcon}
        animate={{ bottom: hasEntered ? 12 : margin * 2 + 18 }}
        transition={{
          duration: OPENING_DURATION,
          delay: OPENING_DELAY,
          ease: [0.33, 0, 0.1, 1], // optional, matches your scroll ease
        }}
      >
        <PineaIcon />
      </motion.div>
      {isMobile && !hasEntered && (
        <FadePresence motionKey="carousel" delay={OPENING_DURATION + OPENING_DELAY}>
          <TextCarousel className={styles.text_carousel} text={announcement} />
        </FadePresence>
      )}
      <PictureBrush images={pictureBrush.images} />
      <AnimatePresence initial={false}>
        {isMobile && !hasDragged && !hasClicked && (
          <motion.div
            className="PREVIEW"
            style={{
              position: "fixed",
              top: "calc(50vh - 25px)",
              left: "calc(50vw - 20px)",
              width: "40px",
              height: "50px",
              pointerEvents: "none",
              zIndex: 10,
              cursor: "none",
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
