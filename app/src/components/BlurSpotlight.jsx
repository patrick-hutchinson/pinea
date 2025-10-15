import Media from "@/components/Media";
import BlurPlaceholder from "./BlurMedia";

const BlurSpotlight = ({ medium }) => {
  return (
    <BlurPlaceholder medium={medium}>
      <div
        style={{
          position: "relative",
          maxWidth: "80%",
          maxHeight: "80%",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <Media medium={medium} />
      </div>
    </BlurPlaceholder>
  );
};

export default BlurSpotlight;
