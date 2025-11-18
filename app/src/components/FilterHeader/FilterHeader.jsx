import { useRef, useEffect, useState } from "react";
import styles from "./FilterHeader.module.css";

const FilterHeader = ({ array, handleFilter, currentlyActive, className, scrollToTarget, notAllowed }) => {
  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const [overflowing, setOverflowing] = useState(false);

  // Check if content overflows
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setOverflowing(container.scrollWidth > container.clientWidth);
    }
  }, [array]);

  // Scroll active item into view
  useEffect(() => {
    if (!scrollToTarget) return;

    if (currentlyActive && itemRefs.current[currentlyActive]) {
      itemRefs.current[currentlyActive].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentlyActive]);

  return (
    <ul
      ref={containerRef}
      style={{
        maxWidth: "100%",
        whiteSpace: "nowrap",
        overflowX: "auto",
        display: "flex",
        justifyContent: overflowing ? "flex-start" : "center",
      }}
      className={`${className} ${styles.filter_header}`}
      typo="h3"
    >
      {array.map((item, index) => {
        const isActive = Array.isArray(currentlyActive)
          ? currentlyActive.includes(item) // check if the item is in the array
          : currentlyActive === item; // fallback for single value
        return (
          <li
            key={index}
            ref={(el) => (itemRefs.current[item] = el)}
            className={`${isActive ? styles.active : ""} ${notAllowed}`}
          >
            <span onClick={() => handleFilter(item)}>{item}</span>
            <span>{index < array.length - 1 && ", "}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default FilterHeader;
