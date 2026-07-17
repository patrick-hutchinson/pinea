import { useRef, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import { StateContext } from "@/context/StateContext";
import { SearchContext } from "@/context/SearchContext";
import { AnimatePresence, motion } from "framer-motion";
import AnimationLink from "@/components/Animation/AnimationLink";
import { isPineaIssueTitle } from "@/helpers/isPineaIssueTitle";

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
  const router = useRouter();

  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const dragStateRef = useRef({
    active: false,
    dragged: false,
    pointerId: null,
    startX: 0,
    scrollLeft: 0,
  });
  const [overflowing, setOverflowing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const hideDivider = ["/calendar", "/contributors", "/archive"].includes(router.pathname);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateOverflowState = () => {
      const nextOverflowing = el.scrollWidth > el.clientWidth + 1;

      setOverflowing(nextOverflowing);

      if (!nextOverflowing && el.scrollLeft !== 0) {
        el.scrollLeft = 0;
      }

      setShowLeftFade(el.scrollLeft > 0);
      setShowRightFade(nextOverflowing && el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    updateOverflowState();
    el.addEventListener("scroll", updateOverflowState);
    window.addEventListener("resize", updateOverflowState);

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => updateOverflowState()) : null;
    resizeObserver?.observe(el);

    return () => {
      el.removeEventListener("scroll", updateOverflowState);
      window.removeEventListener("resize", updateOverflowState);
      resizeObserver?.disconnect();
    };
  }, [array]);

  const endDrag = () => {
    const container = containerRef.current;
    const dragState = dragStateRef.current;

    if (container && dragState.pointerId != null && container.hasPointerCapture?.(dragState.pointerId)) {
      container.releasePointerCapture(dragState.pointerId);
    }

    dragState.active = false;
    dragState.pointerId = null;
    setIsDragging(false);
  };

  const handlePointerDown = (event) => {
    const container = containerRef.current;
    if (!container || container.scrollWidth <= container.clientWidth) return;

    if (event.button != null && event.button !== 0) return;

    dragStateRef.current = {
      active: true,
      dragged: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: container.scrollLeft,
    };
  };

  const handlePointerMove = (event) => {
    const container = containerRef.current;
    const dragState = dragStateRef.current;
    if (!container || !dragState.active) return;

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 3) {
      dragState.dragged = true;
      setIsDragging(true);
    }

    if (!dragState.dragged) return;

    event.preventDefault();
    container.scrollLeft = dragState.scrollLeft - deltaX;
  };

  const handleClickCapture = (event) => {
    if (!dragStateRef.current.dragged) return;

    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current.dragged = false;
  };

  useEffect(() => {
    const handleWindowPointerMove = (event) => handlePointerMove(event);
    const handleWindowPointerUp = () => endDrag();

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
    };
  }, []);

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

  return (
    <AnimatePresence>
      {searchQuery.length <= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`${styles.wrapper} ${hideDivider ? styles.noDivider : ""}`}
        >
          <ul
            ref={containerRef}
            onPointerDownCapture={handlePointerDown}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            onClickCapture={handleClickCapture}
            onDragStart={(event) => event.preventDefault()}
            style={{
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflowX: "auto",
              display: "flex",
              justifyContent: overflowing ? "flex-start" : "center",
            }}
            className={`${className} filterHeader ${styles.filter_header} ${isDragging ? styles.dragging : ""}`}
            typo="h3"
          >
            {array.map((item, index) => {
              const label = typeof item === "string" ? item : item.label;
              const href = typeof item === "string" ? null : item.href;

              const isActive = Array.isArray(currentlyActive) ? currentlyActive.includes(label) : currentlyActive === label;
              const labelClassName = isPineaIssueTitle(label) ? "pineaIssueTitle" : "";

              return (
                <li
                  key={index}
                  ref={(el) => (itemRefs.current[label] = el)}
                  className={`${isActive ? styles.active : ""} ${notAllowed}`}
                >
                  {href && scrollToTarget ? (
                    <a
                      href={href}
                      className={`${styles.link} ${labelClassName}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToTarget(href, label);
                      }}
                    >
                      {label}
                    </a>
                  ) : href ? (
                    <AnimationLink path={href} className={`${styles.link} ${labelClassName}`}>
                      {label}
                    </AnimationLink>
                  ) : (
                    <span className={labelClassName} onClick={() => handleFilter(label)}>
                      {label}
                    </span>
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
