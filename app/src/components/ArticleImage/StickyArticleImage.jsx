import CalendarExpandMedia from "@/components/ExpandMedia/CalendarExpandMedia";
import Text from "@/components/Text/Text";

import styles from "./ArticleImage.module.css";

import { translate } from "@/helpers/translate";

const StickyArticleImage = ({ item, className }) => {
  return (
    <div className={`${className} ${styles.articleImage}`}>
      <CalendarExpandMedia
        medium={item.medium}
        className={styles.articleImage_inner}
        copyright={<Text text={translate(item.medium.copyrightInternational)} />}
        isActive={true}
      />
    </div>
  );
};

export default StickyArticleImage;
