import Label from "@/components/Label/Label";
import AnimationLink from "@/components/Animation/AnimationLink";
import { useEffect } from "react";

import styles from "../Calendar.module.css";

const TagSelection = ({
  onSearch,
  selectedLabels,
  setSelectedLabels,
  showArchiveLink = false,
  showCurrentLink = false,
}) => {
  //   const [selectedLabels, setSelectedLabels] = useState([]); // empty = all active
  const allLabels = showCurrentLink ? ["RECOMMENDED"] : ["RECOMMENDED", "PINNED"];

  //   Update labels
  const handleToggleLabel = (label) => {
    const el = document.querySelector(`section.${styles.countryCalendar}`);
    const top = el.getBoundingClientRect().top + window.scrollY - 30;
    window.scrollTo({ top: top, behavior: "smooth" });

    setSelectedLabels((prev) => {
      if (prev.includes(label)) {
        // Clicking already selected label → deselect it
        return [];
      } else {
        // Clicking a new label → select it and deselect the other
        return [label];
      }
    });
  };

  // Run onSearch **whenever selectedLabels changes**
  useEffect(() => {
    onSearch({ startDate: null, endDate: null });
  }, [selectedLabels]);

  return (
    <div
      className={styles.tag_selection}
      style={{ position: "absolute", bottom: 10, display: "flex", alignItems: "center", gap: 4 }}
    >
      {allLabels.map((label) => {
        const isActive = selectedLabels.includes(label);
        return (
          <Label
            key={label}
            outline={true}
            className={`${styles.label} ${isActive ? styles.selected : ""}`}
            onClick={() => handleToggleLabel(label)}
          >
            {label}
          </Label>
        );
      })}
      {showArchiveLink ? (
        <AnimationLink path="/calendar-archive" className={styles.archiveLabelLink}>
          <Label outline={true} className={styles.label}>
            ARCHIVE
          </Label>
        </AnimationLink>
      ) : null}
      {showCurrentLink ? (
        <AnimationLink path="/calendar" className={styles.archiveLabelLink}>
          <Label outline={true} className={styles.label}>
            CURRENT
          </Label>
        </AnimationLink>
      ) : null}
    </div>
  );
};

export default TagSelection;
