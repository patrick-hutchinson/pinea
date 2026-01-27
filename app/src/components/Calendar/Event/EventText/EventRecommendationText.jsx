import styles from "../../Calendar.module.css";

import Text from "@/components/Text/Text";

import Link from "next/link";
import { translate } from "@/helpers/translate";

import { convertToPlainText } from "@/helpers/convertToPlainText";
import { convertToSlug } from "@/helpers/convertToSlug";

const EventRecommendationText = ({ event }) => {
  const rec = event.recommendation;
  const hasComment = rec?.comment;

  const displayTitle = translate(event.title);

  const slug = convertToSlug(displayTitle);

  return (
    <div>
      <span style={{ marginRight: "3px" }} typo="h3">
        {rec.voice.name}:
      </span>

      {/* Conditionally wrap teaser in a link */}
      {hasComment ? (
        <Link href={`stories/recommended/${rec?.voice?.slug?.current}/#${slug}`}>
          <span typo="h3">{convertToPlainText(translate(rec.teaser))}</span>
        </Link>
      ) : (
        <Text text={translate(rec.teaser)} className={styles.pinnedText} typo="h3" />
      )}
    </div>
  );
};

export default EventRecommendationText;
