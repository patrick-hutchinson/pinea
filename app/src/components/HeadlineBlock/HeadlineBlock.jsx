"use client";

import Label from "@/components/Label";

import Text from "@/components/Text/Text";

import styles from "./HeadlineBlock.module.css";

const HeadlineBlock = ({ title, text, label, className, color }) => {
  return (
    <li
      style={{ borderTop: "1px solid #000", padding: "var(--margin) 0", paddingBottom: "calc(var(--margin) * 3)" }}
      className={className}
    >
      <div style={{ display: "flex", gap: "var(--margin)" }}>
        <Label className={styles.label}>{label}</Label>
        <h2 style={{ textTransform: "uppercase", color: color }}>{title}</h2>
      </div>
      <h2 style={{ color: color }}>
        <Text text={text} />
      </h2>
    </li>
  );
};

export default HeadlineBlock;
