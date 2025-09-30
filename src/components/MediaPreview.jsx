const MediaPreview = () => {
  return createPortal(
    <div
      ref={preview}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        transform: "translate(0, 0)",
        pointerEvents: "none",
        width: "20vw",
        height: "500px",
        zIndex: "10",
      }}
    >
      <Media medium={openCall.thumbnail} enableFullscreen={false} />
    </div>,
    document.getElementById("hover-preview")
  );
};

export default MediaPreview;
