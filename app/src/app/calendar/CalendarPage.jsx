import styles from "./CalendarPage.module.css";
import { PlainEvent, PineaEvent, RecommendedEvent } from "@/components/Calendar/CalendarEvent";
import { CalendarHead } from "@/components/Calendar/CalendarHead";
import { FilterHead } from "@/components/Calendar/CalendarHead";

const CalendarPage = ({ events }) => {
  console.log(events[5], "events");

  const pinned = events.filter((event) => event.pinned);

  const eventsByCountry = events.reduce((acc, event) => {
    (acc[event.country.name] ??= []).push(event);
    return acc;
  }, {});

  const countries = Object.keys(eventsByCountry);

  const CountryFilter = () => {
    return (
      <ul className={styles.countries_filter}>
        {countries.map((country, index) => (
          <li key={index}>
            <span>{country}</span>
            <span>{index < countries.length - 1 && ", "}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <main className={`${styles.main} ff4`}>
      <CountryFilter />
      <FilterHead events={events} className={styles.filterHead} />

      <section>
        <div className={styles.calendar}>
          <ul>
            {pinned.map((event, index) => {
              return <PineaEvent key={index} event={event} />;
            })}
          </ul>
        </div>
      </section>

      {Object.entries(eventsByCountry).map(([country, events]) => (
        <section key={country}>
          <h3>{country}</h3>

          <div className={styles.calendar}>
            <CalendarHead />
            <ul>
              {events.map((event, index) => {
                return event.recommendations ? (
                  <RecommendedEvent key={index} event={event} />
                ) : (
                  <PlainEvent key={index} event={event} />
                );
              })}
            </ul>
          </div>
        </section>
      ))}
    </main>
  );
};

export default CalendarPage;
