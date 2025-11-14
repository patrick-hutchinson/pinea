import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Link from "next/link";

import styles from "./Header.module.css";

const PageTitle = () => {
  const pathname = usePathname();
  //   const [showPageTitle, setShowPageTitle] = useState(false);

  const [pageTitle, setPageTitle] = useState(null);

  useEffect(() => {
    if (!pathname) return;

    const firstSegment = pathname.split("/")[1]; // split by "/" and take first segment after root
    setPageTitle(firstSegment ? firstSegment.toUpperCase() : "");
  }, [pathname]);

  const pageLink = pageTitle ? pageTitle.toLowerCase() : "";

  //   if (!showPageTitle) return;

  return (
    <Link href={`/${pageLink}`}>
      <div className={styles.pageTitle}>{pageTitle}</div>
    </Link>
  );
};

export default PageTitle;
