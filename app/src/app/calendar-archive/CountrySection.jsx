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
  const showPaginationButton = events.length > EVENTS_PER_PAGE;

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
    <div className={styles.calendar_block}>
      <section className={`${styles.calendar} ${styles.countryCalendar}`}>
        {!isFirst ? (
          <motion.h3 id={`country-${country}`} style={{ textTransform: "uppercase" }}>
            {country}
          </motion.h3>
        ) : null}

        <div ref={ref} className={styles.calendar}>
          {!isFirst ? <Head showLabels={false} /> : null}
          <ul>
            <AnimatePresence initial={false}>
              {visibleEvents.map((event, index) => (
                <motion.div
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
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </ul>
          {showPaginationButton ? (
            <Button
              type="button"
              className={styles.loadMoreButton}
              onClick={() => {
                if (hasMoreEvents) {
                  setVisibleCount((count) => Math.min(count + EVENTS_PER_PAGE, events.length));
                  return;
                }

                setVisibleCount(EVENTS_PER_PAGE);
              }}
            >
              {hasMoreEvents ? "Load more" : "Close"}
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default CountrySection;
