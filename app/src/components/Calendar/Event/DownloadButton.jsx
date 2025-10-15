import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

const DownloadIcon = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);

  const opacityVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        opacity: { delay: 0.3, duration: 0.2, ease: "easeInOut" },
      },
    },
  };

  return (
    <motion.div
      style={{
        position: "relative",
        width: 16,
        height: 16,
        cursor: "pointer",
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
    >
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: 16,
          width: 16,
          border: "1px solid #000",
          borderRadius: 12,
          transformOrigin: "right",
        }}
        animate={{ width: hovered ? 85 : 16 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#000",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
        }}
        typo="h4"
      >
        <motion.span
          style={{ position: "absolute", right: "100%", marginRight: 8, top: 3 }} // text sits left of the +
          initial="hidden"
          animate={hovered ? "visible" : "hidden"}
          variants={opacityVariants}
          typo="h5"
        >
          CALENDAR
        </motion.span>
        +
      </div>
    </motion.div>
  );
};

export default DownloadIcon;
