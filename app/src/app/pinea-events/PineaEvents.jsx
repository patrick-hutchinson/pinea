"use client";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import Event from "@/components/Calendar/Event";
import { Head } from "@/components/Calendar/Head";

import styles from "@/components/Calendar/Calendar.module.css";

const PineaEvents = ({ events }) => {
  const now = new Date();

  const isUpcoming = (event) => {
    const end = event.endDate ? new Date(event.endDate) : event.startDate ? new Date(event.startDate) : null;

    return end ? end >= now : true;
  };

  const hosted = events.filter((event) => event.highlight?.hosted && !isUpcoming(event));

  const array = ["Talks", "Releases", "Other"];

  return (
    <main className={styles.main} typo="h4">
      <FilterHeader array={array} className={styles.filter_header} />

      <Head />

      <section className={styles.calendar}>
        <div className={styles.calendar}>
          <ul>
            {hosted.map((event, index, array) => (
              <Event key={index} event={event} index={index} array={array} />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default PineaEvents;
