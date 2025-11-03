const AdBanner = () => {
  return (
    <div
      style={{
        width: "720px",
        height: "90px",
        background: "#F60AFF",
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
