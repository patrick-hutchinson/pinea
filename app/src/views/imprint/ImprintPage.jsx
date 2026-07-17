"use client";
import { useContext, useEffect, useState, useRef } from "react";

import Text from "@/components/Text/Text";
import FilterHeader from "@/components/FilterHeader/FilterHeader";

import { translate } from "@/helpers/translate";

import { LanguageContext } from "@/context/LanguageContext";
import { StateContext } from "@/context/StateContext";

import styles from "./ImprintPage.module.css";
import { useRouter } from "@/context/RouteContext";
import { CSSContext } from "@/context/CSSContext";
import { useLenisContext } from "@/context/LenisContext";

const imprintLabels = {
  supporters: [
    { _key: "de", value: "Partner:innen" },
    { _key: "en", value: "Partners" },
  ],
  partners: [
    { _key: "de", value: "Förder:innen" },
    { _key: "en", value: "Supporters" },
  ],
};

const ImprintPage = ({ site }) => {
  const { language } = useContext(LanguageContext);
  const { isMobile } = useContext(StateContext);
  const { header_height, filter_height, margin } = useContext(CSSContext);
  const lenis = useLenisContext();
  const [activeSection, setActiveSection] = useState("privacy_policy");
  // const [array, setArray] = useState(["Privacy Policy & Imprint"]);

  const router = useRouter();
  const scrollPoints = ["privacy_policy", "legal", "media_owner_and_publisher", "imprint"];

  const labels = {
    privacy_policy: language === "en" ? "Privacy Policy" : "Datenschutzerklärung",
    legal: language === "en" ? "GTC" : "AGBs",
    media_owner_and_publisher: language === "en" ? "Media Owner and Publisher" : "Medieninhaberin",
    imprint: language === "en" ? "Imprint" : "Impressum",
  };

  const privacy_policy = useRef(null);
  const legal = useRef(null);
  const media_owner_and_publisher = useRef(null);
  const imprint = useRef(null);
  const pageContainer = useRef(null);
  const partnerLogos = language === "en" ? site.footerLogosEnglish : site.footerLogosGerman;
  const supporterLogos = language === "en" ? site.supporterLogosEnglish : site.supporterLogosGerman;

  const getScrollOffset = () => header_height + filter_height + margin;

  const scrollToTop = (top) => {
    if (lenis) {
      const distance = Math.abs((window?.scrollY || 0) - top);
      const duration = Math.min(1.2, Math.max(0.5, distance / 1400));
      lenis.scrollTo(top, { duration });
      return;
    }

    window.scrollTo({ top, behavior: "auto" });
    requestAnimationFrame(() => {
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  useEffect(() => {
    let frame = null;

    const updateActiveSection = () => {
      const offset = getScrollOffset();
      const anchorY = offset + 1;
      const sections = [
        ["privacy_policy", privacy_policy.current],
        ["legal", legal.current],
        ["media_owner_and_publisher", media_owner_and_publisher.current],
        ["imprint", imprint.current],
      ].filter(([, element]) => element);

      let nextActive = sections[0]?.[0] || "privacy_policy";

      for (const [id, element] of sections) {
        if (element.getBoundingClientRect().top <= anchorY) {
          nextActive = id;
        }
      }

      setActiveSection((current) => (current === nextActive ? current : nextActive));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        updateActiveSection();
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [header_height, filter_height, margin]);

  useEffect(() => {
    if (!activeSection) return;
    if (window.location.hash !== `#${activeSection}`) {
      router.replace(`#${activeSection}`, { scroll: false });
    }
  }, [activeSection, router]);

  function handleFilter(item) {
    const element = document.getElementById(item);
    if (!element) return;

    const headerOffset = getScrollOffset();

    if (isMobile === false) {
      const textColumn = pageContainer.current || privacy_policy.current;
      if (!textColumn) return;

      const targetTop = Math.max(0, textColumn.getBoundingClientRect().top + window.scrollY - headerOffset);
      if (Math.abs((window.scrollY || 0) - targetTop) < 2) return;

      scrollToTop(targetTop);
      return;
    }

    setActiveSection(item);

    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    scrollToTop(offsetPosition);
  }

  // useEffect(() => {
  //   setArray(language === "en" ? ["Privacy Policy & Imprint"] : ["Datenschutzerklärung & Impressum"]);
  // }, [language]);

  return (
    <main className={styles.main}>
      <FilterHeader
        array={scrollPoints.map((id) => labels[id])} // pass labels as display text
        currentlyActive={labels[activeSection]}
        activeScrollBehavior="auto"
        handleFilter={(label) => {
          // find the id by label
          const id = Object.keys(labels).find((key) => labels[key] === label);
          handleFilter(id);
        }}
      />
      <div ref={pageContainer} className={styles.page_container} typo="h4">
        <div className={styles.first}>
          <div ref={privacy_policy} id="privacy_policy" className={styles.privacy}>
            <Text text={translate(site.privacy)} />
          </div>
          <div ref={legal} id="legal" className={styles.legal}>
            <Text text={translate(site.legal)} />
          </div>
          <div ref={media_owner_and_publisher} id="media_owner_and_publisher" className={styles.copyright}>
            <Text text={translate(site.copyright)} />
          </div>
        </div>
        <div ref={imprint} id="imprint" className={styles.imprint}>
          <Text text={translate(site.imprint)} />

          <div className={styles.logoGroups}>
            {partnerLogos && (
              <div className={styles.logoGroup}>
                <div className={styles.logoHeading}>{translate(imprintLabels.partners)}</div>
                <div className={styles.logoList}>
                  {partnerLogos?.map((logo, index) => (
                    <img
                      key={logo?.asset?._id || index}
                      className={styles.logoItem}
                      src={logo?.asset?.url}
                      alt={`Partner logo ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {supporterLogos && (
              <div className={styles.logoGroup}>
                <div className={styles.logoHeading}>{translate(imprintLabels.supporters)}</div>
                <div className={styles.logoList}>
                  {supporterLogos?.map((logo, index) => (
                    <img
                      key={logo?.asset?._id || index}
                      className={styles.logoItem}
                      src={logo?.asset?.url}
                      alt={`Supporter logo ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ImprintPage;
