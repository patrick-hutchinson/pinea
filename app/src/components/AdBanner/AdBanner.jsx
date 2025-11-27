import Media from "@/components/Media/Media";
import { useState, useEffect, useRef, useContext } from "react";

import { StateContext } from "@/context/StateContext";

const TIMER_DURATION = 8000; // 8 seconds

const AdBanner = ({ adBanner }) => {
  console.log(adBanner, "ad banner");
  const { isMobile } = useContext(StateContext);

  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!adBanner || adBanner.length <= 1) return;

    // Set next rotation
    timer.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % adBanner.length);
    }, TIMER_DURATION);

    return () => clearTimeout(timer.current);
  }, [index, adBanner]);

  const DesktopBanner = () => {
    return (
      <div
        style={{
          maxWidth: "720px",
          width: "calc(100% - 2 * var(--margin))",
          height: "auto",
          maxHeight: "90px",
          aspectRatio: "720 / 90",
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
          overflow: "hidden",
        }}
      >
        <Media medium={adBanner[index].mediumDesktop.medium} />
      </div>
    );
  };

  const MobileBanner = () => {
    return (
      <div
        style={{
          maxWidth: "320px",
          width: "calc(100% - 2 * var(--margin))",
          height: "auto",
          maxHeight: "50px",
          aspectRatio: "320 / 50",
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
          overflow: "hidden",
        }}
      >
        <Media medium={adBanner[index].mediumMobile.medium} />
      </div>
    );
  };

  return isMobile ? <MobileBanner /> : <DesktopBanner />;
};

export default AdBanner;
