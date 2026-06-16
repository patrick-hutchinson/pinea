"use client";

import { useMemo, useState } from "react";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import Event from "@/components/Calendar/Event";
import { Head } from "@/components/Calendar/Head";

import styles from "@/components/Calendar/Calendar.module.css";

const HOSTED_TYPE_LABELS = {
  onTour: "On Tour",
  talk: "Talk",
  fair: "Fair",
  launch: "Launch",
};

const HOSTED_TYPE_ORDER = ["onTour", "talk", "fair", "launch"];

const getHostedTypeLabel = (hostedType) => {
  if (!hostedType) return "";
  if (HOSTED_TYPE_LABELS[hostedType]) return HOSTED_TYPE_LABELS[hostedType];
  return hostedType.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (char) => char.toUpperCase());
};

const PineaEvents = ({ events }) => {
  const [activeHostedTypes, setActiveHostedTypes] = useState([]);
  const now = new Date();

  const isUpcoming = (event) => {
    const end = event.endDate ? new Date(event.endDate) : event.startDate ? new Date(event.startDate) : null;

    return end ? end >= now : true;
  };

  const hosted = useMemo(
    () => events.filter((event) => event.highlight?.hosted && !isUpcoming(event)),
    [events],
  );

  const filterLabels = useMemo(() => {
    const existingTypes = new Set(hosted.map((event) => event.hostedType).filter(Boolean));
    const orderedLabels = HOSTED_TYPE_ORDER.filter((type) => existingTypes.has(type)).map(getHostedTypeLabel);
    const extraLabels = [...existingTypes]
      .filter((type) => !HOSTED_TYPE_ORDER.includes(type))
      .map(getHostedTypeLabel)
      .sort((a, b) => a.localeCompare(b));

    return [...orderedLabels, ...extraLabels];
  }, [hosted]);

  const filteredHosted = useMemo(() => {
    if (activeHostedTypes.length === 0) return hosted;

    return hosted.filter((event) => activeHostedTypes.includes(getHostedTypeLabel(event.hostedType)));
  }, [activeHostedTypes, hosted]);

  const handleFilter = (filter) => {
    setActiveHostedTypes((prev) => {
      if (prev.includes(filter)) return prev.filter((item) => item !== filter);
      return [...prev, filter];
    });
  };

  return (
    <main className={styles.main} typo="h4">
      <FilterHeader
        array={filterLabels}
        handleFilter={handleFilter}
        currentlyActive={activeHostedTypes}
        className={styles.filter_header}
      />

      <Head />

      <section className={styles.calendar}>
        <div className={styles.calendar}>
          <ul>
            {filteredHosted.map((event, index, array) => (
              <Event key={index} event={event} index={index} array={array} />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default PineaEvents;
