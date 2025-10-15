import styles from "./CalendarPage.module.css";
import Event from "@/components/Calendar/Event";
import { Head } from "@/components/Calendar/Head";
import { FilterHead } from "@/components/Calendar/Head";

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
      <ul className={styles.countries_filter} typo="h3">
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
    <main className={styles.main} typo="h4">
      <CountryFilter />
      <FilterHead events={events} className={styles.filterHead} />

      <section>
        <div className={styles.calendar}>
          <ul>
            {pinned.map((event, index) => {
              return <Event key={index} event={event} />;
            })}
          </ul>
        </div>
      </section>

      {Object.entries(eventsByCountry).map(([country, events]) => (
        <section key={country}>
          <h3>{country}</h3>

          <div className={styles.calendar}>
            <Head />
            <ul>
              {events.map((event, index) => (
                <Event key={index} event={event} />
              ))}
            </ul>
          </div>
        </section>
      ))}
    </main>
  );
};

export default CalendarPage;
