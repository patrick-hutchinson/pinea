"use client";

import { useContext, useMemo, useState } from "react";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import Event from "@/components/Calendar/Event";
import { Head } from "@/components/Calendar/Head";
import { LanguageContext } from "@/context/LanguageContext";

import styles from "@/components/Calendar/Calendar.module.css";
import filterStyles from "@/components/Calendar/CalendarFilter/CalendarFilter.module.css";

const HOSTED_TYPE_LABELS = {
  onTour: "On Tour",
  talk: "Talk",
  fair: "Fair",
  launch: "Launch",
};

const HOSTED_TYPE_ORDER = ["onTour", "talk", "fair", "launch"];
const PINNED_FILTER_LABEL = "Pinned";

const getHostedTypeLabel = (hostedType) => {
  if (!hostedType) return "";
  if (HOSTED_TYPE_LABELS[hostedType]) return HOSTED_TYPE_LABELS[hostedType];
  return hostedType.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (char) => char.toUpperCase());
};

const getEventDate = (event) => {
  const date = event.endDate || event.startDate;
  const parsedDate = date ? new Date(date) : null;
  return parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;
};

const PineaEvents = ({ events }) => {
  const { language } = useContext(LanguageContext);
  const [activeHostedTypes, setActiveHostedTypes] = useState([]);
  const now = new Date();

  const isUpcoming = (event) => {
    const end = event.endDate ? new Date(event.endDate) : event.startDate ? new Date(event.startDate) : null;

    return end ? end >= now : true;
  };

  const pastPineaEvents = useMemo(
    () => events.filter((event) => (event.highlight?.hosted || event.highlight?.pinned) && !isUpcoming(event)),
    [events],
  );

  const filterLabels = useMemo(() => {
    const existingTypes = new Set(pastPineaEvents.map((event) => event.hostedType).filter(Boolean));
    const orderedLabels = HOSTED_TYPE_ORDER.filter((type) => existingTypes.has(type)).map(getHostedTypeLabel);
    const extraLabels = [...existingTypes]
      .filter((type) => !HOSTED_TYPE_ORDER.includes(type))
      .map(getHostedTypeLabel)
      .sort((a, b) => a.localeCompare(b));
    const pinnedLabels = pastPineaEvents.some((event) => event.highlight?.pinned) ? [PINNED_FILTER_LABEL] : [];

    return [...orderedLabels, ...extraLabels, ...pinnedLabels];
  }, [pastPineaEvents]);

  const filteredPineaEvents = useMemo(() => {
    if (activeHostedTypes.length === 0) return pastPineaEvents;

    return pastPineaEvents.filter((event) => {
      const labels = [];
      if (event.hostedType) labels.push(getHostedTypeLabel(event.hostedType));
      if (event.highlight?.pinned) labels.push(PINNED_FILTER_LABEL);

      return labels.some((label) => activeHostedTypes.includes(label));
    });
  }, [activeHostedTypes, pastPineaEvents]);

  const groupedPineaEvents = useMemo(() => {
    const locale = language === "de" ? "de-DE" : "en-US";
    const sortedEvents = [...filteredPineaEvents].sort((a, b) => {
      const dateA = getEventDate(a)?.getTime() ?? -Infinity;
      const dateB = getEventDate(b)?.getTime() ?? -Infinity;
      return dateB - dateA;
    });

    return Object.entries(
      sortedEvents.reduce((acc, event) => {
        const date = getEventDate(event);
        const label = date
          ? new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date).toUpperCase()
          : "";

        (acc[label] ??= []).push(event);
        return acc;
      }, {}),
    );
  }, [filteredPineaEvents, language]);

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

      <Head className={filterStyles.filterHead} />

      {groupedPineaEvents.map(([dateLabel, events], groupIndex) => (
        <div className={styles.calendar_block} key={dateLabel}>
          <section className={`${styles.calendar} ${styles.countryCalendar}`}>
            {groupIndex !== 0 ? <h3 style={{ textTransform: "uppercase" }}>{dateLabel}</h3> : null}

            <div className={styles.calendar}>
              {groupIndex !== 0 ? <Head showLabels={false} /> : null}
              <ul>
                {events.map((event, index, array) => (
                  <Event key={event?._id || `${dateLabel}-${index}`} event={event} index={index} array={array} />
                ))}
              </ul>
            </div>
          </section>
        </div>
      ))}
    </main>
  );
};

export default PineaEvents;
