import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const menuVariants = {
  initial: {
    opacity: 0,
    rotateX: 90,
    y: "10%",
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    rotateX: 0,
    y: "0%",
    scale: 1,
  },
  exit: {
    opacity: 0,
    rotateX: 90,
    y: "10%",
    scale: 0.8,
  },
};

const enterTransition = {
  rotateX: { duration: 1 },
  y: { duration: 1 },
  scale: { duration: 1 },
  opacity: { duration: 0.65, delay: 0.15, ease: "easeOut" },
};

const exitTransition = {
  opacity: { duration: 0.5, delay: 0 },
  rotateX: { duration: 1 },
  y: { duration: 1 },
  scale: { duration: 1 },
};

export default function MenuTransition({ children, show }) {
  const [isAnimating, setIsAnimating] = useState(show);
  const isActive = show || isAnimating;

  useEffect(() => {
    if (show) setIsAnimating(true);
  }, [show]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100dvw",
        height: "100dvh",
        perspective: "3000px",
        WebkitPerspective: "3000px",
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        pointerEvents: show ? "all" : "none",
        zIndex: isActive ? 100 : -1,
      }}
    >
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => setIsAnimating(false)}>
        {show && (
          <motion.div
            key="menu"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={menuVariants}
            transition={show ? enterTransition : exitTransition}
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "opacity, transform",
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
