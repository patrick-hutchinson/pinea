import BlurPlaceholder from "./BlurMedia";
import ShrinkMedia from "./ShrinkMedia";

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
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <ShrinkMedia medium={medium} copyright="© Copyright text goes here" />
      </div>
    </BlurPlaceholder>
  );
};

export default BlurSpotlight;
