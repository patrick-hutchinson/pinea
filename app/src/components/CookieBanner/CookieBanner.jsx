import CookieConsent from "react-cookie-consent";

import Link from "next/link";
import { useContext } from "react";
import { StateContext } from "@/context/StateContext";

const CookieBanner = () => {
  const { isMobile } = useContext(StateContext);
  return (
    <CookieConsent
      //   enableDeclineButton
      disableButtonStyles
      cookieName="pinea-consent"
      buttonText="" // we’ll render our custom button
      declineButtonText="" // same here
      style={{ background: "transparent" }}
    >
      <div
        className="cookieConsent"
        typo="h4"
        style={{
          display: "flex",
          flexDirection: "column",

          margin: "0 0 0 auto",
          background: "#000",
          width: isMobile ? "100dvw" : "fit-content",

          padding: "var(--margin-small)",
          position: isMobile && "absolute",
          left: "0px",
          bottom: "0px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <p>Wir setzen Cookies, um Ihr Surferlebnis zu verbessern.</p>
          <Link href="/imprint">Mehr lesen</Link>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => {
              document.cookie = "pinea-consent=true; path=/"; // manually set cookie
              console.log("Accepted");
              document.querySelector(".CookieConsent")?.remove(); // hide banner
            }}
          >
            Akzeptieren
          </button>
          <button
            onClick={() => {
              document.cookie = "pinea-consent=false; path=/";
              console.log("Declined");
              document.querySelector(".CookieConsent")?.remove(); // hide banner
            }}
          >
            Nicht Akzeptieren
          </button>
        </div>
      </div>
    </CookieConsent>
  );
};

export default CookieBanner;
