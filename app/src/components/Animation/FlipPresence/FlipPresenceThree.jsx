import { AnimatePresence, motion } from "framer-motion";

const FlipPresenceTwo = ({ children, className, motionKey, delay, showMenu }) => {
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
        zIndex: 40,
        pointerEvents: showMenu ? "all" : "none",
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={motionKey}
          style={{ transformOrigin: "top center" }}
          initial={{
            rotateX: 90,
            scale: 0.8,
            y: "10%",
            opacity: 0,
          }}
          animate={{
            rotateX: 0,
            scale: 1,
            y: "0%",
            opacity: 1,
          }}
          exit={{
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
          }}
          transition={{
            rotateX: { duration: 1 },
            y: { duration: 1 },
            scale: { duration: 1 },
            opacity: { duration: 0.65, delay: 0.15, ease: "easeOut" },
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FlipPresenceTwo;
