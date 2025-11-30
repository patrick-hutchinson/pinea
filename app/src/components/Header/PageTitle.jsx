import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LanguageContext } from "@/context/LanguageContext";

import Link from "next/link";

import styles from "./Header.module.css";

const PageTitle = () => {
  const { language } = useContext(LanguageContext);
  const router = useRouter();
  const pathname = usePathname();

  const [pageTitle, setPageTitle] = useState(null);

  useEffect(() => {
    // console.log("rerendering header!");
  }, []);

  useEffect(() => {
    if (!pathname) return;

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
  }, [pathname, language]);

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
