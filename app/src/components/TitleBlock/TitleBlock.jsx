"use client";

import { useRef } from "react";

import Label from "@/components/Label/Label";
import { calculateTextWidth } from "@/helpers/calculateTextWidth";

import Text from "@/components/Text/Text";

import Link from "next/link";

import styles from "./TitleBlock.module.css";

const TitleBlock = ({ title, text, label, className, link }) => {
  const containerRef = useRef(null);

  const labelWidth = calculateTextWidth(label, "8px");

  if (label && !labelWidth) return undefined;
  return (
    <li className={`${styles.headline}  ${className}`} ref={containerRef}>
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
      </div>
      <h2 className={styles.text}>
        <Text text={text} />
      </h2>
    </li>
  );
};

export default TitleBlock;
