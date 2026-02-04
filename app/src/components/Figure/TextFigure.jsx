import styles from "./Figure.module.css";

import Text from "@/components/Text/Text";

const TextFigure = ({ above, content, below }) => {
  return (
    <figure
      className={`${styles.textFigure}`}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "0 calc(100% / 12)",
        width: "100%",
        alignItems: "center",
      }}
    >
      {(above?.title || above?.subtitle) && (
        <figcaption style={{ position: "absolute", top: "var(--margin)", textAlign: "center" }}>
          {above.title && <Text className={styles.title} typo="h3" text={above.title} />}
          {above.subtitle && <Text text={above.subtitle} />}
        </figcaption>
      )}

      {content && <Text className={styles.content} typo="h3" text={content} />}

      {(below?.title || below?.subtitle) && (
        <figcaption className={styles.figcaption}>
          {below.title && <Text className={styles.title} typo="h3" text={below.title} />}
          {below.subtitle && <Text text={below.subtitle} />}
        </figcaption>
      )}
    </figure>
  );
};

export default TextFigure;
