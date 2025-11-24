const AdBanner = () => {
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
      <video style={{ width: "100%", height: "100%" }} loop muted autoPlay playsInline>
        <source src="video/advert_banner.mp4"></source>
      </video>
    </div>
  );
};

export default AdBanner;
