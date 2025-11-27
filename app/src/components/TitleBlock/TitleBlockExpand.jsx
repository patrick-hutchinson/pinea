"use client";

import { useState, useRef, useEffect, useContext } from "react";

import Label from "@/components/Label/Label";
import { calculateTextWidth } from "@/helpers/calculateTextWidth";

import Text from "@/components/Text/Text";
import Icon from "@/components/Icon/Icon";

import styles from "./TitleBlock.module.css";
import { StateContext } from "@/context/StateContext";

const TitleBlockExpand = ({ title, text, runningText, label, className = null, isExpandable, link }) => {
  const { isMobile } = useContext(StateContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const [containerHeight, setContainerHeight] = useState(null);
  const [runningTextHeight, setRunningTextHeight] = useState(null);

  const runningTextRef = useRef(null);
  const containerRef = useRef(null);

  const labelWidth = calculateTextWidth(label, "8px");

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

  if (label && !labelWidth) return undefined;
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
        transition: "0.3s ease 0.2s",
        background: isExpanded ? "var(--foreground)" : "transparent",
        color: isExpanded ? "var(--background)" : "var(--foreground)",
      }}
    >
      <div className={styles.title_container}>
        {label && <Label className={styles.label}>{label}</Label>}
        <h2
          className={styles.title}
          style={{
            textIndent: `${1.3 * labelWidth}px`,
            textIndent: `${1.3 * labelWidth}px`,
            textIndent: 0,
            left: 0,
            marginLeft: label ? "var(--margin)" : 0,
          }}
        >
          <Text text={title} />
        </h2>
        {isExpandable && <Icon path="/icons/dropdown-button.svg" className={styles.icon} />}
      </div>
      <h2 className={styles.text}>
        <Text text={text} />
      </h2>

      <div
        typo="h4"
        className={styles.runningText_container}
        style={{ paddingLeft: isMobile && `${1.3 * labelWidth - 15}px`, paddingTop: isMobile && "50px" }}
        ref={runningTextRef}
      >
        <Text text={runningText} className={styles.runningText} />
        {/* <ul>
          <li>
            <a href={link} target="_blank">
              Link <span style={{ display: "inline-block", position: "relative", top: "0.5px" }}>→</span>
            </a>
          </li>
        </ul> */}
      </div>
    </li>
  );
};

export default TitleBlockExpand;
