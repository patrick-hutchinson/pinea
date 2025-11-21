import Text from "@/components/Text/Text";

import styles from "./Footnotes.module.css";

const Footnotes = ({ text, className }) => {
  if (!text) return null;

  const circledNumbers = {
    0: "⓿",
    1: "❶",
    2: "❷",
    3: "❸",
    4: "❹",
    5: "❺",
    6: "❻",
    7: "❼",
    8: "❽",
    9: "❾",
  };

  // Collect all markDefs of type "footnote" from all blocks
  const footnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  if (footnotes.length === 0) return null;

  return (
    <ol className={`${className} ${styles.footnotes}`} typo="footnote">
      {footnotes.map((fn, index) => {
        const number = index + 1;

        const scrollBack = () => {
          const ref = document.getElementById(`ref-${number}`);
          if (ref) {
            ref.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        };

        return (
          <li
            key={fn._key}
            className={styles.footnote}
            id={`footnote-${number}`}
            onClick={scrollBack}
            style={{ cursor: "pointer" }}
          >
            <sup>{circledNumbers[number]}</sup>

            <Text className={styles.footnote_text} text={fn.text} />
          </li>
        );
      })}
    </ol>
  );
};

export default Footnotes;
