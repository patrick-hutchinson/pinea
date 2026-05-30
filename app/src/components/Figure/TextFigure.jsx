import styles from "./Figure.module.css";

import FigureText from "@/components/Figure/FigureText";

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
          {above.title && <FigureText className={styles.title} typo="h3" text={above.title} />}
          {above.subtitle && <FigureText text={above.subtitle} />}
        </figcaption>
      )}

      {content && <FigureText className={styles.content} typo="h3" text={content} style={{ width: "100%" }} />}

      {(below?.title || below?.subtitle) && (
        <figcaption className={styles.figcaption}>
          {below.title && <FigureText className={styles.title} typo="h3" text={below.title} />}
          {below.subtitle && <FigureText text={below.subtitle} />}
        </figcaption>
      )}
    </figure>
  );
};

export default TextFigure;
