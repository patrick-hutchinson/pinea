import Media from "@/components/Media/Media";

const AdBanner = ({ medium }) => {
  return (
    <div
      style={{
        maxWidth: "720px",
        width: "calc(100% - 2 * var(--margin))",
        height: "auto",
        padding: "0 var(--margin)",
        maxHeight: "90px",
        // background: "#F60AFF",
        background: "#000000",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        left: "50%",
        position: "relative",
        transform: "translateX(-50%)",
        marginBottom: "130px",
      }}
    >
      <Media medium={medium} />
    </div>
  );
};

export default AdBanner;
