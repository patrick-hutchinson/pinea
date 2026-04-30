import Media from "@/components/Media/Media";
import { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";

import { StateContext } from "@/context/StateContext";

const TIMER_DURATION = 8000; // 8 seconds

const AdBanner = ({ adBanner }) => {
  const { isMobile } = useContext(StateContext);

  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const banners = Array.isArray(adBanner)
    ? adBanner.filter((entry) => entry?.mediumDesktop?.medium || entry?.mediumMobile?.medium)
    : [];
  const activeBanner = banners.length ? banners[index % banners.length] : null;

  useEffect(() => {
    setIndex(0);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;

    // Set next rotation
    timer.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, TIMER_DURATION);

    return () => clearTimeout(timer.current);
  }, [index, banners.length]);

  if (!activeBanner) return null;

  const DesktopBanner = () => {
    const Wrapper = activeBanner.link ? Link : "div";

    const wrapperProps = activeBanner.link
      ? {
          href: activeBanner.link,
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {};

    return (
      <Wrapper {...wrapperProps}>
        <div
          style={{
            maxWidth: "720px",
            width: "calc(100% - 2 * var(--margin))",
            height: "auto",
            maxHeight: "90px",
            aspectRatio: "720 / 90",
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
          {activeBanner.mediumDesktop?.medium ? <Media medium={activeBanner.mediumDesktop.medium} /> : null}
        </div>
      </Wrapper>
    );
  };

  const MobileBanner = () => {
    const Wrapper = activeBanner.link ? Link : "div";

    const wrapperProps = activeBanner.link
      ? {
          href: activeBanner.link,
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {};

    return (
      <Wrapper {...wrapperProps}>
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
          {activeBanner.mediumMobile?.medium ? <Media medium={activeBanner.mediumMobile.medium} /> : null}
        </div>
      </Wrapper>
    );
  };

  return isMobile ? <MobileBanner /> : <DesktopBanner />;
};

export default AdBanner;
