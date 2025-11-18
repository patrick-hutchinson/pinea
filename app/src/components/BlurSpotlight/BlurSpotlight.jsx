import BlurPlaceholder from "@/components/BlurMedia/BlurMedia";
import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";

const BlurSpotlight = ({ caption, medium, className, storyType }) => {
  return (
    <BlurPlaceholder className={className} medium={medium}>
      <div
        style={{
          zIndex: 1,

          position: "absolute",

          minWidth: "550px",
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
        <ExpandMedia medium={medium} copyright={caption} />
      </div>
      {storyType && (
        <p style={{ position: "absolute", bottom: "var(--margin)", left: "var(--margin)", color: "#fff" }} typo="h4">
          {storyType}
        </p>
      )}
    </BlurPlaceholder>
  );
};

export default BlurSpotlight;
