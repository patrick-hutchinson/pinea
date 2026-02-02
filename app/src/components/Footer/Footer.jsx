"use client";

import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Text from "@/components/Text/Text";

import NewsletterSignUp from "./NewsletterSignUp";

import styles from "./Footer.module.css";

import AnimationLink from "@/components/Animation/AnimationLink";
import Icon from "@/components/Icon/Icon";
import { translate } from "@/helpers/translate";

import MediaKitDownload from "../MediaKitDownload/MediaKitDownload";
import { LanguageContext } from "@/context/LanguageContext";

const Footer = ({ site, newsletter }) => {
  const { language } = useContext(LanguageContext);
  const pathname = usePathname();

  const microFooterPaths = ["/about", "/stories/", "/recommended", "/pinsel"];

  const useMicroFooter = microFooterPaths.some((path) => pathname.includes(path));

  if (useMicroFooter) return null;

  return (
    <footer id={styles.footer} className={styles.full}>
      <Text text={translate(site.description)} />
      <NewsletterSignUp newsletter={newsletter} />
      <footer id={styles.footer} className={styles.mini} typo="h4">
        <div className={styles.logo} typo="h3">
          <div>P.IN.E.A Periodical</div>
          <div>Photography Intermedia Et Al.</div>
        </div>

        <div style={{ display: "flex" }} className={styles.resource_wrapper}>
          <div style={{ display: "flex", gap: "50px" }}>
            <div className={styles.resources}>
              <MediaKitDownload file={language === "de" ? site.media_kit_de : site.media_kit_en} />
              <AnimationLink path="/imprint">{language === "de" ? "Impressum" : "Imprint"}</AnimationLink>
            </div>
            <div className={styles.social}>
              <AnimationLink path="/about">{language === "en" ? "Contact" : "Kontakt"}</AnimationLink>
              {site.socials.map((social, index) => (
                <li key={index}>
                  <a href={social.link ? social.link : "#"} target="_blank">
                    {translate(social.platform)}
                  </a>
                </li>
              ))}
            </div>
          </div>
          <Icon
            className={styles.icon}
            onClick={() => {
              window.open(
                language === "en" ? "https://www.bmwkms.gv.at/en.html" : "https://www.bmwkms.gv.at/",
                "_blank",
              );
            }}
            path="/logos/bundesministerium_de.svg"
            alt=""
          />
        </div>
      </footer>
    </footer>
  );
};

export default Footer;
