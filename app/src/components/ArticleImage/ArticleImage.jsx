import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";
import Text from "@/components/Text/Text";

import styles from "./ArticleImage.module.css";

import { translate } from "@/helpers/translate";

const ArticleImage = ({ item, className }) => {
  const medium = item?.medium;
  if (!medium) return null;

  return (
    <div className={`${className} ${styles.articleImage} articleImage`}>
      <ExpandMedia
        medium={medium}
        className={styles.articleImage_inner}
        copyright={<Text text={translate(medium?.copyrightInternational)} typo="h5" />}
        isActive={true}
      />
    </div>
  );
};

export default ArticleImage;
