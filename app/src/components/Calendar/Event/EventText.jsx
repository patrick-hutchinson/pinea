import styles from "../Calendar.module.css";

import Text from "@/components/Text/Text";

import Link from "next/link";
import { translate } from "@/helpers/translate";
import { StateContext } from "@/context/StateContext";
import { useContext } from "react";

const EventText = ({ event }) => {
  const { isMobile } = useContext(StateContext);
  const rec = event.recommendation;
  const hasRecommendation = rec;
  const hasPinnedText = event.hostedText;
  const hasComment = rec?.comment;

  const displayTitle = translate(event.title);

  // Stable hash — either slug or sanitized fallback
  const slug = displayTitle
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  const pinnedText = isMobile
    ? event.hostedText_mobile ?? event.hostedText
    : event.hostedText ?? event.hostedText_mobile;

  return (
    <>
      {hasRecommendation && rec.voice?.name && (
        <div>
          <span style={{ marginRight: "3px" }} typo="h3">
            {rec.voice.name}:
          </span>

          {/* Conditionally wrap teaser in a link */}
          {hasComment ? (
            <Link href={`stories/recommended/${rec?.voice?.slug?.current}/#${slug}`}>
              <Text text={translate(rec.teaser)} className={styles.pinnedText} typo="h3" />
            </Link>
          ) : (
            <Text text={translate(rec.teaser)} className={styles.pinnedText} typo="h3" />
          )}
        </div>
      )}

      {hasPinnedText && <Text text={translate(pinnedText)} className={styles.pinnedText} typo="h3" />}
    </>
  );
};

export default EventText;
