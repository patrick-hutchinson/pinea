import { motion } from "framer-motion";
import Media from "@/components/Media/Media";
import { useContext, useEffect, useRef, useState } from "react";
import { CSSContext } from "@/context/CSSContext";
import TextMarquee from "@/components/TextMarquee/TextMarquee";

import { useTransitionRouter } from "next-view-transitions";
import styles from "./ShrinkMedia.module.css";
import { StateContext } from "@/context/StateContext";

const SatelliteShrink = ({ caption, medium, hasLanded, isActive, className, path, isDragging, loadEager }) => {
  const { isMobile } = useContext(StateContext);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mediaWidth, setMediaWidth] = useState(null);
  const [captionWidth, setCaptionWidth] = useState(0);
  const [isWidthSettled, setIsWidthSettled] = useState(false);
  const mediaRef = useRef(null);
  const captionRef = useRef(null);
  const { line_height_4, caption_gap } = useContext(CSSContext);
  const router = useTransitionRouter();

  const [scale, setScale] = useState(1);

  const pageAnimation = () => {
    const duration = 800;
    const root = document.documentElement;
    root.classList.add("is-route-transitioning");

    document.documentElement.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration,
      easing: "ease",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    });

    document.documentElement.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration,
      easing: "ease",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    });

    setTimeout(() => {
      root.classList.remove("is-route-transitioning");
      window.dispatchEvent(new Event("view-transition-finished"));
    }, duration);
  };

  useEffect(() => {
    // 1️⃣ If isActive is defined, use that.
    // 2️⃣ If on Desktop, use hasLanded and isHovering.
    // 3️⃣ If on Mobile, only use hasLanded.
    setShouldScroll(isActive !== undefined ? isActive : !isMobile ? hasLanded && isHovering : hasLanded);
  }, [hasLanded, isActive, isHovering, isMobile]);

  useEffect(() => {
    const active = hasLanded !== undefined ? hasLanded : isActive;
    if (!mediaRef.current) return;

    const mediaHeight = mediaRef.current.getBoundingClientRect().height;

    if (active) {
      const subtraction = (line_height_4 * 10 + caption_gap) * 2;
      setScale((mediaHeight - subtraction) / mediaHeight);
    } else {
      setScale(1); // reset scale when not active
    }
  }, [hasLanded, isActive, line_height_4, caption_gap]);

  useEffect(() => {
    if (!captionRef.current) return undefined;

    const element = captionRef.current;
    let rafId = null;

    const measure = () => {
      const { width } = element.getBoundingClientRect();
      if (Number.isFinite(width) && width > 0) {
        setCaptionWidth((prev) => (prev !== width ? width : prev));
      }
    };

    measure();
    rafId = requestAnimationFrame(measure);

    let observer = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(element);
    }

    window.addEventListener("resize", measure);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [hasLanded, scale, mediaWidth]);

  const measuredWidth = captionWidth || mediaWidth || 0;

  useEffect(() => {
    if (!hasLanded || !measuredWidth) {
      setIsWidthSettled(false);
      return undefined;
    }

    const timeoutId = setTimeout(() => setIsWidthSettled(true), 140);
    return () => clearTimeout(timeoutId);
  }, [hasLanded, measuredWidth]);

  const marqueeReady = hasLanded && isWidthSettled;

  // Define variants
  const mediaVariants = {
    rest: { scale: 1, transition: { duration: 0.2 } },
    hover: { scale: scale, transition: { duration: 0.2 } },
  };

  const captionVariants = {
    rest: { opacity: 0, transition: { duration: 0.3 } },
    hover: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="rest"
      whileHover={!isMobile ? "hover" : undefined}
      onHoverStart={!isMobile ? () => setIsHovering(true) : undefined}
      onHoverEnd={!isMobile ? () => setIsHovering(false) : undefined}
      onClick={() => {
        if (isDragging) return;
        router.push(path, { onTransitionReady: pageAnimation });
      }}
      animate="rest"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxHeight: "100%",
        height: "auto",
        width: "100%",
        cursor: isDragging ? "grabbing" : "pointer",
      }}
    >
      {/* Child that scales */}
      <motion.div
        variants={mediaVariants}
        animate={isMobile ? (shouldScroll ? "hover" : "rest") : undefined}
        style={{
          maxHeight: "100%",
          zIndex: 2,
          display: "flex",
          height: "auto",
          width: "100%",
        }}
      >
        <Media ref={mediaRef} medium={medium} loadEager={loadEager} objectFit="contain" onWidth={(w) => setMediaWidth(w)} />
      </motion.div>

      <motion.div
        ref={captionRef}
        typo="h4"
        variants={captionVariants}
        animate={isMobile ? (shouldScroll ? "hover" : "rest") : undefined}
        style={{
          position: "relative",
          bottom: "20px",
          textAlign: "center",
          width: "100%",
          zIndex: 1,
        }}
      >
        <div className={styles.caption} typo="h4">
          <div className={styles.caption_text} style={{ width: "100%" }}>
            <TextMarquee
              text={caption}
              mediaWidth={measuredWidth}
              activeElement={true}
              fontSize={13}
              isActive={marqueeReady && shouldScroll}
              className={className}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SatelliteShrink;
