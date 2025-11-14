"use client";

import { useState } from "react";

import Label from "@/components/Label/Label";
import { calculateTextWidth } from "@/helpers/calculateTextWidth";

import Text from "@/components/Text/Text";

import styles from "./HeadlineBlock.module.css";

const HeadlineBlock = ({ title, text, label, className = null }) => {
  const [labelWidth] = useState(calculateTextWidth(text, "8px"));

  if (!labelWidth) return undefined;
  return (
    <li className={`${styles.headline} ${className}`}>
      <div className={styles.title_container}>
        <Label className={styles.label}>{label}</Label>
        <h2
          className={styles.title}
          style={{ textIndent: `${labelWidth + 16 + 10}px`, left: `${-1 * labelWidth - 16 - 10}px` }}
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

export default HeadlineBlock;
