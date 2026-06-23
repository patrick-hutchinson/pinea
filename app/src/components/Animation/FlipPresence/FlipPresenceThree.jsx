import { AnimatePresence, motion } from "framer-motion";

const flipAnimation = {
  initial: {
    rotateX: 90,
    scale: 0.8,
    y: "10%",
    opacity: 0,
  },
  animate: {
    rotateX: 0,
    scale: 1,
    y: "0%",
    opacity: 1,
  },
  exit: {
    rotateX: 90,
    scale: 0.8,
    y: "10%",
    opacity: 0,
    transition: {
      opacity: { duration: 0.5, delay: 0 },
      rotateX: { duration: 1 },
      y: { duration: 1 },
      scale: { duration: 1 },
    },
  },
  transition: {
    rotateX: { duration: 1 },
    y: { duration: 1 },
    scale: { duration: 1 },
    opacity: { duration: 0.65, delay: 0.15, ease: "easeOut" },
  },
};

const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 1, ease: "easeOut" },
  },
  transition: { duration: 1, ease: "easeOut" },
};

const FlipPresenceTwo = ({ children, className, motionKey, delay, showMenu, animation = "flip" }) => {
  const motionProps = animation === "fade" ? fadeAnimation : flipAnimation;

  return (
    <div
      style={{
        perspective: "3000px",
        transformStyle: "preserve-3d",
        width: "100vw",
        height: "100vh",

        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "middle",
        zIndex: showMenu ? 100 : 40,
        pointerEvents: showMenu ? "all" : "none",
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={motionKey}
          style={{ transformOrigin: "top center" }}
          initial={motionProps.initial}
          animate={motionProps.animate}
          exit={motionProps.exit}
          transition={motionProps.transition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FlipPresenceTwo;
