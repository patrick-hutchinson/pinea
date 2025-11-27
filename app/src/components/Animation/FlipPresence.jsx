import { AnimatePresence, motion } from "framer-motion";
import { DimensionsContext } from "@/context/DimensionsContext";

const FlipPresence = ({ children, className, motionKey, delay }) => {
  return (
    <div
      style={{
        perspective: "2000px",
        transformStyle: "preserve-3d",
        width: "100vw",
        height: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "middle",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          style={{ transformOrigin: "top center" }}
          key={motionKey}
          initial={{
            opacity: 0,
            scale: 0.5,
            rotateX: 90,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotateX: 0,
          }}
          transition={{
            rotateX: { duration: 0.5, ease: "easeOut" },
            opacity: { duration: 0.5, ease: "easeOut" },
            scale: { duration: 0.5, delay: 0.5 },
          }}
          className={className}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FlipPresence;
