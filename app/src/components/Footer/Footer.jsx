"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Text from "@/components/Text";
import Credits from "./Credits";
import NewsletterSignUp from "./NewsletterSignUp";

import styles from "./Footer.module.css";
import MiniFooter from "./MiniFooter";

const Footer = ({ site }) => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [hideFooter, setHideFooter] = useState(false);
  const [useMiniFooter, setUseMiniFooter] = useState(false);

  const hiddenPaths = ["/voices"];
  const miniFooterPaths = ["/about"];

  useEffect(() => {
    // 1️⃣ Check if a Footer should be displayed
    hiddenPaths.map((path) => {
      pathname.includes(path) ? setHideFooter(true) : setHideFooter(false);
    });

    // 2️⃣ Check if the Mini Footer should be displayed
    miniFooterPaths.map((path) => {
      pathname.includes(path) ? setUseMiniFooter(true) : setUseMiniFooter(false);
    });
  }, [pathname]);

  if (hideFooter) return;

  if (useMiniFooter) return <MiniFooter />;

  return (
    <footer id={styles.footer} className={styles.full} style={{ marginTop: isHome ? "50vw" : 0 }}>
      <Text text={site.about} />
      <NewsletterSignUp />
      <MiniFooter />
    </footer>
  );
};

export default Footer;
