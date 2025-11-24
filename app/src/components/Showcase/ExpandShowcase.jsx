import BlurPlaceholder from "@/components/BlurMedia/BlurMedia";
import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";

import styles from "./Showcase.module.css";

const ExpandShowcase = ({ caption, medium, className, storyType }) => {
  return (
    <BlurPlaceholder className={`${className} ${styles.showcase_image}`} medium={medium}>
      <div
        style={{
          zIndex: 1,

          position: "absolute",

          maxWidth: "80%",
          maxHeight: "80%",
          width: "auto",
          height: "80%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <CalendarExpandMedia medium={medium} copyright={caption} isActive={true} />
      </div>
      {storyType && (
        <p style={{ position: "absolute", bottom: "var(--margin)", left: "var(--margin)", color: "#fff" }} typo="h4">
          {storyType}
        </p>
      )}
    </BlurPlaceholder>
  );
};

export default ExpandShowcase;
