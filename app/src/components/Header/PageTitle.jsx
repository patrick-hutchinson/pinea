import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

  //   if (!showPageTitle) return;

  return <div className={styles.pageTitle}>{pageTitle}</div>;
};

export default PageTitle;
