import { useRef, useEffect, useState, useContext } from "react";
import styles from "./FilterHeader.module.css";

import { StateContext } from "@/context/StateContext";

const FilterHeader = ({ array, handleFilter, currentlyActive, className, scrollToTarget, notAllowed }) => {
  const { isMobile } = useContext(StateContext);
  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const [overflowing, setOverflowing] = useState(false);

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateFade = () => {
      setShowLeftFade(el.scrollLeft > 0);
      setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    updateFade(); // run initially
    el.addEventListener("scroll", updateFade);
    window.addEventListener("resize", updateFade);

    return () => {
      el.removeEventListener("scroll", updateFade);
      window.removeEventListener("resize", updateFade);
    };
  }, [array]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!currentlyActive) return;

    const activeItem = itemRefs.current[currentlyActive];
    if (!activeItem) return;

    activeItem.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [currentlyActive]);

  // Check if content overflows
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setOverflowing(container.scrollWidth > container.clientWidth);
    }
  }, [array]);

  return (
    <div className={styles.wrapper}>
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
          const label = typeof item === "string" ? item : item.label;
          const href = typeof item === "string" ? null : item.href;

          const isActive = Array.isArray(currentlyActive) ? currentlyActive.includes(label) : currentlyActive === label;

          return (
            <li
              key={index}
              ref={(el) => (itemRefs.current[label] = el)}
              className={`${isActive ? styles.active : ""} ${notAllowed}`}
            >
              {href ? (
                <a href={href} className={styles.link}>
                  {label}
                </a>
              ) : (
                <span onClick={() => handleFilter(label)}>{label}</span>
              )}

              <span>{index < array.length - 1 && ", "}</span>
            </li>
          );
        })}
      </ul>

      {/* Left fade */}
      {showLeftFade && <div className={styles.fade_left} />}

      {/* Right fade */}
      {showRightFade && <div className={styles.fade_right} />}
    </div>
  );
};

export default FilterHeader;
