import styles from "../Calendar.module.css";

import Text from "@/components/Text";

import Link from "next/link";

const EventText = ({ event }) => {
  const rec = event.recommendations;
  const hasRecommendation = rec?.comment;
  const hasPinnedText = event.pinnedText;

  return (
    <>
      {hasRecommendation && (
        <div>
          <i style={{ marginRight: "3px" }} typo="h3">
            {rec.voice.name},
          </i>
          <Text text={rec.teaser} className={styles.pinnedText} typo="h3" />
          <Link href={`/voices/${rec.slug}`}>
            <span typo="h3">Read More</span>
          </Link>
        </div>
      )}

      {hasPinnedText && <Text text={event.pinnedText} className={styles.pinnedText} typo="h3" />}
    </>
  );
};

export default EventText;
