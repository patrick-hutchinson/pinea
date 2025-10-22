import BlurPlaceholder from "./BlurMedia";
// import ShrinkMedia from "./ShrinkMedia";
import ExpandMedia from "./ExpandMedia";

const BlurSpotlight = ({ caption, medium }) => {
  return (
    <BlurPlaceholder medium={medium}>
      <div
        style={{
          zIndex: 1,

          position: "absolute",

          minWidth: "550px",
          maxWidth: "80%",
          maxHeight: "80%",
          width: "auto",
          height: "80%",
          // overflow: "hidden",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <ExpandMedia medium={medium} copyright={caption} />
      </div>
    </BlurPlaceholder>
  );
};

export default BlurSpotlight;
