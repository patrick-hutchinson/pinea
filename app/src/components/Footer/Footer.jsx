"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Text from "@/components/Text/Text";

import NewsletterSignUp from "./NewsletterSignUp";

import styles from "./Footer.module.css";
import MiniFooter from "./MiniFooter";

import { translate } from "@/helpers/translate";

const Footer = ({ site, newsletter }) => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [hideFooter, setHideFooter] = useState(false);
  const [useMicroFooter, setUseMicroFooter] = useState(false);

  const hiddenPaths = ["/recommended/", "/pinsel"];
  const microFooterPaths = ["/about", "/stories/"];

  useEffect(() => {
    // 1️⃣ Check if a Footer should be displayed
    hiddenPaths.map((path) => {
      pathname.includes(path) ? setHideFooter(true) : setHideFooter(false);
    });

    // 2️⃣ Check if the Mini Footer should be displayed
    microFooterPaths.map((path) => {
      pathname.includes(path) ? setUseMicroFooter(true) : setUseMicroFooter(false);
    });
  }, [pathname]);

  if (hideFooter) return;

  if (useMicroFooter) return;

  return (
    <footer id={styles.footer} className={styles.full}>
      <Text text={translate(site.description)} />
      <NewsletterSignUp newsletter={newsletter} />
      <MiniFooter site={site} />
    </footer>
  );
};

export default Footer;
