import styles from "../Calendar.module.css";

import Text from "@/components/Text";

import Link from "next/link";

const EventText = ({ event }) => {
  const rec = event.recommendation;
  const hasRecommendation = rec;
  const hasPinnedText = event.hostedText;
  const hasComment = rec?.comment;

  console.log(rec?.voice?.slug.current, "rec");

  return (
    <>
      {hasRecommendation && (
        <div>
          <i style={{ marginRight: "3px" }} typo="h3">
            {rec.voice.name},
          </i>
          <Text text={rec.teaser} className={styles.pinnedText} typo="h3" />
          {hasComment && (
            <Link href={`/voices/${rec?.voice?.slug?.current}`}>
              <span typo="h3">(...)</span>
            </Link>
          )}
        </div>
      )}

      {hasPinnedText && <Text text={event.hostedText} className={styles.pinnedText} typo="h3" />}
    </>
  );
};

export default EventText;
