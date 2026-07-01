"use client";

import { useRef } from "react";

import Label from "@/components/Label/Label";
import { calculateTextWidth } from "@/helpers/calculateTextWidth";

import Text from "@/components/Text/Text";

import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "./Bulletin.module.css";

const Bulletin = ({
  title,
  text,
  label,
  className,
  link,
  isMembersOnly = false,
  isMembersOnlyLocked = false,
  membersOnlyLabel = "Members Only",
}) => {
  const containerRef = useRef(null);

  const labelWidth = calculateTextWidth(label, "8px");
  const isMembersOnlyGlyph = membersOnlyLabel === "Ⓜ";

  if (label && !labelWidth) return undefined;
  return (
    <AnimationLink path={link}>
      <li className={`${styles.headline}  ${className}`} ref={containerRef}>
        <div className={isMembersOnlyLocked ? styles.membersOnlyLockedContent : undefined}>
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
        </div>
        {isMembersOnly &&
          (isMembersOnlyGlyph ? (
            <span className={styles.membersOnlyGlyph}>{membersOnlyLabel}</span>
          ) : (
            <Label className={styles.membersOnlyLabel}>{membersOnlyLabel}</Label>
          ))}
      </li>
    </AnimationLink>
  );
};

export default Bulletin;
