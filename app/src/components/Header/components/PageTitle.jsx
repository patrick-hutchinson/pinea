import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { LanguageContext } from "@/context/LanguageContext";
import { SearchContext } from "@/context/SearchContext";
import AnimationLink from "@/components/Animation/AnimationLink";
import { stripLocaleFromPathname } from "@/lib/i18n";

import styles from "../Header.module.css";

const PageTitle = () => {
  const { language } = useContext(LanguageContext);
  const { searchQuery } = useContext(SearchContext);
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");

  const [pageTitle, setPageTitle] = useState(null);
  const routeTitleLabels = {
    "pinea-events": "P.IN.E.A Events",
  };
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
    "login",
    "profile",
    "pinea-events",
    "calendar-archive",
  ]);

  useEffect(() => {
    if (!basePathname) return;

    if (searchQuery.length >= 2) {
      setPageTitle("");
      return;
    }

    const firstSegment = basePathname.split("/")[1];
    if (!firstSegment) {
      setPageTitle("");
      return;
    }

    if (!knownTopLevelRoutes.has(firstSegment)) {
      setPageTitle("NOT FOUND");
      return;
    }

    const formattedTitle = routeTitleLabels[firstSegment] || firstSegment.replace(/-/g, " ").toUpperCase();

    if (formattedTitle === "IMPRINT") {
      setPageTitle(language === "en" ? "IMPRINT" : "IMPRESSUM");
      return;
    }

    setPageTitle(formattedTitle);
  }, [basePathname, language, searchQuery]);

  const handleClick = () => {
    if (pageTitle === "CALENDAR") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const pageTitlePath = pageTitle === "STORIES" ? "/stories" : pageTitle === "SHOP" ? "/shop" : null;

  if (pageTitlePath) {
    return (
      <AnimationLink path={pageTitlePath} className={styles.pageTitle}>
        {pageTitle}
      </AnimationLink>
    );
  }

  return (
    <div className={styles.pageTitle} onClick={() => handleClick()}>
      {pageTitle}
    </div>
  );
};

export default PageTitle;
