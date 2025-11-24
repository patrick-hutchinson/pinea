import { useEffect } from "react";

const BlurContainer = ({ children, className }) => {
  useEffect(() => {
    console.log("updated blurcontainer");
  }, []);
  return (
    <div
      className={className}
      style={{
        backdropFilter: "blur(var(--blur))",
        position: "relative",
        zIndex: 3,
        width: "100vw",
      }}
    >
      {children}
    </div>
  );
};

export default BlurContainer;
