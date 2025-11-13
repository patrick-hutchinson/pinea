import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";

import { translate } from "@/helpers/translate";

const LandscapeFigure = ({ title, description, medium, className }) => {
  return (
    <div className={`${className}`}>
      {/* <h3>{translate(title)}</h3> */}
      {/* <Text text={description} /> */}
      <Media medium={medium} />
    </div>
  );
};

export default LandscapeFigure;
