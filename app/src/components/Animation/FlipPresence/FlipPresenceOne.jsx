import { AnimatePresence, motion } from "framer-motion";
import { DimensionsContext } from "@/context/DimensionsContext";

const FlipPresenceOne = ({ children, className, motionKey, delay }) => {
  return (
    <div
      style={{
        perspective: "3000px",
        transformStyle: "preserve-3d",
        width: "100vw",
        height: "100vh",

        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "middle",
        zIndex: 40,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={motionKey}
          initial={{ scale: 0.3, rotateX: -90 }}
          animate={{ scale: 1, rotateX: 0 }}
          transition={{
            rotateX: { duration: 0.4, ease: "easeOut" },
            scale: { duration: 0.4, delay: 0.5, ease: "easeOut" },
          }}
          className={className}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FlipPresenceOne;
