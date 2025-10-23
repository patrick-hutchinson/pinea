import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

import Text from "@/components/Text";

import styles from "./Voices.module.css";

const Recommendation = ({ recommendation, setCurrentEvent }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (isInView) setCurrentEvent(recommendation.event);
  }, [isInView]);

  return (
    <li className={styles.comment} ref={ref}>
      <Text text={recommendation.comment ?? recommendation.teaser} />
    </li>
  );
};

export default Recommendation;
