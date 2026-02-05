import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LanguageContext } from "@/context/LanguageContext";
import { SearchContext } from "@/context/SearchContext";

import styles from "../Header.module.css";

const PageTitle = () => {
  const { language } = useContext(LanguageContext);
  const { searchQuery } = useContext(SearchContext);
  const router = useRouter();
  const pathname = usePathname();

  const [pageTitle, setPageTitle] = useState(null);

  useEffect(() => {
    if (!pathname) return;

    if (searchQuery.length >= 2) {
      setPageTitle("SEARCH");
      return;
    }

    const firstSegment = pathname.split("/")[1];
    if (!firstSegment) {
      setPageTitle("");
      return;
    }

    const formattedTitle = firstSegment.replace(/-/g, " ").toUpperCase();

    if (formattedTitle === "IMPRINT") {
      setPageTitle(language === "en" ? "IMPRINT" : "IMPRESSUM");
      return;
    }

    setPageTitle(formattedTitle);
  }, [pathname, language, searchQuery]);

  const handleClick = () => {
    if (pageTitle === "CALENDAR") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (pageTitle === "STORIES") {
      router.push("/stories");
    }
  };

  return (
    <div className={styles.pageTitle} onClick={() => handleClick()}>
      {pageTitle}
    </div>
  );
};

export default PageTitle;
