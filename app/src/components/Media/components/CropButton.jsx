import { motion } from "framer-motion";

import styles from "../Media.module.css";

const CropButton = ({ setCropped, className }) => (
  <div
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
      width: "17px",
      zIndex: 12,

      fontSize: "var(--font-size-5)",

      lineHeight: 1,
      display: "flex",
      verticalAlign: "center",
    }}
  >
    <img src="/icons/crop.png" className={styles.icon} />
  </div>
);

export default CropButton;
