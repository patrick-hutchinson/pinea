"use client";

import styles from "./CalendarPage.module.css";
import Event from "@/components/Calendar/Event";
import { Head, FilterHead } from "@/components/Calendar/Head";
import Filters from "@/components/Filters";
import { useEffect, useState } from "react";

const CalendarPage = ({ events }) => {
  const [activeFilter, setActiveFilter] = useState();
  const [filteredEvents, setFilteredEvents] = useState(events);

  useEffect(() => {
    if (activeFilter) {
      const el = document.getElementById(`country-${activeFilter}`);
      if (el) {
        const offset = 150;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, [activeFilter]);

  function onSearch({ startDate, endDate }) {
    console.log("Range selected:", startDate, endDate);

    const from = new Date(`${startDate.month} 1, ${startDate.year}`);
    let to = new Date(`${endDate.month} 1, ${endDate.year}`);
    to.setMonth(to.getMonth() + 1);
    to.setDate(0); // last day of end month

    const filtered = events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate || event.startDate);

      console.log(start, to, end, from, "list");
      return start <= to && end >= from; // overlaps range
    });

    setFilteredEvents(filtered);
  }

  useEffect(() => {
    console.log(filteredEvents, "filteredEvents");
  }, [filteredEvents]);

  const pinned = events.filter((event) => event.pinned);
  const eventsByCountry = filteredEvents.reduce((acc, event) => {
    (acc[event.country.name] ??= []).push(event);
    return acc;
  }, {});
  const countries = Object.keys(eventsByCountry);

  return (
    <main className={styles.main} typo="h4">
      <Filters className={styles.countries_filter} array={countries} setActiveFilter={setActiveFilter} />
      <FilterHead events={events} className={styles.filterHead} onSearch={onSearch} />

      <section>
        <div className={styles.calendar}>
          <ul>
            {pinned.map((event, index, array) => (
              <Event key={index} event={event} index={index} array={array} />
            ))}
          </ul>
        </div>
      </section>

      {Object.entries(eventsByCountry).map(([country, events]) => (
        <section key={country}>
          <h3 id={`country-${country}`}>{country}</h3>
          <div className={styles.calendar}>
            <Head />
            <ul>
              {events.map((event, index) => (
                <Event key={index} event={event} index={index} array={events} />
              ))}
            </ul>
          </div>
        </section>
      ))}
    </main>
  );
};

export default CalendarPage;
