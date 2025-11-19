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
      {hasRecommendation && (
        <div>
          <i style={{ marginRight: "3px" }} typo="h3">
            {rec.voice.name},
          </i>
          <Text text={translate(rec.teaser)} className={styles.pinnedText} typo="h3" />
          {hasComment && (
            <Link href={`stories/people/${rec?.voice?.slug?.current}`}>
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
