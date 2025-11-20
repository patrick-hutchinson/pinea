"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Text from "@/components/Text/Text";
import Credits from "./Credits";
import NewsletterSignUp from "./NewsletterSignUp";

import styles from "./Footer.module.css";
import MiniFooter from "./MiniFooter";
import MicroFooter from "./MicroFooter";

import { translate } from "@/helpers/translate";

const Footer = ({ site }) => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [hideFooter, setHideFooter] = useState(false);
  const [useMicroFooter, setUseMicroFooter] = useState(false);

  const hiddenPaths = ["/people/"];
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
    <footer id={styles.footer} className={styles.full} style={{ marginTop: isHome ? "50vw" : 0 }}>
      <Text text={translate(site.description)} />
      <NewsletterSignUp />
      <MiniFooter site={site} />
    </footer>
  );
};

export default Footer;
