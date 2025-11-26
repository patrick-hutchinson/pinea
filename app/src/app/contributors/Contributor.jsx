import { useRef, useContext, useEffect } from "react";
import { useInView } from "framer-motion";

import { useRouter } from "next/navigation";
import PersonInfo from "@/components/People/PersonInfo";
import ArticleLinks from "./ArticleLinks";

import styles from "./ContributorsPage.module.css";
import { GlobalVariablesContext } from "@/context/GlobalVariablesContext";

const Contributor = ({ contributor, index, setActiveLetter }) => {
  const router = useRouter();
  const { header_height, filter_height } = useContext(GlobalVariablesContext);

  const contributorRef = useRef(null);

  const isInView = useInView(contributorRef, {
    margin: `-${header_height + filter_height}px 0px -85% 0px`,
  });

  const lastName = contributor.name.trim().split(" ").slice(-1)[0];
  const initial = lastName.charAt(0).toUpperCase();

  useEffect(() => {
    if (isInView) {
      router.replace(`#${initial}`, { scroll: false });
      setActiveLetter(initial);
    }
  }, [isInView]);

  return (
    <div className={`contributor-${initial} ${styles.contributor_wrapper}`} key={index} ref={contributorRef}>
      <PersonInfo className={styles.contributor_info} person={contributor} classNameCell={styles.cell} />
      <ArticleLinks contributor={contributor} index={index} />
    </div>
  );
};

export default Contributor;
