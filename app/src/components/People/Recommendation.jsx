import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

import { useRouter } from "next/navigation";

import Quote from "@/components/Quote/Quote";

import styles from "./People.module.css";

import { translate } from "@/helpers/translate";

const Recommendation = ({ recommendation, setCurrentEvent }) => {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  // Localized display title
  const displayTitle = translate(recommendation.event.title);

  // Stable hash — either slug or sanitized fallback
  const slug =
    recommendation.event.slug?.current ??
    displayTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  useEffect(() => {
    if (isInView) {
      setCurrentEvent(recommendation.event);

      // Update the URL hash without scrolling or reload
      router.replace(`#${slug}`, { scroll: false });
    }
  }, [isInView]);

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
