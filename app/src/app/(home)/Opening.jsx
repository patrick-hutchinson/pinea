import FadePresence from "@/components/Animation/FadePresence";

import { motion } from "framer-motion";

import { animate, AnimatePresence } from "framer-motion";

import { enableScroll, disableScroll } from "@/helpers/blockScrolling";

import { StateContext } from "@/context/StateContext";
import { DimensionsContext } from "@/context/DimensionsContext";
import { GlobalVariablesContext } from "@/context/GlobalVariablesContext";

import TextCarousel from "@/components/Carousel/TextCarousel";

import styles from "./HomePage.module.css";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import PineaIcon from "@/components/PineaIcon/PineaIcon";
import PictureBrush from "@/components/PictureBrush/PictureBrush";

const Opening = ({ pictureBrush }) => {
  const [hasEntered, setHasEntered] = useState(false);

  const pathname = usePathname();

  const { isMobile } = useContext(StateContext);
  const { deviceDimensions } = useContext(DimensionsContext);
  const { margin } = useContext(GlobalVariablesContext);

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
    console.log("clicked logo!");
    if (!isMobile) return;

    enableScroll();

    animate(window.scrollY, deviceDimensions.height, {
      duration: 2,
      ease: [0.33, 0, 0.1, 1],
      onUpdate: (y) => window.scrollTo(0, y),
    });

    setHasEntered(true);
  };
  return (
    <>
      <motion.div
        className={styles.pineaIcon}
        animate={{ bottom: hasEntered ? 12 : margin * 2 + 18 }}
        transition={{
          duration: 0.5,
          delay: 0.5,
          ease: [0.33, 0, 0.1, 1], // optional, matches your scroll ease
        }}
      >
        <PineaIcon onClick={() => handleEnter()} />
      </motion.div>

      {isMobile && !hasEntered && (
        <FadePresence motionKey="carousel" delay={1}>
          <TextCarousel className={styles.text_carousel} text="CLICK THE LOGO TO ENTER" />
        </FadePresence>
      )}
      <PictureBrush images={pictureBrush.images} />
    </>
  );
};

export default Opening;
