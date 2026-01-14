import { useInView, motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { Head } from "@/components/Calendar/Head";

import styles from "./CalendarPage.module.css";

import Event from "@/components/Calendar/Event";

const CountrySection = ({ country, events, setCountryInView, header_height, filter_height, setCurrentlyInView }) => {
  const ref = useRef(null);

  const inView = useInView(ref, {
    margin: `-${header_height + filter_height + 100}px 0px -60% 0px`,
  });

  useEffect(() => {
    if (inView) {
      setCountryInView(country);
    }
  }, [inView]);

  const currentEvents = events.filter((event) => event.endDate);

  return (
    <div className={styles.calendar_block}>
      <section className={styles.calendar}>
        <motion.h3 id={`country-${country}`} style={{ textTransform: "uppercase" }}>
          {country}
        </motion.h3>

        <div ref={ref} className={styles.calendar}>
          <Head />
          <ul>
            {events.map((event, index) => (
              <Event key={index} event={event} index={index} array={events} setCurrentlyInView={setCurrentlyInView} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default CountrySection;
