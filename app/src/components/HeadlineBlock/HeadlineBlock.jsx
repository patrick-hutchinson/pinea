"use client";

import { useState, useRef, useEffect } from "react";

import Label from "@/components/Label/Label";
import { calculateTextWidth } from "@/helpers/calculateTextWidth";

import Text from "@/components/Text/Text";
import Icon from "@/components/Icon/Icon";

import styles from "./HeadlineBlock.module.css";

const HeadlineBlock = ({ title, text, runningText, label, className = null, isExpandable, link }) => {
  console.log(link, "link");
  const [isExpanded, setIsExpanded] = useState(false);
  const [labelWidth] = useState(calculateTextWidth(text, "8px"));

  const [containerHeight, setContainerHeight] = useState(null);
  const [runningTextHeight, setRunningTextHeight] = useState(null);

  const runningTextRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!runningTextRef.current) return;
    if (!containerRef.current) return;
    setRunningTextHeight(runningTextRef.current.scrollHeight + 8);
    setContainerHeight(containerRef.current.scrollHeight);
  }, [runningText, containerHeight]);

  useEffect(() => {
    function handleResize() {
      if (!runningTextRef.current || !containerRef.current) return;

      setRunningTextHeight(runningTextRef.current.scrollHeight + 8);
      setContainerHeight(containerRef.current.scrollHeight);
    }

    window.addEventListener("resize", handleResize);

    // Run it once on mount
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleExpand = () => {
    if (!isExpandable) return;

    setIsExpanded((prev) => !prev);
  };

  if (!labelWidth) return undefined;
  return (
    <li
      className={`${styles.headline} ${isExpanded && styles.expanded} ${
        isExpandable && styles.isExpandable
      } ${className}`}
      onClick={() => handleExpand()}
      ref={containerRef}
      style={{
        maxHeight: isExpanded ? `${containerHeight}px` : `${containerHeight - runningTextHeight}px`,
        overflow: "hidden",
        transition: "0.3s ease",
        background: isExpanded ? "var(--foreground)" : "transparent",
        color: isExpanded ? "var(--background)" : "var(--foreground)",
      }}
    >
      <div className={styles.title_container}>
        <Label className={styles.label}>{label}</Label>
        <h2
          className={styles.title}
          style={{ textIndent: `${labelWidth + 16}px`, left: `${-1 * labelWidth - 14 - 10}px` }}
        >
          <Text text={title} />
        </h2>
        {isExpandable && <Icon path="/icons/dropdown-button.svg" className={styles.icon} />}
      </div>
      <h2 className={styles.text}>
        <Text text={text} />
      </h2>
      {/* {isExpandable && (
        <div className={styles.readMore} typo="h4" onClick={() => setIsExpanded((prev) => !prev)}>
          Read More
        </div>
      )} */}

      <div typo="h4" className={styles.runningText_container} ref={runningTextRef}>
        <Text text={runningText} className={styles.runningText} />
        <ul>
          <li>
            <a href={link} target="_blank">
              Link
            </a>
          </li>
        </ul>
      </div>
    </li>
  );
};

export default HeadlineBlock;
