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
        zIndex: 100,
        pointerEvents: showMenu ? "all" : "none",
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={motionKey}
          style={{ transformOrigin: "top middle" }}
          initial={{ scale: 0.9, rotateX: -90 }}
          animate={{ scale: 1, rotateX: 0 }}
          exit={{
            scale: 0.9,
            rotateX: -90,
            transition: {
              scale: { duration: 0.7, ease: [0.86, 0, 0.14, 1] },
              rotateX: { duration: 0.5, ease: "easeInOut", delay: 0.7 }, // starts after scale finishes
            },
          }}
          transition={{
            rotateX: { duration: 0.5, ease: "easeInOut" },
            scale: { duration: 0.7, delay: 0.5, ease: [0.86, 0, 0.14, 1] },
          }}
          className={className}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FlipPresenceTwo;
