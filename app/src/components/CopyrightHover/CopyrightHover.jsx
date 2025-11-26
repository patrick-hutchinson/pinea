import { useState } from "react";

import { motion } from "framer-motion";
import styles from "./CopyrightHover.module.css";
import Text from "@/components/Text/Text";

const CopyrightHover = ({ copyright, className, isTapped }) => {
  const [isHovered, setIsHovered] = useState(null);
  return (
    <motion.div className={`${className} ${styles.cover_media_copyright}`} typo="h5">
      <motion.span
        // className={styles.cover_media_copyright_button}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onTap={() => setIsHovered((prev) => !prev)}
      >
        <motion.div
          onClick={(e) => {
            e.stopPropagation(); // 👈 prevent parent clicks
          }}
          whileHover={{ scale: 2 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            cursor: "pointer",
            height: "12px",
            width: "12px",

            zIndex: 1,
            fontSize: "var(--font-size-5)",

            lineHeight: 1,
            display: "flex",
            verticalAlign: "center",
          }}
        >
          {/* <Icon path="icons/magnifying-glass.svg" className={styles.icon} /> */}
          <img src="/icons/copyright.png" className={styles.icon} />
        </motion.div>
      </motion.span>
      <motion.div
        className={styles.cover_media_copyright_text}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered || isTapped ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Text text={copyright} />
      </motion.div>
    </motion.div>
  );
};

export default CopyrightHover;
