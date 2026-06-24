"use client";

import { useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import Event from "@/components/Calendar/Event";
import { Head } from "@/components/Calendar/Head";
import { LanguageContext } from "@/context/LanguageContext";

import styles from "@/components/Calendar/Calendar.module.css";
import filterStyles from "@/components/Calendar/CalendarFilter/CalendarFilter.module.css";

const fadeTransition = { duration: 0.3, ease: "easeInOut" };

const getEventDate = (event) => {
  const date = event.endDate || event.startDate;
  const parsedDate = date ? new Date(date) : null;
  return parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;
};

const getCategoryLabel = (event, language) => {
  const title = event?.type?.title;
  if (typeof title === "string") return title;
  if (!Array.isArray(title)) return "";

  const translations = title.filter(Boolean);
  const translation =
    translations.find((item) => item._key === language) ||
    translations.find((item) => item._key === "en") ||
    translations.find((item) => item._key === "de");

  return translation?.value || "";
};

const PineaEvents = ({ events, page }) => {
  const { language } = useContext(LanguageContext);
  const blurPlaceholders = Array.isArray(page?.blurPlaceholders) ? page.blurPlaceholders : [];
  const [activeCategories, setActiveCategories] = useState([]);
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
    const existingCategories = new Set(pastPineaEvents.map((event) => getCategoryLabel(event, language)).filter(Boolean));

    return [...existingCategories].sort((a, b) => a.localeCompare(b, language));
  }, [language, pastPineaEvents]);

  const filteredPineaEvents = useMemo(() => {
    if (activeCategories.length === 0) return pastPineaEvents;

    return pastPineaEvents.filter((event) => {
      const categoryLabel = getCategoryLabel(event, language);
      return categoryLabel ? activeCategories.includes(categoryLabel) : false;
    });
  }, [activeCategories, language, pastPineaEvents]);

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
    setActiveCategories((prev) => {
      if (prev.includes(filter)) return prev.filter((item) => item !== filter);
      return [...prev, filter];
    });
  };

  const mainClassName = `${styles.main} ${styles.pineaEventsMain} ${
    filteredPineaEvents.length === 1 ? styles.singlePineaEvent : ""
  }`;

  return (
    <main className={mainClassName} typo="h4">
      <FilterHeader
        array={filterLabels}
        handleFilter={handleFilter}
        currentlyActive={activeCategories}
        className={styles.filter_header}
      />

      <Head className={filterStyles.filterHead} />

      <AnimatePresence initial={false}>
        {groupedPineaEvents.map(([dateLabel, events], groupIndex) => (
          <motion.div
            className={styles.calendar_block}
            key={dateLabel}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
          >
            <section className={`${styles.calendar} ${styles.countryCalendar}`}>
              {groupIndex !== 0 ? <h3 style={{ textTransform: "uppercase" }}>{dateLabel}</h3> : null}

              <div className={styles.calendar}>
                {groupIndex !== 0 ? <Head showLabels={false} /> : null}
                <ul>
                  <AnimatePresence initial={false}>
                    {events.map((event, index, array) => (
                      <motion.div
                        key={event?._id || `${dateLabel}-${index}`}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={fadeTransition}
                      >
                        <Event event={event} index={index} array={array} blurPlaceholders={blurPlaceholders} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            </section>
          </motion.div>
        ))}
      </AnimatePresence>
    </main>
  );
};

export default PineaEvents;
