import { useRef, useContext, useEffect } from "react";
import { useInView } from "framer-motion";

import { useRouter } from "next/navigation";
import PersonInfoBody from "@/components/People/PersonInfoBody";
import PersonInfo from "@/components/People/PersonInfo";
import ArticleLinks from "./ArticleLinks";

import styles from "./ContributorsPage.module.css";
import { GlobalVariablesContext } from "@/context/GlobalVariablesContext";
import { StateContext } from "@/context/StateContext";

const Contributor = ({ contributor, index }) => {
  const router = useRouter();
  const { header_height, filter_height } = useContext(GlobalVariablesContext);
  const { deviceDimensions } = useContext(StateContext);
  const contributorRef = useRef(null);

  const isInView = useInView(contributorRef, {
    margin: `${header_height + filter_height}px 0px ${
      -1 * (deviceDimensions.height - (header_height + filter_height + 50))
    }px 0px`,
  });

  useEffect(() => {
    if (isInView) {
      router.replace(`#${contributor.name}`, { scroll: false });
      //   setCurrentlyInView(contributor);
    }
  }, [isInView]);

  const InfoComponent = index === 0 ? PersonInfoBody : PersonInfo;
  return (
    <div className={styles.contributor_wrapper} key={index} ref={contributorRef}>
      <InfoComponent className={styles.contributor_info} person={contributor} classNameCell={styles.cell} />
      <ArticleLinks contributor={contributor} index={index} />
    </div>
  );
};

export default Contributor;
