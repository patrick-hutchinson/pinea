import { usePathname } from "@/context/RouteContext";
import { useContext, useEffect, useState } from "react";

import { LanguageContext } from "@/context/LanguageContext";
import { SearchContext } from "@/context/SearchContext";
import { StateContext } from "@/context/StateContext";
import AnimationLink from "@/components/Animation/AnimationLink";
import { stripLocaleFromPathname } from "@/lib/i18n";

import styles from "../Header.module.css";

const PageTitle = () => {
  const { language } = useContext(LanguageContext);
  const { searchQuery, searchEntry } = useContext(SearchContext);
  const { isMobile } = useContext(StateContext);
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
    "editions",
  ]);

  useEffect(() => {
    if (!basePathname) return;

    if (searchQuery.length >= 2) {
      setPageTitle(isMobile === false ? "SEARCH" : "");
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
  }, [basePathname, language, searchQuery, isMobile]);

  const handleClick = () => {
    if (pageTitle === "CALENDAR") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const pageTitlePath = pageTitle === "STORIES" ? "/stories" : pageTitle === "SHOP" ? "/shop" : null;
  const showDesktopSearchTitle = isMobile === false && searchQuery.length >= 2;

  if (showDesktopSearchTitle) {
    return (
      <div className={`${styles.pageTitle} ${styles.searchPageTitle}`}>
        <div>SEARCH</div>
        <div className={styles.searchPageTitleEntry}>{searchEntry}</div>
      </div>
    );
  }

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
