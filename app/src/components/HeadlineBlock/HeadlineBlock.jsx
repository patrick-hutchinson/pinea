"use client";

import { useState, useRef, useEffect } from "react";

import Label from "@/components/Label/Label";
import { calculateTextWidth } from "@/helpers/calculateTextWidth";

import Text from "@/components/Text/Text";

import styles from "./HeadlineBlock.module.css";

const HeadlineBlock = ({ title, text, runningText, label, className = null, isExpandable }) => {
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
    console.log(runningTextHeight);
    console.log(containerHeight, "containerHeight");
  }, [runningTextHeight, containerHeight]);

  if (!labelWidth) return undefined;
  return (
    <li
      className={`${styles.headline} ${className}`}
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
          style={{ textIndent: `${labelWidth + 16 + 12}px`, left: `${-1 * labelWidth - 16 - 10}px` }}
        >
          <Text text={title} />
        </h2>
      </div>
      <h2 className={styles.text}>
        <Text text={text} />
      </h2>
      {isExpandable && (
        <div className={styles.readMore} typo="h4" onClick={() => setIsExpanded((prev) => !prev)}>
          Read More
        </div>
      )}

      <div typo="h4" ref={runningTextRef} style={{ maxWidth: "550px" }}>
        <Text text={runningText} />
      </div>
    </li>
  );
};

export default HeadlineBlock;
