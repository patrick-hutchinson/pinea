import { motion } from "framer-motion";

const ZoomMediaWrapper = ({ children, zoomOnHover }) => {
  const mediaVariants = {
    idle: { scale: 1, transition: "easeInOut" },
    hovered: { scale: 1.05, transition: "easeInOut" },
  };

  return (
    <motion.div
      variants={mediaVariants}
      initial="idle"
      whileHover={zoomOnHover && "hovered"}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 18,
        mass: 0.8, // lowers initial acceleration → gentler start
        velocity: 0.2, // small push to start slow then speed up
      }}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {children}
    </motion.div>
  );
};

export default ZoomMediaWrapper;
