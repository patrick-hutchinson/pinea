import styles from "../Calendar.module.css";

import Text from "@/components/Text/Text";

import Link from "next/link";
import { translate } from "@/helpers/translate";

const EventText = ({ event }) => {
  const rec = event.recommendation;
  const hasRecommendation = rec;
  const hasPinnedText = event.hostedText;
  const hasComment = rec?.comment;

  return (
    <>
      {hasRecommendation && rec.voice?.name && (
        <div>
          <span style={{ marginRight: "3px" }} typo="h3">
            {rec.voice.name}:
          </span>

          {/* Conditionally wrap teaser in a link */}
          {hasComment ? (
            <Link href={`stories/people/${rec?.voice?.slug?.current}`}>
              <Text text={translate(rec.teaser)} className={styles.pinnedText} typo="h3" />
            </Link>
          ) : (
            <Text text={translate(rec.teaser)} className={styles.pinnedText} typo="h3" />
          )}
        </div>
      )}

      {hasPinnedText && <Text text={translate(event.hostedText)} className={styles.pinnedText} typo="h3" />}
    </>
  );
};

export default EventText;
