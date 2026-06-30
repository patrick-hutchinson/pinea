"use client";
import { useContext, useEffect, useState, useRef } from "react";

import Text from "@/components/Text/Text";
import FilterHeader from "@/components/FilterHeader/FilterHeader";

import { translate } from "@/helpers/translate";

import { LanguageContext } from "@/context/LanguageContext";

import styles from "./ImprintPage.module.css";
import { useRouter } from "next/navigation";
import { useInView } from "framer-motion";

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
  const partnerLogos = language === "en" ? site.footerLogosEnglish : site.footerLogosGerman;
  const supporterLogos = language === "en" ? site.supporterLogosEnglish : site.supporterLogosGerman;

  // Observe sections
  const privacyPolicyInView = useInView(privacy_policy, { margin: "-20% 0px -40% 0px" });
  const legalInView = useInView(legal, { margin: "-20% 0px -40% 0px" });
  const mediaOwnerAndPublisherInView = useInView(media_owner_and_publisher, { margin: "-20% 0px -40% 0px" });
  const imprintInView = useInView(imprint, { margin: "-20% 0px -40% 0px" });

  // Update hash when section changes
  useEffect(() => {
    let active = null;
    if (privacyPolicyInView) active = "privacy_policy";
    else if (legalInView) active = "legal";
    else if (mediaOwnerAndPublisherInView) active = "media_owner_and_publisher";
    else if (imprintInView) active = "imprint";

    if (active) {
      // Prevent redundant URL updates
      if (window.location.hash !== `#${active}`) {
        router.replace(`#${active}`, { scroll: false });
      }
    }
  }, [privacyPolicyInView, legalInView, mediaOwnerAndPublisherInView, imprintInView, router]);

  function handleFilter(item) {
    const element = document.getElementById(item);
    if (!element) return;

    const headerOffset = 60; // adjust to match your FilterHeader height
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  // useEffect(() => {
  //   setArray(language === "en" ? ["Privacy Policy & Imprint"] : ["Datenschutzerklärung & Impressum"]);
  // }, [language]);

  return (
    <main className={styles.main}>
      <FilterHeader
        array={scrollPoints.map((id) => labels[id])} // pass labels as display text
        handleFilter={(label) => {
          // find the id by label
          const id = Object.keys(labels).find((key) => labels[key] === label);
          handleFilter(id);
        }}
      />
      <div className={styles.page_container} typo="h4">
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
