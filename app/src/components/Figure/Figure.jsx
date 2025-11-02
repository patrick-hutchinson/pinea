import Media from "@/components/Media/Media";
import Text from "@/components/Text/Text";

import styles from "./Figure.module.css";
import { translate } from "@/helpers/translate";

export const ShowcaseFigure = ({ children }) => {
  return <figure className={`${styles.figure} ${styles.showcase}`}>{children}</figure>;
};

export const FullscreenFigure = ({ children }) => {
  return <figure className={`${styles.figure} ${styles.fullscreen}`}>{children}</figure>;
};

export const FigCaption = ({ children }) => {
  return <figcaption className={styles.figcaption}>{children}</figcaption>;
};

export const MediaContainer = ({ children }) => {
  return <div className={styles.media_container}>{children}</div>;
};
