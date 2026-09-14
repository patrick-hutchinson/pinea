import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

import Quote from "@/components/Quote/Quote";

import styles from "./People.module.css";

import { translate } from "@/helpers/translate";

const Recommendation = ({ recommendation, setCurrentEvent }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });
  const event = recommendation?.event;

  // Localized display title
  const displayTitle = translate(event?.title) || "";

  // Stable hash — either slug or sanitized fallback
  const fallbackSlug = displayTitle
    ? displayTitle
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
    : recommendation?._id || "recommendation";
  const slug = event?.slug?.current || fallbackSlug;

  useEffect(() => {
    if (isInView && event) {
      setCurrentEvent(event);

      // Update the URL hash without scrolling or reload
      // router.replace(`#${slug}`, { scroll: false });
    }
  }, [event, isInView, setCurrentEvent]);

  const text = recommendation.comment ?? recommendation.teaser;

  return (
    <li id={slug} className={styles.comment} ref={ref}>
      <div>
        <Quote text={translate(text)} />
      </div>
    </li>
  );
};

export default Recommendation;
