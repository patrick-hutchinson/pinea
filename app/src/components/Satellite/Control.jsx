import styles from "./Satellite.module.css";

const Control = ({
  mediaCount,
  currentMedia,
  setCurrentMedia,
  setIsSettling,
  setActiveElement,
  activeElement,
  normalizeIndex,
}) => {
  const handleClick = (index) => {
    setIsSettling(true);
    setActiveElement(index); // <-- NEW
    setCurrentMedia((prev) => {
      const roundedPrev = Math.round(prev);
      const diff = index - normalizeIndex(roundedPrev, mediaCount);

      // adjust for shortest direction
      const shortest = diff > mediaCount / 2 ? diff - mediaCount : diff < -mediaCount / 2 ? diff + mediaCount : diff;

      return prev + shortest;
    });
  };

  return (
    <ul className={styles.controls}>
      {Array.from({ length: mediaCount }).map((_, index) => (
        <li
          key={index}
          className={`${styles.marker} ${index === activeElement ? styles.current : ""}`}
          onClick={() => handleClick(index)}
        />
      ))}
    </ul>
  );
};

export default Control;
