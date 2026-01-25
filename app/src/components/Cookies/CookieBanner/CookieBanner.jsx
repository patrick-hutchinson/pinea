import CookieConsent from "react-cookie-consent";

import AnimationLink from "@/components/Animation/AnimationLink";
import { useContext, useEffect } from "react";
import { StateContext } from "@/context/StateContext";

import { LanguageContext } from "@/context/LanguageContext";

const CookieBanner = () => {
  const { isMobile } = useContext(StateContext);
  const { language } = useContext(LanguageContext);

  const loadMatomo = () => {
    var _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
    var d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src = "https://cdn.matomo.cloud/pineaperiodical.matomo.cloud/container_eZ5jOU2v.js";
    s.parentNode.insertBefore(g, s);
  };

  // Load Matomo if the user has already accepted previously
  useEffect(() => {
    const consent = document.cookie
      .split("; ")
      .find((row) => row.startsWith("pinea-consent="))
      ?.split("=")[1];

    if (consent === "true") {
      loadMatomo(); // automatically start Matomo if previously accepted
    }
  }, []);

  return (
    <CookieConsent
      //   enableDeclineButton
      disableButtonStyles
      disableStyles
      cookieName="pinea-consent"
      buttonText="" // we’ll render our custom button
      declineButtonText="" // same here
      style={{
        background: "transparent",
        position: "fixed",
        left: isMobile && "0px",
        marginBottom: isMobile ? "0px" : "12px",
        right: !isMobile && "var(--margin)",
        zIndex: 40,
        color: "#fff",
        height: "50px",
      }}
    >
      <div
        className="cookieConsent"
        typo="h4"
        style={{
          height: "50px",
          display: "flex",
          flexDirection: "column",

          // margin: "0 0 0 auto",
          background: "#000",
          width: isMobile ? "100dvw" : "fit-content",

          padding: "var(--margin-small) var(--margin)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <p>
            {language === "de"
              ? "Wir setzen Cookies ein, um dein Surferlebnis zu verbessern."
              : "We use cookies to improve your browsing experience."}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                document.cookie = "pinea-consent=true; path=/"; // manually set cookie
                loadMatomo(); // <-- start Matomo only now
                document.querySelector(".CookieConsent")?.remove(); // hide banner
              }}
            >
              {language === "de" ? "Akzeptieren" : "Accept"}
            </button>
            <button
              onClick={() => {
                document.cookie = "pinea-consent=false; path=/";
                document.querySelector(".CookieConsent")?.remove(); // hide banner
              }}
            >
              {language === "de" ? "Nicht akzeptieren" : "Decline"}
            </button>
          </div>
          <AnimationLink path="/imprint"> {language === "de" ? "Mehr lesen" : "Read more"}</AnimationLink>
        </div>
      </div>
    </CookieConsent>
  );
};

export default CookieBanner;
