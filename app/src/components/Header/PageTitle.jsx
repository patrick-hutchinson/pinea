import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

import styles from "./Header.module.css";

const PageTitle = () => {
  const router = useRouter();
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
