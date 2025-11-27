import Icon from "@/components/Icon/Icon";

import styles from "./Media.module.css";
import { motion } from "framer-motion";

const CropButton = ({ setCropped, cropped }) => (
  <motion.div
    onClick={(e) => {
      e.stopPropagation(); // 👈 prevent parent clicks
      setCropped((prev) => !prev);
    }}
    // whileHover={{ scale: 2 }}
    style={{
      position: "absolute",
      bottom: "var(--margin)",
      right: "var(--margin)",
      cursor: "pointer",
      height: "16px",
      width: "16px",
      // width: "fit-content",
      zIndex: 1,
      fontSize: "var(--font-size-5)",
      // transform: "translateX(50%)",
      // color: "#000",
      // border: "1px solid #fff",
      // padding: "2px 2px",
      lineHeight: 1,
      display: "flex",
      verticalAlign: "center",
      // background: "#fff",
    }}
  >
    {/* <Icon path="icons/magnifying-glass.svg" className={styles.icon} /> */}
    <img src="/icons/crop.png" className={styles.icon} />
  </motion.div>
);

export default CropButton;
