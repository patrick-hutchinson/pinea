import Icon from "@/components/Icon/Icon";

import styles from "./Media.module.css";

const CropButton = ({ setCropped, cropped }) => (
  <div
    onClick={(e) => {
      e.stopPropagation(); // 👈 prevent parent clicks
      setCropped((prev) => !prev);
    }}
    style={{
      position: "absolute",
      bottom: "12px",
      right: "12px",
      cursor: "pointer",
      height: "18px",
      width: "18px",
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
    <img src="/icons/magnifying-glass.png" className={styles.icon} />
  </div>
);

export default CropButton;
