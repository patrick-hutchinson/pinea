import { useRef, useEffect, useState, useContext } from "react";

import { StateContext } from "@/context/StateContext";
import { SearchContext } from "@/context/SearchContext";
import { AnimatePresence, motion } from "framer-motion";
import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "./FilterHeader.module.css";

const FilterHeader = ({
  array,
  handleFilter,
  currentlyActive,
  className,
  scrollToTarget,
  notAllowed,
  activeScrollBehavior = "smooth",
}) => {
  const { isMobile } = useContext(StateContext);
  const { searchQuery } = useContext(SearchContext);

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

    const containerRect = container.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    // Skip work if the active item is already fully visible in the horizontal viewport.
    if (itemRect.left >= containerRect.left && itemRect.right <= containerRect.right) return;

    const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
    const centeredScrollLeft = activeItem.offsetLeft - (container.clientWidth - activeItem.offsetWidth) / 2;
    const targetScrollLeft = Math.max(0, Math.min(centeredScrollLeft, maxScrollLeft));

    if (Math.abs(container.scrollLeft - targetScrollLeft) < 1) return;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: activeScrollBehavior,
    });
  }, [currentlyActive, activeScrollBehavior]);

  // Check if content overflows
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setOverflowing(container.scrollWidth > container.clientWidth);
    }
  }, [array]);

  return (
    <AnimatePresence>
      {searchQuery.length <= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={styles.wrapper}
        >
          <ul
            ref={containerRef}
            style={{
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflowX: "auto",
              display: "flex",
              justifyContent: overflowing ? "flex-start" : "center",
            }}
            className={`${className} filterHeader ${styles.filter_header}`}
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
                  {href && scrollToTarget ? (
                    <a
                      href={href}
                      className={styles.link}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToTarget(href, label);
                      }}
                    >
                      {label}
                    </a>
                  ) : href ? (
                    <AnimationLink path={href} className={styles.link}>
                      {label}
                    </AnimationLink>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterHeader;
