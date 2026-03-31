"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import PictureBrush from "@/components/PictureBrush/PictureBrush";
import AnimationLink from "@/components/Animation/AnimationLink";
import MicroFooter from "@/components/Footer/MicroFooter";
import { stripLocaleFromPathname } from "@/lib/i18n";

import styles from "./NotFoundPage.module.css";

const NotFoundPage = ({ images }) => {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const knownTopLevelRoutes = new Set([
    "about",
    "archive",
    "calendar",
    "contributors",
    "imprint",
    "memberships",
    "news",
    "newsletter",
    "open-calls",
    "pinsel",
    "print-periodical",
    "shop",
    "stories",
  ]);
  const firstSegment = basePathname.split("/")[1] || "";
  const [clientPathname, setClientPathname] = useState(null);

  useEffect(() => {
    setClientPathname(window.location.pathname || "/");
  }, []);

  const resolvedBasePathname = useMemo(() => {
    if (!clientPathname) return basePathname;
    return stripLocaleFromPathname(clientPathname);
  }, [basePathname, clientPathname]);

  const resolvedFirstSegment = resolvedBasePathname.split("/")[1] || "";
  const isInternalNotFoundRoute = resolvedBasePathname === "/_not-found" || resolvedFirstSegment === "_not-found";
  const shouldRender = Boolean(resolvedFirstSegment) && !knownTopLevelRoutes.has(resolvedFirstSegment) && !isInternalNotFoundRoute;

  useEffect(() => {
    if (!shouldRender) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <main className={styles.root}>
      <PictureBrush images={images} hasEntered={false} />
      <div className={styles.content}>
        <p className={styles.message}>Oops, this page doesn&apos;t exist. Here&apos;s the way</p>
        <AnimationLink className={styles.link} path="/">
          Home
        </AnimationLink>
      </div>
      <MicroFooter className={styles.microFooter} />
    </main>
  );
};

export default NotFoundPage;
