"use client";

import { useRef } from "react";

import Label from "@/components/Label/Label";

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

  const isMembersOnlyGlyph = membersOnlyLabel === "Ⓜ";

  return (
    <li className={[styles.headline, className].filter(Boolean).join(" ")} ref={containerRef}>
      <AnimationLink path={link} className={styles.headlineLink}>
        <div className={isMembersOnlyLocked ? styles.membersOnlyLockedContent : undefined}>
          <div className={styles.title_container}>
            {label && <Label className={styles.label}>{label}</Label>}
            <div
              typo="h2"
              className={styles.title}
              style={{
                left: 0,
                marginLeft: label ? "var(--margin)" : 0,
              }}
            >
              <Text text={title} />
            </div>
          </div>
          <div typo="h2" className={styles.text}>
            <Text text={text} />
          </div>
        </div>
        {isMembersOnly &&
          (isMembersOnlyGlyph ? (
            <span className={styles.membersOnlyGlyph}>{membersOnlyLabel}</span>
          ) : (
            <Label className={styles.membersOnlyLabel}>{membersOnlyLabel}</Label>
          ))}
      </AnimationLink>
    </li>
  );
};

export default Bulletin;
