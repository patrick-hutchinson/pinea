import Label from "@/components/Label/Label";
import AnimationLink from "@/components/Animation/AnimationLink";
import { useEffect } from "react";
import { onSearch } from "@/helpers/Calendar/onSearch";
import { isEventCurrent } from "@/helpers/Calendar/eventTiming";

import styles from "../Calendar.module.css";

const TagSelection = ({
  events = [],
  onSearch: handleSearch,
  selectedLabels,
  setSelectedLabels,
  showArchiveLink = false,
  showCurrentLink = false,
}) => {
  //   const [selectedLabels, setSelectedLabels] = useState([]); // empty = all active
  const allLabels = showCurrentLink ? ["RECOMMENDED"] : ["RECOMMENDED", "PINNED"];

  //   Update labels
  const handleToggleLabel = (label) => {
    setSelectedLabels((prev) => {
      const nextLabels = prev.includes(label) ? [] : [label];
      const hasVisibleMatches =
        nextLabels.length === 0 ||
        onSearch({ startDate: null, endDate: null }, events, nextLabels).some(
          (event) => !event.highlight?.hosted && isEventCurrent(event, new Date()),
        );

      if (hasVisibleMatches) {
        const el = document.querySelector(`section.${styles.countryCalendar}`);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 30;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      }

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
    handleSearch({ startDate: null, endDate: null });
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
        <Label outline={true} className={styles.label}>
          <AnimationLink path="/calendar-archive" className={styles.archiveLabelLink}>
            ARCHIVE
          </AnimationLink>
        </Label>
      ) : null}
      {showCurrentLink ? (
        <Label outline={true} className={styles.label}>
          <AnimationLink path="/calendar" className={styles.archiveLabelLink}>
            CURRENT
          </AnimationLink>
        </Label>
      ) : null}
    </div>
  );
};

export default TagSelection;
