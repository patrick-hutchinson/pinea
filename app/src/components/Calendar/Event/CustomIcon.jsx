import { motion } from "framer-motion";
import { useState } from "react";
import { calculateTextWidth } from "@/helpers/calculateTextWidth";

const CustomIcon = ({ onClick, preview, text }) => {
  const [textWidth] = useState(calculateTextWidth(text, "13px"));
  const [hovered, setHovered] = useState(false);

  const opacityVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.15, duration: 0.2, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      layout // 👈 enables layout transitions between siblings
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: hovered ? textWidth + 8 : 16,
        height: 16,
        cursor: "pointer",
        overflow: "visible",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
    >
      {/* The border circle */}
      <motion.div
        layout
        style={{
          height: 16,
          width: "100%", // 👈 fill the parent
          border: "1px solid #000",
          borderRadius: 12,
          boxSizing: "border-box",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* The icon + expanding text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#000",
          display: "flex",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <motion.span
          style={{
            position: "absolute",
            right: "100%",
            paddingRight: 8,
            top: 3,
            whiteSpace: "nowrap",
          }}
          initial="hidden"
          animate={hovered ? "visible" : "hidden"}
          variants={opacityVariants}
        >
          {text}
        </motion.span>
        {preview}
      </div>
    </motion.div>
  );
};

export default CustomIcon;
