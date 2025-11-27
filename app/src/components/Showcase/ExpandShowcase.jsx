import BlurPlaceholder from "@/components/BlurMedia/BlurMedia";
import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";

import FullscreenPreview from "@/components/FullscreenPreview/FullscreenPreview";
import { StateContext } from "@/context/StateContext";

import styles from "./Showcase.module.css";
import { useContext, useState } from "react";

const ExpandShowcase = ({ caption, medium, className, storyType }) => {
  const { isMobile } = useContext(StateContext);
  const [showFullscreen, setShowFullscreen] = useState(false);

  return (
    <>
      <BlurPlaceholder className={`${className} ${styles.showcase_image}`} medium={medium}>
        <div
          onClick={() => isMobile && setShowFullscreen(true)}
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

      {showFullscreen && (
        <FullscreenPreview
          medium={medium}
          showFullscreen={showFullscreen}
          setShowFullscreen={setShowFullscreen}
          copyright={caption}
        />
      )}
    </>
  );
};

export default ExpandShowcase;
