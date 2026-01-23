"use client";

import { useState, useRef, useEffect, useContext } from "react";

import Label from "@/components/Label/Label";
import { calculateTextWidth } from "@/helpers/calculateTextWidth";

import Text from "@/components/Text/Text";

import { motion } from "framer-motion";
import Icon from "@/components/Icon/Icon";

import styles from "./Bulletin.module.css";
import { StateContext } from "@/context/StateContext";

import { handleShare } from "@/helpers/shareEvent";

const BulletinExpandable = ({ bulletin, title, text, runningText, label, className, id }) => {
  const { isMobile } = useContext(StateContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const bulletinRef = useRef(null);
  const [runningTextHeight, setRunningTextHeight] = useState(null);

  const labelWidth = calculateTextWidth(label, "8px");

  const runningTextRef = useRef(null);

  useEffect(() => {
    if (!runningTextRef.current) return;

    setRunningTextHeight(runningTextRef.current.scrollHeight + 8);
  }, [runningText]);

  useEffect(() => {
    function handleResize() {
      if (!runningTextRef.current) return;

      setRunningTextHeight(runningTextRef.current.scrollHeight + 8);
    }

    window.addEventListener("resize", handleResize);

    // Run it once on mount
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    const bulletinId = bulletinRef.current.getAttribute("id");

    if (id === bulletinId) setIsExpanded(true);
  }, []);

  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  if (label && !labelWidth) return undefined;

  const variants = {
    open: {
      maxHeight: runningTextHeight + 50,
      opacity: 1,
      paddingTop: 50,
      transition: {
        maxHeight: { duration: 0.4 },
        opacity: { duration: 0.4, delay: 0.4 },
      },
    },
    closed: {
      opacity: 0,
      maxHeight: 0,
      paddingTop: 0,
      transition: {
        opacity: { duration: 0.4 },
        maxHeight: { duration: 0.4, delay: 0.4 },
      },
    },
  };

  return (
    <li
      ref={bulletinRef}
      id={id}
      className={`${styles.headline} ${isExpanded && styles.expanded} ${styles.isExpandable} ${className}`}
      onClick={() => handleExpand()}
      style={{
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
        <div className={styles.buttons}>
          <span className={styles.icon}>
            <Icon
              path="icons/share.svg"
              onClick={(e) => {
                e.stopPropagation(); // 👈 prevent parent clicks
                handleShare(bulletin.slug.current);
              }}
            />
          </span>
          <Icon path="/icons/dropdown-button.svg" className={`${styles.icon} ${styles.expandIcon}`} />
        </div>
      </div>
      <h2 className={styles.text}>
        <Text text={text} />
      </h2>

      <motion.div
        typo="h4"
        className={styles.runningText_container}
        style={{
          paddingLeft: !isMobile ? `${1.3 * labelWidth}px` : `${1.3 * labelWidth - 15}px`,
        }}
        initial="closed"
        animate={isExpanded ? "open" : "closed"}
        variants={variants}
      >
        <Text ref={runningTextRef} text={runningText} className={styles.runningText} />
      </motion.div>
    </li>
  );
};

export default BulletinExpandable;
