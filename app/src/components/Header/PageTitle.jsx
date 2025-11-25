import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Link from "next/link";

import styles from "./Header.module.css";

const PageTitle = () => {
  const pathname = usePathname();

  const [pageTitle, setPageTitle] = useState(null);

  useEffect(() => {
    // console.log("rerendering header!");
  }, []);

  useEffect(() => {
    if (!pathname) return;

    const firstSegment = pathname.split("/")[1]; // first segment after root
    if (!firstSegment) {
      setPageTitle("");
      return;
    }

    // replace dashes with spaces and uppercase
    const formattedTitle = firstSegment.replace(/-/g, " ").toUpperCase();
    setPageTitle(formattedTitle);
  }, [pathname]);

  const pageLink = pageTitle ? pageTitle.toLowerCase() : "";

  return (
    <Link href={`/${pageLink}`}>
      <div className={styles.pageTitle}>{pageTitle}</div>
    </Link>
  );
};

export default PageTitle;
