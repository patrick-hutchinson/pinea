import Text from "@/components/Text/Text";

import styles from "./Footnotes.module.css";

const Footnotes = ({ text, className }) => {
  if (!text) return null;

  // Collect all markDefs of type "footnote" from all blocks
  const footnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  if (footnotes.length === 0) return null;

  return (
    <ol className={`${className} ${styles.footnotes}`} typo="h5">
      {footnotes.map((fn, index) => (
        <li key={fn._key} className={styles.footnote} id={`footnote-${index + 1}`}>
          <sup>{index + 1}</sup> <Text className={styles.footnote_text} text={fn.text} />
        </li>
      ))}
    </ol>
  );
};

export default Footnotes;
