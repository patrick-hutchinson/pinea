"use client";

import Label from "@/components/Label";
import FormatDate from "@/components/FormatDate";
import Text from "@/components/Text";

import styles from "./OpenCall.module.css";

const OpenCall = ({ title, text, label, openCall, className }) => {
  const resolvedLabel = label ? (
    <span>{label}</span>
  ) : (
    <FormatDate date={openCall?.date} format={{ month: "short", day: "numeric" }} />
  );

  return (
    <li
      style={{ borderTop: "1px solid #000", padding: "var(--margin) 0", paddingBottom: "calc(var(--margin) * 3)" }}
      className={className}
    >
      <div style={{ display: "flex", gap: "var(--margin)" }}>
        <Label className={styles.label}>{resolvedLabel}</Label>
        <h2 style={{ textTransform: "uppercase" }}>{title}</h2>
      </div>
      <h2>
        <Text text={text} />
      </h2>
    </li>
  );
};

export default OpenCall;
