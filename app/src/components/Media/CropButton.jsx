import Icon from "@/components/Icon/Icon";

import styles from "./Media.module.css";
import { motion } from "framer-motion";

const CropButton = ({ setCropped, cropped, className }) => (
  <motion.div
    className={className}
    onClick={(e) => {
      e.stopPropagation(); // 👈 prevent parent clicks
      setCropped((prev) => !prev);
    }}
    style={{
      position: "absolute",
      bottom: "var(--margin)",
      right: "var(--margin)",
      cursor: "pointer",
      height: "16px",
      width: "16px",

      zIndex: 1,
      fontSize: "var(--font-size-5)",

      lineHeight: 1,
      display: "flex",
      verticalAlign: "center",
    }}
  >
    {/* <Icon path="icons/magnifying-glass.svg" className={styles.icon} /> */}
    <img src="/icons/crop.png" className={styles.icon} />
  </motion.div>
);

export default CropButton;
