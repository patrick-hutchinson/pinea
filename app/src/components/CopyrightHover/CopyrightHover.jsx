import { useState } from "react";

import { motion } from "framer-motion";
import styles from "./CopyrightHover.module.css";
import Text from "@/components/Text/Text";

const CopyrightHover = ({ copyright }) => {
  const [isHovered, setIsHovered] = useState(null);
  return (
    <motion.div className={styles.cover_media_copyright} typo="h5">
      <motion.span
        className={styles.cover_media_copyright_button}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        ©
      </motion.span>
      <motion.div
        className={styles.cover_media_copyright_text}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Text text={copyright} />
      </motion.div>
    </motion.div>
  );
};

export default CopyrightHover;
