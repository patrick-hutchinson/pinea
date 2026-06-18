import { AnimatePresence, useInView, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Head } from "@/components/Calendar/Head";

import styles from "@/components/Calendar/Calendar.module.css";

import Event from "@/components/Calendar/Event";

import Button from "@/components/Buttons/Button";
const EVENTS_PER_PAGE = 20;

const CountrySection = ({
  country,
  events,
  isFirst = false,
  setCountryInView,
  header_height,
  filter_height,
  setCurrentlyInView,
}) => {
  const ref = useRef(null);
  const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);
  const visibleEvents = events.slice(0, visibleCount);
  const hasMoreEvents = visibleCount < events.length;

  const inView = useInView(ref, {
    margin: `-${header_height + filter_height + 100}px 0px -60% 0px`,
  });

  useEffect(() => {
    if (inView) {
      setCountryInView(country);
    }
  }, [inView]);

  useEffect(() => {
    setVisibleCount(EVENTS_PER_PAGE);
  }, [country, events]);

  return (
    <div className={`${styles.calendar_block} ${isFirst ? styles.firstArchiveCountry : ""}`}>
      <section className={`${styles.calendar} ${styles.countryCalendar}`}>
        <motion.h3 id={`country-${country}`} style={{ textTransform: "uppercase" }}>
          {country}
        </motion.h3>

        <div ref={ref} className={styles.calendar}>
          <Head showLabels={false} />
          <ul>
            <AnimatePresence initial={false}>
              {visibleEvents.map((event, index) => (
                <motion.li
                  key={event?._id || `${country}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Event
                    event={event}
                    index={index}
                    array={events}
                    setCurrentlyInView={setCurrentlyInView}
                    renderMode="plain"
                    archivePlaceholderIndex={index}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {hasMoreEvents ? (
            <Button
              type="button"
              className={styles.loadMoreButton}
              onClick={() => setVisibleCount((count) => Math.min(count + EVENTS_PER_PAGE, events.length))}
            >
              Load more
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default CountrySection;
