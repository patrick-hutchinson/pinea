import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

const QuarterFigure = ({ title, description, medium, className, storyType }) => {
  return (
    <div className={`${className}`}>
      {/* <h3>{translate(title)}</h3> */}
      {/* <Text text={description} /> */}
      <Media medium={medium} />
      <p className={styles.type} typo="h4">
        {storyType}
      </p>
    </div>
  );
};

export default QuarterFigure;
