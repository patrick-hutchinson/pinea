"use client";

import styles from "./CalendarPage.module.css";
import Event from "@/components/Calendar/Event";
import { Head, CalendarFilter } from "@/components/Calendar/Head";
import FilterHeader from "@/components/FilterHeader";
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

  const onSearch = (params) => {
    if (!params || !params.startDate || !params.endDate) {
      // Reset case → clear filters
      setFilteredEvents(events);
      return;
    }

    const { startDate, endDate } = params;

    const startMonth = startDate.month;
    const endMonth = endDate.month;
    const startYear = startDate.year;
    const endYear = endDate.year;
    console.log("Range selected:", startDate, endDate);

    const from = new Date(`${startMonth} 1, ${startYear}`);
    let to = new Date(`${endMonth} 1, ${endYear}`);
    to.setMonth(to.getMonth() + 1);
    to.setDate(0); // last day of end month

    const filtered = events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate || event.startDate);

      console.log(start, to, end, from, "list");
      return start <= to && end >= from; // overlaps range
    });

    setFilteredEvents(filtered);
  };

  const hosted = events.filter((event) => event.highlight?.hosted);
  const eventsByCountry = filteredEvents.reduce((acc, event) => {
    (acc[event.location.country.name] ??= []).push(event);
    return acc;
  }, {});
  const countries = Object.keys(eventsByCountry).sort((a, b) => a.localeCompare(b));

  return (
    <main className={styles.main} typo="h4">
      <FilterHeader className={styles.countries_filter} array={countries} setActiveFilter={setActiveFilter} />
      <CalendarFilter events={events} className={styles.filterHead} onSearch={onSearch} />

      <section>
        <div className={styles.calendar}>
          <ul>
            {hosted.map((event, index, array) => (
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
